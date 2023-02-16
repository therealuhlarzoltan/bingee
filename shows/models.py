from django.db import models

# Create your models here.

class Series(models.Model):
    title = models.CharField(max_length=128)
    title_id = models.CharField(max_length=64, unique=True)
