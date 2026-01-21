import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectAllFlights, selectFlightStats, selectStatus } from '../state/selectors';

/**
 * Debug component to show Redux state information
 * Only shown in development mode
 */
export const FlightDebugInfo: React.FC = () => {
  const flights = useAppSelector(selectAllFlights);
  const stats = useAppSelector(selectFlightStats);
  const status = useAppSelector(selectStatus);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Redux State Debug (Dev Only)
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Status: ${status}`} size="small" />
        <Chip label={`Total Flights: ${flights.length}`} size="small" />
        <Chip label={`Filtered: ${stats.count}`} size="small" />
        <Chip label={`Price Range: $${stats.minPrice}-$${stats.maxPrice}`} size="small" />
        <Chip label={`Airlines: ${stats.airlines.length}`} size="small" />
      </Stack>
    </Box>
  );
};