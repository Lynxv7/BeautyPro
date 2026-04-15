import { headers } from "next/headers";
import { CalendarDays, Users, Scissors, TrendingUp } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { clients, services, appointments } from "@/db/schema";
import { eq, and, gte, count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "./modules/dashboard/actions";
import { DashboardChart } from "./modules/dashboard/components/dashboard-chart";
import { AppointmentsTable } from "./modules/dashboard/components/appointments-table";
import { TopServices } from "./modules/dashboard/components/top-services";
import { ClientsInDebt } from "./modules/dashboard/components/clients-in-debt";

async function getDashboardStats(salonId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [clientCount, serviceCount, appointmentCount, todayCount] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(clients)
        .where(eq(clients.salonId, salonId))
        .then((r) => r[0]?.count ?? 0),

      db
        .select({ count: count() })
        .from(services)
        .where(and(eq(services.salonId, salonId), eq(services.isActive, true)))
        .then((r) => r[0]?.count ?? 0),

      db
        .select({ count: count() })
        .from(appointments)
        .where(eq(appointments.salonId, salonId))
        .then((r) => r[0]?.count ?? 0),

      db
        .select({ count: count() })
        .from(appointments)
        .where(
          and(
            eq(appointments.salonId, salonId),
            gte(appointments.startsAt, today),
          ),
        )
        .then((r) => r[0]?.count ?? 0),
    ]);

  return { clientCount, serviceCount, appointmentCount, todayCount };
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const salonId = (session!.user as Record<string, unknown>).salonId as string;

  const [
    { clientCount, serviceCount, appointmentCount, todayCount },
    { chartData, todayAppointments, topServices, debtorClients },
  ] = await Promise.all([
    getDashboardStats(salonId),
    getDashboardData(salonId),
  ]);

  const stats = [
    {
      title: "Clientes",
      value: clientCount,
      icon: Users,
      description: "Total cadastrado",
    },
    {
      title: "Serviços",
      value: serviceCount,
      icon: Scissors,
      description: "Ativos no catálogo",
    },
    {
      title: "Agendamentos",
      value: appointmentCount,
      icon: CalendarDays,
      description: "Total geral",
    },
    {
      title: "Hoje",
      value: todayCount,
      icon: TrendingUp,
      description: "Agendamentos a partir de agora",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Bem-vindo de volta, {session!.user.name}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon, description }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid: 3 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left (2 cols): chart + today's appointments */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <DashboardChart data={chartData} />
          <AppointmentsTable appointments={todayAppointments} />
        </div>

        {/* Right (1 col): top services + clients in debt */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <TopServices services={topServices} />
          <ClientsInDebt clients={debtorClients} />
        </div>
      </div>
    </div>
  );
}
