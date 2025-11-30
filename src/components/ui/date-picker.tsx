"use client"

import * as React from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale" // Assuming Polish locale is needed
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils" // Adjusted path for cn
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export function DatePicker({ date, setDate }: { date: Date | undefined, setDate: (date: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: pl }) : <span>Wybierz datę</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={pl}
        />
      </PopoverContent>
    </Popover>
  )
}