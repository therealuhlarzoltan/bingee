from rest_framework.permissions import BasePermission

from accounts.models import Profile


class DoesProfileMatch(BasePermission):
    message = "Unauthorized"

    def has_object_permission(self, request, view, obj):
        qs = Profile.objects.filter(user=request.user)
        if qs.exists():
            return obj.profile == qs.first()

        return False
