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
  },
  typography: {
    button: {
      textTransform: 'none',
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
            width: '90%',
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
