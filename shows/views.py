from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework import status

from .utils import make_request, add_series_to_database

from .models import Series, Episode, WatchedEpisode
from accounts.models import Profile

from .serializers import EpisodeSerializer

import json

# Create your views here.
class SearchByTitle(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["get"]

    def get(self, request, query):
        response = make_request("GET", "https://imdb8.p.rapidapi.com/title/find", {"q": query})
        response_json = response.json()
        data = response_json.get("results")

        if not data:
            return Response(status=status.HTTP_204_NO_CONTENT)

        profile = Profile.objects.filter(user=request.user).first()
        for series in data:
            if profile.shows_added.filter(title_id=series.get("id")[7:-1]).exists():
                series['added'] = True
            else:
                series['added'] = False


        return Response({"data": data}, status=status.HTTP_200_OK)
    

class GetSeriesDetails(APIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]

    def get(self, request, title_id):
        qs = Series.objects.filter(title_id=title_id)
        profile = Profile.objects.filter(user=request.user).first()

        if qs.exists():
            series = qs.first()
            internal_data = {
                "added": series in profile.shows_added.all(),
                "title": series.title,
                # "bingeeRatings": -1,
                # "bingeeAdded": -1,
                # "bingeeComments": [],
                # "bingeeRatings": -1,

            }

            response = make_request("GET", "https://imdb8.p.rapidapi.com/title/get-overview-details", {"tconst": title_id})
            response_json = response.json()

            api_data = {
                "title": response_json.get("title").get("title"),
                "img": response_json.get("title").get("image").get("url"),
                "runningTimeInMinutes": response_json.get("title").get("runningTimeInMinutes"),
                "numberOfEpisodes": response_json.get("title").get("numberOfEpisodes"),
                "seriesStartYear": response_json.get("title").get("seriesStartYear"),
                "seriesEndYear": response_json.get("title").get("seriesEndYear"),
                "imdbRatings": response_json.get("ratings").get("rating"),
                "genres": response_json.get("genres"),
                "plotOutline": response_json.get("plotSummary").get("text")

            }

            return Response({"internalData": internal_data, "apiData": api_data}, status=status.HTTP_200_OK)
        
        else:

            response = make_request("GET", "https://imdb8.p.rapidapi.com/title/get-overview-details", {"tconst": title_id})
            response_json = response.json()

            img_dict = response_json.get("title").get("image")
            img = ""
            if img_dict:
                img = img_dict.get("url")

            api_data = {
                "title": response_json.get("title").get("title"),
                "img": img,
                "runningTimeInMinutes": response_json.get("title").get("runningTimeInMinutes"),
                "numberOfEpisodes": response_json.get("title").get("numberOfEpisodes"),
                "seriesStartYear": response_json.get("title").get("seriesStartYear"),
                "seriesEndYear": response_json.get("title").get("seriesEndYear"),
                "imdbRatings": response_json.get("ratings").get("rating"),
                "genres": response_json.get("genres"),
                "plotOutline": response_json.get("plotSummary").get("text")

            }

            return Response({"apiData": api_data}, status=status.HTTP_200_OK)


class GetTrending(APIView):
    permission_classes = [IsAuthenticated, ]
    pass


class GetCurrentlyWatching(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ['get']
    
    def get(self, request, format=None):
        havent_started_yet = Series.objects.havent_started_yet(user=request.user)
        currently_watching = Series.objects.currently_watching(user=request.user)
        havent_watched_for_a_while = Series.objects.havent_watched_for_a_while(user=request.user)

        next_episodes_currently_watching = []
        for series in currently_watching:
            next_episode = Series.objects.find_next_episode(user=request.user, series=series)
            if next_episode:
                episode_serializer = EpisodeSerializer(next_episode)
                next_episode_data = episode_serializer.data
                next_episodes_currently_watching.append(next_episode_data)

        next_episodes_havent_started_yet = []
        for series in havent_started_yet:
            next_episode = Series.objects.find_next_episode(user=request.user, series=series)
            if next_episode:
                episode_serializer = EpisodeSerializer(next_episode)
                next_episode_data = episode_serializer.data
                next_episodes_havent_started_yet.append(next_episode_data)

        next_episodes_havent_watched_for_a_while = []
        for series in havent_watched_for_a_while:
            next_episode = Series.objects.find_next_episode(user=request.user, series=series)
            if next_episode:
                episode_serializer = EpisodeSerializer(next_episode)
                next_episode_data = episode_serializer.data
                next_episodes_havent_watched_for_a_while.append(next_episode_data)

        return Response({"haventStartedYet": next_episodes_havent_started_yet, "currentlyWatching": next_episodes_currently_watching, "haventWatchedForAWhile": next_episodes_havent_watched_for_a_while}, status=status.HTTP_200_OK)


class AddSeries(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post"]

    def post(self, request, format=None):
        user = request.user
        if request.user:
            title_id = request.data.get('title_id')
            title = request.data.get('title')
            image = request.data.get("image")
            profile = Profile.objects.get(user=user)
            qs = Series.objects.filter(title_id=title_id)
            if qs.exists():
                series = qs.first()
                profile.shows_added.add(series)
                profile.number_of_shows += 1
                profile.save()
            else:
                add_series_to_database(title=title, title_id=title_id, image=image)
                qs = Series.objects.filter(title_id=title_id)
                if qs.exists():
                    series = qs.first()
                    profile.shows_added.add(series)
                    profile.number_of_shows += 1
                    profile.save()
                else:
                    return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_200_OK)
    

class MarkEpisodeWatched(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post"]

    def post(self, request, format=None):
        episode_id = request.data.get("episode_id")
        qs = Episode.objects.filter(episode_id=episode_id)
        if qs.exists():
            episode = qs.first()
            watched = WatchedEpisode.objects.create(profile=request.user.profile, episode=episode, series=episode.series)
            profile = request.user.profile
            profile.number_of_episodes += 1
            profile.save()
            watched.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class NextEpisode(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post"]

    def post(self, request, format=None):
        episode_id = request.data.get("episode_id")
        qs = Episode.objects.filter(episode_id=episode_id)
        if qs.exists():
            episode = qs.first()
            watched = WatchedEpisode.objects.create(profile=request.user.profile, episode=episode, series=episode.series)
            watched.save()
            next_episode = Series.objects.find_next_episode(user=request.user, series=episode.series)
            if next_episode:
                episode_serializer = EpisodeSerializer(next_episode)
                return Response({"nextEpisode": episode_serializer.data}, status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class MarkEpisodeUnwatched(APIView):

    permission_classes = [IsAuthenticated, ]
    http_method_names = ["delete"]

    def delete(self, request, id):
        episode_id = id
        qs = Episode.objects.filter(episode_id=episode_id)
        if qs.exists():
            episode = qs.first()
            qs = WatchedEpisode.objects.filter(profile=request.user.profile, episode=episode)
            if qs.exists():
                profile = request.user.profile
                profile.number_of_episodes -= 1
                profile.save()
                watched = qs.first()
                watched.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class GetEpisodeDetails(APIView):
    permission_classes = [IsAuthenticated,]
    http_method_names = ["get"]

    def get(self, request, episode_id):
        response = make_request(method="GET", url="https://imdb8.p.rapidapi.com/title/get-details", parameters={"tconst": episode_id}) 
        response_json = response.json()

        response2 = make_request(method="GET", url="https://imdb8.p.rapidapi.com/title/get-plots", parameters={"tconst": episode_id})
        response_json2 = response2.json()

        season = str(response_json.get("season"))
        if len(season) == 1:
            season = f"0{season}"
        
        episode = str(response_json.get("episode"))
        if len(episode) == 1:
            episode = f"0{episode}"

        episode_details = {
            "episodeId": response_json.get("id")[7:-1],
            "image": response_json.get("image").get("url"),
            "runningTimeInMinutes": response_json.get("runningTimeInMinutes"),
            "nextEpisodeId": response_json.get("nextEpisode")[7:-1],
            "year": response_json.get("year"),
            "episodeTitle": response_json.get("title"),
            "seriesTitle": response_json.get("parentTitle").get("title"),
            "seriesId": response_json.get("parentTitle").get("id")[7:-1],
            "episode": episode,
            "season": season,
            "plotSummary": response_json2.get("plots")[0].get("text"),
            
        }

        return Response({"episode": episode_details}, status=status.HTTP_200_OK)
    

class RemoveSeries(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["delete"]

    def delete(self, request, id):
        qs = Series.objects.filter(title_id=id)
        if qs.exists():
            series = qs.first()
            profile = request.user.profile
            profile.shows_added.remove(series)
            qs = WatchedEpisode.objects.filter(profile=profile, series=series)
            if qs.exists():
                profile.number_of_episodes -= len(qs)
                qs.delete()

            profile.number_of_shows -= 1
            profile.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class GetEpisodeInternalDetails(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post"]
    pass
