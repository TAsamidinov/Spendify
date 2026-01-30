"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { DialogCreateToi } from "./dialog-component";

export function CalendarComponent() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  );
  const [open, setOpen] = React.useState(false);

  const [eventData, setEventData] = React.useState<any | null>(null);

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const bookedDates = React.useMemo(
    () =>
      Array.from(
        { length: 15 },
        (_, i) => new Date(new Date().getFullYear(), 1, 12 + i)
      ),
    []
  );
  async function openForDate(d: Date) {
    setDate(d)
    setOpen(true)
  
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/events/by-date/?date=${format(d, "yyyy-MM-dd")}`
      )
  
      if (!res.ok) {
        setEventData(null)
        return
      }
  
      const data = await res.json() // ✅ event object directly
      setEventData(data)            // ✅ set it directly
    } catch (err) {
      console.error(err)
      setEventData(null)
    }
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
              openForDate(d);
            }}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            captionLayout="dropdown"
            modifiers={{ booked: bookedDates }} // only styling
            modifiersClassNames={{
              booked: "[&>button]:line-through [&>button]:opacity-70", // looks booked but clickable
            }}
            className="mx-auto p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>

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
      <DialogCreateToi
        open={open}
        setOpen={setOpen}
        date={date}
        eventData={eventData}
      />
    </>
  );
}
