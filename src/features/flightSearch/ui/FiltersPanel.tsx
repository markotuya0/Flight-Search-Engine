import React from 'react';
import {
  Box,
  Card,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  OutlinedInput,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectAllFlights, selectFilters } from '../state/selectors';
import { setFilters, resetFilters } from '../state/flightSearchSlice';
import { debounce } from '../../../shared/utils/helpers';

interface FiltersPanelProps {
  isMobile?: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ isMobile = false }) => {
  const dispatch = useAppDispatch();
  const allFlights = useAppSelector(selectAllFlights);
  const currentFilters = useAppSelector(selectFilters);

  // Local state for price slider to make it smooth
  const [localPriceRange, setLocalPriceRange] = React.useState<number[]>([
    currentFilters.price.min,
    currentFilters.price.max
  ]);

  // Update local state when Redux state changes (e.g., on reset)
  React.useEffect(() => {
    setLocalPriceRange([currentFilters.price.min, currentFilters.price.max]);
  }, [currentFilters.price.min, currentFilters.price.max]);

  // Calculate price range from all flights
  const priceRange = React.useMemo(() => {
    if (allFlights.length === 0) return { min: 0, max: 2000 };
    
    const prices = allFlights.map(flight => flight.priceTotal);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [allFlights]);

  // Get unique airlines from all flights
  const availableAirlines = React.useMemo(() => {
    if (allFlights.length === 0) return [];
    
    const airlineSet = new Set<string>();
    allFlights.forEach(flight => {
      flight.airlineCodes.forEach(code => airlineSet.add(code));
    });
    
    return Array.from(airlineSet).sort();
  }, [allFlights]);

  // Debounced price update function
  const debouncedPriceUpdate = React.useMemo(
    () => debounce((min: number, max: number) => {
      dispatch(setFilters({ price: { min, max } }));
    }, 300), // 300ms delay
    [dispatch]
  );

  // Handle stops filter change
  const handleStopsChange = (stops: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStops = event.target.checked
      ? [...currentFilters.stops, stops]
      : currentFilters.stops.filter(s => s !== stops);
    
    dispatch(setFilters({ stops: newStops }));
  };

  // Handle airline filter change
  const handleAirlineChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const airlines = typeof value === 'string' ? value.split(',') : value;
    dispatch(setFilters({ airlines }));
  };

  // Handle price range change (local state only, smooth)
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setLocalPriceRange([min, max]);
    debouncedPriceUpdate(min, max);
  };

  // Handle price change commit (when user stops dragging)
  const handlePriceChangeCommitted = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    dispatch(setFilters({ price: { min, max } }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    
    // Check if stops filter is active (any checkboxes selected)
    if (currentFilters.stops.length > 0) count++;
    
    // Check if airlines filter is active
    if (currentFilters.airlines.length > 0) count++;
    
    // Check if price filter is modified from full range
    // Only count as active if user has actually moved the sliders
    if (priceRange.min !== priceRange.max && // Avoid division by zero
        (currentFilters.price.min > priceRange.min || currentFilters.price.max < priceRange.max)) {
      count++;
    }
    
    return count;
  }, [currentFilters, priceRange]);

  return (
    <Card 
      elevation={isMobile ? 0 : 1} 
      sx={{ 
        p: 3, 
        height: 'fit-content',
        backgroundColor: isMobile ? 'transparent' : 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Filters
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        {activeFiltersCount > 0 && (
          <Button 
            size="small" 
            onClick={handleResetFilters}
            color="secondary"
          >
            Reset
          </Button>
        )}
      </Box>

      {/* Price Range */}
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Price Range
          </Typography>
        <Slider
          value={localPriceRange}
          onChange={handlePriceChange}
          onChangeCommitted={handlePriceChangeCommitted}
          valueLabelDisplay="auto"
          min={priceRange.min}
          max={priceRange.max}
          step={10}
          valueLabelFormat={(value) => `$${value}`}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">
            ${localPriceRange[0]}
          </Typography>
          <Typography variant="caption">
            ${localPriceRange[1]}
          </Typography>
        </Box>
        </Box>

        <Divider />

        {/* Airlines */}
        <Box>
          <FormControl fullWidth>
          <InputLabel>Airlines</InputLabel>
          <Select
            multiple
            value={currentFilters.airlines}
            onChange={handleAirlineChange}
            input={<OutlinedInput label="Airlines" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {availableAirlines.map((airline) => (
              <MenuItem key={airline} value={airline}>
                {airline}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Box>

        <Divider />

        {/* Stops */}
        <Box>
          <FormControl component="fieldset">
          <FormLabel component="legend">Stops</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentFilters.stops.includes(0)}
                  onChange={handleStopsChange(0)}
                />
              }
              label="Non-stop"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentFilters.stops.includes(1)}
                  onChange={handleStopsChange(1)}
                />
              }
              label="1 stop"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentFilters.stops.includes(2)}
                  onChange={handleStopsChange(2)}
                />
              }
              label="2+ stops"
            />
          </FormGroup>
        </FormControl>
        </Box>
      </Stack>
    </Card>
  );
};