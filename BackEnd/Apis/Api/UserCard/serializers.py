from rest_framework import serializers
from Api.models import CustomUser, Transfer, CreditCard

# Serializer para transações de cartão de crédito
class CreditCardTransactionSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_installments = serializers.IntegerField()

# Serializer para solicitação de cartão de crédito
class CreditCardRequestSerializer(serializers.Serializer):
    cpf = serializers.CharField()