from django.http import JsonResponse

def listTasks(request):
    return JsonResponse({"name": "Hello, world"})