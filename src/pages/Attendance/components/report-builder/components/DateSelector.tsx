import { useState } from 'react';
import { format, endOfMonth, startOfMonth } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ReportType } from '../types';

interface DateSelectorProps {
  reportType: ReportType;
  startDate: Date;
  onDateChange: (startDate: Date, endDate?: Date) => void;
}

export const DateSelector = ({
  reportType,
  startDate,
  onDateChange,
}: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    if (reportType === 'MONTHLY') {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      onDateChange(start, end);
      setOpen(false);
    } else if (reportType === 'DAILY') {
      onDateChange(date);
      setOpen(false);
    }
  };

  const getDisplayLabel = () => {
    if (reportType === 'MONTHLY') {
      return format(startDate, 'MMMM yyyy');
    }
    return format(startDate, 'PPP');
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {reportType === 'MONTHLY' ? 'Select Month' : 'Select Date'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {reportType === 'MONTHLY'
            ? 'Choose the month for the report'
            : 'Choose the date for the report'}
        </p>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {getDisplayLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={startDate}
            onSelect={(date: Date | undefined) => {
              if (date) handleDateSelect(date);
            }}
            disabled={(date) =>
              date > new Date() || date < new Date('2024-01-01')
            }
          />
        </PopoverContent>
      </Popover>

      {reportType === 'MONTHLY' && (
        <div className="text-xs text-muted-foreground p-2 bg-accent rounded-md">
          <p>
            <strong>Period:</strong> {format(startOfMonth(startDate), 'MMM d')} to{' '}
            {format(endOfMonth(startDate), 'MMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
};
