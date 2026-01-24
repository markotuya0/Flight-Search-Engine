import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import {
  AirlineSeatReclineNormal,
  EventSeat,
} from '@mui/icons-material';

interface SeatSelectionProps {
  onSelect: (seat: string) => void;
  selectedSeat: string | null;
}

const ROWS = 20;
const SEATS_PER_ROW = ['A', 'B', 'C', '', 'D', 'E', 'F']; // Empty string for aisle

// Mock some occupied seats
const OCCUPIED_SEATS = new Set([
  '1A', '1B', '2C', '3D', '4E', '5F', '6A', '7B', '8C', '9D',
  '10E', '11F', '12A', '13B', '14C', '15D',
]);

export const SeatSelection: React.FC<SeatSelectionProps> = ({ onSelect, selectedSeat }) => {
  const getSeatStatus = (row: number, seat: string): 'available' | 'occupied' | 'selected' => {
    const seatId = `${row}${seat}`;
    if (seatId === selectedSeat) return 'selected';
    if (OCCUPIED_SEATS.has(seatId)) return 'occupied';
    return 'available';
  };

  const getSeatColor = (status: 'available' | 'occupied' | 'selected'): string => {
    switch (status) {
      case 'selected':
        return '#14b8a6';
      case 'occupied':
        return '#e2e8f0';
      case 'available':
        return '#ffffff';
    }
  };

  const handleSeatClick = (row: number, seat: string) => {
    const seatId = `${row}${seat}`;
    if (!OCCUPIED_SEATS.has(seatId)) {
      onSelect(seatId);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>
        Select Your Seat
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: '#64748b', fontSize: '0.875rem' }}>
        Choose your preferred seat from the available options
      </Typography>

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: '#ffffff',
              border: '2px solid #cbd5e1',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
            Available
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: '#14b8a6',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
            Selected
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: '#e2e8f0',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
            Occupied
          </Typography>
        </Stack>
      </Stack>

      {/* Seat Map */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          maxHeight: '300px',
          overflow: 'auto',
        }}
      >
        {/* Column Headers */}
        <Stack direction="row" spacing={1} sx={{ mb: 1, justifyContent: 'center' }}>
          {SEATS_PER_ROW.map((seat, idx) => (
            <Box
              key={idx}
              sx={{
                width: 32,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.7rem',
                color: '#64748b',
              }}
            >
              {seat}
            </Box>
          ))}
        </Stack>

        {/* Rows */}
        {Array.from({ length: ROWS }, (_, rowIdx) => {
          const row = rowIdx + 1;
          return (
            <Stack
              key={row}
              direction="row"
              spacing={1}
              sx={{ mb: 0.5, justifyContent: 'center', alignItems: 'center' }}
            >
              {SEATS_PER_ROW.map((seat, seatIdx) => {
                if (seat === '') {
                  // Aisle space
                  return (
                    <Box
                      key={seatIdx}
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.7rem' }}>
                        {row}
                      </Typography>
                    </Box>
                  );
                }

                const status = getSeatStatus(row, seat);
                const isDisabled = status === 'occupied';

                return (
                  <Box
                    key={seatIdx}
                    onClick={() => !isDisabled && handleSeatClick(row, seat)}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: getSeatColor(status),
                      border: status === 'available' ? '2px solid #cbd5e1' : 'none',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': !isDisabled
                        ? {
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
                          }
                        : {},
                    }}
                  >
                    <EventSeat
                      sx={{
                        fontSize: 16,
                        color:
                          status === 'selected'
                            ? '#ffffff'
                            : status === 'occupied'
                            ? '#94a3b8'
                            : '#64748b',
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          );
        })}
      </Paper>

      {selectedSeat && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip
            icon={<AirlineSeatReclineNormal />}
            label={`Selected Seat: ${selectedSeat}`}
            sx={{
              bgcolor: '#d1fae5',
              color: '#065f46',
              fontWeight: 600,
              fontSize: '0.8rem',
              py: 2,
              px: 1,
            }}
          />
        </Box>
      )}
    </Box>
  );
};
