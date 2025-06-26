from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Task
from .models import TaskStatus

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

@csrf_exempt
def updateTask(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        name = data.get("name")
        if not id:
            return JsonResponse({"error": "Task ID is required"}, status=400)
        if not Task.objects.filter(id=id).exists():
            return JsonResponse({"error": "Task not found"}, status=404)
        if not name:
            return JsonResponse({"error": "Task name is required"}, status=400)
        Task.objects.filter(id=id).update(name=name)
        return JsonResponse({"status": "Task updated"})
    return JsonResponse({"error": "POST request required"}, status=405)

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
        Task.objects.filter(id=id).update(status=status)
        return JsonResponse({"status": "Task status updated"})
    return JsonResponse({"error": "POST request required"}, status=405)


# <!-- 
#     not started
#         in progress
#         (cancelled)
#     in progress
#         paused
#         (cancelled)
#     completed
#     paused
#         in progress
#         (cancelled)
#     cancelled
#         (in progress)
# -->