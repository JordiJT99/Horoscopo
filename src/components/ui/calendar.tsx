
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation, type DropdownProps } from "react-day-picker"
import { format } from "date-fns"
// No es necesario importar es, enUS, de, fr aquí directamente si el locale se pasa correctamente

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Locale as AppDateFnsLocale } from "date-fns"; // Using date-fns Locale type

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  // locale prop on DayPicker should be a date-fns locale object
  // The AppLocale ('es', 'en') is used by the parent component to fetch the date-fns locale object
};


function CustomDropdown(dropdownProps: DropdownProps) {
  const { currentMonth: dpContextCurrentMonth, fromDate, toDate, goToMonth } = useDayPicker();
  const { locale } = dropdownProps; // This locale is the date-fns locale object

  // Use currentMonth from useDayPicker context as the primary source for displayDate
  const displayDate = dpContextCurrentMonth;

  if (!displayDate || !locale) {
    console.warn(
      "Calendar Dropdown: displayDate or locale is undefined. Rendering disabled selects.",
      { displayDate, locale }
    );
    return (
      <div className="flex gap-2 items-center justify-center rd_caption-dropdowns" aria-live="polite">
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

  // Month options
  const monthOptions: { value: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(currentDisplayYear, i, 1);
    if (fromDate && new Date(currentDisplayYear, i, 1) < new Date(fromDate.getFullYear(), fromDate.getMonth(), 1) && currentDisplayYear === fromDate.getFullYear()) continue;
    if (toDate && new Date(currentDisplayYear, i, 1) > new Date(toDate.getFullYear(), toDate.getMonth(), 1) && currentDisplayYear === toDate.getFullYear()) continue;
    if (fromDate && currentDisplayYear < fromDate.getFullYear()) continue;
    if (toDate && currentDisplayYear > toDate.getFullYear()) continue;

    monthOptions.push({
      value: i.toString(),
      label: format(monthDate, "MMMM", { locale }),
    });
  }
  if (monthOptions.length === 0) {
    // Fallback if strict filtering leads to no options (should be rare if fromDate/toDate are reasonable)
    for (let i = 0; i < 12; i++) {
      monthOptions.push({
        value: i.toString(),
        label: format(new Date(currentDisplayYear, i, 1), "MMMM", { locale }),
      });
    }
  }


  // Year options
  const yearOptions: { value: string; label: string }[] = [];
  const startYear = fromDate ? fromDate.getFullYear() : currentDisplayYear - 100;
  const endYear = toDate ? toDate.getFullYear() : currentDisplayYear + 0; // Limit to current year by default if toDate not specified
  
  for (let i = startYear; i <= endYear; i++) {
    yearOptions.push({ value: i.toString(), label: i.toString() });
  }
   if (yearOptions.length === 0 && startYear <= endYear) {
        yearOptions.push({value: currentDisplayYear.toString(), label: currentDisplayYear.toString() });
    }


  const handleMonthChange = (value: string) => {
    const newSelectedMonth = parseInt(value);
    goToMonth(new Date(currentDisplayYear, newSelectedMonth, 1));
  };

  const handleYearChange = (value: string) => {
    const newSelectedYear = parseInt(value);
    let newMonth = currentDisplayMonth;
    
    if (fromDate && newSelectedYear === fromDate.getFullYear() && newMonth < fromDate.getMonth()) {
      newMonth = fromDate.getMonth();
    }
    if (toDate && newSelectedYear === toDate.getFullYear() && newMonth > toDate.getMonth()) {
      newMonth = toDate.getMonth();
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
          aria-label="Seleccionar mes"
        >
          <SelectValue>
            {format(displayDate, "MMMM", { locale })}
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
          aria-label="Seleccionar año"
        >
          <SelectValue>
            {format(displayDate, "yyyy", { locale })}
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
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: dateFnsLocale, // This prop must be a date-fns locale object
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden", // Hidden because CustomDropdown handles display
        caption_dropdowns: "flex gap-2 items-center justify-center", // Class for the div wrapping Selects
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
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        Dropdown: CustomDropdown, // Use our custom component
      }}
      locale={dateFnsLocale} // Pass the date-fns locale object here
      {...props} // defaultMonth, selected, onSelect, captionLayout="dropdown-buttons" etc. are passed here
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
