import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DebtorClient } from "../actions";

interface ClientsInDebtProps {
  clients: DebtorClient[];
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ClientsInDebt({ clients }: ClientsInDebtProps) {
  const max = clients[0]?.totalOwedCents ?? 1;

  return (
    <Card className="rounded-2xl border h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clientes em haver</CardTitle>
        {clients.length > 0 && (
          <Link
            href="/dashboard/debtors"
            className="text-xs text-primary hover:underline"
          >
            Ver todos
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum cliente com valor em aberto.
          </p>
        ) : (
          <ul className="space-y-4">
            {clients.map((client) => (
              <li key={client.clientName}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate max-w-40">
                    {client.clientName}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-amber-600">
                    {formatPrice(client.totalOwedCents)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{
                      width: `${Math.round((client.totalOwedCents / max) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
