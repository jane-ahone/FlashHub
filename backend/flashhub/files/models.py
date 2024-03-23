from django.db import models
from schools.models import Course
from users.models import User


class FileOrDirectory(models.TextChoices):
    FILE = "FILE", "File"
    DIRECTORY = "DIRECTORY", "Directory"


class FileType(models.TextChoices):
    PDF = "PDF", "PDF"
    DOC = "DOC", "DOC"
    DOCX = "DOCX", "DOCX"
    PPT = "PPT", "PPT"
    PPTX = "PPTX", "PPTX"
    XLS = "XLS", "XLS"
    XLSX = "XLSX", "XLSX"
    TXT = "TXT", "TXT"
    ZIP = "ZIP", "ZIP"
    JPG = "JPG", "JPG"
    JPEG = "JPEG", "JPEG"
    PNG = "PNG", "PNG"
    GIF = "GIF", "GIF"
    MP4 = "MP4", "MP4"
    MOV = "MOV", "MOV"
    AVI = "AVI", "AVI"
    MKV = "MKV", "MKV"
    MP3 = "MP3", "MP3"
    WAV = "WAV", "WAV"
    FLAC = "FLAC", "FLAC"
    OGG = "OGG", "OGG"
    FLASHCARD = "FLASHCARD", "Flashcard"
    OTHER = "OTHER", "Other"


class FileVisibility(models.TextChoices):
    PUBLIC = "PUBLIC", "Public"
    PRIVATE = "PRIVATE", "Private"
    FRIENDS = "FRIENDS", "Friends"


class Directory(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent_directory = models.ForeignKey(
        "self", on_delete=models.CASCADE, blank=True, null=True
    )
    visibility = models.CharField(
        max_length=100, choices=FileVisibility.choices, default=FileVisibility.PRIVATE
    )

    indexes = [
        models.Index(fields=["user", "parent_directory"]),
        models.Index(fields=["parent_directory"]),
    ]

    def __str__(self):
        return self.name


# Create your models here.
class File(models.Model):
    name = models.CharField(max_length=100)
    file_type = models.CharField(
        max_length=100, choices=FileType.choices, default=FileType.OTHER
    )
    file = models.FileField(upload_to="files/", blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent_directory = models.ForeignKey(
        Directory, on_delete=models.CASCADE, blank=True, null=True
    )
    visibility = models.CharField(
        max_length=100, choices=FileVisibility.choices, default=FileVisibility.PRIVATE
    )

    indexes = [
        models.Index(fields=["user", "parent_directory"]),
        models.Index(fields=["parent_directory"]),
    ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.file_or_directory == FileOrDirectory.DIRECTORY:
            self.directory_id = f"{self.__class__.__name__}-{self.id}"
            self.file_type = FileType.OTHER
            self.file = None
        else:
            self.directory_id = None

        super(File, self).save(*args, **kwargs)
