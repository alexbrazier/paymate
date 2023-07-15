import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Alert, Button, Typography } from '@mui/material';
import * as API from '../../api';
import styles from './App.module.scss';
import Provider from '../../components/Provider';
import Loading from '../../components/Loading';
import { GetServerSideProps } from 'next';
import PageTitle from '../../components/PageTitle';
import Link from '../../components/Link';

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
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Alert severity="error">{error}</Alert>
        <Button
          LinkComponent={Link}
          href="/"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Go back
        </Button>
      </Container>
    );
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
        {user.providers.length === 0 && (
          <Typography>This page has not been set up yet.</Typography>
        )}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { data } = await API.getUser(context.params.permalink as string);
    return { props: { user: data, amount: context.params.amount || null } };
  } catch (err) {
    return { props: { error: err.response.data.message } };
  }
};

export default App;
