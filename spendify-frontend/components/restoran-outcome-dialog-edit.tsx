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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ru } from "date-fns/locale";
import { format } from "date-fns";

type Row = {
  id: string;
  name: string;
  salary: string;
  paid: string;
};

type Props = {
  row: Row;
  onSave: (patch: Partial<Row>) => void;
  date: Date;
  trigger: React.ReactNode;
};

export function RestoranDialogEdit({ row, onSave, date, trigger }: Props) {
  const [open, setOpen] = React.useState(false);

  const [name, setName] = React.useState(row.name ?? "");
  const [salary, setSalary] = React.useState(row.salary ?? "");
  const [paid, setPaid] = React.useState(row.paid ?? "");

  // When dialog opens (or row changes), sync inputs
  React.useEffect(() => {
    if (!open) return;
    setName(row.name ?? "");
    setSalary(row.salary ?? "");
    setPaid(row.paid ?? "");
  }, [open, row]);

  function handleSave() {
    onSave({
      name: name.trim(),
      salary: salary.trim(),
      paid: paid.trim(),
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Айлыкты өзгөртүү</DialogTitle>
          <DialogDescription>
            <span className="font-medium">
              {format(date, "d MMMM yyyy")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor={`name-${row.id}`}>Аты</Label>
            <Input
              id={`name-${row.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Worker name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor={`salary-${row.id}`}>Айлык</Label>
              <Input
                id={`salary-${row.id}`}
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                inputMode="decimal"
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`paid-${row.id}`}>Алганы</Label>
              <Input
                id={`paid-${row.id}`}
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                inputMode="decimal"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
