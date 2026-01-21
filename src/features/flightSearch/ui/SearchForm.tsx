import React from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Stack,
  Box,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  DateRange,
  Person,
} from '@mui/icons-material';

export const SearchForm: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Flights
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={2}
        alignItems="stretch"
      >
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="From"
            placeholder="Departure city"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightTakeoff />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="To"
            placeholder="Destination city"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightLand />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ minWidth: { xs: '100%', md: 150 } }}>
          <TextField
            fullWidth
            label="Departure"
            type="date"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRange />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ minWidth: { xs: '100%', md: 120 } }}>
          <TextField
            fullWidth
            label="Passengers"
            type="number"
            defaultValue={1}
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
            sx={{ height: '56px' }}
          >
            Search
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};