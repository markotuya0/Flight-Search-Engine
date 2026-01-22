import React from 'react';
import {
  Box,
  Container,
  Drawer,
  Button,
  useTheme,
  useMediaQuery,
  Fab,
  Badge,
  Stack,
  Typography,
  Slide,
} from '@mui/material';
import {
  FilterList,
  Close,
} from '@mui/icons-material';
import { SearchForm } from './SearchForm';
import { FiltersPanel } from './FiltersPanel';
import { ResultsGrid } from './ResultsGrid';
import { PriceGraph } from './PriceGraph';
import { FlightDebugInfo } from './FlightDebugInfo';
import { AppliedFiltersBar } from './AppliedFiltersBar';
import { SortControls } from './SortControls';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectFilters, selectAllFlights, selectSortBy } from '../state/selectors';
import { setSortBy } from '../state/flightSearchSlice';

const DRAWER_WIDTH = 320;

export const FlightSearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  
  const filters = useAppSelector(selectFilters);
  const allFlights = useAppSelector(selectAllFlights);
  const sortBy = useAppSelector(selectSortBy);

  // Calculate active filter count for mobile badge
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    
    // Check if stops filter is active
    if (filters.stops.length > 0) count++;
    
    // Check if airlines filter is active
    if (filters.airlines.length > 0) count++;
    
    // Check if price filter is modified (assuming we have flight data to compare against)
    if (allFlights.length > 0) {
      const prices = allFlights.map(f => f.priceTotal);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (filters.price.min > minPrice || filters.price.max < maxPrice) {
        count++;
      }
    }
    
    return count;
  }, [filters, allFlights]);

  const handleToggleFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const handleCloseFilters = () => {
    setMobileFiltersOpen(false);
  };

  const handleSortChange = (newSort: 'best' | 'cheapest' | 'fastest') => {
    dispatch(setSortBy(newSort));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 56px)' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Modern Search Form Card */}
        <SearchForm />
        
        {/* Debug Info - Development only */}
        {import.meta.env.DEV && <FlightDebugInfo />}

        {/* Applied Filters Bar */}
        <AppliedFiltersBar />

        {/* Desktop Layout */}
        {!isMobile ? (
          <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
            {/* Desktop Filters - Left Column */}
            <Box
              sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
              }}
            >
              <FiltersPanel />
            </Box>

            {/* Main Content - Right Column */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack spacing={3}>
                <SortControls 
                  value={sortBy} 
                  onChange={handleSortChange}
                  resultsCount={allFlights.length}
                />
                <ResultsGrid />
                <PriceGraph />
              </Stack>
            </Box>
          </Box>
        ) : (
          /* Mobile Layout */
          <Box sx={{ position: 'relative', mt: 2 }}>
            {/* Main Content - Full Width on Mobile */}
            <Stack spacing={3}>
              <SortControls 
                value={sortBy} 
                onChange={handleSortChange}
                resultsCount={allFlights.length}
              />
              <ResultsGrid />
              <PriceGraph />
            </Stack>

            {/* Mobile Filters Button - Only show when there are flights */}
            {allFlights.length > 0 && (
              <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Fab
                  color="primary"
                  aria-label="filters"
                  onClick={handleToggleFilters}
                  sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: theme.zIndex.speedDial,
                  }}
                >
                  <Badge 
                    badgeContent={activeFiltersCount} 
                    color="secondary"
                    invisible={activeFiltersCount === 0}
                  >
                    <FilterList />
                  </Badge>
                </Fab>
              </Slide>
            )}

            {/* Mobile Filters Drawer */}
            <Drawer
              anchor="bottom"
              open={mobileFiltersOpen}
              onClose={handleCloseFilters}
              PaperProps={{
                sx: {
                  maxHeight: '80vh',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Typography variant="h6">
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge 
                      badgeContent={activeFiltersCount} 
                      color="primary" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                <Button
                  startIcon={<Close />}
                  onClick={handleCloseFilters}
                  variant="outlined"
                  size="small"
                >
                  Close
                </Button>
              </Box>
              
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <FiltersPanel isMobile />
              </Box>

              {/* Apply Filters Button */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCloseFilters}
                >
                  Apply Filters
                </Button>
              </Box>
            </Drawer>
          </Box>
        )}
      </Container>
    </Box>
  );
};