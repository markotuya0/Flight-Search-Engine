import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  AttachMoney,
  Search,
} from '@mui/icons-material';
import { useAppDispatch } from '../../../app/hooks';
import { setSearchParams } from '../state/flightSearchSlice';

interface SharedFlightData {
  flightId: string;
  origin: string;
  destination: string;
  date: string;
  price: string;
  airline: string;
}

export const SharePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [flightData, setFlightData] = useState<SharedFlightData | null>(null);

  useEffect(() => {
    // Extract flight data from URL parameters
    const flightId = searchParams.get('flightId');
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const price = searchParams.get('price');
    const airline = searchParams.get('airline');

    if (flightId && origin && destination && date && price && airline) {
      setFlightData({
        flightId,
        origin,
        destination,
        date,
        price,
        airline,
      });
    }
  }, [searchParams]);

  const handleSearchSimilar = () => {
    if (flightData) {
      // Set search parameters and navigate to main page
      dispatch(setSearchParams({
        origin: flightData.origin,
        destination: flightData.destination,
        departDate: flightData.date,
        adults: 1,
      }));
      navigate('/');
    }
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

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  if (!flightData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Invalid or missing flight information in the shared link.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0f9688' } }}
        >
          Go to Flight Search
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#14b8a6' }}>
          Shared Flight
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Someone shared this flight with you
        </Typography>
      </Box>

      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Route Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {flightData.origin}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                From
              </Typography>
            </Box>
            
            <FlightTakeoff sx={{ color: '#14b8a6', fontSize: 32 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {flightData.destination}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                To
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Flight Details */}
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Schedule sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Departure Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatDate(flightData.date)}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <AttachMoney sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#14b8a6' }}>
                  {formatPrice(flightData.price)}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <FlightLand sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Airlines
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  {flightData.airline.split(',').map((airline, index) => (
                    <Chip
                      key={index}
                      label={airline.trim()}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Search />}
              onClick={handleSearchSimilar}
              sx={{
                bgcolor: '#14b8a6',
                '&:hover': { bgcolor: '#0f9688' },
                flex: 1,
              }}
            >
              Search Similar Flights
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                borderColor: '#14b8a6',
                color: '#14b8a6',
                '&:hover': {
                  borderColor: '#0f9688',
                  bgcolor: 'rgba(20, 184, 166, 0.04)',
                },
                flex: 1,
              }}
            >
              New Search
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Flight ID: {flightData.flightId}
        </Typography>
      </Box>
    </Container>
  );
};