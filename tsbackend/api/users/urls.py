from django.urls import path
from .views import UserListCreateView, UserRetrieveUpdateDeleteView, UserView

urlpatterns = [
    path('me/', UserView.as_view(), name='user-me'),
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('<uuid:pk>/', UserRetrieveUpdateDeleteView.as_view(), name='user-detail'),
]
