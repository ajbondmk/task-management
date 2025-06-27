"""
URL configuration for src project.
"""
from django.urls import include, path

urlpatterns = [
    path("", include("app.urls")),
]