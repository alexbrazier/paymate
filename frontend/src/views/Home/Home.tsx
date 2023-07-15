import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import {
  Button,
  Typography,
  Alert,
  TextField,
  Container,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import OneIcon from '@mui/icons-material/LooksOne';
import TwoIcon from '@mui/icons-material/LooksTwo';
import ThreeIcon from '@mui/icons-material/Looks3';
import { ButtonLink } from '../../components/Button';
import * as API from '../../api';
import Loading from '../../components/Loading';
import Link from '../../components/Link';
import Provider from '../../components/Provider/Provider';
import { useRouter } from 'next/router';

const Home: React.FC = ({ providers }: any) => {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [urlEntry, setUrlEntry] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    API.accountDetails()
      .then(({ data }) => setUser(data))
      .catch(() => {})
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Container className={styles.home} maxWidth="md">
        {user ? (
          <>
            <Typography variant="h1">PayMate.me</Typography>

            <p>Welcome back {user.name}</p>
            <ButtonLink className={styles.returningButton} to="/account">
              View Account
            </ButtonLink>
            <ButtonLink
              className={styles.returningButton}
              to={`/${user.permalink}`}
            >
              View personal payment page
            </ButtonLink>
          </>
        ) : (
          <>
            <Typography variant="h1" sx={{ fontSize: '3rem' }}>
              Introducing PayMate.me
            </Typography>
            <Typography
              variant="subtitle1"
              sx={(theme) => ({ color: theme.palette.grey[500] })}
            >
              A simple way to get paid by friends and family
            </Typography>
            <Typography sx={{ mt: 3, fontSize: 18 }}>
              Pay or get paid by sharing a link with friends and family and
              consolidate all of your payment methods in one place. PayMate.me
              allows you to create a personal payment page with links to your
              preferred payment methods.
            </Typography>
            <Alert variant="outlined" severity="info" sx={{ my: 2 }}>
              PayMate.me only provides links to payment providers. The site does
              not process any payments itself.
            </Alert>
            <Typography sx={{ fontWeight: 'bold', mt: 2 }}>
              Enter username to send money to:
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/${urlEntry}`);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <TextField
                  value={urlEntry}
                  onChange={(e) => setUrlEntry(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Typography
                        variant="subtitle1"
                        sx={(theme) => ({
                          color: theme.palette.text.secondary,
                          fontWeight: 'bold',
                          mr: 0.5,
                        })}
                      >
                        paymate.me/
                      </Typography>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  sx={{ ml: 2 }}
                  type="submit"
                >
                  Pay
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h2" sx={{ mt: 5, textAlign: 'center' }}>
              Supported Providers
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              {providers.map((provider: any) => (
                <Provider
                  key={provider._id}
                  icon={provider.icon}
                  name={provider.name}
                />
              ))}
            </Box>
          </>
        )}
      </Container>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.secondary.dark,
          width: '100%',
          p: 5,
          py: 10,
        })}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
            Get your PayMate.Me link today
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/login"
            fullWidth
            LinkComponent={Link}
          >
            Login or Register
          </Button>
        </Container>
      </Box>

      <Box
        sx={{
          p: 5,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
            How it works
          </Typography>

          <Box
            sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Paper sx={{ p: 3, textAlign: 'center', m: 2, width: 300 }}>
              <OneIcon sx={{ fontSize: 50 }} color="secondary" />
              <Typography variant="h3" sx={{ mb: 2 }}>
                Create a PayMate.me link
              </Typography>
              <Typography>
                Choose a url for your personal payment page.
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, textAlign: 'center', m: 2, width: 300 }}>
              <TwoIcon sx={{ fontSize: 50 }} color="secondary" />
              <Typography variant="h3" sx={{ mb: 2 }}>
                Add your payment methods
              </Typography>
              <Typography>
                Add your payment methods depending on which providers/banks you
                use.
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, textAlign: 'center', m: 2, width: 300 }}>
              <ThreeIcon sx={{ fontSize: 50 }} color="secondary" />
              <Typography variant="h3" sx={{ mb: 2 }}>
                Share your PayMate.me link
              </Typography>
              <Typography>
                Share your link with friends and family to get paid via any of
                your payment methods.
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
