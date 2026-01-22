import React from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Card,
} from '@mui/material';
import {
  Star,
  AttachMoney,
  Speed,
} from '@mui/icons-material';

export type SortOption = 'best' | 'cheapest' | 'fastest';

interface SortControlsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  resultsCount?: number;
}

/**
 * Sort controls for flight results
 * Shows Best/Cheapest/Fastest options with icons
 */
export const SortControls: React.FC<SortControlsProps> = ({
  value,
  onChange,
  resultsCount = 0,
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: SortOption | null,
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Card elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Flight Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resultsCount > 0 ? `${resultsCount} flights found` : 'No flights found'}
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={handleChange}
          aria-label="sort flights"
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              py: 1,
              border: '1.5px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
          }}
        >
          <ToggleButton value="best" aria-label="best flights">
            <Star sx={{ mr: 1, fontSize: 18 }} />
            Best
          </ToggleButton>
          <ToggleButton value="cheapest" aria-label="cheapest flights">
            <AttachMoney sx={{ mr: 1, fontSize: 18 }} />
            Cheapest
          </ToggleButton>
          <ToggleButton value="fastest" aria-label="fastest flights">
            <Speed sx={{ mr: 1, fontSize: 18 }} />
            Fastest
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Card>
  );
};