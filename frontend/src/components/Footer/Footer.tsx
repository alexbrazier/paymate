import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.links}>
      <Link className={styles.link} to="/">
        Create your own page
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
