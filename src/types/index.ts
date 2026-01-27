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
  StepTaskEntity,
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

  // Step Task DTOs
  StepTaskDTO,
  StepTaskSummaryDTO,

  // Roadmap Step DTOs
  RoadmapStepDTO,
  RoadmapStepWithTasksDTO,
  RoadmapStepSummaryDTO,

  // User Progress DTOs
  UserProgressDTO,
  UserProgressWithTaskDTO,
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
  MarkTaskCompletedCommand,
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
