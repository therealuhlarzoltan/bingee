from django.db import models
from django.contrib.auth import get_user_model

import datetime

user_model = get_user_model()

# Create your models here.

class SeriesManager(models.Manager):
    def havent_started_yet(self, user):
        profile = user.profile
        watched = WatchedEpisode.objects.filter(profile=profile)
        shows = profile.shows_added.exclude(id__in=[show.series_id for show in watched])
        return shows
    
    def currently_watching(self, user):
        profile = user.profile
        watched = WatchedEpisode.objects.filter(profile=profile, timestamp__range=((datetime.date.today() - datetime.timedelta(days=30)), datetime.datetime.now()))
        shows = profile.shows_added.filter(id__in=[show.series_id for show in watched])
        return shows

    def havent_watched_for_a_while(self, user):
        profile = user.profile
        watched = WatchedEpisode.objects.filter(profile=profile).exclude(timestamp__range=((datetime.date.today() - datetime.timedelta(days=30)), datetime.datetime.now()))
        shows = profile.shows_added.filter(id__in=[show.series_id for show in watched])
        return shows
    
    def find_next_episode(self, user, series):
        profile = user.profile
        watched = WatchedEpisode.objects.filter(profile=profile, series=series)
        episodes = Episode.objects.filter(series=series)
        if watched.exists():
            last_watched = watched.last().episode
            next_in_season = episodes.filter(season=last_watched.season, episode=(last_watched.episode + 1))
            if next_in_season.exists():
                return next_in_season.first()
            next_season = series.seasons.filter(season=(last_watched.season.season + 1))
            if next_season.exists():
                return next_season.first().episodes.first()
            return None
        else:
            return series.seasons.first().episodes.first()

class Series(models.Model):
    title = models.CharField(max_length=128, default="")
    title_id = models.CharField(max_length=64, unique=True, default="")
    image = models.URLField(null=True)
    objects = SeriesManager()

    def __str__(self):
        return self.title

class Profile(models.Model):
    user = models.OneToOneField(user_model, on_delete=models.CASCADE, primary_key=True)
    shows_added = models.ManyToManyField(Series)
    number_of_shows = models.PositiveSmallIntegerField(default=0)
    number_of_episodes = models.PositiveSmallIntegerField(default=0)
    date_of_last_watch = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"@{self.user.username}"


class Season(models.Model):
    season = models.PositiveSmallIntegerField(default=0)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, related_name="seasons")

    def __str__(self):
        return f"{self.series.title} Season {self.season}"

    class Meta:
        ordering = ["season"]


class Episode(models.Model):
    episode = models.PositiveSmallIntegerField(default=0)
    episode_id = models.CharField(max_length=128, default="")
    episode_title = models.CharField(max_length=128, default="")
    year = models.PositiveBigIntegerField(default=0)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, null=True, related_name="episodes")

    def __str__(self):
        return f"{self.episode_title} ({self.series.title})"

    class Meta:
        ordering = ["episode"]


class WatchedEpisode(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    series = models.ForeignKey(Series, on_delete=models.CASCADE)
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile} ---> {self.episode}"

    class Meta:
        ordering = ["episode__season__season", "episode__episode"]


class EpisodeComment(models.Model):
    pass


class SeriesComment(models.Model):
    pass