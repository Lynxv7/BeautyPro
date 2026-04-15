import { getDebtorAppointments } from "@/actions/appointments";
import { DebtorsTable } from "./_components/debtors-table";

export default async function DebtorsPage() {
  const appointments = await getDebtorAppointments();
  return <DebtorsTable appointments={appointments} />;
}
