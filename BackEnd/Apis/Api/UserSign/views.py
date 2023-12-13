from .serializers import CustomUserSerializer
from Api.permissions import AllowAnyUserToRegister
from Api.models import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.parsers import MultiPartParser


import logging

logger = logging.getLogger(__name__)

# View para registro de novos usuários
class RegisterView(generics.CreateAPIView):
    logger.debug("Register endpoint accessed.")
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAnyUserToRegister]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# View para autenticação de usuários
class LoginView(APIView):
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAnyUserToRegister]

    def post(self, request, *args, **kwargs):
        cpf = request.data.get('cpf')
        password = request.data.get('password')

        user = CustomUser.objects.filter(cpf=cpf).first()

        if user and user.check_password(password):
            if user.status == 'aprovado':
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Usuário não aprovado. Aguarde a aprovação.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'detail': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

# View para obter e atualizar informações do usuário autenticado
class UserInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAnyUserToRegister]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

# View para listar todos os usuários
class ListUsersView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAnyUserToRegister]

# View para obter detalhes de um usuário específico
class UserDetailsView(generics.RetrieveAPIView):
    permission_classes = [AllowAnyUserToRegister]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = 'id'
