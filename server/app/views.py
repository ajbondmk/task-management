from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Task

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
        Task.objects.create(name=name, created=timezone.now())
        return JsonResponse({"status": "Task created"})
    return JsonResponse({"error": "POST request required"}, status=405)
