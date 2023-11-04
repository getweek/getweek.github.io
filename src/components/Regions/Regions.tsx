import React from "react";
import styles from "./Regions.module.css";
import { animated, useChain, useSpringRef, useTrail } from "@react-spring/web";

const day1 = [
  {
    background: "#E8F5E9",
    duration: 20,
    top: 20,
  },
  {
    background: "#F3E5F5",
    duration: 45,
    top: 45,
  },
  {
    background: "#F3E5F5",
    duration: 60,
    top: 95,
  },
  {
    background: "#F3E5F5",
    duration: 15,
    top: 160,
  },
];

const day2 = [
  {
    background: "#F3E5F5",
    duration: 25,
    top: 40,
  },
  {
    background: "#F3E5F5",
    duration: 30,
    top: 70,
  },
  {
    background: "#F3E5F5",
    duration: 30,
    top: 105,
  },
  {
    background: "#F3E5F5",
    duration: 30,
    top: 140,
  },
];

const day3 = [
  {
    background: "#F3E5F5",
    duration: 45,
    top: 40,
  },
  {
    background: "#F3E5F5",
    duration: 45,
    top: 90,
  },
  {
    background: "#F3E5F5",
    duration: 15,
    top: 105,
  },
  {
    background: "#F3E5F5",
    duration: 30,
    top: 140,
  },
  {
    background: "#fae1df",
    duration: 30,
    top: 180,
  },
];

const day4 = [
  {
    background: "#E8F5E9",
    duration: 20,
    top: 20,
  },
  {
    background: "#F3E5F5",
    duration: 15,
    top: 40,
  },
  {
    background: "#F3E5F5",
    duration: 15,
    top: 60,
  },
  {
    background: "#F3E5F5",
    duration: 15,
    top: 80,
  },
  {
    background: "#F3E5F5",
    duration: 60,
    top: 100,
  },
];

const day5 = [
  {
    background: "#E8F5E9",
    duration: 20,
    top: 20,
  },
  {
    background: "#F3E5F5",
    duration: 30,
    top: 40,
  },
  {
    background: "#F3E5F5",
    duration: 30,
    top: 75,
  },
  {
    background: "#F3E5F5",
    duration: 15,
    top: 110,
  },
  {
    background: "#F3E5F5",
    duration: 45,
    top: 130,
  },
  {
    background: "#fae1df",
    duration: 30,
    top: 180,
  },
];

const day6 = [
  {
    background: "#E8F5E9",
    duration: 30,
    top: 20,
  },
  {
    background: "#E8F5E9",
    duration: 120,
    top: 55,
  },
  {
    background: "#E8F5E9",
    duration: 30,
    top: 180,
  },
  {
    background: "#E8F5E9",
    duration: 15,
    top: 110,
  },
  {
    background: "#E8F5E9",
    duration: 45,
    top: 130,
  },
];

const day7 = [
  {
    background: "#E8F5E9",
    duration: 45,
    top: 20,
  },
  {
    background: "#E8F5E9",
    duration: 60,
    top: 70,
  },
  {
    background: "#E8F5E9",
    duration: 45,
    top: 135,
  },
  {
    background: "#E8F5E9",
    duration: 15,
    top: 185,
  },
];

export const Regions = () => {
  const firstTrailsRef = useSpringRef();
  const secondTrailsRef = useSpringRef();
  const thirdTrailsRef = useSpringRef();
  const fourthTrailsRef = useSpringRef();
  const fivthTrailsRef = useSpringRef();
  const sixthTrailsRef = useSpringRef();
  const seventhTrailsRef = useSpringRef();

  const trails1 = useTrail(day1.length, {
    ref: firstTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  const trails2 = useTrail(day2.length, {
    ref: secondTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  const trails3 = useTrail(day3.length, {
    ref: thirdTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  const trails4 = useTrail(day4.length, {
    ref: fourthTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  const trails5 = useTrail(day5.length, {
    ref: fivthTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  const trails6 = useTrail(day6.length, {
    ref: sixthTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  const trails7 = useTrail(day7.length, {
    ref: seventhTrailsRef,
    from: { opacity: 0, transform: "scale(1.35)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  useChain(
    [
      firstTrailsRef,
      secondTrailsRef,
      thirdTrailsRef,
      fourthTrailsRef,
      fivthTrailsRef,
      sixthTrailsRef,
      seventhTrailsRef,
    ],
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    1500,
  );

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
            {trails1.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day1[index].background,
                  height: `${day1[index].duration}px`,
                  top: `${day1[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
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
            {trails2.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day2[index].background,
                  height: `${day2[index].duration}px`,
                  top: `${day2[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
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
            {trails3.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day3[index].background,
                  height: `${day3[index].duration}px`,
                  top: `${day3[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
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
            {trails4.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day4[index].background,
                  height: `${day4[index].duration}px`,
                  top: `${day4[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
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
            {trails5.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day5[index].background,
                  height: `${day5[index].duration}px`,
                  top: `${day5[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>17</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal}`}>
              <span className={styles.regionName}>Family</span>
            </div>
            {trails6.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day6[index].background,
                  height: `${day6[index].duration}px`,
                  top: `${day6[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
          </div>
        </div>
        <div className={styles.day}>
          <div className={styles.dayHeader}>18</div>
          <div className={styles.dayContent}>
            <div className={`${styles.region} ${styles.regionPersonal}`}>
              <span className={styles.regionName}>Family</span>
            </div>
            {trails7.map((props, index) => (
              <animated.div
                key={index}
                style={{
                  ...props,
                  backgroundColor: day7[index].background,
                  height: `${day7[index].duration}px`,
                  top: `${day7[index].top}px`,
                }}
                className={styles.event}
              ></animated.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
