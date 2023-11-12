import React from "react";
import { useTransition, animated } from "@react-spring/web";
import { benefits } from "../../data/benefits";
import { Accordion } from "../Accordion/Accordion";
import { Calendar } from "../Calendar/Calendar";
import styles from "./Benefits.module.css";

export const Benefits = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const transition = useTransition(activeIndex, {
    from: { opacity: 0, transform: "translate3d(0, 100%, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0%, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -100%, 0)" },
  });

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Accordion
          items={benefits}
          index={activeIndex}
          onIndexChange={setActiveIndex}
        />
      </div>
      <div className={styles.demoScreen}>
        {transition((style, index) => (
          <animated.div style={style} className={styles.demo}>
            {benefits[index].demo}
          </animated.div>
        ))}
      </div>
    </div>
  );
};
