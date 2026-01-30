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

type EventForm = {
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

const emptyForm: EventForm = {
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

export function AddEventDialog({
  open,
  setOpen,
  date,
  onCreated,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  date: Date | undefined;
  onCreated?: (created: any) => void;
}) {
  const [form, setForm] = React.useState<EventForm>(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const isValid =
    form.name.trim().length > 0 &&
    form.type.trim().length > 0 &&
    form.guests.trim().length > 0 &&
    form.totalAmount.trim().length > 0 &&
    form.deposit.trim().length > 0 &&
    form.phone.trim().length > 0;

  // ✅ reset form each time dialog opens
  React.useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
  }, [open]);

  async function onSave() {
    if (!date) return;

    const payload = {
      date: format(date, "yyyy-MM-dd"),
      name: form.name,
      type: form.type,
      guests: form.guests || "0",
      total_amount: form.totalAmount || "0",
      deposit: form.deposit || "0",
      smoke_service: form.smokeService || "0",
      banner_service: form.bannerService || "0",
      phone: form.phone,
      notes: form.notes,
    };

    setSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/events/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Save failed", await res.text());
        return;
      }

      const created = await res.json();
      onCreated?.(created);

      setOpen(false);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {date ? format(date, "d LLLL, yyyy", { locale: ru }) : "Дата"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">ФИО *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Аят Кулуев Жийда"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Тойдун түрү *</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
                required
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

            <div className="grid gap-2">
              <Label htmlFor="guests">Адам саны *</Label>
              <Input
                id="guests"
                inputMode="numeric"
                placeholder="250"
                value={form.guests}
                onChange={(e) =>
                  setForm((p) => ({ ...p, guests: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="total">Акчасы *</Label>
              <Input
                id="total"
                inputMode="numeric"
                placeholder="45000"
                value={form.totalAmount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, totalAmount: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deposit">Заклад *</Label>
              <Input
                id="deposit"
                inputMode="numeric"
                placeholder="5000"
                value={form.deposit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deposit: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="smoke">Дым</Label>
              <Input
                id="smoke"
                inputMode="numeric"
                placeholder="2000"
                value={form.smokeService}
                onChange={(e) =>
                  setForm((p) => ({ ...p, smokeService: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="banner">Банер</Label>
              <Input
                id="banner"
                inputMode="numeric"
                placeholder="1000"
                value={form.bannerService}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bannerService: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Номери*</Label>
            <Input
              id="phone"
              placeholder="0 XXX XXX XXX"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Эскертүү</Label>
            <Textarea
              id="notes"
              placeholder="Мисалы: саат 12 башталат, тамак бизден..."
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          <Button onClick={onSave} disabled={!date || saving || !isValid}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
