"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type NewWorkerRow = {
  name: string;
  salary: string;
  paid: string;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  title: string;
  onSave: (row: NewWorkerRow) => void | Promise<void>;
};

const EMPTY: NewWorkerRow = { name: "", salary: "", paid: "" };

export function RestoranDialog({ open, setOpen, title, onSave }: Props) {
  const [form, setForm] = React.useState<NewWorkerRow>(EMPTY);

  React.useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  function setField<K extends keyof NewWorkerRow>(key: K, value: NewWorkerRow[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  const canSave = form.name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    await onSave(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ФИО</Label>
            <Input
              id="name"
              value={form.name}
              placeholder="Например: Аиша Жыргалбекова"
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Айлык</Label>
            <Input
              id="salary"
              value={form.salary}
              placeholder="0"
              inputMode="decimal"
              onChange={(e) => setField("salary", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paid">Алганы</Label>
            <Input
              id="paid"
              value={form.paid}
              placeholder="0"
              inputMode="decimal"
              onChange={(e) => setField("paid", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Жабуу
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Сактоо
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}