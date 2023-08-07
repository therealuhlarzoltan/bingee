from django.urls import path

from .views import RateSeries, RateEpisode, CommentOnSeries, CommentOnEpisode, GetSeriesComments, GetEpisodeComments, DeleteSeriesRating, DeleteEpisodeRating, DeleteSeriesComment, DeleteEpisodeComment, GetSeriesRatings

urlpatterns = [
    path("api/rating/series/", RateSeries.as_view()),
    path("api/rating/episode/", RateEpisode.as_view()),
    path("api/comment/series/", CommentOnSeries.as_view()),
    path("api/comment/episode/", CommentOnEpisode.as_view()),
    path("api/comment/series/get/<str:title_id>/", GetSeriesComments.as_view()),
    path("api/comment/episode/get/<str:episode_id>/", GetEpisodeComments.as_view()),
    path("api/rating/series/delete/<str:title_id>/", DeleteSeriesRating.as_view()),
    path("api/rating/episode/delete/<str:title_id>/", DeleteEpisodeRating.as_view()),
    path("api/comment/series/delete/<str:title_id>/", DeleteSeriesComment.as_view()),
    path("api/comment/episode/delete/<str:title_id>/", DeleteEpisodeComment.as_view()),
    path("api/rating/series/get/<str:title_id>/", GetSeriesRatings.as_view()),
    path("api/rating/episode/get/<str:episode_id>/", GetSeriesRatings.as_view()),
]