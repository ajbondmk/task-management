from django.db import models

class Task(models.Model):
    name = models.CharField(max_length=200)
    created = models.DateTimeField("date created")

    def __str__(self):
        return self.name
