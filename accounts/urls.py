from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from .views import (LogOutView, RegisterView, CustomTokenObtainPairView, GetUserInfoView, UpdateUserInfoView,
                    DeleteAccountView, ChangePasswordView)

urlpatterns = [
    path("token/obtain/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/logout/", LogOutView.as_view(), name="token_logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("api/user/info/own/get/<uuid:id>/", GetUserInfoView.as_view(), name="get_own_user_info"),
    path("api/user/info/own/change/<uuid:id>/", UpdateUserInfoView.as_view(), name="update_own_user_info"),
    path("api/user/account/delete/", DeleteAccountView.as_view(), name="delete_account"),
    path("api/user/password/change/", ChangePasswordView.as_view(), name="password_change"),
    path("api/user/profile/<str:username>/", )

]
