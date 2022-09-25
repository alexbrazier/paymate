import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import * as API from '../../api';
import styles from './Header.module.scss';
import useClickOutside from './useClickOutside';
import { useRouter } from 'next/router';

interface Props {}

const Header: React.FC<Props> = () => {
  const [user, setUser] = useState<any>();
  const [showMenu, setShowMenu] = useState(false);
  const hideMenu = useCallback(() => setShowMenu(false), [setShowMenu]);
  const ref = useClickOutside(hideMenu, !showMenu);
  const router = useRouter();

  useEffect(() => {
    if (user || !localStorage.getItem('token')) {
      return;
    }
    API.accountDetails()
      .then(({ data }) => setUser(data))
      .catch(() => {});
  }, [router.pathname, user]);

  const onLogout = () => {
    setShowMenu(false);
    setUser(null);
    router.push('/');
    localStorage.removeItem('token');
  };

  const links = [
    { to: '/account', name: 'Account' },
    { to: '/account/settings', name: 'Settings' },
    { to: `/${user && user.permalink}`, name: 'My Page' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={cn(styles.userButton, styles.logoButton)}>
          <img className={styles.logo} src="/static/logo.png" alt="" />
          PayMate
        </a>
      </Link>
      {user && (
        <div className={styles.user} ref={ref}>
          <button
            className={styles.userButton}
            onClick={() => setShowMenu(!showMenu)}
          >
            {user.name}
          </button>
          {showMenu && (
            <ul className={styles.menu}>
              {links.map(({ to, name }) => (
                <li key={to}>
                  <Link href={to}>
                    <a className={styles.userButton} onClick={hideMenu}>
                      {name}
                    </a>
                  </Link>
                </li>
              ))}
              <li>
                <button className={styles.userButton} onClick={onLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
