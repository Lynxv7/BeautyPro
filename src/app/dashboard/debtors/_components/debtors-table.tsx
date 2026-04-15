"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { AppointmentWithRelations } from "@/actions/appointments";
import { SettleDebtDialog } from "./settle-debt-dialog";

const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix",
  card: "Cartão",
  cash: "Dinheiro",
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

type Props = {
  appointments: AppointmentWithRelations[];
};

export function DebtorsTable({ appointments }: Props) {
  const [settleTarget, setSettleTarget] =
    useState<AppointmentWithRelations | null>(null);

  const totalOwed = appointments.reduce(
    (acc, a) => acc + (a.amountOwedCents ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Clientes em haver
          </h1>
          <p className="text-sm text-zinc-500">
            Total a receber:{" "}
            <span className="font-semibold text-amber-600">
              {formatPrice(totalOwed)}
            </span>
          </p>
        </div>
      </div>

      {/* ── Mobile: cards ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {appointments.length === 0 ? (
          <p className="py-8 text-center text-zinc-400 text-sm">
            Nenhum cliente com valor em aberto.
          </p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="rounded-lg border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{appt.clientName}</p>
                  <p className="text-xs text-zinc-500">{appt.serviceName}</p>
                  <p className="text-xs text-zinc-400">
                    {formatDate(appt.startsAt)}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 shrink-0">
                  {formatPrice(appt.amountOwedCents ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>
                  Total:{" "}
                  <span className="text-foreground">
                    {formatPrice(appt.priceCents)}
                  </span>
                  {appt.amountPaidCents != null && (
                    <>
                      {" "}
                      · Pago:{" "}
                      <span className="text-foreground">
                        {formatPrice(appt.amountPaidCents)}
                      </span>
                    </>
                  )}
                </span>
                {appt.paymentMethod && (
                  <span>
                    {PAYMENT_LABELS[appt.paymentMethod] ?? appt.paymentMethod}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettleTarget(appt)}
                >
                  Quitar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop: table ──────────────────────────────────────── */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Preço total</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Em haver</TableHead>
              <TableHead>Últ. pagamento</TableHead>
              <TableHead className="w-28 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-zinc-400"
                >
                  Nenhum cliente com valor em aberto.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatDate(appt.startsAt)}
                  </TableCell>
                  <TableCell>{appt.clientName}</TableCell>
                  <TableCell>{appt.serviceName}</TableCell>
                  <TableCell>{formatPrice(appt.priceCents)}</TableCell>
                  <TableCell>
                    {appt.amountPaidCents != null ? (
                      formatPrice(appt.amountPaidCents)
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      {formatPrice(appt.amountOwedCents ?? 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {appt.paymentMethod ? (
                      <span className="text-sm">
                        {PAYMENT_LABELS[appt.paymentMethod] ??
                          appt.paymentMethod}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSettleTarget(appt)}
                    >
                      Quitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SettleDebtDialog
        appointment={settleTarget}
        open={settleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSettleTarget(null);
        }}
      />
    </div>
  );
}
