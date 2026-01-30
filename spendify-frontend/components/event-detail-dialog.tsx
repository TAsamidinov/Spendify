"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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

import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";

type EventDTO = {
  id: number;
  date: string; // "YYYY-MM-DD" from backend
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

type Draft = {
  name: string;
  type: string;
  guests: string;

  totalAmount: string;
  deposit: string;

  smokeService: string;
  bannerService: string;

  phone: string;
  notes: string;
};

const emptyDraft: Draft = {
  name: "",
  type: "",
  guests: "",
  totalAmount: "",
  deposit: "",
  smokeService: "",
  bannerService: "",
  phone: "",
  notes: "",
};

const API = "http://127.0.0.1:8000";

export function EventDetailDialog({
  open,
  setOpen,
  event,
  date, // you pass Date from calendar for header formatting
  onUpdated,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  event: EventDTO | null;
  date: Date | undefined;
  onUpdated: (updated: EventDTO) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);

  // when dialog opens or event changes -> load into draft, view mode
  React.useEffect(() => {
    if (!open) return;

    setIsEditing(false);

    if (!event) {
      setDraft(emptyDraft);
      return;
    }

    setDraft({
      name: event.name ?? "",
      type: event.type ?? "",
      guests: event.guests?.toString?.() ?? String(event.guests ?? 0),

      totalAmount: event.total_amount?.toString?.() ?? String(event.total_amount ?? 0),
      deposit: event.deposit?.toString?.() ?? String(event.deposit ?? 0),

      smokeService: event.smoke_service?.toString?.() ?? String(event.smoke_service ?? 0),
      bannerService: event.banner_service?.toString?.() ?? String(event.banner_service ?? 0),

      phone: event.phone ?? "",
      notes: event.notes ?? "",
    });
  }, [open, event]);

  // if no event selected
  if (!event) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Event</DialogTitle>
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

  const ev = event; // ✅ non-null alias
  const disabled = !isEditing || saving;

  async function saveEdit() {
    setSaving(true);
    try {
      const payload = {
        date: ev.date, // keep same date from backend
        name: draft.name,
        type: draft.type,
        guests: Number(draft.guests || 0),
        total_amount: Number(draft.totalAmount || 0),
        deposit: Number(draft.deposit || 0),
        smoke_service: Number(draft.smokeService || 0),
        banner_service: Number(draft.bannerService || 0),
        phone: draft.phone,
        notes: draft.notes,
      };

      const res = await fetch(`${API}/api/events/${ev.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {date ? format(date, "d LLLL, yyyy", { locale: ru }) : ev.date}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* ФИО */}
          <div className="grid gap-2">
            <Label htmlFor="name">ФИО</Label>
            <Input
              id="name"
              value={draft.name}
              disabled={disabled}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              placeholder="Аят Кулуев Жийда"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Тойдун түрү */}
            <div className="grid gap-2">
              <Label>Тойдун түрү</Label>
              <Select
                value={draft.type}
                onValueChange={(v) => setDraft((p) => ({ ...p, type: v }))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Тандаңыз" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Суннот">Суннот той</SelectItem>
                  <SelectItem value="Үйлөнүү той">Үйлөнүү той</SelectItem>
                  <SelectItem value="Кыз узатуу">Кыз узатуу</SelectItem>
                  <SelectItem value="Туулган күн">Туулган күн</SelectItem>
                  <SelectItem value="Корпоротив">Корпоротив</SelectItem>
                  <SelectItem value="Башка">Башка</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Адам саны */}
            <div className="grid gap-2">
              <Label htmlFor="guests">Адам саны</Label>
              <Input
                id="guests"
                inputMode="numeric"
                placeholder="250"
                value={draft.guests}
                disabled={disabled}
                onChange={(e) => setDraft((p) => ({ ...p, guests: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Акчасы */}
            <div className="grid gap-2">
              <Label htmlFor="total">Акчасы</Label>
              <Input
                id="total"
                inputMode="numeric"
                placeholder="45000"
                value={draft.totalAmount}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, totalAmount: e.target.value }))
                }
              />
            </div>

            {/* Заклад */}
            <div className="grid gap-2">
              <Label htmlFor="deposit">Заклад</Label>
              <Input
                id="deposit"
                inputMode="numeric"
                placeholder="5000"
                value={draft.deposit}
                disabled={disabled}
                onChange={(e) => setDraft((p) => ({ ...p, deposit: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Дым */}
            <div className="grid gap-2">
              <Label htmlFor="smoke">Дым</Label>
              <Input
                id="smoke"
                inputMode="numeric"
                placeholder="2000"
                value={draft.smokeService}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, smokeService: e.target.value }))
                }
              />
            </div>

            {/* Банер */}
            <div className="grid gap-2">
              <Label htmlFor="banner">Банер</Label>
              <Input
                id="banner"
                inputMode="numeric"
                placeholder="1000"
                value={draft.bannerService}
                disabled={disabled}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, bannerService: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Номери */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Номери</Label>
            <Input
              id="phone"
              placeholder="0 XXX XXX XXX"
              value={draft.phone}
              disabled={disabled}
              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          {/* Эскертүү */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Эскертүү</Label>
            <Textarea
              id="notes"
              placeholder="Мисалы: саат 12 башталат, тамак бизден..."
              value={draft.notes}
              disabled={disabled}
              onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Жабуу</Button>
          </DialogClose>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Өзгөртүү</Button>
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