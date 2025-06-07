import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import useApi from '../hooks/useApi';

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await api.get('/rentals');
        setRentals(data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
  }, []);

  const handleCancelRental = async (rentalId) => {
    try {
      await api.put(`/rentals/${rentalId}/cancel`);
      setRentals(rentals.map(rental =>
        rental.id === rentalId ? { ...rental, status: 'cancelled' } : rental
      ));
    } catch (error) {
      console.error('Error cancelling rental:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (api.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (api.error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {api.error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Rentals
      </Typography>

      {rentals.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You have no rentals yet
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>
                    {rental.make} {rental.model}
                  </TableCell>
                  <TableCell>{rental.category}</TableCell>
                  <TableCell>{new Date(rental.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(rental.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>₹{rental.total_price}</TableCell>
                  <TableCell>
                    <Chip
                      label={rental.status}
                      color={getStatusColor(rental.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/vehicles/${rental.vehicle_id}`)}
                      >
                        View Vehicle
                      </Button>
                      {rental.status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancelRental(rental.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Rentals; 