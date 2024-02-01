import {
  addDays,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  startOfDay,
  subDays,
} from 'date-fns';
import { DAYS_DIFF } from './constants';

/**
 * Get the range of dates to render.
 *
 * @param date Date from which to get the range.
 * @returns Array of the dates to render.
 */
export const getRange = (date: Date): Date[] => {
  return eachDayOfInterval({
    start: subDays(date, DAYS_DIFF),
    end: addDays(date, DAYS_DIFF * 2),
  });
};

type Position = {
  top: number;
  height: number;
};

type GetPositionOfEventOptions = {
  startTime: Date;
  hourHeight: number;
};

/**
 * Calculate absolute position of the event.
 *
 * @param eventDate start and end date of the event
 * @param opts params for calculating position
 * @returns Position of the event
 */
export const getPositionOfEvent = (
  eventDate: { start: Date; end: Date },
  opts: GetPositionOfEventOptions,
): Position => {
  const { startTime, hourHeight } = opts;

  const diffMinsFromStart = differenceInMinutes(startTime, startOfDay(startTime));

  const minuteHeight = hourHeight / 60;
  const minutes = differenceInMinutes(eventDate.end, eventDate.start);

  return {
    top:
      differenceInMinutes(eventDate.start, startOfDay(eventDate.end)) * minuteHeight -
      diffMinsFromStart * minuteHeight,
    height: minutes * minuteHeight,
  };
};

type GetCorrectedPositionParams = {
  snapSize: [number, number];
  containerRect: DOMRect;
  headerHeight: number;
  asideWidth: number;
  direction: 'top' | 'bottom' | 'left' | 'right';
};

type Coords = [number, number];

/**
 * Corrects position according to the params.
 *
 * @param coords Original coordinates of the event
 * @param params
 * @returns
 */
export const getCorrectedPosition = (
  coords: Coords,
  params: GetCorrectedPositionParams,
): Coords => {
  const [x, y] = coords;
  const {
    snapSize: [snapX, snapY],
    containerRect,
    headerHeight,
    asideWidth,
    direction,
  } = params;

  const tempX = x - containerRect.left - asideWidth;
  const tempY = y - containerRect.top - headerHeight;

  const roundFunctionForY = direction === 'top' ? Math.floor : Math.ceil;

  const newX = Math.floor(tempX / snapX) * snapX;
  const newY = roundFunctionForY(tempY / snapY) * snapY + headerHeight;

  return [newX, newY];
};

type GetDateFromPositionParams = {
  start: Date;
  headerHeight: number;
  dayWidth: number;
  asideWidth: number;
  hourHeight: number;
  timeFrom: number;
  timeTo: number;
};

/**
 * Calculate date from the position.
 *
 * @param coords Coords of the position
 * @param params Calendar properties to calculate the date
 * @returns Date from the position
 */
export const getDateFromPosition = (coords: Coords, params: GetDateFromPositionParams): Date => {
  const [x, y] = coords;
  const { start, headerHeight, dayWidth, hourHeight, asideWidth, timeFrom } = params;

  const minuteHeight = hourHeight / 60;
  const date = addDays(start, Math.round((x - asideWidth) / dayWidth));
  const mins = Math.round((y - headerHeight) / minuteHeight + timeFrom * 60);

  return addMinutes(date, mins);
};

export const getAllDayDateFromPosition = (
  coords: Coords,
  params: GetDateFromPositionParams,
): Date => {
  const [x] = coords;
  const { start, dayWidth, asideWidth } = params;

  return addDays(start, Math.round((x - asideWidth) / dayWidth) + 1);
};

type GetDnDDateTimeFromPositionParams = {
  start: Date;
  containerRect: DOMRect;
  snapSize: [number, number];
  scrollLeft: number;
  scrollTop: number;
  asideWidth: number;
  headerHeight: number;
  hourHeight: number;
};

export const getDnDDateFromPosition = (
  coords: Coords,
  params: GetDnDDateTimeFromPositionParams,
) => {
  const [x, y] = coords;
  const {
    start,
    snapSize: [snapX, snapY],
    containerRect,
    asideWidth,
    scrollLeft,
    scrollTop,
    headerHeight,
    hourHeight,
  } = params;

  const isAllDay = getIsAllDay({ y, containerRect, headerHeight });

  let date = addDays(start, Math.floor((x + scrollLeft - containerRect.left - asideWidth) / snapX));

  if (!isAllDay) {
    const diff = Math.floor((y - containerRect.top - headerHeight + scrollTop) / snapY) * snapY;
    const minuteHeight = hourHeight / 60;

    date = addMinutes(date, diff / minuteHeight);
  } else {
    date = startOfDay(date);
  }

  return isAllDay ? { date, isAllDay } : { dateTime: date, isAllDay };
};

type GetIsAllDayParams = {
  y: number;
  containerRect: DOMRect;
  headerHeight: number;
};

/**
 * Returns true is dragged event is over all day block.
 *
 * @param params data required to calculate the position
 */
export const getIsAllDay = (params: GetIsAllDayParams): boolean => {
  const { y, containerRect, headerHeight } = params;

  return y < containerRect.top + headerHeight;
};

type GetDnDCorrectedPositionParams = {
  snapSize: [number, number];
  container: [number, number];
  dateLabelHeight: number;
  headerHeight: number;
  scrollTop: number;
};

export const getDnDCorrectedPosition = (coords: Coords, params: GetDnDCorrectedPositionParams) => {
  let [x, y] = coords;
  const {
    snapSize: [snapX, snapY],
    container: [containerX, containerY],
    headerHeight,
    scrollTop,
  } = params;

  x -= containerX;
  y -= containerY + headerHeight;

  x = Math.floor(x / snapX) * snapX + containerX;
  y = Math.floor((y + scrollTop) / snapY) * snapY - scrollTop + containerY + headerHeight;

  return [x, y];
};

type GetPositionFromDateParams = {
  startDate: Date;
  dayWidth: number;
  hourHeight: number;
  startHour: number;
  headerHeight: number;
};

export const getPositionFromDate = (
  date: Date,
  params: GetPositionFromDateParams,
): [number, number] => {
  const { startDate, dayWidth, hourHeight, startHour, headerHeight } = params;

  const minuteHeight = hourHeight / 60;
  const minutes = date.getHours() * 60 + date.getMinutes();

  const daysDiff = differenceInDays(date, startDate);

  return [daysDiff * dayWidth, hourHeight * (minutes - startHour * 60) / 60];
};
