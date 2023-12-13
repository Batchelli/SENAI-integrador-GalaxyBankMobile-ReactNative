from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from Api.models import CustomUser, Transfer
from .serializers import UpdateSaldoSerializer, TransferSerializer, TransferSerializerHistory, LoanRequestSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from Api.permissions import AllowAnyUserToRegister
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
import decimal

# Definindo uma classe de views para atualização de saldo do usuário
class UpdateSaldoView(UpdateAPIView):
    serializer_class = UpdateSaldoSerializer
    permission_classes = [AllowAnyUserToRegister]

    def get_queryset(self):
        return CustomUser.objects.filter(pk=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        user.saldo = request.data['saldo']
        user.save()

        serializer = self.get_serializer(user)
        return Response(serializer.data)

# Definindo uma classe de views para a transferência de valores entre usuários
class TransferView(generics.CreateAPIView):
    serializer_class = TransferSerializer
    permission_classes = [AllowAnyUserToRegister]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        sender_cpf = serializer.validated_data['sender_cpf']
        receiver_cpf = serializer.validated_data['receiver_cpf']
        amount = serializer.validated_data['amount']

        try:
            sender = CustomUser.objects.get(cpf=sender_cpf)
            receiver = CustomUser.objects.get(cpf=receiver_cpf)

            if sender == receiver:
                return Response({'detail': 'Você não pode transferir para você mesmo.'}, status=status.HTTP_400_BAD_REQUEST)

            if sender.saldo >= amount:
                # Realiza a transferência
                sender.saldo -= amount
                receiver.saldo += amount
                sender.save()
                receiver.save()

                # Registra a transação
                Transfer.objects.create(sender=sender, receiver=receiver, amount=amount)

                return Response({'detail': 'Transferência realizada com sucesso.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Saldo insuficiente para realizar a transferência.'}, status=status.HTTP_400_BAD_REQUEST)

        except CustomUser.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

# Definindo uma classe de views para exibir o histórico de transações do usuário
class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransferSerializerHistory
    permission_classes = [AllowAnyUserToRegister]

    def get_queryset(self):
        user_identifier = self.kwargs['user_identifier']

        # Verifica se o identificador parece ser um CPF
        if len(user_identifier) == 11 and user_identifier.isdigit():
            user = get_object_or_404(CustomUser, cpf=user_identifier)
            return Transfer.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('-id')
        
        # Caso contrário, assume que é um ID (não alteramos nada aqui)

        user = get_object_or_404(CustomUser, pk=user_identifier)
        return Transfer.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('-id')
    
# Definindo uma classe de views para lidar com solicitações de empréstimos
class LoanRequestView(APIView):
    permission_classes = [AllowAnyUserToRegister]

    def post(self, request, cpf, *args, **kwargs):
        serializer = LoanRequestSerializer(data={"cpf": cpf, **request.data})
        serializer.is_valid(raise_exception=True)

        income = serializer.validated_data['income']
        loan_amount = serializer.validated_data['loan_amount']
        user = get_object_or_404(CustomUser, cpf=cpf)
        num_installments = request.data.get('num_installments', 1)  # Número padrão de parcelas é 1

        # Verifica se a renda mensal é pelo menos 1/5 do valor do empréstimo
        if income >= loan_amount / 5:
            # Calcula o valor da parcela
            monthly_payment = loan_amount / decimal.Decimal(num_installments)


            # Atualiza o valor do empréstimo, o valor da parcela, e a quantidade total de parcelas no modelo do usuário
            user.loan_amount = loan_amount
            user.monthly_payment = monthly_payment
            user.total_installments = num_installments
            user.saldo += loan_amount  # Ajusta o saldo do usuário após o empréstimo ser aprovado
            user.save()

            # Cria uma transação no histórico de transações com informações sobre o empréstimo
            description = f'Empréstimo feito no valor de {loan_amount} em {num_installments} parcela(s)'
            transfer = Transfer.objects.create(sender=user, receiver=user, amount=loan_amount, timestamp=timezone.now(), description=description)
            transfer.total_installments = num_installments
            transfer.current_installment = 1  # Inicializa o número da parcela
            transfer.save()

            return Response({'detail': 'Pedido de empréstimo aceito.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Renda mensal insuficiente para o valor do empréstimo.'}, status=status.HTTP_400_BAD_REQUEST)