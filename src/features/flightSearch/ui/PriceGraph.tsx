import React from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Mock price trend data
const mockPriceData = [
  { date: 'Jan 15', price: 299, day: 'Mon' },
  { date: 'Jan 16', price: 279, day: 'Tue' },
  { date: 'Jan 17', price: 259, day: 'Wed' },
  { date: 'Jan 18', price: 289, day: 'Thu' },
  { date: 'Jan 19', price: 349, day: 'Fri' },
  { date: 'Jan 20', price: 399, day: 'Sat' },
  { date: 'Jan 21', price: 379, day: 'Sun' },
];

const mockMonthlyData = [
  { month: 'Jan', price: 299 },
  { month: 'Feb', price: 279 },
  { month: 'Mar', price: 259 },
  { month: 'Apr', price: 289 },
  { month: 'May', price: 349 },
  { month: 'Jun', price: 399 },
];

export const PriceGraph: React.FC = () => {
  const [viewType, setViewType] = React.useState<'week' | 'month'>('week');

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: 'week' | 'month' | null,
  ) => {
    if (newView !== null) {
      setViewType(newView);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Price Trends
        </Typography>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="week">
            7 Days
          </ToggleButton>
          <ToggleButton value="month">
            6 Months
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'week' ? (
            <LineChart data={mockPriceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value ? [`$${value}`, 'Price'] : ['', '']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#1976d2" 
                strokeWidth={3}
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value ? [`$${value}`, 'Average Price'] : ['', '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey="price" 
                fill="#1976d2"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {viewType === 'week' 
          ? 'Prices for the next 7 days. Best deals typically on Tuesday and Wednesday.'
          : 'Average monthly prices. Book 2-3 months in advance for best deals.'
        }
      </Typography>
    </Paper>
  );
};