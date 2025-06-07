import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleRent = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setError('End date must be after start date');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to remove time part

    if (startDate < today || endDate < today) {
    setError('Start and end dates cannot be in the past');
    return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalPrice = days * vehicle.price_per_day;

      await axios.post('http://localhost:5000/api/rentals', {
        user_id: user.id,
        vehicle_id: vehicle.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_price: totalPrice,
      });

      setSuccess('Vehicle rented successfully!');
      setTimeout(() => {
        navigate('/rentals');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  if (!vehicle) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={`https://source.unsplash.com/random/800x600/?${vehicle.type}`}
              alt={vehicle.make}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {vehicle.make} {vehicle.model}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Year: {vehicle.year}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Type: {vehicle.type}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Price: ₹{vehicle.price_per_day}/day
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Box sx={{ mt: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={setEndDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 4 }}
                  onClick={handleRent}
                >
                  Rent Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VehicleDetails; 