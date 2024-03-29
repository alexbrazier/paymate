import React from 'react';
import cn from 'classnames';
import buttonStyles from '../Button.module.scss';
import styles from './ButtonLink.module.scss';
import Link from 'next/link';

interface Props {
  className?: string;
  to: string;
  children: React.ReactNode;
}

const ButtonLink: React.FC<Props> = ({ children, to, className, ...rest }) => (
  <Link href={to} legacyBehavior>
    <a
      className={cn(styles.buttonLink, buttonStyles.button, className)}
      {...rest}
    >
      {children}
    </a>
  </Link>
);

export default ButtonLink;
