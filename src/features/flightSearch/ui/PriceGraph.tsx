import React from 'react';
import {
  Box,
  Card,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '../../../app/hooks';
import { selectPriceSeries, selectStatus, selectAllFlights } from '../state/selectors';
import { PriceGraphSkeleton, EmptyState } from '../../../shared/components';
import { TrendingUp } from '@mui/icons-material';

/**
 * Real-time price graph that updates based on filtered flights
 * Shows minimum price by departure hour
 */
export const PriceGraph: React.FC = () => {
  const priceSeries = useAppSelector(selectPriceSeries);
  const status = useAppSelector(selectStatus);
  const allFlights = useAppSelector(selectAllFlights);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Loading state
  if (status === 'loading') {
    return <PriceGraphSkeleton />;
  }

  // No search performed yet
  if (status === 'idle' || allFlights.length === 0) {
    return (
      <Card 
        elevation={0} 
        sx={{ 
          p: 3, 
          mt: 3,
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Price by Departure Time
        </Typography>
        <EmptyState
          title="Price trends will appear here"
          message="Search for flights to see how prices vary by departure time throughout the day."
          icon={<TrendingUp sx={{ fontSize: 64, color: 'text.secondary' }} />}
        />
      </Card>
    );
  }

  // Format hour for display (e.g., 0 -> "12 AM", 13 -> "1 PM")
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hour = label;
      const price = payload[0].value;
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1.5, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {formatHour(hour)}
          </Typography>
          <Typography variant="body2" sx={{ color: '#14b8a6', fontWeight: 600 }}>
            Min Price: ${price}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 3,
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ mb: { xs: 2, md: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Price Trend for Filtered Results
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
          Minimum price per departure hour • Updates with your filters • {priceSeries.length > 0 ? `${priceSeries.length} time slots` : 'No data'}
        </Typography>
      </Box>

      <Box sx={{ 
        height: { xs: 250, sm: 300, md: 350 }, 
        width: '100%', 
        minHeight: { xs: 250, md: 300 },
        overflowX: 'auto',
      }}>
        {priceSeries.length === 0 ? (
          // Empty state
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              No Price Data Available
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
              Adjust your filters to see price trends by departure time
            </Typography>
          </Box>
        ) : (
          // Chart with data
          <ResponsiveContainer width="100%" height="100%" minWidth={isMobile ? 600 : undefined}>
            <LineChart 
              data={priceSeries} 
              margin={{ 
                top: 5, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 0 : 20, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748b' }}
                tickFormatter={formatHour}
                domain={['dataMin', 'dataMax']}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748b' }}
                tickFormatter={(value) => `$${value}`}
                domain={[
                  (dataMin: number) => Math.max(0, Math.floor(dataMin * 0.9)),
                  (dataMax: number) => Math.ceil(dataMax * 1.1)
                ]}
                stroke="#cbd5e1"
                width={isMobile ? 50 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="minPrice" 
                stroke="#14b8a6" 
                strokeWidth={isMobile ? 2 : 3}
                dot={{ fill: '#14b8a6', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                activeDot={{ r: isMobile ? 5 : 6, stroke: '#14b8a6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mt: { xs: 2, md: 3 }, 
          fontStyle: 'italic',
          fontSize: { xs: '0.75rem', md: '0.875rem' },
        }}
      >
        {priceSeries.length > 0 
          ? 'Early morning and late evening flights are often cheaper. Hover over points for details.'
          : 'This graph will show price trends by departure time when flights match your filters.'
        }
      </Typography>
    </Card>
  );
};
