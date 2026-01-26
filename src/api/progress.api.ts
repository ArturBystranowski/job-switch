import { supabaseClient } from '../db/supabase.client';
import type { UserProgressDTO, UserProgressWithVariantDTO } from '../types';

/**
 * User Progress API module
 * Handles all progress tracking operations
 * Note: Requires authentication - RLS restricts access to own progress only
 */
export const progressApi = {
  /**
   * Fetch all completed variants for a user
   * @param userId - UUID of the user
   * @returns Promise<UserProgressWithVariantDTO[]> - Array of progress records with variant details
   * @throws Error if Supabase query fails
   */
  async getUserProgress(userId: string): Promise<UserProgressWithVariantDTO[]> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('*, step_variants(*, roadmap_steps(*))')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as UserProgressWithVariantDTO[];
  },

  /**
   * Fetch progress for a specific role (filtered by role's steps)
   * @param userId - UUID of the user
   * @param roleId - ID of the role to filter by
   * @returns Promise<UserProgressWithVariantDTO[]>
   * @throws Error if Supabase query fails
   */
  async getUserProgressByRole(
    userId: string,
    roleId: number
  ): Promise<UserProgressWithVariantDTO[]> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('*, step_variants(*, roadmap_steps!inner(*))')
      .eq('user_id', userId)
      .eq('step_variants.roadmap_steps.role_id', roleId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as UserProgressWithVariantDTO[];
  },

  /**
   * Mark a step variant as completed
   * @param userId - UUID of the user
   * @param stepVariantId - ID of the step variant
   * @returns Promise<UserProgressDTO> - Created progress record
   * @throws Error if insert fails
   */
  async markVariantCompleted(
    userId: string,
    stepVariantId: number
  ): Promise<UserProgressDTO> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .insert({ user_id: userId, step_variant_id: stepVariantId })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (already completed)
      if (error.code === '23505') {
        throw new Error('VARIANT_ALREADY_COMPLETED: This variant is already marked as completed');
      }
      throw new Error(error.message);
    }

    return data as UserProgressDTO;
  },

  /**
   * Unmark a step variant as completed (remove progress record)
   * @param userId - UUID of the user
   * @param stepVariantId - ID of the step variant
   * @throws Error if delete fails
   */
  async unmarkVariantCompleted(
    userId: string,
    stepVariantId: number
  ): Promise<void> {
    const { error } = await supabaseClient
      .from('user_step_progress')
      .delete()
      .eq('user_id', userId)
      .eq('step_variant_id', stepVariantId);

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Check if a variant is completed by user
   * @param userId - UUID of the user
   * @param stepVariantId - ID of the step variant
   * @returns Promise<boolean>
   */
  async isVariantCompleted(userId: string, stepVariantId: number): Promise<boolean> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('step_variant_id', stepVariantId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data !== null;
  },

  /**
   * Get completed variant IDs for a user (lightweight check)
   * @param userId - UUID of the user
   * @returns Promise<number[]> - Array of completed step_variant_id values
   */
  async getCompletedVariantIds(userId: string): Promise<number[]> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('step_variant_id')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((record) => record.step_variant_id);
  },
};
