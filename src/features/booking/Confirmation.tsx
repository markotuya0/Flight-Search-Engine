import React from 'react';
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

  const bookingReference = `E-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Success Icon */}
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          bgcolor: '#d1fae5',
          mb: 3,
        }}
      >
        <CheckCircle sx={{ fontSize: 64, color: '#14b8a6' }} />
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
        Booking Confirmed!
      </Typography>
      <Typography variant="body1" sx={{ color: '#64748b', mb: 1 }}>
        Your flight has been successfully booked
      </Typography>
      <Typography variant="h6" sx={{ color: '#14b8a6', fontWeight: 600, mb: 4 }}>
        Booking Reference: {bookingReference}
      </Typography>

      {/* Booking Details */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          textAlign: 'left',
          mb: 3,
        }}
      >
        <Stack spacing={3}>
          {/* Flight Details */}
          {flightDetails && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <FlightTakeoff sx={{ fontSize: 20, color: '#14b8a6' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  Flight Details
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Route
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {flightDetails.origin} → {flightDetails.destination}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {formatDate(flightDetails.departAt)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Total Paid
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#14b8a6' }}>
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
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Person sx={{ fontSize: 20, color: '#14b8a6' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  Passenger
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {passengerData.firstName} {passengerData.lastName}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
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
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <EventSeat sx={{ fontSize: 20, color: '#14b8a6' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  Seat Assignment
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                Seat {selectedSeat}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Payment */}
          {paymentData && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CreditCard sx={{ fontSize: 20, color: '#14b8a6' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  Payment Method
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                •••• •••• •••• {paymentData.cardNumber.slice(-4)}
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Email Notification */}
      <Box
        sx={{
          p: 2,
          bgcolor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Email sx={{ fontSize: 18, color: '#f59e0b' }} />
          <Typography variant="body2" sx={{ color: '#92400e' }}>
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
          py: 1.5,
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
