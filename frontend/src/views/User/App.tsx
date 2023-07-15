import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as API from '../../api';
import styles from './App.module.scss';
import Provider from '../../components/Provider';
import Loading from '../../components/Loading';
import { GetServerSideProps } from 'next';
import PageTitle from '../../components/PageTitle';

function App({ user: initialUser, amount, error: initialError }) {
  const {
    query: { permalink },
  } = useRouter();

  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState(initialError);
  useEffect(() => {
    if (!permalink || user) {
      return;
    }
    API.getUser(permalink as string)
      .then(({ data }) => setUser(data))
      .catch((err) => setError(err.response.data.message));
  }, [permalink]);

  if (error) {
    return <div className={styles.App}>{error}</div>;
  }
  if (!user) {
    return <Loading />;
  }

  return (
    <div className={styles.App}>
      {user.name && <PageTitle title={`Pay ${user.name}`} />}
      <section>
        <h1 className={styles.title}>Pay {user.name}</h1>
        {user.providers.map((provider) => (
          <Provider key={provider.name} {...provider} amount={amount} />
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { data } = await API.getUser(context.params.permalink as string);
    return { props: { user: data, amount: context.params.amount } };
  } catch (err) {
    return { props: { error: err.response.data.message } };
  }
};

export default App;
