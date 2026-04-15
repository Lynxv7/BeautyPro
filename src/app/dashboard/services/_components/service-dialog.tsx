"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Service } from "@/db/schema";
import { createService, updateService } from "@/actions/services";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("Duração deve ser positiva"),
  // Entrada em reais (ex: 99.90), armazenado em centavos
  priceReais: z.coerce.number().positive("Preço deve ser positivo"),
});

type FormValues = {
  name: string;
  type?: string;
  durationMinutes: number;
  priceReais: number;
};

type Props =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      service?: never;
    }
  | {
      mode: "edit";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      service: Service;
    };

export function ServiceDialog({ mode, open, onOpenChange, service }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    values:
      mode === "edit"
        ? {
            name: service.name,
            type: service.type ?? "",
            durationMinutes: service.durationMinutes,
            priceReais: service.priceCents / 100,
          }
        : { name: "", type: "", durationMinutes: 30, priceReais: 0 },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const priceCents = Math.round(values.priceReais * 100);

        if (mode === "create") {
          await createService({
            name: values.name,
            type: values.type,
            durationMinutes: values.durationMinutes,
            priceCents,
          });
          toast.success("Serviço criado!");
        } else {
          await updateService(service.id, {
            name: values.name,
            type: values.type,
            durationMinutes: values.durationMinutes,
            priceCents,
          });
          toast.success("Serviço atualizado!");
        }

        onOpenChange(false);
        form.reset();
      } catch {
        toast.error("Erro ao salvar serviço");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo serviço" : "Editar serviço"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Corte feminino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo / Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Cabelo, Estética..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (min) *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceReais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="99.90"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
