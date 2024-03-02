from django.urls import path
from users.views import (
    get_ecdsa_jwks,
    login,
    logout,
    get_user,
    add_courses,
    remove_courses,
    get_courses,
    get_friends,
    send_friend_request,
    get_pending_friend_requests,
    respond_to_friend_request,
)

urlpatterns = [
    path("jwks", get_ecdsa_jwks),
    path("login", login),
    path("logout", logout),
    path("user", get_user),
    path("courses/add", add_courses),
    path("courses/remove", remove_courses),
    path("courses", get_courses),
    path("friends", get_friends),
    path("friends/request", send_friend_request),
    path("friends/pending", get_pending_friend_requests),
    path("friends/respond", respond_to_friend_request),
]
