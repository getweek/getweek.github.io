import React from 'react';
import notStarted from './not-started.svg';
import inProgress from './in-progress.svg';
import completed from './completed.svg';
import cancelled from './cancelled.svg';
import { Status } from '../App/types';

export const TaskStatus = ({status}: {status: Status}) => {
  switch (status) {
    case Status.TODO:
      return (
        <img src={notStarted.src} />
      )
    case Status.IN_PROGRESS:
      return (
        <img src={inProgress.src} />
      )
    case Status.DONE:
      return (
        <img src={completed.src} />
      )
    case Status.CANCELLED:
      return (
        <img src={cancelled.src} />
      )
  }

  return null
}