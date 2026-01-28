export interface AppHeaderProps {
  isAuthenticated?: boolean;
  userEmail?: string;
  onLogout?: () => void;
}
