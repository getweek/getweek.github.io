import React, { useEffect, useRef, useState } from "react";
import styles from "./CommandBar.module.css";
import { TaskStatus } from "../TaskStatus/TaskStatus";

const GROUPS = [
  {
    title: "Tasks",
    items: [
      {
        title: "Write a blog post",
        status: "inProgress",
        date: new Date(2023, 10, 12),
      },
      {
        title: "Walk the dog",
        status: "notStarted",
        date: new Date(2023, 10, 13),
      },
      {
        title: "Go to the gym",
        status: "notStarted",
        date: new Date(2023, 10, 12),
      },
    ],
  },
  {
    title: "Commands",
    items: [
      {
        title: "Go to Inbox",
        icon: null,
        hotkey: "g i",
      },
      {
        title: "Go to My Day",
        icon: null,
        hotkey: "g d",
      },
      {
        title: "Go to Calendar",
        icon: null,
        hotkey: "g c",
      },
    ],
  },
];

export const CommandBar = () => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(-1);
  const elements = useRef(new Map());

  const filtered = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.title.toLowerCase().includes(input.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

  const allItems = filtered.reduce<any>(
    (acc, group) => [...acc, ...group.items],
    [],
  );

  const length = filtered.reduce((acc, group) => acc + group.items.length, 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((selected - 1 + length) % length);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((selected + 1) % length);
    }
  };

  useEffect(() => {
    const element = elements.current.get(allItems[selected]);

    if (element) {
      element.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selected]);

  return (
    <div className={styles.root}>
      <div className={styles.commandBar}>
        <div className={styles.inputWrapper}>
          <img src="/icons/search.svg" width={16} height={16} />
          <input
            type="text"
            placeholder="Search for commands or tasks..."
            className={styles.input}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div className={styles.body}>
          {filtered.map((group) => (
            <div key={group.title} className={styles.group}>
              <div className={styles.groupTitle}>{group.title}</div>
              <ul className={styles.items}>
                {group.items.map((item) => (
                  <li
                    key={item.title}
                    ref={(element) => elements.current.set(item, element)}
                    className={`${styles.item} ${
                      allItems[selected] === item && styles.active
                    }`}
                  >
                    {"status" in item && <TaskStatus status={item.status} />}
                    {"icon" in item && item.icon && <img src={item.icon} />}
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          <div>
            <span>Navigate:</span>
            <div className={styles.hotkeys}>
              <img
                src="/icons/arrow-up.svg"
                width={16}
                height={16}
                className={styles.hotkey}
              />
              <img
                src="/icons/arrow-down.svg"
                width={16}
                height={16}
                className={styles.hotkey}
              />
            </div>
          </div>
          <div>
            <span>Select:</span>
            <img
              src="/icons/enter-key.svg"
              width={16}
              height={16}
              className={styles.hotkey}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};
