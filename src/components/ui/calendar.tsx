
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type CaptionProps, useDayPicker, useNavigation } from "react-day-picker"
import type { Locale as DateFnsLocale } from "date-fns/locale";
import { format as formatDateFns, getYear, getMonth, setYear, setMonth } from "date-fns";

import { cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, 'locale'> & {
  locale?: DateFnsLocale;
};

function CustomCaptionComponent(props: CaptionProps) {
  const {
    currentMonth: dpCurrentMonth,
    fromDate: dpFromDate,
    toDate: dpToDate,
    locale: dpLocale,
  } = useDayPicker();
  const { goToMonth, previousMonth, nextMonth } = useNavigation();

  const displayMonthDate = dpCurrentMonth; // This is the month DayPicker is currently displaying
  const locale = dpLocale;

  if (!displayMonthDate || !locale) {
    console.warn(
      "CustomCaptionComponent: displayMonthDate or locale from useDayPicker() is undefined. Rendering disabled selects. displayMonthDate:",
      displayMonthDate,
      "locale:",
      locale
    );
    // Fallback rendering for disabled state
    return (
      <div className="flex justify-between items-center gap-1 p-1 relative">
        <Button
          variant="outline"
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
          disabled={true}
          aria-label="Previous month (disabled)"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          <Select value="---" disabled>
            <SelectTrigger className="h-7 text-sm px-2 py-1 min-w-[100px] focus:ring-ring focus:ring-1 cursor-not-allowed" aria-label="Month (disabled)">
              <SelectValue placeholder="---" />
            </SelectTrigger>
          </Select>
          <Select value="----" disabled>
            <SelectTrigger className="h-7 text-sm px-2 py-1 min-w-[70px] focus:ring-ring focus:ring-1 cursor-not-allowed" aria-label="Year (disabled)">
              <SelectValue placeholder="----" />
            </SelectTrigger>
          </Select>
        </div>
        <Button
          variant="outline"
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
          disabled={true}
          aria-label="Next month (disabled)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const currentDisplayYear = getYear(displayMonthDate);
  const currentDisplayMonthIndex = getMonth(displayMonthDate);

  // Year options
  const yearOptions: { value: string; label: string }[] = [];
  const fromYearValue = dpFromDate ? getYear(dpFromDate) : currentDisplayYear - 100;
  const toYearValue = dpToDate ? getYear(dpToDate) : currentDisplayYear + 10;

  for (let i = Math.max(1900, fromYearValue); i <= Math.min(new Date().getFullYear() + 5, toYearValue); i++) {
    yearOptions.push({ value: i.toString(), label: i.toString() });
  }

  // Month options
  const monthOptions: { value: string; label: string; disabled: boolean }[] = [];
  for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
    const monthDateInLoop = new Date(currentDisplayYear, monthIdx, 1);
    let isDisabled = false;
    if (dpFromDate && getYear(monthDateInLoop) === getYear(dpFromDate) && monthIdx < getMonth(dpFromDate)) {
      isDisabled = true;
    }
    if (dpFromDate && getYear(monthDateInLoop) < getYear(dpFromDate)) {
      isDisabled = true;
    }
    if (dpToDate && getYear(monthDateInLoop) === getYear(dpToDate) && monthIdx > getMonth(dpToDate)) {
      isDisabled = true;
    }
    if (dpToDate && getYear(monthDateInLoop) > getYear(dpToDate)) {
      isDisabled = true;
    }
    monthOptions.push({
      value: monthIdx.toString(),
      label: formatDateFns(monthDateInLoop, "MMMM", { locale }),
      disabled: isDisabled,
    });
  }

  const handleYearChange = (yearValue: string) => {
    const newYear = parseInt(yearValue, 10);
    let newMonth = currentDisplayMonthIndex;
    // Adjust month if it becomes invalid in the new year due to fromDate/toDate
    if (dpFromDate && newYear === getYear(dpFromDate) && newMonth < getMonth(dpFromDate)) {
      newMonth = getMonth(dpFromDate);
    }
    if (dpToDate && newYear === getYear(dpToDate) && newMonth > getMonth(dpToDate)) {
      newMonth = getMonth(dpToDate);
    }
    const newDate = setMonth(setYear(displayMonthDate, newYear), newMonth);
    goToMonth(newDate);
  };

  const handleMonthChange = (monthValue: string) => {
    const newMonth = parseInt(monthValue, 10);
    const newDate = setMonth(displayMonthDate, newMonth);
    goToMonth(newDate);
  };

  return (
    <div className="flex justify-between items-center gap-1 p-1 relative">
      <Button
        variant="outline"
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1">
        <Select
          value={currentDisplayMonthIndex.toString()}
          onValueChange={handleMonthChange}
          disabled={monthOptions.filter(opt => !opt.disabled).length === 0}
        >
          <SelectTrigger
            className="h-7 text-sm px-2 py-1 min-w-[100px] focus:ring-ring focus:ring-1"
            aria-label="Seleccionar mes"
          >
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={`month-${option.value}`} value={option.value} disabled={option.disabled}>
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
            className="h-7 text-sm px-2 py-1 min-w-[70px] focus:ring-ring focus:ring-1"
            aria-label="Seleccionar año"
          >
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((option) => (
              <SelectItem key={`year-${option.value}`} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale: dateFnsLocaleProp, // This is the date-fns locale object
  ...props
}: CalendarProps) {
  // If captionLayout is 'dropdown' or 'dropdown-buttons', DayPicker will use its own dropdowns or this custom one.
  // We need to ensure it uses ours.
  const effectiveCaptionLayout = props.captionLayout?.includes("dropdown") ? props.captionLayout : "buttons";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption_label: "text-sm font-medium", // Default label, hidden by custom caption
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ), // Default nav buttons, hidden by custom caption
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
        ...classNames,
      }}
      components={{
        Caption: CustomCaptionComponent,
      }}
      locale={dateFnsLocaleProp} // Pass the date-fns locale object
      captionLayout={effectiveCaptionLayout} // Ensure DayPicker tries to use dropdowns if specified
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

    