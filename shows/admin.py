from django.contrib import admin

from .models import Season, Series, Episode, WatchedEpisode
from accounts.models import Profile

# Register your models here.
admin.site.register(Season)
admin.site.register(Series)
admin.site.register(Episode)
admin.site.register(WatchedEpisode)
