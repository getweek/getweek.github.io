import { useCallback, useEffect, useState } from 'react';
import {
  addDays,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import type { Interval } from 'date-fns';
import { CalendarView } from '../types/calendar';
import type { DateMutator } from '../types/calendar';

export const useCalendarRange = (
  startDate: Date,
  view: CalendarView,
  weekStart: 0 | 1,
) => {
  const [date, setDate] = useState<Date>(startDate);
  const [range, setRange] = useState<Interval>(
    getRangeForView(date, view, weekStart),
  );

  useEffect(() => {
    setRange(getRangeForView(date, view, weekStart));
  }, [date, view, weekStart]);

  const prev = useCallback(() => {
    if (!view || !date) return;

    const mutator = DateMutators[view];
    setDate(mutator(date, -1, weekStart));
  }, [view, date]);

  const next = useCallback(() => {
    if (!view || !date) return;

    const mutator = DateMutators[view];
    setDate(mutator(date, 1, weekStart));
  }, [view, date]);

  const today = useCallback(() => {
    const mutator = DateMutators[view];
    setDate(mutator(date, 0, weekStart));
  }, [date]);

  return {
    date,
    range,
    today,
    next,
    prev,
    setDate,
  };
};

const getRangeForView = (
  date: Date,
  view: CalendarView,
  weekStart: 0 | 1,
): Interval => {
  switch (view) {
    case CalendarView.Days3:
      return {
        start: startOfDay(date),
        end: endOfDay(addDays(date, 2)),
      };
    case CalendarView.Week: {
      return {
        start: date,
        end: addDays(date, 6),
      };
    }
    case CalendarView.Day:
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
    default:
      throw new Error('There is no such View');
  }
};

const DateMutators: Record<CalendarView, DateMutator> = {
  [CalendarView.Day]: (date, direction) =>
    direction === 0 ? new Date() : addDays(date, 1 * direction),
  [CalendarView.Days3]: (date, direction) =>
    direction === 0 ? new Date() : addDays(date, 3 * direction),
  [CalendarView.WorkWeek]: (date) => {
    return date;
  },
  [CalendarView.Week]: (date, direction, weekStart) =>
    direction === 0
      ? startOfWeek(new Date(), { weekStartsOn: weekStart })
      : startOfWeek(addDays(date, 7 * direction), { weekStartsOn: weekStart }),
  [CalendarView.Month]: (date) => {
    return date;
  },
};
