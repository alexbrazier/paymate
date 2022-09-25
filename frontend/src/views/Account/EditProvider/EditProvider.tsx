import React, { useEffect, useState, Fragment } from 'react';
import * as API from '../../../api';
import Provider from '../../../components/Provider';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Loading from '../../../components/Loading';
import usePageTitle from '../../../hooks/usePageTitle';
import styles from './EditProvider.module.scss';
import { useRouter } from 'next/router';

interface Props {}

const EditProvider: React.FC<Props> = () => {
  usePageTitle('Edit Provider');
  const [provider, setProvider] = useState();
  const [permalink, setPermalink] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState();
  const router = useRouter();
  const params = router.query;
  useEffect(() => {
    if (!router.isReady) return;
    API.getUserProvider(params.provider as string)
      .then(({ data }) => {
        setPermalink(data.provider.permalink || '');
        setProvider(data.provider);
      })
      .catch((err) => setError(err.response.data.message));
  }, [params.provider]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    API.saveProvider(params.provider as string, permalink)
      .then(() => setSaved(true))
      .catch((err) => setError(err.response.data.message));
  };
  const remove = () => {
    API.removeProvider(params.provider as string)
      .then(() => setSaved(true))
      .catch((err) => setError(err.response.data.message));
  };
  if (saved) {
    router.push('/account');
    return null;
  }
  if (error && !provider) {
    return <p>{error}</p>;
  }
  if (!provider) {
    return <Loading />;
  }
  return (
    <Fragment>
      <Breadcrumbs
        breadcrumbs={[{ path: '/account', name: 'Account' }]}
        currentPage={`Edit ${provider.name}`}
      />
      <form onSubmit={save}>
        <h1 className={styles.header}>{provider.name}</h1>
        {error && <p>{error}</p>}
        <Provider icon={provider.icon} name={provider.name} />
        <Input
          value={permalink}
          onValue={setPermalink}
          placeholder="Username"
        />
        <Button className={styles.save} type="submit">
          Save
        </Button>
        <Button onClick={remove} className={styles.save}>
          Delete
        </Button>
      </form>
    </Fragment>
  );
};

export default EditProvider;
