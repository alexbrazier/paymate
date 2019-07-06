import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import qs from 'qs';
import { verifyToken } from '../../api';
import Loading from '../../components/Loading';

const LoginCallback = ({ location: { search } }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const { token } = qs.parse(search, { ignoreQueryPrefix: true });
    if (!token) {
      return setError('Token is required');
    }

    verifyToken(token)
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        setSuccess(true);
      })
      .catch(err => setError(err.response.data.message));
  }, [search]);
  if (success) {
    return <Redirect to="/account" />;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return <Loading />;
};
export default LoginCallback;
