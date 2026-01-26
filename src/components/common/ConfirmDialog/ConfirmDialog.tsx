import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { dialogPaperSx, dialogContentSx, dialogActionsSx } from './ConfirmDialog.sx';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Potwierdź',
  cancelText = 'Anuluj',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onCancel}
      PaperProps={{ sx: dialogPaperSx }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={dialogContentSx}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={dialogActionsSx}>
        <Button onClick={onCancel} disabled={isLoading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color={confirmColor}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
