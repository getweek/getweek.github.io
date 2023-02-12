import React from 'react';
import styles from './Calendar.module.css';

export const Calendar = () => {
  return (
    <div className={styles.root}>
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.event}>
        <div>Prepare the report</div>
        <div>12:00 - 13:00 (1h)</div>
      </div>
    </div>
  )
}