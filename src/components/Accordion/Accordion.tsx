import React, {
  useRef,
  type ReactNode,
  useLayoutEffect,
  useState,
} from "react";
import { animated, useSpring, useTransition } from "@react-spring/web";
import useMeasure from "react-use-measure";
import cn from "classnames";
import styles from "./Accordion.module.css";

type Props = {
  title: string;
  open: boolean;
  onOpen: () => void;
  children: ReactNode;
};

export const AccordionItem = (props: Props) => {
  const { title, open, onOpen, children } = props;
  const [ref, bounds] = useMeasure();

  const style = useSpring({
    opacity: open ? 1 : 0,
    height: open ? bounds.height : 0,
  });

  return (
    <div
      className={cn(styles.root, {
        [styles.open]: open,
      })}
    >
      <h3 className={styles.title} onClick={onOpen}>
        <span
          className={cn(styles.icon, {
            [styles.open]: open,
          })}
        >
          <img src="/icons/triangle-down.svg" width={8} height={8} />
        </span>{" "}
        <span>{title}</span>
      </h3>
      <animated.div style={style} className={styles.content}>
        <div ref={ref}>{children}</div>
      </animated.div>
    </div>
  );
};

type AccordionProps = {
  index: number;
  onIndexChange: (index: number) => void;
  items: {
    title: string;
    content: ReactNode;
    demo: ReactNode;
  }[];
};

export const Accordion = (props: AccordionProps) => {
  const { items, index, onIndexChange } = props;

  return (
    <div className={styles.container}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          open={i === index}
          onOpen={() => onIndexChange(i)}
        >
          {item.content}
          <div className={styles.demo}>{item.demo}</div>
        </AccordionItem>
      ))}
    </div>
  );
};
