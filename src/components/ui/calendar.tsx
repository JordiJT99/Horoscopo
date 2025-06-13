
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation, useDayPicker } from "react-day-picker" // Importado useDayPicker
import { format } from "date-fns"
import { es, enUS, de, fr } from 'date-fns/locale';

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Locale as AppLocale } from "@/lib/dictionaries";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  locale?: AppLocale;
};

const dateFnsLocalesMap: Record<string, globalThis.Locale> = {
  es,
  en: enUS,
  de,
  fr,
};


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: propsLocale,
  ...props
}: CalendarProps) {
  const currentUiLocale = dateFnsLocalesMap[(propsLocale?.toString()) || 'es'] || enUS;


  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        caption_dropdowns: "flex gap-2 items-center justify-center",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
          "h-7 w-7 p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-bold aria-selected:!bg-primary aria-selected:text-accent-foreground aria-selected:font-bold",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        Dropdown: (dropdownProps) => {
          const { currentMonth: dpContextCurrentMonth } = useDayPicker(); // Mes actual del contexto DayPicker
          const { goToMonth, displayMonth: navDisplayMonth, fromYear, toYear, fromMonth, toMonth } = useNavigation();
          
          let displayDate = dpContextCurrentMonth; // Usar el mes actual del contexto de DayPicker como fuente principal

          if (!displayDate && dropdownProps.displayMonth) { // Fallback a lo que DayPicker pasa a su caption
            displayDate = dropdownProps.displayMonth;
          }
          if (!displayDate && navDisplayMonth) { // Fallback al mes de navegación general
             displayDate = navDisplayMonth;
          }
          
          if (!displayDate) {
            // Esto solo debería ocurrir si DayPicker no tiene un mes que mostrar (ej. sin defaultMonth y sin selected)
            console.warn("Calendar Dropdown: Could not determine displayDate. Rendering disabled selects. DropdownProps:", dropdownProps, "NavContext:", { navDisplayMonth, fromYear, toYear, fromMonth, toMonth }, "DPContextCurrentMonth:", dpContextCurrentMonth);
            return (
              <div className="flex gap-2 items-center justify-center" aria-live="polite">
                <Select disabled>
                  <SelectTrigger className="h-7 w-auto min-w-[6rem] px-2 text-xs font-medium text-foreground opacity-50 cursor-not-allowed" aria-label="Select month (disabled)">
                    <SelectValue placeholder={"---"} />
                  </SelectTrigger>
                </Select>
                <Select disabled>
                  <SelectTrigger className="h-7 w-auto min-w-[4.5rem] px-2 text-xs font-medium text-foreground opacity-50 cursor-not-allowed" aria-label="Select year (disabled)">
                    <SelectValue placeholder={"----"} />
                  </SelectTrigger>
                </Select>
              </div>
            );
          }

          const currentDisplayYear = displayDate.getFullYear();
          const currentDisplayMonth = displayDate.getMonth();

          // MONTH OPTIONS
          const monthOptions: { value: string; label: string }[] = [];
          const navContextFromMonth = fromMonth; // de useNavigation
          const navContextToMonth = toMonth;   // de useNavigation

          let startMonthIdx = 0;
          let endMonthIdx = 11;

          if (navContextFromMonth && navContextFromMonth.getFullYear() === currentDisplayYear) {
            startMonthIdx = Math.max(startMonthIdx, navContextFromMonth.getMonth());
          } else if (navContextFromMonth && currentDisplayYear < navContextFromMonth.getFullYear()) {
            startMonthIdx = 12; 
          }

          if (navContextToMonth && navContextToMonth.getFullYear() === currentDisplayYear) {
            endMonthIdx = Math.min(endMonthIdx, navContextToMonth.getMonth());
          } else if (navContextToMonth && currentDisplayYear > navContextToMonth.getFullYear()) {
            endMonthIdx = -1; 
          }
          
          for (let monthIdx = 0; monthIdx <= 11; monthIdx++) {
            if (monthIdx >= startMonthIdx && monthIdx <= endMonthIdx) {
               monthOptions.push({
                value: monthIdx.toString(),
                label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentUiLocale }),
              });
            }
          }
          if (monthOptions.length === 0 && (startMonthIdx <= endMonthIdx)) {
            console.warn(`Calendar Dropdown (Months): No options generated for ${currentDisplayYear} after filtering. displayDate: ${displayDate}, fromMonth: ${navContextFromMonth}, toMonth: ${navContextToMonth}. Using fallback to all months for this year.`);
            for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
                 monthOptions.push({
                    value: monthIdx.toString(),
                    label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentUiLocale }),
                });
            }
          }

          // YEAR OPTIONS
          const yearOptions: { value: string; label: string }[] = [];
          const fromYearValue = fromYear?.getFullYear() ?? (dropdownProps.fromYear?.getFullYear() ?? (currentDisplayYear - 100));
          const toYearValue = toYear?.getFullYear() ?? (dropdownProps.toYear?.getFullYear() ?? (currentDisplayYear + 10));
          
          for (let i = fromYearValue; i <= toYearValue; i++) {
            yearOptions.push({ value: i.toString(), label: i.toString() });
          }
          if (yearOptions.length === 0 && fromYearValue <= toYearValue) {
            console.warn(`Calendar Dropdown (Years): No options generated between ${fromYearValue} and ${toYearValue}. Using current year as fallback.`);
            yearOptions.push({value: currentDisplayYear.toString(), label: currentDisplayYear.toString() });
          }

          const handleMonthChange = (value: string) => {
            const newSelectedMonth = parseInt(value);
            goToMonth(new Date(currentDisplayYear, newSelectedMonth, 1));
          };

          const handleYearChange = (value: string) => {
            const newSelectedYear = parseInt(value);
            let newMonth = currentDisplayMonth;
            
            if (navContextFromMonth && newSelectedYear === navContextFromMonth.getFullYear() && newMonth < navContextFromMonth.getMonth()) {
              newMonth = navContextFromMonth.getMonth();
            }
            if (navContextToMonth && newSelectedYear === navContextToMonth.getFullYear() && newMonth > navContextToMonth.getMonth()) {
              newMonth = navContextToMonth.getMonth();
            }
            goToMonth(new Date(newSelectedYear, newMonth, 1));
          };

          return (
            <div className="flex gap-2 items-center justify-center" aria-live="polite">
              <Select
                value={currentDisplayMonth.toString()}
                onValueChange={handleMonthChange}
                disabled={monthOptions.length === 0}
              >
                <SelectTrigger
                  className="h-7 w-auto min-w-[6rem] px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                  aria-label="Select month"
                >
                  <SelectValue>
                     {format(displayDate, "MMMM", { locale: currentUiLocale })}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px] text-xs">
                  {monthOptions.map((option) => (
                    <SelectItem key={`month-opt-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentDisplayYear.toString()}
                onValueChange={handleYearChange}
                disabled={yearOptions.length === 0}
              >
                <SelectTrigger
                   className="h-7 w-auto min-w-[4.5rem] px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                  aria-label="Select year"
                >
                  <SelectValue>
                    {format(displayDate, "yyyy", { locale: currentUiLocale })}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px] text-xs">
                  {yearOptions.map((option) => (
                    <SelectItem key={`year-opt-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        },
      }}
      locale={currentUiLocale}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

