from django.db import models
from shows.models import Series, Episode
from accounts.models import Profile

from django.core.validators import MaxValueValidator, MinValueValidator

from django.db.models import Avg

class EpisodeComment(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, default=0)
    text = models.TextField(max_length=300)
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE, blank=True, null=True, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)


class SeriesComment(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, default=0)
    text = models.TextField(max_length=300)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, blank=True, null=True, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)


class SeriesRating(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, default=0)
    rating = models.PositiveSmallIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(10)])
    series = models.ForeignKey(Series, on_delete=models.CASCADE, blank=True, null=True, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        rating = SeriesRating.objects.filter(series=self.series).aggregate(Avg("rating"))
        self.series.rating = rating.get("rating__avg")
        self.series.save()


class EpisodeRating(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, default=0)
    rating = models.PositiveSmallIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(10)])
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE, blank=True, null=True, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(args, kwargs)
        rating = EpisodeRating.objects.filter(episode=self.episode).aggregate(Avg("rating"))
        self.episode.rating = rating
        self.episode.save()