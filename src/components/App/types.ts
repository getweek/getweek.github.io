

export type TTask = {
  id: string;
  title: string;
  project: TProject;
  status: Status;
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

export type TProject = {
  id: string;
  title: string;
  backgroundColor: string;
  color: string;
}

export type TTimeEntry = {
  id: string;
  taskId: string;
  startDateTime: Date;
  endDateTime: Date;
  parent: TTask;
}

export type CalendarEventData = {
  task?: TTask;
  timeEntry?: TTimeEntry;
  event?: Event;
  type: symbol;
};