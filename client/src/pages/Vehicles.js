import React, { useState, useCallback, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create a memoized vehicle card component
const VehicleCard = React.memo(({ vehicle, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);
  
  // Reset imgError when the imageUrl changes
  useEffect(() => {
    setImgError(false);
  }, [vehicle.image_url]);

  // Construct the correct image path
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return '/images/vehicles/placeholder.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Remove any existing /images/vehicles/ prefix to avoid duplication
    const cleanPath = imageUrl.replace(/^\/images\/vehicles\//, '');
    console.log('Image path:', `/images/vehicles/${cleanPath}`);
    return `/images/vehicles/${cleanPath}`;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          src={imgError ? '/images/vehicles/placeholder.png' : getImagePath(vehicle.image_url)}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImgError(true)}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {vehicle.make} {vehicle.model}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {vehicle.year} • {vehicle.type}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={vehicle.category}
            color="primary"
            size="small"
          />
          <Chip
            label={`₹${vehicle.price_per_day}/day`}
            color="secondary"
            size="small"
          />
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onViewDetails(vehicle.id)}
          sx={{ mt: 'auto' }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
});

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const navigate = useNavigate();

  // Debounce filter changes
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  // Fetch vehicles with debounced filters
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (debouncedFilters.type) params.append('type', debouncedFilters.type);
      if (debouncedFilters.category) params.append('category', debouncedFilters.category);
      if (debouncedFilters.minPrice) params.append('minPrice', debouncedFilters.minPrice);
      if (debouncedFilters.maxPrice) params.append('maxPrice', debouncedFilters.maxPrice);

      const response = await axios.get(`http://localhost:5000/api/vehicles?${params.toString()}`);
      setVehicles(response.data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  // Fetch on mount and when debounced filters change
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Log vehicles whenever they change
  useEffect(() => {
    console.log('Fetched vehicles:', vehicles);
  }, [vehicles]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetails = useCallback((id) => {
    navigate(`/vehicles/${id}`);
  }, [navigate]);

  if (loading && vehicles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Vehicles
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="sedan">Sedan</MenuItem>
                <MenuItem value="suv">SUV</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="luxury">Luxury</MenuItem>
                <MenuItem value="cruiser">Cruiser</MenuItem>
                <MenuItem value="naked">Naked</MenuItem>
                <MenuItem value="adventure">Adventure</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="two-wheeler">Two-Wheeler</MenuItem>
                <MenuItem value="four-wheeler">Four-Wheeler</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min Price (₹)"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Max Price (₹)"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Box>

      {vehicles.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No vehicles found matching your criteria
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item key={vehicle.id} xs={12} sm={6} md={4}>
              <VehicleCard 
                vehicle={vehicle} 
                onViewDetails={handleViewDetails}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Vehicles;