import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Stack,
} from '@mui/material';

interface FiltersPanelProps {
  isMobile?: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ isMobile = false }) => {
  const [priceRange, setPriceRange] = React.useState<number[]>([100, 1000]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  return (
    <Paper 
      elevation={isMobile ? 0 : 1} 
      sx={{ 
        p: 3, 
        height: 'fit-content',
        backgroundColor: isMobile ? 'transparent' : 'background.paper'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          valueLabelFormat={(value) => `$${value}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">${priceRange[0]}</Typography>
          <Typography variant="caption">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Airlines */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Airlines</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="American Airlines"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Delta"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="United"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Southwest"
            />
          </FormGroup>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stops */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Stops</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Non-stop"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="1 stop"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="2+ stops"
            />
          </FormGroup>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Departure Time */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Departure Time
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Morning (6AM-12PM)" variant="outlined" clickable />
          <Chip label="Afternoon (12PM-6PM)" variant="outlined" clickable />
          <Chip label="Evening (6PM-12AM)" variant="outlined" clickable />
          <Chip label="Night (12AM-6AM)" variant="outlined" clickable />
        </Stack>
      </Box>
    </Paper>
  );
};