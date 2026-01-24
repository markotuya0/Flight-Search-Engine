import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Drawer,
  IconButton,
  Divider,
} from '@mui/material';
import { 
  FlightTakeoff, 
  AccessTime, 
  Close as CloseIcon,
  FlightLand,
  Luggage,
  AirlineSeatReclineNormal,
  LocalOffer,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectFilteredFlights, selectStatus, selectError, selectSearchParams, selectAllFlights } from '../state/selectors';
import { fetchFlights } from '../state/flightSearchSlice';
import { FlightGridSkeleton, ErrorState, EmptyState, WelcomeState } from '../../../shared/components';

// Helper function to get airline color
const getAirlineColor = (airlineCode: string): string => {
  const colors: Record<string, string> = {
    'AA': '#14b8a6',
    'DL': '#f59e0b',
    'UA': '#3b82f6',
    'BA': '#ef4444',
    'AF': '#8b5cf6',
    'LH': '#f97316',
    'EK': '#dc2626',
    'QR': '#7c3aed',
  };
  
  const firstLetter = airlineCode.charAt(0).toUpperCase();
  const fallbackColors: Record<string, string> = {
    'A': '#14b8a6', 'B': '#3b82f6', 'C': '#8b5cf6', 'D': '#f59e0b',
    'E': '#ef4444', 'F': '#ec4899', 'G': '#10b981', 'H': '#14b8a6',
    'I': '#6366f1', 'J': '#f59e0b', 'K': '#8b5cf6', 'L': '#3b82f6',
    'M': '#14b8a6', 'N': '#f59e0b', 'O': '#ef4444', 'P': '#8b5cf6',
    'Q': '#7c3aed', 'R': '#ef4444', 'S': '#10b981', 'T': '#14b8a6',
    'U': '#3b82f6', 'V': '#8b5cf6', 'W': '#f59e0b', 'X': '#ef4444',
    'Y': '#fbbf24', 'Z': '#8b5cf6',
  };
  
  return colors[airlineCode] || fallbackColors[firstLetter] || '#14b8a6';
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getStopsDisplay = (stops: number): string => {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.designTokens.borderRadius.lg,
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#f8fafc',
  '& .MuiTableCell-head': {
    color: '#64748b',
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#f8fafc',
  },
  '&:last-child td': {
    borderBottom: 0,
  },
  '& .MuiTableCell-root': {
    padding: '20px 16px',
    borderBottom: '1px solid #f1f5f9',
  },
});

const AirlineIcon = styled(Box)<{ bgcolor: string }>(({ bgcolor }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: bgcolor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const ChooseButton = styled(Button)({
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  borderWidth: 2,
  borderColor: '#14b8a6',
  color: '#14b8a6',
  padding: '8px 24px',
  borderRadius: 8,
  '&:hover': {
    borderWidth: 2,
    borderColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
  },
});

// Mobile Card Component
const MobileFlightCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: theme.designTokens.borderRadius.lg,
  padding: theme.designTokens.spacing.lg,
  marginBottom: theme.designTokens.spacing.md,
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

export const ResultsGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const flights = useAppSelector(selectFilteredFlights);
  const allFlights = useAppSelector(selectAllFlights);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const searchParams = useAppSelector(selectSearchParams);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedFlight, setSelectedFlight] = React.useState<any>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFlightSelect = (flight: any) => {
    setSelectedFlight(flight);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleRetry = () => {
    if (searchParams.origin && searchParams.destination && searchParams.departDate) {
      dispatch(fetchFlights(searchParams));
    }
  };

  if (status === 'loading') {
    return <FlightGridSkeleton />;
  }

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

  if (status === 'idle' || allFlights.length === 0) {
    return <WelcomeState />;
  }

  if (flights.length === 0) {
    return (
      <EmptyState
        title="No flights match your filters"
        message="Try adjusting your price range, airline preferences, or number of stops to see more results."
        actionLabel="Clear All Filters"
        onAction={() => {
          console.log('Clear filters');
        }}
      />
    );
  }

  const paginatedFlights = flights.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Desktop Table View
  if (!isMobile) {
    return (
      <Paper elevation={0}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Flight Results ({flights.length} flights found)
          </Typography>
        </Box>

        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Airline</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Departure</TableCell>
                <TableCell>Arrival</TableCell>
                <TableCell>Stops</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedFlights.map((flight) => {
                const airlineColor = getAirlineColor(flight.airlineCodes[0]);
                return (
                  <StyledTableRow key={flight.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <AirlineIcon bgcolor={airlineColor}>
                          <FlightTakeoff sx={{ color: '#ffffff', fontSize: 20 }} />
                        </AirlineIcon>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                            {flight.airlineCodes[0]}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            23kg
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#475569' }}>
                        {flight.origin.code} → {flight.destination.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                        {formatDate(flight.departAt)}, {formatTime(flight.departAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                        {formatDate(flight.arriveAt)}, {formatTime(flight.arriveAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStopsDisplay(flight.stops)}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: flight.stops === 0 ? '#d1fae5' : '#f1f5f9',
                          color: flight.stops === 0 ? '#065f46' : '#64748b',
                          border: 'none',
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTime sx={{ fontSize: 16, color: '#94a3b8' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                          {formatDuration(flight.durationMinutes)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#f97316' }}>
                          {formatPrice(flight.priceTotal)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          / pax
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <ChooseButton variant="outlined" onClick={() => handleFlightSelect(flight)}>
                        Choose
                      </ChooseButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <TablePagination
          component="div"
          count={flights.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: '1px solid #f1f5f9',
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 3,
              paddingRight: 3,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: '#64748b',
            },
          }}
        />
      </Paper>
    );
  }

  // Mobile Card View
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          Flight Results ({flights.length} flights found)
        </Typography>
      </Box>

      {paginatedFlights.map((flight) => {
        const airlineColor = getAirlineColor(flight.airlineCodes[0]);
        return (
          <MobileFlightCard key={flight.id}>
            <Stack spacing={2}>
              {/* Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AirlineIcon bgcolor={airlineColor}>
                    <FlightTakeoff sx={{ color: '#ffffff', fontSize: 20 }} />
                  </AirlineIcon>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                      {flight.airlineCodes[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      23kg
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#f97316' }}>
                    {formatPrice(flight.priceTotal)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    / pax
                  </Typography>
                </Box>
              </Stack>

              {/* Flight Times */}
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>
                    {formatTime(flight.departAt)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {flight.origin.code}
                  </Typography>
                </Box>

                <Stack spacing={0.5} alignItems="center" sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTime sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {formatDuration(flight.durationMinutes)}
                    </Typography>
                  </Stack>
                  <Box sx={{ width: '100%', height: 2, bgcolor: '#e2e8f0', borderRadius: 1, position: 'relative' }}>
                    <FlightTakeoff 
                      sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 16,
                        color: '#14b8a6',
                      }} 
                    />
                  </Box>
                  <Chip
                    label={getStopsDisplay(flight.stops)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      backgroundColor: flight.stops === 0 ? '#d1fae5' : '#f1f5f9',
                      color: flight.stops === 0 ? '#065f46' : '#64748b',
                    }}
                  />
                </Stack>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>
                    {formatTime(flight.arriveAt)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {flight.destination.code}
                  </Typography>
                </Box>
              </Stack>

              {/* Choose Button */}
              <ChooseButton fullWidth variant="outlined" onClick={() => handleFlightSelect(flight)}>
                Choose
              </ChooseButton>
            </Stack>
          </MobileFlightCard>
        );
      })}

      {/* Mobile Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TablePagination
          component="div"
          count={flights.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 2,
              paddingRight: 2,
            },
          }}
        />
      </Box>

      {/* Flight Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 480 },
            maxWidth: '100%',
          },
        }}
      >
        {selectedFlight && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Drawer Header */}
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Flight Details
              </Typography>
              <IconButton onClick={handleDrawerClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Drawer Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              <Stack spacing={3}>
                {/* Airline Info */}
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <AirlineIcon bgcolor={getAirlineColor(selectedFlight.airlineCodes[0])}>
                      <FlightTakeoff sx={{ color: '#ffffff', fontSize: 24 }} />
                    </AirlineIcon>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {selectedFlight.airlineCodes.join(', ')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Flight {selectedFlight.id.slice(0, 8)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Flight Route */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 2, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Flight Route
                  </Typography>
                  <Stack spacing={3}>
                    {/* Departure */}
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: '#f0fdfa', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <FlightTakeoff sx={{ color: '#14b8a6', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mb: 0.5 }}>
                          Departure
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                          {formatTime(selectedFlight.departAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          {selectedFlight.origin.code} - {selectedFlight.origin.name || selectedFlight.origin.code}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {formatDate(selectedFlight.departAt)}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Duration */}
                    <Box sx={{ pl: 2.5, borderLeft: '2px dashed #e2e8f0', ml: 2.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ fontSize: 16, color: '#94a3b8' }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {formatDuration(selectedFlight.durationMinutes)}
                        </Typography>
                        <Chip
                          label={getStopsDisplay(selectedFlight.stops)}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            backgroundColor: selectedFlight.stops === 0 ? '#d1fae5' : '#f1f5f9',
                            color: selectedFlight.stops === 0 ? '#065f46' : '#64748b',
                          }}
                        />
                      </Stack>
                    </Box>

                    {/* Arrival */}
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: '#fef3c7', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <FlightLand sx={{ color: '#f59e0b', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mb: 0.5 }}>
                          Arrival
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                          {formatTime(selectedFlight.arriveAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          {selectedFlight.destination.code} - {selectedFlight.destination.name || selectedFlight.destination.code}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {formatDate(selectedFlight.arriveAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                {/* Amenities */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 2, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Included Amenities
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Luggage sx={{ color: '#14b8a6', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                          Checked Baggage
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          23kg included
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AirlineSeatReclineNormal sx={{ color: '#14b8a6', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                          Seat Selection
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Available at checkout
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocalOffer sx={{ color: '#14b8a6', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                          Flexible Booking
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Free cancellation within 24h
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                {/* Price Breakdown */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 2, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Price Breakdown
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Base Fare
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {formatPrice(selectedFlight.priceTotal * 0.85, selectedFlight.currency)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Taxes & Fees
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {formatPrice(selectedFlight.priceTotal * 0.15, selectedFlight.currency)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        Total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f97316' }}>
                        {formatPrice(selectedFlight.priceTotal, selectedFlight.currency)}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#94a3b8', textAlign: 'center' }}>
                      Price per passenger
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* Drawer Footer */}
            <Box sx={{ 
              p: 3, 
              borderTop: '1px solid #e2e8f0',
              bgcolor: '#f8fafc',
            }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0f9688 0%, #0d7a6f 100%)',
                    boxShadow: '0 6px 20px rgba(20, 184, 166, 0.35)',
                  },
                }}
              >
                Book Now - {formatPrice(selectedFlight.priceTotal, selectedFlight.currency)}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};
