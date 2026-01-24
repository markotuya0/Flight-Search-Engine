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
  
  // Refs to access form validation
  const passengerFormRef = React.useRef<any>(null);
  const paymentFormRef = React.useRef<any>(null);

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
  };

  const handleSeatSelect = (seat: string) => {
    setSelectedSeat(seat);
  };

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (activeStep === 0) {
      // Passenger form - trigger validation
      if (passengerFormRef.current?.validate()) {
        handleNext();
      }
    } else if (activeStep === 1) {
      // Seat selection - just advance if seat is selected
      if (selectedSeat) {
        handleNext();
      }
    } else if (activeStep === 2) {
      // Payment form - trigger validation
      if (paymentFormRef.current?.validate()) {
        handleNext();
      }
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PassengerForm ref={passengerFormRef} onSubmit={handlePassengerSubmit} />;
      case 1:
        return <SeatSelection onSelect={handleSeatSelect} selectedSeat={selectedSeat} />;
      case 2:
        return <PaymentForm ref={paymentFormRef} onSubmit={handlePaymentSubmit} flightDetails={flightDetails} />;
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
        '& .MuiDialog-container': {
          zIndex: 9999,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '90vh',
          height: isMobile ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          m: isMobile ? 0 : 2,
          width: '100%',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
      disableEscapeKeyDown={false}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 },
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#0f172a', 
            fontSize: { xs: '1rem', sm: '1.125rem' } 
          }}
        >
          Complete Your Booking
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: { xs: 1, sm: 2 }, pt: { xs: 1.5, sm: 2 }, pb: 1, flexShrink: 0 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                    mt: { xs: 0.5, sm: 1 },
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
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
      <DialogContent 
        sx={{ 
          p: { xs: 1.5, sm: 2 },
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94a3b8',
          },
        }}
      >
        <Box sx={{ maxWidth: '100%', width: '100%' }}>
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>

      {/* Footer - Only show for steps 0-2 */}
      {activeStep < 3 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: { xs: 1.5, sm: 2 },
            borderTop: '1px solid #e2e8f0',
            bgcolor: '#f8fafc',
            flexShrink: 0,
            gap: 1,
          }}
        >
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748b',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minWidth: { xs: '70px', sm: '80px' },
              '&:disabled': {
                color: '#cbd5e1',
              },
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            variant="contained"
            disabled={activeStep === 1 && !selectedSeat}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #14b8a6 0%, #0f9688 100%)',
              px: { xs: 2, sm: 4 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
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
