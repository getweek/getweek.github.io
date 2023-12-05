import React from 'react';
import { Calendar } from '../components/Calendar/Calendar';
import { Regions } from '../components/Regions/Regions';
import { Note } from '../components/Note/Note';
import { Statistics } from '../components/Statistics/Statistics';

export const benefits = [
  {
    title: "You can’t always complete a task in one go",
    content: (
      <p>
        We all need a break sometimes and other important activities might
        interrupt us from completing of our goal. In Week you can schedule each
        task multiple times until you decide that the task is completed.
      </p>
    ),
    demo: <Calendar />,
  },
  {
    title:
      "Sometimes it’s hard to know which tasks you’re going to do tomorrow",
    content: (
      <p>
        In Week you can plan not only
        tasks, but placeholders for them. We call them “time boxes”. You can
        create time boxes for projects and we will help you to fill them with
        tasks automatically when the time comes.
      </p>
    ),
    demo: <Regions />
  },
  {
    title: "Tasks can have a lot of related information",
    content: (
      <p>
        You can store useful information inside tasks notes. Save text, links
        and subtasks and never lose important context! Subtasks can also be
        scheduled on the calendar.
      </p>
    ),
    demo: <Note />
  },
  {
    title: "It’s important to monitor your productivity",
    content: (
      <p>
        We have a separate statistics screen where you can see your week and
        year stats. Use it to compare your results against previous week or
        check out which month was more productive than the others.
      </p>
    ),
    demo: <Statistics />
  },
];