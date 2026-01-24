import React from 'react';
import {
  Box,
  Card,
  Typography,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Chip,
  Radio,
  RadioGroup,
  styled,
  Collapse,
  IconButton,
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectAllFlights, selectFilters } from '../state/selectors';
import { setFilters, resetFilters } from '../state/flightSearchSlice';
import { debounce } from '../../../shared/utils/helpers';

interface FiltersPanelProps {
  isMobile?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: 0,
  borderRadius: theme.designTokens.borderRadius.lg,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  overflow: 'hidden',
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.designTokens.spacing.lg,
  borderBottom: '1px solid #f1f5f9',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.designTokens.spacing.md,
  cursor: 'pointer',
  userSelect: 'none',
}));

const StyledCheckbox = styled(Checkbox)({
  padding: '6px',
  '&.Mui-checked': {
    color: '#14b8a6',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const StyledRadio = styled(Radio)({
  padding: '6px',
  '&.Mui-checked': {
    color: '#14b8a6',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const ResetButton = styled(Button)({
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#64748b',
  padding: '4px 12px',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: '#f1f5f9',
    color: '#14b8a6',
  },
});

const ApplyButton = styled(Button)({
  textTransform: 'none',
  fontSize: '0.9375rem',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0f9688 0%, #0d7a6f 100%)',
    boxShadow: '0 6px 20px rgba(20, 184, 166, 0.35)',
  },
});

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ isMobile = false }) => {
  const dispatch = useAppDispatch();
  const allFlights = useAppSelector(selectAllFlights);
  const currentFilters = useAppSelector(selectFilters);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = React.useState({
    sort: true,
    price: true,
    stops: true,
    airlines: true,
  });

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
      min: Math.floor(Math.min(...prices) / 10) * 10,
      max: Math.ceil(Math.max(...prices) / 10) * 10,
    };
  }, [allFlights]);

  // Get unique airlines from all flights with counts
  const availableAirlines = React.useMemo(() => {
    if (allFlights.length === 0) return [];
    
    const airlineCounts = new Map<string, number>();
    allFlights.forEach(flight => {
      flight.airlineCodes.forEach(code => {
        airlineCounts.set(code, (airlineCounts.get(code) || 0) + 1);
      });
    });
    
    return Array.from(airlineCounts.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);
  }, [allFlights]);

  // Get stops counts
  const stopsCount = React.useMemo(() => {
    if (allFlights.length === 0) return { 0: 0, 1: 0, 2: 0 };
    
    const counts = { 0: 0, 1: 0, 2: 0 };
    allFlights.forEach(flight => {
      if (flight.stops === 0) counts[0]++;
      else if (flight.stops === 1) counts[1]++;
      else counts[2]++;
    });
    
    return counts;
  }, [allFlights]);

  // Debounced price update function
  const debouncedPriceUpdate = React.useMemo(
    () => debounce((min: number, max: number) => {
      dispatch(setFilters({ price: { min, max } }));
    }, 300),
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
  const handleAirlineChange = (airline: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAirlines = event.target.checked
      ? [...currentFilters.airlines, airline]
      : currentFilters.airlines.filter(a => a !== airline);
    
    dispatch(setFilters({ airlines: newAirlines }));
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

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    
    if (currentFilters.stops.length > 0) count++;
    if (currentFilters.airlines.length > 0) count++;
    if (priceRange.min !== priceRange.max && 
        (currentFilters.price.min > priceRange.min || currentFilters.price.max < priceRange.max)) {
      count++;
    }
    
    return count;
  }, [currentFilters, priceRange]);

  // Handle sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ sortBy: event.target.value as any }));
  };

  return (
    <StyledCard>
      {/* Header */}
      <Box sx={{ 
        p: 2.5, 
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListIcon sx={{ fontSize: 20, color: '#64748b' }} />
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              sx={{ 
                height: 20,
                minWidth: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: '#14b8a6',
                color: '#ffffff',
              }}
            />
          )}
        </Stack>
        {activeFiltersCount > 0 && (
          <ResetButton onClick={handleResetFilters}>
            Reset All
          </ResetButton>
        )}
      </Box>

      {/* Sort By Section */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('sort')}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
            Sort by
          </Typography>
          <IconButton 
            size="small" 
            sx={{ 
              transform: expandedSections.sort ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </SectionHeader>
        <Collapse in={expandedSections.sort}>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={currentFilters.sortBy} onChange={handleSortChange}>
              <FormControlLabel
                value="price-asc"
                control={<StyledRadio />}
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                    Lowest price
                  </Typography>
                }
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="price-desc"
                control={<StyledRadio />}
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                    Highest price
                  </Typography>
                }
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="duration-asc"
                control={<StyledRadio />}
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                    Shortest duration
                  </Typography>
                }
                sx={{ mb: 0.5 }}
              />
              <FormControlLabel
                value="departure-asc"
                control={<StyledRadio />}
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                    Earliest departure
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </Collapse>
      </FilterSection>

      {/* Price Range Section */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('price')}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
            Price Range
          </Typography>
          <IconButton 
            size="small" 
            sx={{ 
              transform: expandedSections.price ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </SectionHeader>
        <Collapse in={expandedSections.price}>
          <Box sx={{ px: 1 }}>
            <Slider
              value={localPriceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={priceRange.min}
              max={priceRange.max}
              step={10}
              valueLabelFormat={(value) => `$${value}`}
              sx={{ 
                color: '#14b8a6',
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(20, 184, 166, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.3,
                },
              }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                ${localPriceRange[0]}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                ${localPriceRange[1]}
              </Typography>
            </Stack>
          </Box>
        </Collapse>
      </FilterSection>

      {/* Stops Section */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('stops')}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
            Number of Stops
          </Typography>
          <IconButton 
            size="small" 
            sx={{ 
              transform: expandedSections.stops ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </SectionHeader>
        <Collapse in={expandedSections.stops}>
          <FormControl component="fieldset" fullWidth>
            <FormGroup>
              <FormControlLabel
                control={
                  <StyledCheckbox
                    checked={currentFilters.stops.includes(0)}
                    onChange={handleStopsChange(0)}
                  />
                }
                label={
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                      Non-stop
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      ({stopsCount[0]})
                    </Typography>
                  </Stack>
                }
                sx={{ mb: 0.5, width: '100%' }}
              />
              <FormControlLabel
                control={
                  <StyledCheckbox
                    checked={currentFilters.stops.includes(1)}
                    onChange={handleStopsChange(1)}
                  />
                }
                label={
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                      1 stop
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      ({stopsCount[1]})
                    </Typography>
                  </Stack>
                }
                sx={{ mb: 0.5, width: '100%' }}
              />
              <FormControlLabel
                control={
                  <StyledCheckbox
                    checked={currentFilters.stops.includes(2)}
                    onChange={handleStopsChange(2)}
                  />
                }
                label={
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                      2+ stops
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      ({stopsCount[2]})
                    </Typography>
                  </Stack>
                }
                sx={{ width: '100%' }}
              />
            </FormGroup>
          </FormControl>
        </Collapse>
      </FilterSection>

      {/* Airlines Section */}
      {availableAirlines.length > 0 && (
        <FilterSection>
          <SectionHeader onClick={() => toggleSection('airlines')}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
              Airlines
            </Typography>
            <IconButton 
              size="small" 
              sx={{ 
                transform: expandedSections.airlines ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </SectionHeader>
          <Collapse in={expandedSections.airlines}>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {availableAirlines.slice(0, 5).map(({ code, count }) => (
                  <FormControlLabel
                    key={code}
                    control={
                      <StyledCheckbox
                        checked={currentFilters.airlines.includes(code)}
                        onChange={handleAirlineChange(code)}
                      />
                    }
                    label={
                      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                          {code}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                          ({count})
                        </Typography>
                      </Stack>
                    }
                    sx={{ mb: 0.5, width: '100%' }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Collapse>
        </FilterSection>
      )}

      {/* Apply Button for Mobile */}
      {isMobile && (
        <Box sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
          <ApplyButton fullWidth>
            Apply Filters
          </ApplyButton>
        </Box>
      )}
    </StyledCard>
  );
};
