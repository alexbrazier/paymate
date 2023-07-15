import React from 'react';
import Head from 'next/head';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.scss';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ea4442',
    },
    secondary: {
      main: '#42E8EA',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '1.75rem',
    },
  },
});

// @ts-ignore
const App = ({ Component, pageProps }) => {
  return (
    <div id="root">
      <Head>
        <title>PayMate - Send money instantly through a link</title>
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            margin: 15,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Component {...pageProps} />
        </main>
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default App;
