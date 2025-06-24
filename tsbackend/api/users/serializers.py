from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models.models import User, FriendRequest, Friendship

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'role', 'profile_picture'
        ]
        read_only_fields = ['id']
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method in ['PUT', 'PATCH']:
            self.fields['username'].required = False


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'profile_picture']
        read_only_fields = fields


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserBasicSerializer(read_only=True)
    to_user = UserBasicSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'status', 'created_at']
        read_only_fields = ['id', 'created_at', 'from_user']


class CreateFriendRequestSerializer(serializers.ModelSerializer):
    to_user_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = FriendRequest
        fields = ['to_user_id']

    def validate_to_user_id(self, value):
        request = self.context.get('request')
        from_user = request.user

        try:
            to_user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")

        if to_user == from_user:
            raise serializers.ValidationError("You cannot send a friend request to yourself")

        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user, status='PENDING').exists():
            raise serializers.ValidationError("A pending friend request already exists")

        if Friendship.objects.filter(user=from_user, friend=to_user).exists():
            raise serializers.ValidationError("You are already friends with this user")

        return value

    def create(self, validated_data):
        to_user_id = validated_data.pop('to_user_id')
        to_user = User.objects.get(id=to_user_id)
        from_user = self.context['request'].user

        return FriendRequest.objects.create(
            from_user=from_user,
            to_user=to_user,
            status='PENDING'
        )


class FriendshipSerializer(serializers.ModelSerializer):
    friend = UserBasicSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'friend', 'created_at']
        read_only_fields = fields