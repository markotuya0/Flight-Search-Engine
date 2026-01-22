import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import { FlightSearchPage } from './features/flightSearch/ui/FlightSearchPage';

const App: React.FC = () => {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Cleaner, minimal AppBar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: '56px !important' }}>
          <FlightTakeoff 
            sx={{ mr: 1.5, fontSize: 24 }} 
            aria-hidden="true"
          />
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ 
              flexGrow: 1,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
            role="banner"
          >
            Flight Search
          </Typography>
        </Toolbar>
      </AppBar>
      
      <FlightSearchPage />
    </Box>
  );
};

export default App;
