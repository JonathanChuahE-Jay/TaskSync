from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import uuid
from django.utils import timezone
from datetime import timedelta
from django.core.validators import RegexValidator


class User(AbstractUser):
    ROLE_CHOICES = (
        ('MEMBER', 'Team Member'),
        ('PROJECT_MANAGER', 'Project Manager'),
        ('ADMIN', 'System Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')

    phone_number = models.CharField(
        max_length=15,
        unique=True,
        null=True,
        blank=True,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                   message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")]
    )

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='api_user_set',
        related_query_name='api_user',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='api_user_set',
        related_query_name='api_user',
    )

    class Meta:
        db_table = 'users'


class OtpVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(null=True, blank=True)
    otp = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        return super().save(*args, **kwargs)

    @classmethod
    def generate_otp(cls):
        return str(random.randint(100000, 999999))

    @classmethod
    def create_otp(cls, email):
        if not email:
            raise ValueError("Email must be provided.")

        otp = cls.generate_otp()
        otp_record = cls.objects.create(
            email=email,
            otp=otp,
            is_used=False,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        return otp_record

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    class Meta:
        db_table = 'otp_verifications'
        verbose_name = 'OTP Verification'
        verbose_name_plural = 'OTP Verifications'
