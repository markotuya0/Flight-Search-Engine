import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  TextField,
  Typography,
  Stack,
  MenuItem,
} from '@mui/material';

interface PassengerFormProps {
  onSubmit: (data: PassengerData) => void;
}

interface PassengerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

export const PassengerForm = forwardRef<any, PassengerFormProps>(({ onSubmit }, ref) => {
  const [formData, setFormData] = useState<PassengerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  const [errors, setErrors] = useState<Partial<PassengerData>>({});

  const handleChange = (field: keyof PassengerData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<PassengerData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      return true;
    }
    return false;
  };

  // Expose validate method to parent via ref
  useImperativeHandle(ref, () => ({
    validate,
  }));

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>
        Passenger Information
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: '#64748b', fontSize: '0.875rem' }}>
        Please enter the passenger details as they appear on the travel document
      </Typography>

      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
            size="small"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
            size="small"
          />
        </Stack>

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          required
          size="small"
        />

        <TextField
          fullWidth
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          error={!!errors.phone}
          helperText={errors.phone}
          placeholder="+1 (555) 123-4567"
          required
          size="small"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
          <TextField
            fullWidth
            select
            label="Gender"
            value={formData.gender}
            onChange={handleChange('gender')}
            error={!!errors.gender}
            helperText={errors.gender}
            required
            size="small"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
          </TextField>
        </Stack>
      </Stack>
    </Box>
  );
});
