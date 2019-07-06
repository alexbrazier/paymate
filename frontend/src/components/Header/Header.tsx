import React, { useState, useEffect, useCallback } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import cn from 'classnames';
import * as API from '../../api';
import logo from '../../assets/logo.png';
import styles from './Header.module.scss';
import useClickOutside from './useClickOutside';

interface Props extends RouteComponentProps {}

const Header: React.FC<Props> = ({ history, location: { pathname } }) => {
  const [user, setUser] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const hideMenu = useCallback(() => setShowMenu(false), [setShowMenu]);
  const ref = useClickOutside(hideMenu, !showMenu);

  useEffect(() => {
    if (user || !localStorage.getItem('token')) {
      return;
    }
    API.accountDetails()
      .then(({ data }) => setUser(data))
      .catch(() => {});
  }, [pathname, user]);

  const onLogout = () => {
    setShowMenu(false);
    setUser(null);
    history.push('/');
    localStorage.removeItem('token');
  };

  const links = [
    { to: '/account', name: 'Account' },
    { to: '/account/settings', name: 'Settings' },
    { to: `/${user && user.permalink}`, name: 'My Page' },
  ];

  return (
    <header className={styles.header}>
      <Link to="/" className={cn(styles.userButton, styles.logoButton)}>
        <img className={styles.logo} src={logo} alt="" />
        PayMate
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
                  <Link
                    to={to}
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
      )}
    </header>
  );
};

export default withRouter(Header);
