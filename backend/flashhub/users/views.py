import jwt
from rest_framework.decorators import api_view
from users.models import FriendRequestStatus, Friends, User, UserCourses, UserToken
from schools.models import Course, School
from utils import (
    WAIT_DAYS_AFTER_FRIEND_REQUEST,
    get_ecdsa_jwt_public_key,
    get_jwt_keys,
    JWT_ISSUER,
    get_validated_request_user,
    notify_user,
)
from rest_framework.response import Response
from dotenv import load_dotenv
import os
from google.oauth2 import id_token
from google.auth.transport import requests
import base64
from datetime import datetime, timezone
from ecdsa import VerifyingKey


# Create your views here.
@api_view(["GET"])
def get_ecdsa_jwks(_request):
    """
    Returns the public key used to verify JWTs\n
    Request is a json object with no keys
    """
    vk: VerifyingKey = get_ecdsa_jwt_public_key()

    x, y = vk.pubkey.point.x(), vk.pubkey.point.y()

    x_coord = base64.urlsafe_b64encode(x.to_bytes(32, "big")).decode("utf-8")
    y_coord = base64.urlsafe_b64encode(y.to_bytes(32, "big")).decode("utf-8")

    jwks = {
        "keys": [
            {
                "alg": "ES256",
                "kty": "EC",
                "crv": "P-256",
                "use": "sig",
                "kid": "1",
                "x": x_coord.rstrip("="),
                "y": y_coord.rstrip("="),
            }
        ]
    }

    return Response(jwks)


@api_view(["POST"])
def login(request):  # currently only via google OAuth2
    """
    Returns a JWT token used to authenticate requests\n
    request is a json object with the following keys: \n
    `jwt` : `str` jwt token issued by google OAuth2
    """
    load_dotenv()
    google_client_id = os.getenv("GOOGLE_OAUTH2_CLIENT_ID")

    request_jwt = request.data.get("jwt")
    if not request_jwt:
        return Response({"error": "No JWT provided"}, status=400)

    try:
        id_info = id_token.verify_oauth2_token(
            request_jwt, requests.Request(), google_client_id
        )
        if id_info["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer")
        user_id = id_info["sub"]
        email = id_info["email"].lower()
        first_name = id_info["given_name"].capitalize()
        last_name = id_info["family_name"].capitalize()
        picture = id_info["picture"]
        email_domain = id_info["hd"].lower()

        # check if user exists and create if not
        user = User.objects.filter(email=email)
        if not user:
            username_prefix = email.split("@")[0] + "#"
            last_user = (
                User.objects.filter(username__startswith=username_prefix)
                .order_by("-username")
                .first()
            )
            if last_user:
                username = f"{username_prefix}{int(last_user.username.split(username_prefix)[1]) + 1}"
            else:
                username = f"{username_prefix}0"

            school = School.objects.get(email_domain=email_domain)

            # if not school:
            #     return Response({'error': 'Sorry, Your School is not yet supported by FlashHub. Stay Tuned!!'}, status=404)

            user = User(
                first_name=first_name,
                last_name=last_name,
                email=email,
                profile_url=picture,
                username=username,
                school=school,
            )

            user.save()
        else:
            user = user[0]

        # create token
        now = datetime.now(tz=timezone.utc).timestamp()

        resp_obj = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "user_type": user.user_type,
            "exp": now + 2 * 60,
            "iat": now,
            "iss": JWT_ISSUER,
            "aud": JWT_ISSUER,
        }

        sk, _ = get_jwt_keys()
        token = jwt.encode(
            resp_obj,
            sk,
            algorithm="ES256",
        )

        # save tokens upto a maximum of 3 tokens, delete the oldest if more than 3
        user_tokens = UserToken.objects.filter(user=user).order_by("-created_at")
        if len(user_tokens) >= 3:
            user_tokens[-1].delete()

        user_token = UserToken(user=user, token=token)
        user_token.save()

        return Response({"token": token})
    except ValueError as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def logout(request):
    """
    Logs out the user by deleting the jwt token.\n
    Client should delete the token from local storage or cookies too\n
    request is a json object with the following keys: \n
    `jwt` : `str` -> jwt token issued by flashhub
    """

    request_jwt = request.data.get("jwt")
    if not request_jwt:
        return Response({"error": "No JWT provided"}, status=400)

    UserToken.objects.get(token=request_jwt).delete()
    return Response({"message": "Logged out successfully"})


@api_view(["POST"])
def get_user(request):
    """
    Returns the user's details\n
    request is a json object with the following keys: \n
    `jwt` : `str` -> jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)
        courses = UserCourses.objects.filter(user=user)
        friends_count = (
            Friends.objects.filter(
                requester=user, status=FriendRequestStatus.ACCEPTED
            ).count()
            + Friends.objects.filter(
                receiver=user, status=FriendRequestStatus.ACCEPTED
            ).count()
        )
        pending_sent_requests = Friends.objects.filter(
            requester=user, status=FriendRequestStatus.PENDING
        ).count()
        pending_received_requests = Friends.objects.filter(
            receiver=user, status=FriendRequestStatus.PENDING
        ).count()
        return Response(
            {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": user.phone,
                "username": user.username,
                "email": user.email,
                "user_type": user.user_type,
                "school": user.school.name,
                "profile_url": user.profile_url,
                "courses": [
                    {"id": course.course.id, "name": course.course.name}
                    for course in courses
                ],
                "friends_count": friends_count,
                "pending_sent_requests": pending_sent_requests,
                "pending_received_requests": pending_received_requests,
            }
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def add_courses(request):
    """
    Adds courses to the user's list of courses\n
    request is a json object with the following keys: \n
    `course_codes` : `str[]` -> code of the courses to be added
    `jwt` : `str` -> jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)
        course_codes = [
            course_code.strip().lower()
            for course_code in request.data.get("course_codes")
        ]
        school = user.school
        for course_code in course_codes:
            course = Course.objects.get(school=school, course_code=course_code)
            if not course:
                course = Course(
                    name=course_code,
                    description="No Description Yet",
                    school=school,
                    course_code=course_code,
                )
                course.save()
            if UserCourses.objects.filter(user=user, course=course):
                return Response({"message": "Course already added"})
            user_course = UserCourses(user=user, course=course)
            user_course.save()
        return Response({"message": "Course added successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def remove_courses(request):
    """
    Removes courses from the user's list of courses\n
    request is a json object with the following: \n
    `course_ids` : `int[]` -> ids of the courses to be removed
    `jwt` : `str` -> jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)
        course_ids = request.data.get("course_ids")

        # validate course ids
        valid_courses = UserCourses.objects.filter(user=user, course__id__in=course_ids)
        if len(valid_courses) != len(course_ids):
            course_id_set = set(course_ids)
            valid_course_id_set = {course.course.id for course in valid_courses}
            invalid_course_ids = course_id_set - valid_course_id_set
            return Response(
                {"error": f"Invalid course ids: {invalid_course_ids}"}, status=400
            )

        valid_courses.delete()

        return Response({"message": "Courses removed successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def get_courses(request):
    """
    Returns the list of courses the user is enrolled in\n
    request is a json object with the following keys: \n
    `jwt` : `str` -> jwt token issued by flashhub
    """

    try:
        user = get_validated_request_user(request)
        courses = UserCourses.objects.filter(user=user)
        return Response(
            [
                {
                    "id": course.course.id,
                    "name": course.course.name,
                    "course_code": course.course.course_code,
                    "description": course.course.description,
                }
                for course in courses
            ]
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def get_friends(request):
    """
    Returns the list of friends the user has\n
    request is a json object with the following keys: \n
    `jwt` : `str` -> jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)

        friends = Friends.objects.filter(
            requester=user, status=FriendRequestStatus.ACCEPTED
        ) | Friends.objects.filter(receiver=user, status=FriendRequestStatus.ACCEPTED)
        friends_list = []
        for friend in friends:
            friend_user = (
                friend.receiver if friend.requester == user else friend.requester
            )
            friends_list.append(
                {
                    "id": friend_user.id,
                    "first_name": friend_user.first_name,
                    "last_name": friend_user.last_name,
                    "username": friend_user.username,
                    "school": friend_user.school.name,
                    "profile_url": friend_user.profile_url,
                    "user_type": friend_user.user_type,
                }
            )

        return Response(friends_list)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def send_friend_request(request):
    """
    Sends a friend request to another user\n
    request is a json object with the following keys:\n
    `username` : username of the friend to send request to
    jwt : jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)
        friend_username = request.data.get("username")
        if friend_username == user.username:
            return Response(
                {"error": "You cannot send a friend request to yourself"}, status=400
            )
        friend = User.objects.get(username=friend_username)
        if Friends.objects.filter(
            requester=user, receiver=friend, status=FriendRequestStatus.PENDING
        ) or Friends.objects.filter(
            receiver=user, requester=friend, status=FriendRequestStatus.PENDING
        ):
            return Response({"message": "Friend request already sent"})
        if Friends.objects.filter(
            requester=user, receiver=friend, status=FriendRequestStatus.ACCEPTED
        ) or Friends.objects.filter(
            receiver=user, requester=friend, status=FriendRequestStatus.ACCEPTED
        ):
            return Response({"message": "You are already friends"})

        # if user already has a pending request from the friend, accept it
        pending_request = Friends.objects.filter(
            requester=friend, receiver=user, status=FriendRequestStatus.PENDING
        )
        if pending_request:
            pending_request.status = FriendRequestStatus.ACCEPTED
            pending_request.save()
            notify_user(
                friend,
                f"{user.first_name} {user.last_name} has accepted your friend request",
            )
            notify_user(
                user, f"{friend.first_name} {friend.last_name} and you are now friends"
            )
            return Response(
                {
                    "message": "You are now friends, since you already had a pending request from this user"
                }
            )

        # if friend had rejected this request in the past WAIT_DAYS_AFTER_FRIEND_REQUEST days, throw an error
        rejected_request = (
            Friends.objects.filter(
                requester=user, receiver=friend, status=FriendRequestStatus.REJECTED
            )
            .order_by("-updated_at")
            .first()
        )
        days_since_rejected = (
            datetime.now(timezone.utc) - rejected_request.updated_at
            if rejected_request
            else 0
        ).days
        if rejected_request and days_since_rejected < WAIT_DAYS_AFTER_FRIEND_REQUEST:
            return Response(
                {
                    "error": f"You cannot send a friend request to this user for the next {WAIT_DAYS_AFTER_FRIEND_REQUEST - days_since_rejected} days"
                },
                status=400,
            )

        friend_request = Friends(
            requester=user, receiver=friend, status=FriendRequestStatus.PENDING
        )
        friend_request.save()
        return Response({"message": "Friend request sent successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def get_pending_friend_requests(request):
    """
    Returns the list of pending friend requests, either `sent` or `received` \n
    request is a json object with the following keys: \n
    `type` : `sent` or `received`
    `jwt` : `str` -> jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)
        if request.data.get("type") == "sent":
            pending_requests = Friends.objects.filter(
                requester=user, status=FriendRequestStatus.PENDING
            )
        elif request.data.get("type") == "received":
            pending_requests = Friends.objects.filter(
                receiver=user, status=FriendRequestStatus.PENDING
            )
        else:
            return Response({"error": "Invalid request type"}, status=400)
        pending_requests_list = []
        for request in pending_requests:
            pending_requests_list.append(
                {
                    "id": request.id,
                    "requester": {
                        "id": request.requester.id,
                        "first_name": request.requester.first_name,
                        "last_name": request.requester.last_name,
                        "username": request.requester.username,
                        "school": request.requester.school.name,
                        "profile_url": request.requester.profile_url,
                        "user_type": request.requester.user_type,
                    },
                }
            )
        return Response(pending_requests_list)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def respond_to_friend_request(request):
    """
    Responds to a friend request \n
    request is a json object with the following keys: \n
    `request_id` : id of the friend request
    `response` : `accept` or `reject`
    `jwt` : `str` -> jwt token issued by flashhub
    """
    try:
        user = get_validated_request_user(request)
        request_id = request.data.get("request_id")
        response = request.data.get("response")
        friend_request = Friends.objects.get(id=request_id)
        if not friend_request:
            return Response({"error": "Invalid request id"}, status=400)
        if friend_request.receiver != user:
            return Response(
                {"error": "You are not the receiver of this request"}, status=400
            )
        if response == "accept":
            friend_request.status = FriendRequestStatus.ACCEPTED
            friend_request.save()
            notify_user(
                friend_request.requester,
                f"{user.first_name} {user.last_name} has accepted your friend request",
            )
            return Response({"message": "Friend request accepted"})
        elif response == "reject":
            friend_request.status = FriendRequestStatus.REJECTED
            friend_request.save()
            notify_user(
                friend_request.requester,
                f"{user.first_name} {user.last_name} has rejected your friend request. You can send a new friend request to this user after {WAIT_DAYS_AFTER_FRIEND_REQUEST} days",
            )
            return Response({"message": "Friend request rejected"})
        else:
            return Response({"error": "Invalid response"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
