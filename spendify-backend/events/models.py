from django.db import models

class Event(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=120)
    type = models.CharField(max_length=30)
    guests = models.PositiveIntegerField(default=0)
    total_amount = models.PositiveIntegerField(default=0)
    deposit = models.PositiveIntegerField(default=0)
    smoke_service = models.PositiveIntegerField(default=0)
    banner_service = models.PositiveIntegerField(default=0)
    phone = models.CharField(max_length=40, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date} - {self.name}"