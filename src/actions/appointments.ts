"use server";

import { and, eq, gte, desc, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { appointments, clients, services } from "@/db/schema";
import type { AppointmentStatus } from "@/db/schema";
import { requireSalonId } from "@/lib/session";

export type AppointmentInput = {
  clientId: string;
  serviceId: string;
  startsAt: Date;
  priceCents: number;
  notes?: string;
};

export type AppointmentWithRelations = {
  id: string;
  salonId: string;
  clientId: string;
  serviceId: string;
  startsAt: Date | null;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date | null;
  clientName: string;
  serviceName: string;
  durationMinutes: number;
  priceCents: number;
  paymentMethod: string | null;
  amountPaidCents: number | null;
  amountOwedCents: number | null;
};

export async function getAppointments(): Promise<AppointmentWithRelations[]> {
  const salonId = await requireSalonId();

  const rows = await db
    .select({
      id: appointments.id,
      salonId: appointments.salonId,
      clientId: appointments.clientId,
      serviceId: appointments.serviceId,
      startsAt: appointments.startsAt,
      status: appointments.status,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      clientName: clients.name,
      serviceName: services.name,
      durationMinutes: services.durationMinutes,
      priceCents: appointments.priceCents,
      paymentMethod: appointments.paymentMethod,
      amountPaidCents: appointments.amountPaidCents,
      amountOwedCents: appointments.amountOwedCents,
    })
    .from(appointments)
    .innerJoin(clients, eq(appointments.clientId, clients.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(appointments.salonId, salonId))
    .orderBy(desc(appointments.startsAt));

  return rows;
}

export async function getTodayAppointments(): Promise<
  AppointmentWithRelations[]
> {
  const salonId = await requireSalonId();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = await db
    .select({
      id: appointments.id,
      salonId: appointments.salonId,
      clientId: appointments.clientId,
      serviceId: appointments.serviceId,
      startsAt: appointments.startsAt,
      status: appointments.status,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      clientName: clients.name,
      serviceName: services.name,
      durationMinutes: services.durationMinutes,
      priceCents: appointments.priceCents,
      paymentMethod: appointments.paymentMethod,
      amountPaidCents: appointments.amountPaidCents,
      amountOwedCents: appointments.amountOwedCents,
    })
    .from(appointments)
    .innerJoin(clients, eq(appointments.clientId, clients.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(eq(appointments.salonId, salonId), gte(appointments.startsAt, today)),
    )
    .orderBy(appointments.startsAt);

  return rows;
}

export async function createAppointment(data: AppointmentInput): Promise<void> {
  const salonId = await requireSalonId();

  await db.insert(appointments).values({
    salonId,
    clientId: data.clientId,
    serviceId: data.serviceId,
    startsAt: data.startsAt,
    priceCents: data.priceCents,
    notes: data.notes,
  });

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .update(appointments)
    .set({ status })
    .where(and(eq(appointments.id, id), eq(appointments.salonId, salonId)));

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
}

export type PaymentInput = {
  paymentMethod: string;
  amountPaidCents: number;
  amountOwedCents: number;
};

export async function completeAppointment(
  id: string,
  payment: PaymentInput,
): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .update(appointments)
    .set({
      status: "completed",
      paymentMethod: payment.paymentMethod,
      amountPaidCents: payment.amountPaidCents,
      amountOwedCents: payment.amountOwedCents,
    })
    .where(and(eq(appointments.id, id), eq(appointments.salonId, salonId)));

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
}

export async function deleteAppointment(id: string): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .delete(appointments)
    .where(and(eq(appointments.id, id), eq(appointments.salonId, salonId)));

  revalidatePath("/dashboard/appointments");
}

export async function getDebtorAppointments(): Promise<
  AppointmentWithRelations[]
> {
  const salonId = await requireSalonId();

  const rows = await db
    .select({
      id: appointments.id,
      salonId: appointments.salonId,
      clientId: appointments.clientId,
      serviceId: appointments.serviceId,
      startsAt: appointments.startsAt,
      status: appointments.status,
      notes: appointments.notes,
      createdAt: appointments.createdAt,
      clientName: clients.name,
      serviceName: services.name,
      durationMinutes: services.durationMinutes,
      priceCents: appointments.priceCents,
      paymentMethod: appointments.paymentMethod,
      amountPaidCents: appointments.amountPaidCents,
      amountOwedCents: appointments.amountOwedCents,
    })
    .from(appointments)
    .innerJoin(clients, eq(appointments.clientId, clients.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(
        eq(appointments.salonId, salonId),
        gt(appointments.amountOwedCents, 0),
      ),
    )
    .orderBy(desc(appointments.startsAt));

  return rows;
}

export type SettleDebtInput = {
  paymentMethod: string;
};

export async function settleDebt(
  id: string,
  input: SettleDebtInput,
): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .update(appointments)
    .set({
      paymentMethod: input.paymentMethod,
      amountOwedCents: 0,
    })
    .where(and(eq(appointments.id, id), eq(appointments.salonId, salonId)));

  revalidatePath("/dashboard/debtors");
  revalidatePath("/dashboard");
}
