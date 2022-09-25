import React from 'react';
import styles from './Footer.module.scss';
import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.links}>
      <Link href="/">
        <a className={styles.link}>Create your own page</a>
      </Link>
      <a
        className={styles.link}
        href="https://github.com/alexbrazier/paymate"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
  </footer>
);

export default Footer;
