import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  type ReactElement,
  type MouseEvent,
} from "react";
import styled from "styled-components";
import {
  addDays,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  format,
  isToday,
  set,
  startOfDay,
  subDays,
} from "date-fns";
import { formatInTimeZone as formatTz } from "date-fns-tz";
import { eachHourOfInterval, isSameDay, isWeekend, setHours } from "date-fns";
import { useDayLayout } from "./useDayLayout";
import {
  ASIDE_WIDTH,
  DATE_FORMAT,
  DATE_LABEL_HEIGHT,
  DAYS_DIFF,
  DAYS_THRESHOLD,
  EVENTS_PADDING_RIGHT,
} from "./constants";
import {
  getCorrectedPosition,
  getDateFromPosition,
  getDnDDateFromPosition,
  getPositionOfEvent,
  getRange,
} from "./utils";
import type {
  IDraggable,
  WeekEvent,
  WeekEventDates,
  WeekTimezone,
  WeekTimebox,
} from "../../../types";
import { EventBlock } from "./EventBlock";
import { useDrop } from "react-dnd";
import {
  CALENDAR_EVENT_BLOCK,
  CALENDAR_TASK_BLOCK,
  CALENDAR_TIMEBOX_BLOCK,
} from "../../../constants";
import { useAllDayLayout } from "./useAllDayLayout";
import { AllDayEventBlock } from "./AllDayEventBlock";
import { useTimeboxesLayout } from "./useTimeboxesLayout";
import { TimeboxBlock } from "./TimeboxBlock";
import { Timeline } from "./Timeline";
import { CurrentTime } from "./CurrentTime";
import type { NewAllDayEvent, NewEvent } from "./types";

type Props<TDroppable> = {
  /**
   * Currently selected date of the calendar.
   */
  date: Date;

  /**
   * Events to display.
   */
  events: WeekEvent<IDraggable>[];

  /**
   * Timeboxes to display.
   */
  timeboxes: WeekTimebox[];

  /**
   * Timezones to display.
   */
  timezones: WeekTimezone[];

  /**
   * Edit mode of the calendar.
   */
  mode?: "events" | "timeboxes";

  /**
   * List of accepted drop targets
   */
  accepts?: (string | symbol)[];

  /**
   * Drag'n'drop layer for displaying dragging events
   */
  layer?: ReactElement;

  /**
   * Amount of days to display.
   */
  daysCount: number;

  /**
   * Hour from which to start displaying calendar grid.
   */
  startHour?: number;

  /**
   * Hour at which to end displaying calendar grid.
   */
  endHour?: number;

  /**
   * Height of an hour in pixels.
   */
  hourHeight?: number;

  /**
   * Calls to render an event with a custom styling.
   *
   * @param event Event to render.
   * @param params Actual value of event start and end dates.
   */
  renderEvent(
    event: WeekEvent,
    params: { startDateTime: Date; endDateTime: Date },
  ): React.ReactNode;

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

export const DayView = <TEventData extends IDraggable, TDroppable>(
  props: Props<TDroppable>,
): JSX.Element => {
  const {
    date,
    events = [],
    timeboxes = [],
    timezones = [],
    accepts = [],
    mode = "events",
    layer,
    daysCount,
    startHour = 0,
    endHour = 23,
    hourHeight = 100,
    renderEvent,
    renderDayInfo = () => null,
    onDateChange,
    onRangeChange,
    onEventAdd,
    onEventChange,
    onEventAddRequest,
    onTimeboxChange,
    onEventSelect,
    onEventContextMenu,
    onTimeboxContextMenu,
  } = props;

  const isFirstRender = useRef(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRectRef = useRef<DOMRect>(null);

  const edges = useRef({
    left: 0,
    right: 0,
  });
  const direction = useRef(0);

  const asideWidth = ASIDE_WIDTH * timezones.length;
  const [dayWidth, setDayWidth] = useState(0);
  const [headerHeight] = useState(DATE_LABEL_HEIGHT + (100 / 4) * 2.5);
  const [range, setRange] = useState(getRange(date));

  const [newEvent, setNewEvent] = useState<NewEvent | null>(null);
  const [newAllDayEvent, setNewAllDayEvent] = useState<NewAllDayEvent | null>(
    null,
  );

  const hours = eachHourOfInterval({
    start: setHours(date, startHour),
    end: setHours(date, endHour),
  });

  const eventsMap = useDayLayout<IDraggable>(events);
  const allDayEvents = useAllDayLayout<IDraggable>(events);
  const timeboxesMap = useTimeboxesLayout(timeboxes);

  const [, dropRef] = useDrop({
    accept: [
      ...accepts,
      CALENDAR_EVENT_BLOCK,
      CALENDAR_TASK_BLOCK,
      CALENDAR_TIMEBOX_BLOCK,
    ],
    collect: (monitor) => ({
      type: monitor.getItemType(),
    }),
    drop: (item, monitor) => {
      const type = monitor.getItemType();
      const coords = monitor.getClientOffset();

      if (!coords || !rootRectRef.current || !rootRef.current) {
        return null;
      }

      const event = item as WeekEvent;
      let duration = 30;
      let dates;

      const dateInfo = getDnDDateFromPosition([coords.x, coords.y], {
        start: range[0],
        snapSize: [dayWidth, hourHeight / 4],
        scrollLeft: rootRef.current.scrollLeft,
        scrollTop: rootRef.current.scrollTop,
        containerRect: rootRectRef.current,
        asideWidth,
        hourHeight: hourHeight,
        headerHeight,
      });

      if (
        type === CALENDAR_EVENT_BLOCK ||
        type === CALENDAR_TASK_BLOCK ||
        type === CALENDAR_TIMEBOX_BLOCK ||
        accepts.includes(type)
      ) {
        if (!dateInfo.isAllDay) {
          if (event.endDateTime) {
            duration = differenceInMinutes(
              new Date(event.endDateTime),
              new Date(event.startDateTime),
            );
          } else {
            duration = 60 / 2;
          }
        } else {
          if (event.endDate) {
            duration = differenceInMinutes(
              new Date(event.endDate),
              new Date(event.startDate),
            );
          } else {
            duration = 60 * 24;
          }
        }
      }

      if (dateInfo.date) {
        dates = {
          startDate: dateInfo.date,
          endDate: addMinutes(dateInfo.date, duration),
          startDateTime: null,
          endDateTime: null,
        };
      } else {
        dates = {
          startDate: null,
          endDate: null,
          startDateTime: dateInfo.dateTime,
          endDateTime: addMinutes(dateInfo.dateTime, duration),
        };
      }

      if (type === CALENDAR_TASK_BLOCK || type === CALENDAR_EVENT_BLOCK) {
        onEventChange(dates, item as WeekEvent);
      } else if (type === CALENDAR_TIMEBOX_BLOCK) {
        onTimeboxChange(dates, item as WeekTimebox);
      } else {
        onEventAdd(dates, item as TDroppable);
      }
    },
  });

  useEffect(() => {
    if (rootRef.current) {
      if (direction.current === 0) {
        const index = range.findIndex((d) => isSameDay(d, date));
        rootRef.current.scrollLeft = dayWidth * index;
        rootRef.current.scrollTop = 800;
      } else if (direction.current === -1) {
        rootRef.current.scrollLeft = edges.current.left + DAYS_DIFF * dayWidth;
      } else if (direction.current === 1) {
        rootRef.current.scrollLeft = edges.current.right - DAYS_DIFF * dayWidth;
      }

      direction.current = 0;
    }
  }, [range, dayWidth]);

  const handleResize = (element) => {
    const rect = element?.getBoundingClientRect();

    if (rect) {
      const dayWidth = (rect.width - asideWidth) / daysCount;

      if (rootRef.current) {
        rootRectRef.current = rootRef.current.getBoundingClientRect();
      }

      edges.current = {
        left: DAYS_THRESHOLD * dayWidth,
        right: (range.length - DAYS_THRESHOLD * 2) * dayWidth,
      };

      setDayWidth(dayWidth);
    }
  };

  useEffect(() => {
    const resize = () => {
      handleResize(bodyRef.current);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(rootRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const newRange = getRange(date);

    onRangeChange({
      start: newRange[0],
      end: newRange[newRange.length - 1],
    });
    setRange(newRange);
  }, [date]);

  const renderEvents = (date: Date) => {
    const key = format(date, DATE_FORMAT);
    const events = eventsMap.get(key) || [];

    return events.map((eventData) => {
      const position = getPositionOfEvent(
        {
          start: eventData.startDateTime,
          end: eventData.endDateTime,
        },
        {
          startTime: set(date, {
            hours: startHour,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
          }),
          hourHeight,
        },
      );

      const eventWidth = (dayWidth - EVENTS_PADDING_RIGHT) * eventData.width;
      const colWidth = (dayWidth - EVENTS_PADDING_RIGHT) * eventData.colWidth;

      return (
        <EventBlock
          key={eventData.event.id}
          event={eventData.event}
          top={position.top}
          height={position.height}
          renderEvent={renderEvent}
          container={rootRef.current}
          dayWidth={dayWidth}
          hourHeight={hourHeight}
          asideWidth={asideWidth}
          headerHeight={headerHeight}
          containerRect={rootRectRef.current}
          startHour={startHour}
          endHour={endHour}
          startDate={range[0]}
          style={{
            width: eventWidth,
            left: eventData.offset * colWidth,
          }}
          onEventSelect={onEventSelect}
          onEventChange={onEventChange}
          onEventContextMenu={onEventContextMenu}
        />
      );
    });
  };

  const renderAllDayEvents = () => {
    return allDayEvents.map((eventData) => {
      const diff = differenceInDays(eventData.event.startDate!, range[0]);
      const length =
        differenceInDays(eventData.event.endDate!, eventData.event.startDate!) -
        1;

      return (
        <AllDayEventBlock
          key={eventData.event.id}
          event={eventData.event}
          left={diff * dayWidth}
          length={length}
          style={{
            top: `${(eventData.offset * hourHeight) / 4}px`,
          }}
          start={range[0]}
          hourHeight={hourHeight}
          renderEvent={renderEvent}
          container={rootRef.current}
          dayWidth={dayWidth}
          asideWidth={asideWidth}
          headerHeight={headerHeight}
          containerRect={rootRectRef.current}
          onEventChange={onEventChange}
        />
      );
    });
  };

  const renderDay = (date: Date, index: number) => {
    const style = {
      width: `${dayWidth}px`,
      left: index * dayWidth + asideWidth,
    };

    return (
      <Day style={style} key={date.getTime()}>
        {hours.map((hour) => (
          <Hour
            key={hour.getTime()}
            $isWeekend={isWeekend(date)}
            $hourHeight={hourHeight}
          />
        ))}
        {renderEvents(date)}
        {renderTimeboxes(date)}
      </Day>
    );
  };

  const renderAllDay = (date, index) => {
    const style = {
      width: `${dayWidth}px`,
      height: headerHeight - DATE_LABEL_HEIGHT,
      left: index * dayWidth,
    };

    return (
      <AllDay
        style={style}
        key={date.getTime()}
        $isWeekend={isWeekend(date)}
      ></AllDay>
    );
  };

  const renderNewEvent = () => {
    if (!newEvent) {
      return null;
    }

    return (
      <BlankEvent
        style={{
          left: newEvent.start[0],
          width: dayWidth,
          top: newEvent.start[1],
          height: newEvent.end[1] - newEvent.start[1],
        }}
      >
        {format(newEvent.dates[0], "HH:mm")} -{" "}
        {format(newEvent.dates[1], "HH:mm")}
      </BlankEvent>
    );
  };

  const renderNewAllDayEvent = () => {
    if (!newAllDayEvent) {
      return null;
    }

    const left = dayWidth * differenceInDays(newAllDayEvent.start, range[0]);

    return (
      <BlankEvent
        style={{
          left,
          height: 25,
          width:
            dayWidth *
            differenceInDays(newAllDayEvent.end, newAllDayEvent.start),
          top: 0,
        }}
      />
    );
  };

  const renderTimeboxes = (date: Date) => {
    const key = format(date, DATE_FORMAT);
    const timeboxes = timeboxesMap.get(key) || [];

    return timeboxes.map((timebox) => {
      const position = getPositionOfEvent(
        {
          start: new Date(timebox.startDateTime),
          end: new Date(timebox.endDateTime),
        },
        {
          startTime: startOfDay(date),
          hourHeight,
        },
      );

      return (
        <TimeboxBlock
          key={timebox.id}
          timebox={timebox}
          start={range[0]}
          editable={false}
          dayWidth={dayWidth}
          top={position.top}
          height={position.height}
          hourHeight={hourHeight}
          headerHeight={headerHeight}
          asideWidth={asideWidth}
          container={rootRef.current}
          containerRect={rootRectRef.current}
        />
      );
    });
  };

  const handleStartEventCreate = (event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    if (!rootRectRef.current) {
      return;
    }

    const [x, y] = getCorrectedPosition(
      [event.clientX, event.clientY + (rootRef.current?.scrollTop || 0)],
      {
        snapSize: [dayWidth, hourHeight / 4],
        containerRect: rootRectRef.current,
        headerHeight,
        asideWidth,
        direction: "top",
      },
    );

    const date = getDateFromPosition([x, y], {
      start: range[0],
      dayWidth,
      headerHeight,
      hourHeight,
      asideWidth,
      timeFrom: startHour,
      timeTo: endHour,
    });

    const newX = x + (rootRef.current?.scrollLeft || 0) + asideWidth;
    const newY = y - headerHeight;

    setNewEvent({
      start: [newX, newY],
      end: [newX, newY + hourHeight / 4],
      dates: [date, addMinutes(date, 15)],
      state: "started",
    });
  };

  const handleContinueEventCreate = (event: MouseEvent) => {
    if (
      newEvent === null ||
      newEvent.state === "ended" ||
      !rootRectRef.current
    ) {
      return;
    }

    const [x, y] = getCorrectedPosition(
      [event.clientX, event.clientY + (rootRef.current?.scrollTop || 0)],
      {
        snapSize: [dayWidth, hourHeight / 4],
        containerRect: rootRectRef.current,
        headerHeight,
        asideWidth,
        direction: "top",
      },
    );

    const date = getDateFromPosition([x, y], {
      start: range[0],
      dayWidth,
      headerHeight,
      hourHeight,
      asideWidth,
      timeFrom: startHour,
      timeTo: endHour,
    });

    const newX = x + (rootRef.current?.scrollLeft || 0) + asideWidth;
    const newY = Math.max(y, newEvent.start[1] + hourHeight / 4) - headerHeight;

    if (newEvent.end[0] !== newX || newEvent.end[1] !== newY) {
      setNewEvent({
        ...newEvent,
        end: [newX, newY],
        dates: [newEvent.dates[0], date],
        state: "started",
      });
    }
  };

  const handleEndEventCreate = (event: MouseEvent) => {
    if (newEvent === null || !rootRectRef.current) {
      return;
    }

    setNewEvent({
      ...newEvent,
      state: "ended",
    });

    const startDateTime = getDateFromPosition(
      [newEvent.start[0], newEvent.start[1] + headerHeight],
      {
        start: range[0],
        dayWidth,
        headerHeight,
        hourHeight,
        asideWidth,
        timeFrom: startHour,
        timeTo: endHour,
      },
    );

    const endDateTime = getDateFromPosition(
      [newEvent.end[0], newEvent.end[1] + headerHeight],
      {
        start: range[0],
        dayWidth,
        headerHeight,
        hourHeight,
        asideWidth,
        timeFrom: startHour,
        timeTo: endHour,
      },
    );

    onEventAddRequest({ startDateTime, endDateTime });
    setNewEvent(null);
  };

  const handleStartAllDayEventCreate = (event: MouseEvent) => {
    const { date } = getDnDDateFromPosition([event.pageX, 0], {
      start: range[0],
      snapSize: [dayWidth, hourHeight / 4],
      scrollLeft: rootRef.current.scrollLeft,
      scrollTop: rootRef.current.scrollTop,
      containerRect: rootRectRef.current,
      asideWidth,
      hourHeight,
      headerHeight,
    });

    setNewAllDayEvent({
      start: date,
      end: addDays(date, 1),
      state: "started",
    });
  };

  const handleContinueAllDayEventCreate = (event: MouseEvent) => {
    if (!newAllDayEvent) {
      return;
    }

    const { date } = getDnDDateFromPosition([event.pageX, 0], {
      start: range[0],
      snapSize: [dayWidth, hourHeight / 4],
      scrollLeft: rootRef.current.scrollLeft,
      scrollTop: rootRef.current.scrollTop,
      containerRect: rootRectRef.current,
      asideWidth,
      hourHeight,
      headerHeight,
    });

    const dates = [newAllDayEvent.start, addDays(date, 1)].sort((d1, d2) => {
      return d1.getTime() - d2.getTime();
    });

    setNewAllDayEvent({
      ...newAllDayEvent,
      start: dates[0],
      end: dates[1],
    });
  };

  const handleEndAllDayEventCreate = (event: MouseEvent) => {
    if (!newAllDayEvent) {
      return;
    }

    onEventAddRequest({
      startDate: newAllDayEvent.start,
      endDate: newAllDayEvent.end,
    });
    setNewAllDayEvent(null);
  };

  const handleRefBody = (element: HTMLDivElement) => {
    if (!element) {
      return;
    }

    bodyRef.current = element;

    handleResize(element);
  };

  const handleRefRoot = (element: HTMLDivElement) => {
    dropRef(element);
    rootRef.current = element;
    rootRectRef.current = element?.getBoundingClientRect();
    const index = range.findIndex((d) => isSameDay(d, date));

    if (isFirstRender.current) {
      rootRef.current.scrollLeft = dayWidth * index;
      isFirstRender.current = false;
    }
  };

  const handleReachLeft = () => {
    const newDate = subDays(date, DAYS_DIFF);
    direction.current = -1;

    onDateChange(newDate);
  };

  const handleReachRight = () => {
    const newDate = addDays(date, DAYS_DIFF);
    direction.current = 1;

    onDateChange(newDate);
  };

  const handleScroll = () => {
    const scrollLeft = rootRef.current?.scrollLeft || 0;

    if (scrollLeft <= edges.current.left) {
      handleReachLeft();
    } else if (scrollLeft >= edges.current.right) {
      handleReachRight();
    }
  };

  return (
    <>
      {layer &&
        React.cloneElement(layer, {
          start: range[0],
          startHour,
          endHour,
          dayWidth,
          hourHeight,
          headerHeight,
          asideWidth,
          daysContainer: bodyRef.current,
          dateLabelHeight: DATE_LABEL_HEIGHT,
          container: rootRef.current,
          containerRect: rootRectRef.current,
        })}
      <Root
        ref={handleRefRoot}
        onScroll={handleScroll}
        style={{ scrollPaddingLeft: asideWidth }}
      >
        <Header
          style={{ width: dayWidth * range.length, height: headerHeight }}
        >
          <Corner style={{ height: headerHeight, width: asideWidth }}>
            <Timezones style={{ height: DATE_LABEL_HEIGHT }}>
              {timezones.map((timezone) => (
                <Timezone key={timezone.name}>{timezone.label}</Timezone>
              ))}
            </Timezones>
            <AllDayLabel>All day</AllDayLabel>
          </Corner>
          <HeaderContent
            onMouseDown={handleStartAllDayEventCreate}
            onMouseMove={handleContinueAllDayEventCreate}
            onMouseUp={handleEndAllDayEventCreate}
          >
            <Dates>
              {range.map((date) => (
                <HeaderDate
                  key={date.getTime()}
                  style={{ width: dayWidth }}
                  $isToday={isToday(date)}
                >
                  <div>
                    <DayOfWeek $isWeekend={isWeekend(date)}>
                      {format(date, "EEE")}
                    </DayOfWeek>
                    <DateNumber $isToday={isToday(date)}>
                      {format(date, "d")}
                    </DateNumber>
                  </div>
                  <div>
                    {renderDayInfo(
                      date,
                      (eventsMap.get(format(date, DATE_FORMAT)) || []).map(
                        (e) => e.event,
                      ),
                    )}
                  </div>
                </HeaderDate>
              ))}
            </Dates>
            <AllDayContainer>
              {range.map(renderAllDay)}
              {renderAllDayEvents()}
              {renderNewAllDayEvent()}
            </AllDayContainer>
          </HeaderContent>
        </Header>
        <Container ref={handleRefBody}>
          <Timeline
            style={{ width: `${dayWidth * range.length}px` }}
            asideWidth={asideWidth}
            headerHeight={headerHeight}
            startDate={range[0]}
            startHour={startHour}
            dayWidth={dayWidth}
            hourHeight={hourHeight}
          />
          <Body
            style={{ width: dayWidth * range.length }}
            onMouseDown={handleStartEventCreate}
            onMouseUp={handleEndEventCreate}
            onMouseMove={handleContinueEventCreate}
          >
            <Aside
              style={{ width: asideWidth }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {hours.map((hour) => (
                <Hour key={hour.getTime()} $hourHeight={hourHeight}>
                  <Timezones>
                    {timezones.map((timezone) => (
                      <Timezone
                        key={timezone.name}
                        style={{
                          fontWeight: timezone.isMain ? "bold" : "normal",
                        }}
                      >
                        {formatTz(
                          set(hour, {
                            minutes: 0,
                            seconds: 0,
                            milliseconds: 0,
                          }),
                          timezone.name,
                          "HH:mm",
                          {},
                        )}
                      </Timezone>
                    ))}
                  </Timezones>
                </Hour>
              ))}
              <CurrentTime
                startDate={range[0]}
                startHour={startHour}
                dayWidth={dayWidth}
                hourHeight={hourHeight}
                asideWidth={asideWidth}
                headerHeight={headerHeight}
                timeFormat={24}
                timezones={timezones}
              />
            </Aside>
            <Days style={{ paddingLeft: asideWidth }}>
              {range.map(renderDay)}
              {renderNewEvent()}
            </Days>
          </Body>
        </Container>
      </Root>
    </>
  );
};

const Root = styled.div`
  overflow: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overscroll-behavior: auto;
  scroll-snap-type: x proximity;
  border: 1px solid ${(p) => p.theme.delimiter};
  user-select: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Container = memo(styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`);

const Body = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const Hour = styled.div<{ $isWeekend?: boolean; $hourHeight: number }>`
  position: relative;
  height: ${(p) => p.$hourHeight}px;
  width: 100%;
  box-sizing: border-box;

  border-width: 1px 1px 0 0;
  border-style: solid;
  border-color: ${(p) => p.theme.delimiter};
  background-color: ${(p) =>
    p.$isWeekend ? p.theme.weekendBackgroundColor : p.theme.dayBackgroundColor};
`;

const Aside = styled.aside`
  position: sticky;
  left: -1px;
  bottom: 0;
  border-left: 1px solid ${(p) => p.theme.delimiter};
  background-color: ${(p) => p.theme.dayBackgroundColor};
  z-index: 5;
`;

const Header = styled.header`
  position: sticky;
  display: flex;
  top: 0;
  margin-left: -1px;
  background-color: ${(p) => p.theme.dayBackgroundColor};
  border-bottom: 1px solid ${(p) => p.theme.delimiter};
  z-index: 6;
`;

const AllDayLabel = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.dayTextColor};
`;

const AllDayContainer = styled.div`
  position: relative;
  display: flex;
  overflow-y: scroll;
`;

const AllDay = styled.div<{ $isWeekend?: boolean }>`
  position: sticky;
  top: 0;
  box-sizing: border-box;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: ${(p) => p.theme.delimiter};
  background-color: ${(p) =>
    p.$isWeekend ? p.theme.weekendBackgroundColor : p.theme.dayBackgroundColor};
`;

const Timezones = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Timezone = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.dayTextColor};
`;

const Corner = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: ${(p) => p.theme.dayBackgroundColor};
  position: sticky;
  left: -1px;
  border-right: 1px solid ${(p) => p.theme.delimiter};
  border-bottom: 1px solid ${(p) => p.theme.delimiter};
  z-index: 4;

  & ${Timezones} {
    border-bottom: 1px solid ${(p) => p.theme.delimiter};
  }
`;

const Dates = styled.div`
  position: sticky;
  display: flex;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;

const Days = styled.div``;

const HeaderDate = styled.div<{ $isToday?: boolean }>`
  display: flex;
  height: ${DATE_LABEL_HEIGHT}px;
  box-sizing: border-box;
  padding: 4px;
  border-left: 1px solid ${(p) => p.theme.delimiter};
  text-align: left;
  & > div {
    flex: 1 0;
  }

  ${(p) =>
    p.$isToday
      ? `border-bottom: 2px solid ${p.theme.weekendTextColor}`
      : `border-bottom: 1px solid ${p.theme.delimiter}`}
`;

const DayOfWeek = styled.div<{ $isWeekend?: boolean }>`
  font-size: 12px;
  color: ${(p) =>
    p.$isWeekend ? p.theme.weekendTextColor : p.theme.dayTextColor};
`;

const DateNumber = styled.div<{ $isToday?: boolean }>`
  font-size: 20px;
  color: ${(p) =>
    p.$isToday ? p.theme.weekendTextColor : p.theme.dayTextColor};
`;

const BlankEvent = styled.div`
  position: absolute;
  font-size: 12px;
  color: ${(p) => p.theme.dayTextColor};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.eventBackgroundColor};
  z-index: 5;
  border-radius: 4px;
`;
