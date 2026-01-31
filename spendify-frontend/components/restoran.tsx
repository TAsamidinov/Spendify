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

import { RestoranDialog, type NewWorkerRow } from "./restoran-outcome-dialog";
import { SquarePen, X } from "lucide-react";
import { RestoranDialogEdit } from "./restoran-outcome-dialog-edit";
import { OutcomeTable } from "./restoran-outcome";
import { IncomeRow, IncomeTable } from "./restoran-income";
import { NewIncomeRow, RestoranIncomeDialog } from "./restoran-income-dialog";

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
  florewashers: { title: "Пол жуучу", addLabel: "Кошуу" },

  other: { title: "Другое", addLabel: "Кошуу" },
} as const;

type WorkerKey = keyof typeof WORKERS;

const WORKER_ORDER: WorkerKey[] = [
  "chefs",
  "musicians",
  "waiters",
  "dishwashers",
  "florewashers",
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
    florewashers: [],
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
  React.useEffect(() => {
    async function loadOutcome() {
      const res = await fetch(`/api/restoran/outcome/?date=${selectedDateLabel}`);
      if (!res.ok) return;
  
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results ?? [];
  
      const next: Record<WorkerKey, StaffRow[]> = {
        chefs: [],
        musicians: [],
        waiters: [],
        dishwashers: [],
        florewashers: [],
        other: [],
      };
  
      for (const x of items) {
        const key = (x.worker_type as WorkerKey) ?? "other";
        if (!next[key]) continue;
  
        next[key].push({
          id: String(x.id),
          name: x.name ?? "",
          salary: String(x.salary ?? "0"),
          paid: String(x.paid ?? "0"),
        });
      }
  
      setRowsByWorker(next);
    }
  
    loadOutcome();
  }, [selectedDateLabel]);

  async function updateIncomeRow(id: string, patch: Partial<IncomeRow>) {
    const res = await fetch(`/api/restoran/income/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  
    if (!res.ok) return;
  
    setIncomeRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
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
  const [view, setView] = React.useState<"income" | "outcome">("outcome");
  const [incomeRows, setIncomeRows] = React.useState<IncomeRow[]>([]);
  const [openIncomeCreate, setOpenIncomeCreate] = React.useState(false);

  function addIncomeRow(data: NewIncomeRow) {
    console.log("ADDING INCOME", data);

    setIncomeRows((prev) => [
      ...prev,
      { id: uid(), title: data.title, amount: data.amount, note: data.note },
    ]);
  }

  async function removeIncomeRow(id: string) {
    const res = await fetch(`/api/restoran/income/${id}/`, { method: "DELETE" });
    if (!res.ok) return;
  
    setIncomeRows((prev) => prev.filter((r) => r.id !== id));
  }
  
  React.useEffect(() => {
    setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)));
  }, [day, month, year]);

  React.useEffect(() => {
    async function loadIncome() {
      const res = await fetch(`/api/restoran/income/?date=${selectedDateLabel}`);
      if (!res.ok) return;
  
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results ?? [];
  
      setIncomeRows(
        items.map((x: any) => ({
          id: String(x.id),
          title: x.title ?? "",
          amount: String(x.amount ?? "0"),
          note: x.note ?? "",
        }))
      );
    }
  
    loadIncome();
  }, [selectedDateLabel]);
  React.useEffect(() => {
    async function loadOutcome() {
      const res = await fetch(`/api/restoran/outcome/?date=${selectedDateLabel}`);
      if (!res.ok) return;
  
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results ?? [];
  
      const next: Record<WorkerKey, StaffRow[]> = {
        chefs: [],
        musicians: [],
        waiters: [],
        dishwashers: [],
        florewashers: [],
        other: [],
      };
  
      for (const x of items) {
        const key = (x.worker_type as WorkerKey) ?? "other";
        if (!next[key]) continue;
  
        next[key].push({
          id: String(x.id),
          name: x.name ?? "",
          salary: String(x.salary ?? "0"),
          paid: String(x.paid ?? "0"),
        });
      }
  
      setRowsByWorker(next);
    }
  
    loadOutcome();
  }, [selectedDateLabel]);
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

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setView("income")}
              className={[
                "h-10 rounded-md border text-sm font-medium transition",
                "flex items-center justify-center",
                view === "income"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted",
              ].join(" ")}
            >
              Киреше
            </button>

            <button
              type="button"
              onClick={() => setView("outcome")}
              className={[
                "h-10 rounded-md border text-sm font-medium transition",
                "flex items-center justify-center",
                view === "outcome"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted",
              ].join(" ")}
            >
              Чыгаша
            </button>
          </div>

          <Separator />

          {view === "outcome" ? (
            <OutcomeTable
              rowsByWorker={rowsByWorker}
              selectedDate={selectedDate}
              openCreateDialog={openCreateDialog}
              updateRow={updateRow}
              removeRow={removeRow}
            />
          ) : (
            <IncomeTable
              rows={incomeRows}
              selectedDate={selectedDate}
              onCreateClick={() => setOpenIncomeCreate(true)}
              onRemoveRow={removeIncomeRow}
              onUpdateRow={updateIncomeRow}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <RestoranDialog
        open={openCreate}
        setOpen={setOpenCreate}
        title={`Кошуу: ${WORKERS[createWorkerKey].title}`}
        onSave={(row) => addRowWithData(createWorkerKey, row)}
      />
      <RestoranIncomeDialog
        open={openIncomeCreate}
        setOpen={setOpenIncomeCreate}
        title="Кошуу: Киреше"
        onSave={addIncomeRow}
      />
    </div>
  );
}
