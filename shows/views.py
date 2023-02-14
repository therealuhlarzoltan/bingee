from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework import status

from .utils import make_request

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

class GetTrending(APIView):
    permission_classes = [IsAuthenticated,]
    pass

class GetCurrentlyWatching(ListAPIView):
    permission_classes = [IsAuthenticated,]
    pass