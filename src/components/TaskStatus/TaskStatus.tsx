import React from 'react';
import notStarted from './not-started.svg';
import inProgress from './in-progress.svg';
import completed from './completed.svg';
import cancelled from './cancelled.svg';

export const TaskStatus = ({status}) => {
  switch (status) {
    case 'notStarted':
      return (
        <img src={notStarted} />
      )
    case 'inProgress':
      return (
        <img src={inProgress} />
      )
    case 'completed':
      return (
        <img src={completed} />
      )
    case 'cancelled':
      return (
        <img src={cancelled} />
      )
  }

  return null
}