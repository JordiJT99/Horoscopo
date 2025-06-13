
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type CaptionProps as RDP鲞CaptionProps, useDayPicker, useNavigation } from "react-day-picker"
import type { Locale as DateFnsLocale } from "date-fns/locale";
import { format as formatDateFns, getYear, getMonth, setYear, setMonth } from "date-fns";

import { cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = Omit<DayPickerProps, 'locale'> & {
  locale?: DateFnsLocale; 
};

function CustomCaption(props: RDP鲞CaptionProps) {
  // Use hooks as the primary source of truth for DayPicker's state
  const {
    currentMonth: dpCurrentMonth, // This is the month DayPicker is currently displaying
    fromDate: dpFromDate,
    toDate: dpToDate,
    locale: dpLocale, // This is the date-fns locale from DayPicker's context
  } = useDayPicker();

  const { goToMonth, previousMonth, nextMonth } = useNavigation();

  // Assign to variables used in the rest of the component
  const displayMonth = dpCurrentMonth;
  const locale = dpLocale; // Use the locale from useDayPicker()

  if (!displayMonth || !locale) {
    console.warn(
      "CustomCaption: displayMonth or locale from useDayPicker() is undefined. Rendering disabled selects. displayMonth:",
      displayMonth,
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
          aria-label="Mês anterior (desabilitado)"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          <Select value="---" disabled>
            <SelectTrigger className="h-7 text-sm px-2 py-1 min-w-[100px] focus:ring-ring focus:ring-1 cursor-not-allowed" aria-label="Mês (desabilitado)">
              <SelectValue placeholder="---" />
            </SelectTrigger>
          </Select>
          <Select value="----" disabled>
            <SelectTrigger className="h-7 text-sm px-2 py-1 min-w-[70px] focus:ring-ring focus:ring-1 cursor-not-allowed" aria-label="Ano (desabilitado)">
              <SelectValue placeholder="----" />
            </SelectTrigger>
          </Select>
        </div>
        <Button
          variant="outline"
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
          disabled={true}
          aria-label="Próximo mês (desabilitado)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const currentDisplayYear = getYear(displayMonth);
  const currentDisplayMonthIndex = getMonth(displayMonth);

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
    if (dpFromDate && monthDateInLoop < setMonth(dpFromDate, getMonth(dpFromDate))) { // Compare month start
        if (getYear(monthDateInLoop) <= getYear(dpFromDate) && monthIdx < getMonth(dpFromDate)) {
            isDisabled = true;
        }
    }
    if (dpToDate && monthDateInLoop > setMonth(dpToDate, getMonth(dpToDate))) { // Compare month start
        if (getYear(monthDateInLoop) >= getYear(dpToDate) && monthIdx > getMonth(dpToDate)) {
            isDisabled = true;
        }
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
    const newDate = setMonth(setYear(displayMonth, newYear), newMonth);
    goToMonth(newDate);
  };

  const handleMonthChange = (monthValue: string) => {
    const newMonth = parseInt(monthValue, 10);
    const newDate = setMonth(displayMonth, newMonth);
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
          disabled={monthOptions.every(opt => opt.disabled) || monthOptions.length === 0}
        >
          <SelectTrigger 
            className="h-7 text-sm px-2 py-1 min-w-[100px] focus:ring-ring focus:ring-1" 
            aria-label="Selecionar mês"
          >
            <SelectValue placeholder="Mês" />
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
            aria-label="Selecionar ano"
          >
            <SelectValue placeholder="Ano" />
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
  locale: dateFnsLocaleProp, 
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
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
        Caption: CustomCaption, 
      }}
      locale={dateFnsLocaleProp} 
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
