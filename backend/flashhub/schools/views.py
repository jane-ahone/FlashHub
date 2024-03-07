from django.shortcuts import render
import jwt
from rest_framework.decorators import api_view
from schools.models import Course, School
from users.models import FriendRequestStatus, Friends, User, UserCourses, UserToken
from utils import (
    WAIT_DAYS_AFTER_FRIEND_REQUEST,
    get_ecdsa_jwt_public_key,
    get_jwt_keys,
    JWT_ISSUER,
    get_validated_request_user,
    get_valid_decoded_flashub_jwt,
    get_request_jwt,
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


@api_view(["POST"])
def dev_setup(_request):

    # create first school (kent state)

    if School.objects.filter(email_domain="kent.edu"):
        return Response({"message": "Setup already completed"})

    kent_state = School.objects.create(
        name="Kent State University",
        address="800 E Summit St",
        city="Kent",
        state="OH",
        zip="44240",
        phone="330-672-3000",
        email="admin@kent.edu",
        website="https://www.kent.edu/",
        email_domain="kent.edu",
    )

    # create first course (cs1)
    cs1 = Course.objects.create(
        name="CS1",
        description="Introduction to Computer Science",
        school=kent_state,
        course_code="CS1",
    )

    return Response({"message": "Setup complete"})
