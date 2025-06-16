from venv import logger

from .serializers import ProjectSerializer, ProjectTeamSerializer, ProjectRoleSerializer, ProjectAttachmentSerializer

import json
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.files.uploadedfile import UploadedFile
import logging
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
                try:
                    if isinstance(data['tags'], str):
                        parsed_tags = json.loads(data['tags'])
                        if isinstance(parsed_tags, str):
                            try:
                                parsed_tags = json.loads(parsed_tags)
                            except json.JSONDecodeError:
                                pass
                        if isinstance(parsed_tags, list):
                            data['tags'] = parsed_tags
                        else:
                            data['tags'] = []
                    elif isinstance(data['tags'], (dict, list)) or hasattr(data['tags'], 'dict'):
                        tags_list = []
                        if hasattr(data['tags'], 'items'):
                            tags_dict = dict(data['tags'].items())
                            for key in sorted(tags_dict.keys()):
                                tags_list.append(str(tags_dict[key]))
                        elif hasattr(data['tags'], 'getlist'):
                            tags_list = data.getlist('tags')
                        else:
                            tags_list = data['tags']
                        data['tags'] = tags_list
                except (json.JSONDecodeError, AttributeError, TypeError) as e:
                    if isinstance(data['tags'], str):
                        data['tags'] = [tag.strip() for tag in data['tags'].split(',') if tag.strip()]
                    else:
                        data['tags'] = []

            files = request.FILES.getlist('attachments')

            if files:
                data['attachments'] = files[0]

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            project = self.perform_create(serializer)

            for file in files:
                try:
                    file_size = file.size if hasattr(file, 'size') else 0
                    file_type = file.content_type if hasattr(file, 'content_type') else ''

                    attachment = ProjectAttachment.objects.create(
                        project=project,
                        file=file,
                        filename=file.name,
                        file_type=file_type,
                        size=file_size
                    )
                    logger.debug(f"Created attachment: {attachment.id} for project {project.id}")
                except Exception as e:
                    logger.error(f"Error saving attachment: {e}")

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['ADMIN', 'MEMBER']:
            raise PermissionDenied("You do not have permission to create a project.")
        project = serializer.save(updated_by=user)
        role, _ = ProjectRole.objects.get_or_create(name='Team Leader', project=project)
        ProjectTeam.objects.create(
            project=project,
            user=user,
            role=role,
            is_creator=True
        )
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

            if 'tags' in data and isinstance(data['tags'], str):
                try:
                    data['tags'] = json.loads(data['tags'])
                except json.JSONDecodeError:
                    data['tags'] = [tag.strip() for tag in data['tags'].split(',') if tag.strip()]

            files = request.FILES.getlist('attachments')

            if 'attachments' in data:
                data.pop('attachments')

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
                            file_type=file.content_type if hasattr(file, 'content_type') else '',
                            size=file.size if hasattr(file, 'size') else 0
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