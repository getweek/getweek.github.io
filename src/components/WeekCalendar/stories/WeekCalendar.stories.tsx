import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import styled from 'styled-components';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WeekCalendar } from '../components/WeekCalendar';
import { CALENDAR_TASK_BLOCK, defaultColorScheme } from '../constants';
import { WeekCalendarView, WeekEvent, WeekEventDates, WeekTimebox } from '../types';
import { EventData, defaultEvents, defaultTimeboxes, defaultTimezones } from './data';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { DayViewLayer } from './DayViewLayer';
import { useMemo } from 'react';

const meta: Meta<typeof WeekCalendar> = {
  component: WeekCalendar,
};

export default meta;

export const Primary = {
  name: '7-day view',
  render: (): JSX.Element => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<WeekEvent<EventData>[]>(defaultEvents);
    const [timeboxes, setTimeboxes] = useState<WeekTimebox[]>(defaultTimeboxes);

    const renderEvent = useCallback((event: WeekEvent<EventData>, params: WeekEventDates) => {
      const dates =
        event.startDateTime && event.endDateTime ? (
          <EventTime>
            {format(params.startDateTime || event.startDateTime, 'HH:mm')}
            <span> - </span>
            <span>{format(params.endDateTime || event.endDateTime, 'HH:mm')}</span>
          </EventTime>
        ) : null;

      return (
        <EventBlock>
          <div>{event.data.title}</div>
          {dates}
        </EventBlock>
      );
    }, []);

    const handleChangeEvent = useCallback((dates: WeekEventDates, event: WeekEvent<EventData>) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              startDate: dates.startDate,
              endDate: dates.endDate,
              startDateTime: dates.startDateTime,
              endDateTime: dates.endDateTime,
            };
          }

          return e;
        }),
      );
    }, []);

    const handleAddNewEvent = useCallback((dates: WeekEventDates) => {
      setEvents((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          startDate: dates.startDate,
          endDate: dates.endDate,
          startDateTime: dates.startDateTime,
          endDateTime: dates.endDateTime,
          data: {
            title: 'New event',
            type: CALENDAR_TASK_BLOCK,
          },
        },
      ]);
    }, []);

    const layers = useMemo(
      () => ({
        [WeekCalendarView.Week]: <DayViewLayer />,
      }),
      [],
    );

    return (
      <>
        <Root>
          <DndProvider backend={HTML5Backend}>
            <p>
              <button onClick={() => setDate(new Date(2024, 2, 23))}>23 march</button>
              <button onClick={() => setDate(new Date())}>Today</button>
              <button onClick={() => setDate(new Date(2024, 11, 16))}>16 december</button>
            </p>
            <WeekCalendar
              accepts={[]}
              events={events}
              timeboxes={timeboxes}
              timezones={defaultTimezones}
              date={date}
              colorScheme={defaultColorScheme}
              view={WeekCalendarView.Week}
              layers={layers}
              renderEvent={renderEvent}
              onDateChange={setDate}
              onEventChange={handleChangeEvent}
              onEventAddRequest={handleAddNewEvent}
              onRangeChange={() => null}
            />
          </DndProvider>
        </Root>
      </>
    );
  },
};

const Root = styled.div`
  width: 100%;
  height: 500px;
`;

const EventBlock = styled.div`
  font-size: 12px;
  background-color: ${(p) => p.theme.eventBackgroundColor};
  height: 100%;
  width: 100%;
  border-radius: 4px;
  padding: 2px 4px;
  overflow: hidden;
`;

const EventTime = styled.div`
  font-size: 10px;
`;
