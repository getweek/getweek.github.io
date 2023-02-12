import React from 'react';
import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { DonutChart } from '../DonutChart/DonutChart';
import styles from './Note.module.css';

export const Note = () => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Checkbox />
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
          <Task isCompleted>Request permissions to edit dashboards</Task>
          <Task>Create a dashboard from template</Task>
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
  isCompleted?: boolean;
}

const Task = ({children, isCompleted}: TaskProps) => {
  return (
    <div className={`${styles.task} ${isCompleted ? styles.completed : ''}`}>
      <Checkbox value={isCompleted} />
      <span>{children}</span>
    </div>
  )
}