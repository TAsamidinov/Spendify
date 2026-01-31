from django.contrib import admin
from .models import Event, Income, Outcome

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("date", "name", "type", "guests", "total_amount", "deposit", "created_at")
    list_filter = ("date", "type")
    search_fields = ("name", "phone")

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ("date", "title", "amount", "created_at")
    list_filter = ("date",)
    search_fields = ("title", "note")

@admin.register(Outcome)
class OutcomeAdmin(admin.ModelAdmin):
    list_display = ("date", "worker_type", "name", "salary", "paid", "created_at")
    list_filter = ("date", "worker_type")
    search_fields = ("name",)