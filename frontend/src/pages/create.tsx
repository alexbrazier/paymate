import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PageTitle from '../components/PageTitle';
import AuthForm from '../components/AuthForm';
import * as API from '../api';

const permalinkPattern = /^[a-z]+\d{0,3}$/;

const CreatePage = () => {
  const [permalink, setPermalink] = useState('');
  const [availablePermalink, setAvailablePermalink] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const normalizedPermalink = permalink.trim().toLowerCase();
  const registerRedirect = `/account/setup?permalink=${encodeURIComponent(
    availablePermalink
  )}`;

  const checkPermalink = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setAvailablePermalink('');

    if (
      normalizedPermalink.length < 4 ||
      normalizedPermalink.length > 30 ||
      !permalinkPattern.test(normalizedPermalink)
    ) {
      setError('Use 4-30 lowercase letters, with up to 3 numbers at the end.');
      return;
    }

    setChecking(true);
    try {
      const { data } = await API.checkPermalink(normalizedPermalink);

      if (data.available) {
        setAvailablePermalink(normalizedPermalink);
      } else {
        setError('That PayMate link is already taken.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not check that link.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <PageTitle
        title="Create your PayMate page"
        description="Claim your PayMate.me shortlink and register to create a clean page for your preferred payment providers."
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.9fr 1fr' },
          gap: 4,
          alignItems: 'start',
        }}
      >
        <Box sx={{ pt: { md: 4 } }}>
          <Chip
            icon={<LinkOutlinedIcon />}
            label="Create your page"
            color="secondary"
            variant="outlined"
          />
          <Typography variant="h1" sx={{ mt: 2, mb: 2 }}>
            Claim your PayMate link first.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18 }}>
            Pick the shortlink you want people to use, then register to finish
            creating your page.
          </Typography>
        </Box>

        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 24px 60px rgba(23, 32, 51, 0.1)',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Chip label="Step 1" size="small" color="primary" />
              <Typography variant="h3">Choose your shortlink</Typography>
            </Stack>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {availablePermalink && (
              <Alert
                severity="success"
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                sx={{ mb: 2 }}
              >
                paymate.me/{availablePermalink} is available.
              </Alert>
            )}
            <form onSubmit={checkPermalink}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Shortlink"
                  value={permalink}
                  onChange={(e) => {
                    setPermalink(e.target.value.toLowerCase());
                    setAvailablePermalink('');
                    setError('');
                  }}
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
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={checking || !normalizedPermalink}
                  sx={{ minWidth: 150 }}
                >
                  {checking ? 'Checking' : 'Check'}
                </Button>
              </Stack>
            </form>
          </Paper>

          {availablePermalink && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Chip label="Step 2" size="small" color="primary" />
                <Typography variant="h3">Register next</Typography>
              </Stack>
              <AuthForm bare redirectTo={registerRedirect} />
            </Paper>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default CreatePage;
