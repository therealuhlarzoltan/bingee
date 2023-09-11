from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from rest_framework import status
from rest_framework.response import Response
from .serializers import CustomTokenObtainPairSerializer, UserInfoSerializer, ProfileInfoSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

from shows.serializers import EpisodeSerializer, SeriesSerializer

from .serializers import UserCreateSerializer, RecentlyWatchedShowsSerializer
from .models import Profile
from shows.models import Series, Episode, WatchedEpisode

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


class DeleteAccountView(DestroyAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["delete"]
    queryset = User.objects.all()

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        profile_id = self.request.user.profile.id
        queryset = queryset.filter(profile__id=profile_id)
        if not queryset.exists():
            raise NotFound({"message":"Object with id not found"}, code=400)
        obj = queryset.first()
        self.check_object_permissions(self.request, obj)
        return obj


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["post"]

    def post(self, request):
        password_confirmation = request.data.get("current_password")
        new_password = request.data.get("password")
        new_password2 = request.data.get("password2")
        username = request.user.username
        user = authenticate(username=username, password=password_confirmation)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            if new_password != new_password2:
                return Response({"password_confirmation": "passwords must match."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                validate_password(new_password, user)
            except ValidationError as error:
                error_dict = {
                    "new_password": error.messages[0]
                }
                return Response(data=error_dict, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetProfile(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]
    queryset = Profile.objects.all()
    lookup_url_kwarg = "username"
    lookup_field = "username"
    serializer_class = ProfileInfoSerializer


class GetProfileSeries(ListAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]
    serializer_class = RecentlyWatchedShowsSerializer
    queryset = Series.objects.all()
    lookup_url_kwarg = "id"

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs[self.lookup_url_kwarg])
        if not profile.exists():
            raise NotFound("Object not found", code=404)
        profile = profile.first()
        shows = profile.shows_added.all()
        return shows




class GetProfileEpisodes(ListAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]
    serializer_class = EpisodeSerializer
    queryset = Episode.objects.all()
    lookup_url_kwarg = "id"

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs[self.lookup_url_kwarg])
        if not profile.exists():
            raise NotFound("Object not found", code=404)
        profile = profile.first()
        watched_episodes = WatchedEpisode.objects.filter(profile=profile).order_by("-timestamp")[0:3].get()
        return watched_episodes







