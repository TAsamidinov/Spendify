"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RestoranDialog, type NewWorkerRow } from "./restoran-dialog";
import { SquarePen, X } from "lucide-react";
import { RestoranDialogEdit } from "./restoran-dialog-edit";

type StaffRow = {
  id: string;
  name: string;
  salary: string;
  paid: string;
};

const WORKERS = {
  chefs: { title: "Повар", addLabel: "Кошуу" },
  musicians: { title: "Музыкант", addLabel: "Кошуу" },
  waiters: { title: "Официант", addLabel: "Кошуу" },
  dishwashers: { title: "Идиш жуучу", addLabel: "Кошуу" },
  other: { title: "Другое", addLabel: "Кошуу" },
} as const;

type WorkerKey = keyof typeof WORKERS;

const WORKER_ORDER: WorkerKey[] = [
  "chefs",
  "musicians",
  "waiters",
  "dishwashers",
  "other",
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function toNumberSafe(v: string) {
  const cleaned = v.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function money(v: number) {
  return v.toLocaleString();
}

export default function RestaurantPayrollPage() {
  const now = new Date();

  const [day, setDay] = React.useState(String(now.getDate()));
  const [month, setMonth] = React.useState(String(now.getMonth() + 1));
  const [year, setYear] = React.useState(String(now.getFullYear()));

  // IMPORTANT: explicit object init (no TS error)
  const [rowsByWorker, setRowsByWorker] = React.useState<
    Record<WorkerKey, StaffRow[]>
  >({
    chefs: [],
    musicians: [],
    waiters: [],
    dishwashers: [],
    other: [],
  });

  // Dialog state
  const [openCreate, setOpenCreate] = React.useState(false);
  const [createWorkerKey, setCreateWorkerKey] =
    React.useState<WorkerKey>("chefs");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const selectedDateLabel = React.useMemo(() => {
    const dd = day.padStart(2, "0");
    const mm = month.padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }, [day, month, year]);

  function openCreateDialog(worker: WorkerKey) {
    setCreateWorkerKey(worker);
    setOpenCreate(true);
  }

  function addRowWithData(worker: WorkerKey, data: NewWorkerRow) {
    setRowsByWorker((prev) => ({
      ...prev,
      [worker]: [
        ...prev[worker],
        { id: uid(), name: data.name, salary: data.salary, paid: data.paid },
      ],
    }));
  }

  function removeRow(worker: WorkerKey, id: string) {
    setRowsByWorker((prev) => ({
      ...prev,
      [worker]: prev[worker].filter((r) => r.id !== id),
    }));
  }

  function updateRow(worker: WorkerKey, id: string, patch: Partial<StaffRow>) {
    setRowsByWorker((prev) => ({
      ...prev,
      [worker]: prev[worker].map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }

  function workerTotals(worker: WorkerKey) {
    const rows = rowsByWorker[worker];
    const totalSalary = rows.reduce(
      (acc, r) => acc + toNumberSafe(r.salary),
      0
    );
    const totalPaid = rows.reduce((acc, r) => acc + toNumberSafe(r.paid), 0);
    const totalLeft = totalSalary - totalPaid;
    return { totalSalary, totalPaid, totalLeft };
  }

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 7 }, (_, i) =>
    String(now.getFullYear() - 3 + i)
  );

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center">Ресторан</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Top selectors */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full pr-0">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* One big table */}

          <div className="w-full max-w-full overflow-x-auto rounded-sm border">
            <table className="min-w-full w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <tbody>
                {WORKER_ORDER.map((worker) => {
                  const cfg = WORKERS[worker];
                  const totals = workerTotals(worker);
                  const rows = rowsByWorker[worker];

                  return (
                    <React.Fragment key={worker}>
                      {/* SECTION HEADER (Title left, Button right) */}
                      <tr className="border-t bg-muted/100">
                        <td colSpan={5} className="p-3">
                          <div className="flex justify-between items-center gap-2">
                            <div className="font-semibold text-base truncate min-w-0">
                              {cfg.title}
                            </div>

                            <Button
                              size="sm"
                              className="shrink-100"
                              onClick={() => openCreateDialog(worker)}
                            >
                              {cfg.addLabel}
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* SECTION ROWS */}
                      {rows.length === 0 ? (
                        <tr className="border-t bg-background">
                          <td colSpan={5} className="p-3 text-muted-foreground">
                            Эч нерсе жок.
                          </td>
                        </tr>
                      ) : (
                        rows.map((r) => {
                          const left =
                            toNumberSafe(r.salary) - toNumberSafe(r.paid);

                          return (
                            <tr key={r.id} className="border-t bg-background">
                              <td className="p-3" colSpan={5}>
                                <div className="flex gap-3">
                                  {/* LEFT: info */}
                                  <div className="min-w-0 flex-1">
                                    {/* Row 1: name */}
                                    <div className="truncate font-medium">
                                      {r.name || "—"}
                                    </div>

                                    {/* Rows 2 + 3: values + labels aligned */}
                                    <div className="mt-2 grid grid-cols-3 gap-3">
                                      {/* Row 2: values */}
                                      <div className="text-center text-sm font-medium">
                                        {money(toNumberSafe(r.salary))}
                                      </div>
                                      <div className="text-center text-sm font-medium">
                                        {money(toNumberSafe(r.paid))}
                                      </div>
                                      <div className="text-center text-sm font-medium">
                                        {money(
                                          toNumberSafe(r.salary) -
                                            toNumberSafe(r.paid)
                                        )}
                                      </div>

                                      {/* Row 3: labels */}
                                      <div className="text-center text-md text-muted-foreground">
                                        айлык
                                      </div>
                                      <div className="text-center text-xs text-muted-foreground">
                                        алганы
                                      </div>
                                      <div className="text-center text-xs text-muted-foreground">
                                        калганы
                                      </div>
                                    </div>
                                  </div>

                                  {/* RIGHT: actions (centered both ways) */}
                                  <div className="self-stretch grid place-items-center">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                      <RestoranDialogEdit
                                        row={r}
                                        onSave={(patch) =>
                                          updateRow(worker, r.id, patch)
                                        }
                                        date={selectedDate}
                                        trigger={
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            aria-label="Edit row"
                                            title="Edit"
                                          >
                                            <SquarePen />
                                          </Button>
                                        }
                                      />

                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeRow(worker, r.id)}
                                        aria-label="Remove row"
                                        title="Remove"
                                      >
                                        <X />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <RestoranDialog
        open={openCreate}
        setOpen={setOpenCreate}
        title={`Кошуу: ${WORKERS[createWorkerKey].title}`}
        onSave={(row) => addRowWithData(createWorkerKey, row)}
      />
    </div>
  );
}
