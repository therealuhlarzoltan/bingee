from django.urls import path

from .views import (RateSeries, RateEpisode, CommentOnSeries, CommentOnEpisode, GetSeriesComments,
                    GetEpisodeComments, DeleteSeriesRating, DeleteEpisodeRating, DeleteSeriesComment,
                    DeleteEpisodeComment, GetSeriesRatings, EditEpisodeComment, EditSeriesComment,
                    GetEpisodeRatings, LikeEpisodeComment, LikeSeriesComment, ListEpisodeCommentReplies,
                    ListSeriesCommentReplies)

urlpatterns = [
    path("api/rating/series/", RateSeries.as_view()),
    path("api/rating/episode/", RateEpisode.as_view()),
    path("api/comment/series/", CommentOnSeries.as_view()),
    path("api/comment/episode/", CommentOnEpisode.as_view()),
    path("api/comment/series/edit/<uuid:comment_id>/", EditSeriesComment.as_view()),
    path("api/comment/episode/edit/<uuid:comment_id>/", EditEpisodeComment.as_view()),
    path("api/comment/series/get/<str:title_id>/", GetSeriesComments.as_view()),
    path("api/comment/episode/get/<str:episode_id>/", GetEpisodeComments.as_view()),
    path("api/rating/series/delete/<str:title_id>/", DeleteSeriesRating.as_view()),
    path("api/rating/episode/delete/<str:episode_id>/", DeleteEpisodeRating.as_view()),
    path("api/comment/series/delete/<uuid:comment_id>/", DeleteSeriesComment.as_view()),
    path("api/comment/episode/delete/<uuid:comment_id>/", DeleteEpisodeComment.as_view()),
    path("api/rating/series/get/<str:title_id>/", GetSeriesRatings.as_view()),
    path("api/rating/episode/get/<str:episode_id>/", GetEpisodeRatings.as_view()),
    path("api/like/episode/comment/<uuid:comment_id>/", LikeEpisodeComment.as_view()),
    path("api/like/series/comment/<uuid:comment_id>/", LikeSeriesComment.as_view()),
    path("api/series/comment/replies/get/<uuid:comment_id>/", ListSeriesCommentReplies.as_view()),
    path("api/episode/comment/replies/get/<uuid:comment_id>/", ListEpisodeCommentReplies.as_view())
]