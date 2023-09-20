import React from "react";
import styles from "./Goals.module.css";

export const Goals = () => {
  return (
    <div className={styles.root}>
      <Goal
        img="/goal2.jpeg"
        icon="/emoji/automobile.png"
        className={styles.goal2}
        dateTo="31.12.2023"
        daysLeft="121 days"
        description="230k/500k"
        progress={50}
      />
      <Goal
        img="/goal3.jpeg"
        icon="/emoji/palm-tree.png"
        className={styles.goal3}
        dateTo="31.09.2023"
        daysLeft="34 days"
        description="9/10 tasks"
        progress={90}
      />
      <Goal
        img="/goal1.jpeg"
        icon="/emoji/spain.png"
        className={styles.goal1}
        dateTo="31.09.2023"
        daysLeft="34 days"
        description="6/24 tasks"
        progress={25}
      />
    </div>
  );
};

type Props = {
  className: string;
  img: string;
  icon: string;
  dateTo: string;
  daysLeft: string;
  description: string;
  progress: number;
};

const Goal = ({
  className,
  icon,
  img,
  dateTo,
  daysLeft,
  progress,
  description,
}: Props) => (
  <div className={`${styles.goal} ${className}`}>
    <div
      className={styles.image}
      style={{ backgroundImage: `url(${img})` }}
    ></div>
    <div className={styles.content}>
      <div className={styles.title}>
        <img width={16} height={16} src={icon} />
        Move to Spain
      </div>
      <div className={styles.description}>
        <img width={16} height={16} src="/icons/goal.svg" />
        <span>{dateTo}</span>
        <span className={styles.muted}>({daysLeft})</span>
      </div>
      <div className={styles.progress}>
        <div className={styles.progressText}>
          <span>{description}</span>
          <span>{progress}%</span>
        </div>
        <div className={styles.progressLine}>
          <div
            className={styles.progressLineFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);
