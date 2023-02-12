import React from 'react';
import styles from './Checkbox.module.css';

type Props = {
  value?: boolean;
}

export const Checkbox = ({value}: Props) => {
  
  return (
    <span className={styles.root}>
      {
        value 
          ? <span className={styles.checkmark} /> 
          : <span className={styles.checkbox} />
      }
    </span>
  )
  
}