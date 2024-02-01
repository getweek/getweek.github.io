import React from "react";
import type { ReactNode } from "react";
import {
  animated,
  useChain,
  useSpring,
  useSpringRef,
  useSprings,
  useTrail,
  useTransition,
} from "@react-spring/web";
import { DonutChart } from "../DonutChart/DonutChart";
import { TaskStatus } from "../TaskStatus/TaskStatus";
import styles from "./Note.module.css";
import { Status } from "../App/types";

const noteMessage = `Need to prepare new Grafana dashboard by the end of this week. It 
should display Web Vitals metrics and overall score.`;

const text = [...noteMessage];

export const Note = () => {
  const trailsRef = useSpringRef();
  const spring1Ref = useSpringRef();
  const spring2Ref = useSpringRef();
  const spring3Ref = useSpringRef();

  const trail = useTrail(noteMessage.length, {
    ref: trailsRef,
    from: { opacity: 0, transform: "scale(1.1)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { duration: 5000 / text.length },
  });

  const spring1 = useSpring({
    from: { opacity: 0, transform: "translateY(-2px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    ref: spring1Ref,
  });

  const spring2 = useSpring({
    from: { opacity: 0, transform: "translateY(-2px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    ref: spring2Ref,
  });

  const spring3 = useSpring({
    from: { opacity: 0, transform: "translateY(-2px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    ref: spring3Ref,
  });

  useChain([trailsRef, spring1Ref, spring2Ref, spring3Ref]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <TaskStatus status={Status.IN_PROGRESS} />
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
        <p className={styles.message}>
          {trail.map((props, index) => (
            <animated.span key={index} style={props}>
              {text[index]}
            </animated.span>
          ))}
        </p>
        <ul className={styles.tasks}>
          <animated.div style={spring1}>
            <Task status="completed">
              Request permissions to edit dashboards
            </Task>
          </animated.div>
          <animated.div style={spring2}>
            <Task status="inProgress">Create a dashboard from template</Task>
          </animated.div>
        </ul>
        <animated.p style={spring3}>
          <a href="https://web.dev/vitals/" target="_blank">
            Web Vitals documentation
          </a>
        </animated.p>
      </div>
    </div>
  );
};

type TaskProps = {
  children: ReactNode;
  status: string;
};

const Task = ({ children, status }: TaskProps) => {
  return (
    <div className={styles.task}>
      <TaskStatus status={status} />
      <span className={`${status === "completed" ? styles.completed : ""}`}>
        {children}
      </span>
    </div>
  );
};
