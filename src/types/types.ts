/**
 * DTO and Command Model Types for JobSwitch API
 *
 * This file contains all Data Transfer Object types and Command Models
 * derived from database entity types defined in database.types.ts
 */

import type { Tables, TablesInsert } from './database.types';

// ============================================================================
// Database Entity Type Aliases (for easier reference)
// ============================================================================

/** Base profile entity from database */
export type ProfileEntity = Tables<'profiles'>;

/** Base role entity from database */
export type RoleEntity = Tables<'roles'>;

/** Base roadmap step entity from database */
export type RoadmapStepEntity = Tables<'roadmap_steps'>;

/** Base step task entity from database */
export type StepTaskEntity = Tables<'step_tasks'>;

/** Base user progress entity from database */
export type UserStepProgressEntity = Tables<'user_step_progress'>;

// ============================================================================
// JSON Field Type Definitions
// ============================================================================

/** Work style preference options */
export type WorkStyle = 'independent' | 'collaborative' | 'mixed';

/** Client interaction level options */
export type ClientInteraction = 'minimal' | 'moderate' | 'extensive';

/** Aesthetic focus level options */
export type AestheticFocus = 'low' | 'medium' | 'high';

/** Teamwork preference level options */
export type TeamworkPreference = 'low' | 'medium' | 'high';

/** Problem solving approach options */
export type ProblemSolvingApproach = 'analytical' | 'creative' | 'practical';

/** Leadership preference options (NEW) */
export type LeadershipPreference = 'executor' | 'situational' | 'natural_leader';

/** Technical depth preference options (NEW) */
export type TechnicalDepth = 'deep' | 'general' | 'process_focused';

/** Data vs Design preference options (NEW) */
export type DataVsDesign = 'data' | 'design' | 'coordination';

/** Coding interest options (NEW) */
export type CodingInterest = 'daily_coding' | 'scripting' | 'no_coding';

/** Uncertainty handling options (NEW) */
export type UncertaintyHandling = 'stability' | 'adaptable' | 'thrives_in_chaos';

/**
 * Questionnaire responses structure
 * Represents user's preferences captured during onboarding questionnaire
 * Includes 10 multiple choice questions + 1 optional open answer
 */
export interface QuestionnaireResponsesDTO {
  // Original questions (1-5)
  work_style: WorkStyle;
  client_interaction: ClientInteraction;
  aesthetic_focus: AestheticFocus;
  teamwork_preference: TeamworkPreference;
  problem_solving_approach: ProblemSolvingApproach;
  // New questions (6-10)
  leadership_preference: LeadershipPreference;
  technical_depth: TechnicalDepth;
  data_vs_design: DataVsDesign;
  coding_interest: CodingInterest;
  uncertainty_handling: UncertaintyHandling;
  // Optional open answer (max 200 chars)
  open_answer?: string;
}

/**
 * Partial questionnaire responses for updates
 * All fields optional to allow incremental saving
 */
export type PartialQuestionnaireResponsesDTO = Partial<QuestionnaireResponsesDTO>;

// ============================================================================
// Questionnaire Configuration Types
// ============================================================================

/**
 * Single answer option for a questionnaire question
 */
export interface QuestionnaireOptionDTO {
  id: number;
  option_value: string;
  option_label: string;
  option_order: number;
}

/**
 * Questionnaire question with its answer options
 */
export interface QuestionnaireQuestionDTO {
  id: number;
  field_name: string;
  question_text: string;
  question_order: number;
  options: QuestionnaireOptionDTO[];
}

/**
 * Complete questionnaire configuration
 * Used to render the questionnaire form
 */
export type QuestionnaireConfigDTO = QuestionnaireQuestionDTO[];

// ============================================================================
// AI Recommendations Types
// ============================================================================

/**
 * Single AI recommendation for a role
 * Contains role identification and AI-generated justification
 */
export interface AIRecommendationDTO {
  role_id: number;
  role_name: string;
  justification: string;
}

/**
 * Complete AI recommendations response structure
 * Stored in profiles.ai_recommendations JSON field
 */
export interface AIRecommendationsDTO {
  recommendations: AIRecommendationDTO[];
  generated_at: string;
}

// ============================================================================
// Resource Link Types
// ============================================================================

/** Type of resource link */
export type ResourceLinkType = 'documentation' | 'course' | 'video' | 'article';

/**
 * Single resource link structure
 * Used in step tasks resources JSON field
 */
export interface ResourceLinkDTO {
  title: string;
  url: string;
  type: ResourceLinkType;
}

/**
 * Resources container structure
 * Stored in step tasks resources JSON field
 */
export interface ResourcesDTO {
  links: ResourceLinkDTO[];
}

// ============================================================================
// Role DTOs
// ============================================================================

/**
 * Role DTO for API responses
 * Direct mapping from roles table
 */
export type RoleDTO = Pick<RoleEntity, 'id' | 'name' | 'description' | 'created_at'>;

// ============================================================================
// Roles Query Types
// ============================================================================

/**
 * Query parameters for listing roles
 * Used with GET /rest/v1/roles
 */
export interface ListRolesParams {
  /** Fields to return (Supabase select syntax) */
  select?: string;
  /** Sort order (e.g., 'name.asc', 'id.desc') */
  order?: 'name.asc' | 'name.desc' | 'id.asc' | 'id.desc';
}

/**
 * Minimal role DTO for lists and references
 * Excludes timestamps for lighter payloads
 */
export type RoleListItemDTO = Pick<RoleEntity, 'id' | 'name' | 'description'>;

// ============================================================================
// Profile DTOs
// ============================================================================

/**
 * Profile DTO for API responses
 * Extends base entity with properly typed JSON fields
 */
export interface ProfileDTO {
  id: ProfileEntity['id'];
  questionnaire_responses: QuestionnaireResponsesDTO | Record<string, never>;
  cv_uploaded_at: ProfileEntity['cv_uploaded_at'];
  ai_recommendations: AIRecommendationsDTO | null;
  selected_role_id: ProfileEntity['selected_role_id'];
  created_at: ProfileEntity['created_at'];
}

/**
 * Profile DTO with nested role relation
 * Used when fetching profile with role details
 */
export interface ProfileWithRoleDTO extends ProfileDTO {
  roles: RoleDTO | null;
}

// ============================================================================
// Step Task DTOs
// ============================================================================

/**
 * Step task DTO for API responses
 * Tasks are mandatory sub-tasks of a step - all must be completed to unlock next step
 * Extends base entity with properly typed resources JSON field
 */
export interface StepTaskDTO {
  id: StepTaskEntity['id'];
  step_id: StepTaskEntity['step_id'];
  order_number: StepTaskEntity['order_number'];
  title: StepTaskEntity['title'];
  description: StepTaskEntity['description'];
  estimated_hours: StepTaskEntity['estimated_hours'];
  resources: ResourcesDTO | null;
  created_at: StepTaskEntity['created_at'];
}

/**
 * Minimal step task DTO
 * Used in nested responses where full details aren't needed
 */
export type StepTaskSummaryDTO = Pick<
  StepTaskDTO,
  'id' | 'step_id' | 'order_number' | 'title'
>;

// ============================================================================
// Roadmap Step DTOs
// ============================================================================

/**
 * Roadmap step DTO for API responses
 * Direct mapping from roadmap_steps table
 */
export type RoadmapStepDTO = Pick<
  RoadmapStepEntity,
  'id' | 'role_id' | 'order_number' | 'title' | 'description' | 'created_at'
>;

/**
 * Roadmap step DTO with nested tasks
 * Used when fetching complete roadmap structure
 * All tasks must be completed to unlock the next step
 */
export interface RoadmapStepWithTasksDTO extends RoadmapStepDTO {
  step_tasks: StepTaskDTO[];
}

/**
 * Minimal roadmap step DTO
 * Used in nested responses where full details aren't needed
 */
export type RoadmapStepSummaryDTO = Pick<
  RoadmapStepDTO,
  'id' | 'role_id' | 'order_number' | 'title'
>;

// ============================================================================
// User Progress DTOs
// ============================================================================

/**
 * User progress DTO for API responses
 * Direct mapping from user_step_progress table
 */
export type UserProgressDTO = Pick<
  UserStepProgressEntity,
  'id' | 'user_id' | 'step_task_id' | 'completed_at'
>;

/**
 * User progress DTO with nested task info
 * Used when fetching progress with task context
 */
export interface UserProgressWithTaskDTO extends UserProgressDTO {
  step_tasks: StepTaskSummaryDTO & {
    roadmap_steps: RoadmapStepSummaryDTO;
  };
}

/**
 * Step progress summary for statistics
 * Aggregated progress data per roadmap step
 */
export interface StepProgressSummaryDTO {
  step_id: number;
  step_title: string;
  total_tasks: number;
  completed_tasks: number;
  is_step_completed: boolean;
}

/**
 * Overall progress statistics DTO
 * Response from get-progress-stats edge function
 */
export interface ProgressStatsDTO {
  total_tasks: number;
  completed_tasks: number;
  progress_percentage: number;
  steps_summary: StepProgressSummaryDTO[];
}

// ============================================================================
// CV Analysis Status DTO
// ============================================================================

/**
 * Missing requirement types for CV analysis
 */
export type MissingRequirement =
  | 'questionnaire_responses'
  | 'cv_upload';

/**
 * CV analysis status DTO
 * Response from cv-analysis-status edge function
 */
export interface CVAnalysisStatusDTO {
  questionnaire_completed: boolean;
  cv_uploaded: boolean;
  recommendations_generated: boolean;
  role_selected: boolean;
  can_generate_recommendations: boolean;
  missing_requirements: MissingRequirement[];
}

// ============================================================================
// CV Upload DTOs
// ============================================================================

/**
 * CV upload response DTO
 * Response from Supabase Storage upload
 */
export interface CVUploadResponseDTO {
  Key: string;
  Id: string;
}

/**
 * Signed URL response DTO
 * Response from Supabase Storage signed URL generation
 */
export interface SignedURLResponseDTO {
  signedURL: string;
}

// ============================================================================
// Command Models (Write Operations)
// ============================================================================

/**
 * Command to update questionnaire responses
 * Used with PATCH /rest/v1/profiles
 */
export interface UpdateQuestionnaireCommand {
  questionnaire_responses: QuestionnaireResponsesDTO;
}

/**
 * Command to partially update questionnaire responses
 * Allows saving individual answers
 */
export interface UpdatePartialQuestionnaireCommand {
  questionnaire_responses: PartialQuestionnaireResponsesDTO;
}

/**
 * Command to select final role
 * Used with PATCH /rest/v1/profiles
 * Note: This is an irreversible operation in MVP
 */
export interface SelectRoleCommand {
  selected_role_id: number;
}

/**
 * Command to mark a step task as completed
 * Used with POST /rest/v1/user_step_progress
 * Derives from database insert type for type safety
 */
export type MarkTaskCompletedCommand = Pick<
  TablesInsert<'user_step_progress'>,
  'user_id' | 'step_task_id'
>;

/**
 * Command to generate AI recommendations
 * Used with POST /functions/v1/generate-recommendations
 */
export interface GenerateRecommendationsCommand {
  user_id: string;
}

// ============================================================================
// Error DTOs
// ============================================================================

/** Business logic error codes */
export type BusinessErrorCode =
  | 'QUESTIONNAIRE_INCOMPLETE'
  | 'CV_NOT_UPLOADED'
  | 'CV_ALREADY_UPLOADED'
  | 'RECOMMENDATIONS_EXIST'
  | 'ROLE_ALREADY_SELECTED'
  | 'ROLE_NOT_IN_RECOMMENDATIONS'
  | 'ROLE_NOT_SELECTED'
  | 'TASK_NOT_IN_ROLE'
  | 'AI_SERVICE_ERROR'
  | 'CV_PARSE_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT';

/**
 * Error details structure
 * Contains additional context for validation errors
 */
export interface ErrorDetailsDTO {
  missing_fields?: string[];
  invalid_fields?: string[];
  [key: string]: unknown;
}

/**
 * Standard error response DTO
 * Used for all API error responses
 */
export interface ErrorDTO {
  error: {
    code: BusinessErrorCode;
    message: string;
    details?: ErrorDetailsDTO;
  };
}

// ============================================================================
// API Response Wrapper Types
// ============================================================================

/**
 * Paginated list response wrapper
 * Generic type for list endpoints with pagination
 */
export interface PaginatedResponseDTO<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
}

/**
 * Success response wrapper
 * Generic type for mutation responses
 */
export interface SuccessResponseDTO<T> {
  data: T;
  message?: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if questionnaire responses are complete
 * Validates all 10 required fields (open_answer is optional)
 */
export function isQuestionnaireComplete(
  responses: unknown
): responses is QuestionnaireResponsesDTO {
  if (!responses || typeof responses !== 'object') return false;

  const r = responses as Record<string, unknown>;
  return (
    // Original questions (1-5)
    typeof r.work_style === 'string' &&
    typeof r.client_interaction === 'string' &&
    typeof r.aesthetic_focus === 'string' &&
    typeof r.teamwork_preference === 'string' &&
    typeof r.problem_solving_approach === 'string' &&
    // New questions (6-10)
    typeof r.leadership_preference === 'string' &&
    typeof r.technical_depth === 'string' &&
    typeof r.data_vs_design === 'string' &&
    typeof r.coding_interest === 'string' &&
    typeof r.uncertainty_handling === 'string'
    // open_answer is optional, so not checked
  );
}

/**
 * Type guard to check if AI recommendations exist
 */
export function hasAIRecommendations(
  recommendations: unknown
): recommendations is AIRecommendationsDTO {
  if (!recommendations || typeof recommendations !== 'object') return false;

  const r = recommendations as Record<string, unknown>;
  return (
    Array.isArray(r.recommendations) &&
    r.recommendations.length > 0 &&
    typeof r.generated_at === 'string'
  );
}

/**
 * Type guard to check if resources are valid
 */
export function hasValidResources(
  resources: unknown
): resources is ResourcesDTO {
  if (!resources || typeof resources !== 'object') return false;

  const r = resources as Record<string, unknown>;
  return Array.isArray(r.links);
}

