import React, { useState, useReducer } from 'react';
import styles from '../Home.module.scss';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import * as API from '../../../api';

interface State {
  loading: boolean;
  error: boolean | string;
  success: boolean;
}

const actions = {
  LOGIN: 'LOGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN_RETRY: 'LOGIN_RETRY',
  LOGIN_REDIRECT: 'LOGIN_REDIRECT',
};
const initialState = {
  loading: false,
  error: false,
  success: false,
};
const reducer = (
  state: State,
  { type, payload }: { type: string; payload?: any }
): State => {
  switch (type) {
    case actions.LOGIN:
      return { ...state, loading: true };
    case actions.LOGIN_SUCCESS:
      return { ...state, loading: false, success: true };
    case actions.LOGIN_FAILURE:
      return { ...state, loading: false, error: payload };
    case actions.LOGIN_RETRY:
      return { ...state, loading: false, error: false, success: false };
    default:
      return state;
  }
};

const Register: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [email, setEmail] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: actions.LOGIN });
    API.login(email)
      .then(() => dispatch({ type: actions.LOGIN_SUCCESS }))
      .catch(err =>
        dispatch({ type: actions.LOGIN_FAILURE, payload: err.message })
      );
  };
  if (state.success) {
    return (
      <>
        <p>A login email has been sent to {email}.</p>
        <Button onClick={() => dispatch({ type: actions.LOGIN_RETRY })}>
          Not received an email? Retry
        </Button>
      </>
    );
  }
  return (
    <form onSubmit={submit}>
      <p>
        Enter your email below to setup or modify your personal payment page.
      </p>
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onValue={setEmail}
      />
      <Button className={styles.button} disabled={state.loading}>
        Access My Page
      </Button>
    </form>
  );
};

export default Register;
