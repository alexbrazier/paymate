import React from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<Props> = ({
  children,
  className,
  type = 'button',
  ...rest
}) => (
  <button className={cn(styles.button, className)} type={type} {...rest}>
    {children}
  </button>
);

export default Button;
