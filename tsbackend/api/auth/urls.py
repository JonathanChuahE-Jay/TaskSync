from django.urls import path
from .views import (
    RegisterView, LogoutView, CustomTokenObtainPairView, CookieTokenRefreshView,
    ValidateEmailView, ValidatePasswordView, ValidateUsernameView,
    ValidatePhoneView, SendOtpView, VerifyOtpView, TokenVerifyView
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Validation
    path('validate-email/', ValidateEmailView.as_view(), name='validate_email'),
    path('validate-password/', ValidatePasswordView.as_view(), name='validate_password'),
    path('validate-username/', ValidateUsernameView.as_view(), name='validate_username'),
    path('validate-phone/', ValidatePhoneView.as_view(), name='validate_phone'),

    # OTP
    path('send-otp/', SendOtpView.as_view(), name='send_otp'),
    path('resend-otp/', SendOtpView.as_view(), name='resend_otp'),
    path('verify-otp/', VerifyOtpView.as_view(), name='verify_otp'),
]
