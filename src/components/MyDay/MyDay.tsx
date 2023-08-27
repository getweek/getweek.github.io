import React from 'react';
import { Task } from '../Task/Task';
import { add, addDays, eachDayOfInterval, format, formatDistanceToNow, isToday, isWeekend, set, subDays } from 'date-fns';
import styles from './MyDay.module.css';

const days = eachDayOfInterval({
  start: subDays(new Date(), 1),
  end: addDays(new Date(), 3),
});

const tasks = [
  { 
    id: 1, 
    title: 'Wash dishes', 
    status: 'notStarted',
    project: {
      title: 'Home',
      color: '#E8F5E9'
    }
  },
];

const dateStart = set(
  add(new Date(), { hours: 1 }), 
  {
    minutes: 0
  }
);

const events = [
  {
    id: 1,
    title: 'Q1 Goals',
    dateStart,
    dateEnd: add(dateStart, {minutes: 30}),
    color: '#'
  }
];

export const MyDay = () => {

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.name}>
          <img src="/icons/flag.svg" />
          <span className={styles.heading}>
            My Day
          </span>
        </div>

        <div className={styles.days}>
          {
            days.map(day => (
              <div 
                className={`${styles.day} ${isToday(day) ? styles.today : null}`}
              >
                <div>{format(day, 'd')}</div>
                <div className={isWeekend(day) ? styles.weekend : undefined}>
                  {format(day, 'EE')}
                </div>
              </div>
            ))
          }
        </div>
      </header>
      <div className={styles.subheader}>
        <span>Tasks</span>
      </div>
      <section className={styles.section}>
        {
          tasks.map(task => (
            <Task key={task.id} {...task} />
          ))
        }
      </section>
      <div className={styles.subheader}>
        <span>Events</span>
      </div>
      <section>
        {
          events.map(event => (
            <Event key={event.id} {...event} />
          ))
        }
      </section>
    </div>
  )
}

const Event = (props: any) => {

  return (
    <div className={styles.event}>
      <span className={styles.color} />
      <div className={styles.info}>
        <div className={styles.time}>
          {format(props.dateStart, 'HH:mm')}
          {' - '}
          {format(props.dateEnd, 'HH:mm')}
        </div>
        <div className={styles.timeLeft}>
          {formatDistanceToNow(props.dateStart, {addSuffix: true})}
        </div>
      </div>
      <div className={styles.title}>{props.title}</div>
      <div>
        <button className={styles.button}>
          Join
        </button>
      </div>
    </div>
  )
}