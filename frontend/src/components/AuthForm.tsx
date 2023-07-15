import React, { useState } from 'react';
import { Paper, TextField, Button, Box, Divider } from '@mui/material';
import { api } from '../api';

const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<'password' | 'register' | 'magicLink'>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const checkEmail = async () => {
    setLoading(true);
    const { data } = await api.get('/auth/check', { params: { email } });
    setState(
      data.exists ? (data.password ? 'password' : 'magicLink') : 'register'
    );

    if (data.exists && !data.password) {
      await api.post('/auth/login', { email });
    }
    setLoading(false);
  };

  const emailEntered = state === 'password' || state === 'register';

  return (
    <Paper sx={{ p: 3, width: 500, maxWidth: '100%', mt: 2 }}>
      {state === 'magicLink' ? (
        <>
          <p e2e-handle="email-sent">A login email has been sent to {email}.</p>
          <Button onClick={() => setState(undefined)}>
            Not received an email? Retry
          </Button>
        </>
      ) : (
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!state) {
              checkEmail();
            } else if (state === 'password') {
              api.post('/auth/login/password', { email, password });
            } else if (state === 'register') {
              api.post('/auth/register', { email, password });
            }
          }}
        >
          <Box display="flex">
            <TextField
              name="email"
              sx={{ my: 1, flex: 1 }}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailEntered}
            />
            {emailEntered && (
              <Button
                onClick={() => setState(undefined)}
                sx={{ alignSelf: 'center' }}
              >
                change
              </Button>
            )}
          </Box>
          {emailEntered && (
            <TextField
              name="password"
              type="password"
              sx={{ my: 1 }}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {state === 'register'
              ? 'Register'
              : state === 'password'
              ? 'Login'
              : 'Continue'}
          </Button>
          {emailEntered && (
            <>
              <Divider sx={{ my: 2 }}>or</Divider>
              <Button
                onClick={async () => {
                  setLoading(true);
                  await api.post('/auth/login', { email });
                  setState('magicLink');
                  setLoading(false);
                }}
              >
                Email magic login link
              </Button>
            </>
          )}
        </form>
      )}
    </Paper>
  );
};

export default AuthForm;
