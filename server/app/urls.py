from django.urls import path

from . import views

urlpatterns = [
    path("listTasks/", views.listTasks, name="listTasks"),
    path("createTask/", views.createTask, name="createTask"),
    path("deleteTask/", views.deleteTask, name="deleteTask"),
    path("updateTask/", views.updateTask, name="updateTask"),
]
