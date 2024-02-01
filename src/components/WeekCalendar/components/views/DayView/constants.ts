import { WeekCalendarView } from "../../../types";

/**
 * Amount of extra days to render before and after the current date.
 */
export const DAYS_DIFF = 14;

/**
 * Amount of days to scroll from the current date to start rendering
 * new days.
 */
export const DAYS_THRESHOLD = 7;

/**
 * Width of the calendar's time sidebar.
 */
export const ASIDE_WIDTH = 60;

/**
 * Height of the calendar's date label.
 */
export const DATE_LABEL_HEIGHT = 50;

/**
 * Date format used for inner purposes only.
 */
export const DATE_FORMAT = 'dd.MM.yyyy';

/**
 * Padding between events and the day end line.
 */
export const EVENTS_PADDING_RIGHT = 10;

export const DAYS_COUNT_BY_VIEWS = {
  [WeekCalendarView.Day]: 1,
  [WeekCalendarView.Week]: 7,
}
