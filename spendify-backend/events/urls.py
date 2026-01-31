from django.urls import path
from .views import (
    booked_dates, event_by_date, create_event, future_events_count, update_event,
    income_by_date, create_income, update_income, delete_income,
    outcome_by_date, create_outcome, update_outcome, delete_outcome,
)

urlpatterns = [
    # events
    path("by-date/", event_by_date),
    path("create/", create_event),
    path("<int:pk>/", update_event),
    path("future-count/", future_events_count),
    path("booked-dates/", booked_dates),

    # income
    path("income/by-date/", income_by_date),
    path("income/create/", create_income),
    path("income/<int:pk>/", update_income),
    path("income/<int:pk>/delete/", delete_income),

    # outcome
    path("outcome/by-date/", outcome_by_date),
    path("outcome/create/", create_outcome),
    path("outcome/<int:pk>/", update_outcome),
    path("outcome/<int:pk>/delete/", delete_outcome),
]