from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework import status

from .utils import make_request

from .models import Series

import json

# Create your views here.
class SearchByTitle(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request, format=None):
        query = request.data.get('q')
        response = make_request("GET", "https://imdb8.p.rapidapi.com/title/find", {"q": query})
        response_json = response.json()
        data = response_json.get("results")

        if not data:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response({"data":data}, status=status.HTTP_200_OK)
    

class GetSeriesDetails(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        title_id = request.data.get('title_id')
        qs = Series.objects.filter(title_id=title_id)
        if qs.exists():
            series = qs.first()
            internal_data = {
                "title": series.title,
                "bingeeRatings": 0,
                "bingeeAdded": 0,
                "bingeeComments": [],
                "bingeeRatings": 0,

            }

            response = make_request("GET", "https://imdb8.p.rapidapi.com/title/get-overview-details", {"tconst": title_id})
            response_json = response.json()

            api_data = {
                "img": response_json.get("image").get("url"),
                "runningTimeInMinutes": response_json.get("runningTimeInMinutes"),
                "numberOfEpisodes": response_json.get("numberOfEpisodes"),
                "seriesStartYear": response_json.get("seriesStartYear"),
                "seriesEndYear": response_json.get("seriesEndYear"),
                "imdbRatings": response_json.get("ratings").get("ratings"),
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

            print(api_data)
            return Response({"apiData": api_data}, status=status.HTTP_200_OK)




class GetTrending(APIView):
    permission_classes = [IsAuthenticated,]
    pass

class GetCurrentlyWatching(ListAPIView):
    permission_classes = [IsAuthenticated,]
    pass

