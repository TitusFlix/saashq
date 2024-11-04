'use client';

import * as React from 'react';
import { format, set } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
}

export function DatePicker({ date, setDate, label }: DatePickerProps) {
  const [month, setMonth] = React.useState<Date>(date || new Date());
  const [open, setOpen] = React.useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - 2000 + 1 },
      (_, i) => 2000 + i
    ).reverse();
  }, []);

  React.useEffect(() => {
    if (date) {
      setMonth(date);
    }
  }, [date]);

  const handleMonthSelect = (monthIndex: string) => {
    const newDate = set(month, { month: parseInt(monthIndex) });
    setMonth(newDate);
  };

  const handleYearSelect = (year: string) => {
    const newDate = set(month, { year: parseInt(year) });
    setMonth(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between space-x-2 p-3">
          <Select onValueChange={handleMonthSelect}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={format(month, 'MMMM')} />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleYearSelect}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={format(month, 'yyyy')} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          //maxDate={new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
