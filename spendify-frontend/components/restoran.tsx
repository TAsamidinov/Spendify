"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { OutcomeTable } from "./restoran-outcome";
import { IncomeTable, type IncomeRow } from "./restoran-income";

import { RestoranDialog, type NewWorkerRow } from "./restoran-outcome-dialog";
import { RestoranIncomeDialog, type NewIncomeRow } from "./restoran-income-dialog";

const API_BASE = "http://127.0.0.1:8000/api/events";

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

const WORKER_KEYS = [
  "chefs",
  "musicians",
  "waiters",
  "dishwashers",
  "florewashers",
  "other",
] as const;

type WorkerKey = (typeof WORKER_KEYS)[number];

function toWorkerKey(v: string): WorkerKey {
  return (WORKER_KEYS as readonly string[]).includes(v)
    ? (v as WorkerKey)
    : "other";
}

function toInt(v: string) {
  return Number(v.replace(/,/g, "").trim()) || 0;
}

export default function RestaurantPayrollPage() {
  const now = new Date();

  const [day, setDay] = React.useState(String(now.getDate()));
  const [month, setMonth] = React.useState(String(now.getMonth() + 1));
  const [year, setYear] = React.useState(String(now.getFullYear()));

  const selectedDateLabel = React.useMemo(() => {
    const dd = day.padStart(2, "0");
    const mm = month.padStart(2, "0");
    return `${year}-${mm}-${dd}`; // YYYY-MM-DD
  }, [day, month, year]);

  const [selectedDate, setSelectedDate] = React.useState<Date>(now);
  React.useEffect(() => {
    setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)));
  }, [day, month, year]);

  // ---------- OUTCOME STATE ----------
  const [rowsByWorker, setRowsByWorker] = React.useState<Record<WorkerKey, StaffRow[]>>({
    chefs: [],
    musicians: [],
    waiters: [],
    dishwashers: [],
    florewashers: [],
    other: [],
  });

  const [openOutcomeCreate, setOpenOutcomeCreate] = React.useState(false);
  const [createWorkerKey, setCreateWorkerKey] = React.useState<WorkerKey>("chefs");

  function openCreateDialog(worker: WorkerKey) {
    setCreateWorkerKey(worker);
    setOpenOutcomeCreate(true);
  }

  // ---------- INCOME STATE ----------
  const [incomeRows, setIncomeRows] = React.useState<IncomeRow[]>([]);
  const [openIncomeCreate, setOpenIncomeCreate] = React.useState(false);

  const [view, setView] = React.useState<"income" | "outcome">("outcome");

  // ---------- LOAD BOTH BY DATE ----------
  React.useEffect(() => {
    async function loadAll() {
      // income
      const incRes = await fetch(`${API_BASE}/income/by-date/?date=${selectedDateLabel}`);
      if (incRes.ok) {
        const incData = await incRes.json();
        const rows = incData.rows ?? [];
        setIncomeRows(
          rows.map((x: any) => ({
            id: String(x.id),
            title: x.title ?? "",
            amount: String(x.amount ?? "0"),
            note: x.note ?? "",
          }))
        );
      } else {
        setIncomeRows([]);
      }

      // outcome
      const outRes = await fetch(`${API_BASE}/outcome/by-date/?date=${selectedDateLabel}`);
      if (outRes.ok) {
        const outData = await outRes.json();
        const rows = outData.rows ?? [];

        const grouped: Record<WorkerKey, StaffRow[]> = {
          chefs: [],
          musicians: [],
          waiters: [],
          dishwashers: [],
          florewashers: [],
          other: [],
        };

        for (const r of rows) {
          const key = toWorkerKey(String(r.worker_type ?? "other"));
          grouped[key].push({
            id: String(r.id),
            name: r.name ?? "",
            salary: String(r.salary ?? "0"),
            paid: String(r.paid ?? "0"),
          });
        }

        setRowsByWorker(grouped);
      } else {
        setRowsByWorker({
          chefs: [],
          musicians: [],
          waiters: [],
          dishwashers: [],
          florewashers: [],
          other: [],
        });
      }
    }

    loadAll();
  }, [selectedDateLabel]);

  // ---------- INCOME CRUD ----------
  async function addIncomeRow(data: NewIncomeRow) {
    const res = await fetch(`${API_BASE}/income/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDateLabel,
        title: data.title,
        amount: toInt(data.amount),
        note: data.note ?? "",
      }),
    });

    if (!res.ok) {
      console.error("Income save failed:", res.status, await res.text());
      return;
    }

    const created = await res.json();
    setIncomeRows((prev) => [
      ...prev,
      {
        id: String(created.id),
        title: created.title ?? data.title,
        amount: String(created.amount ?? toInt(data.amount)),
        note: created.note ?? data.note ?? "",
      },
    ]);
  }

  async function updateIncomeRow(id: string, patch: Partial<IncomeRow>) {
    const res = await fetch(`${API_BASE}/income/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.amount !== undefined ? { amount: toInt(patch.amount) } : {}),
        ...(patch.note !== undefined ? { note: patch.note } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Income update failed:", res.status, await res.text());
      return;
    }

    setIncomeRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function removeIncomeRow(id: string) {
    const res = await fetch(`${API_BASE}/income/${id}/delete/`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Income delete failed:", res.status, await res.text());
      return;
    }
    setIncomeRows((prev) => prev.filter((r) => r.id !== id));
  }

  // ---------- OUTCOME CRUD ----------
  async function addOutcomeRow(worker: WorkerKey, data: NewWorkerRow) {
    const res = await fetch(`${API_BASE}/outcome/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDateLabel,
        worker_type: worker,
        name: data.name,
        salary: toInt(data.salary),
        paid: toInt(data.paid),
      }),
    });

    if (!res.ok) {
      console.error("Outcome save failed:", res.status, await res.text());
      return;
    }

    const created = await res.json();

    setRowsByWorker((prev) => ({
      ...prev,
      [worker]: [
        ...prev[worker],
        {
          id: String(created.id),
          name: created.name ?? data.name,
          salary: String(created.salary ?? toInt(data.salary)),
          paid: String(created.paid ?? toInt(data.paid)),
        },
      ],
    }));
  }

  async function updateOutcomeRow(worker: WorkerKey, id: string, patch: Partial<StaffRow>) {
    const res = await fetch(`${API_BASE}/outcome/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.salary !== undefined ? { salary: toInt(patch.salary) } : {}),
        ...(patch.paid !== undefined ? { paid: toInt(patch.paid) } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Outcome update failed:", res.status, await res.text());
      return;
    }

    setRowsByWorker((prev) => ({
      ...prev,
      [worker]: prev[worker].map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }

  async function removeOutcomeRow(worker: WorkerKey, id: string) {
    const res = await fetch(`${API_BASE}/outcome/${id}/delete/`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Outcome delete failed:", res.status, await res.text());
      return;
    }

    setRowsByWorker((prev) => ({
      ...prev,
      [worker]: prev[worker].filter((r) => r.id !== id),
    }));
  }

  // ---------- calendar options ----------
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
          {/* Date selectors */}
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

          {/* Toggle */}
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
              updateRow={(worker, id, patch) => updateOutcomeRow(worker, id, patch)}
              removeRow={(worker, id) => removeOutcomeRow(worker, id)}
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

      {/* Outcome create dialog */}
      <RestoranDialog
        open={openOutcomeCreate}
        setOpen={setOpenOutcomeCreate}
        title={`Кошуу: ${WORKERS[createWorkerKey].title}`}
        onSave={(row) => addOutcomeRow(createWorkerKey, row)} // ✅ THIS SAVES TO DB
      />

      {/* Income create dialog */}
      <RestoranIncomeDialog
        open={openIncomeCreate}
        setOpen={setOpenIncomeCreate}
        title="Кошуу: Киреше"
        onSave={addIncomeRow}
      />
    </div>
  );
}