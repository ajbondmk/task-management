from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Task
from .models import TaskStatus

def getTask(request):
    task = Task.objects.first()
    if task is None:
        return JsonResponse({"error": "No tasks found"}, status=404)
    return JsonResponse({"name": task.name})

def listTasks(request):
    latest_task_list = Task.objects.order_by("-created")
    return JsonResponse(list(latest_task_list.values()), safe=False)

@csrf_exempt
def createTask(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        if not name:
            return JsonResponse({"error": "Task name is required"}, status=400)
        Task.objects.create(name=name, created=timezone.now(), status=TaskStatus.NOT_STARTED.value)
        return JsonResponse({"status": "Task created"})
    return JsonResponse({"error": "POST request required"}, status=405)

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
