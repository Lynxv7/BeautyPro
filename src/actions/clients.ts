"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clients } from "@/db/schema";
import type { Client } from "@/db/schema";
import { requireSalonId } from "@/lib/session";

export type ClientInput = {
  name: string;
  whatsapp?: string;
  email?: string;
  notes?: string;
};

export async function getClients(): Promise<Client[]> {
  const salonId = await requireSalonId();
  return db.select().from(clients).where(eq(clients.salonId, salonId));
}

export async function createClient(data: ClientInput): Promise<void> {
  const salonId = await requireSalonId();

  await db.insert(clients).values({
    salonId,
    name: data.name,
    whatsapp: data.whatsapp,
    email: data.email,
    notes: data.notes,
  });

  revalidatePath("/dashboard/clients");
}


export async function updateClient(
  id: string,
  data: Partial<ClientInput>,
): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .update(clients)
    .set(data)
    .where(and(eq(clients.id, id), eq(clients.salonId, salonId)));

  revalidatePath("/dashboard/clients");
}

export async function deleteClient(id: string): Promise<void> {
  const salonId = await requireSalonId();

  await db
    .delete(clients)
    .where(and(eq(clients.id, id), eq(clients.salonId, salonId)));

  revalidatePath("/dashboard/clients");
}
