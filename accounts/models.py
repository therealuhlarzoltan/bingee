from django.db import models
from django.contrib.auth.models import AbstractUser

from django.conf import settings

# Create your models here.
class CustomUser(AbstractUser):
    birth_date = models.DateField(null=True)
    gender = models.CharField(max_length=2, choices=settings.GENDER_CHOICES, default="M")
    country = models.CharField(max_length=2, choices=settings.COUNTRY_CHOICES, default="US")

    REQUIRED_FIELDS =['email', 'password', 'birth_date', 'gender', 'country', 'first_name', 'last_name']
