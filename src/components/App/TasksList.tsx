import React, { useEffect } from "react";
import styled from "styled-components";
import { Text } from "../Text";
import { Status, type TProject, type TTask } from "./types";
import { TaskStatus } from "../TaskStatus/TaskStatus";
import CaseImg from "../../../public/emoji/case.png";
import ManImg from '../../../public/emoji/man.png';
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { TASK } from "./DragLayer";

type TasksListProps = {
  tasks: TTask[];
  projects: { [key: string]: TProject };
};

export const TasksList = (props: TasksListProps) => {
  const groups = props.tasks.reduce(
    (groups, task) => {
      const key = task.project.title;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(task);

      return groups;
    },
    {} as { [key: string]: TTask[] },
  );

  return (
    <TasksListRoot>
      {Object.entries(groups).map(([key, value]) => {
        return (
          <Group
            key={key}
            title={key}
            icon={key === "Work" ? CaseImg.src : ManImg.src}
            tasks={value}
            projects={props.projects}
          />
        );
      })}
    </TasksListRoot>
  );
};

type GroupProps = {
  title: string;
  icon: string;
  tasks: TTask[];
  projects: { [key: string]: TProject };
};

const Group = (props: GroupProps) => {
  return (
    <GroupRoot>
      <GroupTitle>
        <img src={props.icon} width={16} height={16} />
        <Text>{props.title}</Text>
      </GroupTitle>
      <GroupTasks>
        {props.tasks.map((task) => {
          return <Task key={task.id} task={task} projects={props.projects} />;
        })}
      </GroupTasks>
    </GroupRoot>
  );
};

type TaskProps = {
  task: TTask;
  projects: { [key: string]: TProject };
};

const Task = (props: TaskProps) => {
  const { task, projects } = props;

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: TASK,
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    dragPreview(getEmptyImage());
  }, []);

  return (
    <TaskRoot
      backgroundColor={task.project.backgroundColor}
      color={task.project.color}
      ref={drag}
    >
      <DragWrapper>
        <img src="/icons/drag.svg" width={16} height={16} />
      </DragWrapper>
      <IconWrapper>
        <TaskStatus status={task.status || Status.TODO} />
      </IconWrapper>
      <Text inherit>{task.title}</Text>
    </TaskRoot>
  );
};

const TasksListRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`;

const GroupRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GroupTasks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TaskRoot = styled.div<{ backgroundColor?: string; color?: string }>`
  padding: 5px 10px 5px 5px;
  border-radius: 3px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  justify-content: flex-start;
  background-color: ${(p) => p.backgroundColor};
  color: ${(p) => p.color};
  border: 1px solid ${(p) => p.color};
`;

const IconWrapper = styled.span`
  display: inline-block;
  padding-top: 1px;
`;

const DragWrapper = styled(IconWrapper)`
  cursor: grab;
`;
