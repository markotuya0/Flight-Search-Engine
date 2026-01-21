import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';

const App: React.FC = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
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
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          role="main"
        >
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center"
            color="text.primary"
          >
            Flight Search
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default App;
