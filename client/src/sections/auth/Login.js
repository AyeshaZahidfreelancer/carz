import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Typography, Link } from '@mui/material';

// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to Buggaz</Typography>
      </Stack>

      <Stack direction="row" spacing={1} marginBottom={1}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} to={PATH_AUTH.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack>

      <AuthLoginForm />
    </LoginLayout>
  );
}
