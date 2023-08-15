from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import DjangoModelPermissions

from .serializers import SeriesCommentSerializer, SeriesRatingCreateSerializer, EpisodeCommentSerializer, EpisodeCommentCreateSerializer, SeriesCommentCreateSerializer, EpisodeRatingCreateSerializer, SeriesRatingSerializer, EpisodeRatingSerializer

from shows.models import Series, Episode

from .models import SeriesRating, EpisodeRating, SeriesComment, EpisodeComment


from .permissions import DoesProfileMatch


import json

# Create your views here.


class RateSeries(CreateAPIView):
    permission_classes = [IsAuthenticated,]
    http_method_names = ["post"]
    serializer_class = SeriesRatingCreateSerializer

    def create(self, request, *args, **kwargs):
        title_id = request.data.get("title_id")
        profile = request.user.profile
        series = Series.objects.filter(title_id=title_id)
        series = series.first()
        rating = request.data.get("rating")
        data = {
            "profile": profile.id,
            "rating": rating,
            "series": series.pk
        }
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        qs = SeriesRating.objects.filter(profile=request.user.profile, series__title_id=title_id)
        if qs.exists():
            rating_obj = qs.first()
            rating_obj.rating = serializer.data["rating"]
            rating_obj.save()
            reader_serializer = SeriesRatingSerializer(rating_obj)
            return Response(reader_serializer.data, status=status.HTTP_200_OK)
        else:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            created_instance = serializer.instance
            created_serializer = SeriesRatingSerializer(created_instance)
            return Response(created_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentOnSeries(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post"]
    serializer_class = SeriesCommentCreateSerializer
    def create(self, request, *args, **kwargs):
        data = request.data
        title = data.get("title_id")
        title = Series.objects.filter(title_id=title)
        title = title.first()
        profile = request.user.profile
        profile = profile.id
        text = data.get("text")
        data = {
            "series": title.pk,
            "profile": profile,
            "text": text
        }
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        created_instance = serializer.instance
        created_serializer = SeriesCommentSerializer(created_instance)
        return Response(created_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GetSeriesComments(ListAPIView):
    permission_classes = [IsAuthenticated,]
    http_method_names = ["get"]
    lookup_url_kwarg = "title_id"
    queryset = SeriesComment.objects.all()

    serializer_class = SeriesCommentSerializer


class RateEpisode(CreateAPIView):
    permission_classes = [IsAuthenticated,]
    http_method_names = ["post"]
    serializer_class = EpisodeRatingCreateSerializer

    def create(self, request, *args, **kwargs):
        episode_id = request.data.get("episode_id")
        episode = Episode.objects.filter(episode_id=episode_id)
        if episode.exists():
            episode = episode.first()
        else:
            raise NotFound("Object with id not found", code=404)
        data = request.data
        data["episode"] = episode.pk
        data["profile"] = request.user.profile.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        qs = EpisodeRating.objects.filter(profile=request.user.profile, episode__episode_id=episode_id)
        if qs.exists():
            rating_obj = qs.first()
            rating_obj.rating = serializer.data["rating"]
            rating_obj.save()
            created_serializer = EpisodeRatingSerializer(rating_obj)
            return Response(created_serializer.data, status=status.HTTP_200_OK)
        else:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            instance = serializer.instance
            created_serializer = EpisodeRatingSerializer(instance)
            return Response(created_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentOnEpisode(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post"]
    serializer_class = EpisodeCommentCreateSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        episode = data.get("episode_id")
        episode = Episode.objects.filter(episode_id=episode)
        episode = episode.first()
        profile = request.user.profile
        profile = profile.id
        text = data.get("text")
        data = {
            "episode": episode.pk,
            "profile": profile,
            "text": text
        }
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        created_instance = serializer.instance
        created_serializer = EpisodeCommentSerializer(created_instance)
        return Response(created_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GetEpisodeComments(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["get"]
    lookup_url_kwarg = "episode_id"
    lookup_field = "episode_id"
    queryset = EpisodeComment.objects.all()

    serializer_class = EpisodeCommentSerializer


class DeleteSeriesRating(DestroyAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["delete"]
    queryset = SeriesRating.objects.all()
    lookup_url_kwarg = "title_id"

    def get_object(self):

        queryset = self.filter_queryset(self.get_queryset())

        obj = queryset.filter(series__title_id=self.kwargs.get(self.lookup_url_kwarg), profile=self.request.user.profile)

        if not obj.exists():
            raise NotFound(detail="Object not found", code=404)

        obj = obj.first()

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj



class DeleteEpisodeRating(DestroyAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["delete"]
    queryset = EpisodeRating.objects.all()
    lookup_url_kwarg = "episode_id"

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        obj = queryset.filter(episode__episode_id=self.kwargs.get(self.lookup_url_kwarg),
                              profile=self.request.user.profile)

        if not obj.exists():
            raise NotFound(detail="Object not found", code=404)

        obj = obj.first()

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj


class DeleteSeriesComment(DestroyAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["delete"]
    queryset = SeriesComment.objects.all()
    lookup_url_kwarg = "id"

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        obj = queryset.filter(id=self.kwargs.get(self.lookup_url_kwarg),
                              profile=self.request.user.profile)

        if not obj.exists():
            raise NotFound(detail="Object not found", code=404)

        obj = obj.first()

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj


class DeleteEpisodeComment(DestroyAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["delete"]
    queryset = EpisodeComment.objects.all()
    lookup_url_kwarg = "id"

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        obj = queryset.filter(id=self.kwargs.get(self.lookup_url_kwarg),
                              profile=self.request.user.profile)

        if not obj.exists():
            raise NotFound(detail="Object not found", code=404)

        obj = obj.first()

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj


class GetSeriesRatings(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["get"]
    queryset = SeriesRating.objects.all()
    lookup_url_kwarg = "title_id"
    serializer_class = SeriesRatingSerializer


class EditSeriesComment(UpdateAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["put"]
    lookup_url_kwarg = "id"
    queryset = SeriesComment.objects.all()
    serializer_class = SeriesCommentCreateSerializer

    def get_object(self):
        queryset = self.get_queryset()
        id = self.kwargs.get(self.lookup_url_kwarg)
        queryset = queryset.filter(id=id)

        if not queryset.exists():
            raise NotFound(detail="Object not found", code=404)

        obj = queryset.first()

        self.check_object_permissions(self.request, obj)

        return obj



class EditEpisodeComment(UpdateAPIView):
    permission_classes = [IsAuthenticated, DoesProfileMatch]
    http_method_names = ["put"]
    lookup_url_kwarg = "id"
    queryset = EpisodeComment.objects.all()
    serializer_class = EpisodeCommentCreateSerializer


class GetEpisodeRatings(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["get"]
    queryset = EpisodeRating.objects.all()
    lookup_url_kwarg = "episode_id"
    lookup_field = "episode_id"
    serializer_class = EpisodeRatingSerializer


class LikeEpisodeComment(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post", "delete"]
    look_up_url_kwarg = "comment_id"

    def post(self, request, *args, **kwargs):
        comment = EpisodeComment.objects.filter(id=kwargs.get(self.look_up_url_kwarg))
        if not comment.exists():
            return Response({"message": "Object not found"}, status=status.HTTP_404_NOT_FOUND)
        comment = comment.first()
        profile = request.user.profile
        if profile in comment.likes.all():
            return Response({"message": "Already liked"}, status=status.HTTP_208_ALREADY_REPORTED)
        comment.likes.add(profile)
        likes = comment.likes.all().count()
        return Response({"likes": likes}, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        comment = EpisodeComment.objects.filter(id=kwargs.get(self.look_up_url_kwarg))
        if not comment.exists():
            return Response({"message": "Object not found"}, status=status.HTTP_404_NOT_FOUND)
        comment = comment.first()
        profile = request.user.profile
        if profile not in comment.likes.all():
            return Response({"message": "Not liked"}, status=status.HTTP_208_ALREADY_REPORTED)
        comment.likes.remove(profile)
        likes = comment.likes.all().count()
        return Response({"likes": likes}, status=status.HTTP_200_OK)

class LikeSeriesComment(APIView):
    permission_classes = [IsAuthenticated, ]
    http_method_names = ["post", "delete"]
    look_up_url_kwarg = "comment_id"

    def post(self, request, *args, **kwargs):
        comment = SeriesComment.objects.filter(id=kwargs.get(self.look_up_url_kwarg))
        if not comment.exists():
            return Response({"message": "Object not found"}, status=status.HTTP_404_NOT_FOUND)
        comment = comment.first()
        profile = request.user.profile
        if profile in comment.likes.all():
            return Response({"message": "Already liked"}, status=status.HTTP_208_ALREADY_REPORTED)
        comment.likes.add(profile)
        likes = comment.likes.all().count()
        return Response({"likes": likes}, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        comment = SeriesComment.objects.filter(id=kwargs.get(self.look_up_url_kwarg))
        if not comment.exists():
            return Response({"message": "Object not found"}, status=status.HTTP_404_NOT_FOUND)
        comment = comment.first()
        profile = request.user.profile
        if profile not in comment.likes.all():
            return Response({"message": "Not liked"}, status=status.HTTP_208_ALREADY_REPORTED)
        comment.likes.remove(profile)
        likes = comment.likes.all().count()
        return Response({"likes": likes}, status=status.HTTP_204_NO_CONTENT)


class ReplyToSeriesComment(CreateAPIView):
    pass


class ReplyToEpisodeComment(CreateAPIView):
    pass


class ListEpisodeCommentReplies(ListAPIView):
    pass


class ListSeriesCommentReplies(ListAPIView):
    pass




