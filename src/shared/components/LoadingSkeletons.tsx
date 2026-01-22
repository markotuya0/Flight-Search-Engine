import React from 'react';
import { 
  Box, 
  Skeleton, 
  Paper, 
  Stack,
  useTheme,
  useMediaQuery 
} from '@mui/material';

/**
 * Loading skeleton for the flight results grid
 */
export const FlightGridSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    // Mobile: Card-based skeleton
    return (
      <Box>
        {Array.from({ length: 6 }).map((_, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width={80} height={24} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ ml: 'auto' }} />
                  <Skeleton variant="text" width="40%" height={16} sx={{ ml: 'auto' }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={40} height={16} />
                <Skeleton variant="text" width={80} height={24} />
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>
    );
  }

  // Desktop: DataGrid skeleton
  return (
    <Paper elevation={1} sx={{ height: 400, p: 2 }}>
      {/* Header row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="text" width={80} height={24} />
      </Box>
      
      {/* Data rows */}
      {Array.from({ length: 8 }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'center' }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      ))}
    </Paper>
  );
};

/**
 * Loading skeleton for the price graph
 */
export const PriceGraphSkeleton: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="text" width={100} height={20} />
      </Box>
      
      <Box sx={{ height: 300, width: '100%', position: 'relative' }}>
        {/* Y-axis labels */}
        <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 2 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} variant="text" width={40} height={16} />
          ))}
        </Box>
        
        {/* Chart area */}
        <Box sx={{ ml: 6, mr: 2, height: '100%', position: 'relative' }}>
          {/* Grid lines */}
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width="100%" height={1} />
            ))}
          </Box>
          
          {/* Chart line simulation */}
          <Box sx={{ position: 'absolute', top: '30%', left: 0, right: 0, height: 2 }}>
            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
          </Box>
          
          {/* Data points */}
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} variant="circular" width={8} height={8} />
            ))}
          </Box>
        </Box>
        
        {/* X-axis labels */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 6, right: 2, display: 'flex', justifyContent: 'space-between' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="text" width={30} height={16} />
          ))}
        </Box>
      </Box>
      
      <Skeleton variant="text" width="80%" height={16} sx={{ mt: 2 }} />
    </Paper>
  );
};

/**
 * Loading skeleton for filters panel
 */
export const FiltersPanelSkeleton: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, height: 'fit-content' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="text" width={80} height={32} />
        <Skeleton variant="text" width={60} height={24} />
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={100} height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={4} sx={{ borderRadius: 2, mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={40} height={16} />
          <Skeleton variant="text" width={40} height={16} />
        </Box>
      </Box>

      {/* Airlines */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Stops */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={60} height={20} sx={{ mb: 1 }} />
        {Array.from({ length: 3 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Skeleton variant="rectangular" width={18} height={18} sx={{ mr: 1, borderRadius: 0.5 }} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};