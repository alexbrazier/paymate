import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.scss';

// @ts-ignore
const App = ({ Component, pageProps }) => {
  return (
    <div id="root">
      <Head>
        <title>PayMate - Send money instantly through a link</title>
      </Head>
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
    </div>
  );
};

export default App;
