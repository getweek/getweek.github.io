import React, { useEffect, useState } from "react";
import styles from "./Tracker.module.css";
import { differenceInSeconds } from "date-fns";

export const Tracker = () => {
  const [start] = useState(new Date());
  const [time, setTime] = useState("0:00");

  useEffect(() => {
    const timeout = setInterval(() => {
      const difference = differenceInSeconds(new Date(), start);

      const time = `${Math.floor(difference / 60)}:${(difference % 60)
        .toString()
        .padStart(2, "0")}`;

      setTime(time);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [start]);

  return (
    <div className={styles.root}>
      <div className={styles.tracker}>
        <div className={styles.title}>
          <img src="/tracker-stop.svg" />
          <span>Consider using Week</span>
        </div>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
};
