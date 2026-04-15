"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppointmentWithRelations } from "@/actions/appointments";
import type { AppointmentStatus, Client, Service } from "@/db/schema";
import { deleteAppointment } from "@/actions/appointments";
import { AppointmentDialog } from "./appointment-dialog";
import { PaymentDialog } from "./payment-dialog";

const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix",
  card: "Cartão",
  cash: "Dinheiro",
};

type Props = {
  appointments: AppointmentWithRelations[];
  clients: Client[];
  services: Service[];
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Não compareceu",
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-zinc-100 text-zinc-600",
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

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

export function AppointmentsTable({ appointments, clients, services }: Props) {
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] =
    useState<AppointmentWithRelations | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Remover este agendamento?")) return;
    startTransition(async () => {
      try {
        await deleteAppointment(id);
        toast.success("Agendamento removido");
      } catch {
        toast.error("Erro ao remover agendamento");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo agendamento
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Em haver</TableHead>
              <TableHead>Status</TableHead>
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
                  Nenhum agendamento cadastrado ainda.
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
                    {appt.paymentMethod ? (
                      <span className="text-sm">
                        {PAYMENT_LABELS[appt.paymentMethod] ??
                          appt.paymentMethod}
                        {appt.amountPaidCents != null && (
                          <span className="ml-1 text-zinc-500">
                            ({formatPrice(appt.amountPaidCents)})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {appt.amountOwedCents != null &&
                    appt.amountOwedCents > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        {formatPrice(appt.amountOwedCents)}
                      </span>
                    ) : appt.status === "completed" ? (
                      <span className="text-xs text-zinc-400">Quitado</span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appt.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {appt.status === "scheduled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => setPaymentTarget(appt)}
                        >
                          Concluir
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => handleDelete(appt.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AppointmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        clients={clients}
        services={services}
        appointments={appointments}
      />

      <PaymentDialog
        appointment={paymentTarget}
        open={paymentTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPaymentTarget(null);
        }}
      />
    </div>
  );
}
