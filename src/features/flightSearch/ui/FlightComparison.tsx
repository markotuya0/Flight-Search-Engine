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
      }}
    >
      {isBestPrice && (
        <Chip
          label="Best Price"
          size="small"
          icon={<CheckCircle sx={{ fontSize: 16 }} />}
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#14b8a6',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      )}
      
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Airline */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              {flight.airlineCodes.join(', ')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Flight {flight.id.slice(0, 8)}
            </Typography>
          </Box>

          <Divider />

          {/* Price */}
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ mb: 0.5 }}>
              <AttachMoney sx={{ fontSize: 20, color: '#64748b' }} />
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Price
              </Typography>
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316' }}>
              {formatPrice(flight.priceTotal, flight.currency)}
            </Typography>
          </Box>

          <Divider />

          {/* Departure */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <FlightTakeoff sx={{ fontSize: 18, color: '#14b8a6' }} />
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Departure
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              {formatTime(flight.departAt)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              {flight.origin.code} - {flight.origin.city}
            </Typography>
          </Box>

          {/* Arrival */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <FlightLand sx={{ fontSize: 18, color: '#f59e0b' }} />
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Arrival
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              {formatTime(flight.arriveAt)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              {flight.destination.code} - {flight.destination.city}
            </Typography>
          </Box>

          <Divider />

          {/* Duration & Stops */}
          <Box>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Duration
                  </Typography>
                  {isFastest && (
                    <Chip
                      label="Fastest"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Stack>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  {formatDuration(flight.durationMinutes)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                  Stops
                </Typography>
                <Chip
                  label={getStopsDisplay(flight.stops)}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
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
              py: 1.5,
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
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Compare Flights
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {flights.length} flight{flights.length !== 1 ? 's' : ''} selected
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {flights.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
              No flights selected
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Select 2-3 flights to compare
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: flights.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' }, gap: 3 }}>
              {flights.map((flight) => (
                <Box key={flight.id}>
                  <ComparisonCard
                    flight={flight}
                    isBestPrice={bestPriceFlight?.id === flight.id}
                    isFastest={fastestFlight?.id === flight.id}
                  />
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleClearAndClose}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#64748b',
                  borderColor: '#e2e8f0',
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
