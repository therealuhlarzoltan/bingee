from django.urls import path

from .views import SearchByTitle

urlpatterns = [
    path("api/search/title/", SearchByTitle.as_view()),
]
