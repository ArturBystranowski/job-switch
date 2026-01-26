export interface VariantBranchProps {
  variantId: number;
  title: string;
  isCompleted: boolean;
  isRecommended: boolean;
  onClick: () => void;
}
