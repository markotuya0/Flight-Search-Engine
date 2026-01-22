import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import { FlightSearchPage } from './features/flightSearch/ui/FlightSearchPage';

const App: React.FC = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <FlightTakeoff 
            sx={{ mr: 2 }} 
            aria-hidden="true"
          />
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ flexGrow: 1 }}
            role="banner"
          >
            Flight Search Engine
          </Typography>
        </Toolbar>
      </AppBar>
      
      <FlightSearchPage />
    </Box>
  );
};

export default App;
