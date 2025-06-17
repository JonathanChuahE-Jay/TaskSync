from venv import logger

from .serializers import ProjectSerializer, ProjectTeamSerializer, ProjectRoleSerializer, ProjectAttachmentSerializer

import json
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.files.uploadedfile import UploadedFile
from ..utils.project import parse_tags_field
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from api.models.models_project import Project, ProjectTeam, ProjectRole, ProjectAttachment


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        if hasattr(request, 'content_type') and 'multipart/form-data' in str(request.content_type):
            data = request.data.copy()

            if 'tags' in data:
                data['tags'] = parse_tags_field(data['tags'])

            files = request.FILES.getlist('attachments')

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            project = self.perform_create(serializer)

            for file in files:
                try:
                    ProjectAttachment.objects.create(
                        project=project,
                        file=file,
                        filename=file.name,
                        file_type=getattr(file, 'content_type', ''),
                        size=getattr(file, 'size', 0)
                    )
                    print('success saving attachment')
                except Exception as e:
                    print(f"Error saving attachment: {e}")

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['ADMIN', 'MEMBER']:
            raise PermissionDenied("You do not have permission to create a project.")
        project = serializer.save(updated_by=user)
        role, _ = ProjectRole.objects.get_or_create(name='Team Leader', project=project)
        ProjectTeam.objects.create(project=project, user=user, role=role, is_creator=True)
        return project


class ProjectRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.data.copy()

            if 'tags' in data:
                data['tags'] = parse_tags_field(data['tags'])

            files = request.FILES.getlist('attachments')
            data.pop('attachments', None)

            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            for file in files:
                if isinstance(file, UploadedFile):
                    try:
                        ProjectAttachment.objects.create(
                            project=instance,
                            file=file,
                            filename=file.name,
                            file_type=getattr(file, 'content_type', ''),
                            size=getattr(file, 'size', 0)
                        )
                    except Exception as e:
                        logger.error(f"Error saving attachment: {e}")

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response(serializer.data)

        return super().update(request, *args, **kwargs)

class ProjectTeamListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectTeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectTeam.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)

        user_team = ProjectTeam.objects.filter(
            project=project,
            user=self.request.user,
            role__name='Team Leader'
        ).first()

        if not user_team or not user_team.is_creator:
            raise PermissionDenied("Only team leaders can add members to the project")

        serializer.save(project=project)


class ProjectTeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectTeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'team_id'

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectTeam.objects.filter(project_id=project_id)

    def check_permissions(self, request):
        super().check_permissions(request)
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)

        user_team = ProjectTeam.objects.filter(
            project=project,
            user=request.user,
            role__name='Team Leader'
        ).first()

        if not user_team:
            self.permission_denied(
                request, message="Only team leaders can modify project team members"
            )


class MyProjectTeamListView(generics.ListAPIView):
    serializer_class = ProjectTeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectTeam.objects.filter(user=self.request.user).select_related('project', 'role')


class AllProjectTeamListView(generics.ListAPIView):
    serializer_class = ProjectTeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != 'ADMIN':
            raise PermissionDenied("Only admins can view all project teams.")
        return ProjectTeam.objects.select_related('project', 'user', 'role').all()


class ProjectRoleListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectRoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectRole.objects.filter(project_id=project_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        project_id = self.kwargs.get('project_id')
        context['project'] = Project.objects.get(id=project_id)
        return context

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)

        user_team = ProjectTeam.objects.filter(
            project=project,
            user=self.request.user,
            role__name='Team Leader'
        ).first()

        if not user_team:
            raise PermissionDenied("Only team leaders can create roles")

        serializer.save()


class ProjectRoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectRoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'role_id'

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectRole.objects.filter(project_id=project_id)

    def check_permissions(self, request):
        super().check_permissions(request)
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)

        user_team = ProjectTeam.objects.filter(
            project=project,
            user=request.user,
            role__name='Team Leader'
        ).first()

        if not user_team:
            self.permission_denied(
                request, message="Only team leaders can manage roles"
            )

    def perform_destroy(self, instance):
        if instance.name == 'Team Leader':
            raise PermissionDenied("The Team Leader role cannot be deleted")
        super().perform_destroy(instance)


class ProjectAttachmentListView(generics.ListCreateAPIView):
    serializer_class = ProjectAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectAttachment.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)


class ProjectAttachmentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ProjectAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectAttachment.objects.filter(project_id=project_id)