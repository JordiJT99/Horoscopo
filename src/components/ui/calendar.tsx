
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"
import { format } from "date-fns"
import { es, enUS, de, fr } from 'date-fns/locale'; // Import locales

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Locale as AppLocale } from "@/lib/dictionaries"; // Renamed to avoid conflict

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  locale?: AppLocale; // Use our AppLocale type
};


// Map locales for date-fns
const dateFnsLocalesMap: Record<string, globalThis.Locale> = { // Use string for key, globalThis.Locale for value
  es,
  en: enUS,
  de,
  fr,
};


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: propsLocale, // Get locale from props
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
        caption_label: "text-sm font-medium hidden", // Hide default label if using custom dropdowns
        caption_dropdowns: "flex gap-2 items-center justify-center", // Style for the container of dropdowns
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
          const { fromYear, toYear, fromMonth, toMonth, goToMonth } = useNavigation();
          const displayDate = dropdownProps.displayMonth;

          if (!displayDate) {
            console.warn("Calendar Dropdown: displayDate is undefined. Props:", dropdownProps);
            return (
              <Select disabled>
                <SelectTrigger className={cn(buttonVariants({ variant: "ghost" }), "h-7 w-auto px-2 text-xs font-medium text-foreground")}>
                  <SelectValue placeholder={dropdownProps.name === "months" ? format(new Date(), "MMMM", {locale: currentLocale}) : new Date().getFullYear().toString() } />
                </SelectTrigger>
              </Select>
            );
          }

          const options: { value: string; label: string }[] = [];

          if (dropdownProps.name === "months") {
            const currentDisplayYear = displayDate.getFullYear();
            let startMonthIndex = 0;
            let endMonthIndex = 11;

            if (fromMonth) {
                if (currentDisplayYear === fromMonth.getFullYear()) {
                    startMonthIndex = fromMonth.getMonth();
                } else if (currentDisplayYear < fromMonth.getFullYear()) {
                    startMonthIndex = 12; // Effectively disable months for this year
                }
            }

            if (toMonth) {
                if (currentDisplayYear === toMonth.getFullYear()) {
                    endMonthIndex = toMonth.getMonth();
                } else if (currentDisplayYear > toMonth.getFullYear()) {
                    endMonthIndex = -1; // Effectively disable months for this year
                }
            }
            
            for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
                if (monthIdx >= startMonthIndex && monthIdx <= endMonthIndex) {
                    options.push({
                        value: monthIdx.toString(),
                        label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentLocale }),
                    });
                }
            }

            if (options.length === 0) {
                console.warn(`Calendar Dropdown (Months): No options generated for ${currentDisplayYear} after filtering. Using fallback.`);
                // Fallback: generate all months for the displayDate's year if filtering resulted in none
                for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
                    options.push({
                        value: monthIdx.toString(),
                        label: format(new Date(currentDisplayYear, monthIdx, 1), "MMMM", { locale: currentLocale }),
                    });
                }
            }
          } else if (dropdownProps.name === "years") {
            const first = fromYear ? fromYear.getFullYear() : 1900;
            const last = toYear ? toYear.getFullYear() : new Date().getFullYear();
            for (let i = first; i <= last; i++) {
              options.push({ value: i.toString(), label: i.toString() });
            }
            if (options.length === 0 && first <=last ) { // Safety net if loop somehow failed
                 console.warn(`Calendar Dropdown (Years): No options generated between ${first} and ${last}. Using current year.`);
                 options.push({value: displayDate.getFullYear().toString(), label: displayDate.getFullYear().toString() });
            }
          }

          const handleChange = (value: string) => {
            const newSelectedValue = parseInt(value);
            if (dropdownProps.name === "months") {
              goToMonth(new Date(displayDate.getFullYear(), newSelectedValue, 1));
            } else if (dropdownProps.name === "years") {
              let newMonth = displayDate.getMonth();
              if (fromMonth && newSelectedValue === fromMonth.getFullYear() && newMonth < fromMonth.getMonth()) {
                newMonth = fromMonth.getMonth();
              }
              if (toMonth && newSelectedValue === toMonth.getFullYear() && newMonth > toMonth.getMonth()) {
                newMonth = toMonth.getMonth();
              }
              goToMonth(new Date(newSelectedValue, newMonth, 1));
            }
          };
          
          const currentDropdownValue = dropdownProps.name === "months" 
            ? displayDate.getMonth().toString() 
            : displayDate.getFullYear().toString();

          return (
            <Select
              value={currentDropdownValue}
              onValueChange={handleChange}
              aria-label={dropdownProps.name === "months" ? "Select month" : "Select year"}
            >
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-7 w-auto px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground",
                  "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" 
                )}
              >
                <SelectValue>
                  {dropdownProps.name === "months"
                    ? format(displayDate, "MMMM", { locale: currentLocale })
                    : format(displayDate, "yyyy", { locale: currentLocale })}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[200px] text-xs">
                {options.map((option) => (
                  <SelectItem key={`${dropdownProps.name}-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

