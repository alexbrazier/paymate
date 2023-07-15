import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Typography, Container } from '@mui/material';
import styles from './AccountDetails.module.scss';
import * as API from '../../../api';
import Loading from '../../../components/Loading';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { api } from '../../../api';
import PageTitle from '../../../components/PageTitle';

interface Props {
  edit: boolean;
}

const Setup: React.FC<Props> = ({ edit }) => {
  const [name, setName] = useState('');
  const [permalink, setPermalink] = useState('');
  const [email, setEmail] = useState('');
  const [changePasswordSet, setChangePasswordSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState();
  const router = useRouter();
  useEffect(() => {
    API.accountDetails()
      .then(({ data }) => {
        setName(data.name);
        setPermalink(data.permalink);
        setEmail(data.email);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const setup = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    API.setDetails({ name, permalink })
      .then(() => setRegistered(true))
      .catch((err) => setError(err.response.data.message));
  };
  if (registered) {
    router.push('/account');
    return null;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PageTitle title="Account Details" />
      {edit && (
        <Breadcrumbs
          breadcrumbs={[{ path: '/account', name: 'Account' }]}
          currentPage="Edit Details"
        />
      )}
      <section className={styles.home}>
        <form
          className={styles.container}
          onSubmit={setup}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <h1>{edit ? 'Edit Details' : 'Create PayMate Page'}</h1>
          {error && <p>{error}</p>}
          {!edit && <p>Pick a username for people to use to send you money</p>}
          <TextField
            label="Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            className={styles.username}
            label="Username"
            id="username"
            value={permalink}
            InputProps={{
              startAdornment: (
                <Typography
                  variant="subtitle1"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    fontWeight: 'bold',
                    mr: 0.5,
                  })}
                >
                  paymate.me/
                </Typography>
              ),
            }}
            onChange={(e) => setPermalink(e.target.value)}
          />
          <Button
            className={styles.button}
            type="submit"
            variant="contained"
            size="large"
          >
            {edit ? 'Save' : 'Create Page'}
          </Button>
          {changePasswordSet ? (
            <Typography>
              We’ve sent an email to {email}. Click the second link to set a new
              password.
            </Typography>
          ) : (
            <Button
              onClick={() => {
                api.post('/auth/login', { email }).then(() => {
                  setChangePasswordSet(true);
                });
              }}
            >
              Change Password
            </Button>
          )}
        </form>
      </section>
    </Container>
  );
};

export default Setup;
