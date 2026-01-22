import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Button,
  Stack,
  Card,
} from '@mui/material';
import { Close, Refresh } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectFilters, selectAllFlights } from '../state/selectors';
import { setFilters, resetFilters } from '../state/flightSearchSlice';

/**
 * Applied filters bar showing active filter chips
 * Only shows when filters are active
 */
export const AppliedFiltersBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const allFlights = useAppSelector(selectAllFlights);

  // Calculate if price filter is active
  const isPriceFilterActive = React.useMemo(() => {
    if (allFlights.length === 0) return false;
    const prices = allFlights.map(f => f.priceTotal);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return filters.price.min > minPrice || filters.price.max < maxPrice;
  }, [filters.price, allFlights]);

  // Calculate total active filters
  const hasActiveFilters = filters.stops.length > 0 || filters.airlines.length > 0 || isPriceFilterActive;

  // Don't render if no active filters
  if (!hasActiveFilters) {
    return null;
  }

  // Handle removing individual filters
  const handleRemoveStop = (stopToRemove: number) => {
    const newStops = filters.stops.filter(stop => stop !== stopToRemove);
    dispatch(setFilters({ stops: newStops }));
  };

  const handleRemoveAirline = (airlineToRemove: string) => {
    const newAirlines = filters.airlines.filter(airline => airline !== airlineToRemove);
    dispatch(setFilters({ airlines: newAirlines }));
  };

  const handleRemovePriceFilter = () => {
    if (allFlights.length > 0) {
      const prices = allFlights.map(f => f.priceTotal);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      dispatch(setFilters({ price: { min: minPrice, max: maxPrice } }));
    }
  };

  const handleResetAll = () => {
    dispatch(resetFilters());
  };

  // Format stop labels
  const getStopLabel = (stops: number) => {
    if (stops === 0) return 'Non-stop';
    if (stops === 1) return '1 stop';
    return '2+ stops';
  };

  return (
    <Card elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Applied Filters
        </Typography>
        <Button
          size="small"
          startIcon={<Refresh />}
          onClick={handleResetAll}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          Reset All
        </Button>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {/* Stops chips */}
        {filters.stops.map((stop) => (
          <Chip
            key={`stop-${stop}`}
            label={getStopLabel(stop)}
            onDelete={() => handleRemoveStop(stop)}
            deleteIcon={<Close />}
            variant="filled"
            size="small"
            sx={{
              bgcolor: 'primary.50',
              color: 'primary.700',
              '& .MuiChip-deleteIcon': {
                color: 'primary.600',
                '&:hover': { color: 'primary.800' }
              }
            }}
          />
        ))}

        {/* Airlines chips */}
        {filters.airlines.map((airline) => (
          <Chip
            key={`airline-${airline}`}
            label={airline}
            onDelete={() => handleRemoveAirline(airline)}
            deleteIcon={<Close />}
            variant="filled"
            size="small"
            sx={{
              bgcolor: 'secondary.50',
              color: 'secondary.700',
              '& .MuiChip-deleteIcon': {
                color: 'secondary.600',
                '&:hover': { color: 'secondary.800' }
              }
            }}
          />
        ))}

        {/* Price range chip */}
        {isPriceFilterActive && (
          <Chip
            label={`$${filters.price.min} - $${filters.price.max}`}
            onDelete={handleRemovePriceFilter}
            deleteIcon={<Close />}
            variant="filled"
            size="small"
            sx={{
              bgcolor: 'warning.50',
              color: 'warning.700',
              '& .MuiChip-deleteIcon': {
                color: 'warning.600',
                '&:hover': { color: 'warning.800' }
              }
            }}
          />
        )}
      </Stack>
    </Card>
  );
};