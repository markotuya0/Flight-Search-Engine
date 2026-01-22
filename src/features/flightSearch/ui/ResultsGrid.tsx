import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { FlightTakeoff, AccessTime } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectFilteredFlights, selectStatus, selectError, selectSearchParams, selectAllFlights } from '../state/selectors';
import { fetchFlights } from '../state/flightSearchSlice';
import { FlightGridSkeleton, ErrorState, EmptyState, WelcomeState } from '../../../shared/components';
import type { Flight } from '../domain/types';

// Helper function to format duration from minutes to "Xh Ym"
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper function to format price as currency
const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

// Helper function to format date/time
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Helper function to get stops display
const getStopsDisplay = (stops: number): string => {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

// Mobile Card Component
const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  return (
    <Card variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Airline and Route */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {flight.airlineCodes[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {flight.airlineCodes.join(', ')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {flight.origin.code} → {flight.destination.code}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(flight.priceTotal, flight.currency)}
            </Typography>
          </Stack>

          {/* Flight Times */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="center">
              <Typography variant="h6">{formatDateTime(flight.departAt).split(' ')[1]}</Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.origin.code}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  px: 1,
                }}
              >
                <FlightTakeoff sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Box>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h6">{formatDateTime(flight.arriveAt).split(' ')[1]}</Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.destination.code}
              </Typography>
            </Box>
          </Stack>

          {/* Flight Details */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip
              icon={<AccessTime />}
              label={formatDuration(flight.durationMinutes)}
              size="small"
              variant="outlined"
            />
            <Chip
              label={getStopsDisplay(flight.stops)}
              size="small"
              variant="outlined"
              color={flight.stops === 0 ? 'success' : 'default'}
            />
          </Stack>

          {/* Select Button */}
          <Button variant="contained" fullWidth>
            Select Flight
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const ResultsGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const flights = useAppSelector(selectFilteredFlights);
  const allFlights = useAppSelector(selectAllFlights);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const searchParams = useAppSelector(selectSearchParams);

  // Handle retry
  const handleRetry = () => {
    if (searchParams.origin && searchParams.destination && searchParams.departDate) {
      dispatch(fetchFlights(searchParams));
    }
  };

  // Loading state
  if (status === 'loading') {
    return <FlightGridSkeleton />;
  }

  // Error state
  if (status === 'failed') {
    return (
      <ErrorState
        title="Failed to Load Flights"
        message={error || 'We encountered an error while searching for flights. Please try again.'}
        onRetry={handleRetry}
        retryLabel="Search Again"
      />
    );
  }

  // Welcome state (no search performed yet)
  if (status === 'idle' || allFlights.length === 0) {
    return <WelcomeState />;
  }

  // Empty state (search performed but no results after filtering)
  if (flights.length === 0) {
    return (
      <EmptyState
        title="No flights match your filters"
        message="Try adjusting your price range, airline preferences, or number of stops to see more results."
        actionLabel="Clear All Filters"
        onAction={() => {
          // This would trigger filter reset - we'll implement this later
          console.log('Clear filters');
        }}
      />
    );
  }

  // Transform flights data for DataGrid
  const rows = flights.map((flight: Flight) => ({
    id: flight.id,
    airline: flight.airlineCodes.join(', '),
    airlineDisplay: flight.airlineCodes[0], // For avatar display
    depart: formatDateTime(flight.departAt),
    departSort: new Date(flight.departAt).getTime(), // For sorting
    arrive: formatDateTime(flight.arriveAt),
    arriveSort: new Date(flight.arriveAt).getTime(), // For sorting
    stops: getStopsDisplay(flight.stops),
    stopsSort: flight.stops, // For sorting
    duration: formatDuration(flight.durationMinutes),
    durationSort: flight.durationMinutes, // For sorting
    price: formatPrice(flight.priceTotal, flight.currency),
    priceSort: flight.priceTotal, // For sorting
    origin: flight.origin.code,
    destination: flight.destination.code,
    route: `${flight.origin.code} → ${flight.destination.code}`,
  }));

  const columns: GridColDef[] = [
    {
      field: 'airline',
      headerName: 'Airline',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
            {params.row.airlineDisplay}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'route',
      headerName: 'Route',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'depart',
      headerName: 'Departure',
      flex: 1,
      minWidth: 120,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'departSort') - param2.api.getCellValue(param2.id, 'departSort');
      },
    },
    {
      field: 'arrive',
      headerName: 'Arrival',
      flex: 1,
      minWidth: 120,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'arriveSort') - param2.api.getCellValue(param2.id, 'arriveSort');
      },
    },
    {
      field: 'stops',
      headerName: 'Stops',
      flex: 0.7,
      minWidth: 90,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'stopsSort') - param2.api.getCellValue(param2.id, 'stopsSort');
      },
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={params.row.stopsSort === 0 ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 0.7,
      minWidth: 90,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'durationSort') - param2.api.getCellValue(param2.id, 'durationSort');
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.8,
      minWidth: 100,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'priceSort') - param2.api.getCellValue(param2.id, 'priceSort');
      },
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Flight Results ({flights.length} flights found)
        </Typography>
      </Box>

      {/* Desktop: DataGrid */}
      {!isMobile ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'price', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.50',
                borderBottom: '2px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      ) : (
        /* Mobile: Card Layout */
        <Stack spacing={2}>
          {flights.slice(0, 10).map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
          
          {/* Load More Button for Mobile */}
          {flights.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="outlined">
                Load More Results
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Paper>
  );
};