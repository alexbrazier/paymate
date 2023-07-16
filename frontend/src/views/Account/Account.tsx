import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { Container } from '@mui/material';
import * as API from '../../api';
import Provider from '../../components/Provider';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ButtonLink } from '../../components/Button';
import Loading from '../../components/Loading';
import styles from './Account.module.scss';
import PageTitle from '../../components/PageTitle';

const SortableProvider: any = SortableElement((props: any) => (
  <li tabIndex={0}>
    <Provider {...props} />
  </li>
));

const SortableList = SortableContainer(({ items }: any) => (
  <ul className={styles.items}>
    {items.map((provider, index) => (
      <SortableProvider
        key={index}
        index={index}
        icon={provider.icon}
        name={provider.name}
        to={`/account/provider/${provider._id}`}
      />
    ))}
  </ul>
));

const Account = () => {
  const [user, setUser] = useState<any>();
  const [error, setError] = useState();
  useEffect(() => {
    API.accountDetails()
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err) => setError(err.response.data.message));
  }, []);
  const updateOrder = ({ oldIndex, newIndex }) => {
    const oldProviders = [...user.providers];
    const providers = [...oldProviders];
    const item = providers.splice(oldIndex, 1)[0];
    providers.splice(newIndex, 0, item);
    const newUser = { ...user, providers };
    setUser(newUser);
    API.updateProviderOrder(item._id, oldIndex, newIndex).catch((err) => {
      setUser({ ...user, providers: oldProviders });
      setError(err.response.data.message);
    });
  };
  if (error) {
    Router.push(`/?error=${error}`);
    return null;
  }
  if (!user) {
    return <Loading />;
  }
  if (!user.permalink) {
    Router.push('/account/setup');
    return null;
  }
  return (
    <Container>
      <PageTitle title="Account" />
      <h1>Account</h1>
      <p>
        Select a provider to edit details or remove, click the add button to add
        a new one, or drag and drop to reorder.
      </p>
      {
        <SortableList
          // @ts-ignore
          items={user.providers}
          axis="xy"
          pressDelay={100}
          onSortEnd={updateOrder}
        />
      }
      <ButtonLink className={styles.addButton} to="/account/provider/new">
        Add New
      </ButtonLink>
    </Container>
  );
};
export default Account;
