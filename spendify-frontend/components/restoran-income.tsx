"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, X } from "lucide-react";
import { RestoranIncomeDialogEdit } from "./restoran-income-dialog-edit";

import {
  RestoranIncomeDialog,
  type NewIncomeRow,
} from "./restoran-income-dialog";

export type IncomeRow = {
  id: string;
  title: string; // e.g. Банкет, Чайхана, Доставка
  amount: string; // store as string like your salary/paid
  note?: string;
};

function toNumberSafe(v: string) {
  const cleaned = v.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function money(v: number) {
  return v.toLocaleString();
}

type Props = {
  rows: IncomeRow[];
  selectedDate: Date;

  onCreateClick: () => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (id: string, patch: Partial<IncomeRow>) => void;
};
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
export function IncomeTable({
  rows,
  selectedDate,
  onCreateClick,
  onRemoveRow,
  onUpdateRow,
}: Props) {
  const total = rows.reduce((acc, r) => acc + toNumberSafe(r.amount), 0);
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-sm border">
      <table className="min-w-full w-full text-sm table-fixed">
        <colgroup>
          <col className="w-[85%]" />
          <col className="w-[15%]" />
        </colgroup>

        <tbody>
          {/* HEADER */}
          <tr className="border-t bg-muted/100">
            <td colSpan={2} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-base truncate min-w-0">
                  Киреше
                </div>

                <Button size="sm" className="shrink-0" onClick={onCreateClick}>
                  Кошуу
                </Button>
              </div>
            </td>
          </tr>

          {/* EMPTY */}
          {rows.length === 0 ? (
            <tr className="border-t bg-background">
              <td colSpan={2} className="p-3 text-muted-foreground">
                Эч нерсе жок.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-t bg-background">
                <td className="py-1 px-3" colSpan={2}>
                  <div className="flex items-stretch gap-3">
                    {/* LEFT TEXT: title + note (left-aligned, variable height) */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="font-medium break-words">
                        {r.title || "—"}
                      </div>

                      {r.note ? (
                        <div className="mt-1 text-xs text-muted-foreground break-words">
                          {r.note}
                        </div>
                      ) : null}
                    </div>

                    {/* AMOUNT: always vertically centered */}
                    <div className="shrink-0 flex items-center justify-center w-[8ch]">
                      <div className="text-sm font-medium tabular-nums text-center">
                        {money(toNumberSafe(r.amount))}
                      </div>
                    </div>

                    {/* ACTIONS: always centered */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <RestoranIncomeDialogEdit
                          row={r}
                          date={selectedDate}
                          onSave={(patch) => onUpdateRow(r.id, patch)}
                          trigger={
                            <Button size="icon" variant="ghost">
                              <SquarePen />
                            </Button>
                          }
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onRemoveRow(r.id)}
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

          {/* TOTAL */}
          <tr className="border-t bg-muted/40">
            <td colSpan={2} className="p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Жалпы киреше</span>
                <span className="font-semibold">{money(total)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
