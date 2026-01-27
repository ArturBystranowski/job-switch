import { supabaseClient } from '../db/supabase.client';
import type { RoadmapStepDTO, RoadmapStepWithTasksDTO, StepTaskDTO } from '../types';

/**
 * Roadmap API module
 * Handles all roadmap-related API operations
 * Note: Public read access - RLS allows authenticated/anon users to SELECT
 */
export const roadmapApi = {
  /**
   * Fetch complete roadmap with all steps and tasks for a role
   * @param roleId - ID of the role
   * @returns Promise<RoadmapStepWithTasksDTO[]> - Array of roadmap steps with tasks
   * @throws Error if Supabase query fails
   */
  async getRoadmapByRoleId(roleId: number): Promise<RoadmapStepWithTasksDTO[]> {
    const { data, error } = await supabaseClient
      .from('roadmap_steps')
      .select('*, step_tasks(*)')
      .eq('role_id', roleId)
      .order('order_number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Sort tasks within each step by order_number
    const sortedData = (data ?? []).map((step) => ({
      ...step,
      step_tasks: ((step.step_tasks ?? []) as StepTaskDTO[]).sort(
        (a, b) => a.order_number - b.order_number
      ),
    }));

    return sortedData as RoadmapStepWithTasksDTO[];
  },

  /**
   * Fetch a single roadmap step with its tasks
   * @param stepId - ID of the step
   * @returns Promise<RoadmapStepWithTasksDTO | null> - Step with tasks or null
   * @throws Error if Supabase query fails
   */
  async getStepById(stepId: number): Promise<RoadmapStepWithTasksDTO | null> {
    const { data, error } = await supabaseClient
      .from('roadmap_steps')
      .select('*, step_tasks(*)')
      .eq('id', stepId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Step not found
      }
      throw new Error(error.message);
    }

    // Sort tasks by order_number
    const sortedData = {
      ...data,
      step_tasks: ((data.step_tasks ?? []) as StepTaskDTO[]).sort(
        (a, b) => a.order_number - b.order_number
      ),
    };

    return sortedData as RoadmapStepWithTasksDTO;
  },

  /**
   * Fetch roadmap steps without tasks (lighter payload)
   * @param roleId - ID of the role
   * @returns Promise<RoadmapStepDTO[]> - Array of roadmap steps
   * @throws Error if Supabase query fails
   */
  async getStepsByRoleId(roleId: number): Promise<RoadmapStepDTO[]> {
    const { data, error } = await supabaseClient
      .from('roadmap_steps')
      .select('*')
      .eq('role_id', roleId)
      .order('order_number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as RoadmapStepDTO[];
  },
};
