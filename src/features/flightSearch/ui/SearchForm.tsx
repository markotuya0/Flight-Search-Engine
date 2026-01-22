import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Stack,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  DateRange,
  Person,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchFlights } from '../state/flightSearchSlice';
import { selectStatus, selectError } from '../state/selectors';

export const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  // Form state
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departDate: '',
    adults: 1,
  });

  // Handle form field changes
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formData.origin || !formData.destination || !formData.departDate) {
      return;
    }

    // Convert airport names to IATA codes (simplified for demo)
    // In a real app, you'd have an airport lookup service
    const searchParams = {
      origin: formData.origin.toUpperCase(),
      destination: formData.destination.toUpperCase(),
      departDate: formData.departDate,
      adults: formData.adults,
    };

    dispatch(fetchFlights(searchParams));
  };

  const isLoading = status === 'loading';
  const hasError = status === 'failed';

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Flights
      </Typography>
      
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Failed to search flights. Please try again.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2}
          alignItems="stretch"
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              label="From"
              placeholder="JFK, LAX, LHR..."
              value={formData.origin}
              onChange={handleChange('origin')}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightTakeoff />
                  </InputAdornment>
                ),
              }}
              helperText="Enter IATA airport code (e.g., JFK, LAX)"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              required
              label="To"
              placeholder="JFK, LAX, LHR..."
              value={formData.destination}
              onChange={handleChange('destination')}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightLand />
                  </InputAdornment>
                ),
              }}
              helperText="Enter IATA airport code (e.g., JFK, LAX)"
            />
          </Box>
          
          <Box sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <TextField
              fullWidth
              required
              label="Departure"
              type="date"
              value={formData.departDate}
              onChange={handleChange('departDate')}
              disabled={isLoading}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0], // Today or later
              }}
            />
          </Box>
          
          <Box sx={{ minWidth: { xs: '100%', md: 120 } }}>
            <TextField
              fullWidth
              label="Passengers"
              type="number"
              value={formData.adults}
              onChange={handleChange('adults')}
              disabled={isLoading}
              inputProps={{ min: 1, max: 9 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ minWidth: { xs: '100%', md: 120 } }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={isLoading || !formData.origin || !formData.destination || !formData.departDate}
              sx={{ height: '56px' }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Search'
              )}
            </Button>
          </Box>
        </Stack>
      </form>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        💡 Try searching: JFK → LAX, LHR → CDG, or SYD → NRT
      </Typography>
    </Paper>
  );
};