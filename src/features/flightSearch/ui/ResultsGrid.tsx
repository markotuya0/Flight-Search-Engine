import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import {
  FlightTakeoff,
  AccessTime,
} from '@mui/icons-material';

// Mock flight data
const mockFlights = [
  {
    id: '1',
    airline: 'American Airlines',
    flightNumber: 'AA 1234',
    departure: { city: 'New York', time: '08:30', code: 'JFK' },
    arrival: { city: 'Los Angeles', time: '11:45', code: 'LAX' },
    duration: '5h 15m',
    stops: 'Non-stop',
    price: 299,
  },
  {
    id: '2',
    airline: 'Delta',
    flightNumber: 'DL 5678',
    departure: { city: 'New York', time: '14:20', code: 'JFK' },
    arrival: { city: 'Los Angeles', time: '17:55', code: 'LAX' },
    duration: '5h 35m',
    stops: 'Non-stop',
    price: 349,
  },
  {
    id: '3',
    airline: 'United',
    flightNumber: 'UA 9012',
    departure: { city: 'New York', time: '19:15', code: 'JFK' },
    arrival: { city: 'Los Angeles', time: '23:30', code: 'LAX' },
    duration: '6h 15m',
    stops: '1 stop',
    price: 259,
  },
];

export const ResultsGrid: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Flight Results ({mockFlights.length} flights found)
        </Typography>
        <Button variant="outlined" size="small">
          Sort by Price
        </Button>
      </Box>

      <Stack spacing={2}>
        {mockFlights.map((flight) => (
          <Card key={flight.id} variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
            <CardContent>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                alignItems={{ xs: 'stretch', sm: 'center' }}
              >
                {/* Airline Info */}
                <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {flight.airline.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {flight.airline}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {flight.flightNumber}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Flight Route */}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box textAlign="center">
                      <Typography variant="h6">{flight.departure.time}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {flight.departure.code}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1, position: 'relative' }}>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'background.paper',
                          px: 1,
                        }}
                      >
                        <FlightTakeoff sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Box>
                    </Box>
                    
                    <Box textAlign="center">
                      <Typography variant="h6">{flight.arrival.time}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {flight.arrival.code}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }} justifyContent="center">
                    <Chip
                      icon={<AccessTime />}
                      label={flight.duration}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={flight.stops}
                      size="small"
                      variant="outlined"
                      color={flight.stops === 'Non-stop' ? 'success' : 'default'}
                    />
                  </Stack>
                </Box>

                {/* Price and Book */}
                <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    alignItems="center" 
                    justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
                  >
                    <Box textAlign={{ xs: 'left', sm: 'right' }}>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        ${flight.price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        per person
                      </Typography>
                    </Box>
                    <Button variant="contained" size="large">
                      Select
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Load More */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined">
          Load More Results
        </Button>
      </Box>
    </Paper>
  );
};