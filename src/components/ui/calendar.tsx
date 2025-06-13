
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"
import { format } from "date-fns"
import { es, enUS, de, fr } from 'date-fns/locale';

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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
  const currentLocale = dateFnsLocalesMap[(propsLocale as AppLocale | undefined)?.toString() || 'es'] || enUS;


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
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
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
          buttonVariants({ variant: "ghost" }),
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
          const { goToMonth, displayMonth, fromYear, toYear, fromMonth, toMonth } = useNavigation();
          const displayDate = displayMonth; // Use displayMonth from useNavigation hook

          if (!displayDate) {
            console.warn("Calendar Dropdown: displayMonth from useNavigation() is undefined. Rendering disabled selects. Props:", dropdownProps);
            return (
              <div className="flex gap-2 items-center justify-center">
                <Select disabled>
                  <SelectTrigger className="h-7 w-auto px-2 text-xs font-medium text-foreground opacity-50" aria-label="Select month (disabled)">
                    <SelectValue placeholder={"---"} />
                  </SelectTrigger>
                </Select>
                <Select disabled>
                  <SelectTrigger className="h-7 w-auto px-2 text-xs font-medium text-foreground opacity-50" aria-label="Select year (disabled)">
                    <SelectValue placeholder={"----"} />
                  </SelectTrigger>
                </Select>
              </div>
            );
          }

          const monthOptions: { value: string; label: string }[] = [];
          const yearOptions: { value: string; label: string }[] = [];

          const currentDisplayYear = displayDate.getFullYear();

          let startMonthIdx = 0;
          let endMonthIdx = 11;

          if (fromMonth && fromMonth.getFullYear() === currentDisplayYear) {
            startMonthIdx = fromMonth.getMonth();
          } else if (fromMonth && currentDisplayYear < fromMonth.getFullYear()){
            startMonthIdx = 12; // No months this year
          }

          if (toMonth && toMonth.getFullYear() === currentDisplayYear) {
            endMonthIdx = toMonth.getMonth();
          } else if (toMonth && currentDisplayYear > toMonth.getFullYear()){
            endMonthIdx = -1; // No months this year
          }
          
          for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
            if (monthIdx >= startMonthIdx && monthIdx <= endMonthIdx) {
               monthOptions.push({
                value: monthIdx.toString(),
                label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentLocale }),
              });
            }
          }

          if (monthOptions.length === 0 && (startMonthIdx <= endMonthIdx)) {
            console.warn(`Calendar Dropdown (Months): No options generated for ${currentDisplayYear} after filtering. displayDate: ${displayDate}, fromMonth: ${fromMonth}, toMonth: ${toMonth}. Using fallback to all months.`);
            for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
                 monthOptions.push({
                    value: monthIdx.toString(),
                    label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentLocale }),
                });
            }
          }

          const firstYear = fromYear ? fromYear.getFullYear() : currentDisplayYear - 100;
          const lastYear = toYear ? toYear.getFullYear() : currentDisplayYear + 10;
          for (let i = firstYear; i <= lastYear; i++) {
            yearOptions.push({ value: i.toString(), label: i.toString() });
          }
           if (yearOptions.length === 0 && firstYear <= lastYear) {
             console.warn(`Calendar Dropdown (Years): No options generated between ${firstYear} and ${lastYear}. Using current year as fallback.`);
             yearOptions.push({value: currentDisplayYear.toString(), label: currentDisplayYear.toString() });
           }

          const handleMonthChange = (value: string) => {
            const newSelectedMonth = parseInt(value);
            goToMonth(new Date(currentDisplayYear, newSelectedMonth, 1));
          };

          const handleYearChange = (value: string) => {
            const newSelectedYear = parseInt(value);
            let newMonth = displayDate.getMonth();
            if (fromMonth && newSelectedYear === fromMonth.getFullYear() && newMonth < fromMonth.getMonth()) {
              newMonth = fromMonth.getMonth();
            }
            if (toMonth && newSelectedYear === toMonth.getFullYear() && newMonth > toMonth.getMonth()) {
              newMonth = toMonth.getMonth();
            }
            goToMonth(new Date(newSelectedYear, newMonth, 1));
          };

          const currentMonthValue = displayDate.getMonth().toString();
          const currentYearValue = currentDisplayYear.toString();

          return (
            <div className="flex gap-2 items-center justify-center">
              <Select
                value={currentMonthValue}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger
                  className={cn(
                    "h-7 w-auto px-2 text-xs font-medium text-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                  )}
                  aria-label="Select month"
                >
                  <SelectValue>
                     {format(displayDate, "MMMM", { locale: currentLocale })}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px] text-xs">
                  {monthOptions.map((option) => (
                    <SelectItem key={`month-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentYearValue}
                onValueChange={handleYearChange}
              >
                <SelectTrigger
                   className={cn(
                    "h-7 w-auto px-2 text-xs font-medium text-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                  )}
                  aria-label="Select year"
                >
                  <SelectValue>
                    {format(displayDate, "yyyy", { locale: currentLocale })}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px] text-xs">
                  {yearOptions.map((option) => (
                    <SelectItem key={`year-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        },
      }}
      locale={currentLocale}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

