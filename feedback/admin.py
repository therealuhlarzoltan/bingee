from django.contrib import admin
from .models import SeriesRating, SeriesComment, EpisodeRating, EpisodeComment

# Register your models here.
admin.site.register(SeriesRating)
admin.site.register(SeriesComment)
admin.site.register(EpisodeRating)
admin.site.register(EpisodeComment)
