import React, { useState, useEffect, Fragment } from 'react';
import { Redirect } from 'react-router';
import styles from './AccountDetails.module.scss';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import * as API from '../../../api';
import Loading from '../../../components/Loading';
import Breadcrumbs from '../../../components/Breadcrumbs';
import usePageTitle from '../../../hooks/usePageTitle';

interface Props {
  edit: boolean;
}

const Setup: React.FC<Props> = ({ edit }) => {
  usePageTitle('Account Details');
  const [name, setName] = useState('');
  const [permalink, setPermalink] = useState('');
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    API.accountDetails()
      .then(({ data }) => {
        setName(data.name);
        setPermalink(data.permalink);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const setup = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    API.setDetails({ name, permalink })
      .then(() => setRegistered(true))
      .catch(err => setError(err.response.data.message));
  };
  if (registered) {
    return <Redirect to="/account" />;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      {edit && (
        <Breadcrumbs
          breadcrumbs={[{ path: '/account', name: 'Account' }]}
          currentPage="Edit Details"
        />
      )}
      <section className={styles.home}>
        <form className={styles.container} onSubmit={setup}>
          <h1>{edit ? 'Edit Details' : 'Create PayMate Page'}</h1>
          {error && <p>{error}</p>}
          {!edit && <p>Pick a username for people to use to send you money</p>}
          <Input placeholder="Name" id="name" value={name} onValue={setName} />
          <Input
            className={styles.username}
            label="paymate.me/"
            placeholder="username"
            id="username"
            value={permalink}
            onValue={setPermalink}
          />
          <Button className={styles.button} type="submit">
            {edit ? 'Save' : 'Register'}
          </Button>
        </form>
      </section>
    </Fragment>
  );
};

export default Setup;
