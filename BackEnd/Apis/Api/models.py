# Api/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import threading

class CustomUserManager(BaseUserManager):
    def create_user(self, cpf, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O Email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(cpf=cpf, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        threading.Timer(10, self._schedule_user_approval, args=[user.id]).start()

        return user
    
    def _schedule_user_approval(self, user_id):
        user = CustomUser.objects.get(id=user_id)
        user.status = 'aprovado'
        user.save()
        
    def create_superuser(self, cpf, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(cpf, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    cpf = models.IntegerField(unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    STATUS_CHOICES = [
        ('analise', 'Em Análise'),
        ('aprovado', 'Aprovado'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='analise')

    objects = CustomUserManager()

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.email
    
class Transfer(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='transfers_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='transfers_received', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(default=timezone.now)
    description = models.CharField(max_length=255, null=True, blank=True)
    total_installments = models.IntegerField(default=1)
    current_installment = models.IntegerField(default=1)

    def __str__(self):
        return f'Transfer from {self.sender.email} to {self.receiver.email} - Amount: {self.amount}'


class CreditCard(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=16, unique=True)
    expiration_date = models.DateField()
    cvv = models.CharField(max_length=4)
    is_approved = models.BooleanField(default=False)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0)