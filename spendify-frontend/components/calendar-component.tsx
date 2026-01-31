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
  const [openCreate, setOpenCreate] = React.useState(false);

  const [events, setEvents] = React.useState<EventDTO[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventDTO | null>(
    null
  );

  const [date, setDate] = React.useState<Date | undefined>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

  const bookedKeys = React.useMemo(() => {
    return new Set(bookedDates.map((d) => format(d, "yyyy-MM-dd")));
  }, [bookedDates]);

  const loadBookedDates = React.useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/events/booked-dates/`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      function toLocalDate(input: string) {
        // works for "YYYY-MM-DD" and also "YYYY-MM-DDTHH:mm:ssZ"
        const datePart = input.slice(0, 10); // "2026-01-28"
        const [y, m, d] = datePart.split("-").map(Number);
        return new Date(y, m - 1, d, 12, 0, 0); // ✅ noon avoids DST/timezone shifts
      }

      const mapped = (data.dates ?? []).map(toLocalDate);
      console.log("booked-dates mapped:", mapped);

      setBookedDates(mapped);
    } catch (err) {
      console.error("Failed to load booked dates", err);
    }
  }, []);

  React.useEffect(() => {
    loadBookedDates();
  }, [loadBookedDates]);

  async function refreshDay(d: Date) {
    const res = await fetch(
      `${API}/api/events/by-date/?date=${format(d, "yyyy-MM-dd")}`
    );
    const data = await res.json();
    setEvents(data.events ?? []);
  }

  async function openForDate(d: Date) {
    setDate(d);
    setOpenList(true);
    await refreshDay(d);
  }

  function openEventDetails(ev: EventDTO) {
    setSelectedEvent(ev);
    setOpenDetail(true);
  }

  return (
    <>
      <Card className="mx-auto w-[300px] rounded-sm">
        <CardContent className="flex justify-center p-0 pt-6">
          <Calendar
            locale={ru}
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            onDayClick={(d) => openForDate(d)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            captionLayout="dropdown"
            modifiers={{
              booked: (day) => bookedKeys.has(format(day, "yyyy-MM-dd")),
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through [&>button]:opacity-100",
            }}
            className="mx-auto p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>

        <EventsListDialog
          open={openList}
          setOpen={setOpenList}
          date={date}
          events={events}
          onPickEvent={openEventDetails}
          onAddEvent={() => {
            setOpenList(false);
            setOpenCreate(true);
          }}
        />

        <EventDetailDialog
          open={openDetail}
          setOpen={setOpenDetail}
          event={selectedEvent}
          date={date}
          onUpdated={async (updated) => {
            setSelectedEvent(updated);
            if (date) await refreshDay(date);
            await loadBookedDates();
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
        onCreated={async () => {
          if (!date) return;
          await refreshDay(date);
          await loadBookedDates();
          setOpenList(true);
        }}
      />
    </>
  );
}
