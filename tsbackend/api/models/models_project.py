from logging import critical

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
import uuid


class Project(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('at_risk', 'At Risk'),
        ('planning', 'Planning'),
        ('critical', 'Critical'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    position = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_projects'
    )
    status_date = models.DateField(null=True, blank=True)
    color = models.CharField(null=True, blank=True, max_length=20)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    tags = ArrayField(
        models.CharField(max_length=100),
        blank=True,
        null=True,
        default=list,
        help_text="List of tags associated with this project"
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def progress_percentage(self):
        if not hasattr(self, 'tasks') or not self.tasks.exists():
            return 0
        completed = self.tasks.filter(status='completed').count()
        total = self.tasks.count()
        return int((completed / total) * 100)


class ProjectRole(models.Model):
    name = models.CharField(max_length=50)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_roles')

    class Meta:
        unique_together = ('name', 'project')

    def __str__(self):
        return f"{self.name} ({self.project.title})"


class ProjectTeam(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, related_name='project_teams', on_delete=models.CASCADE)
    role = models.ForeignKey(ProjectRole, on_delete=models.CASCADE)
    is_creator = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'project')

    def __str__(self):
        return f"{self.user} as {self.role.name} in {self.project.title}"


class ProjectAttachment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='attachment_files')
    file = models.FileField(upload_to='project_attachments/')
    filename = models.CharField(max_length=255, blank=True)
    file_type = models.CharField(max_length=100, blank=True)
    size = models.PositiveIntegerField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.project.title}: {self.filename}"

    def save(self, *args, **kwargs):
        if not self.filename and self.file:
            self.filename = self.file.name
        super().save(*args, **kwargs)