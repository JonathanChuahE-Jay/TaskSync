from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from api.models.models_project import Project, ProjectTeam, ProjectRole
from .serializers import ProjectSerializer, ProjectTeamSerializer, ProjectRoleSerializer

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import json


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        if hasattr(request, 'content_type') and 'multipart/form-data' in str(request.content_type):
            data = request.data.copy()

            files = request.FILES.getlist('attachments')
            if files:
                data['attachments'] = files[0]

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
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

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.all() if user.role == 'ADMIN' else Project.objects.filter(project_teams__user=user)
        return qs.distinct().order_by('-created_at') \
            .prefetch_related('project_teams__user', 'project_teams__role', 'project_roles')


class ProjectRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(project_teams__user=user).distinct()


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
