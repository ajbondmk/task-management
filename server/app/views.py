from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Task
from .models import TaskStatus

valid_status_transitions = {
    TaskStatus.NOT_STARTED.value: [TaskStatus.RUNNING.value, TaskStatus.CANCELLED.value],
    TaskStatus.RUNNING.value: [TaskStatus.PAUSED.value, TaskStatus.CANCELLED.value],
    TaskStatus.DONE.value: [],
    TaskStatus.PAUSED.value: [TaskStatus.RUNNING.value, TaskStatus.CANCELLED.value],
    TaskStatus.CANCELLED.value: [TaskStatus.RUNNING.value],
}

# Returns the list of all tasks in the database, ordered by creation date (most recent first).
def listTasks(request):
    latest_task_list = Task.objects.order_by("-created")
    return JsonResponse(list(latest_task_list.values()), safe=False)

# Given a name and description, creates a new task in the database.
@csrf_exempt
def createTask(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        description = data.get("description")
        if not name:
            return JsonResponse({"error": "Task name is required"}, status=400)
        Task.objects.create(name=name, description=description, created=timezone.now(), status=TaskStatus.NOT_STARTED.value)
        return JsonResponse({"status": "Task created"})
    return JsonResponse({"error": "POST request required"}, status=405)

# Given a task ID, deletes that task from the database.
@csrf_exempt
def deleteTask(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        if not id:
            return JsonResponse({"error": "Task ID is required"}, status=400)
        if not Task.objects.filter(id=id).exists():
            return JsonResponse({"error": "Task not found"}, status=404)
        Task.objects.filter(id=id).delete()
        return JsonResponse({"status": "Task deleted"})
    return JsonResponse({"error": "POST request required"}, status=405)

# Given a task ID, name, and description, updates the name and description of that task.
@csrf_exempt
def updateTask(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        name = data.get("name")
        description = data.get("description")
        if not id:
            return JsonResponse({"error": "Task ID is required"}, status=400)
        if not Task.objects.filter(id=id).exists():
            return JsonResponse({"error": "Task not found"}, status=404)
        if not name:
            return JsonResponse({"error": "Task name is required"}, status=400)
        Task.objects.filter(id=id).update(name=name, description=description)
        return JsonResponse({"status": "Task updated"})
    return JsonResponse({"error": "POST request required"}, status=405)

# Given a task ID and a status, updates the status of that task.
# Will only perform this update if the status transition is valid.
@csrf_exempt
def updateTaskStatus(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        status = data.get("status")
        if not id:
            return JsonResponse({"error": "Task ID is required"}, status=400)
        if not Task.objects.filter(id=id).exists():
            return JsonResponse({"error": "Task not found"}, status=404)
        oldStatus = Task.objects.get(id=id).status
        if oldStatus not in valid_status_transitions or status not in valid_status_transitions[oldStatus]:
            return JsonResponse({"error": "Invalid status transition"}, status=400)
        Task.objects.filter(id=id).update(status=status)
        if status == TaskStatus.CANCELLED.value:
            Task.objects.filter(id=id).update(progressPercentage=0)
        return JsonResponse({"status": "Task status updated"})
    return JsonResponse({"error": "POST request required"}, status=405)
