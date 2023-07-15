import React from 'react';
import styles from './Footer.module.scss';
import Link from '../Link';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.links}>
      <Link href="/" className={styles.link}>
        Create your own page
      </Link>
      <Link
        className={styles.link}
        href="https://github.com/alexbrazier/paymate"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </Link>
    </div>
  </footer>
);

export default Footer;
