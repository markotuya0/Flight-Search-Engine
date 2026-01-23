import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectAllFlights, selectFilteredFlights, selectStatus, selectUsedFallback } from '../state/selectors';

/**
 * Debug component to show essential Redux state information
 * Only shown in development mode
 */
export const FlightDebugInfo: React.FC = () => {
  const allFlights = useAppSelector(selectAllFlights);
  const filteredFlights = useAppSelector(selectFilteredFlights);
  const status = useAppSelector(selectStatus);
  const usedFallback = useAppSelector(selectUsedFallback);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Debug Info (Dev Only)
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Status: ${status}`} size="small" />
        <Chip label={`Flights: ${allFlights.length}`} size="small" />
        <Chip label={`Filtered: ${filteredFlights.length}`} size="small" color="primary" />
        {usedFallback && <Chip label="Using Fallback" size="small" color="warning" />}
      </Stack>
    </Box>
  );
};