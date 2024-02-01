import React from 'react';
import type { TTask } from '../components/App/types';

export interface CalendarEvent {
  id: string;
  title: string;
  draggable?: boolean;
  data?: {
    task?: TTask;
  };
  startDate?: Date;
  startDateTime?: Date;
  endDate?: Date;
  endDateTime?: Date;
  duration?: number;
}

export type CalendarUpdateParams<T = any> = {
  startDate?: Date;
  startDateTime?: Date;
  endDate?: Date;
  endDateTime?: Date;
  duration?: number;
  data: T;
}

export enum CalendarView {
  Day = 'Day',
  Days3 = 'Days3',
  WorkWeek = 'WorkWeek',
  Week = 'Week',
  Month = 'Month',
}

export type DateMutator = (date: Date, direction: 1 | 0 | -1, weekStart?: 0 | 1) => Date

export type Coords = [number, number];

export interface RenderCalendarEventParams {
  isDragging: boolean;
  isPast: boolean;
  event: CalendarEvent;
  style: React.CSSProperties;
}

export type ColorScheme = {
  dayBackgroundColor: string;
  weekendBackgroundColor: string;
  dayColor: string;
  borderColor: string;
}
