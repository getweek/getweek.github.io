import {
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfDay,
  format,
  isBefore,
  startOfDay,
} from 'date-fns';
import { useMemo } from 'react';
import { DATE_FORMAT } from './constants';
import type { WeekEvent } from '../../../types';

export type EventData<TData extends unknown> = {
  startDateTime: Date;
  endDateTime: Date;
  offset: number;
  width: number;
  event: WeekEvent<TData>;
  overlaps: EventData<TData>[];
  colWidth: number;
};

/**
 * Hook for calculating layout of events for DayView
 *
 * @param events Array of WeekEvents
 * @returns Map of EventData arrays, where key is date in DATE_FORMAT format
 */
export const useDayLayout = <TData extends unknown>(
  events: WeekEvent<TData>[],
): Map<string, EventData<TData>[]> => {
  return useMemo(() => {
    const result = new Map<string, EventData<TData>[]>();

    events
      .filter(
        (event) =>
          event.startDateTime &&
          event.endDateTime &&
          isBefore(event.startDateTime, event.endDateTime),
      )
      .sort((b, a) => {
        return (
          (a.startDate?.getTime() || a.startDateTime!.getTime()) -
          (b.startDate?.getTime() || b.startDateTime!.getTime())
        );
      })
      .forEach((event) => {
        if (event.startDateTime && event.endDateTime) {
          const days = eachDayOfInterval({
            start: event.startDateTime,
            end: event.endDateTime,
          });

          days.forEach((day, index) => {
            const key = format(day, DATE_FORMAT);
            const l = days.length;
            let startDateTime;
            let endDateTime;

            if (index === 0) {
              startDateTime = event.startDateTime;
            } else {
              startDateTime = startOfDay(day);
            }

            if (index === l - 1) {
              endDateTime = event.endDateTime;
            } else {
              endDateTime = endOfDay(day);
            }

            const dateEvents = result.get(key) || [];

            dateEvents.push({
              event,
              startDateTime,
              endDateTime,
              offset: -1,
              width: 1,
              overlaps: [],
              colWidth: 0,
            });

            result.set(key, dateEvents);
          });
        }
      });

    // Filling up array of overlapping events
    result.forEach((day) => {
      day.forEach((eventDataMain) => {
        day.forEach((eventDataSecond) => {
          try {
            if (
              eventDataMain !== eventDataSecond &&
              areIntervalsOverlapping(
                {
                  start: eventDataMain.event.startDateTime!,
                  end: eventDataMain.event.endDateTime!,
                },
                {
                  start: eventDataSecond.event.startDateTime!,
                  end: eventDataSecond.event.endDateTime!,
                },
              )
            ) {
              eventDataMain.overlaps.push(eventDataSecond);
            }
          } catch {
            // Do nothing
          }
        });
      });

      const cols: EventData<TData>[][] = [];
      let colIndex = 0;

      day.forEach((eventDataMain) => {
        let col = cols[colIndex] || [];
        let added = false;

        while (!added) {
          if (
            col.some((d) => {
              try {
                return areIntervalsOverlapping(
                  {
                    start: eventDataMain.event.startDateTime!,
                    end: eventDataMain.event.endDateTime!,
                  },
                  {
                    start: d.event.startDateTime!,
                    end: d.event.endDateTime!,
                  },
                );
              } catch (error) {
                return false;
              }
            })
          ) {
            colIndex++;
            col = cols[colIndex] || [];
          } else {
            col.push(eventDataMain);
            cols[colIndex] = col;
            colIndex = 0;
            added = true;
          }
        }
      });

      cols.forEach((col, index) => {
        col.forEach((d) => {
          d.offset = index;
          d.width = 1 / cols.length;
        });
      });

      day.forEach((eventDataMain) => {
        eventDataMain.colWidth = 1 / cols.length;

        for (let colIndex = eventDataMain.offset + 1; colIndex < cols.length; colIndex++) {
          const col = cols[colIndex];
          if (
            !col.some((d) => {
              try {
                return areIntervalsOverlapping(
                  {
                    start: eventDataMain.event.startDateTime!,
                    end: eventDataMain.event.endDateTime!,
                  },
                  {
                    start: d.event.startDateTime!,
                    end: d.event.endDateTime!,
                  },
                );
              } catch (error) {
                return false;
              }
            })
          ) {
            eventDataMain.width += 1 / cols.length;
          } else {
            break;
          }
        }
      });
    });

    return result;
  }, [events]);
};
