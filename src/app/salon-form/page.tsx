import { redirect } from "next/navigation";

/**
 * O salão é criado automaticamente no sign-up (via databaseHooks em auth.ts).
 * Essa rota não é mais necessária — redireciona para o dashboard.
 */
export default function SalonFormPage() {
  redirect("/dashboard");
}
