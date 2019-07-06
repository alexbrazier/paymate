import React from 'react';
import cn from 'classnames';
import styles from './Input.module.scss';

interface Props extends React.HTMLProps<any> {
  onValue?: (value: string) => any;
}

const Input: React.FC<Props> = ({ id, label, onValue, className, ...rest }) => (
  <div className={cn(styles.wrapper, className)}>
    {label && (
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    )}
    <input
      className={cn(styles.input, label && styles.input_label)}
      name={id}
      onChange={onValue ? e => onValue(e.currentTarget.value) : undefined}
      {...rest}
    />
  </div>
);

export default Input;
