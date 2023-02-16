from django.urls import path

from .views import SearchByTitle, GetSeriesDetails

urlpatterns = [
    path("api/search/title/", SearchByTitle.as_view()),
    path("api/details/title/", GetSeriesDetails.as_view()),
]
