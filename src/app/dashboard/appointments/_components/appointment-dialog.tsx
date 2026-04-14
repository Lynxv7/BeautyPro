"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { startOfDay } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import type { Client, Service } from "@/db/schema";
import type { AppointmentWithRelations } from "@/actions/appointments";
import { createAppointment } from "@/actions/appointments";

const TIME_SLOTS = Array.from({ length: 33 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

// Stable reference — today at midnight
const TODAY = startOfDay(new Date());

/** Appointments on the same calendar day, ignoring cancelled/no_show */
function getSameDayAppts(
  date: Date | undefined,
  appointments: AppointmentWithRelations[],
): AppointmentWithRelations[] {
  if (!date) return [];
  const dayTs = startOfDay(date).getTime();
  return appointments.filter((a) => {
    if (!a.startsAt) return false;
    if (a.status === "cancelled" || a.status === "no_show") return false;
    return startOfDay(new Date(a.startsAt)).getTime() === dayTs;
  });
}

/** Set of HH:mm slot strings that are occupied by existing appointments */
function getDisabledSlots(
  sameDayAppts: AppointmentWithRelations[],
): Set<string> {
  const disabled = new Set<string>();
  for (const appt of sameDayAppts) {
    if (!appt.startsAt) continue;
    const start = new Date(appt.startsAt);
    const startMin = start.getHours() * 60 + start.getMinutes();
    const endMin = startMin + appt.durationMinutes;
    for (let m = startMin; m < endMin; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      disabled.add(
        `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      );
    }
  }
  return disabled;
}

/** Returns the first conflicting appointment if the new service duration would overlap */
function getOverlap(
  time: string,
  durationMinutes: number,
  sameDayAppts: AppointmentWithRelations[],
): AppointmentWithRelations | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  const newStart = h * 60 + m;
  const newEnd = newStart + durationMinutes;
  for (const appt of sameDayAppts) {
    if (!appt.startsAt) continue;
    const s = new Date(appt.startsAt);
    const existStart = s.getHours() * 60 + s.getMinutes();
    const existEnd = existStart + appt.durationMinutes;
    if (newStart < existEnd && newEnd > existStart) return appt;
  }
  return null;
}

/** Returns true if the slot is in the past when the selected date is today (browser timezone) */
function isPastSlot(slot: string, selectedDate: Date | undefined): boolean {
  if (!selectedDate) return false;
  const now = new Date();
  if (startOfDay(selectedDate).getTime() !== startOfDay(now).getTime())
    return false;
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}

const schema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.date({ error: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  price: z.number().min(0, "Informe o valor"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  services: Service[];
  appointments: AppointmentWithRelations[];
};

export function AppointmentDialog({
  open,
  onOpenChange,
  clients,
  services,
  appointments,
}: Props) {
  "use no memo";
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: "",
      serviceId: "",
      date: undefined,
      time: "",
      price: 0,
      notes: "",
    },
  });

  const watchedDate = form.watch("date");
  const watchedTime = form.watch("time");
  const watchedServiceId = form.watch("serviceId");

  const sameDayAppts = getSameDayAppts(watchedDate, appointments);
  const disabledSlots = getDisabledSlots(sameDayAppts);
  const selectedService = services.find((s) => s.id === watchedServiceId);
  const overlappingAppt =
    selectedService && watchedTime
      ? getOverlap(watchedTime, selectedService.durationMinutes, sameDayAppts)
      : null;

  const visibleSlots = TIME_SLOTS.filter((t) => !isPastSlot(t, watchedDate));

  async function doCreate(values: FormValues) {
    const [hours, minutes] = values.time.split(":").map(Number);
    const startsAt = new Date(values.date);
    startsAt.setHours(hours, minutes, 0, 0);
    await createAppointment({
      clientId: values.clientId,
      serviceId: values.serviceId,
      startsAt,
      priceCents: Math.round(values.price * 100),
      notes: values.notes,
    });
    toast.success("Agendamento criado!");
    onOpenChange(false);
    form.reset();
  }

  function onSubmit(values: FormValues) {
    if (overlappingAppt) {
      setPendingValues(values);
      setConfirmOpen(true);
      return;
    }
    startTransition(async () => {
      try {
        await doCreate(values);
      } catch {
        toast.error("Erro ao criar agendamento");
      }
    });
  }

  function handleConfirm() {
    if (!pendingValues) return;
    setConfirmOpen(false);
    startTransition(async () => {
      try {
        await doCreate(pendingValues);
      } catch {
        toast.error("Erro ao criar agendamento");
      }
    });
    setPendingValues(null);
  }

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo agendamento</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <FormControl>
                      <select {...field} className={selectClass}>
                        <option value="">Selecione um cliente</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className={selectClass}
                        onChange={(e) => {
                          field.onChange(e);
                          const svc = services.find(
                            (s) => s.id === e.target.value,
                          );
                          if (svc) form.setValue("price", svc.priceCents / 100);
                        }}
                      >
                        <option value="">Selecione um serviço</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} {s.durationMinutes}min
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        form.setValue("time", "");
                      }}
                      placeholder="dd/mm/aaaa"
                      disabledDate={(date) => date < TODAY}
                    />
                    {fieldState.error && (
                      <p className="text-xs font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="time"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Horário *</FormLabel>
                    <FormControl>
                      <select {...field} className={selectClass}>
                        <option value="">--:--</option>
                        {visibleSlots.map((t) => (
                          <option
                            key={t}
                            value={t}
                            disabled={disabledSlots.has(t)}
                          >
                            {t}
                            {disabledSlots.has(t) ? " (ocupado)" : ""}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    {overlappingAppt && watchedTime && (
                      <p className="text-xs font-medium text-amber-600">
                        ⚠️ O serviço selecionado (
                        {selectedService?.durationMinutes}
                        min) pode sobrepor o agendamento de{" "}
                        {overlappingAppt.clientName} às{" "}
                        {new Date(overlappingAppt.startsAt!).toLocaleTimeString(
                          "pt-BR",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                        .
                      </p>
                    )}
                    {fieldState.error && (
                      <p className="text-xs font-medium text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input placeholder="Pedidos especiais..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Agendar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Existe um agendamento anterior que pode sobrepor o horário
              selecionado. Deseja confirmar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingValues(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
