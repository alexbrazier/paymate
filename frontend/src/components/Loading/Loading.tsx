import React, { useEffect, useState } from 'react';
import styles from './Loading.module.scss';

const Spinner = ({ size = 32 }) => {
  const strokeWidth = size / 12;
  return (
    <svg height={size} width={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - strokeWidth}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={size * 2}
        className={styles.spinner}
      />
    </svg>
  );
};

const Loading = ({ delay = 300 }) => {
  const [pastDelay, setPastDelay] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setPastDelay(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!pastDelay) {
    return null;
  }

  return (
    <div className={styles.loading}>
      <Spinner size={56} />
    </div>
  );
};

export default Loading;
