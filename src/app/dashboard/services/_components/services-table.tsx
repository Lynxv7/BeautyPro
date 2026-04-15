"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Service } from "@/db/schema";
import { deleteService } from "@/actions/services";
import { ServiceDialog } from "./service-dialog";

type Props = { services: Service[] };

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ServicesTable({ services }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  function handleDelete(id: string) {
    if (!confirm("Desativar este serviço?")) return;
    startTransition(async () => {
      try {
        await deleteService(id);
        toast.success("Serviço desativado");
      } catch {
        toast.error("Erro ao desativar serviço");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Novo serviço</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* ── Mobile: cards ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {services.length === 0 ? (
          <p className="py-8 text-center text-zinc-400 text-sm">
            Nenhum serviço cadastrado ainda.
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="rounded-lg border bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{service.name}</p>
                <p className="text-xs text-zinc-500">
                  {service.durationMinutes} min
                  {service.type ? ` · ${service.type}` : ""}
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {formatPrice(service.priceCents)}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditTarget(service)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop: table ──────────────────────────────────────── */}
      <div className="hidden md:block rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-zinc-400"
                >
                  Nenhum serviço cadastrado ainda.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.type ?? "—"}</TableCell>
                  <TableCell>{service.durationMinutes} min</TableCell>
                  <TableCell>{formatPrice(service.priceCents)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditTarget(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => handleDelete(service.id)}
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

      <ServiceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />

      {editTarget && (
        <ServiceDialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          mode="edit"
          service={editTarget}
        />
      )}
    </div>
  );
}
