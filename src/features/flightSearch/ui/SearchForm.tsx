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
    <Card elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
        Find Your Perfect Flight
      </Typography>
      
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Failed to search flights. Please try again.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Origin and Destination Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
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
                      <FlightTakeoff color="primary" />
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
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { 
                  bgcolor: 'primary.dark',
                  transform: { xs: 'rotate(90deg) scale(1.1)', sm: 'scale(1.1)' }
                },
                transition: 'all 0.2s ease-in-out'
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
                      <FlightLand color="primary" />
                    </InputAdornment>
                  ),
                }}
                helperText={isMobile ? "Airport code" : "Enter IATA airport code (e.g., JFK, LAX)"}
              />
            </Box>
          </Box>
          
          {/* Date and Passengers Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Box sx={{ flex: 2 }}>
              <TextField
                fullWidth
                required
                label="Departure Date"
                type="date"
                value={formData.departDate}
                onChange={handleChange('departDate')}
                disabled={isLoading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange color="primary" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0], // Today or later
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 140 } }}>
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
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Search Button */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 160 } }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading || !formData.origin || !formData.destination || !formData.departDate}
                sx={{ 
                  height: '56px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Search Flights'
                )}
              </Button>
            </Box>
          </Box>
        </Stack>
      </form>

      <Box sx={{ 
        mt: 3, 
        p: 3, 
        bgcolor: 'grey.50', 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
          💡 Popular Routes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try: JFK ↔ LAX • LHR ↔ CDG • SYD ↔ NRT • DXB ↔ SIN
        </Typography>
      </Box>
    </Card>
  );
};