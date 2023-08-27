import React from 'react';
import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { DonutChart } from '../DonutChart/DonutChart';
import styles from './Note.module.css';
import { TaskStatus } from '../TaskStatus/TaskStatus';

export const Note = () => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <TaskStatus status="inProgress" />
        <span className={styles.title}>Prepare dashboard for metrics</span>
        <span />
        <div className={styles.info}>
          <div className={styles.infoCol}>
            <span className={styles.label}>Project:</span>
            <span className={styles.value}>Work</span>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.label}>Tasks:</span>
            <span className={styles.value}>1/2</span>
            <DonutChart total={2} value={1} radius={5} />
          </div>
        </div>
      </header>
      <div className={styles.content}>
        <p>
          Need to prepare new Grafana dashboard by the end of this week. It 
should display Web Vitals metrics and overall score.
        </p>
        <ul className={styles.tasks}>
          <Task status="completed">Request permissions to edit dashboards</Task>
          <Task status="inProgress">Create a dashboard from template</Task>
        </ul>
        <p>
          <a href="https://web.dev/vitals/" target="_blank">
            Web Vitals documentation
          </a>
        </p>
      </div>
    </div>
  )
}

type TaskProps = {
  children: ReactNode;
  status: string;
}

const Task = ({children, status}: TaskProps) => {
  return (
    <div className={styles.task}>
      <TaskStatus status={status}  />
      <span className={`${status === 'completed' ? styles.completed : ''}`}>{children}</span>
    </div>
  )
}