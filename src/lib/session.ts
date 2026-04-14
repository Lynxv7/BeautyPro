"use server";

import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Retorna o salonId do usuário autenticado.
 * Lança erro se não houver sessão ou salonId.
 * Use em server actions e route handlers.
 */
export async function requireSalonId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });

  // salonId vem via additionalFields configurado no auth.ts
  const salonId = (session?.user as Record<string, unknown> | undefined)
    ?.salonId as string | undefined;

  if (!session?.user || !salonId) {
    throw new Error("Unauthorized: sem sessão ou salonId");
  }

  return salonId;
}

/**
 * Retorna a sessão completa ou null (sem lançar erro).
 */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
