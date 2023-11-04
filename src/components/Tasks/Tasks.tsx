import React from 'react';
import { Task } from '../Task/Task';
import styles from './Tasks.module.css';

const tasks = [
  {
    id: 1,
    title: "Add conference link",
    project: {title: 'Week', color: '#FFF9C4'},
    subtasks: {total: 10, completed: 8, progress: (
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.5 12C9.81371 12 12.5 9.31371 12.5 6C12.5 2.68629 9.81371 0 6.5 0C3.18629 0 0.5 2.68629 0.5 6C0.5 9.31371 3.18629 12 6.5 12ZM6.5 10C8.70914 10 10.5 8.20914 10.5 6C10.5 3.79086 8.70914 2 6.5 2C4.29086 2 2.5 3.79086 2.5 6C2.5 8.20914 4.29086 10 6.5 10Z" fill="#EEEEEE"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.4636 6.66008C12.6095 5.34201 12.3146 4.01275 11.625 2.88003L9.91718 3.91971C10.287 4.52583 10.5 5.23802 10.5 5.99998C10.5 8.20912 8.70914 9.99998 6.5 9.99998C4.29086 9.99998 2.5 8.20912 2.5 5.99998C2.5 3.79428 4.28528 2.00556 6.48967 1.99999L6.48451 0C5.1584 0.00342387 3.87079 0.446079 2.8229 1.25879C1.77501 2.0715 1.02588 3.20846 0.692591 4.49201C0.359302 5.77556 0.46063 7.13336 0.980739 8.35322C1.50085 9.57308 2.41043 10.5863 3.56735 11.2344C4.72426 11.8826 6.06331 12.1292 7.37524 11.9358C8.68717 11.7424 9.89804 11.1197 10.8186 10.1652C11.7392 9.21073 12.3177 7.97814 12.4636 6.66008Z" fill="#03A9F4"/>
      </svg>
    )},
    status: 'notStarted',
    priority: (
      <>
        <img src="/icons/priority-medium.svg" />
        <span>Medium</span>
      </>
    ),
    date: "Today, 10:15",
    isStarred: true,
    atMyDay: true,
    hasNote: true,
  },
  {
    id: 2,
    title: "Fix authentication bug",
    project: {title: 'Work', color: '#F3E5F5'},
    subtasks: {total: 2, completed: 1, progress: (
      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.5 12C9.81371 12 12.5 9.31371 12.5 6C12.5 2.68629 9.81371 0 6.5 0C3.18629 0 0.5 2.68629 0.5 6C0.5 9.31371 3.18629 12 6.5 12ZM6.5 10C8.70914 10 10.5 8.20914 10.5 6C10.5 3.79086 8.70914 2 6.5 2C4.29086 2 2.5 3.79086 2.5 6C2.5 8.20914 4.29086 10 6.5 10Z" fill="#EEEEEE"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M2.25736 10.2426C3.38258 11.3679 4.9087 12 6.5 12L6.5 10C4.29086 10 2.5 8.20914 2.5 6C2.5 3.79086 4.29086 2 6.5 2V0C4.9087 0 3.38258 0.632141 2.25736 1.75736C1.13214 2.88258 0.5 4.4087 0.5 6C0.5 7.5913 1.13214 9.11742 2.25736 10.2426Z" fill="#03A9F4"/>
      </svg>
    )},
    status: 'inProgress',
    priority: (
      <>
        <img src="/icons/priority-critical.svg" />
        <span>Critical</span>
      </>
    ),
    date: "Tomorrow, 11:00",
    isStarred: true,
    hasNote: true,
  },
  {
    id: 3,
    title: "Buy light bulbs",
    project: {title: 'Home', color: '#E8F5E9'},
    status: 'completed',
    priority: (
      <>
        <img src="/icons/priority-low.svg" />
        <span>Low</span>
      </>
    ),
  },
]

export const Tasks = () => {
  return (
    <div className={styles.root}>
      {
        tasks.map(task => (
          <Task key={task.id} {...task} />
        ))
      }
    </div>
  )
}



