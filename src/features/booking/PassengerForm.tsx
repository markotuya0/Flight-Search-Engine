import React, { useState } from 'react';
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

export const PassengerForm: React.FC<PassengerFormProps> = ({ onSubmit }) => {
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Auto-submit when all fields are valid
  React.useEffect(() => {
    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');
    if (allFieldsFilled && Object.keys(errors).length === 0) {
      handleSubmit();
    }
  }, [formData]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#0f172a' }}>
        Passenger Information
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
        Please enter the passenger details as they appear on the travel document
      </Typography>

      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
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
};
