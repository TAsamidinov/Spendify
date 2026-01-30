from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("date", "name", "type", "guests", "total_amount", "deposit", "created_at")
    list_filter = ("date", "type")
    search_fields = ("name", "phone")