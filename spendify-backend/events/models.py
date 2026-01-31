from django.db import models

from django.db import models

class Income(models.Model):
    date = models.DateField(db_index=True)
    title = models.CharField(max_length=120)
    amount = models.PositiveIntegerField(default=0)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date} - {self.title} ({self.amount})"


class Outcome(models.Model):
    WORKER_TYPES = [
        ("chefs", "Chefs"),
        ("musicians", "Musicians"),
        ("waiters", "Waiters"),
        ("dishwashers", "Dishwashers"),
        ("florewashers", "Floor Washers"),
        ("other", "Other"),
    ]

    date = models.DateField(db_index=True)
    worker_type = models.CharField(max_length=20, choices=WORKER_TYPES, default="other")
    name = models.CharField(max_length=120)
    salary = models.PositiveIntegerField(default=0)
    paid = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date} - {self.worker_type} - {self.name}"
    
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