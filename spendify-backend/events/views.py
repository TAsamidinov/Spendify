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

    event = Event.objects.filter(date=date).first()
    if not event:
        return Response({"event": None}, status=200)  # ✅ always JSON

    return Response(EventSerializer(event).data)

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