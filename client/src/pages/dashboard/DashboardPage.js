import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
// Mui
import { Container, Grid, Stack, Button, useMediaQuery } from '@mui/material';
// Path
import { PATH_DASHBOARD, PATH_AUTH } from '../../routes/paths';
// Components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Dashboard from '../../components/dashboard/dashboard';
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// action
import { getTotalCarRequest, clearError } from '../../actions/car';

function DashboardPage({
  Auth: { isAuthenticated },
  Car: { totalCar, error },
  getTotalCar,
  clrError,
}) {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [totalCarNo, setTotalCarNo] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (totalCar === null) {
      getTotalCar();
    } else {
      setTotalCarNo(totalCar);
    }

    // eslint-disable-next-line
  }, [isAuthenticated, totalCar]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error);
      clrError();
    }
    // eslint-disable-next-line
  }, [error]);

  const sliderRef = useRef();
  const handleNext = () => {
    sliderRef.current.slickNext();
  };
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };
  // Use media queries to determine the number of slides to show
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const mediumScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  // Set the number of slides to show based on media queries
  const slidesToShow = smallScreen ? 2 : mediumScreen ? 3 : 4;
  // Custom component for the hidden navigation arrow
  const HiddenArrow = () => <div style={{ visibility: 'hidden' }} />;
  // Configuration for the carousel
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    prevArrow: <HiddenArrow />, // Hide the previous arrow
    nextArrow: <HiddenArrow />, // Hide the next arrow
  };
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Dashboard"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }]}
          sx={{ mb: 3.5 }}
        />
        {/* Navigation arrows */}
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
          <Button
            color="info"
            variant="soft"
            onClick={handlePrev}
            sx={{ p: '0px, 0px', minWidth: '6px' }}
          >
            <Iconify icon="ic:twotone-arrow-left" />
          </Button>
          <Button
            color="info"
            variant="soft"
            onClick={handleNext}
            sx={{ p: '0px, 0px', minWidth: '6px' }}
          >
            <Iconify icon="ic:twotone-arrow-right" />
          </Button>
        </Stack>
        <Slider ref={sliderRef} {...carouselSettings}>
          {totalCarNo.map((car, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Dashboard name={car.name || null} totalCars={car.totalCars || null} />
            </Grid>
          ))}
        </Slider>
      </Container>
    </>
  );
}

DashboardPage.propTypes = {
  Auth: PropTypes.object.isRequired,
  Car: PropTypes.object.isRequired,
  getTotalCar: PropTypes.func.isRequired,
  clrError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Car: state.Car,
});

export default connect(mapStateToProps, {
  getTotalCar: getTotalCarRequest,
  clrError: clearError,
})(DashboardPage);
