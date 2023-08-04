from django.urls import path

from .views import SearchByTitle, GetSeriesDetails, AddSeries, GetCurrentlyWatching, MarkEpisodeWatched, NextEpisode, MarkEpisodeUnwatched, RemoveSeries, GetEpisodeDetails, GetEpisodeInternalDetails

urlpatterns = [
    path("api/search/title/<str:query>/", SearchByTitle.as_view()),
    path("api/details/title/<str:title_id>/", GetSeriesDetails.as_view()),
    path("api/add/title/", AddSeries.as_view()),
    path("api/watching/title/", GetCurrentlyWatching.as_view()),
    path("api/watch/episode/", MarkEpisodeWatched.as_view()),
    path("api/watch/episode/next/", NextEpisode.as_view()),
    path("api/unwatch/episode/<str:episode_id>/", MarkEpisodeUnwatched.as_view()),
    path("api/remove/title/<str:title_id>/", RemoveSeries.as_view()),
    path("api/episode/details/<str:episode_id>/", GetEpisodeDetails.as_view()),
    path("api/episode/details/internal/", GetEpisodeInternalDetails.as_view()),
]
