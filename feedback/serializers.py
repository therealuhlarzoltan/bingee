from rest_framework import serializers

from .models import SeriesComment, EpisodeComment, SeriesRating, EpisodeRating

from shows.models import Episode, Series
from accounts.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ["id", "username", "number_of_shows", "number_of_episodes", "date_of_last_watch"]


class EpisodeRatingCreateSerializer(serializers.ModelSerializer):
    
    episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all())

    class Meta:
        model = EpisodeRating
        fields = ["rating", "profile", "episode", "timestamp"]


class SeriesRatingCreateSerializer(serializers.ModelSerializer):
        
    series = serializers.PrimaryKeyRelatedField(queryset=Series.objects.all())

    class Meta:
        model = SeriesRating
        fields = ["rating", "profile", "series", "timestamp"]


class SeriesRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = SeriesRating
        fields = ["rating", "profile", "timestamp"]


class EpisodeCommentCreateSerializer(serializers.ModelSerializer):
    
    episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all())

    class Meta:
        model = EpisodeComment
        fields = ["text", "profile", "episode", "timestamp"]


class SeriesCommentCreateSerializer(serializers.ModelSerializer):
        
    series = serializers.PrimaryKeyRelatedField(queryset=Series.objects.all())

    class Meta:
        model = SeriesComment
        fields = ["text", "profile", "series", "timestamp"]


class EpisodeCommentSerializer(serializers.ModelSerializer):
    
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = EpisodeComment
        fields = ["profile", "text", "timestamp"]


class SeriesCommentSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = SeriesComment
        fields = ["profile", "text", "timestamp"]

    

