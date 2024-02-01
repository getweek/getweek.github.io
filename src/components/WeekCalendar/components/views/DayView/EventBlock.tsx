import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import type { IDraggable, WeekEvent, WeekEventDates } from '../../../types';
import { useEffect } from 'react';
import { getCorrectedPosition, getDateFromPosition } from './utils';
import { addMinutes, max, min, subMinutes } from 'date-fns';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

type Props = {
  event: WeekEvent<IDraggable>;
  editable?: boolean;
  style?: React.CSSProperties;
  top: number;
  height: number;
  startDate: Date;
  dayWidth: number;
  hourHeight: number;
  container: HTMLDivElement;
  containerRect: DOMRect;
  headerHeight: number;
  asideWidth: number;
  startHour: number;
  endHour: number;
  onEventSelect(event: WeekEvent): void;
  onEventChange(dates: WeekEventDates, event: WeekEvent): void;
  onEventContextMenu(event: WeekEvent, e: React.MouseEvent): void;
  renderEvent: (
    event: WeekEvent,
    params: {
      startDateTime: Date;
      endDateTime: Date;
    },
  ) => React.ReactNode;
};

type ResizingState = 'top' | 'bottom' | false;

export const EventBlock = (props: Props): JSX.Element => {
  const {
    event,
    editable = true,
    startDate,
    container,
    containerRect,
    headerHeight,
    asideWidth,
    hourHeight,
    dayWidth,
    startHour,
    endHour,
    style,
    onEventSelect,
    onEventChange,
    onEventContextMenu,
    renderEvent,
  } = props;

  const resizingPos = useRef<[number, number]>();
  const [currentDates, setCurrentDates] = useState<[Date, Date]>([null, null]);

  const [isResizing, setResizing] = useState<ResizingState>(false);
  const [top, setTop] = useState<number>(props.top || 0);
  const [height, setHeight] = useState<number | string>(props.height || 0);

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: event.data.type,
    item: event,
    collect: (monitor) => ({
      isDragging: Boolean(monitor.isDragging()),
    }),
    // canDrag: () => event.isEditable && editable,
  });

  useEffect(() => {
    preview(getEmptyImage());
  }, []);

  useEffect(() => {
    const handleResize = (event: MouseEvent) => {
      if (!isResizing) {
        return;
      }

      const [x, y] = getCorrectedPosition([event.x, event.y + (container?.scrollTop || 0)], {
        snapSize: [dayWidth, hourHeight / 4],
        containerRect: containerRect,
        headerHeight,
        asideWidth,
        direction: isResizing,
      });

      const date = getDateFromPosition([x + container.scrollLeft + asideWidth, y], {
        start: startDate,
        headerHeight,
        dayWidth,
        hourHeight,
        asideWidth,
        timeFrom: startHour,
        timeTo: endHour,
      });

      if (isResizing === 'bottom') {
        setHeight(Math.max(y - props.top - headerHeight, hourHeight / 4));
        setCurrentDates([currentDates[0], date]);
      } else if (isResizing === 'top') {
        const newHeight = props.top - y + headerHeight + props.height;

        if (newHeight > hourHeight / 4) {
          setTop(y - headerHeight);
        }
        setHeight(Math.max(newHeight, hourHeight / 4));
        setCurrentDates([date, currentDates[1]]);
      }
      resizingPos.current = [x, y];
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleStopResizing);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleStopResizing);
    };
  }, [dayWidth, hourHeight, containerRect, container, headerHeight, asideWidth, isResizing]);

  const handleStartResizingTop = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setResizing('top');

    return false;
  };

  const handleStartResizingBottom = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setResizing('bottom');

    return false;
  };

  const handleStopResizing = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (resizingPos.current && container) {
      const [x, y] = resizingPos.current;

      const date = getDateFromPosition([x + container.scrollLeft + asideWidth, y], {
        start: startDate,
        headerHeight,
        dayWidth,
        hourHeight,
        asideWidth,
        timeFrom: startHour,
        timeTo: endHour,
      });

      if (isResizing === 'bottom') {
        onEventChange(
          {
            startDateTime: event.startDateTime,
            endDateTime: max([date, addMinutes(event.startDateTime, 15)]),
          },
          event,
        );
      } else if (isResizing === 'top') {
        onEventChange(
          {
            startDateTime: min([date, subMinutes(event.endDateTime, 15)]),
            endDateTime: event.endDateTime,
          },
          event,
        );
      }
    }

    setCurrentDates([null, null]);
    setResizing(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onEventContextMenu(event, e);
  };

  return (
    <Root
      style={{
        ...style,
        top: isResizing === 'top' ? top : props.top,
        height: isResizing ? height : props.height,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();

        return false;
      }}
      onContextMenu={handleContextMenu}
    >
      <ResizeHandlerContainerTop onMouseDown={handleStartResizingTop}>
        <ResizeHandler />
      </ResizeHandlerContainerTop>
      <DragHandler
        onClick={() => {
          if (editable && !isResizing) {
            onEventSelect(event);
          }
        }}
        ref={dragRef}
      />
      <ResizeHandlerContainerBottom onMouseDown={handleStartResizingBottom}>
        <ResizeHandler />
      </ResizeHandlerContainerBottom>
      {renderEvent(props.event, {
        startDateTime: currentDates[0],
        endDateTime: currentDates[1],
      })}
    </Root>
  );
};

const ResizeHandler = styled.span`
  display: inline-block;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  width: 100%;
  opacity: 0;
  transition: all 0.35s;
`;

const Root = styled.div<{ $dragging?: boolean; $editable?: boolean }>`
  position: absolute;
  z-index: 4;
  border: 1px solid transparent;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
  }

  &:hover ${ResizeHandler} {
    opacity: 0.7;
  }
`;

const DragHandler = styled.div`
  inset: 2px 0;
  position: absolute;
  z-index: 1;
`;

const ResizeHandlerContainer = styled.div`
  left: 25%;
  width: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  cursor: ns-resize;
  z-index: 3;
`;

const ResizeHandlerContainerTop = styled(ResizeHandlerContainer)`
  top: 0;
  padding-top: 1px;
`;

const ResizeHandlerContainerBottom = styled(ResizeHandlerContainer)`
  bottom: 0;
  padding-bottom: 1px;
`;
