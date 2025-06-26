from django.db import models
from enum import Enum

class TaskStatus(Enum):
    NOT_STARTED = 1
    RUNNING = 2
    DONE = 3
    PAUSED = 4
    CANCELLED = 5

class Task(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(default="")
    created = models.DateTimeField("date created")
    status = models.IntegerField(choices=[(status.value, status.name) for status in TaskStatus])
    progressPercentage = models.IntegerField(default=0)
    results = models.TextField(default="")

    def __str__(self):
        return self.name
