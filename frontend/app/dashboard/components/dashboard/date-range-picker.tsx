"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  onDateChange?: (startDate: string, endDate: string) => void;
}

export function DateRangePicker({ onDateChange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleApply = () => {
    onDateChange?.(startDate, endDate);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
        />
      </div>
      <span className="text-muted-foreground">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
      />
      <Button onClick={handleApply} size="sm">
        Apply
      </Button>
    </div>
  );
}
