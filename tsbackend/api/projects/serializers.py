from django.contrib.auth import get_user_model
from rest_framework import serializers
from api.models.models_project import ProjectRole, Project, ProjectTeam, ProjectAttachment
from ..users.serializers import UserSerializer
import json

User = get_user_model()


class ProjectRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRole
        fields = ['id', 'name', 'project']
        read_only_fields = ['project']

    def create(self, validated_data):
        project = self.context['project']
        return ProjectRole.objects.create(project=project, **validated_data)


class ProjectTeamSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    role = ProjectRoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=ProjectRole.objects.all(), source='role', write_only=True)
    project_title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProjectTeam
        fields = ['id', 'user', 'user_id', 'role', 'role_id', 'is_creator', 'project_title']
        read_only_fields = ['is_creator']

    def get_project_title(self, obj):
        return obj.project.title

    def validate_role_id(self, value):
        view = self.context.get('view')
        if view and hasattr(view, 'kwargs'):
            project_id = view.kwargs.get('project_id')
            if str(value.project.id) != str(project_id):
                raise serializers.ValidationError("This role doesn't belong to the specified project")
        return value

    def create(self, validated_data):
        project = validated_data.get('project')
        user = validated_data.get('user')

        if ProjectTeam.objects.filter(project=project, user=user).exists():
            raise serializers.ValidationError({"user": "This user is already a member of this project"})

        return ProjectTeam.objects.create(is_creator=False, **validated_data)


class ProjectAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAttachment
        fields = ['id', 'file', 'filename', 'file_type', 'size', 'uploaded_at']
        read_only_fields = ['filename', 'file_type', 'size', 'uploaded_at']


class ProjectSerializer(serializers.ModelSerializer):
    updated_by = UserSerializer(read_only=True)
    position = serializers.IntegerField(required=False)
    updated_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='updated_by',
        write_only=True, required=False
    )
    project_teams = ProjectTeamSerializer(many=True, read_only=True)
    project_roles = ProjectRoleSerializer(many=True, read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    priority = serializers.ChoiceField(choices=Project.PRIORITY_CHOICES, default='medium')

    tags = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )

    attachment_files = ProjectAttachmentSerializer(many=True, read_only=True)

    @staticmethod
    def validate_tags(value):
        if value is None or value == "" or value == []:
            return []

        if isinstance(value, str):
            try:
                parsed_value = json.loads(value)
                if isinstance(parsed_value, str):
                    try:
                        parsed_value = json.loads(parsed_value)
                    except json.JSONDecodeError:
                        pass
                if isinstance(parsed_value, list):
                    return [str(item) for item in parsed_value]
                else:
                    return []
            except json.JSONDecodeError:
                return [tag.strip() for tag in value.split(',') if tag.strip()]

        if isinstance(value, dict):
            result = []
            for k in sorted(value.keys()):
                if value[k] is not None:
                    result.append(str(value[k]))
            return result

        if isinstance(value, list):
            return [str(item) for item in value]

        return [str(value)]

    class Meta:
        model = Project
        fields = '__all__'
