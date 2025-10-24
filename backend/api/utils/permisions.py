from rest_framework.permissions import BasePermission

# 🔒 --- Custom Permission Classes ---

class IsVolunteer(BasePermission):
    """Allows access only to users with role 'volunteer'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'volunteer'
    

class IsAdmin(BasePermission):
    """Allows access only to users with role 'admin'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsEmailVerified(BasePermission):
    """
    Allows access only to users with verified (activated) accounts.
    """

    message = "Please verify your email before accessing this resource."

    def has_permission(self, request, view):
        user = request.user
        # If user is not authenticated or not active (email not verified)
        return bool(user and user.is_authenticated and user.is_active)
