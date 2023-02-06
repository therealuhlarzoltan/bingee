from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from .views import LogOutView, RegisterView, CustomTokenObtainPairView

urlpatterns = [
    path("token/obtain/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/logout", LogOutView.as_view(), name="token_logout"),
    path("register/", RegisterView.as_view(), name="register"),
]
