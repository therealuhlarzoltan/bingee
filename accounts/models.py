from django.db import models
from django.contrib.auth.models import AbstractUser

from django.conf import settings

# Create your models here.
class CustomUser(AbstractUser):
    birth_date = models.DateField(),
    country = models.CharField(max_length=2, choices=settings.COUNTRY_CHOICES, default="US"),
    gender = models.CharField(max_length=6, choices=settings.GENDER_CHOICES, default="M")

    REQUIRED_FIELDS = ['birth_date', 'country', 'gender', 'first_name', 'last_name', 'email']