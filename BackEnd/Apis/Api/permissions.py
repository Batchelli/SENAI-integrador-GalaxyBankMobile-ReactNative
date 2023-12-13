# Api/permissions.py
from rest_framework.permissions import BasePermission

class AllowAnyUserToRegister(BasePermission):
    def has_permission(self, request, view):
        return True
