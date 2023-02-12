import React from 'react';
import styles from './DonutChart.module.css';

type Props = {
  radius: number;
  value: number;
  total: number;
}

export const DonutChart = (props: Props) => {
  const {
    radius = 10,
    value,
    total,
  } = props;

  const circleCircumference = 2 * Math.PI * radius;
  const percentage = (total - value) / total * 100;

  const strokeDashoffset = circleCircumference - (circleCircumference * percentage) / 100;

  return (
    <svg height={radius * 2.5} width={radius * 2.5} viewBox={`0 0 ${radius * 2.5} ${radius * 2.5}`}>
      <g className={styles.group}>
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke='#03A9F4'
          fill="transparent"
          strokeWidth={2}
        />
        <circle
          cx="50%"
          cy="50%"
          rotate="90deg"
          r={radius}
          fill="transparent"
          stroke="#eeeeee"
          strokeWidth={2}
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
        />
      </g>
    </svg>
  );
};
