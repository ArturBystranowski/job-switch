export interface RoleConfirmationDialogProps {
  open: boolean;
  roleName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
