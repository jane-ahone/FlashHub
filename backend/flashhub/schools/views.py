from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from schools.models import Course, School
from rest_framework.response import Response

# Create your views here.


@api_view(["POST"])
def dev_setup(_request: Request) -> Response:

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
