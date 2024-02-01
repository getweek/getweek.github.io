import React, { type ReactNode, useEffect, useRef, useState } from "react";
import type { IDraggable, WeekEvent, WeekEventDates } from "../../../types";
import type { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import {
  addDays,
  differenceInDays,
  endOfDay,
  startOfDay,
  subDays,
} from "date-fns";
import styled from "styled-components";
import {
  getAllDayDateFromPosition,
  getCorrectedPosition,
  getDateFromPosition,
} from "./utils";
import { EVENTS_PADDING_RIGHT } from "./constants";

type ResizingState = "left" | "right" | false;

type Props<TEventData extends IDraggable> = {
  event: WeekEvent<TEventData>;
  style?: CSSProperties;
  start: Date;
  left: number;
  length: number;
  dayWidth: number;
  hourHeight: number;
  asideWidth: number;
  container: HTMLDivElement;
  containerRect: DOMRect;
  headerHeight: number;
  renderEvent(event: WeekEvent, params: WeekEventDates): React.ReactNode;
  onEventChange(dates: WeekEventDates, event: WeekEvent<TEventData>): void;
};

export const AllDayEventBlock = <TEventData extends IDraggable>(
  props: Props<TEventData>,
): JSX.Element => {
  const {
    renderEvent,
    event: { startDate, endDate, ...event },
    start,
    dayWidth,
    container,
    containerRect,
    headerHeight,
    asideWidth,
    onEventChange,
  } = props;

  const [isResizing, setResizing] = useState<ResizingState>(false);
  const [left, setLeft] = useState(props.left);
  const [length, setLength] = useState(props.length);
  const datesRef = useRef<[Date, Date]>([startDate!, endDate!]);

  useEffect(() => {
    setLeft(props.left);
    setLength(props.length);
  }, [props.left, props.length]);

  const [{ isDragging }, drag, preview] = useDrag({
    type: event.data.type,
    item: event,
    collect: (monitor) => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage());
  }, []);

  useEffect(() => {
    const handleResize = (event: MouseEvent) => {
      if (!isResizing) {
        return;
      }

      const [x, y] = getCorrectedPosition([event.x, event.y], {
        snapSize: [dayWidth, 100 / 4],
        containerRect,
        headerHeight,
        asideWidth,
        direction: isResizing,
      });

      const newDate = getAllDayDateFromPosition([x + container.scrollLeft, y], {
        start,
        headerHeight,
        dayWidth,
        asideWidth,
        hourHeight: 100,
        timeFrom: 0,
        timeTo: 24,
      });

      if (isResizing === "right") {
        const diffLength = differenceInDays(newDate, endDate) + 1;
        const oldLength = props.length + 1;

        setLength(oldLength + diffLength);
        datesRef.current = [startDate!, newDate];
      } else if (isResizing === "left") {
        const diffLength = differenceInDays(startDate, newDate);
        const oldLength = props.length + 1;

        setLeft(x + container.scrollLeft);
        setLength(oldLength + diffLength);
        datesRef.current = [newDate, endDate!];
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleStopResizing);
    }

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleStopResizing);
    };
  }, [
    isResizing,
    containerRect,
    asideWidth,
    headerHeight,
    dayWidth,
    left,
    length,
  ]);

  const handleStartResizingLeft = (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setResizing("left");
  };

  const handleStartResizingRight = (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setResizing("right");
  };

  const handleStopResizing = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!isResizing) {
      return;
    }

    onEventChange(
      {
        startDate: startOfDay(datesRef.current[0]),
        endDate: endOfDay(datesRef.current[1]),
      },
      event,
    );
  };

  return (
    <Root
      onClick={() => {
        setResizing(false);
        // if (!isResizing) {
        //   onEventSelect(event);
        // }
      }}
      isDragging={isDragging}
      style={{
        ...props.style,
        height: 25,
        left: isResizing ? left : props.left,
        width: isResizing
          ? `${length * dayWidth - EVENTS_PADDING_RIGHT}px`
          : `${(props.length + 1) * dayWidth - EVENTS_PADDING_RIGHT}px`,
      }}
      ref={drag}
    >
      {renderEvent(event, {
        startDate: isResizing === "left" ? datesRef.current[0] : startDate!,
        endDate: isResizing === "right" ? datesRef.current[1] : endDate!,
      })}
      <ResizeHandlerContainerLeft onMouseDown={handleStartResizingLeft}>
        <ResizeHandler />
      </ResizeHandlerContainerLeft>
      <ResizeHandlerContainerRight onMouseDown={handleStartResizingRight}>
        <ResizeHandler />
      </ResizeHandlerContainerRight>
    </Root>
  );
};

const ResizeHandlerContainer = styled.div`
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  width: 8px;
  display: flex;
  justify-content: center;
  cursor: ew-resize;
`;

const ResizeHandlerContainerLeft = styled(ResizeHandlerContainer)`
  left: 0;
  padding-left: 5px;
`;

const ResizeHandlerContainerRight = styled(ResizeHandlerContainer)`
  right: 0;
  padding-right: 5px;
`;

const ResizeHandler = styled.span`
  position: absolute;
  display: inline-block;
  width: 3px;
  background-color: #fff;
  border-radius: 3px;
  height: calc(100% - 20%);
  top: 10%;
  opacity: 0;
  transition: all 0.35s;
`;

const Root = styled.div<{ isDragging: boolean }>`
  user-select: none;
  position: absolute;
  overflow: hidden;
  background: ${(p) => p.theme.contentBackgroundColor};
  color: ${(p) => p.theme.defaultEventTextColor};
  border-radius: 4px;
  margin: 0px;
  z-index: 3;
  opacity: ${(p) => (p.isDragging ? 0.5 : 1)};

  &:hover ${ResizeHandler} {
    opacity: 0.3;
  }
`;
