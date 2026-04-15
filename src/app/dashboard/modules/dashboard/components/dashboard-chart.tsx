"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartDataPoint } from "../actions";

interface DashboardChartProps {
  data: ChartDataPoint[];
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <Card className="rounded-2xl border">
      <CardHeader>
        <CardTitle>Visão geral</CardTitle>
        <CardDescription>Agendamentos e faturamento — 21 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradAgendamentos" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.35}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFaturamento" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.35}
                />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />

            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              allowDecimals={false}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              tickFormatter={(v: number) =>
                `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
              }
            />

            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
              }}
              formatter={(value, name) => {
                const num = typeof value === "number" ? value : Number(value);
                if (name === "faturamento")
                  return [
                    `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    "Faturamento",
                  ];
                return [num, "Agendamentos"];
              }}
              labelFormatter={(label) => `Data: ${label}`}
            />

            <Legend
              formatter={(value: string) =>
                value === "agendamentos" ? "Agendamentos" : "Faturamento"
              }
            />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="agendamentos"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#gradAgendamentos)"
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="faturamento"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#gradFaturamento)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
