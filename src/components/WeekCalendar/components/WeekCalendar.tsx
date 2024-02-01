import React from "react";
import styled, { ThemeProvider } from "styled-components";
import type {
  IDraggable,
  WeekCalendarColorScheme,
  WeekEvent,
  WeekEventDates,
  WeekTimezone,
  WeekTimebox,
} from "../types";
import { WeekCalendarView } from "../types";
import { DayView } from "./views/DayView/DayView";
import { type ReactElement } from "react";
import { DAYS_COUNT_BY_VIEWS } from "./views/DayView/constants";

type Props<TEventData extends IDraggable, TDroppable> = {
  /**
   * Color scheme for the calendar.
   */
  colorScheme?: WeekCalendarColorScheme;
  /**
   * Currently selected date of the calendar.
   */
  date: Date;
  /**
   * Currently selected view of the calendar.
   */
  view: WeekCalendarView;
  /**
   * Height of one hour in pixels.
   */
  hourHeight?: number;
  /**
   * Drag'n'drop layers
   */
  layers: Partial<Record<WeekCalendarView, ReactElement>>;
  /**
   * List of accepted drop targets.
   */
  accepts: (string | symbol)[];
  /**
   * Events to display.
   */
  events: WeekEvent<TEventData>[];
  /**
   * Timeboxes to display.
   */
  timeboxes: WeekTimebox[];
  /**
   * Timezones to display.
   */
  timezones: WeekTimezone[];
  /**
   * Renders an event with a custom styling.
   *
   * @param event Event to render.
   * @param params Event's start and end dates.
   */
  renderEvent: (
    event: WeekEvent<TEventData>,
    params: { startDateTime: Date; endDateTime: Date },
  ) => React.ReactNode;

  /**
   * Any additional info to display in the day header.
   *
   * @param date Date of the day..
   */
  renderDayInfo?(date: Date, events: WeekEvent[]): React.ReactNode;

  /**
   * Called when user scrolls calendar to a different date.
   *
   * @param date New date.
   */
  onDateChange(date: Date): void;

  /**
   * Called when user changes calendar's visible range.
   *
   * @param range New range.
   */
  onRangeChange(range: Interval): void;

  /**
   * Called when user adds a new event.
   *
   * @param dates New dates of the event.
   * @param event The changed event.
   */
  onEventAdd(dates: WeekEventDates, event: TDroppable): void;

  /**
   * Called when user requests to add a new event.
   *
   * @param dates Dates of the new event.
   */
  onEventAddRequest(dates: WeekEventDates): void;

  /**
   * Called when user changes event dates.
   *
   * @param dates New dates of the event.
   * @param event The changed event.
   */
  onEventChange(dates: WeekEventDates, event: WeekEvent): void;

  /**
   * Called when user changes timebox dates.
   *
   * @param dates New dates of the timebox.
   * @param timebox The changed timebox.
   */
  onTimeboxChange(dates: WeekEventDates, timebox: WeekTimebox): void;

  /**
   * Called when user clicks on an event.
   *
   * @param event WeekEvent that was clicked.
   */
  onEventSelect?(event: WeekEvent): void;

  /**
   * Called when user tries to open context menu on an event.
   *
   * @param event WeekEvent that was clicked
   */
  onEventContextMenu?(event: WeekEvent, e: React.MouseEvent): void;

  /**
   * Called when user tries to open context menu on a timebox.
   *
   * @param timebox WeekTimebox that was clicked
   */
  onTimeboxContextMenu?(timebox: WeekTimebox, e: React.MouseEvent): void;
};

/**
 * Main WeekCalendar component. It is a wrapper for all other components.
 */
export const WeekCalendar = <TEventData extends IDraggable, TDroppable>(
  props: Props<TEventData, TDroppable>,
): JSX.Element => {
  const {
    events,
    timeboxes,
    colorScheme,
    date,
    view,
    timezones,
    layers,
    accepts,
    hourHeight,
    renderEvent,
    renderDayInfo,
    onDateChange,
    onRangeChange,
    onEventAdd,
    onEventAddRequest,
    onEventChange,
    onTimeboxChange,
    onEventSelect,
    onEventContextMenu,
    onTimeboxContextMenu,
  } = props;

  const renderContent = () => {
    switch (view) {
      case WeekCalendarView.Day:
      case WeekCalendarView.Week:
        return (
          <DayView
            date={date}
            accepts={accepts}
            events={events}
            timeboxes={timeboxes}
            timezones={timezones}
            daysCount={DAYS_COUNT_BY_VIEWS[view]}
            layer={layers[view]}
            hourHeight={hourHeight}
            renderEvent={renderEvent}
            renderDayInfo={renderDayInfo}
            onDateChange={onDateChange}
            onRangeChange={onRangeChange}
            onEventAdd={onEventAdd}
            onEventAddRequest={onEventAddRequest}
            onEventChange={onEventChange}
            onTimeboxChange={onTimeboxChange}
            onEventSelect={onEventSelect}
            onEventContextMenu={onEventContextMenu}
            onTimeboxContextMenu={onTimeboxContextMenu}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Root>
      <ThemeProvider theme={colorScheme}>{renderContent()}</ThemeProvider>
    </Root>
  );
};

const Root = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
`;
