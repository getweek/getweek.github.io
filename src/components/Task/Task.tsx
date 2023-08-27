import React from 'react';
import type { ReactNode } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './Task.module.css';
import { TaskStatus } from '../TaskStatus/TaskStatus';

type Props = {
  id: number;
  title: string;
  isStarred?: boolean;
  atMyDay?: boolean;
  hasNote?: boolean;
  status: string;
  project: {
    title: string;
    color: string;
  };
  subtasks?: {
    total: number;
    completed: number;
    progress: ReactNode;
  }
  date?: string;
  priority?: ReactNode;
}

export const Task = (props: Props) => {
  return (
    <div className={styles.task}>
      <TaskStatus status={props.status} />
      <span className={styles.title}>
        <span>{props.title}</span>
        {
          props.hasNote && (
            <img className={styles.note} width="16" height="16" src="/icons/note.svg" />
          )
        }
      </span>
      <div className={styles.icons}>
        {
          props.atMyDay && <img src="/icons/flag-mini.svg" width="16" height="16" />
        }
        {
          props.isStarred && <img src="/icons/star.svg" width="16" height="16" />
        }
      </div>
      <div></div>
      <div className={styles.info}>
        <span className={styles.tag} style={{background: props.project.color}}>
          {props.project.title}
        </span>
        {
          props.date && (
            <>
              <span>∙</span>
              <span className={styles.date}>{props.date}</span>
            </>
          )
        }
        {
          props.subtasks && <>
            <span>∙</span>
            <span className={styles.subtasks}>
              <img className={styles.checks} src="/icons/checks.svg" />
              <span>{props.subtasks.completed}/{props.subtasks.total}</span>
              {props.subtasks.progress}
            </span>
          </>
        }
      </div>
      <div className={styles.priority}>
        {props.priority}
      </div>
    </div>
  )
}