import uuid
import random
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.conf import settings



def generate_username():
    number = random.randint(0, 9999999)
    qs = Profile.objects.filter(username=f"user{number}")
    if qs.exists():
        return generate_username()
    else:
        return f"user{number}"


# Create your models here.
class CustomUser(AbstractUser):
    birth_date = models.DateField(null=True)
    gender = models.CharField(max_length=2, choices=settings.GENDER_CHOICES, default="M")
    country = models.CharField(max_length=2, choices=settings.COUNTRY_CHOICES, default="US")

    REQUIRED_FIELDS =['email', 'password', 'birth_date', 'gender', 'country', 'first_name', 'last_name']


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.OneToOneField("CustomUser", on_delete=models.CASCADE, related_name="profile")
    username = models.CharField(max_length=32, default=generate_username, null=False, blank=False, unique=True)
    shows_added = models.ManyToManyField("shows.Series")
    number_of_shows = models.PositiveSmallIntegerField(default=0)
    number_of_episodes = models.PositiveSmallIntegerField(default=0)
    date_of_last_watch = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"@{self.username}"
