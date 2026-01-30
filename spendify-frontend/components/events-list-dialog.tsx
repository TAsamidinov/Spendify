"use client";

import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

export function EventsListDialog({
  open,
  setOpen,
  date,
  events,
  onPickEvent,
  onAddEvent,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  date: Date | undefined;
  events: EventDTO[];
  onPickEvent: (ev: EventDTO) => void;
  onAddEvent: () => void;
}) {
  const dateLabel = date
    ? format(date, "d LLLL, yyyy", { locale: ru })
    : "Дата";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Тойлор</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-2">
          {events.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Бул күн той жок.
            </div>
          ) : (
            events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => onPickEvent(ev)}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-left hover:bg-muted"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{ev.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {ev.type} • {ev.guests ?? 0} киши
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">#</div>
              </button>
            ))
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Жабуу</Button>
          </DialogClose>

          <Button onClick={onAddEvent}>Жаңы той кошуу</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
