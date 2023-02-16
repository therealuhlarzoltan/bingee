from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name="index"),
    path('login/', index),
    path('register/', index),
    path('logout/', index),
    path('search/<str:q>/', index),
    path('show/<str:id>/', index),
    
]
