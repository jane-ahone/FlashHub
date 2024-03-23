from django.db import models


# Create your models here.
class School(models.Model):
    name = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    website = models.URLField(max_length=100)
    email_domain = models.CharField(max_length=100)
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)

    indexes = [models.Index(fields=["email_domain"])]

    def __str__(self):
        return self.name


class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    course_code = models.CharField(max_length=100)

    indexex = [
        models.Index(fields=["school", "course_code"]),
        models.Index(fields=["school", "name"]),
    ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.directory_id = f"{self.__class__.__name__}-{self.id}"
        super(Course, self).save(*args, **kwargs)
