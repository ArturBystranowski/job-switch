import { supabaseClient } from '../db/supabase.client';
import type { Json } from '../types/database.types';
import type {
  ProfileDTO,
  ProfileWithRoleDTO,
  QuestionnaireResponsesDTO,
  PartialQuestionnaireResponsesDTO,
} from '../types';

/**
 * Profiles API module
 * Handles all profile-related API operations
 * Note: Requires authentication - RLS restricts access to own profile only
 */
export const profilesApi = {
  /**
   * Fetch current authenticated user's profile with role details
   * @returns Promise<ProfileWithRoleDTO | null> - Profile data with role or null if not found
   * @throws Error if Supabase query fails or user not authenticated
   */
  async getProfile(): Promise<ProfileWithRoleDTO | null> {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*, roles(*)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No profile found
      }
      throw new Error(error.message);
    }

    return data as ProfileWithRoleDTO;
  },

  /**
   * Fetch profile by user ID with role details
   * @param userId - UUID of the user
   * @returns Promise<ProfileWithRoleDTO | null>
   * @throws Error if Supabase query fails
   */
  async getProfileById(userId: string): Promise<ProfileWithRoleDTO | null> {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*, roles(*)')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No profile found
      }
      throw new Error(error.message);
    }

    return data as ProfileWithRoleDTO;
  },

  /**
   * Update questionnaire responses for a user profile
   * @param userId - UUID of the user
   * @param responses - Complete questionnaire responses
   * @returns Promise<ProfileDTO> - Updated profile
   * @throws Error if update fails
   */
  async updateQuestionnaire(
    userId: string,
    responses: QuestionnaireResponsesDTO
  ): Promise<ProfileDTO> {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ questionnaire_responses: responses as unknown as Json })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileDTO;
  },

  /**
   * Partially update questionnaire responses (for incremental saving)
   * @param userId - UUID of the user
   * @param partialResponses - Partial questionnaire responses to merge
   * @returns Promise<ProfileDTO> - Updated profile
   * @throws Error if update fails
   */
  async updatePartialQuestionnaire(
    userId: string,
    partialResponses: PartialQuestionnaireResponsesDTO
  ): Promise<ProfileDTO> {
    // First get current responses to merge with
    const { data: currentProfile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('questionnaire_responses')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const currentResponses =
      (currentProfile?.questionnaire_responses as PartialQuestionnaireResponsesDTO) ??
      {};
    const mergedResponses = { ...currentResponses, ...partialResponses };

    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ questionnaire_responses: mergedResponses })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileDTO;
  },

  /**
   * Select final role for user (irreversible in MVP)
   * @param userId - UUID of the user
   * @param roleId - ID of the selected role
   * @returns Promise<ProfileDTO> - Updated profile
   * @throws Error if update fails or role already selected
   */
  async selectRole(userId: string, roleId: number): Promise<ProfileDTO> {
    // Check if role is already selected
    const { data: currentProfile, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('selected_role_id')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (currentProfile?.selected_role_id !== null) {
      throw new Error(
        'ROLE_ALREADY_SELECTED: Role has already been selected and cannot be changed'
      );
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ selected_role_id: roleId })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileDTO;
  },
};
