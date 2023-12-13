from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Api.models import CustomUser, Transfer, CreditCard
from .serializers import CreditCardTransactionSerializer, CreditCardRequestSerializer
from Api.permissions import AllowAnyUserToRegister
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

# View para solicitar um novo cartão de crédito
class CreditCardRequestView(APIView):
    permission_classes = [AllowAnyUserToRegister]

    def post(self, request, cpf, *args, **kwargs):
        user = get_object_or_404(CustomUser, cpf=cpf)

        # Verifica se o usuário já possui um cartão
        if CreditCard.objects.filter(user=user).exists():
            return Response({'detail': 'Você já possui um cartão de crédito.'}, status=status.HTTP_400_BAD_REQUEST)

        # Lógica adicional de validação pode ser adicionada aqui

        # Obtenha o limite solicitado e a renda mensal do usuário
        limit_requested = request.data.get('limit_requested', 0)
        monthly_income = request.data.get('monthly_income', 0)

        # Verifica se o limite está dentro dos limites permitidos
        if limit_requested <= 0 or limit_requested > 50000:
            return Response({'detail': 'Limite solicitado inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se a renda mensal é suficiente para o limite solicitado
        if monthly_income < limit_requested / 3:
            return Response({'detail': 'Renda mensal insuficiente para o limite solicitado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Cria um cartão de crédito para o usuário
        expiration_date = timezone.now() + timedelta(days=365)
        credit_card = CreditCard.objects.create(
            user=user,
            card_number='xxxx-xxxx-xxxx-xxxx',  # Gere um número de cartão de crédito aleatório
            expiration_date=expiration_date,
            cvv='123',  # Gere um CVV aleatório
            is_approved=True,
            credit_limit=limit_requested  # Adiciona o limite ao cartão
        )

        return Response({'detail': 'Cartão de crédito criado com sucesso.'}, status=status.HTTP_200_OK)

# View para realizar transações com cartão de crédito
class CreditCardTransactionView(APIView):
    permission_classes = [AllowAnyUserToRegister]

    def post(self, request, cpf, *args, **kwargs):
        user = get_object_or_404(CustomUser, cpf=cpf)
        serializer = CreditCardTransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        amount = serializer.validated_data['amount']
        total_installments = serializer.validated_data['total_installments']

        user.save()

        description = f'Transação de cartão de crédito no valor de {amount} em {total_installments} parcela(s)'
        transaction = Transfer.objects.create(
            sender=user,
            receiver=user,
            amount=amount,
            timestamp=timezone.now(),
            description=description,
            total_installments=total_installments,
            current_installment=1 
        )

        transaction.num_installments_left = total_installments - 1
        transaction.save()

        return Response({'detail': 'Transação realizada com sucesso.'}, status=status.HTTP_200_OK)
