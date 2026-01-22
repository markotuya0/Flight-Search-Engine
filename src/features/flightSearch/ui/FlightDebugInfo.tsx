import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectAllFlights, selectFilteredFlights, selectFlightStats, selectStatus, selectFilters, selectPriceSeries } from '../state/selectors';

/**
 * Debug component to show Redux state information
 * Only shown in development mode
 */
export const FlightDebugInfo: React.FC = () => {
  const allFlights = useAppSelector(selectAllFlights);
  const filteredFlights = useAppSelector(selectFilteredFlights);
  const stats = useAppSelector(selectFlightStats);
  const status = useAppSelector(selectStatus);
  const filters = useAppSelector(selectFilters);
  const priceSeries = useAppSelector(selectPriceSeries);

  // Calculate stops distribution
  const stopsDistribution = React.useMemo(() => {
    const distribution = { 0: 0, 1: 0, 2: 0, '3+': 0 };
    allFlights.forEach(flight => {
      if (flight.stops >= 3) {
        distribution['3+']++;
      } else {
        distribution[flight.stops as keyof typeof distribution]++;
      }
    });
    return distribution;
  }, [allFlights]);

  const filteredStopsDistribution = React.useMemo(() => {
    const distribution = { 0: 0, 1: 0, 2: 0, '3+': 0 };
    filteredFlights.forEach(flight => {
      if (flight.stops >= 3) {
        distribution['3+']++;
      } else {
        distribution[flight.stops as keyof typeof distribution]++;
      }
    });
    return distribution;
  }, [filteredFlights]);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Redux State Debug (Dev Only)
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
        <Chip label={`Status: ${status}`} size="small" />
        <Chip label={`Total Flights: ${allFlights.length}`} size="small" />
        <Chip label={`Filtered: ${filteredFlights.length}`} size="small" color="primary" />
        <Chip label={`Price Range: ${stats.minPrice}-${stats.maxPrice}`} size="small" />
        <Chip label={`Airlines: ${stats.airlines.length}`} size="small" />
      </Stack>
      
      <Typography variant="caption" display="block" gutterBottom>
        All Flights Stops: 0-stop: {stopsDistribution[0]}, 1-stop: {stopsDistribution[1]}, 2-stop: {stopsDistribution[2]}, 3+: {stopsDistribution['3+']}
      </Typography>
      
      <Typography variant="caption" display="block" gutterBottom>
        Filtered Stops: 0-stop: {filteredStopsDistribution[0]}, 1-stop: {filteredStopsDistribution[1]}, 2-stop: {filteredStopsDistribution[2]}, 3+: {filteredStopsDistribution['3+']}
      </Typography>
      
      <Typography variant="caption" display="block">
        Active Filters: Stops: [{filters.stops.join(', ')}], Airlines: [{filters.airlines.join(', ')}], Price: ${filters.price.min}-${filters.price.max}
      </Typography>
      
      <Typography variant="caption" display="block">
        Price Series: {priceSeries.length} time slots - Hours: [{priceSeries.map(p => p.hour).join(', ')}]
      </Typography>
    </Box>
  );
};