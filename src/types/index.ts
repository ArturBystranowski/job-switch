/**
 * Types Module Entry Point
 *
 * Re-exports all types from the types module for convenient importing
 */

// Database entity types (auto-generated from Supabase)
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  CompositeTypes,
  Json,
} from './database.types';

// DTO and Command Model types
export type {
  // Entity aliases
  ProfileEntity,
  RoleEntity,
  RoadmapStepEntity,
  StepVariantEntity,
  UserStepProgressEntity,

  // Enum types
  WorkStyle,
  ClientInteraction,
  AestheticFocus,
  TeamworkPreference,
  ProblemSolvingApproach,
  ResourceLinkType,
  MissingRequirement,
  BusinessErrorCode,

  // Questionnaire types
  QuestionnaireResponsesDTO,
  PartialQuestionnaireResponsesDTO,
  QuestionnaireOptionDTO,
  QuestionnaireQuestionDTO,
  QuestionnaireConfigDTO,

  // AI Recommendations types
  AIRecommendationDTO,
  AIRecommendationsDTO,

  // Resource types
  ResourceLinkDTO,
  ResourcesDTO,

  // Role DTOs
  RoleDTO,
  RoleListItemDTO,
  ListRolesParams,

  // Profile DTOs
  ProfileDTO,
  ProfileWithRoleDTO,

  // Step Variant DTOs
  StepVariantDTO,
  StepVariantSummaryDTO,

  // Roadmap Step DTOs
  RoadmapStepDTO,
  RoadmapStepWithVariantsDTO,
  RoadmapStepSummaryDTO,

  // User Progress DTOs
  UserProgressDTO,
  UserProgressWithVariantDTO,
  StepProgressSummaryDTO,
  ProgressStatsDTO,

  // CV DTOs
  CVAnalysisStatusDTO,
  CVUploadResponseDTO,
  SignedURLResponseDTO,

  // Command Models
  UpdateQuestionnaireCommand,
  UpdatePartialQuestionnaireCommand,
  SelectRoleCommand,
  MarkVariantCompletedCommand,
  GenerateRecommendationsCommand,

  // Error DTOs
  ErrorDetailsDTO,
  ErrorDTO,

  // Response wrappers
  PaginatedResponseDTO,
  SuccessResponseDTO,
} from './types';

// Type guards (exported as values)
export {
  isQuestionnaireComplete,
  hasAIRecommendations,
  hasValidResources,
} from './types';
