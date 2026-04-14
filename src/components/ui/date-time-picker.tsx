"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Selecione data e horário",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const selectedHour = value?.getHours() ?? 9;
  const selectedMinute = value ? Math.round(value.getMinutes() / 5) * 5 : 0;

  function handleDaySelect(day: Date | undefined) {
    if (!day) {
      onChange(undefined);
      return;
    }
    const next = new Date(day);
    next.setHours(selectedHour, selectedMinute, 0, 0);
    onChange(next);
  }

  function handleHourSelect(hour: number) {
    const base = value ?? new Date();
    const next = new Date(base);
    next.setHours(hour, selectedMinute, 0, 0);
    onChange(next);
  }

  function handleMinuteSelect(minute: number) {
    const base = value ?? new Date();
    const next = new Date(base);
    next.setHours(selectedHour, minute, 0, 0);
    onChange(next);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {value
            ? format(value, "dd/MM/yyyy HH:mm", { locale: ptBR })
            : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Calendário */}
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDaySelect}
            locale={ptBR}
            initialFocus
          />

          {/* Seletor de hora + minuto */}
          <div className="flex border-l divide-x">
            {/* Horas */}
            <ScrollArea className="h-66 w-16">
              <div className="flex flex-col p-1 gap-0.5">
                {HOURS.map((h) => (
                  <Button
                    key={h}
                    variant={selectedHour === h ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-center text-xs px-1"
                    onClick={() => handleHourSelect(h)}
                  >
                    {String(h).padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Minutos */}
            <ScrollArea className="h-66 w-16">
              <div className="flex flex-col p-1 gap-0.5">
                {MINUTES.map((m) => (
                  <Button
                    key={m}
                    variant={selectedMinute === m ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-center text-xs px-1"
                    onClick={() => handleMinuteSelect(m)}
                  >
                    {String(m).padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {value ? format(value, "HH:mm", { locale: ptBR }) : "--:--"}
          </div>
          <Button size="sm" onClick={() => setOpen(false)}>
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
