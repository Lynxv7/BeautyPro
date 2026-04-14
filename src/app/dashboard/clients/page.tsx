import { getClients } from "@/actions/clients";
import { ClientsTable } from "./_components/clients-table";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsTable clients={clients} />;
}
