import React, { type ReactNode } from "react";
import styled from "styled-components";
import { useDragLayer } from "react-dnd";
import { type DayViewLayerProps } from "../../components/WeekCalendar/types";
import {
  CALENDAR_EVENT_BLOCK,
  CALENDAR_TASK_BLOCK,
  CALENDAR_TIMEBOX_BLOCK,
} from "../../components/WeekCalendar/constants";
import {
  getDnDCorrectedPosition,
  getDnDDateFromPosition,
  getIsAllDay,
} from "../../components/WeekCalendar/components/views/DayView/utils";
import { differenceInMinutes, format } from "date-fns";

export const TASK = Symbol("Task");

const ALLOWED_TYPES = [
  CALENDAR_EVENT_BLOCK,
  CALENDAR_TASK_BLOCK,
  CALENDAR_TIMEBOX_BLOCK,
  TASK,
];

export const DragLayer = (
  props: Partial<DayViewLayerProps>,
): ReactNode => {
  const {
    dayWidth,
    start,
    startHour,
    endHour,
    asideWidth,
    dateLabelHeight,
    headerHeight,
    hourHeight,
    container,
    containerRect,
    defaultDuration = 30,
  } = props;

  const { offset, item, type, isDragging } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    type: monitor.getItemType(),
    offset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !offset || !ALLOWED_TYPES.includes(type as symbol)) {
    return null;
  }

  const x = offset.x;
  const y = offset.y;

  let duration;

  const event = item;
  const isAllDay = getIsAllDay({ y, containerRect, headerHeight });

  if (
    type === CALENDAR_EVENT_BLOCK ||
    type === CALENDAR_TASK_BLOCK ||
    type === CALENDAR_TIMEBOX_BLOCK
  ) {
    if (event.startDateTime && event.endDateTime) {
      duration = differenceInMinutes(
        new Date(event.endDateTime),
        new Date(event.startDateTime),
      );
    } else if (event.startDate && event.endDate) {
      if (isAllDay) {
        duration = differenceInMinutes(
          new Date(event.endDate),
          new Date(event.startDate),
        );
      } else {
        duration = defaultDuration;
      }
    }
  } else if (type === TASK) {
    duration = event.duration || defaultDuration;
  }

  const [newX, newY] = getDnDCorrectedPosition([x, y], {
    snapSize: [dayWidth, hourHeight / 4],
    headerHeight: headerHeight,
    dateLabelHeight: dateLabelHeight,
    container: [containerRect.left + asideWidth, containerRect.top],
    scrollTop: container.scrollTop,
  });

  const style = getItemStyle([x, y], [newX, newY], {
    dayWidth,
    asideWidth: asideWidth,
    containerRect: containerRect,
    dateLabelHeight: dateLabelHeight,
    headerHeight: headerHeight,
    hourHeight: isAllDay ? 100 : hourHeight,
    duration,
  });

  const dates = getDnDDateFromPosition([newX, newY], {
    start,
    snapSize: [dayWidth, hourHeight / 4],
    containerRect,
    asideWidth,
    headerHeight,
    hourHeight: isAllDay ? 100 : hourHeight,
    scrollLeft: container.scrollLeft,
    scrollTop: container.scrollTop,
  });

  return (
    <Root>
      <Task style={style}>
        <div>{item.title}</div>
        <div>{dates.dateTime && format(dates.dateTime, "HH:mm")}</div>
      </Task>
    </Root>
  );
};

const Root = styled.section`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
`;

const Task = styled.div`
  overflow: hidden;
  font-size: 12px;
  box-sizing: border-box;
  border: 1px solid ${(p) => p.theme.primaryColor};
  border-radius: 4px;
  background-color: ${(p) => p.theme.contentBackgroundColor};
  padding: 2px 10px;
`;

type TransformState = "free" | "allDay" | "event";
type Coords = [number, number];

type GetItemStyleParams = {
  containerRect: DOMRect;
  asideWidth: number;
  dateLabelHeight: number;
  headerHeight: number;
  hourHeight: number;
  dayWidth: number;
  duration?: number;
};

const getItemStyle = (
  defaultPos: Coords,
  newPos: Coords,
  params: GetItemStyleParams,
) => {
  const {
    dayWidth,
    hourHeight,
    asideWidth,
    dateLabelHeight,
    headerHeight,
    containerRect,
    duration = 60 / 2,
  } = params;
  const [x, y] = defaultPos;
  const [newX, newY] = newPos;

  let width, height, transform;

  let state: TransformState = "free";

  if (
    x > containerRect.left + asideWidth &&
    y > containerRect.top + dateLabelHeight
  ) {
    if (y < containerRect.top + headerHeight) {
      state = "allDay";
    } else {
      state = "event";
    }
  }

  if (state === "free") {
    transform = `translate3d(${x}px, ${y}px, 0)`;
    width = dayWidth;
    height = hourHeight / 4;
  } else if (state === "allDay") {
    // allDayEvent
    height = 100 / 4;
    transform = `translate3d(${newX}px, ${
      dateLabelHeight + containerRect.top
    }px, 0)`;
    width = Math.max((duration / (24 * 60)) * dayWidth, dayWidth);
  } else {
    // event
    transform = `translate3d(${newX}px, ${newY}px, 0)`;
    width = `${dayWidth}px`;
    height = (duration * hourHeight) / 60;
  }

  return {
    transform,
    height,
    width,
  };
};
