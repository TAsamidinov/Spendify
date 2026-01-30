from django.urls import path
from .views import event_by_date, save_event

urlpatterns = [
    path("by-date/", event_by_date),
    path("save/", save_event),
]