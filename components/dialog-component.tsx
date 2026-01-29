"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  aty: string;
  turu: string;
  akchasy: string;
  zaklad: string;
  dym: string;
  baner: string;
  nomeri: string;
  baskka: string;
  sany: string;
};

const emptyForm: EventForm = {
  aty: "",
  turu: "",
  akchasy: "",
  zaklad: "",
  dym: "",
  baner: "",
  nomeri: "",
  baskka: "",
  sany: "",
};

export function DialogComponent({
  open,
  setOpen,
  date,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  date: Date | undefined;
}) {
  const [form, setForm] = React.useState<EventForm>(emptyForm);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {/* Header - date */}
        <DialogHeader>
          <DialogTitle className="text-center">
            {date ? format(date, "d LLLL, yyyy", { locale: ru }) : "Дата"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Аты */}
          <div className="grid gap-2">
            <Label htmlFor="name">ФИО</Label>
            <Input
              id="name"
              value={form.aty}
              onChange={(e) => setForm((p) => ({ ...p, aty: e.target.value }))}
              placeholder="Аят Кулуев Жийда"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Тойдун түрү */}
            <div className="grid gap-2">
              <Label>Тойдун түрү</Label>
              <Select
                value={form.turu}
                onValueChange={(v) => setForm((p) => ({ ...p, turu: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Тандаңыз" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="суннот">Суннот той</SelectItem>
                  <SelectItem value="баш кошуу">үйлөнүү той</SelectItem>
                  <SelectItem value="кыз узатуу">Кыз узатуу</SelectItem>
                  <SelectItem value="туулган күн">Туулган күн</SelectItem>
                  <SelectItem value="Корпоротив">Корпоротив</SelectItem>
                  <SelectItem value="башка">Башка</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Адам саны */}
            <div className="grid gap-2">
              <Label htmlFor="deposit">Адам саны</Label>
              <Input
                id="amount"
                inputMode="numeric"
                placeholder="250"
                value={form.sany}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
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
                value={form.akchasy}
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
                value={form.zaklad}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deposit: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Services row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Дым услуга */}
            <div className="grid gap-2">
              <Label htmlFor="smoke">Дым </Label>
              <Input
                id="smoke"
                inputMode="numeric"
                placeholder="2000"
                value={form.dym}
                onChange={(e) =>
                  setForm((p) => ({ ...p, smokeService: e.target.value }))
                }
              />
            </div>

            {/* Банер услуга */}
            <div className="grid gap-2">
              <Label htmlFor="banner">Банер </Label>
              <Input
                id="banner"
                inputMode="numeric"
                placeholder="1000"
                value={form.baner}
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
              value={form.nomeri}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>

          {/* Notes (optional but useful) */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Эскертүү</Label>
            <Textarea
              id="notes"
              placeholder="Мисалы: саат 12 башталат, тамак бизден..."
              value={form.baskka}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
