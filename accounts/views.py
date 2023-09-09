from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from rest_framework import status
from rest_framework.response import Response
from .serializers import CustomTokenObtainPairSerializer, UserInfoSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

from .serializers import UserCreateSerializer
from .models import Profile

from feedback.permissions import DoesProfileMatch

User = get_user_model()

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
            return Response({"message":"Successful registration! Now you may login."}, status=status.HTTP_201_CREATED)
        return Response({"message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GetUserInfoView(RetrieveAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["get"]
    lookup_url_kwarg = "id"
    lookup_field = "profile__id"
    queryset = User.objects.all()
    serializer_class = UserInfoSerializer


class UpdateUserInfoView(UpdateAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["put"]
    lookup_url_kwarg = "id"
    lookup_field = "profile__id"
    queryset = User.objects.all()
    serializer_class = UserInfoSerializer

    def perform_update(self, serializer):
        serializer.save()
        profile = Profile.objects.get(id=self.kwargs[self.lookup_url_kwarg])
        profile.username = serializer.data.get("username")
        profile.save()






