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
  styled,
  Fade,
  Autocomplete,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  SwapHoriz,
  ErrorOutline,
  CalendarMonth,
  Person,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchFlights } from '../state/flightSearchSlice';
import { selectStatus, selectError } from '../state/selectors';
import { RateLimiter } from '../../../shared/utils';

// Popular airports for autocomplete
const popularAirports = [
  { code: 'JFK', name: 'New York (JFK)', city: 'New York' },
  { code: 'LAX', name: 'Los Angeles (LAX)', city: 'Los Angeles' },
  { code: 'LHR', name: 'London Heathrow (LHR)', city: 'London' },
  { code: 'CDG', name: 'Paris Charles de Gaulle (CDG)', city: 'Paris' },
  { code: 'DXB', name: 'Dubai (DXB)', city: 'Dubai' },
  { code: 'SIN', name: 'Singapore (SIN)', city: 'Singapore' },
  { code: 'NRT', name: 'Tokyo Narita (NRT)', city: 'Tokyo' },
  { code: 'SYD', name: 'Sydney (SYD)', city: 'Sydney' },
  { code: 'HKG', name: 'Hong Kong (HKG)', city: 'Hong Kong' },
  { code: 'ORD', name: 'Chicago (ORD)', city: 'Chicago' },
];

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.designTokens.spacing.xl,
  marginBottom: theme.designTokens.spacing.xl,
  borderRadius: theme.designTokens.borderRadius.xl,
  background: '#ffffff',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8fafb',
    borderRadius: theme.designTokens.borderRadius.md,
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: '#ffffff',
      border: '2px solid #e0e7ed',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      border: '2px solid #14b8a6',
      boxShadow: '0 0 0 4px rgba(20, 184, 166, 0.1)',
    },
    '&.Mui-error': {
      border: '2px solid #ef4444',
      '&.Mui-focused': {
        boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.1)',
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#64748b',
    '&.Mui-focused': {
      color: '#14b8a6',
    },
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: theme.designTokens.spacing.xs,
    fontSize: '0.75rem',
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
}));

const SwapButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#14b8a6',
  color: '#ffffff',
  width: 48,
  height: 48,
  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: '#0f9688',
    boxShadow: '0 6px 20px rgba(20, 184, 166, 0.35)',
    transform: 'rotate(180deg)',
  },
  '&:disabled': {
    backgroundColor: theme.designTokens.colors.neutral[300],
    color: theme.designTokens.colors.neutral[500],
    boxShadow: 'none',
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  height: 56,
  borderRadius: theme.designTokens.borderRadius.md,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
  background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(20, 184, 166, 0.35)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: theme.designTokens.colors.neutral[300],
    color: theme.designTokens.colors.neutral[500],
    boxShadow: 'none',
  },
}));

const PopularRoutesBox = styled(Box)(({ theme }) => ({
  marginTop: theme.designTokens.spacing.xl,
  padding: theme.designTokens.spacing.lg,
  backgroundColor: '#f0fdfa',
  borderRadius: theme.designTokens.borderRadius.md,
  borderLeft: `4px solid #14b8a6`,
}));

export const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  // Rate limiting state
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    origin: null as { code: string; name: string; city: string } | null,
    destination: null as { code: string; name: string; city: string } | null,
    departDate: '',
    adults: 1,
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    origin?: string;
    destination?: string;
    departDate?: string;
    adults?: string;
  }>({});

  const [touched, setTouched] = useState<{
    origin?: boolean;
    destination?: boolean;
    departDate?: boolean;
    adults?: boolean;
  }>({});

  // Validation functions
  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case 'origin':
        if (!value) {
          return 'Origin airport is required';
        }
        return undefined;

      case 'destination':
        if (!value) {
          return 'Destination airport is required';
        }
        if (value?.code === formData.origin?.code) {
          return 'Destination must be different from origin';
        }
        return undefined;

      case 'departDate':
        if (!value) {
          return 'Departure date is required';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return 'Departure date cannot be in the past';
        }
        return undefined;

      case 'adults':
        const numAdults = parseInt(value);
        if (isNaN(numAdults) || numAdults < 1) {
          return 'At least 1 passenger is required';
        }
        if (numAdults > 9) {
          return 'Maximum 9 passengers allowed';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, (formData as any)[field]);
      if (error) {
        errors[field as keyof typeof errors] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
    
    // Clear any previous rate limit error
    setRateLimitError(null);
    
    // Check rate limit
    if (!RateLimiter.canSearch()) {
      const timeLeft = RateLimiter.getTimeUntilReset();
      const secondsLeft = Math.ceil(timeLeft / 1000);
      setRateLimitError(
        `Rate limit exceeded. Please wait ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''} before searching again.`
      );
      
      // Start countdown timer
      const interval = setInterval(() => {
        const remaining = RateLimiter.getTimeUntilReset();
        if (remaining <= 0) {
          setRateLimitError(null);
          clearInterval(interval);
        } else {
          const secs = Math.ceil(remaining / 1000);
          setRateLimitError(
            `Rate limit exceeded. Please wait ${secs} second${secs !== 1 ? 's' : ''} before searching again.`
          );
        }
      }, 1000);
      
      return;
    }
    
    // Mark all fields as touched
    setTouched({
      origin: true,
      destination: true,
      departDate: true,
      adults: true,
    });

    // Validate entire form
    if (!validateForm()) {
      return;
    }

    const searchParams = {
      origin: formData.origin!.code,
      destination: formData.destination!.code,
      departDate: formData.departDate,
      adults: formData.adults,
    };

    // Record the search for rate limiting
    RateLimiter.recordSearch();
    
    dispatch(fetchFlights(searchParams));
  };

  const isLoading = status === 'loading';
  const hasError = status === 'failed';

  return (
    <StyledCard>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 4, 
          fontWeight: 700, 
          color: '#0f172a',
          textAlign: 'center',
          fontSize: { xs: '1.25rem', md: '1.5rem' },
        }}
      >
        Find Your Perfect Flight
      </Typography>
      
      {hasError && (
        <Fade in={hasError} timeout={400}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
            }}
          >
            {error || 'Failed to search flights. Please try again.'}
          </Alert>
        </Fade>
      )}

      {rateLimitError && (
        <Fade in={!!rateLimitError} timeout={400}>
          <Alert 
            severity="warning" 
            icon={<ErrorOutline />}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: '1px solid #fed7aa',
              backgroundColor: '#fffbeb',
            }}
          >
            {rateLimitError}
          </Alert>
        </Fade>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Origin and Destination Row */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
            gap: 2,
            alignItems: 'start',
          }}>
            <InputWrapper>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mb: 1,
                  fontWeight: 600,
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                From *
              </Typography>
              <Autocomplete
                options={popularAirports}
                value={formData.origin}
                onChange={(_, newValue) => {
                  setFormData(prev => ({ ...prev, origin: newValue }));
                  if (touched.origin) {
                    const error = validateField('origin', newValue);
                    setValidationErrors(prev => ({ ...prev, origin: error }));
                  }
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, origin: true }));
                  const error = validateField('origin', formData.origin);
                  setValidationErrors(prev => ({ ...prev, origin: error }));
                }}
                getOptionLabel={(option) => option.code}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.code}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {option.city}
                      </Typography>
                    </Stack>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="JFK, LAX, LHR..."
                    error={touched.origin && !!validationErrors.origin}
                    helperText={
                      touched.origin && validationErrors.origin ? (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ErrorOutline sx={{ fontSize: '0.75rem' }} />
                          {validationErrors.origin}
                        </Box>
                      ) : (
                        'Enter IATA airport code'
                      )
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <FlightTakeoff sx={{ color: '#14b8a6', fontSize: 20 }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                disabled={isLoading}
              />
            </InputWrapper>
            
            {/* Swap Button */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: { xs: 0, sm: 3.5 },
            }}>
              <SwapButton
                onClick={handleSwap}
                disabled={isLoading}
                sx={{ 
                  transform: { xs: 'rotate(90deg)', sm: 'none' },
                }}
                aria-label="Swap origin and destination"
              >
                <SwapHoriz />
              </SwapButton>
            </Box>
            
            <InputWrapper>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mb: 1,
                  fontWeight: 600,
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                To *
              </Typography>
              <Autocomplete
                options={popularAirports}
                value={formData.destination}
                onChange={(_, newValue) => {
                  setFormData(prev => ({ ...prev, destination: newValue }));
                  if (touched.destination) {
                    const error = validateField('destination', newValue);
                    setValidationErrors(prev => ({ ...prev, destination: error }));
                  }
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, destination: true }));
                  const error = validateField('destination', formData.destination);
                  setValidationErrors(prev => ({ ...prev, destination: error }));
                }}
                getOptionLabel={(option) => option.code}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.code}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {option.city}
                      </Typography>
                    </Stack>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="JFK, LAX, LHR..."
                    error={touched.destination && !!validationErrors.destination}
                    helperText={
                      touched.destination && validationErrors.destination ? (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ErrorOutline sx={{ fontSize: '0.75rem' }} />
                          {validationErrors.destination}
                        </Box>
                      ) : (
                        'Enter IATA airport code'
                      )
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <FlightLand sx={{ color: '#14b8a6', fontSize: 20 }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                disabled={isLoading}
              />
            </InputWrapper>
          </Box>
          
          {/* Date and Passengers Row */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr auto' },
            gap: 2,
            alignItems: 'start',
          }}>
            <InputWrapper>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mb: 1,
                  fontWeight: 600,
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Departure Date *
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={formData.departDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, departDate: e.target.value }));
                  if (touched.departDate) {
                    const error = validateField('departDate', e.target.value);
                    setValidationErrors(prev => ({ ...prev, departDate: error }));
                  }
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, departDate: true }));
                  const error = validateField('departDate', formData.departDate);
                  setValidationErrors(prev => ({ ...prev, departDate: error }));
                }}
                disabled={isLoading}
                error={touched.departDate && !!validationErrors.departDate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: '#14b8a6', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                  style: { fontSize: '0.9375rem' },
                }}
                helperText={
                  touched.departDate && validationErrors.departDate ? (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorOutline sx={{ fontSize: '0.75rem' }} />
                      {validationErrors.departDate}
                    </Box>
                  ) : (
                    'Select your departure date'
                  )
                }
              />
            </InputWrapper>
            
            <InputWrapper>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mb: 1,
                  fontWeight: 600,
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Passengers
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={formData.adults}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }));
                  if (touched.adults) {
                    const error = validateField('adults', e.target.value);
                    setValidationErrors(prev => ({ ...prev, adults: error }));
                  }
                }}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, adults: true }));
                  const error = validateField('adults', formData.adults);
                  setValidationErrors(prev => ({ ...prev, adults: error }));
                }}
                disabled={isLoading}
                error={touched.adults && !!validationErrors.adults}
                inputProps={{ min: 1, max: 9, style: { fontSize: '0.9375rem' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#14b8a6', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                helperText={
                  touched.adults && validationErrors.adults ? (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorOutline sx={{ fontSize: '0.75rem' }} />
                      {validationErrors.adults}
                    </Box>
                  ) : (
                    '1-9 passengers'
                  )
                }
              />
            </InputWrapper>
            
            {/* Search Button */}
            <Box sx={{ mt: { xs: 0, sm: 3.5 } }}>
              <SearchButton
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ minWidth: { xs: '100%', sm: 180 } }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'inherit' }} />
                ) : (
                  'Search Flights'
                )}
              </SearchButton>
            </Box>
          </Box>
        </Stack>
      </form>

      <PopularRoutesBox>
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '0.875rem',
          }}
        >
          ✈️ Popular Routes
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#64748b',
            lineHeight: 1.6,
            fontSize: '0.875rem',
          }}
        >
          Try: JFK ↔ LAX • LHR ↔ CDG • SYD ↔ NRT • DXB ↔ SIN
        </Typography>
      </PopularRoutesBox>
    </StyledCard>
  );
};
