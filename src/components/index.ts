export { WelcomeCard } from './WelcomeCard';
export type { WelcomeCardProps } from './WelcomeCard.types';

// Common components
export {
  LoadingSpinner,
  ErrorAlert,
  ConfirmDialog,
  AILoadingOverlay,
} from './common';
export type {
  LoadingSpinnerProps,
  ErrorAlertProps,
  ConfirmDialogProps,
  AILoadingOverlayProps,
} from './common';

// Landing components
export { LandingHero, StepsPreview } from './landing';
export type { LandingHeroProps } from './landing';

// Questionnaire components
export { QuestionnaireStepper, QuestionCard, OptionSelector } from './questionnaire';
export type {
  QuestionnaireStepperProps,
  QuestionCardProps,
  OptionSelectorProps,
  OptionItem,
} from './questionnaire';

// CV Upload components
export { CVDropzone, CVPreview, UploadWarningBanner } from './cv-upload';
export type { CVDropzoneProps, CVPreviewProps } from './cv-upload';

// Recommendations components
export { RecommendationBadge, RoleCard, RoleConfirmationDialog } from './recommendations';
export type {
  RecommendationBadgeProps,
  RoleCardProps,
  RoleConfirmationDialogProps,
} from './recommendations';

// Profile components
export {
  ProfileSection,
  QuestionnaireAnswers,
  SelectedRoleCard,
  ProgressSummary,
} from './profile';
export type {
  ProfileSectionProps,
  QuestionnaireAnswersProps,
  SelectedRoleCardProps,
  ProgressSummaryProps,
} from './profile';
