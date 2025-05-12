from rest_framework import status, permissions
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, RegisterSerializer, EmailValidationSerializer,
    PasswordValidationSerializer, UsernameValidationSerializer,
    PhoneValidationSerializer, SendOtpSerializer, VerifyOtpSerializer, CustomTokenObtainPairSerializer
)
from .models import OtpVerification
import re
from django.utils import timezone

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request: Request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data["access"]
            refresh_token = response.data["refresh"]
            response.set_cookie(
                'refresh_token',
                refresh_token,
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
            )
            response.set_cookie(
                'access_token',
                access_token,
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
            )

            from rest_framework_simplejwt.tokens import AccessToken
            token = AccessToken(access_token)
            user_id = token.payload.get('user_id')
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            response.data = serializer.data
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            request.data['refresh'] = refresh_token
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                access_token = response.data.get('access')
                if 'refresh' in response.data:
                    refresh_token = response.data.get('refresh')
                    response.set_cookie(
                        'refresh_token',
                        refresh_token,
                        max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                        httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
                        secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
                        samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
                    )
                response.set_cookie(
                    'access_token',
                    access_token,
                    max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                    httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
                    secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
                    samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
                )
                response.data = {"message": "Token refreshed successfully"}
            return response
        except (InvalidToken, TokenError) as e:
            response = Response({"Error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')
            return response


class ValidateEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return Response(
                {"success": False, "message": "Invalid email format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"success": False, "message": {"email": "Email is already in use"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"success": True, "message": {"email": "Email is available"}})


class ValidatePasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        password = serializer.validated_data['password']

        if len(password) < 8:
            return Response(
                {"success": False, "message": {"password": "Password must be at least 8 characters long"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not re.search(r'[A-Z]', password):
            return Response(
                {"success": False, "message": {"password": "Password must contain at least one uppercase letter"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not re.search(r'[a-z]', password):
            return Response(
                {"success": False, "message": {"password": "Password must contain at least one lowercase letter"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not re.search(r'\d', password):
            return Response(
                {"success": False, "message": {"password": "Password must contain at least one number"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"success": True, "message": {"password": "Password meets requirements"}})


class ValidateUsernameView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UsernameValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data['username']

        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
            return Response(
                {"success": False,
                 "message": {
                     "username": "Username must be 3-20 characters and contain only letters, numbers, and underscores"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"success": False, "message": {"username": "Username is already taken"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"success": True, "message": {"username": "Username is available"}})


class ValidatePhoneView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PhoneValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data['phone_number']

        if not re.match(r'^\+?[1-9]\d{1,14}$', phone_number):
            return Response(
                {"success": False, "message": {"phone_number": "Invalid phone number format"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(phone_number=phone_number).exists():
            return Response(
                {"success": False, "message": {"phone_number": "Phone number is already registered"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"success": True, "message": {"phone_number": "Phone number is valid"}})

class SendOtpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        otp_record = OtpVerification.create_otp(email)

        print(f"OTP for {email}: {otp_record.otp}")

        return Response({"success": True, "message": "OTP sent successfully to email"})


class VerifyOtpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            otp_record = OtpVerification.objects.filter(
                email=email,
                otp=otp,
                is_used=False,
                expires_at__gt=timezone.now()
            ).latest('created_at')

            if not otp_record.is_valid():
                return Response(
                    {"valid": False, "message": {"otp": "OTP has expired. Please request a new one."}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            otp_record.is_used = True
            otp_record.save()
            return Response({"valid": True, "message": {"otp": "OTP verified successfully"}})

        except OtpVerification.DoesNotExist:
            return Response(
                {"valid": False, "message": {"otp": "Invalid OTP. Please check and try again."}},
                status=status.HTTP_400_BAD_REQUEST
            )

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            user_serializer = UserSerializer(user)
            response = Response(user_serializer.data, status=status.HTTP_201_CREATED)

            response.set_cookie(
                'refresh_token',
                refresh_token,
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
            )
            response.set_cookie(
                'access_token',
                access_token,
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
                secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            response = Response(status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
