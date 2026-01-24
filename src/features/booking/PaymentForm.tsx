import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Stack,
  Paper,
  Divider,
} from '@mui/material';
import {
  CreditCard,
  Lock,
} from '@mui/icons-material';

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  flightDetails?: {
    origin: string;
    destination: string;
    departAt: string;
    price: number;
    currency: string;
  };
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, flightDetails }) => {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<PaymentData>>({});

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleChange = (field: keyof PaymentData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;

    if (field === 'cardNumber') {
      value = formatCardNumber(value.replace(/\s/g, '').slice(0, 16));
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<PaymentData> = {};

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Auto-submit when all fields are valid
  React.useEffect(() => {
    const allFieldsFilled =
      formData.cardNumber.replace(/\s/g, '').length === 16 &&
      formData.cardName.trim() !== '' &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length === 3;

    if (allFieldsFilled && Object.keys(errors).length === 0) {
      handleSubmit();
    }
  }, [formData]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#0f172a' }}>
        Payment Information
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
        Your payment is secure and encrypted
      </Typography>

      {/* Price Summary */}
      {flightDetails && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: '#f0fdfa',
            border: '1px solid #99f6e4',
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Flight
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                {flightDetails.origin} → {flightDetails.destination}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Seat Selection
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                Included
              </Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Total
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#14b8a6' }}>
                {formatPrice(flightDetails.price, flightDetails.currency)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Payment Form */}
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Card Number"
          value={formData.cardNumber}
          onChange={handleChange('cardNumber')}
          error={!!errors.cardNumber}
          helperText={errors.cardNumber}
          placeholder="1234 5678 9012 3456"
          InputProps={{
            startAdornment: <CreditCard sx={{ mr: 1, color: '#64748b' }} />,
          }}
          required
        />

        <TextField
          fullWidth
          label="Cardholder Name"
          value={formData.cardName}
          onChange={handleChange('cardName')}
          error={!!errors.cardName}
          helperText={errors.cardName}
          placeholder="JOHN DOE"
          required
        />

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Expiry Date"
            value={formData.expiryDate}
            onChange={handleChange('expiryDate')}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate}
            placeholder="MM/YY"
            required
          />
          <TextField
            fullWidth
            label="CVV"
            value={formData.cvv}
            onChange={handleChange('cvv')}
            error={!!errors.cvv}
            helperText={errors.cvv}
            placeholder="123"
            type="password"
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: '#64748b', fontSize: 18 }} />,
            }}
            required
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: '#f8fafc',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Lock sx={{ fontSize: 16, color: '#64748b' }} />
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          Your payment information is encrypted and secure
        </Typography>
      </Box>
    </Box>
  );
};
