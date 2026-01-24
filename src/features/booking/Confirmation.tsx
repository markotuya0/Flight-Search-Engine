import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  FlightTakeoff,
  Person,
  EventSeat,
  CreditCard,
  Email,
} from '@mui/icons-material';

interface ConfirmationProps {
  passengerData: any;
  selectedSeat: string | null;
  paymentData: any;
  flightDetails?: {
    origin: string;
    destination: string;
    departAt: string;
    price: number;
    currency: string;
  };
  onClose: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  passengerData,
  selectedSeat,
  paymentData,
  flightDetails,
  onClose,
}) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const bookingReference = useMemo(() => 
    `E-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 
    []
  );

  return (
    <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '100%' }}>
      {/* Success Icon */}
      <Box
        sx={{
          display: 'inline-flex',
          p: { xs: 1, sm: 1.5 },
          borderRadius: '50%',
          bgcolor: '#d1fae5',
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <CheckCircle sx={{ fontSize: { xs: 40, sm: 56 }, color: '#14b8a6' }} />
      </Box>

      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700, 
          color: '#0f172a', 
          mb: 0.5,
          fontSize: { xs: '1.25rem', sm: '1.75rem' },
          lineHeight: 1.2
        }}
      >
        Booking Confirmed!
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#64748b', 
          mb: 0.5,
          fontSize: { xs: '0.8rem', sm: '0.9rem' }
        }}
      >
        Your flight has been successfully booked
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#14b8a6', 
          fontWeight: 600, 
          mb: { xs: 1.5, sm: 2 },
          fontSize: { xs: '0.9rem', sm: '1.1rem' },
          wordBreak: 'break-word'
        }}
      >
        Booking Reference: {bookingReference}
      </Typography>

      {/* Booking Details */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          textAlign: 'left',
          mb: { xs: 1.5, sm: 2 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {/* Flight Details */}
          {flightDetails && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1, sm: 1.5 } }}>
                <FlightTakeoff sx={{ fontSize: { xs: 16, sm: 18 }, color: '#14b8a6' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0f172a',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  Flight Details
                </Typography>
              </Stack>
              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    Route
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0f172a',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      textAlign: 'right'
                    }}
                  >
                    {flightDetails.origin} → {flightDetails.destination}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    Date
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0f172a',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      textAlign: 'right'
                    }}
                  >
                    {formatDate(flightDetails.departAt)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    Total Paid
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#14b8a6',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    {formatPrice(flightDetails.price, flightDetails.currency)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Passenger Details */}
          {passengerData && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1, sm: 1.5 } }}>
                <Person sx={{ fontSize: { xs: 16, sm: 18 }, color: '#14b8a6' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0f172a',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  Passenger
                </Typography>
              </Stack>
              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    Name
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0f172a',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      textAlign: 'right',
                      wordBreak: 'break-word'
                    }}
                  >
                    {passengerData.firstName} {passengerData.lastName}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    Email
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0f172a',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      textAlign: 'right',
                      wordBreak: 'break-word'
                    }}
                  >
                    {passengerData.email}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Seat */}
          {selectedSeat && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1, sm: 1.5 } }}>
                <EventSeat sx={{ fontSize: { xs: 16, sm: 18 }, color: '#14b8a6' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0f172a',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  Seat Assignment
                </Typography>
              </Stack>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#0f172a',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}
              >
                Seat {selectedSeat}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Payment */}
          {paymentData && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1, sm: 1.5 } }}>
                <CreditCard sx={{ fontSize: { xs: 16, sm: 18 }, color: '#14b8a6' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0f172a',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  Payment Method
                </Typography>
              </Stack>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#0f172a',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}
              >
                •••• •••• •••• {paymentData.cardNumber.slice(-4)}
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Email Notification */}
      <Box
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          bgcolor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: 2,
          mb: { xs: 1.5, sm: 2 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          justifyContent="center"
          flexWrap="wrap"
          sx={{ textAlign: 'center' }}
        >
          <Email sx={{ fontSize: { xs: 14, sm: 16 }, color: '#f59e0b' }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#92400e',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              wordBreak: 'break-word'
            }}
          >
            Confirmation email sent to {passengerData?.email}
          </Typography>
        </Stack>
      </Box>

      {/* Action Button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onClose}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
          py: { xs: 1, sm: 1.25 },
          fontSize: { xs: '0.8rem', sm: '0.9rem' },
          '&:hover': {
            background: 'linear-gradient(135deg, #0f9688 0%, #0d7a6f 100%)',
          },
        }}
      >
        Done
      </Button>
    </Box>
  );
};
