"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { AddEventDialog } from "./add-event-dialog";
import { EventDetailDialog } from "./event-detail-dialog";
import { EventsListDialog } from "./events-list-dialog";
type EventDTO = {
  id: number;
  date: string;
  name: string;
  type: string;
  guests: number;
  total_amount: number | string;
  deposit: number | string;
  smoke_service: number | string;
  banner_service: number | string;
  phone: string;
  notes: string;
  created_at: string;
};
const API = "http://127.0.0.1:8000";

export function CalendarComponent() {
  const [openList, setOpenList] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [events, setEvents] = React.useState<EventDTO[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventDTO | null>(
    null
  );

  function openEventDetails(ev: EventDTO) {
    setSelectedEvent(ev);
    setOpenDetail(true);
  }

  const [open, setOpen] = React.useState(false);

  const [eventData, setEventData] = React.useState<any | null>(null);

  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [openCreate, setOpenCreate] = React.useState(false);
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

  React.useEffect(() => {
    async function loadBookedDates() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/events/booked-dates/"
        );
        const data = await res.json();

        setBookedDates(data.dates.map((d: string) => new Date(d)));
      } catch (err) {
        console.error("Failed to load booked dates", err);
      }
    }

    loadBookedDates();
  }, []);

  async function refreshDay() {
    if (!date) return;
    const res = await fetch(
      `${API}/api/events/by-date/?date=${format(date, "yyyy-MM-dd")}`
    );
    const data = await res.json();
    setEvents(data.events ?? []);
  }
  async function openForDate(d: Date) {
    setDate(d);
    setOpenList(true);

    const res = await fetch(
      `${API}/api/events/by-date/?date=${format(d, "yyyy-MM-dd")}`
    );
    const data = await res.json(); // { events: [] }
    setEvents(data.events ?? []);
  }

  return (
    <>
      <Card className="mx-auto w-[300px]">
        <CardContent className="flex justify-center p-0 pt-6">
          <Calendar
            locale={ru}
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (!d) return;
              setDate(d);
            }}
            onDayClick={(d) => {
              openForDate(d);
            }}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            captionLayout="dropdown"
            modifiers={{ booked: bookedDates }}
            modifiersClassNames={{
              booked: "[&>button]:line-through [&>button]:opacity-100",
            }}
            className="mx-auto p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>

        {/* Dialog #1: List */}
        <EventsListDialog
          open={openList}
          setOpen={setOpenList}
          date={date}
          events={events}
          onPickEvent={(ev) => openEventDetails(ev)}
          onAddEvent={() => {
            setOpenList(false); // close list
            setOpenCreate(true); // open create dialog
          }}
        />

        {/* Dialog #2: Details */}
        <EventDetailDialog
          open={openDetail}
          setOpen={setOpenDetail}
          event={selectedEvent}
          date={date}
          onUpdated={async (updated) => {
            // update selected + refresh list
            setSelectedEvent(updated);
            await refreshDay();
          }}
        />

        <CardFooter className="flex flex-wrap gap-2 border-t">
          {[
            { label: "Кече", value: -1 },
            { label: "Бүгүн", value: 0 },
            { label: "Эртеге", value: 1 },
            { label: "1 айда", value: 30 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value);
                setDate(newDate);
                setCurrentMonth(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                );
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>

      <AddEventDialog
        open={openCreate}
        setOpen={setOpenCreate}
        date={date}
        onCreated={() => {
          // optional: refresh events list for this day
          openForDate(date!); // or call your fetchEventsByDate()
        }}
      />
    </>
  );
}
