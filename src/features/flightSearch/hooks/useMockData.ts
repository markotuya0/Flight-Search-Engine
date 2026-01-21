import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setFlights } from '../state/flightSearchSlice';
import { mockFlights } from '../data/mockFlights';

/**
 * Hook to initialize mock flight data in development
 * This should only be used in development mode
 */
export const useMockData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only load mock data in development
    if (import.meta.env.DEV) {
      console.log('Loading mock flight data...', mockFlights.length, 'flights');
      dispatch(setFlights(mockFlights));
    }
  }, [dispatch]);
};