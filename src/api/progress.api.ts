import { supabaseClient } from '../db/supabase.client';
import type { UserProgressDTO, UserProgressWithTaskDTO } from '../types';

/**
 * User Progress API module
 * Handles all progress tracking operations
 * All tasks in a step must be completed to unlock the next step
 * Note: Requires authentication - RLS restricts access to own progress only
 */
export const progressApi = {
  /**
   * Fetch all completed tasks for a user
   * @param userId - UUID of the user
   * @returns Promise<UserProgressWithTaskDTO[]> - Array of progress records with task details
   * @throws Error if Supabase query fails
   */
  async getUserProgress(userId: string): Promise<UserProgressWithTaskDTO[]> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('*, step_tasks(*, roadmap_steps(*))')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as UserProgressWithTaskDTO[];
  },

  /**
   * Fetch progress for a specific role (filtered by role's steps)
   * @param userId - UUID of the user
   * @param roleId - ID of the role to filter by
   * @returns Promise<UserProgressWithTaskDTO[]>
   * @throws Error if Supabase query fails
   */
  async getUserProgressByRole(
    userId: string,
    roleId: number
  ): Promise<UserProgressWithTaskDTO[]> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('*, step_tasks(*, roadmap_steps!inner(*))')
      .eq('user_id', userId)
      .eq('step_tasks.roadmap_steps.role_id', roleId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as UserProgressWithTaskDTO[];
  },

  /**
   * Mark a step task as completed
   * @param userId - UUID of the user
   * @param stepTaskId - ID of the step task
   * @returns Promise<UserProgressDTO> - Created progress record
   * @throws Error if insert fails
   */
  async markTaskCompleted(
    userId: string,
    stepTaskId: number
  ): Promise<UserProgressDTO> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .insert({ user_id: userId, step_task_id: stepTaskId })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (already completed)
      if (error.code === '23505') {
        throw new Error('TASK_ALREADY_COMPLETED: This task is already marked as completed');
      }
      throw new Error(error.message);
    }

    return data as UserProgressDTO;
  },

  /**
   * Unmark a step task as completed (remove progress record)
   * @param userId - UUID of the user
   * @param stepTaskId - ID of the step task
   * @throws Error if delete fails
   */
  async unmarkTaskCompleted(
    userId: string,
    stepTaskId: number
  ): Promise<void> {
    const { error } = await supabaseClient
      .from('user_step_progress')
      .delete()
      .eq('user_id', userId)
      .eq('step_task_id', stepTaskId);

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Check if a task is completed by user
   * @param userId - UUID of the user
   * @param stepTaskId - ID of the step task
   * @returns Promise<boolean>
   */
  async isTaskCompleted(userId: string, stepTaskId: number): Promise<boolean> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('step_task_id', stepTaskId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data !== null;
  },

  /**
   * Get completed task IDs for a user (lightweight check)
   * @param userId - UUID of the user
   * @returns Promise<number[]> - Array of completed step_task_id values
   */
  async getCompletedTaskIds(userId: string): Promise<number[]> {
    const { data, error } = await supabaseClient
      .from('user_step_progress')
      .select('step_task_id')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((record) => record.step_task_id);
  },
};
