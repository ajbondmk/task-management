from django.urls import path

from . import views

urlpatterns = [
    path("listTasks/", views.listTasks, name="listTasks"),
    path("getTask/", views.getTask, name="getTask"),
    path("createTask/", views.createTask, name="createTask"),
]
