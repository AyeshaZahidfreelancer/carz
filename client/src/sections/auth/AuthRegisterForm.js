import { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, Button } from '@mui/material';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { registerUserRequest, clearError, clearMessage } from '../../actions/auth';
// routes
import { PATH_AUTH } from '../../routes/paths';

// ----------------------------------------------------------------------

const AuthRegisterForm = ({ Auth: { error, message }, registerUser, clrError, clrMessage }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message);
      navigate(PATH_AUTH.login, { replace: true });
    }

    // eslint-disable-next-line
  }, [message]);

  useEffect(
    () => () => {
      clrMessage();
      clrError();
    },
    // eslint-disable-next-line
    []
  );

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    fullName: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    registerUser({ full_name: data.fullName, email: data.email });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!error && <Alert severity="error">{error}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="fullName" label="Full name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Create account
        </Button>
      </Stack>
    </FormProvider>
  );
};

AuthRegisterForm.propTypes = {
  Auth: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired,
  clrError: PropTypes.func.isRequired,
  clrMessage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  registerUser: registerUserRequest,
  clrError: clearError,
  clrMessage: clearMessage,
})(memo(AuthRegisterForm));
