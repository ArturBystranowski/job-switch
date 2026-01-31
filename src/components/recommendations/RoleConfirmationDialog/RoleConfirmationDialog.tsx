import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  dialogPaperSx,
  dialogTitleSx,
  dialogContentSx,
  warningBoxSx,
  warningTextSx,
  checkboxLabelSx,
  dialogActionsSx,
  confirmButtonSx,
} from './RoleConfirmationDialog.sx';
import type { RoleConfirmationDialogProps } from './RoleConfirmationDialog.types';

export const RoleConfirmationDialog = ({
  open,
  roleName,
  onConfirm,
  onCancel,
  isLoading = false,
}: RoleConfirmationDialogProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleCancel = useCallback(() => {
    setConfirmed(false);
    onCancel();
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmed(event.target.checked);
    },
    []
  );

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleCancel}
      PaperProps={{ sx: dialogPaperSx }}
    >
      <DialogTitle sx={dialogTitleSx}>Potwierdź wybór roli</DialogTitle>
      <DialogContent sx={dialogContentSx}>
        <DialogContentText>
          Czy na pewno chcesz wybrać rolę <strong>{roleName}</strong>?
        </DialogContentText>
        <Box sx={warningBoxSx}>
          <Typography sx={warningTextSx}>
            <WarningAmberIcon
              sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }}
            />
            Ten wybór jest ostateczny i nie będzie można go zmienić.
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={handleCheckboxChange}
              disabled={isLoading}
              color='primary'
              inputProps={
                {
                  'data-testid': 'role-confirm-checkbox',
                } as React.InputHTMLAttributes<HTMLInputElement>
              }
            />
          }
          label={
            <Typography sx={checkboxLabelSx}>
              Rozumiem, że wybór jest ostateczny
            </Typography>
          }
        />
      </DialogContent>
      <DialogActions sx={dialogActionsSx}>
        <Button onClick={handleCancel} disabled={isLoading} variant='outlined'>
          Anuluj
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!confirmed || isLoading}
          variant='contained'
          color='primary'
          sx={confirmButtonSx}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color='inherit' />
            ) : undefined
          }
        >
          Potwierdź wybór
        </Button>
      </DialogActions>
    </Dialog>
  );
};
