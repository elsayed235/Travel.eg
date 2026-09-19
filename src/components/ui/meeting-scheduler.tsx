// src/components/ui/meeting-scheduler.tsx
//
// Date-range scheduler card (adapted from an Originui-style shadcn component).
// Re-skinned for the Dahab Luxury theme engine: every color routes through the
// theme-reactive tokens (--color-accent-primary gold, --surface-card,
// --border-subtle), display type uses the Cormorant/El Messiri font-display
// stack, and animation runs through `motion/react` like the rest of the app.
"use client";

import * as React from "react";
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface MeetingSchedulerProps {
  /** The main title for the scheduler card. */
  title?: string;
  /** A short description under the title. */
  description?: string;
  /** The text for the schedule confirmation button. */
  scheduleButtonText?: string;
  /** The text for the cancel button. */
  cancelButtonText?: string;
  /** Weekday headers, Monday-first. Defaults to English abbreviations. */
  weekdayLabels?: string[];
  /** Initial selected start date. */
  initialStartDate?: Date;
  /** Initial selected end date. */
  initialEndDate?: Date;
  /** Callback fired when the schedule button is clicked. */
  onSchedule: (details: { startDate: Date | null; endDate: Date | null; aiNotes: boolean }) => void;
  /** Callback fired when the cancel button is clicked. */
  onCancel: () => void;
}

const formatTime = (date: Date | null) => (date ? format(date, "h:mm a") : "—");

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  title = "Schedule a meeting",
  description = "Create your next meeting easily.",
  scheduleButtonText = "Schedule",
  cancelButtonText = "Cancel",
  weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  initialStartDate,
  initialEndDate,
  onSchedule,
  onCancel,
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialStartDate || new Date()));
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);
  const [aiNotes, setAiNotes] = useState(false);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (isBefore(day, startDate)) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const getEventSummary = () => {
    if (!startDate) return description; // falls back to the card description pre-selection
    const startFormatted = format(startDate, "MMM d");
    if (!endDate) return `${startFormatted}`;
    return `${startFormatted} – ${format(endDate, "MMM d")}, ${formatTime(startDate)} – ${formatTime(endDate)}`;
  };

  return (
    <Card className="w-full max-w-4xl overflow-hidden border-border-subtle bg-surface-card/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CardHeader className="flex-row items-start gap-4">
          <div className="rounded-full bg-accent-primary/10 p-3 text-accent-primary">
            <Clock className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
          {/* Left: calendar */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="Previous month">
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </Button>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={format(currentMonth, "MMMM yyyy")}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="font-display text-lg font-medium"
                >
                  {format(currentMonth, "MMMM yyyy")}
                </motion.h3>
              </AnimatePresence>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Next month">
                <ChevronRight className="h-5 w-5" aria-hidden />
              </Button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs text-text-secondary">
              {weekdayLabels.map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isSelected =
                  (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
                const isInRange = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);
                const isStart = startDate && isSameDay(day, startDate);
                const isEnd = endDate && isSameDay(day, endDate);

                return (
                  <motion.button
                    key={day.toString()}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors duration-200",
                      !isSameMonth(day, currentMonth) && "text-text-secondary/40",
                      isSameDay(day, new Date()) && !isSelected && "font-bold text-accent-primary",
                      isSelected && "bg-accent-primary text-[var(--accent-primary-ink)]",
                      isInRange && "rounded-none bg-accent-primary/15 text-text-primary",
                      isStart && "rounded-r-none",
                      isEnd && "rounded-l-none",
                    )}
                  >
                    {format(day, "d")}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: inputs */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="scheduler-start-date" className="text-sm">Start date*</Label>
                <div className="mt-2 flex items-center rounded-xl border border-border-subtle bg-canvas p-3">
                  <span className="flex-grow text-sm">
                    {startDate ? format(startDate, "MMMM d, yyyy") : "—"}
                  </span>
                  <span className="rounded-lg bg-accent-primary/10 px-3 py-1 text-sm font-semibold text-accent-primary">
                    {formatTime(startDate)}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="scheduler-end-date" className="text-sm">End date*</Label>
                <div className="mt-2 flex items-center rounded-xl border border-border-subtle bg-canvas p-3">
                  <span className="flex-grow text-sm">
                    {endDate ? format(endDate, "MMMM d, yyyy") : "—"}
                  </span>
                  <span className="rounded-lg bg-accent-primary/10 px-3 py-1 text-sm font-semibold text-accent-primary">
                    {formatTime(endDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Label htmlFor="scheduler-ai-notes">AI notes</Label>
                <Switch id="scheduler-ai-notes" checked={aiNotes} onCheckedChange={setAiNotes} />
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4">
              <p className="mb-4 text-sm text-text-secondary">{getEventSummary()}</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>{cancelButtonText}</Button>
                <Button onClick={() => onSchedule({ startDate, endDate, aiNotes })} disabled={!startDate || !endDate}>
                  {scheduleButtonText}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
};
