import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarWithPresets } from "@/components/ui/calendar-with-presets";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const today = new Date();

const presets: { label: string; range: DateRange }[] = [
  { label: "Hoje", range: { from: today, to: today } },
  { label: "Ontem", range: { from: subDays(today, 1), to: subDays(today, 1) } },
  { label: "Últimos 7 dias", range: { from: subDays(today, 6), to: today } },
  { label: "Últimos 14 dias", range: { from: subDays(today, 13), to: today } },
  { label: "Últimos 30 dias", range: { from: subDays(today, 29), to: today } },
  { label: "Últimos 90 dias", range: { from: subDays(today, 89), to: today } },
  { label: "Mês atual", range: { from: startOfMonth(today), to: today } },
  { label: "Trimestre atual", range: { from: startOfQuarter(today), to: today } },
  { label: "Ano atual", range: { from: startOfYear(today), to: today } },
  { label: "Mês anterior", range: { from: startOfMonth(subDays(startOfMonth(today), 1)), to: endOfMonth(subDays(startOfMonth(today), 1)) } },
  { label: "Trimestre anterior", range: { from: startOfQuarter(subDays(startOfQuarter(today), 1)), to: endOfQuarter(subDays(startOfQuarter(today), 1)) } },
  { label: "Ano anterior", range: { from: startOfYear(subDays(startOfYear(today), 1)), to: endOfYear(subDays(startOfYear(today), 1)) } },
];

interface DashboardDatePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DashboardDatePicker = ({ dateRange, onDateRangeChange }: DashboardDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(dateRange?.to ?? today);

  const formatRange = () => {
    if (!dateRange?.from) return "Selecione o período";
    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "dd MMM yyyy", { locale: ptBR });
    }
    return `${format(dateRange.from, "dd MMM", { locale: ptBR })} – ${format(dateRange.to, "dd MMM yyyy", { locale: ptBR })}`;
  };

  const handlePreset = (range: DateRange) => {
    onDateRangeChange(range);
    setMonth(range.to ?? today);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 justify-start gap-2 text-sm font-normal",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {formatRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
        <div className="flex">
          {/* Presets sidebar */}
          <div className="flex flex-col gap-0.5 border-r border-border p-3 max-h-[340px] overflow-y-auto min-w-[160px]">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.range)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  dateRange?.from?.getTime() === preset.range.from?.getTime() &&
                    dateRange?.to?.getTime() === preset.range.to?.getTime()
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-2">
            <CalendarWithPresets
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              month={month}
              onMonthChange={setMonth}
              numberOfMonths={2}
              disabled={{ after: today }}
              initialFocus
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DashboardDatePicker;
