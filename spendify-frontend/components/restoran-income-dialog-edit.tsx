"use client";

import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IncomeRow } from "./restoran-income";

type Props = {
  row: IncomeRow;
  date: Date;
  onSave: (patch: Partial<IncomeRow>) => void;
  trigger: React.ReactNode;
};

export function RestoranIncomeDialogEdit({ row, date, onSave, trigger }: Props) {
  const [open, setOpen] = React.useState(false);

  const [title, setTitle] = React.useState(row.title ?? "");
  const [amount, setAmount] = React.useState(row.amount ?? "");
  const [note, setNote] = React.useState(row.note ?? "");

  React.useEffect(() => {
    if (!open) return;
    setTitle(row.title ?? "");
    setAmount(row.amount ?? "");
    setNote(row.note ?? "");
  }, [open, row]);

  function save() {
    onSave({
      title: title.trim(),
      amount: amount.trim(),
      note: note.trim(),
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Edit income</DialogTitle>
          <DialogDescription>
            Editing{" "}
            <span className="font-medium">{row.title || "—"}</span> for{" "}
            <span className="font-medium">
              {format(date, "d MMMM yyyy", { locale: ru })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Аталышы</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Сумма</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
            />
          </div>

          <div className="grid gap-2">
            <Label>Эскертүү (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}