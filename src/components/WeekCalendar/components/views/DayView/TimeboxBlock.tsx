import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { CALENDAR_TIMEBOX_BLOCK } from "../../../constants";
import type { WeekTimebox } from "../../../types";
import { colord } from "colord";
import styled, { useTheme } from "styled-components";
import { getEmptyImage } from "react-dnd-html5-backend";

type ResizingState = "top" | "bottom" | false;

type Props = {
  top: number;
  height: number;
  timebox: WeekTimebox;
  editable: boolean;
  start: Date;
  dayWidth: number;
  hourHeight: number;
  headerHeight: number;
  asideWidth: number;
  containerRect: DOMRect;
  container: HTMLDivElement | null;
};

export const TimeboxBlock = (props: Props): JSX.Element => {
  const { timebox, dayWidth, editable } = props;
  const { isLight } = useTheme();

  const [isResizing, setResizing] = useState<ResizingState>(false);
  const [top, setTop] = useState<number>(props.top || 0);
  const [height, setHeight] = useState<number | string>(props.height || 0);
  const [currentDates, setCurrentDates] = useState<[Date, Date]>([null, null]);
  const resizingPos = useRef<[number, number]>();

  const [, drag, preview] = useDrag({
    type: CALENDAR_TIMEBOX_BLOCK,
    item: timebox,
    canDrag: () => editable,
  });

  useEffect(() => {
    preview(getEmptyImage());
  }, []);

  const opacity = isLight ? (editable ? 0.75 : 0.55) : editable ? 0.25 : 0.15;

  const background =
    "repeating-linear-gradient(45deg," +
    `${colord(timebox.backgroundColor).alpha(opacity).toRgbString()}, ` +
    `${colord(timebox.backgroundColor).alpha(opacity).toRgbString()} 4px, ` +
    `${colord(timebox.backgroundColor).alpha(0.01).toRgbString()} 4px, ` +
    `${colord(timebox.backgroundColor).alpha(0.01).toRgbString()} 10px` +
    ")";

  const handleStartResizingTop = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setResizing("top");

    return false;
  };

  const handleStartResizingBottom = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setResizing("bottom");

    return false;
  };

  return (
    <Root
      style={{
        width: `${dayWidth}px`,
        top: isResizing === "top" ? top : props.top,
        height: isResizing ? height : props.height,
      }}
    >
      <Content>
        <Background style={{ background }}>{timebox.title}</Background>
        <DragHandler draggable={editable} ref={drag} />
        {editable && (
          <>
            <ResizeHandlerContainerTop onMouseDown={handleStartResizingTop}>
              <ResizeHandler />
            </ResizeHandlerContainerTop>
            <ResizeHandlerContainerBottom
              onMouseDown={handleStartResizingBottom}
            >
              <ResizeHandler />
            </ResizeHandlerContainerBottom>
          </>
        )}
      </Content>
    </Root>
  );
};

const ResizeHandlerContainer = styled.div`
  left: 25%;
  width: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  cursor: ns-resize;
  z-index: 1;
`;

const ResizeHandlerContainerTop = styled(ResizeHandlerContainer)`
  top: 0;
  padding-top: 2px;
`;

const ResizeHandlerContainerBottom = styled(ResizeHandlerContainer)`
  bottom: 0;
  padding-bottom: 2px;
`;

const ResizeHandler = styled.span`
  display: inline-block;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  width: 100%;
  opacity: 0;
  transition: all 0.35s;
`;

const Root = styled.div`
  position: absolute;
  font-size: 12px;
  box-sizing: border-box;
  padding: 2px;
  z-index: 3;
`;

const Content = styled.div`
  height: 100%;
  position: relative;
  z-index: 1;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  justify-content: start;
  padding: 4px;
  border-radius: 4px;
  box-sizing: border-box;
`;

const DragHandler = styled.div<{ draggable: boolean }>`
  position: absolute;
  cursor: ${(p) => (p.draggable ? "grab" : "default")};
  inset: 0;
`;
