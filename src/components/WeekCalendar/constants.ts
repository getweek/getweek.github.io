import { type WeekCalendarColorScheme } from "./types";

export const defaultColorScheme: WeekCalendarColorScheme = {
  dayBackgroundColor: "#fff",
  weekendBackgroundColor: "#fff",
  dayTextColor: "#444",
  weekendTextColor: "#e00",
  mutedTextColor: "#ccc",
  delimiter: "#e5e5e5",
  weekDelimiter: "#ccc",
  eventBorderRadius: "0.5rem",
  defaultEventBackgroundColor: "#000",
  defaultEventBackgroundTextColor: "#fff",
};

export const CALENDAR_EVENT_BLOCK = Symbol("CALENDAR_EVENT_BLOCK");
export const CALENDAR_TASK_BLOCK = Symbol("CALENDAR_TASK_BLOCK");
export const CALENDAR_TIMEBOX_BLOCK = Symbol("CALENDAR_TIMEBOX_BLOCK");
