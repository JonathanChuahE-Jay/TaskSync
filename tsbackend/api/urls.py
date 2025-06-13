from django.urls import path
from api.auth.views import (
    RegisterView, LogoutView, UserView,
    CustomTokenObtainPairView, CookieTokenRefreshView,
    ValidateEmailView, ValidatePasswordView, ValidateUsernameView,
    ValidatePhoneView, SendOtpView, VerifyOtpView, TokenVerifyView
)
from api.projects.views import ProjectListCreateView, ProjectRetrieveUpdateDeleteView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserView.as_view(), name='user'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Validation endpoints
    path('validate-email/', ValidateEmailView.as_view(), name='validate_email'),
    path('validate-password/', ValidatePasswordView.as_view(), name='validate_password'),
    path('validate-username/', ValidateUsernameView.as_view(), name='validate_username'),
    path('validate-phone/', ValidatePhoneView.as_view(), name='validate_phone'),

    # OTP endpoints
    path('send-otp/', SendOtpView.as_view(), name='send_otp'),
    path('resend-otp/', SendOtpView.as_view(), name='resend_otp'),
    path('verify-otp/', VerifyOtpView.as_view(), name='verify_otp'),

    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<uuid:pk>/', ProjectRetrieveUpdateDeleteView.as_view(), name='project-detail'),
]
