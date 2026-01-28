import { Outlet } from 'react-router-dom';
import { AuthProvider, DevUserProvider } from '../../../context';
import type { RootLayoutProps } from './RootLayout.types';

export const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <AuthProvider>
      <DevUserProvider>{children ?? <Outlet />}</DevUserProvider>
    </AuthProvider>
  );
};
