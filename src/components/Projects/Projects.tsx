import React from 'react';
import type { ReactNode } from 'react';
import styles from './Projects.module.css';

const projects = [
  { key: 1, title: 'Work', count: 10, emoji: '/emoji/case.png' },
  { key: 2, title: 'Personal', count: 7, emoji: '/emoji/man.png' },
  { key: 3, title: 'Home', count: 2, emoji: '/emoji/house.png' },
]

export const Projects = () => {
  return (
    <div className={styles.root}>
      {
        projects.map(project => (
          <Project {...project} />
        ))
      }
    </div>
  )
}

type Props = {
  title: string;
  emoji: string;
  count: number;
}

const Project = (props: Props) => {
  return (
    <div className={styles.project}>
      <img src={props.emoji} width={16} height={16} />
      <span className={styles.title}>
        {props.title}
      </span>
      <span className={styles.count}>{props.count}</span>
    </div>
  )
}