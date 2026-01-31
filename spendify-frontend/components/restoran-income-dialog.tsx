"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type NewIncomeRow = {
  title: string;
  amount: string;
  note?: string;
};

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  title?: string;
  onSave: (row: NewIncomeRow) => void;
};

export function RestoranIncomeDialog({ open, setOpen, title, onSave }: Props) {
  const [form, setForm] = React.useState<NewIncomeRow>({
    title: "",
    amount: "",
    note: "",
  });

  React.useEffect(() => {
    if (!open) return;
    setForm({ title: "", amount: "", note: "" });
  }, [open]);

  const canSave =
    form.title.trim().length > 0 && form.amount.trim().length > 0;

  function handleSave() {
    onSave({
      title: form.title.trim(),
      amount: form.amount.trim(),
      note: form.note?.trim() || "",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Кошуу: Киреше"}</DialogTitle>
          <DialogDescription>
            Киреше маалыматтарын толтуруңуз.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Аталышы</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Мисалы: Банкет"
            />
          </div>

          <div className="space-y-2">
            <Label>Сумма</Label>
            <Input
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              inputMode="decimal"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Эскертүү (милдеттүү эмес)</Label>
            <Input
              value={form.note ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="Кыскача..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
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