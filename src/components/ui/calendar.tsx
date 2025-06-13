
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type CaptionProps, useDayPicker, useNavigation } from "react-day-picker"
import type { Locale as DateFnsLocale } from "date-fns/locale";
import { format as formatDateFns, getYear, getMonth, setYear, setMonth } from "date-fns";

import { cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = Omit<DayPickerProps, 'locale'> & { // Omit DayPicker's string locale
  locale?: DateFnsLocale; // Expect date-fns locale object
};

function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const { fromDate, toDate } = useDayPicker(); // Get date range limits

  // props.displayMonth is the month DayPicker wants this caption to render.
  // props.locale is the date-fns locale object.
  const { displayMonth, locale: dateFnsLocale } = props;

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !displayMonth || !dateFnsLocale) {
    // Fallback or minimal rendering if critical info is missing
    return (
      <div className="flex justify-center pt-1 relative items-center">
        <span className="text-sm font-medium">---</span>
        <div className="space-x-1 flex items-center ml-auto">
          <Button
            variant="outline"
            className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
            disabled={true} // Simplified for fallback
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
            disabled={true} // Simplified for fallback
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const currentDisplayYear = getYear(displayMonth);
  const currentDisplayMonthIndex = getMonth(displayMonth);

  const yearOptions: { value: string; label: string }[] = [];
  const startYear = fromDate ? getYear(fromDate) : currentDisplayYear - 100;
  const endYear = toDate ? getYear(toDate) : currentDisplayYear + 10;

  for (let i = Math.max(1900, startYear); i <= Math.min(new Date().getFullYear() + 5, endYear); i++) {
    yearOptions.push({ value: i.toString(), label: i.toString() });
  }

  const monthOptions: { value: string; label: string; disabled: boolean }[] = [];
  for (let i = 0; i < 12; i++) {
    let disabled = false;
    if (fromDate && currentDisplayYear === getYear(fromDate) && i < getMonth(fromDate)) {
      disabled = true;
    }
    if (toDate && currentDisplayYear === getYear(toDate) && i > getMonth(toDate)) {
      disabled = true;
    }
    monthOptions.push({
      value: i.toString(),
      label: formatDateFns(new Date(currentDisplayYear, i, 1), "MMMM", { locale: dateFnsLocale }),
      disabled: disabled,
    });
  }
  
  const handleYearChange = (yearValue: string) => {
    const newYear = parseInt(yearValue, 10);
    // When year changes, keep current month or adjust if it becomes invalid
    let newMonth = currentDisplayMonthIndex;
    if (fromDate && newYear === getYear(fromDate) && newMonth < getMonth(fromDate)) {
        newMonth = getMonth(fromDate);
    }
    if (toDate && newYear === getYear(toDate) && newMonth > getMonth(toDate)) {
        newMonth = getMonth(toDate);
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
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1">
        <Select
          value={currentDisplayMonthIndex.toString()}
          onValueChange={handleMonthChange}
          disabled={monthOptions.every(opt => opt.disabled)}
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
        aria-label="Next month"
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
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        // caption: "flex justify-center pt-1 relative items-center", // Default caption style, will be overridden
        // caption_label: "text-sm font-medium", // Default label style, CustomCaption handles its own
        nav: "space-x-1 flex items-center", // This might not be needed if CustomCaption handles all nav
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1", // These are for default nav buttons
        nav_button_next: "absolute right-1",   // These are for default nav buttons
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
        Caption: CustomCaption, // Use the custom caption component
        // IconLeft and IconRight are used by default nav buttons if CustomCaption doesn't render its own
        // IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        // IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
      }}
      locale={dateFnsLocaleProp} // Pass the date-fns locale object to DayPicker
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
