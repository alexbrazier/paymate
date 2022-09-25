import React, { useEffect, useState } from 'react';
import { verifyToken } from '../../api';
import Loading from '../../components/Loading';
import Router, { useRouter } from 'next/router';

const LoginCallback = () => {
  const router = useRouter();
  const token = router.query.token as string;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) {
      return setError('Token is required');
    }

    verifyToken(token)
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        setSuccess(true);
      })
      .catch((err) => setError(err.response.data.message));
  }, [token]);
  if (success) {
    Router.push('/account');
    return null;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return <Loading />;
};
export default LoginCallback;
