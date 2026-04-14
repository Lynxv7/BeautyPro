"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { services } from "@/db/schema";
import type { Service } from "@/db/schema";
import { requireSalonId } from "@/lib/session";

export type ServiceInput = {
  name: string;
  durationMinutes: number;
  priceCents: number;
  type?: string;
};

export async function getServices(): Promise<Service[]> {
  const salonId = await requireSalonId();
  return db
    .select()
    .from(services)
    .where(and(eq(services.salonId, salonId), eq(services.isActive, true)));
}

export async function createService(data: ServiceInput): Promise<void> {
  const salonId = await requireSalonId();

  await db.insert(services).values({
    salonId,
    name: data.name,
    durationMinutes: data.durationMinutes,
    priceCents: data.priceCents,
    type: data.type,
  });

  revalidatePath("/dashboard/services");
}

export async function updateService(
  id: string,
  data: Partial<ServiceInput>,
): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .update(services)
    .set(data)
    .where(and(eq(services.id, id), eq(services.salonId, salonId)));

  revalidatePath("/dashboard/services");
}

export async function deleteService(id: string): Promise<void> {
  const salonId = await requireSalonId();

  // Soft delete: marca como inativo
  await db
    .update(services)
    .set({ isActive: false })
    .where(and(eq(services.id, id), eq(services.salonId, salonId)));

  revalidatePath("/dashboard/services");
}
