"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

export function EventDetailDialog({
  open,
  setOpen,
  event,
  onUpdated,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  event: EventDTO | null;
  onUpdated: (updated: EventDTO) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // ✅ keep draft always defined (we'll reset it when event changes)
  const [draft, setDraft] = React.useState<EventDTO>({
    id: 0,
    date: "",
    name: "",
    type: "",
    guests: 0,
    total_amount: 0,
    deposit: 0,
    smoke_service: 0,
    banner_service: 0,
    phone: "",
    notes: "",
    created_at: "",
  });

  // ✅ reset on open + when event changes
  React.useEffect(() => {
    if (!open) return;
    setIsEditing(false);

    if (event) {
      setDraft({
        ...event,
        guests: Number(event.guests ?? 0),
        total_amount: event.total_amount ?? 0,
        deposit: event.deposit ?? 0,
        smoke_service: event.smoke_service ?? 0,
        banner_service: event.banner_service ?? 0,
      });
    }
  }, [open, event]);

  // ✅ If no event selected, show simple dialog (no TS errors)
  if (!event) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">No event selected.</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/events/${event!.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          guests: Number(draft.guests || 0),
          total_amount: Number(draft.total_amount || 0),
          deposit: Number(draft.deposit || 0),
          smoke_service: Number(draft.smoke_service || 0),
          banner_service: Number(draft.banner_service || 0),
        }),
      });

      if (!res.ok) {
        console.error("Update failed:", await res.text());
        return;
      }

      const updated: EventDTO = await res.json();
      onUpdated(updated);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const disabled = !isEditing || saving;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Event #{event.id}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {event.date}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>ФИО</Label>
            <Input
              value={draft.name}
              disabled={disabled}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Input
                value={draft.type}
                disabled={disabled}
                onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Guests</Label>
              <Input
                inputMode="numeric"
                value={String(draft.guests ?? 0)}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, guests: Number(e.target.value || 0) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Total</Label>
              <Input
                inputMode="numeric"
                value={String(draft.total_amount ?? 0)}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    total_amount: Number(e.target.value || 0),
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Deposit</Label>
              <Input
                inputMode="numeric"
                value={String(draft.deposit ?? 0)}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, deposit: Number(e.target.value || 0) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Smoke</Label>
              <Input
                inputMode="numeric"
                value={String(draft.smoke_service ?? 0)}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    smoke_service: Number(e.target.value || 0),
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Banner</Label>
              <Input
                inputMode="numeric"
                value={String(draft.banner_service ?? 0)}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    banner_service: Number(e.target.value || 0),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input
              value={draft.phone ?? ""}
              disabled={disabled}
              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              value={draft.notes ?? ""}
              disabled={disabled}
              onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}