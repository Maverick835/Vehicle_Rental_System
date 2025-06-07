import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <DirectionsCarIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Vehicle Rental System
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Find and rent your perfect vehicle with ease
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/vehicles"
              size="large"
            >
              Browse Vehicles
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/register"
              size="large"
            >
              Create Account
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 