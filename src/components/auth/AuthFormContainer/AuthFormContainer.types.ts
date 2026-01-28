import type { ReactNode } from 'react';

export interface AuthFormContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}
