import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import { Container } from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as API from '../../api';
import Provider from '../../components/Provider';
import { ButtonLink } from '../../components/Button';
import Loading from '../../components/Loading';
import styles from './Account.module.scss';
import PageTitle from '../../components/PageTitle';

const pressDelay = { delay: 100, tolerance: 5 };

const SortableProvider = ({ provider, justDragged }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: provider._id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
        position: 'relative',
      }}
      {...attributes}
      {...listeners}
      // Don't follow the provider link when releasing a drag
      onClickCapture={(e) => {
        if (justDragged.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Provider
        icon={provider.icon}
        name={provider.name}
        to={`/account/provider/${provider._id}`}
      />
    </li>
  );
};

const SortableList = ({ items, onSortEnd }) => {
  const justDragged = useRef(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: pressDelay }),
    useSensor(TouchSensor, { activationConstraint: pressDelay }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setTimeout(() => {
      justDragged.current = false;
    });
    if (!over || active.id === over.id) {
      return;
    }
    const ids = items.map((item) => item._id);
    onSortEnd({
      oldIndex: ids.indexOf(active.id),
      newIndex: ids.indexOf(over.id),
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={() => {
        justDragged.current = true;
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        justDragged.current = false;
      }}
    >
      <SortableContext
        items={items.map((item) => item._id)}
        strategy={rectSortingStrategy}
      >
        <ul className={styles.items}>
          {items.map((provider) => (
            <SortableProvider
              key={provider._id}
              provider={provider}
              justDragged={justDragged}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

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
      <PageTitle title="Account" noindex />
      <h1>Account</h1>
      <p>
        Select a provider to edit details or remove, click the add button to add
        a new one, or drag and drop to reorder.
      </p>
      <SortableList items={user.providers} onSortEnd={updateOrder} />

      <ButtonLink className={styles.addButton} to="/account/provider/new">
        Add New
      </ButtonLink>
    </Container>
  );
};
export default Account;
