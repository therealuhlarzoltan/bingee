from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from rest_framework.response import Response


from .serializers import UserCreateSerializer


# Create your views here.
class LogOutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
          
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        print("Incoming request: ", request.data)
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User created"}, status=status.HTTP_201_CREATED)
        return Response({"message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
