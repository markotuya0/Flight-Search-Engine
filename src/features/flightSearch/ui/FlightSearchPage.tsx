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
  Alert,
  Paper,
} from '@mui/material';
import {
  FilterList,
  Close,
} from '@mui/icons-material';
import { SearchForm } from './SearchForm';
import { FiltersPanel } from './FiltersPanel';
import { ResultsGrid } from './ResultsGrid';
import { PriceGraph } from './PriceGraph';
import { useAppSelector } from '../../../app/hooks';
import { selectFilters, selectAllFlights, selectUsedFallback } from '../state/selectors';
import SelectionImage from '../../../assets/Selection.png';

const DRAWER_WIDTH = 320;

export const FlightSearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(0);
  
  const filters = useAppSelector(selectFilters);
  const allFlights = useAppSelector(selectAllFlights);
  const usedFallback = useAppSelector(selectUsedFallback);

  // Mock dates for date selector
  const dates = [
    { day: 'Fri, 16 Feb', price: 148 },
    { day: 'Sat, 17 Feb', price: 160 },
    { day: 'Sun, 18 Feb', price: 170.8 },
    { day: 'Mon, 19 Feb', price: 195 },
    { day: 'Tue, 20 Feb', price: 146.5 },
  ];

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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero Banner */}
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 3 },
          bgcolor: 'background.default',
        }}
      >
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            maxWidth: '95%',
            width: '100%',
            mx: 1,
          }}
        >
          <Box 
            component="img"
            src={SelectionImage}
            alt="Explore your World - Special Offer"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </Paper>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4, mt: -4, position: 'relative', zIndex: 10 }}>
        {/* Modern Search Form Card */}
        <SearchForm />

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
                {/* Date Selector */}
                {allFlights.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                    {dates.map((date, idx) => (
                      <Button
                        key={idx}
                        onClick={() => setSelectedDate(idx)}
                        variant={selectedDate === idx ? 'contained' : 'outlined'}
                        sx={{
                          minWidth: 140,
                          flexShrink: 0,
                          py: 1.5,
                          px: 2,
                          borderRadius: 2,
                          borderWidth: 2,
                          borderColor: '#14b8a6',
                          bgcolor: selectedDate === idx ? '#14b8a6' : '#ffffff',
                          color: selectedDate === idx ? '#ffffff' : '#14b8a6',
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: '#14b8a6',
                            bgcolor: selectedDate === idx ? '#0f9688' : '#f0fdfa',
                          },
                          textTransform: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {date.day}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                          {date.price} USD
                        </Typography>
                      </Button>
                    ))}
                  </Box>
                )}

                {/* Price Notice */}
                {allFlights.length > 0 && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 4, height: 40, bgcolor: '#14b8a6', borderRadius: 1 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Prices are currently typical
                    </Typography>
                  </Stack>
                )}

                {/* Fallback Notification */}
                {usedFallback && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        fontSize: '0.875rem',
                      }
                    }}
                  >
                    Amadeus test environment is unavailable. Showing results from fallback provider.
                  </Alert>
                )}
                
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
              {/* Date Selector - Mobile */}
              {allFlights.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                  {dates.map((date, idx) => (
                    <Button
                      key={idx}
                      onClick={() => setSelectedDate(idx)}
                      variant={selectedDate === idx ? 'contained' : 'outlined'}
                      sx={{
                        minWidth: 140,
                        flexShrink: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: 2,
                        borderWidth: 2,
                        borderColor: '#14b8a6',
                        bgcolor: selectedDate === idx ? '#14b8a6' : '#ffffff',
                        color: selectedDate === idx ? '#ffffff' : '#14b8a6',
                        '&:hover': {
                          borderWidth: 2,
                          borderColor: '#14b8a6',
                          bgcolor: selectedDate === idx ? '#0f9688' : '#f0fdfa',
                        },
                        textTransform: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {date.day}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                        {date.price} USD
                      </Typography>
                    </Button>
                  ))}
                </Box>
              )}

              {/* Price Notice - Mobile */}
              {allFlights.length > 0 && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 4, height: 40, bgcolor: '#14b8a6', borderRadius: 1 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Prices are currently typical
                  </Typography>
                </Stack>
              )}

              {/* Fallback Notification */}
              {usedFallback && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-message': {
                      fontSize: '0.875rem',
                    }
                  }}
                >
                  Amadeus test environment is unavailable. Showing results from fallback provider.
                </Alert>
              )}
              
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