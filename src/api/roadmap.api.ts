import { supabaseClient } from '../db/supabase.client';
import type { RoadmapStepDTO, RoadmapStepWithVariantsDTO } from '../types';

/**
 * Roadmap API module
 * Handles all roadmap-related API operations
 * Note: Public read access - RLS allows authenticated/anon users to SELECT
 */
export const roadmapApi = {
  /**
   * Fetch complete roadmap with all steps and variants for a role
   * @param roleId - ID of the role
   * @returns Promise<RoadmapStepWithVariantsDTO[]> - Array of roadmap steps with variants
   * @throws Error if Supabase query fails
   */
  async getRoadmapByRoleId(roleId: number): Promise<RoadmapStepWithVariantsDTO[]> {
    const { data, error } = await supabaseClient
      .from('roadmap_steps')
      .select('*, step_variants(*)')
      .eq('role_id', roleId)
      .order('order_number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Sort variants within each step by order_number
    const sortedData = (data ?? []).map((step) => ({
      ...step,
      step_variants: (step.step_variants ?? []).sort(
        (a: { order_number: number }, b: { order_number: number }) =>
          a.order_number - b.order_number
      ),
    }));

    return sortedData as RoadmapStepWithVariantsDTO[];
  },

  /**
   * Fetch a single roadmap step with its variants
   * @param stepId - ID of the step
   * @returns Promise<RoadmapStepWithVariantsDTO | null> - Step with variants or null
   * @throws Error if Supabase query fails
   */
  async getStepById(stepId: number): Promise<RoadmapStepWithVariantsDTO | null> {
    const { data, error } = await supabaseClient
      .from('roadmap_steps')
      .select('*, step_variants(*)')
      .eq('id', stepId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Step not found
      }
      throw new Error(error.message);
    }

    // Sort variants by order_number
    const sortedData = {
      ...data,
      step_variants: (data.step_variants ?? []).sort(
        (a: { order_number: number }, b: { order_number: number }) =>
          a.order_number - b.order_number
      ),
    };

    return sortedData as RoadmapStepWithVariantsDTO;
  },

  /**
   * Fetch roadmap steps without variants (lighter payload)
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
