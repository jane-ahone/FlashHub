from django.db import models
from users.models import User
from files.models import FileType

class MessageStatus(models.TextChoices):
    SENT = 'SENT', 'Sent'
    READ = 'READ', 'Read'
    # FAILED = 'FAILED', 'Failed'

# Create your models here.
class Message(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author + " : " + self.text

class Attachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    file = models.FileField(upload_to='attachments/', blank=True, null=True)
    file_type = models.CharField(max_length=100, choices=FileType.choices, default=FileType.OTHER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.message + " : " + self.file

class PrivateMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    recipeint = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipeint')
    status = models.CharField(max_length=100, choices=MessageStatus.choices, default=MessageStatus.SENT)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.sender + " : " + self.receiver + " : " + self.text

# class GroupMessage(models.Model): # We still need to think about implementation of group messaging.

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.author + " : " + self.message