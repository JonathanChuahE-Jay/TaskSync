from django.urls import path
from .views import (
    ProjectListCreateView, ProjectRetrieveUpdateDeleteView,
    ProjectTeamListCreateView, ProjectTeamDetailView, MyProjectTeamListView,
    ProjectRoleListCreateView, ProjectRoleDetailView,
    AllProjectTeamListView, ProjectAttachmentListView, ProjectAttachmentDetailView
)

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('<uuid:pk>/', ProjectRetrieveUpdateDeleteView.as_view(), name='project-detail'),

    path('<uuid:project_id>/teams/', ProjectTeamListCreateView.as_view(), name='project-team-list'),
    path('<uuid:project_id>/teams/<int:team_id>/', ProjectTeamDetailView.as_view(), name='project-team-detail'),
    path('<uuid:project_id>/roles/', ProjectRoleListCreateView.as_view(), name='project-role-list'),
    path('<uuid:project_id>/roles/<int:role_id>/', ProjectRoleDetailView.as_view(), name='project-role-detail'),
    path('<uuid:project_id>/attachments/', ProjectAttachmentListView.as_view(), name='project-attachment-list'),
    path('<uuid:project_id>/attachments/<int:pk>/', ProjectAttachmentDetailView.as_view(), name='project-attachment-detail'),

    path('teams/me/', MyProjectTeamListView.as_view(), name='my-project-teams'),
    path('teams/all/', AllProjectTeamListView.as_view(), name='all-project-teams'),
]
