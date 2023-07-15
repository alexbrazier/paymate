import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@mui/material';
import Link from '../Link';
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
      <Link href="/" className={cn(styles.userButton, styles.logoButton)}>
        <img className={styles.logo} src="/logo.png" alt="" />
        PayMate
      </Link>
      {user ? (
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
                  <Link
                    href={to}
                    className={styles.userButton}
                    onClick={hideMenu}
                  >
                    {name}
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
      ) : (
        <Button
          variant="contained"
          href="/login"
          sx={{ my: 1, mr: 2 }}
          LinkComponent={Link}
        >
          Login or Register
        </Button>
      )}
    </header>
  );
};

export default Header;
