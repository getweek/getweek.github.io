import { useMemo } from "react";
import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns";
import { DATE_FORMAT } from "./constants";
import type { WeekTimebox } from "../../../types";

export const useTimeboxesLayout = (timeboxes: WeekTimebox[] = []): Map<string, WeekTimebox[]> => {
  return useMemo(() => {
    const map = new Map<string, WeekTimebox[]>();

    timeboxes.forEach((timebox) => {
      const days = eachDayOfInterval({
        start: new Date(timebox.startDateTime),
        end: new Date(timebox.endDateTime),
      });

      days.forEach((day, index) => {
        const key = format(day, DATE_FORMAT);
        const data = map.get(key) || [];

        data.push({
          ...timebox,
          startDateTime: index === 0 ? timebox.startDateTime : startOfDay(day),
          endDateTime: index === days.length - 1 ? timebox.endDateTime : endOfDay(day),
        });
        map.set(key, data);
      })
    });

    return map;
  }, [timeboxes]);
};
