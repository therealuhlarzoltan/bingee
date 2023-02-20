from rest_framework import serializers

from .models import Episode, Series


class SeriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Series
        fields = ["title", "title_id", "image"]

class EpisodeSerializer(serializers.ModelSerializer):
    series = SeriesSerializer()
    season = serializers.SerializerMethodField(read_only=True)
    episode = serializers.SerializerMethodField(read_only=True)
    episode_id = serializers.CharField(read_only=True)
    episode_title = serializers.CharField(read_only=True)


    class Meta:
        model = Episode
        fields = ["episode_id", "episode_title", "season", "episode", "series"]

    
    def get_episode(self, obj):
        episode = str(obj.episode)
        episode_string = ""
        if len(episode) == 1:
            episode_string = f"0{episode}"
        else:
            episode_string = episode
        
        return episode_string

    
    def get_season(self, obj):
        seasons = str(obj.season.season)
        season_string = ""
        if len(seasons) == 1:
            season_string = f"0{seasons}"
        else:
            season_string = seasons
        
        return season_string