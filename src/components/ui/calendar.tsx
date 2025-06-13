
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DayPickerProps } from "react-day-picker"
import type { Locale as DateFnsLocale } from "date-fns/locale";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = DayPickerProps & {
  locale?: DateFnsLocale; // Keep this if you are passing date-fns locale object
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale, // Expecting date-fns locale object
  captionLayout = "dropdown", // Default to dropdowns for month/year
  ...props
}: CalendarProps) {
  // Ensure defaultMonth is always a Date object if not provided or if it's undefined
  const aValidDefaultMonth = props.defaultMonth || props.month || props.selected ? (props.defaultMonth || props.month || (props.selected as Date)) : new Date();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: cn("flex justify-center pt-1 relative items-center", captionLayout?.startsWith("dropdown") && "space-x-2"),
        caption_label: cn("text-sm font-medium", captionLayout === "buttons" && "hidden"), // Hide default label if using dropdowns from library
        caption_dropdowns: "flex gap-1", // Class for react-day-picker's own dropdowns container
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
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        dropdown: "rdp-dropdown bg-card text-card-foreground border-input rounded-md text-sm px-1 py-0.5 focus:ring-1 focus:ring-ring", // Basic styling for RDP dropdowns
        dropdown_month: "rdp-dropdown_month",
        dropdown_year: "rdp-dropdown_year",
        ...classNames,
      }}
      locale={locale} // Pass the date-fns locale object
      captionLayout={captionLayout} // Use react-day-picker's internal dropdowns
      defaultMonth={aValidDefaultMonth} // Ensure a default month is always set
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
