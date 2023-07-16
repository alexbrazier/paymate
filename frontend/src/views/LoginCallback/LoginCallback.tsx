import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import { verifyToken } from '../../api';
import Loading from '../../components/Loading';
import Router, { useRouter } from 'next/router';

const LoginCallback = () => {
  const router = useRouter();
  const token = router.query.token as string;
  const enableSetPassword = router.query.setPassword === '1';
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!router.isReady || enableSetPassword) return;
    if (!token) {
      return setError('Token is required');
    }

    verifyToken(token)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => setError(err.response.data.message));
  }, [token, enableSetPassword]);
  if (success) {
    Router.push('/account');
    return null;
  }
  if (error) {
    return <p>{error}</p>;
  }

  if (enableSetPassword) {
    return (
      <Container>
        <Paper sx={{ maxWidth: 500, margin: 'auto', p: 3 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: 25, textAlign: 'center', mb: 3 }}
          >
            Set Password
          </Typography>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onSubmit={(e) => {
              e.preventDefault();
              verifyToken(token, password)
                .then(() => {
                  setSuccess(true);
                })
                .catch((err) => setError(err.response.data.message));
            }}
          >
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              autoComplete="new-password"
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button variant="contained" type="submit" fullWidth size="large">
              Change Password
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }

  return <Loading />;
};
export default LoginCallback;
