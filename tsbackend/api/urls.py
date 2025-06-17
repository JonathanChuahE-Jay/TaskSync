from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.auth.urls')),
    path('projects/', include('api.projects.urls')),
    path('users/', include('api.users.urls')),
]
