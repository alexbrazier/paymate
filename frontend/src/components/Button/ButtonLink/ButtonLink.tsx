import React from 'react';
import cn from 'classnames';
import buttonStyles from '../Button.module.scss';
import styles from './ButtonLink.module.scss';
import { Link } from 'react-router-dom';

interface Props {
  className?: string;
  to: string;
}

const ButtonLink: React.FC<Props> = ({ children, to, className, ...rest }) => (
  <Link
    to={to}
    className={cn(styles.buttonLink, buttonStyles.button, className)}
    {...rest}
  >
    {children}
  </Link>
);

export default ButtonLink;
