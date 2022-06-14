import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as API from '../../api';
import styles from './App.module.scss';
import Provider from '../../components/Provider';
import Loading from '../../components/Loading';
import usePageTitle from '../../hooks/usePageTitle';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

function App({ user: initialUser, error: initialError }) {
  const {
    query: { permalink, amount },
  } = useRouter();
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState(initialError);
  useEffect(() => {
    if (!permalink || user) {
      return;
    }
    API.getUser(permalink as string)
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
      <Head>
        <title>PayMate - Pay {user.name}</title>
      </Head>
      <section>
        <h1 className={styles.title}>Pay {user.name}</h1>
        {user.providers.map(provider => (
          <Provider key={provider.name} {...provider} amount={amount} />
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { data } = await API.getUser(context.params.permalink as string);
    return { props: { user: data } };
  } catch (err) {
    return { props: { error: err.response.data.message } };
  }
};

export default App;
