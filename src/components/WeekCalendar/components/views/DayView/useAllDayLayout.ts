import { areIntervalsOverlapping, differenceInCalendarDays, endOfDay } from 'date-fns';
import { useMemo } from 'react';
import type { WeekEvent } from '../../../types';

type AllDayEventData<TEventData> = {
  event: WeekEvent<TEventData>;
  width: number;
  offset: number;
};

export const useAllDayLayout = <TEventData>(events: WeekEvent<TEventData>[]) => {
  return useMemo(() => {
    const allEvents: AllDayEventData<TEventData>[] = [];

    events
      .filter((event) => event.startDate && event.endDate && event.startDate < event.endDate)
      .forEach((event) => {
        allEvents.push({
          event,
          width: differenceInCalendarDays(event.endDate!, event.startDate!) + 1,
          offset: 0,
        });
      });

    const rows: AllDayEventData<TEventData>[][] = [[]];
    let rowIndex = 0;

    allEvents
      .sort((a, b) => {
        return b.width - a.width;
      })
      .forEach((eventData) => {
        let added = false;

        while (!added) {
          const row = rows[rowIndex] || [];

          if (
            row.some((e) =>
              areIntervalsOverlapping(
                {
                  start: eventData.event.startDate!,
                  end: eventData.event.endDate!,
                },
                {
                  start: e.event.startDate!,
                  end: e.event.endDate!,
                },
              ),
            )
          ) {
            rowIndex++;
          } else {
            row.push(eventData);
            rows[rowIndex] = row;

            rowIndex = 0;
            added = true;
          }
        }
      });

    console.log();

    rows.forEach((row, index) => {
      row.forEach((eventData) => {
        eventData.offset = index;
      });
    });

    return allEvents;
  }, [events]);
};
