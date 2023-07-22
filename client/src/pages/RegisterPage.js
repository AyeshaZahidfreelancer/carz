import { Helmet } from 'react-helmet-async';
// sections
import Register from '../sections/auth/Register';
// import Register from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Register</title>
      </Helmet>

      <Register />
    </>
  );
}
