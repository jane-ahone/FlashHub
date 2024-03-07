from django.urls import path
from schools.views import dev_setup

urlpatterns = [
    path("dev_setup", dev_setup),
]

