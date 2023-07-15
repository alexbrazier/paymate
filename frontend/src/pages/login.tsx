import React from 'react';
import { Container, Typography } from '@mui/material';
import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <Container
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 25 }}>
        Login or Register
      </Typography>

      <AuthForm />
    </Container>
  );
};

export default Login;
