from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.views import APIView
from ..permissions import IsAdmin
from ..users.serializers import UserSerializer
from rest_framework import  status
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from ..models.models import User, FriendRequest, Friendship
from .serializers import (
    FriendRequestSerializer,
    CreateFriendRequestSerializer,
    FriendshipSerializer,
    UserBasicSerializer
)

User = get_user_model()


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class UserRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class FriendRequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(
            to_user=self.request.user,
            status='PENDING'
        ).order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateFriendRequestSerializer
        return FriendRequestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context


class FriendRequestDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return FriendRequest.objects.filter(
            to_user=user
        ).order_by('-created_at')


class FriendRequestSentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return FriendRequest.objects.filter(
            from_user=user
        ).order_by('-created_at')


class FriendRequestAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        friend_request = get_object_or_404(FriendRequest, pk=pk, to_user=request.user)

        if friend_request.status != 'PENDING':
            return Response(
                {"detail": "This friend request has already been processed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        friend_request.status = 'ACCEPTED'
        friend_request.save()

        Friendship.objects.create(user=friend_request.to_user, friend=friend_request.from_user)
        Friendship.objects.create(user=friend_request.from_user, friend=friend_request.to_user)

        return Response({"detail": "Friend request accepted."}, status=status.HTTP_200_OK)


class FriendRequestRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        friend_request = get_object_or_404(FriendRequest, pk=pk, to_user=request.user)

        if friend_request.status != 'PENDING':
            return Response(
                {"detail": "This friend request has already been processed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        friend_request.status = 'REJECTED'
        friend_request.save()

        return Response({"detail": "Friend request rejected."}, status=status.HTTP_200_OK)


class FriendshipListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        return Friendship.objects.filter(user=self.request.user).order_by('-created_at')


class FriendshipDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def delete(self, request, pk):
        friendship = get_object_or_404(Friendship, pk=pk, user=request.user)
        user = request.user
        friend = friendship.friend

        Friendship.objects.filter(user=user, friend=friend).delete()
        Friendship.objects.filter(user=friend, friend=user).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class FriendSuggestionsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserBasicSerializer

    def get_queryset(self):
        user = self.request.user

        current_friends = Friendship.objects.filter(user=user).values_list('friend_id', flat=True)

        pending_sent = FriendRequest.objects.filter(
            from_user=user,
            status='PENDING'
        ).values_list('to_user_id', flat=True)

        pending_received = FriendRequest.objects.filter(
            to_user=user,
            status='PENDING'
        ).values_list('from_user_id', flat=True)

        excluded_users = list(current_friends) + list(pending_sent) + list(pending_received) + [user.id]

        return User.objects.exclude(id__in=excluded_users)[:10]