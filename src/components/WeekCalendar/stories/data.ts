import { set } from 'date-fns';
import { WeekEvent, WeekTimezone, WeekTimebox } from '../types';
import { CALENDAR_EVENT_BLOCK } from '../constants';

export type EventData = {
  title: string;
  type: symbol;
};

export const defaultTimezones: WeekTimezone[] = [
  {
    label: '🏠',
    name: 'Europe/Madrid',
    isMain: true,
  },
  {
    label: '🏢',
    name: 'Europe/Moscow',
  },
];

export const defaultEvents: WeekEvent<EventData>[] = [
  {
    id: '1',
    startDateTime: set(new Date(), { hours: 10, minutes: 15 }),
    endDateTime: set(new Date(), { hours: 11, minutes: 15 }),
    data: {
      title: 'Event 1',
      type: CALENDAR_EVENT_BLOCK,
    },
  },
  {
    id: '3',
    startDateTime: set(new Date(), { hours: 0, minutes: 0 }),
    endDateTime: set(new Date(), { hours: 3, minutes: 0 }),
    data: {
      title: 'Event 3',
      type: CALENDAR_EVENT_BLOCK,
    },
  },
  {
    id: '2',
    startDate: set(new Date(), { hours: 0, minutes: 0 }),
    endDate: set(new Date(), { hours: 23, minutes: 59 }),
    data: {
      title: 'Event 2',
      type: CALENDAR_EVENT_BLOCK,
    },
  }
];

export const defaultTimeboxes: WeekTimebox[] = [
  {
    id: '1',
    title: 'Timebox 1',
    startDateTime: set(new Date(), { hours: 8, minutes: 0 }),
    endDateTime: set(new Date(), { hours: 18, minutes: 0 }),
    backgroundColor: '#274ce9',
  },
];
