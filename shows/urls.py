from django.urls import path

from .views import SearchByTitle, GetSeriesDetails, AddSeries, GetCurrentlyWatching

urlpatterns = [
    path("api/search/title/", SearchByTitle.as_view()),
    path("api/details/title/", GetSeriesDetails.as_view()),
    path("api/add/title/", AddSeries.as_view()),
    path("api/watching/title/", GetCurrentlyWatching.as_view())
]
