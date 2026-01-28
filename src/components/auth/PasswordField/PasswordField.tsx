import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { textFieldSx, iconButtonSx } from './PasswordField.sx';
import type { PasswordFieldProps } from './PasswordField.types';

export const PasswordField = ({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  disabled = false,
  autoComplete = 'current-password',
  placeholder,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      sx={textFieldSx}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
              onClick={handleToggleVisibility}
              onMouseDown={handleMouseDown}
              edge="end"
              disabled={disabled}
              sx={iconButtonSx}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
