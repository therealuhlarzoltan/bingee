from rest_framework import serializers

from .models import SeriesComment, EpisodeComment, SeriesRating, EpisodeRating

from shows.models import Episode, Series
from accounts.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ["id", "username", "number_of_shows", "number_of_episodes", "date_of_last_watch"]


class EpisodeRatingSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = EpisodeRating
        fields = ["rating", "profile", "timestamp", "id"]


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

    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = SeriesRating
        fields = ["rating", "profile", "timestamp", "id"]


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
    isLiked = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    areReplies = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = EpisodeComment
        fields = ["profile", "text", "timestamp", "id", "isLiked", "likes", "areReplies"]

    def get_isLiked(self, obj):
        return obj.profile in obj.likes.all()

    def get_likes(self, obj):
        return obj.likes.all().count()

    def get_areReplies(self, obj):
        return obj.likes.all().count() != 0


class SeriesCommentSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(read_only=True)
    isLiked = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    areReplies = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = SeriesComment
        fields = ["profile", "text", "timestamp", "id", "isLiked", "likes", "areReplies"]

    def get_isLiked(self, obj):
        return obj.profile in obj.likes.all()

    def get_likes(self, obj):
        return obj.likes.all().count()

    def get_areReplies(self, obj):
        return obj.likes.all().count() != 0

    

