import React from 'react';
import {
  Box,
  Paper,
  Typography,
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
import { selectPriceSeries } from '../state/selectors';

/**
 * Real-time price graph that updates based on filtered flights
 * Shows minimum price by departure hour
 */
export const PriceGraph: React.FC = () => {
  const priceSeries = useAppSelector(selectPriceSeries);

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
          <Typography variant="body2" color="primary">
            Min Price: ${price}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Price by Departure Time
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {priceSeries.length > 0 ? `${priceSeries.length} time slots` : 'No data'}
        </Typography>
      </Box>

      <Box sx={{ height: 300, width: '100%' }}>
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
            <Typography variant="h6" gutterBottom>
              No Price Data Available
            </Typography>
            <Typography variant="body2">
              Adjust your filters to see price trends by departure time
            </Typography>
          </Box>
        ) : (
          // Chart with data
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceSeries} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12 }}
                tickFormatter={formatHour}
                domain={['dataMin', 'dataMax']}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                domain={['dataMin - 50', 'dataMax + 50']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="minPrice" 
                stroke="#1976d2" 
                strokeWidth={3}
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {priceSeries.length > 0 
          ? 'Shows minimum price for each departure hour from filtered results. Early morning and late evening flights are often cheaper.'
          : 'This graph will show price trends by departure time when flights match your filters.'
        }
      </Typography>
    </Paper>
  );
};