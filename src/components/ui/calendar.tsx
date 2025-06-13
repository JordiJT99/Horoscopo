
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"
import { format } from "date-fns"
import { es, enUS, de, fr } from 'date-fns/locale';

import { cn } from "@/lib/utils"
// Removed buttonVariants import as it's no longer directly used for SelectTriggers here
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Locale as AppLocale } from "@/lib/dictionaries";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  locale?: AppLocale; // Changed from globalThis.Locale to AppLocale
};

const dateFnsLocalesMap: Record<string, globalThis.Locale> = { // Keep globalThis.Locale here for date-fns
  es,
  en: enUS,
  de,
  fr,
};


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: propsLocale, // Use propsLocale for clarity
  ...props
}: CalendarProps) {
  const currentLocale = dateFnsLocalesMap[(propsLocale?.toString()) || 'es'] || enUS;


  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden", // Hidden as dropdowns show value
        caption_dropdowns: "flex gap-2 items-center justify-center", // Ensure this class is used
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          // Using base button styles from globals or minimal styling if buttonVariants caused issues
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
          // Base button styles
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
          const { goToMonth, displayMonth: navDisplayMonth, fromYear: navFromYear, toYear: navToYear, fromMonth: navFromMonth, toMonth: navToMonth } = useNavigation();
          
          let displayDate = dropdownProps.displayMonth; // Primary source from DayPicker's caption context
          if (!displayDate && navDisplayMonth) {
            // console.warn("Calendar Dropdown: dropdownProps.displayMonth is undefined. Falling back to navDisplayMonth from useNavigation().");
            displayDate = navDisplayMonth; // Fallback to useNavigation's displayMonth
          }

          if (!displayDate) {
            console.warn("Calendar Dropdown: Both dropdownProps.displayMonth and navDisplayMonth (from useNavigation) are undefined. Rendering disabled selects. DropdownProps:", dropdownProps, "NavContext:", { navDisplayMonth, navFromYear, navToYear, navFromMonth, navToMonth });
            return (
              <div className="flex gap-2 items-center justify-center" aria-live="polite">
                <Select disabled>
                  <SelectTrigger className="h-7 w-auto px-2 text-xs font-medium text-foreground opacity-50 cursor-not-allowed" aria-label="Select month (disabled)">
                    <SelectValue placeholder={"---"} />
                  </SelectTrigger>
                </Select>
                <Select disabled>
                  <SelectTrigger className="h-7 w-auto px-2 text-xs font-medium text-foreground opacity-50 cursor-not-allowed" aria-label="Select year (disabled)">
                    <SelectValue placeholder={"----"} />
                  </SelectTrigger>
                </Select>
              </div>
            );
          }

          const currentDisplayYear = displayDate.getFullYear();
          const currentDisplayMonth = displayDate.getMonth();

          // Determine overall range from useNavigation, falling back to dropdownProps if nav context is incomplete
          const fromYearValue = navFromYear?.getFullYear() ?? dropdownProps.fromYear?.getFullYear() ?? 1900;
          const toYearValue = navToYear?.getFullYear() ?? dropdownProps.toYear?.getFullYear() ?? new Date().getFullYear() + 10;
          
          const monthOptions: { value: string; label: string }[] = [];
          let startMonthIndex = 0;
          let endMonthIndex = 11;

          const effectiveFromMonth = navFromMonth ?? dropdownProps.fromMonth;
          const effectiveToMonth = navToMonth ?? dropdownProps.toMonth;

          if (effectiveFromMonth && effectiveFromMonth.getFullYear() === currentDisplayYear) {
            startMonthIndex = effectiveFromMonth.getMonth();
          } else if (effectiveFromMonth && currentDisplayYear < effectiveFromMonth.getFullYear()) {
            startMonthIndex = 12; // Effectively no months this year before fromMonth
          }

          if (effectiveToMonth && effectiveToMonth.getFullYear() === currentDisplayYear) {
            endMonthIndex = effectiveToMonth.getMonth();
          } else if (effectiveToMonth && currentDisplayYear > effectiveToMonth.getFullYear()) {
            endMonthIndex = -1; // Effectively no months this year after toMonth
          }
          
          for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
            if (monthIdx >= startMonthIndex && monthIdx <= endMonthIndex) {
               monthOptions.push({
                value: monthIdx.toString(),
                label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentLocale }),
              });
            }
          }
          
          if (monthOptions.length === 0 && (startMonthIndex <= endMonthIndex)) {
            // Fallback if filtering somehow results in no options for a seemingly valid range.
            // This could happen if DayPicker's internal state for displayMonth is temporarily misaligned with fromMonth/toMonth.
            // console.warn(`Calendar Dropdown (Months): No options generated for ${currentDisplayYear} after filtering. displayDate: ${displayDate}, fromMonth: ${effectiveFromMonth}, toMonth: ${effectiveToMonth}. Using fallback to all months.`);
            for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
                 monthOptions.push({
                    value: monthIdx.toString(),
                    label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentLocale }),
                });
            }
          }


          const yearOptions: { value: string; label: string }[] = [];
          for (let i = fromYearValue; i <= toYearValue; i++) {
            yearOptions.push({ value: i.toString(), label: i.toString() });
          }
          if (yearOptions.length === 0 && fromYearValue <= toYearValue) {
            // console.warn(`Calendar Dropdown (Years): No options generated between ${fromYearValue} and ${toYearValue}. Using current year as fallback.`);
            yearOptions.push({value: currentDisplayYear.toString(), label: currentDisplayYear.toString() });
          }


          const handleMonthChange = (value: string) => {
            const newSelectedMonth = parseInt(value);
            goToMonth(new Date(currentDisplayYear, newSelectedMonth, 1));
          };

          const handleYearChange = (value: string) => {
            const newSelectedYear = parseInt(value);
            let newMonth = currentDisplayMonth; // Keep current month if possible
            
            // Adjust month if it falls outside the new year's valid range
            if (effectiveFromMonth && newSelectedYear === effectiveFromMonth.getFullYear() && newMonth < effectiveFromMonth.getMonth()) {
              newMonth = effectiveFromMonth.getMonth();
            }
            if (effectiveToMonth && newSelectedYear === effectiveToMonth.getFullYear() && newMonth > effectiveToMonth.getMonth()) {
              newMonth = effectiveToMonth.getMonth();
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
                value={currentDisplayYear.toString()}
                onValueChange={handleYearChange}
                disabled={yearOptions.length === 0}
              >
                <SelectTrigger
                   className="h-7 w-auto min-w-[4.5rem] px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
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
      locale={currentLocale} // Pass the date-fns locale to DayPicker
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
