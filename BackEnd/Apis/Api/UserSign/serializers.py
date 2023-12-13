from rest_framework import serializers
from Api.models import CustomUser

# Serializer para a entidade CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'cpf', 'email', 'first_name', 'last_name', 'profile_picture', 'saldo', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Método para criar um novo usuário usando o método create_user do modelo CustomUser
        user = CustomUser.objects.create_user(**validated_data)
        return user
