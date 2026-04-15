"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabledDate?: (date: Date) => boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  disabledDate,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={ptBR}
          initialFocus
          disabled={disabledDate}
        />
      </PopoverContent>
    </Popover>
  );
}
