import React from "react";
import styled from "styled-components";
import { colord } from "colord";
import { Text } from "../Text";
import { TasksList } from "./TasksList";
import type { TProject, TTask } from "./types";
import ChevronDown from "../../../public/icons/chevron-down.svg";
import PlayIcon from '../../../public/icons/play.svg';
import SettingsIcon from '../../../public/icons/settings.svg';

type Props = {
  tasks: TTask[];
  projects: { [key: string]: TProject };
};

export const Sidebar = (props: Props) => {

  return (
    <Root>
      <Action>
        <ActionButton>
          <GrowTransparentButton>Add task</GrowTransparentButton>
          <Line />
          <TransparentButton>
            <img src={ChevronDown.src} alt="chevron-down" />
          </TransparentButton>
        </ActionButton>
      </Action>
      <Tracker>
        <img src={PlayIcon.src} alt="play" />
        <TrackerText muted>Click to select a task</TrackerText>
        <Text>0:00</Text>
      </Tracker>
      <SidebarSettings>
        <SidebarSettingsItem>
          <Text muted>Group by:</Text>
          <Text>Project</Text>
        </SidebarSettingsItem>
      </SidebarSettings>
      <TasksList tasks={props.tasks} projects={props.projects} />
    </Root>
  );
};

const Root = styled.aside`
  flex-shrink: 1;
  flex-grow: 0;
  flex-basis: 250px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  border-right: 1px solid rgb(238, 238, 238);
  background-color: rgb(255, 255, 255);
  padding: 10px;
  transition: transform 0.5s ease 0s;
  z-index: 5;
`;

const Action = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.div`
  position: relative;
  flex-grow: 1;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(3, 169, 244);
  border-radius: 3px;

  &:hover {
    background: ${(p) => colord("rgb(3, 169, 244)").darken(0.025).toHex()};
  }
`;

const TransparentButton = styled.button`
  display: flex;
  justify-content: center;
  background-color: transparent;
  border: none;
  outline: none;
  min-width: 32px;
  color: #fff;
`;

const GrowTransparentButton = styled(TransparentButton)`
  flex-grow: 1;
`;

const Line = styled.div`
  width: 1px;
  height: 60%;
  background-color: #fff;
  opacity: 30%;
  flex-shrink: 0;
`;

const Tracker = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  box-sizing: border-box;
  padding: 4px 2px;
  background-color: ${(p) => p.theme.backgroundColor};
  border-radius: 4px;
`;

const TrackerText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const SidebarSettings = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
`;

const SidebarSettingsItem = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 4px;
`;