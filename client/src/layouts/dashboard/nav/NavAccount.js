import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

function NavAccount({ Auth: { user } }) {
  return (
    <StyledRoot>
      <CustomAvatar src="" alt={user.full_name} name={user.full_name} />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {user.full_name}
        </Typography>
      </Box>
    </StyledRoot>
  );
}

NavAccount.propTypes = {
  Auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(NavAccount);
