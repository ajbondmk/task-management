from django.urls import path

from . import views

urlpatterns = [
    path("listTasks/", views.listTasks, name="listTasks"),
]
