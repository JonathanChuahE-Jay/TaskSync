from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import uuid
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    ROLE_CHOICES = (
        ('MEMBER', 'Team Member'),
        ('PROJECT_MANAGER', 'Project Manager'),
        ('ADMIN', 'System Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
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
    phone_number = models.CharField(max_length=15)
    otp = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        # Set expiry time if it's a new record
        if not self.pk:
            # Use timezone-aware datetime
            self.expires_at = timezone.now() + timedelta(minutes=10)
        return super().save(*args, **kwargs)

    @classmethod
    def generate_otp(cls):
        """Generate a 6-digit OTP"""
        return str(random.randint(100000, 999999))

    @classmethod
    def create_otp_for_phone(cls, phone_number):
        """Create and save a new OTP for the given phone number"""
        # Invalidate any existing OTPs
        cls.objects.filter(phone_number=phone_number, is_used=False).update(is_used=True)

        otp = cls.generate_otp()
        otp_record = cls.objects.create(
            phone_number=phone_number,
            otp=otp,
            is_used=False,
            expires_at=timezone.now() + timedelta(minutes=10)  # Use timezone.now()
        )

        return otp_record

    def is_valid(self):
        """Check if OTP is still valid"""
        return (
                not self.is_used and
                timezone.now() < self.expires_at  # Use timezone.now()
        )

    class Meta:
        db_table = 'otp_verifications'
        verbose_name = 'OTP Verification'
        verbose_name_plural = 'OTP Verifications'