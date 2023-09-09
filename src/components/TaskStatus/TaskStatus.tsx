import React from 'react';
import notStarted from './not-started.svg';
import inProgress from './in-progress.svg';
import completed from './completed.svg';
import cancelled from './cancelled.svg';

export const TaskStatus = ({status}) => {
  switch (status) {
    case 'notStarted':
      return (
        <img src={notStarted.src} />
      )
    case 'inProgress':
      return (
        <img src={inProgress.src} />
      )
    case 'completed':
      return (
        <img src={completed.src} />
      )
    case 'cancelled':
      return (
        <img src={cancelled.src} />
      )
  }

  return null
}