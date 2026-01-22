import React, { useState } from 'react';
import {
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Stack,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  DateRange,
  Person,
  SwapHoriz,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchFlights } from '../state/flightSearchSlice';
import { selectStatus, selectError } from '../state/selectors';

export const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Handle swap origin/destination
  const handleSwap = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
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
    <Card elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
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
          {/* Origin and Destination with Swap Button */}
          <Box sx={{ 
            display: 'flex', 
            flex: { xs: 1, md: 2 }, 
            gap: 1,
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Box sx={{ flex: 1, width: '100%' }}>
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
                helperText={isMobile ? "Airport code" : "Enter IATA airport code (e.g., JFK, LAX)"}
              />
            </Box>
            
            {/* Swap Button */}
            <IconButton
              onClick={handleSwap}
              disabled={isLoading}
              sx={{ 
                mx: { xs: 0, sm: 1 },
                my: { xs: 1, sm: 0 },
                transform: { xs: 'rotate(90deg)', sm: 'none' },
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
              aria-label="Swap origin and destination"
            >
              <SwapHoriz />
            </IconButton>
            
            <Box sx={{ flex: 1, width: '100%' }}>
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
                helperText={isMobile ? "Airport code" : "Enter IATA airport code (e.g., JFK, LAX)"}
              />
            </Box>
          </Box>
          
          {/* Date and Passengers */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flex: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Box sx={{ flex: 1 }}>
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
            
            <Box sx={{ minWidth: { xs: '100%', sm: 120 } }}>
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
          </Box>
          
          {/* Search Button */}
          <Box sx={{ minWidth: { xs: '100%', md: 140 } }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={isLoading || !formData.origin || !formData.destination || !formData.departDate}
              sx={{ 
                height: '56px',
                fontSize: { xs: '1rem', md: '0.875rem' }
              }}
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
    </Card>
  );
};