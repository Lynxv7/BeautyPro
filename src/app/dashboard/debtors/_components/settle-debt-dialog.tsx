"use client";

import { useTransition } from "react";
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
import type { AppointmentWithRelations } from "@/actions/appointments";
import { settleDebt } from "@/actions/appointments";

const PAYMENT_METHODS = [
  { value: "pix", label: "Pix" },
  { value: "card", label: "Cartão" },
  { value: "cash", label: "Dinheiro" },
] as const;

const schema = z.object({
  paymentMethod: z.string().min(1, "Selecione a forma de pagamento"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function SettleDebtDialog({ appointment, open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "" },
  });

  function onSubmit(values: FormValues) {
    if (!appointment) return;
    startTransition(async () => {
      try {
        await settleDebt(appointment.id, {
          paymentMethod: values.paymentMethod,
        });
        toast.success("Pagamento quitado!");
        onOpenChange(false);
        form.reset();
      } catch {
        toast.error("Erro ao quitar pagamento");
      }
    });
  }

  const owedAmount = appointment?.amountOwedCents ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Quitar pagamento</DialogTitle>
          <DialogDescription>
            {appointment?.clientName} —{" "}
            <span className="font-medium text-amber-600">
              {formatPrice(owedAmount)} em haver
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Salvando..." : "Confirmar quitação"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
