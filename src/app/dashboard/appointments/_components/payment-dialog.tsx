"use client";

import { useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AppointmentWithRelations } from "@/actions/appointments";
import { completeAppointment } from "@/actions/appointments";

const PAYMENT_METHODS = [
  { value: "pix", label: "Pix" },
  { value: "card", label: "Cartão" },
  { value: "cash", label: "Dinheiro" },
] as const;

const schema = z.object({
  paymentMethod: z.string().min(1, "Selecione a forma de pagamento"),
  amountPaid: z.number().min(0, "Informe o valor pago"),
  amountOwed: z.number().min(0, "Informe o valor em haver"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PaymentDialog({ appointment, open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "",
      amountPaid: 0,
      amountOwed: 0,
    },
  });

  // Pre-fill amountPaid with appointment price when dialog opens
  useEffect(() => {
    if (appointment) {
      form.reset({
        paymentMethod: "",
        amountPaid: appointment.priceCents / 100,
        amountOwed: 0,
      });
    }
  }, [appointment, form]);

  // Auto-calculate owed when paid changes
  const watchedPaid = form.watch("amountPaid");
  useEffect(() => {
    if (!appointment) return;
    const owed = Math.max(0, appointment.priceCents / 100 - (watchedPaid || 0));
    form.setValue("amountOwed", parseFloat(owed.toFixed(2)));
  }, [watchedPaid, appointment, form]);

  function onSubmit(values: FormValues) {
    if (!appointment) return;
    startTransition(async () => {
      try {
        await completeAppointment(appointment.id, {
          paymentMethod: values.paymentMethod,
          amountPaidCents: Math.round(values.amountPaid * 100),
          amountOwedCents: Math.round(values.amountOwed * 100),
        });
        toast.success("Agendamento concluído!");
        onOpenChange(false);
      } catch {
        toast.error("Erro ao concluir agendamento");
      }
    });
  }

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  const totalPrice = appointment ? appointment.priceCents / 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Concluir agendamento</DialogTitle>
          <DialogDescription>
            {appointment?.clientName} — {appointment?.serviceName} —{" "}
            <span className="font-medium">
              {totalPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de pagamento *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => field.onChange(m.value)}
                          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            field.value === m.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background hover:bg-accent"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor pago (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
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
              name="amountOwed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Em haver (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Confirmar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
