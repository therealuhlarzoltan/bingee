from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LogOutView, RegisterView

urlpatterns = [
    path("token/obtain/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/logout", LogOutView.as_view(), name="token_logout"),
    path("register/", RegisterView.as_view(), name="register"),
]
