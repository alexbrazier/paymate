import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { Button } from '@mui/material';
import { ButtonLink } from '../../components/Button';
import * as API from '../../api';
import Loading from '../../components/Loading';
import Link from '../../components/Link';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    API.accountDetails()
      .then(({ data }) => setUser(data))
      .catch(() => {})
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className={styles.home}>
      <div className={styles.container}>
        <h1>PayMate</h1>

        {user ? (
          <>
            <p>Welcome back {user.name}</p>
            <ButtonLink className={styles.returningButton} to="/account">
              View Account
            </ButtonLink>
            <ButtonLink
              className={styles.returningButton}
              to={`/${user.permalink}`}
            >
              View personal payment page
            </ButtonLink>
          </>
        ) : (
          <>
            <p>
              Welcome to PayMate.me. You can use this site to register your own
              page using any name you want and provide links so that friends can
              pay you using their preferred method. The site currently supports
              links from PayPal, Monzo, Starling and PingIt.
            </p>
            <Button
              variant="contained"
              size="large"
              href="/login"
              fullWidth
              LinkComponent={Link}
            >
              Login or Register
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
