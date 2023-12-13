from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'cpf', 'email', 'first_name', 'last_name', 'profile_picture', 'saldo', 'is_staff')
    search_fields = ('cpf', 'email', 'first_name', 'last_name')
    ordering = ('id',)

admin.site.register(CustomUser, CustomUserAdmin)