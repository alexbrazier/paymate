import React from 'react';
import cn from 'classnames';
import styles from './Breadcrumbs.module.scss';
import Link from '../Link';

interface Breadcrumb {
  path: string;
  name: string;
}

interface Props {
  breadcrumbs: Breadcrumb[];
  currentPage: string;
}

const Breadcrumbs: React.FC<Props> = ({ breadcrumbs, currentPage }) => {
  return (
    <ul className={styles.breadcrumbs}>
      {breadcrumbs.map(({ path, name }) => (
        <li className={styles.item} key="path">
          <Link href={path}>{name}</Link>
        </li>
      ))}
      <li className={cn(styles.item, styles.currentPage)}>{currentPage}</li>
    </ul>
  );
};

export default Breadcrumbs;
