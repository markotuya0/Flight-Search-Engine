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
} from '@mui/material';
import {
  FilterList,
  Close,
} from '@mui/icons-material';
import { SearchForm } from './SearchForm';
import { FiltersPanel } from './FiltersPanel';
import { ResultsGrid } from './ResultsGrid';
import { PriceGraph } from './PriceGraph';

const DRAWER_WIDTH = 320;

export const FlightSearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const handleToggleFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const handleCloseFilters = () => {
    setMobileFiltersOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Search Form - Always at top */}
      <SearchForm />

      {/* Desktop Layout */}
      {!isMobile ? (
        <Box sx={{ display: 'flex', gap: 3 }}>
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
              <ResultsGrid />
              <PriceGraph />
            </Stack>
          </Box>
        </Box>
      ) : (
        /* Mobile Layout */
        <Box sx={{ position: 'relative' }}>
          {/* Main Content - Full Width on Mobile */}
          <Stack spacing={3}>
            <ResultsGrid />
            <PriceGraph />
          </Stack>

          {/* Mobile Filters Button */}
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
            <Badge badgeContent={3} color="secondary">
              <FilterList />
            </Badge>
          </Fab>

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
              }}
            >
              <Box />
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
  );
};