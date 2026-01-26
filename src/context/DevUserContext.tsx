import { createContext, useContext, type ReactNode } from 'react';

/**
 * Hardcoded dev user ID from database seed
 * In MVP, we don't have authentication, so we use this fixed user
 */
const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

interface DevUserContextValue {
  userId: string;
}

const DevUserContext = createContext<DevUserContextValue>({ userId: DEV_USER_ID });

interface DevUserProviderProps {
  children: ReactNode;
}

export const DevUserProvider = ({ children }: DevUserProviderProps) => {
  return (
    <DevUserContext.Provider value={{ userId: DEV_USER_ID }}>
      {children}
    </DevUserContext.Provider>
  );
};

export const useDevUser = (): DevUserContextValue => {
  const context = useContext(DevUserContext);
  if (!context) {
    throw new Error('useDevUser must be used within DevUserProvider');
  }
  return context;
};
