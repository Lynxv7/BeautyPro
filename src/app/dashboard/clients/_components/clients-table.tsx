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
import type { Client } from "@/db/schema";
import { deleteClient } from "@/actions/clients";
import { ClientDialog } from "./client-dialog";

type Props = {
  clients: Client[];
};

export function ClientsTable({ clients }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  function handleDelete(id: string) {
    if (!confirm("Remover este cliente?")) return;
    startTransition(async () => {
      try {
        await deleteClient(id);
        toast.success("Cliente removido");
      } catch {
        toast.error("Erro ao remover cliente");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Novo cliente</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* ── Mobile: cards ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {clients.length === 0 ? (
          <p className="py-8 text-center text-zinc-400 text-sm">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg border bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{client.name}</p>
                {client.whatsapp && (
                  <p className="text-xs text-zinc-500">{client.whatsapp}</p>
                )}
                {client.email && (
                  <p className="text-xs text-zinc-500 truncate">{client.email}</p>
                )}
                {client.notes && (
                  <p className="text-xs text-zinc-400 truncate">{client.notes}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditTarget(client)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleDelete(client.id)}
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
              <TableHead>WhatsApp</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-zinc-400"
                >
                  Nenhum cliente cadastrado ainda.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.whatsapp ?? "—"}</TableCell>
                  <TableCell>{client.email ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {client.notes ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditTarget(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => handleDelete(client.id)}
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

      {/* Create dialog */}
      <ClientDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />

      {/* Edit dialog */}
      {editTarget && (
        <ClientDialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          mode="edit"
          client={editTarget}
        />
      )}
    </div>
  );
}
