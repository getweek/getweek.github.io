import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getPositionFromDate } from './utils';
import { format } from 'date-fns';

type Props = {
  startDate: Date;
  style: CSSProperties;
  asideWidth: number;
  startHour: number;
  dayWidth: number;
  headerHeight: number;
  hourHeight: number;
}

export const Timeline = (props: Props): JSX.Element => {
  const {
    startDate,
    style,
    startHour,
    asideWidth,
    dayWidth,
    headerHeight,
    hourHeight,
  } = props;

  const [now, setNow] = useState(-1);
  const [day, setDay] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleUpdate = () => {
      const date = new Date();
      const [nowDay, now] = getPositionFromDate(date, {
        startDate,
        dayWidth,
        headerHeight,
        hourHeight,
        startHour,
      });

      setNow(now);
      setDay(nowDay);
    };

    handleUpdate();

    intervalRef.current = setInterval(handleUpdate, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [startDate, dayWidth, hourHeight]);

  return (
    <>
      <NowLine
        style={{
          ...style
        }}
        position={now}
        time={format(new Date(), 'HH:mm')}
      />
      {day !== -1 && (
        <NowDayLine
          top={now}
          width={dayWidth}
          style={{
            left: day,
            marginLeft: asideWidth,
          }}
        />
      )}
    </>
  );
}

const NowLine = styled.div<{ position: number; time: string }>`
  position: absolute;
  top: ${(p) => p.position}px;
  height: 1px;
  border-bottom: 1px dashed ${(p) => p.theme.weekendTextColor};
  left: 0;
  right: 0;
  z-index: 5;

  &:before {
    content: '${(p) => p.time}';
    font-size: 12px;
    transform: translateY(-50%) translateY(-4px) translateX(-10px) translateX(-100%);
    display: inline-block;
    color: #fff;
    background: ${(p) => p.theme.weekendTextColor};
    padding: 0 2px;
    border-radius: 3px;
  }
`;

const NowDayLine = styled.div<{ top: number; width: number; }>`
  position: absolute;
  top: ${(p) => p.top}px;
  height: 1px;
  width: ${(p) => p.width}px;
  border-bottom: 2px solid ${(p) => p.theme.weekendTextColor};
  transform: translateY(-0.5px);
  z-index: 5;

  &:before {
    position: absolute;
    content: '';
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(p) => p.theme.weekendTextColor};
    transform: translate3d(-4px, -2px, 0);
  }
`;
