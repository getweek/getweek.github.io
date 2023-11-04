import React from "react";
import { animated, useSpring, useChain, useSpringRef } from "@react-spring/web";
import styles from "./Calendar.module.css";

export const Calendar = () => {
  const firstBlockRef = useSpringRef();
  const secondBlockRef = useSpringRef();
  const thirdBlockRef = useSpringRef();

  const firstBlock = useSpring({
    ref: firstBlockRef,
    from: { height: "0px" },
    to: { height: "58px" },
  });

  const secondBlock = useSpring({
    ref: secondBlockRef,
    from: { transform: "scale(1.35)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  });

  const thirdBlock = useSpring({
    ref: thirdBlockRef,
    from: { height: "0px", opacity: 0 },
    to: { height: "60px", opacity: 1 },
  });

  useChain([firstBlockRef, secondBlockRef, thirdBlockRef]);

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
      <animated.div
        style={firstBlock}
        className={[styles.event, styles.event1].join(" ")}
      >
        <div>Prepare the report</div>
        <div>11:30 - 12:00 (30m)</div>
      </animated.div>
      <animated.div
        style={secondBlock}
        className={[styles.event, styles.event2].join(" ")}
      >
        <div>Important meeting</div>
        <div>12:00 - 13:00 (1h)</div>
      </animated.div>
      <animated.div
        style={thirdBlock}
        className={[styles.event, styles.event3].join(" ")}
      >
        <div>Prepare the report</div>
        <div>13:00 - 13:30 (30m)</div>
      </animated.div>
    </div>
  );
};
