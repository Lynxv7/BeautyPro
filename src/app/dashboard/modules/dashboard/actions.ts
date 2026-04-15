"use server";

import { sql, count, sum, eq, gte, lte, and, desc } from "drizzle-orm";

import { db } from "@/db";
import { appointments, clients, services } from "@/db/schema";

export type ChartDataPoint = {
  date: string;
  agendamentos: number;
  faturamento: number;
};

export type TodayAppointment = {
  id: string;
  clientName: string;
  serviceName: string;
  startsAt: Date;
};

export type TopService = {
  serviceName: string;
  total: number;
};

export type DashboardData = {
  chartData: ChartDataPoint[];
  todayAppointments: TodayAppointment[];
  topServices: TopService[];
};

export async function getDashboardData(
  salonId: string,
): Promise<DashboardData> {
  const now = new Date();

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 10);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 10);
  endDate.setHours(23, 59, 59, 999);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const dateGroup = sql<string>`TO_CHAR(${appointments.startsAt} AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD')`;

  const [chartRows, todayRows, topServicesRows] = await Promise.all([
    db
      .select({
        day: dateGroup,
        total: count(),
        revenue: sum(appointments.priceCents),
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.salonId, salonId),
          gte(appointments.startsAt, startDate),
          lte(appointments.startsAt, endDate),
        ),
      )
      .groupBy(dateGroup)
      .orderBy(dateGroup),

    db
      .select({
        id: appointments.id,
        clientName: clients.name,
        serviceName: services.name,
        startsAt: appointments.startsAt,
      })
      .from(appointments)
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(
        and(
          eq(appointments.salonId, salonId),
          gte(appointments.startsAt, todayStart),
          lte(appointments.startsAt, todayEnd),
        ),
      )
      .orderBy(appointments.startsAt),

    db
      .select({
        serviceName: services.name,
        total: count(),
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.salonId, salonId))
      .groupBy(services.name)
      .orderBy(desc(count()))
      .limit(5),
  ]);

  // Build the full 21-day range, filling zeroes for days without appointments
  const chartMap = new Map<string, { total: number; revenue: number }>();
  for (const row of chartRows) {
    chartMap.set(row.day, {
      total: row.total,
      revenue: Number(row.revenue ?? 0),
    });
  }

  const chartData: ChartDataPoint[] = [];
  for (let i = -10; i <= 10; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const data = chartMap.get(key);

    chartData.push({
      date: label,
      agendamentos: data?.total ?? 0,
      faturamento: data ? data.revenue / 100 : 0,
    });
  }

  return {
    chartData,
    todayAppointments: todayRows.map((r) => ({
      ...r,
      startsAt: r.startsAt as Date,
    })),
    topServices: topServicesRows,
  };
}
