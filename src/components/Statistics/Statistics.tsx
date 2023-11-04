import React from 'react';
import styles from './Statistics.module.css';
import { animated, useTrail } from '@react-spring/web';

const projects = {
  home: { title: 'Home', color: '#E1F3BC' },
  education: { title: 'Education', color: '#CDE0EE' },
  work: { title: 'Work', color: '#D4CDEE' },
};

const data = [
  {
    date: {
      date: 5,
      day: 'Mon',
    },
    prev: 70,
    current: [
      { project: projects.home, value: 15 },
      { project: projects.education, value: 35 },
      { project: projects.work, value: 20 },
    ]
  },
  {
    date: {
      date: 6,
      day: 'Tue',
    },
    prev: 36,
    current: [
      { project: projects.home, value: 27 },
      { project: projects.education, value: 20 },
      { project: projects.work, value: 52 },
    ]
  },
  {
    date: {
      date: 7,
      day: 'Wed',
    },
    prev: 54,
    current: [
      { project: projects.home, value: 35 },
      { project: projects.education, value: 35 },
      { project: projects.work, value: 20 },
    ]
  },
  {
    date: {
      date: 8,
      day: 'Thu',
    },
    prev: 73,
    current: [
      { project: projects.home, value: 25 },
      { project: projects.education, value: 25 },
      { project: projects.work, value: 70 },
    ]
  },
  {
    date: {
      date: 9,
      day: 'Fri',
    },
    prev: 24,
    current: [
      { project: projects.home, value: 28 },
      { project: projects.education, value: 13 },
      { project: projects.work, value: 45 },
    ]
  },
  {
    date: {
      date: 10,
      day: 'Sat',
      isWeekend: true,
    },
    prev: 30,
    current: [
      { project: projects.home, value: 20 },
      { project: projects.education, value: 20 },
      { project: projects.work, value: 0 },
    ]
  },
  {
    date: {
      date: 11,
      day: 'Sun',
      isWeekend: true,
    },
    prev: 15,
    current: [
      { project: projects.home, value: 15 },
      { project: projects.education, value: 35 },
      { project: projects.work, value: 0 },
    ]
  },
]

export const Statistics = () => {

  const trails = useTrail(data.length, {
    from: { transform: 'scaleY(0%)' },
    to: { transform: 'scaleY(100%)' },
  })
  
  return (
    <div className={styles.root}>
      {
        trails.map((style, index) => {
          const item = data[index];

          return (
            <div key={item.date.date} className={styles.day}>
            <animated.div style={style} className={styles.lines}>
              <div className={styles.prev} style={{height: `${item.prev}%`}} />
              <div className={styles.current}>
                {
                  item.current.map(data => (
                    <div 
                      key={data.project.title}
                      className={styles.currentLine}
                      style={{
                        backgroundColor: data.project.color,
                        height: `${data.value}%`,
                      }}
                    />
                  ))
                }
              </div>
            </animated.div>
            <div className={styles.date}>
              <div className={`${styles.dayName} ${item.date.isWeekend ? styles.dayNameWeekend : ''}`} >
                {item.date.day}
              </div>
              <div className={styles.dayNumber}>
                {item.date.date}
              </div>
            </div>
          </div>
          )
        })
      }
    </div>
  )
}