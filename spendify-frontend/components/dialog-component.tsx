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

export function DialogCreateToi({ open, setOpen, date, eventData }: any) {
  const [form, setForm] = React.useState<EventForm>(emptyForm);
  const [saving, setSaving] = React.useState(false);

  // ✅ LOAD existing event into the form when dialog opens / eventData changes
  React.useEffect(() => {
    if (!open) return;

    if (!eventData) {
      setForm(emptyForm);
      return;
    }
    console.log("Dialog got eventData:", eventData) // ✅ debug

    setForm({
      name: eventData.name ?? "",
      type: eventData.type ?? "",
      guests: eventData.guests?.toString() ?? "",
      totalAmount: eventData.total_amount?.toString() ?? "",
      deposit: eventData.deposit?.toString() ?? "",
      smokeService: eventData.smoke_service?.toString() ?? "",
      bannerService: eventData.banner_service?.toString() ?? "",
      phone: eventData.phone ?? "",
      notes: eventData.notes ?? "",
    });
  }, [eventData, open]);

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
      const res = await fetch("http://127.0.0.1:8000/api/events/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Save failed", await res.text());
        return;
      }

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
          {/* ФИО */}
          <div className="grid gap-2">
            <Label htmlFor="name">ФИО</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Аят Кулуев Жийда"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Тойдун түрү */}
            <div className="grid gap-2">
              <Label>Тойдун түрү</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Тандаңыз" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="суннот">Суннот той</SelectItem>
                  <SelectItem value="үйлөнүү той">Үйлөнүү той</SelectItem>
                  <SelectItem value="кыз узатуу">Кыз узатуу</SelectItem>
                  <SelectItem value="туулган күн">Туулган күн</SelectItem>
                  <SelectItem value="Корпоротив">Корпоротив</SelectItem>
                  <SelectItem value="башка">Башка</SelectItem>
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
                value={form.guests}
                onChange={(e) =>
                  setForm((p) => ({ ...p, guests: e.target.value }))
                }
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
                value={form.totalAmount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, totalAmount: e.target.value }))
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
                value={form.deposit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deposit: e.target.value }))
                }
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
                value={form.smokeService}
                onChange={(e) =>
                  setForm((p) => ({ ...p, smokeService: e.target.value }))
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
                value={form.bannerService}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bannerService: e.target.value }))
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
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>

          {/* Эскертүү */}
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

          <Button onClick={onSave} disabled={!date || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}