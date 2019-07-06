import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { ButtonLink } from '../../components/Button';
import * as API from '../../api';
import Register from './Register/Register';
import Loading from '../../components/Loading';

const Home: React.FC = () => {
  const [user, setUser] = useState();
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
          <Register />
        )}
      </div>
    </section>
  );
};

export default Home;
