import React from 'react';
import Head from 'next/head';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.scss';
import PageTitle from '../components/PageTitle';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e4423f',
      dark: '#bd2f2d',
    },
    secondary: {
      main: '#0f8f8f',
      dark: '#0b6666',
    },
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#5d6678',
    },
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
    h1: {
      fontSize: 'clamp(2.6rem, 6vw, 4.6rem)',
      lineHeight: 1.02,
      fontWeight: 800,
      letterSpacing: 0,
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: 1.1,
      fontWeight: 800,
      letterSpacing: 0,
    },
    h3: {
      fontSize: '1.35rem',
      lineHeight: 1.2,
      fontWeight: 750,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          minHeight: 44,
        },
        contained: {
          boxShadow: '0 10px 22px rgba(228, 66, 63, 0.18)',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

// @ts-ignore
const App = ({ Component, pageProps }) => {
  return (
    <div id="root">
      <Head>
        <meta name="application-name" content="PayMate" />
        <meta name="apple-mobile-web-app-title" content="PayMate" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'PayMate',
              url: 'https://paymate.me',
              description:
                'Create one PayMate.me link for the payment providers you already use.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://paymate.me/{search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>
      <PageTitle />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
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
      </StyledEngineProvider>
    </div>
  );
};

export default App;
