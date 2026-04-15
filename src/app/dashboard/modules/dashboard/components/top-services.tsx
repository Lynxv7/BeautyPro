import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopService } from "../actions";

interface TopServicesProps {
  services: TopService[];
}

export function TopServices({ services }: TopServicesProps) {
  const max = services[0]?.total ?? 1;

  return (
    <Card className="rounded-2xl border h-full">
      <CardHeader>
        <CardTitle>Top 5 serviços</CardTitle>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum serviço agendado ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {services.map((service, index) => (
              <li key={service.serviceName}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium truncate max-w-35">
                      {service.serviceName}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {service.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.round((service.total / max) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
