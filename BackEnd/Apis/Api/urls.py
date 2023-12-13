# Api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .UserCard.views import CreditCardRequestView, CreditCardTransactionView
from .UserSaldo.views import UpdateSaldoView, TransferView, TransactionHistoryView, LoanRequestView
from .UserSign.views import RegisterView, LoginView, UserInfoView, ListUsersView, UserDetailsView


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/<int:id>/', UserDetailsView.as_view(), name='user-details'),
    path('user/', UserInfoView.as_view(), name='user-info'),
    path('users/', ListUsersView.as_view(), name='list-users'),

    path('updateSaldo/<int:pk>/', UpdateSaldoView.as_view(), name='update-saldo'),
    path('transfer/', TransferView.as_view(), name='transfer'),
    path('transactions/<str:user_identifier>/', TransactionHistoryView.as_view(), name='transaction-history'),
    path('loanRequest/<str:cpf>/', LoanRequestView.as_view(), name='loan-request'),
    
    path('resquestCard/<str:cpf>/', CreditCardRequestView.as_view(), name='credit-card-request'),
    path('creditTransaction/<str:cpf>/', CreditCardTransactionView.as_view(), name='credit-card-transaction'),
]
