import { useState } from 'react';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  avatarButtonSx,
  avatarSx,
  menuSx,
  emailTextSx,
  logoutItemSx,
} from './UserMenu.sx';
import type { UserMenuProps } from './UserMenu.types';

const getInitials = (email?: string): string => {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
};

export const UserMenu = ({ userEmail, onLogout }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout?.();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={avatarButtonSx}
        aria-label="Menu użytkownika"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={avatarSx}>{getInitials(userEmail)}</Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={menuSx}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {userEmail && (
          <Box>
            <Typography sx={emailTextSx}>{userEmail}</Typography>
            <Divider />
          </Box>
        )}
        <MenuItem onClick={handleLogout} sx={logoutItemSx}>
          <LogoutIcon fontSize="small" sx={{ marginRight: '0.5rem' }} />
          Wyloguj się
        </MenuItem>
      </Menu>
    </>
  );
};
