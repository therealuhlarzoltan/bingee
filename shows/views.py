from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from .utils import make_request

# Create your views here.
class SearchByTitle(APIView):
    permission_classes = [IsAuthenticated,]
    
    def post(self, request, format=None):
        query = request.data.get('q')
        response = make_request("GET", "https://imdb8.p.rapidapi.com/title/find", {"q": query})
        print(response.text)

        return Response({"data": response.text})

class GetTrending(APIView):
    permission_classes = [IsAuthenticated,]
    pass

class GetCurrentlyWatching(ListAPIView):
    permission_classes = [IsAuthenticated,]
    pass