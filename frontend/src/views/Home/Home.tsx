import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import {
  Button,
  Typography,
  Alert,
  TextField,
  Container,
  Box,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { ButtonLink } from '../../components/Button';
import * as API from '../../api';
import Loading from '../../components/Loading';
import Link from '../../components/Link';
import Provider from '../../components/Provider/Provider';
import { useRouter } from 'next/router';
import PageTitle from '../../components/PageTitle';

const Home: React.FC = ({ providers }: any) => {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [urlEntry, setUrlEntry] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (!API.getTokenInfo()) {
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

  const supportedProviders = providers || [];

  if (user) {
    return (
      <Container className={styles.home} maxWidth="md">
        <Paper className={styles.returningPanel} elevation={0}>
          <Typography variant="overline" color="secondary.dark">
            Welcome back
          </Typography>
          <Typography variant="h1" className={styles.returningTitle}>
            {user.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Manage your payment links or preview the page other people use to
            pay you.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ButtonLink className={styles.returningButton} to="/account">
              View account
            </ButtonLink>
            <ButtonLink
              className={styles.secondaryButton}
              to={`/${user.permalink}`}
            >
              View payment page
            </ButtonLink>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <PageTitle
        title="Get paid your way with one simple link"
        description="Create one PayMate.me link for the payment providers you already use, then share it with friends and family."
      />
      <Box className={styles.heroBand}>
        <Container className={styles.hero} maxWidth="lg">
          <Box className={styles.heroCopy}>
            <Chip
              className={styles.trustChip}
              icon={<VerifiedUserOutlinedIcon />}
              label="Links only, no payment handling"
            />
            <Typography variant="h1" sx={{ mt: 2 }}>
              Get paid your way with one simple link.
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              className={styles.heroSubtitle}
            >
              Create a personal PayMate.me page that brings your preferred
              payment providers together, then share one clean link with friends
              and family.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                href="/login"
                LinkComponent={Link}
              >
                Get your link
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="#pay-someone"
                LinkComponent={Link}
              >
                Pay someone
              </Button>
            </Stack>
            <Box className={styles.trustList}>
              <span>
                <LockOutlinedIcon fontSize="small" /> No card details stored
              </span>
              <span>
                <PaymentsOutlinedIcon fontSize="small" /> Pay via providers you
                already use
              </span>
            </Box>
          </Box>

          <Paper className={styles.trustPanel} elevation={0}>
            <Box className={styles.trustPanelHeader}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Built for confidence
                </Typography>
                <Typography variant="h3">
                  Clear, provider-led payments
                </Typography>
              </Box>
              <CheckCircleOutlineIcon color="secondary" />
            </Box>
            <Box className={styles.trustPanelItems}>
              <Box>
                <LockOutlinedIcon color="secondary" />
                <Typography fontWeight="bold">
                  No payment details collected
                </Typography>
                <Typography color="text.secondary">
                  PayMate does not ask people to enter card or bank details.
                </Typography>
              </Box>
              <Box>
                <PaymentsOutlinedIcon color="secondary" />
                <Typography fontWeight="bold">
                  Provider apps handle the transaction
                </Typography>
                <Typography color="text.secondary">
                  Payment links send people to the services they already use.
                </Typography>
              </Box>
              <Box>
                <VerifiedUserOutlinedIcon color="secondary" />
                <Typography fontWeight="bold">
                  One simple directory page
                </Typography>
                <Typography color="text.secondary">
                  Your page lists payment options without processing money.
                </Typography>
              </Box>
            </Box>
            <Alert
              icon={<LockOutlinedIcon fontSize="inherit" />}
              severity="info"
              sx={{ mt: 2 }}
            >
              PayMate sends people to payment providers. It does not process
              payments.
            </Alert>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg" className={styles.section} id="pay-someone">
        <Paper className={styles.lookupPanel} elevation={0}>
          <Box>
            <Typography variant="h2">Send money to a PayMate link</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Enter a username to open their payment page.
            </Typography>
          </Box>
          <form
            className={styles.lookupForm}
            onSubmit={(e) => {
              e.preventDefault();
              if (urlEntry.trim()) {
                router.push(`/${urlEntry.trim()}`);
              }
            }}
          >
            <TextField
              fullWidth
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
                      whiteSpace: 'nowrap',
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
              type="submit"
              disabled={!urlEntry.trim()}
            >
              Pay
            </Button>
          </form>
        </Paper>
      </Container>

      <Container maxWidth="lg" className={styles.section}>
        <Box className={styles.sectionHeading}>
          <Typography variant="h2">How it works</Typography>
          <Typography color="text.secondary">
            A simple directory page for your payment options.
          </Typography>
        </Box>

        <Box className={styles.steps}>
          <Paper className={styles.stepCard} elevation={0}>
            <LinkOutlinedIcon color="secondary" />
            <Typography variant="h3">Choose your link</Typography>
            <Typography color="text.secondary">
              Pick a PayMate.me username that is easy to share and remember.
            </Typography>
          </Paper>
          <Paper className={styles.stepCard} elevation={0}>
            <AccountBalanceWalletOutlinedIcon color="secondary" />
            <Typography variant="h3">Add payment methods</Typography>
            <Typography color="text.secondary">
              Connect people to the providers or banks you already prefer.
            </Typography>
          </Paper>
          <Paper className={styles.stepCard} elevation={0}>
            <VerifiedUserOutlinedIcon color="secondary" />
            <Typography variant="h3">Share with confidence</Typography>
            <Typography color="text.secondary">
              People choose where to pay, and PayMate stays out of the
              transaction.
            </Typography>
          </Paper>
        </Box>
      </Container>

      <Box className={styles.providerBand}>
        <Container maxWidth="lg">
          <Box className={styles.sectionHeading}>
            <Typography variant="h2">Supported providers</Typography>
            <Typography color="text.secondary">
              Keep the apps people already trust one click away.
            </Typography>
          </Box>
          <Box className={styles.providers}>
            {supportedProviders.map((provider: any) => (
              <Paper className={styles.providerCard} key={provider._id}>
                <Provider icon={provider.icon} name={provider.name} />
                <Typography className={styles.providerName}>
                  {provider.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      <Box className={styles.ctaBand}>
        <Container maxWidth="md" className={styles.ctaContent}>
          <Typography variant="h2">
            Create a payment page people can trust.
          </Typography>
          <Typography>
            Get a clean link for your preferred providers without asking anyone
            to enter payment details on PayMate.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/login"
            LinkComponent={Link}
          >
            Login or register
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;
