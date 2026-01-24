import React, { lazy, Suspense } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Avatar,
  IconButton,
  Stack,
  TextField,
  Button,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  FlightTakeoff, 
  Language, 
  Person,
  Menu as MenuIcon,
  Facebook,
  Twitter,
  Instagram,
} from '@mui/icons-material';
import { FlightGridSkeleton } from './shared/components';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectBookingOpen, selectSelectedFlightForBooking } from './features/flightSearch/state/selectors';
import { closeBookingFlow } from './features/flightSearch/state/flightSearchSlice';
import { BookingFlow } from './features/booking';

// Lazy load the FlightSearchPage for code splitting
const FlightSearchPage = lazy(() => import('./features/flightSearch/ui/FlightSearchPage').then(module => ({ default: module.FlightSearchPage })));

const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const bookingOpen = useAppSelector(selectBookingOpen);
  const selectedFlight = useAppSelector(selectSelectedFlightForBooking);
  
  const handleCloseBooking = () => {
    dispatch(closeBookingFlow());
  };

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Modern Header */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          bgcolor: '#ffffff',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: '64px !important', px: { xs: 0, sm: 2 } }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
              <FlightTakeoff 
                sx={{ fontSize: 32, color: '#14b8a6' }} 
                aria-hidden="true"
              />
              <Typography 
                variant="h6" 
                component="h1" 
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#14b8a6',
                  letterSpacing: '-0.02em',
                }}
                role="banner"
              >
                E-flight
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={2} alignItems="center">
              {!isMobile && (
                <>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    USD
                  </Typography>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Language />
                  </IconButton>
                </>
              )}
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#14b8a6',
                  cursor: 'pointer',
                }}
              >
                <Person sx={{ fontSize: 20 }} />
              </Avatar>
              {isMobile && (
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Suspense fallback={<Container maxWidth="xl" sx={{ py: 4 }}><FlightGridSkeleton /></Container>}>
        <FlightSearchPage />
      </Suspense>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#ffffff',
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          mt: 8,
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 4,
            mb: 4,
          }}>
            {/* Brand & Newsletter */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <FlightTakeoff sx={{ fontSize: 32, color: '#14b8a6' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#14b8a6' }}>
                  E-flight
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Input your email"
                  sx={{ 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    bgcolor: '#14b8a6',
                    '&:hover': { bgcolor: '#0f9688' },
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>

            {/* About us */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                About us
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                  How to book
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                  Help center
                </Link>
              </Stack>
            </Box>

            {/* Flight */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Flight
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                  Booking easily
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: '0.875rem', '&:hover': { color: 'primary.main' } }}>
                  Promotions
                </Link>
              </Stack>
            </Box>

            {/* Contact us */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Contact us
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: theme.palette.grey[100],
                    '&:hover': { bgcolor: theme.palette.grey[200] },
                  }}
                >
                  <Facebook sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: theme.palette.grey[100],
                    '&:hover': { bgcolor: theme.palette.grey[200] },
                  }}
                >
                  <Twitter sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: theme.palette.grey[100],
                    '&:hover': { bgcolor: theme.palette.grey[200] },
                  }}
                >
                  <Instagram sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ borderTop: `1px solid ${theme.palette.grey[200]}`, pt: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', display: 'block' }}>
              © 2022 Company, Inc. • Privacy • Terms
            </Typography>
          </Box>
        </Container>
      </Box>
      
      {/* Booking Flow - Mounted at App level for proper z-index */}
      <BookingFlow
        open={bookingOpen}
        onClose={handleCloseBooking}
        flightDetails={
          selectedFlight
            ? {
                origin: selectedFlight.origin.code,
                destination: selectedFlight.destination.code,
                departAt: selectedFlight.departAt,
                price: selectedFlight.priceTotal,
                currency: selectedFlight.currency,
              }
            : undefined
        }
      />
    </Box>
  );
};

export default App;
