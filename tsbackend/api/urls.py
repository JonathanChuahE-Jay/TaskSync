from django.urls import path
from api.auth.views import (
    RegisterView, LogoutView,
    CustomTokenObtainPairView, CookieTokenRefreshView,
    ValidateEmailView, ValidatePasswordView, ValidateUsernameView,
    ValidatePhoneView, SendOtpView, VerifyOtpView, TokenVerifyView
)
from api.projects.views import ProjectListCreateView, ProjectRetrieveUpdateDeleteView, ProjectTeamListCreateView, \
    ProjectTeamDetailView, MyProjectTeamListView, ProjectRoleListCreateView, ProjectRoleDetailView
from api.users.views import UserListCreateView, UserRetrieveUpdateDeleteView
from api.users.views import UserView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
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

    # Project team URLs
    path('projects/<uuid:project_id>/teams/', ProjectTeamListCreateView.as_view(), name='project-team-list'),
    path('projects/<uuid:project_id>/teams/<int:team_id>/', ProjectTeamDetailView.as_view(),name='project-team-detail'),
    path('my-project-teams/', MyProjectTeamListView.as_view(), name='my-project-teams'),

    # Project roles
    path('projects/<uuid:project_id>/roles/', ProjectRoleListCreateView.as_view(), name='project-role-list'),
    path('projects/<uuid:project_id>/roles/<int:role_id>/', ProjectRoleDetailView.as_view(),
         name='project-role-detail'),

    path('user/me/', UserView.as_view(), name='user-me'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<uuid:pk>/', UserRetrieveUpdateDeleteView.as_view(), name='user-detail'),
]
