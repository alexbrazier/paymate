import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import * as API from '../../../api';
import Provider from '../../../components/Provider';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Loading from '../../../components/Loading';
import styles from './NewProvider.module.scss';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/PageTitle';

interface Props {
  match: any;
}
const NewProvider: React.FC<Props> = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [saved, setSaved] = useState();
  const router = useRouter();
  useEffect(() => {
    API.getAvailableProviders()
      .then(({ data }) => setProviders(data.providers))
      .catch((err) => setError(err.response.data.message))
      .then(() => setLoading(false));
  }, []);

  const addProvider = (id) => {
    API.addProvider(id)
      .then(() => setSaved(id))
      .catch((err) => setError(err.response.data.message));
  };
  if (saved) {
    router.push(`/account/provider/${saved}`);
    return null;
  }
  return (
    <Container>
      <PageTitle title="Add Provider" />
      <Breadcrumbs
        breadcrumbs={[{ path: '/account', name: 'Account' }]}
        currentPage="Add Provider"
      />
      <div>
        <h1 className={styles.title}>Add Provider</h1>
        {error && <p>{error}</p>}
        {loading && <Loading />}
        {!loading && !providers.length && (
          <>
            <p>You{"'"}ve already added all of the providers.</p>
            <p>
              <a
                className={styles.suggestNew}
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/alexbrazier/paymate/issues"
              >
                Suggest a new one!
              </a>
            </p>
          </>
        )}
        <div className={styles.providers}>
          {providers.map((p) => (
            <Provider
              key={p.name}
              icon={p.icon}
              name={p.name}
              tabIndex={0}
              onClick={() => addProvider(p._id)}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default NewProvider;
