from datetime import timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from .serializers import EventSerializer

@api_view(["GET"])
def event_by_date(request):
    date = request.query_params.get("date")  # YYYY-MM-DD
    if not date:
        return Response({"error": "date is required"}, status=400)

    events = Event.objects.filter(date=date).order_by("created_at")

    return Response(
        {"events": EventSerializer(events, many=True).data},
        status=200
    )

@api_view(["POST"])
def save_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        event_date = serializer.validated_data["date"]

        # upsert: if date exists, update it
        existing = Event.objects.filter(date=event_date).first()
        if existing:
            serializer = EventSerializer(existing, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=200)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=400)

@api_view(["PUT"])
def update_event(request, pk: int):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "not found"}, status=404)

    serializer = EventSerializer(event, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)

    return Response(serializer.errors, status=400)

@api_view(["POST"])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=400)

@api_view(["GET"])
def future_events_count(request):
    tomorrow = timezone.localdate() + timedelta(days=1)
    count = Event.objects.filter(date__gte=tomorrow).count()
    return Response({"count": count})

@api_view(["GET"])
def booked_dates(request):
    dates = (
        Event.objects
        .values_list("date", flat=True)
        .distinct()
    )
    return Response({"dates": dates})