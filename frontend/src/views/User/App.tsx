import React, { useEffect, useState } from 'react';
import * as API from '../../api';
import styles from './App.module.scss';
import Provider from '../../components/Provider';
import Loading from '../../components/Loading';
import usePageTitle from '../../hooks/usePageTitle';

function App({
  match: {
    params: { permalink, amount },
  },
}) {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    if (!permalink) {
      return;
    }
    API.getUser(permalink)
      .then(({ data }) => setUser(data))
      .catch(err => setError(err.response.data.message));
  }, [permalink]);

  usePageTitle(user ? `Pay ${user.name}` : undefined);

  if (error) {
    return <div className={styles.App}>{error}</div>;
  }
  if (!user) {
    return <Loading />;
  }

  return (
    <div className={styles.App}>
      <section>
        <h1 className={styles.title}>Pay {user.name}</h1>
        {user.providers.map(provider => (
          <Provider key={provider.name} {...provider} amount={amount} />
        ))}
      </section>
    </div>
  );
}

export default App;
