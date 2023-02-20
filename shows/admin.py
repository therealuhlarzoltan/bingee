from django.contrib import admin

from .models import Profile, Season, Series, Episode

# Register your models here.
admin.site.register(Profile)
admin.site.register(Season)
admin.site.register(Series)
admin.site.register(Episode)