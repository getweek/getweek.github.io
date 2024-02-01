import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider, useTheme } from "styled-components";
import { nanoid } from "nanoid";
import { WeekCalendar } from "../../components/WeekCalendar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCalendarTheme } from "../../hooks/useCalendarTheme";
import { Sidebar } from "./Sidebar";
import { light } from "./theme/light";
import { DragLayer, TASK } from "./DragLayer";
import { colord } from "colord";
import {
  addDays,
  endOfWeek,
  format,
  intervalToDuration,
  isPast,
  set,
  startOfWeek,
} from "date-fns";
import { Status, type CalendarEventData, type TTask } from "./types";
import { TaskStatus } from "../TaskStatus/TaskStatus";
import {
  WeekCalendarView,
  type WeekEvent,
  type WeekEventDates,
  type WeekTimebox,
} from "../WeekCalendar/types";
import {
  CALENDAR_TASK_BLOCK,
  CALENDAR_TIMEBOX_BLOCK,
} from "../WeekCalendar/constants";
import { RRule } from "rrule";

export const Root = () => {
  return (
    <ThemeProvider theme={light}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </ThemeProvider>
  );
};

const defaultProjects = {
  Personal: {
    id: nanoid(),
    title: "Personal",
    color: "#388e3c",
    backgroundColor: "#e8f5e9",
  },
  Work: {
    id: nanoid(),
    title: "Work",
    color: "#7b1fa2",
    backgroundColor: "#f3e5f5",
  },
  Education: {
    id: nanoid(),
    title: "Education",
    color: "#303f9f",
    backgroundColor: "#e8eaf6",
  },
};

const defaultBacklogTasks = [
  {
    id: nanoid(),
    title: "Buy cat food",
    project: defaultProjects["Personal"],
  },
  {
    id: nanoid(),
    title: "Make duplicate of the key",
    project: defaultProjects["Personal"],
  },
  {
    id: nanoid(),
    title: "Find a babysitter",
    project: defaultProjects["Personal"],
  },
  {
    id: nanoid(),
    title: "Book a hotel for vacation",
    project: defaultProjects["Personal"],
  },
  {
    id: nanoid(),
    title: "Pay for the internet",
    project: defaultProjects["Personal"],
  },
  {
    id: nanoid(),
    title: "Buy a new phone",
    project: defaultProjects["Personal"],
  },
  {
    id: nanoid(),
    title: "Send the report",
    project: defaultProjects["Work"],
  },
  {
    id: nanoid(),
    title: "Prepare the presentation",
    project: defaultProjects["Work"],
  },
  {
    id: nanoid(),
    title: "Write tests",
    project: defaultProjects["Work"],
    tasks: [
      {
        id: nanoid(),
        title: "Unit tests",
        project: defaultProjects["Work"],
      },
      {
        id: nanoid(),
        title: "Integration tests",
        project: defaultProjects["Work"],
      },
      {
        id: nanoid(),
        title: "E2E tests",
        project: defaultProjects["Work"],
      },
    ],
  },
  {
    id: nanoid(),
    title: "Refactor the monetization code",
    project: defaultProjects["Work"],
  },
];

const taskNames = [
  "Complete project proposal",
  "Conduct market research",
  "Schedule meetings with clients",
  "Create a social media strategy",
  "Review and revise website content",
  "Develop a marketing campaign",
  "Analyze data from customer surveys",
  "Write a business plan",
  "Update employee training manuals",
  "Design a new logo",
  "Coordinate team training sessions",
  "Generate monthly financial reports",
  "Implement a customer loyalty program",
  "Research new product ideas",
  "Conduct performance evaluations",
  "Optimize website for search engines",
  "Plan company retreat",
  "Prepare sales forecast",
  "Create promotional materials",
  "Review and respond to customer inquiries",
  "Conduct competitor analysis",
  "Launch new product line",
  "Evaluate supplier contracts",
  "Develop a content marketing strategy",
  "Coordinate trade show participation",
  "Improve inventory management system",
  "Conduct staff training on new software",
  "Organize company-wide event",
  "Create email marketing campaign",
  "Implement cost-cutting measures",
  "Upgrade computer hardware",
  "Conduct user testing on website",
  "Develop customer relationship management system",
  "Write and distribute press releases",
  "Conduct customer satisfaction surveys",
  "Plan and execute advertising campaign",
  "Research and select new vendors",
  "Develop sales training program",
  "Design and implement employee wellness program",
  "Update company website",
  "Analyze and interpret sales data",
  "Conduct brainstorming sessions",
  "Develop customer personas",
  "Negotiate contracts with suppliers",
  "Create a customer referral program",
  "Plan and host industry conference",
  "Conduct market segmentation analysis",
  "Develop customer onboarding process",
  "Update product packaging",
  "Analyze website traffic and user behavior",
  "Conduct employee engagement survey",
  "Develop online learning modules",
  "Coordinate product launches",
  "Implement data security measures",
  "Create standardized procedures and policies",
  "Research and recommend project management software",
  "Evaluate and select advertising agencies",
  "Develop affiliate marketing program",
  "Design and conduct customer focus groups",
  "Optimize social media profiles",
  "Conduct product demonstrations",
  "Coordinate public relations activities",
  "Conduct risk assessments",
  "Develop customer retention strategies",
  "Write case studies and success stories",
  "Evaluate and recommend CRM software",
  "Conduct market trend analysis",
  "Develop mobile app",
  "Implement customer feedback system",
  "Create employee recognition program",
  "Update company branding",
  "Conduct usability testing",
  "Develop pricing strategy",
  "Analyze financial statements",
  "Plan and execute direct mail campaign",
  "Set up and optimize online advertising campaigns",
  "Conduct inventory audit",
  "Develop customer satisfaction measurement tools",
  "Design and conduct training workshops",
  "Conduct focus groups for product testing",
  "Implement project management methodology",
  "Research and recommend email marketing software",
  "Develop customer service training program",
  "Create and manage social media content calendar",
  "Analyze and optimize sales funnels",
  "Conduct market research surveys",
  "Develop employee performance metrics",
  "Coordinate product recalls or returns",
  "Implement website analytics tools",
  "Create employee handbook",
  "Conduct supplier negotiations",
  "Develop marketing collateral",
  "Update pricing information",
  "Conduct customer churn analysis",
  "Design and execute customer loyalty program",
  "Analyze and optimize email marketing campaigns",
  "Conduct competitor pricing analysis",
  "Develop lead generation strategies",
  "Create customer testimonials",
  "Plan and execute product launch event",
];

const personalTaskNames = [
  "Go for a run",
  "Complete laundry",
  "Buy groceries",
  "Pay bills",
  "Read a book",
  "Write in journal",
  "Organize closet",
  "Meditate",
  "Plan meals for the week",
  "Call a friend",
  "Clean the bathroom",
  "Schedule doctor's appointment",
  "Learn a new recipe",
  "Update budget",
  "Take a walk in the park",
];

let taskNamesIndex = 0;

const App = () => {
  const [date, setDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [events, setEvents] = useState<WeekEvent<CalendarEventData>[]>(
    getEvents({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) }),
  );
  const [timeBoxes, setTimeBoxes] = useState<WeekTimebox[]>([]);
  const [range, setRange] = useState<Interval>();
  const [backlogTasks, setBacklogTasks] = useState(defaultBacklogTasks);
  const [timezones] = useState([
    {
      label: "Home",
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isMain: true,
    },
  ]);

  useEffect(() => {
    if (range) {
      setTimeBoxes(getTimeboxes(range));
    }
  }, [range]);

  const theme = useTheme();

  const calendarTheme = useCalendarTheme();

  const handleAddEvent = (dates: WeekEventDates, task: TTask) => {
    setEvents([
      ...events,
      {
        id: task.id,
        data: {
          task: {
            ...task,
            status: Status.IN_PROGRESS,
          },
          type: CALENDAR_TASK_BLOCK,
        },
        ...dates,
      },
    ]);

    setBacklogTasks((backlogTasks) =>
      backlogTasks.map((t) => {
        if (t.id === task.id) {
          return {
            ...t,
            status: Status.IN_PROGRESS,
          };
        } else {
          return t;
        }
      }),
    );

    return Promise.resolve(true);
  };

  const handleEventAddRequest = (dates: WeekEventDates) => {
    const projectName = (["Personal", "Work", "Education"] as const)[
      Math.floor(getRandomArbitrary(0, 3))
    ];

    setEvents([
      ...events,
      {
        id: nanoid(),
        ...dates,
        data: {
          task: {
            id: nanoid(),
            title: taskNames[taskNamesIndex++],
            status: Status.IN_PROGRESS,
            project: defaultProjects[projectName],
          },
          type: CALENDAR_TASK_BLOCK,
        },
      },
    ]);
  };

  const handleEventChange = (dates: WeekEventDates, event: WeekEvent) => {
    setEvents(
      events.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            ...dates,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const handleUpdateStatus = (taskId: string, status: Status) => {};

  const renderDayInfo = useCallback((date: Date, events: WeekEvent[]) => {
    const time = events.reduce((acc, event) => {
      if (!event.startDateTime || !event.endDateTime) {
        return acc;
      }

      const duration = intervalToDuration({
        start: event.startDateTime,
        end: event.endDateTime,
      });

      return acc + (duration.hours || 0) * 60 + (duration.minutes || 0);
    }, 0);

    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    if (time === 0) {
      return null;
    }

    return (
      <PlannedHours>
        {hours}h {minutes}m
      </PlannedHours>
    );
  }, []);

  const renderEvent = useCallback(
    (event: WeekEvent<CalendarEventData>, dates: WeekEventDates) => {
      const backgroundColor = colord(
        event.data.task?.project.backgroundColor || theme.eventBackgroundColor,
      )
        .alpha(event ? 0.75 : 1)
        .toHex();
      const color = event.data.task?.project.color || "#444";

      let duration, h, m, d;

      if (event.startDateTime && event.endDateTime) {
        duration = intervalToDuration({
          start: dates.startDateTime || event.startDateTime,
          end: dates.endDateTime || event.endDateTime,
        });

        h = duration.hours ? `${duration.hours}h` : "";
        m = duration.minutes ? `${duration.minutes}m` : "";
        d = duration.days ? `${duration.days}d` : "";
      }

      const status = event.data.task ? (
        <StatusWrapper>
          <TaskStatus status={event.data.task.status} />
        </StatusWrapper>
      ) : null;

      return (
        <EventBlock style={{ backgroundColor, color }}>
          <Title>
            {status}
            {event.data.task?.title}
          </Title>
          <div>
            {event.startDateTime && event.endDateTime && (
              <>
                {format((dates.startDateTime || event.startDateTime)!, "HH:mm")}
                {" - "}
                {format((dates.endDateTime || event.endDateTime)!, "HH:mm")} (
                {`${d} ${h} ${m}`.trim()})
              </>
            )}
          </div>
        </EventBlock>
      );
    },
    [],
  );

  return (
    <AppRoot>
      <Aside />
      <Sidebar tasks={backlogTasks} projects={defaultProjects} />
      <CalendarRoot>
        <WeekCalendar<CalendarEventData, TTask>
          accepts={[TASK]}
          layers={{
            [WeekCalendarView.Week]: <DragLayer />,
          }}
          date={date}
          colorScheme={calendarTheme}
          events={events}
          timeboxes={timeBoxes}
          onRangeChange={setRange}
          onDateChange={setDate}
          onEventAdd={handleAddEvent}
          view={WeekCalendarView.Week}
          renderEvent={renderEvent}
          onEventAddRequest={handleEventAddRequest}
          onEventChange={handleEventChange}
          onTimeboxChange={() => {}}
          renderDayInfo={renderDayInfo}
          timezones={timezones}
        />
      </CalendarRoot>
    </AppRoot>
  );
};

const Aside = () => {
  return (
    <AsideRoot>
      <Navigation>
        <img src="/week.svg" width={24} height={24} />
        <img src="/icons/navigation/calendar.svg" width={24} height={24} />
        <img src="/icons/navigation/tasks.svg" width={24} height={24} />
        <img src="/icons/navigation/notes.svg" width={24} height={24} />
        <img src="/icons/navigation/stats.svg" width={24} height={24} />
      </Navigation>
      <Navigation>
        <img src="/icons/navigation/help.svg" width={24} height={24} />
        <img src="/icons/navigation/settings.svg" width={24} height={24} />
      </Navigation>
    </AsideRoot>
  );
};

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getTimeboxes(range: Interval) {
  const rrule = RRule.fromString("FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR");
  rrule.options.dtstart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return rrule
    .between(new Date(range.start), new Date(range.end))
    .map((date) => {
      return {
        id: nanoid(),
        title: "Work",
        startDateTime: set(date, { hours: 9, minutes: 0 }),
        endDateTime: set(date, { hours: 18, minutes: 0 }),
        data: {
          type: CALENDAR_TIMEBOX_BLOCK,
        },
        backgroundColor: "#7716dd",
      };
    });
}

function getEvents(range: Interval) {
  return personalTaskNames.map((title) => {
    const projectName = (["Personal", "Work", "Education"] as const)[
      Math.floor(getRandomArbitrary(0, 3))
    ];

    const date = addDays(range.start, getRandomArbitrary(0, 6));

    const startHour = Math.floor(getRandomArbitrary(9, 18));
    const endHour = startHour + getRandomArbitrary(1, 3);

    const startDateTime = set(date, { hours: startHour, minutes: 0 });
    const endDateTime = set(date, { hours: endHour, minutes: 0 });

    return {
      id: nanoid(),
      title,
      startDateTime,
      endDateTime,
      data: {
        task: {
          title,
          project: defaultProjects[projectName],
          status: isPast(endDateTime) ? Status.DONE : Status.IN_PROGRESS,
        },
        type: CALENDAR_TASK_BLOCK,
      },
    };
  });
}

const AppRoot = styled.main`
  display: flex;
  width: 100%;
  height: 70vh;
  margin: 0 auto;
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  margin-top: 64px;
`;

const AsideRoot = styled.aside`
  background-color: rgb(255, 255, 255);
  width: 56px;
  display: flex;
  flex: 0 0 auto;
  box-sizing: border-box;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  border-width: 0px 1px 0 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & img {
    opacity: 0.6;
  }
`;

const CalendarRoot = styled.div`
  position: relative;
  flex: 1 0;
  width: calc(100% - 56px - 250px);
`;

const StatusWrapper = styled.span`
  z-index: 3;
`;

const EventBlock = styled.div`
  font-size: 12px;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  padding: 2px 4px;
  overflow: hidden;
  border: 1px solid transparent;
`;

const Title = styled.div`
  display: flex;
  gap: 4px;
  color: inherit;
`;

const PlannedHours = styled.div`
  font-size: 12px;
  text-align: right;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;
