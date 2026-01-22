import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useAppSelector } from '../../../app/hooks';
import { selectAllFlights } from '../state/selectors';
import type { Flight } from '../domain/types';

// Helper function to format duration from minutes to "Xh Ym"
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper function to format price as currency
const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

// Helper function to format date/time
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Helper function to get stops display
const getStopsDisplay = (stops: number): string => {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

export const ResultsGrid: React.FC = () => {
  const flights = useAppSelector(selectAllFlights);

  // Transform flights data for DataGrid
  const rows = flights.map((flight: Flight) => ({
    id: flight.id,
    airline: flight.airlineCodes.join(', '),
    airlineDisplay: flight.airlineCodes[0], // For avatar display
    depart: formatDateTime(flight.departAt),
    departSort: new Date(flight.departAt).getTime(), // For sorting
    arrive: formatDateTime(flight.arriveAt),
    arriveSort: new Date(flight.arriveAt).getTime(), // For sorting
    stops: getStopsDisplay(flight.stops),
    stopsSort: flight.stops, // For sorting
    duration: formatDuration(flight.durationMinutes),
    durationSort: flight.durationMinutes, // For sorting
    price: formatPrice(flight.priceTotal, flight.currency),
    priceSort: flight.priceTotal, // For sorting
    origin: flight.origin.code,
    destination: flight.destination.code,
    route: `${flight.origin.code} → ${flight.destination.code}`,
  }));

  const columns: GridColDef[] = [
    {
      field: 'airline',
      headerName: 'Airline',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
            {params.row.airlineDisplay}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'route',
      headerName: 'Route',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'depart',
      headerName: 'Departure',
      width: 130,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'departSort') - param2.api.getCellValue(param2.id, 'departSort');
      },
    },
    {
      field: 'arrive',
      headerName: 'Arrival',
      width: 130,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'arriveSort') - param2.api.getCellValue(param2.id, 'arriveSort');
      },
    },
    {
      field: 'stops',
      headerName: 'Stops',
      width: 100,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'stopsSort') - param2.api.getCellValue(param2.id, 'stopsSort');
      },
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={params.row.stopsSort === 0 ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 100,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'durationSort') - param2.api.getCellValue(param2.id, 'durationSort');
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      sortComparator: (_v1, _v2, param1, param2) => {
        return param1.api.getCellValue(param1.id, 'priceSort') - param2.api.getCellValue(param2.id, 'priceSort');
      },
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Flight Results ({flights.length} flights found)
        </Typography>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'price', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'grey.50',
              borderBottom: '2px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>
    </Paper>
  );
};