import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PassengerForm } from './PassengerForm';
import { SeatSelection } from './SeatSelection';
import { PaymentForm } from './PaymentForm';
import { Confirmation } from './Confirmation';

interface BookingFlowProps {
  open: boolean;
  onClose: () => void;
  flightDetails?: {
    origin: string;
    destination: string;
    departAt: string;
    price: number;
    currency: string;
  };
}

const steps = ['Passenger Details', 'Seat Selection', 'Payment', 'Confirmation'];

export const BookingFlow: React.FC<BookingFlowProps> = ({ open, onClose, flightDetails }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [passengerData, setPassengerData] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    setPassengerData(null);
    setSelectedSeat(null);
    setPaymentData(null);
    onClose();
  };

  const handlePassengerSubmit = (data: any) => {
    setPassengerData(data);
    handleNext();
  };

  const handleSeatSelect = (seat: string) => {
    setSelectedSeat(seat);
    handleNext();
  };

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
    handleNext();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PassengerForm onSubmit={handlePassengerSubmit} />;
      case 1:
        return <SeatSelection onSelect={handleSeatSelect} selectedSeat={selectedSeat} />;
      case 2:
        return <PaymentForm onSubmit={handlePaymentSubmit} flightDetails={flightDetails} />;
      case 3:
        return (
          <Confirmation
            passengerData={passengerData}
            selectedSeat={selectedSeat}
            paymentData={paymentData}
            flightDetails={flightDetails}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      sx={{
        zIndex: 9999, // Highest z-index to appear above everything
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? '100vh' : '600px',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
        },
      }}
      disableEscapeKeyDown={false}
      disablePortal={false}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Complete Your Booking
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 3, pt: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel={isMobile}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: '#14b8a6',
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: '#14b8a6',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3, flex: 1 }}>
        {getStepContent(activeStep)}
      </DialogContent>

      {/* Footer - Only show for steps 0-2 */}
      {activeStep < 3 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 3,
            borderTop: '1px solid #e2e8f0',
            bgcolor: '#f8fafc',
          }}
        >
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748b',
              '&:disabled': {
                color: '#cbd5e1',
              },
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={
              (activeStep === 1 && !selectedSeat) ||
              (activeStep === 0 && !passengerData)
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #0f9688 0%, #0d7a6f 100%)',
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
              },
            }}
          >
            {activeStep === 2 ? 'Complete Booking' : 'Continue'}
          </Button>
        </Box>
      )}
    </Dialog>
  );
};
