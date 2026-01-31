"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, X } from "lucide-react";
import { RestoranDialogEdit } from "./restoran-outcome-dialog-edit";

export type StaffRow = {
  id: string;
  name: string;
  salary: string;
  paid: string;
};

export const WORKERS = {
  chefs: { title: "Повар", addLabel: "Кошуу" },
  musicians: { title: "Музыкант", addLabel: "Кошуу" },
  waiters: { title: "Официант", addLabel: "Кошуу" },
  dishwashers: { title: "Идиш жуучу", addLabel: "Кошуу" },
  florewashers: { title: "Пол жуучу", addLabel: "Кошуу" },
  other: { title: "Другое", addLabel: "Кошуу" },
} as const;

export type WorkerKey = keyof typeof WORKERS;

const WORKER_ORDER: WorkerKey[] = [
  "chefs",
  "musicians",
  "waiters",
  "dishwashers",
  "florewashers",
  "other",
];

function toNumberSafe(v: string) {
  const cleaned = v.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function money(v: number) {
  return v.toLocaleString();
}

type Props = {
  rowsByWorker: Record<WorkerKey, StaffRow[]>;
  selectedDate: Date;

  openCreateDialog: (worker: WorkerKey) => void;
  updateRow: (worker: WorkerKey, id: string, patch: Partial<StaffRow>) => void;
  removeRow: (worker: WorkerKey, id: string) => void;
};

export function OutcomeTable({
  rowsByWorker,
  selectedDate,
  openCreateDialog,
  updateRow,
  removeRow,
}: Props) {
  const grand = React.useMemo(() => {
    let totalSalary = 0;
    let totalPaid = 0;

    for (const worker of WORKER_ORDER) {
      for (const r of rowsByWorker[worker]) {
        totalSalary += toNumberSafe(r.salary);
        totalPaid += toNumberSafe(r.paid);
      }
    }

    return {
      totalSalary,
      totalPaid,
      totalLeft: totalSalary - totalPaid,
    };
  }, [rowsByWorker]);
  return (
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
            const rows = rowsByWorker[worker];

            return (
              <React.Fragment key={worker}>
                {/* SECTION HEADER */}
                <tr className="border-t bg-muted/100">
                  <td colSpan={5} className="p-3">
                    <div className="flex justify-between items-center gap-2">
                      <div className="font-semibold text-base truncate min-w-0">
                        {cfg.title}
                      </div>

                      <Button
                        size="sm"
                        className="shrink-0"
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
                  rows.map((r) => (
                    <tr key={r.id} className="border-t bg-background">
                      <td className="p-3" colSpan={5}>
                        <div className="flex gap-3">
                          {/* LEFT: info */}
                          <div className="min-w-0 flex-1">
                            {/* Row 1: name */}
                            <div className="truncate font-medium ">
                              {r.name || "—"}
                            </div>

                            {/* Rows 2 + 3 aligned */}
                            <div className="mt-2 grid grid-cols-3 gap-3">
                              {/* values */}
                              <div className="text-center text-sm font-medium">
                                {money(toNumberSafe(r.salary))}
                              </div>
                              <div className="text-center text-sm font-medium">
                                {money(toNumberSafe(r.paid))}
                              </div>
                              <div className="text-center text-sm font-medium">
                                {money(
                                  toNumberSafe(r.salary) - toNumberSafe(r.paid)
                                )}
                              </div>

                              {/* labels */}
                              <div className="text-center text-xs text-muted-foreground">
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

                          {/* RIGHT: actions centered */}
                          <div className="self-stretch grid place-items-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              <RestoranDialogEdit
                                row={r}
                                date={selectedDate}
                                onSave={(patch) =>
                                  updateRow(worker, r.id, patch)
                                }
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
                  ))
                )}
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot className="bg-muted/40">
          <tr className="border-t">
            <td colSpan={5} className="p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Жалпы чыгаша</span>
                <span className="font-semibold">{money(grand.totalPaid)}</span>
              </div>

              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Айлык: {money(grand.totalSalary)}</span>
                <span>Калганы: {money(grand.totalLeft)}</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
