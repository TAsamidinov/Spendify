from django.urls import path
from .views import event_by_date, create_event, future_events_count, update_event

urlpatterns = [
    path("by-date/", event_by_date),
    path("create/", create_event),
    path("<int:pk>/", update_event),  # PUT
    path("future-count/", future_events_count), # future events
]