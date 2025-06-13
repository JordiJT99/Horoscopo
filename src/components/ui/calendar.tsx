
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
import type { Locale } from "@/lib/dictionaries";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

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
  const currentLocale = dateFnsLocalesMap[(propsLocale as Locale | undefined)?.toString() || 'es'] || enUS;


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
          const options: { value: string; label: string }[] = [];

          const displayDate = dropdownProps.displayMonth; // The month currently displayed by the dropdown

          if (dropdownProps.name === "months") {
            const availableMonths = fromMonth 
                ? Array.from({length: 12}, (_, i) => new Date(displayDate.getFullYear(), i, 1))
                    .filter(m => m >= fromMonth && (toMonth ? m <= toMonth : true) )
                : Array.from({length: 12}, (_, i) => new Date(displayDate.getFullYear(), i, 1));

            availableMonths.forEach(monthDate => {
                 options.push({
                    value: monthDate.getMonth().toString(),
                    label: format(monthDate, "MMMM", { locale: currentLocale }),
                });
            });

          } else if (dropdownProps.name === "years") {
            const firstYear = fromYear?.getFullYear() || new Date().getFullYear() - 100;
            const lastYear = toYear?.getFullYear() || new Date().getFullYear() + 0;
            for (let i = firstYear; i <= lastYear; i++) {
              options.push({ value: i.toString(), label: i.toString() });
            }
          }

          const handleChange = (value: string) => {
            if (dropdownProps.name === "months") {
              goToMonth(new Date(displayDate.getFullYear(), parseInt(value), 1));
            } else if (dropdownProps.name === "years") {
              goToMonth(new Date(parseInt(value), displayDate.getMonth(), 1));
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
                  "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" // Style when open
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
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
