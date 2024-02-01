export interface IDraggable {
  type: symbol;
}

export enum WeekCalendarView {
  Day = 'Day',
  Days3 = 'Days3',
  WorkWeek = 'WorkWeek',
  Week = 'Week',
  Month = 'Month',
}

export type WeekTimezone = {
  label: string;
  name: string;
  isMain?: boolean;
}

export type WeekCalendarColorScheme = {
  dayBackgroundColor: string;
  weekendBackgroundColor: string;
  dayTextColor: string;
  weekendTextColor: string;
  mutedTextColor: string;
  delimiter: string;
  weekDelimiter: string;
  eventBorderRadius: string;
  defaultEventBackgroundColor: string;
  defaultEventBackgroundTextColor: string;
};

export type WeekEventDates = {
  startDate?: Date;
  endDate?: Date;
  startDateTime?: Date;
  endDateTime?: Date;
};

export type WeekEvent<TData = unknown> = {
  id: string;
  startDate?: Date;
  endDate?: Date;
  startDateTime?: Date;
  endDateTime?: Date;
  data: TData;
};

export type WeekTimebox = {
  id: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  backgroundColor: string;
}

export type DayViewLayerProps = {
  dayWidth: number;
  start: Date;
  startHour: number;
  endHour: number;
  asideWidth: number;
  dateLabelHeight: number;
  headerHeight: number;
  hourHeight: number;
  container: HTMLDivElement;
  containerRect: DOMRect;
  defaultDuration?: number;
};

