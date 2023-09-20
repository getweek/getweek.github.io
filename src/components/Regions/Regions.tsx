import React from 'react';
import styles from './Regions.module.css';

export const Regions = () => {
  return (
    <div className={styles.root}>
      <div className={styles.calendar}>
        <div className={styles.day}>
          <div className={styles.dayHeader}>12</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal2}`}>
              <span className={styles.regionName}>Personal</span>
            </div>
            <div className={`${styles.region} ${styles.regionWork}`}>
              <span className={styles.regionName}>Work</span>
            </div>
            <div className={`${styles.region} ${styles.regionReading}`}>
              <span className={styles.regionName}>Reading</span>
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>13</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal2}`}>
              <span className={styles.regionName}>Personal</span>
            </div>
            <div className={`${styles.region} ${styles.regionWork}`}>
              <span className={styles.regionName}>Work</span>
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>14</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal2}`}>
              <span className={styles.regionName}>Personal</span>
            </div>
            <div className={`${styles.region} ${styles.regionWork}`}>
              <span className={styles.regionName}>Work</span>
            </div>
            <div className={`${styles.region} ${styles.regionReading}`}>
              <span className={styles.regionName}>Reading</span>
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>15</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal2}`}>
              <span className={styles.regionName}>Personal</span>
            </div>
            <div className={`${styles.region} ${styles.regionWork}`}>
              <span className={styles.regionName}>Work</span>
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>16</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal2}`}>
              <span className={styles.regionName}>Personal</span>
            </div>
            <div className={`${styles.region} ${styles.regionWork}`}>
              <span className={styles.regionName}>Work</span>
            </div>
            <div className={`${styles.region} ${styles.regionReading}`}>
              <span className={styles.regionName}>Reading</span>
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>17</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal}`}>
              <span className={styles.regionName}>Family</span>
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>18</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal}`}>
              <span className={styles.regionName}>Family</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}