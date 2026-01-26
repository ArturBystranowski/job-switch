export interface RoleCardProps {
  roleId: number;
  roleName: string;
  justification: string;
  variant: 'recommended' | 'alternative';
  onSelect: (roleId: number) => void;
  disabled?: boolean;
}
