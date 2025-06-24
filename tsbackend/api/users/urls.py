from django.urls import path
from .views import (
    FriendRequestListCreateView,
    FriendRequestDetailView,
    FriendRequestSentListView,
    FriendRequestAcceptView,
    FriendRequestRejectView,
    FriendshipListView,
    FriendshipDeleteView,
    FriendSuggestionsView,
    UserListCreateView,
    UserRetrieveUpdateDeleteView,
    UserView
)

urlpatterns = [
    path('me/', UserView.as_view(), name='user-me'),
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('<uuid:pk>/', UserRetrieveUpdateDeleteView.as_view(), name='user-detail'),
    path('friend-requests/', FriendRequestListCreateView.as_view(), name='friend-requests-list-create'),
    path('friend-requests/<uuid:pk>/', FriendRequestDetailView.as_view(), name='friend-request-detail'),
    path('friend-requests/sent/', FriendRequestSentListView.as_view(), name='friend-requests-sent'),
    path('friend-requests/<uuid:pk>/accept/', FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path('friend-requests/<uuid:pk>/reject/', FriendRequestRejectView.as_view(), name='friend-request-reject'),

    # Friendship endpoints
    path('friends/', FriendshipListView.as_view(), name='friends-list'),
    path('friends/<uuid:pk>/', FriendshipDeleteView.as_view(), name='friend-delete'),
    path('friends/suggestions/', FriendSuggestionsView.as_view(), name='friend-suggestions'),
]
