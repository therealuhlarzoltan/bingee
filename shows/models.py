from django.db import models
from django.contrib.auth import get_user_model

user_model = get_user_model()

# Create your models here.

class Series(models.Model):
    title = models.CharField(max_length=128, default="")
    title_id = models.CharField(max_length=64, unique=True, default="")


class Profile(models.Model):
    user = models.OneToOneField(user_model, on_delete=models.CASCADE, primary_key=True)
    shows_added = models.ManyToManyField(Series)
    number_of_shows = models.PositiveSmallIntegerField(default=0)
    number_of_episodes = models.PositiveSmallIntegerField(default=0)
    date_of_last_watch = models.DateField(blank=True, null=True)


class Season(models.Model):
    season = models.PositiveSmallIntegerField(default=0)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True)


class Episode(models.Model):
    episode = models.PositiveSmallIntegerField(default=0)
    episode_id = models.CharField(max_length=128, default="")
    episode_title = models.CharField(max_length=128, default="")
    year = models.PositiveBigIntegerField(default=0)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, null=True)