import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TodayAppointment } from "../actions";

interface AppointmentsTableProps {
  appointments: TodayAppointment[];
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  return (
    <Card className="rounded-2xl border">
      <CardHeader>
        <CardTitle>Agendamentos de hoje</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum agendamento para hoje.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 text-left font-medium">Horário</th>
                  <th className="py-2 text-left font-medium">Cliente</th>
                  <th className="py-2 text-left font-medium">Serviço</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b last:border-0">
                    <td className="py-2 tabular-nums text-muted-foreground">
                      {formatTime(appt.startsAt)}
                    </td>
                    <td className="py-2 font-medium">{appt.clientName}</td>
                    <td className="py-2 text-muted-foreground">
                      {appt.serviceName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
