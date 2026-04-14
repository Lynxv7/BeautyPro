import { getServices } from "@/actions/services";
import { ServicesTable } from "./_components/services-table";

export default async function ServicesPage() {
  const services = await getServices();
  return <ServicesTable services={services} />;
}
