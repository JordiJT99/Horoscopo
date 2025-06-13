
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation, type DropdownProps } from "react-day-picker"
import { format, type Locale as DateFnsLocale } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  // locale prop on DayPicker should be a date-fns locale object
};

function CustomDropdown(dropdownProps: DropdownProps) {
  const {
    currentMonth: dpContextCurrentMonth,
    fromDate: dpFromDate,
    toDate: dpToDate,
  } = useDayPicker();
  const { goToMonth } = useNavigation();
  const { locale } = dropdownProps; // This is the date-fns locale object

  const displayDate = dpContextCurrentMonth;

  if (!displayDate || !locale) {
    console.warn(
      "Calendar CustomDropdown: displayDate or locale is undefined. This usually means DayPicker is not initialized with a defaultMonth or selected date, or the locale prop is missing/incorrect. Rendering disabled selects.",
      { displayDateProvided: dpContextCurrentMonth, localeProvided: locale }
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
    let includeMonth = true;

    if (dpFromDate) {
      const fromDateStartOfMonth = new Date(dpFromDate.getFullYear(), dpFromDate.getMonth(), 1);
      if (monthDate < fromDateStartOfMonth && currentDisplayYear === dpFromDate.getFullYear()) {
        includeMonth = false;
      }
      if (currentDisplayYear < dpFromDate.getFullYear()) {
        includeMonth = false;
      }
    }
    if (dpToDate) {
      const toDateStartOfMonth = new Date(dpToDate.getFullYear(), dpToDate.getMonth(), 1);
      if (monthDate > toDateStartOfMonth && currentDisplayYear === dpToDate.getFullYear()) {
         includeMonth = false;
      }
      if (currentDisplayYear > dpToDate.getFullYear()) {
        includeMonth = false;
      }
    }

    if (includeMonth) {
        monthOptions.push({
            value: i.toString(),
            label: format(monthDate, "MMMM", { locale }),
        });
    }
  }
  // Fallback if specific year filtering results in no months (e.g. fromDate/toDate span less than a month within the year)
  // This should be rare if fromDate/toDate are reasonable.
  if (monthOptions.length === 0 && dpFromDate && dpToDate && currentDisplayYear >= dpFromDate.getFullYear() && currentDisplayYear <= dpToDate.getFullYear()){
     for (let i = 0; i < 12; i++) { // Add all months for that year as a fallback
        monthOptions.push({ value: i.toString(), label: format(new Date(currentDisplayYear, i, 1), "MMMM", { locale }) });
     }
  }


  // Year options
  const yearOptions: { value: string; label: string }[] = [];
  // Default to a wide range if not provided, but usually fromYear/toYear on DayPicker handles this.
  const startYear = dpFromDate ? dpFromDate.getFullYear() : currentDisplayYear - 100;
  const endYear = dpToDate ? dpToDate.getFullYear() : currentDisplayYear + 10; // Allow selecting a bit into the future if toDate is not set

  for (let i = startYear; i <= endYear; i++) {
    yearOptions.push({ value: i.toString(), label: i.toString() });
  }
   if (yearOptions.length === 0 && startYear <= endYear) { // Fallback
    yearOptions.push({value: currentDisplayYear.toString(), label: currentDisplayYear.toString()});
  }


  const handleMonthChange = (value: string) => {
    const newSelectedMonth = parseInt(value);
    goToMonth(new Date(currentDisplayYear, newSelectedMonth, 1));
  };

  const handleYearChange = (value: string) => {
    const newSelectedYear = parseInt(value);
    let newMonth = currentDisplayMonth;
    
    // If new year makes current month invalid due to fromDate/toDate, adjust month
    if (dpFromDate && newSelectedYear === dpFromDate.getFullYear() && newMonth < dpFromDate.getMonth()) {
      newMonth = dpFromDate.getMonth();
    }
    if (dpToDate && newSelectedYear === dpToDate.getFullYear() && newMonth > dpToDate.getMonth()) {
      newMonth = dpToDate.getMonth();
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
  showOutsideDays, // Prop will be ignored visually due to CSS
  ...props // Props like locale, defaultMonth, selected, onSelect, fromYear, toYear etc.
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={false} // Effectively hidden by CSS anyway
      className={cn("p-3", className)} // Padding for the caption area
      classNames={{
        // Hide all parts related to the day grid
        months: "hidden",
        month: "hidden",
        table: "hidden",
        head_row: "hidden",
        head_cell: "hidden",
        row: "hidden",
        cell: "hidden",
        day: "hidden",
        day_selected: "hidden",
        day_today: "hidden",
        day_outside: "hidden",
        day_disabled: "hidden",
        day_range_middle: "hidden",
        day_hidden: "hidden",
        day_range_end: "hidden",

        // Styles for the visible caption area
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Our CustomDropdown replaces the default label
        caption_dropdowns: "flex gap-2 items-center justify-center", // For styling the container of our dropdowns

        // Navigation buttons (optional, can be hidden too if not desired)
        // Kept for now as they allow DayPicker's internal state to be navigated
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        ...classNames, // Allow overriding these classes
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        Dropdown: CustomDropdown, // Use our custom component for month/year selection
      }}
      // Pass all other props to DayPicker.
      // Crucially, `locale` (date-fns object), `defaultMonth`, `selected`, `onSelect`,
      // `fromYear`, `toYear`, `fromDate`, `toDate`, `captionLayout="dropdown-buttons"`
      // must be passed correctly from the parent component.
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

    