import { getAppointments } from "@/actions/appointments";
import { getClients } from "@/actions/clients";
import { getServices } from "@/actions/services";
import { AppointmentsTable } from "./_components/appointments-table";

export default async function AppointmentsPage() {
  const [appointments, clients, services] = await Promise.all([
    getAppointments(),
    getClients(),
    getServices(),
  ]);

  return (
    <AppointmentsTable
      appointments={appointments}
      clients={clients}
      services={services}
    />
  );
}
