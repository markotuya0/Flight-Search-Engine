import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  FlightTakeoff,
  FlightLand,
  AccessTime,
  AttachMoney,
  CheckCircle,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  selectFlightsForComparison,
  selectComparisonMode,
} from '../state/selectors';
import { setComparisonMode, clearComparisonSelection } from '../state/flightSearchSlice';
import type { Flight } from '../domain/types';

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
};

const getStopsDisplay = (stops: number): string => {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

interface ComparisonCardProps {
  flight: Flight;
  isBestPrice: boolean;
  isFastest: boolean;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ flight, isBestPrice, isFastest }) => {
  return (
    <Card
      sx={{
        height: '100%',
        border: '2px solid',
        borderColor: isBestPrice ? '#14b8a6' : '#e2e8f0',
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        mt: isBestPrice ? { xs: 1.5, sm: 2 } : 0,
      }}
    >
      {isBestPrice && (
        <Chip
          label="Best Price"
          size="small"
          icon={<CheckCircle sx={{ fontSize: { xs: 12, sm: 14 } }} />}
          sx={{
            position: 'absolute',
            top: { xs: -10, sm: -12 },
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#14b8a6',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            height: { xs: 18, sm: 20 },
            zIndex: 1,
          }}
        />
      )}
      
      <Box sx={{ p: { xs: 1.5, sm: 2 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={{ xs: 1, sm: 1.5 }} sx={{ flex: 1 }}>
          {/* Airline */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#0f172a', 
                mb: 0.25,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.2
              }}
            >
              {flight.airlineCodes.join(', ')}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: { xs: '0.65rem', sm: '0.7rem' }
              }}
            >
              Flight {flight.id.slice(0, 8)}
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 0.5, sm: 0.75 } }} />

          {/* Price */}
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ mb: 0.25 }}>
              <AttachMoney sx={{ fontSize: { xs: 14, sm: 16 }, color: '#64748b' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b', 
                  textTransform: 'uppercase', 
                  fontSize: { xs: '0.6rem', sm: '0.65rem' }
                }}
              >
                Price
              </Typography>
            </Stack>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#f97316',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                lineHeight: 1.2
              }}
            >
              {formatPrice(flight.priceTotal, flight.currency)}
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 0.5, sm: 0.75 } }} />

          {/* Departure */}
          <Box>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
              <FlightTakeoff sx={{ fontSize: { xs: 14, sm: 16 }, color: '#14b8a6' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b', 
                  textTransform: 'uppercase', 
                  fontSize: { xs: '0.6rem', sm: '0.65rem' }
                }}
              >
                Departure
              </Typography>
            </Stack>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#0f172a', 
                mb: 0.25,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.2
              }}
            >
              {formatTime(flight.departAt)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#475569',
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            >
              {flight.origin.code} - {flight.origin.city}
            </Typography>
          </Box>

          {/* Arrival */}
          <Box>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
              <FlightLand sx={{ fontSize: { xs: 14, sm: 16 }, color: '#f59e0b' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b', 
                  textTransform: 'uppercase', 
                  fontSize: { xs: '0.6rem', sm: '0.65rem' }
                }}
              >
                Arrival
              </Typography>
            </Stack>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#0f172a', 
                mb: 0.25,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.2
              }}
            >
              {formatTime(flight.arriveAt)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#475569',
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            >
              {flight.destination.code} - {flight.destination.city}
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 0.5, sm: 0.75 } }} />

          {/* Duration & Stops */}
          <Box>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.25 }} flexWrap="wrap">
                  <AccessTime sx={{ fontSize: { xs: 12, sm: 14 }, color: '#64748b' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#64748b', 
                      textTransform: 'uppercase', 
                      fontSize: { xs: '0.6rem', sm: '0.65rem' }
                    }}
                  >
                    Duration
                  </Typography>
                  {isFastest && (
                    <Chip
                      label="Fastest"
                      size="small"
                      sx={{
                        height: { xs: 14, sm: 16 },
                        fontSize: { xs: '0.55rem', sm: '0.6rem' },
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        fontWeight: 600,
                        '& .MuiChip-label': { px: 0.5 }
                      }}
                    />
                  )}
                </Stack>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0f172a',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {formatDuration(flight.durationMinutes)}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#64748b', 
                    textTransform: 'uppercase', 
                    fontSize: { xs: '0.6rem', sm: '0.65rem' }, 
                    display: 'block', 
                    mb: 0.25 
                  }}
                >
                  Stops
                </Typography>
                <Chip
                  label={getStopsDisplay(flight.stops)}
                  size="small"
                  sx={{
                    height: { xs: 18, sm: 20 },
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    fontWeight: 500,
                    backgroundColor: flight.stops === 0 ? '#d1fae5' : '#f1f5f9',
                    color: flight.stops === 0 ? '#065f46' : '#64748b',
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Book Button */}
          <Button
            fullWidth
            variant={isBestPrice ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              mt: 'auto !important',
              ...(isBestPrice
                ? {
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0f9688 0%, #0d7a6f 100%)',
                    },
                  }
                : {
                    borderColor: '#14b8a6',
                    color: '#14b8a6',
                    '&:hover': {
                      borderColor: '#14b8a6',
                      bgcolor: '#f0fdfa',
                    },
                  }),
            }}
          >
            Select Flight
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export const FlightComparison: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const flights = useAppSelector(selectFlightsForComparison);
  const open = useAppSelector(selectComparisonMode);

  const handleClose = () => {
    dispatch(setComparisonMode(false));
  };

  const handleClearAndClose = () => {
    dispatch(clearComparisonSelection());
    dispatch(setComparisonMode(false));
  };

  // Find best price and fastest flight
  const bestPriceFlight = flights.length > 0
    ? flights.reduce((best, flight) => (flight.priceTotal < best.priceTotal ? flight : best))
    : null;

  const fastestFlight = flights.length > 0
    ? flights.reduce((fastest, flight) => (flight.durationMinutes < fastest.durationMinutes ? flight : fastest))
    : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '90vh',
          height: isMobile ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          m: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: '#0f172a',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Compare Flights
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#64748b',
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            {flights.length} flight{flights.length !== 1 ? 's' : ''} selected
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent 
        sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 },
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94a3b8',
          },
        }}
      >
        {flights.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 8 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b', 
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              No flights selected
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#94a3b8',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Select 2-3 flights to compare
            </Typography>
          </Box>
        ) : (
          <>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: flights.length === 2 ? 'repeat(2, 1fr)' : '1fr',
                  md: flights.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' 
                }, 
                gap: { xs: 1.5, sm: 2, md: 2.5 },
                width: '100%',
                alignItems: 'stretch',
                pt: { xs: 1.5, sm: 2 },
              }}
            >
              {flights.map((flight) => (
                <Box key={flight.id} sx={{ minWidth: 0, display: 'flex' }}>
                  <ComparisonCard
                    flight={flight}
                    isBestPrice={bestPriceFlight?.id === flight.id}
                    isFastest={fastestFlight?.id === flight.id}
                  />
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: { xs: 2, sm: 2.5, md: 3 }, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleClearAndClose}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#64748b',
                  borderColor: '#e2e8f0',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.75, sm: 1 },
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    bgcolor: '#f8fafc',
                  },
                }}
              >
                Clear Selection
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
