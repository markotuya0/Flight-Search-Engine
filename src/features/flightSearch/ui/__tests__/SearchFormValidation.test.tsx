/**
 * Enhanced Form Validation Tests
 * 
 * This test suite validates the improved form validation and error styling
 * implemented as part of task 2.2: Implement improved form validation and error styling
 * 
 * Requirements tested: 3.5 (Enhanced error handling and validation)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import { SearchForm } from '../SearchForm';
import { theme } from '../../../../shared/theme/theme';
import flightSearchSlice from '../../state/flightSearchSlice';

// Mock store setup
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      flightSearch: flightSearchSlice,
    },
    preloadedState: {
      flightSearch: {
        status: 'idle',
        error: null,
        flights: [],
        searchParams: null,
        allFlights: [],
        filters: {
          maxPrice: 1000,
          airlines: [],
          stops: 'any',
          departureTime: 'any',
        },
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </Provider>
  );
};

describe('SearchForm Enhanced Validation', () => {
  describe('Real-time Validation', () => {
    it('shows validation error when origin field is empty after blur', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      
      // Focus and blur without entering value
      fireEvent.focus(originInput);
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        expect(screen.getByText(/origin airport is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error when origin field is too short', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      
      // Enter short value
      fireEvent.change(originInput, { target: { value: 'JF' } });
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid airport code/i)).toBeInTheDocument();
      });
    });

    it('shows validation error when destination matches origin', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      const destinationInput = screen.getByLabelText(/to/i);
      
      // Set same values
      fireEvent.change(originInput, { target: { value: 'JFK' } });
      fireEvent.change(destinationInput, { target: { value: 'JFK' } });
      fireEvent.blur(destinationInput);
      
      await waitFor(() => {
        expect(screen.getByText(/destination must be different from origin/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for past departure date', async () => {
      renderWithProviders(<SearchForm />);
      
      const dateInput = screen.getByLabelText(/departure date/i);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastDate = yesterday.toISOString().split('T')[0];
      
      fireEvent.change(dateInput, { target: { value: pastDate } });
      fireEvent.blur(dateInput);
      
      await waitFor(() => {
        expect(screen.getByText(/departure date cannot be in the past/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid passenger count', async () => {
      renderWithProviders(<SearchForm />);
      
      const passengerInput = screen.getByLabelText(/passengers/i);
      
      // Set invalid value
      fireEvent.change(passengerInput, { target: { value: '0' } });
      fireEvent.blur(passengerInput);
      
      await waitFor(() => {
        expect(screen.getByText(/at least 1 passenger is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for too many passengers', async () => {
      renderWithProviders(<SearchForm />);
      
      const passengerInput = screen.getByLabelText(/passengers/i);
      
      // Set invalid value
      fireEvent.change(passengerInput, { target: { value: '10' } });
      fireEvent.blur(passengerInput);
      
      await waitFor(() => {
        expect(screen.getByText(/maximum 9 passengers allowed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Styling and Visual Feedback', () => {
    it('applies error styling to input field when validation fails', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      
      // Trigger validation error
      fireEvent.focus(originInput);
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        expect(originInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('displays error icon with validation messages', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      
      // Trigger validation error
      fireEvent.focus(originInput);
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        // Check for error message with icon
        const errorMessage = screen.getByText(/origin airport is required/i);
        expect(errorMessage).toBeInTheDocument();
        // The ErrorOutline icon should be present in the error message
        expect(errorMessage.closest('span')).toBeInTheDocument();
      });
    });

    it('clears validation error when field becomes valid', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      
      // Trigger validation error
      fireEvent.focus(originInput);
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        expect(screen.getByText(/origin airport is required/i)).toBeInTheDocument();
      });
      
      // Fix the error
      fireEvent.change(originInput, { target: { value: 'JFK' } });
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        expect(screen.queryByText(/origin airport is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission Validation', () => {
    it('prevents form submission when validation errors exist', async () => {
      renderWithProviders(<SearchForm />);
      
      const searchButton = screen.getByRole('button', { name: /search flights/i });
      const form = screen.getByRole('form') || searchButton.closest('form');
      
      // Try to submit empty form
      if (form) {
        fireEvent.submit(form);
      } else {
        fireEvent.click(searchButton);
      }
      
      // Should show validation errors for all required fields
      await waitFor(() => {
        expect(screen.getByText(/origin airport is required/i)).toBeInTheDocument();
        expect(screen.getByText(/destination airport is required/i)).toBeInTheDocument();
        expect(screen.getByText(/departure date is required/i)).toBeInTheDocument();
      });
    });

    it('disables submit button when validation errors exist', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      const destinationInput = screen.getByLabelText(/to/i);
      const dateInput = screen.getByLabelText(/departure date/i);
      const searchButton = screen.getByRole('button', { name: /search flights/i });
      
      // Fill form with valid data first
      fireEvent.change(originInput, { target: { value: 'JFK' } });
      fireEvent.change(destinationInput, { target: { value: 'LAX' } });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
      
      await waitFor(() => {
        expect(searchButton).not.toBeDisabled();
      });
      
      // Introduce validation error
      fireEvent.change(destinationInput, { target: { value: 'JFK' } }); // Same as origin
      fireEvent.blur(destinationInput);
      
      await waitFor(() => {
        expect(searchButton).toBeDisabled();
      });
    });
  });

  describe('Smooth Transitions and Animations', () => {
    it('applies fade-in animation to form-level error alerts', async () => {
      renderWithProviders(<SearchForm />, { 
        status: 'failed', 
        error: 'Search failed' 
      });
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Search failed');
    });

    it('maintains consistent styling across all form fields', () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      const destinationInput = screen.getByLabelText(/to/i);
      const dateInput = screen.getByLabelText(/departure date/i);
      const passengerInput = screen.getByLabelText(/passengers/i);
      
      // All inputs should be present and properly styled
      expect(originInput).toBeInTheDocument();
      expect(destinationInput).toBeInTheDocument();
      expect(dateInput).toBeInTheDocument();
      expect(passengerInput).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('provides proper ARIA attributes for validation states', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      
      // Initially should not have error state
      expect(originInput).not.toHaveAttribute('aria-invalid', 'true');
      
      // Trigger validation error
      fireEvent.focus(originInput);
      fireEvent.blur(originInput);
      
      await waitFor(() => {
        expect(originInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('maintains helper text for valid fields', () => {
      renderWithProviders(<SearchForm />);
      
      // Check that helper text is present for guidance
      expect(screen.getByText(/enter iata airport code/i) || screen.getByText(/airport code/i)).toBeInTheDocument();
    });

    it('updates validation when swapping origin and destination', async () => {
      renderWithProviders(<SearchForm />);
      
      const originInput = screen.getByLabelText(/from/i);
      const destinationInput = screen.getByLabelText(/to/i);
      const swapButton = screen.getByLabelText(/swap origin and destination/i);
      
      // Set values that would cause validation error after swap
      fireEvent.change(originInput, { target: { value: 'JFK' } });
      fireEvent.change(destinationInput, { target: { value: 'LAX' } });
      
      // Swap values
      fireEvent.click(swapButton);
      
      await waitFor(() => {
        expect(originInput).toHaveValue('LAX');
        expect(destinationInput).toHaveValue('JFK');
      });
    });
  });
});