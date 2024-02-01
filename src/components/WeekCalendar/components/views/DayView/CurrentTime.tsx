import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getPositionFromDate } from './utils';
import { formatInTimeZone as formatTz } from 'date-fns-tz';
import type { WeekTimezone } from '../../../types';

type Props = {
  startDate: Date;
  asideWidth: number;
  dayWidth: number;
  headerHeight: number;
  hourHeight: number;
  startHour: number;
  timeFormat: 12 | 24;
  timezones: WeekTimezone[];
};

export const CurrentTime = (props: Props): JSX.Element => {
  const {
    startDate,
    dayWidth,
    timeFormat,
    asideWidth,
    headerHeight,
    hourHeight,
    startHour,
    timezones = [],
  } = props;

  const [now, setNow] = useState(-1);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleUpdate = () => {
      const date = new Date();
      const [, now] = getPositionFromDate(date, {
        startDate,
        dayWidth,
        headerHeight,
        startHour,
        hourHeight,
      });

      setNow(now);
    };

    handleUpdate();

    intervalRef.current = setInterval(handleUpdate, 1000);

    return () => {
      setNow(-1);
      clearInterval(intervalRef.current);
    };
  }, [startDate, dayWidth, hourHeight]);

  return (
    <Now
      style={{
        width: asideWidth,
        top: now,
      }}
    >
      {timezones.map((timezone) => (
        <span
          key={timezone.name}
          style={{ opacity: 0.8, fontWeight: timezone.isMain ? 'bold' : 'normal' }}
        >
          {formatTz(new Date(), timezone.name, timeFormat === 12 ? 'h:mm aaa' : 'HH:mm', {})}
        </span>
      ))}
    </Now>
  );
};

const Now = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 12px;
  position: absolute;
  justify-content: space-between;
  z-index: 5;
  background: ${(p) => p.theme.weekendTextColor};
  color: #fff;
  padding: 2px 4px;
  right: 0;
  transform: translateY(-50%);
  border-radius: 3px;

  & > span {
    color: #fff;
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
`;
