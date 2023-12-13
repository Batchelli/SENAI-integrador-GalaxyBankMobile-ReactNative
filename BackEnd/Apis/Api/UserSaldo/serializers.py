from rest_framework import serializers
from Api.models import CustomUser, Transfer

# Serializer para a atualização do saldo do usuário
class UpdateSaldoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['saldo']

# Serializer para a transferência de valores entre usuários
class TransferSerializer(serializers.Serializer):
    sender_cpf = serializers.CharField()
    receiver_cpf = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

# Serializer para o histórico de transferências
class TransferSerializerHistory(serializers.ModelSerializer):
    sender_cpf = serializers.SerializerMethodField()
    receiver_cpf = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    total_installments = serializers.IntegerField()
    installment_amount = serializers.SerializerMethodField()

    class Meta:
        model = Transfer
        fields = ['id', 'amount', 'timestamp', 'sender_cpf', 'receiver_cpf', 'sender_name', 'receiver_name', 'total_installments', 'installment_amount']

    def get_sender_cpf(self, obj):
        return obj.sender.cpf if obj.sender else None

    def get_receiver_cpf(self, obj):
        return obj.receiver.cpf if obj.receiver else None

    def get_sender_name(self, obj):
        return f'{obj.sender.first_name} {obj.sender.last_name}' if obj.sender else None

    def get_receiver_name(self, obj):
        return f'{obj.receiver.first_name} {obj.receiver.last_name}' if obj.receiver else None

    def get_installment_amount(self, obj):
        if obj.total_installments > 0:
            return obj.amount / obj.total_installments
        return None

# Serializer para a solicitação de empréstimo
class LoanRequestSerializer(serializers.Serializer):
    cpf = serializers.CharField()
    income = serializers.DecimalField(max_digits=10, decimal_places=2)
    loan_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
