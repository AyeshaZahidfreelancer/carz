import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/RegisterPage')));

export const DashboardPage = Loadable(lazy(() => import('../pages/dashboard/DashboardPage')));

export const CategoryListPage = Loadable(lazy(() => import('../pages/category/CategoryListPage')));

export const CarListPage = Loadable(lazy(() => import('../pages/car/CarListPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
