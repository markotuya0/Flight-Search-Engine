import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import {
  ErrorOutline,
  SearchOff,
  Refresh,
  FlightTakeoff,
} from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * Error state component with retry functionality
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading your data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            {message}
          </Typography>
        </Box>

        {onRetry && (
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRetry}
            size="large"
          >
            {retryLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

/**
 * Empty state component with guidance
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'Try adjusting your search criteria or filters to find more flights.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        {icon || <SearchOff sx={{ fontSize: 64, color: 'text.secondary' }} />}
        
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            {message}
          </Typography>
        </Box>

        {actionLabel && onAction && (
          <Button
            variant="outlined"
            onClick={onAction}
            size="large"
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

/**
 * Welcome state for when no search has been performed
 */
export const WelcomeState: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <FlightTakeoff sx={{ fontSize: 64, color: 'primary.main' }} />
        
        <Box>
          <Typography variant="h5" gutterBottom>
            Find Your Perfect Flight
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
            Search through hundreds of airlines to find the best deals on flights. 
            Enter your departure and destination cities above to get started.
          </Typography>
        </Box>

        <Alert severity="info" sx={{ maxWidth: 400 }}>
          <Typography variant="body2">
            💡 <strong>Pro tip:</strong> Use airport codes like JFK, LAX, LHR for faster searches
          </Typography>
        </Alert>
      </Stack>
    </Paper>
  );
};