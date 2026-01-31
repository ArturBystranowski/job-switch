import { supabaseClient } from '../db/supabase.client';
import type { RoleDTO, ListRolesParams } from '../types';

/**
 * Roles API module
 * Handles all role-related API operations
 * Note: No authentication required - roles are public data (RLS allows anon SELECT)
 */
export const rolesApi = {
  /**
   * Fetch all available IT roles
   * @param params - Optional query parameters for filtering and sorting
   * @returns Promise<RoleDTO[]> - Array of roles
   * @throws Error if Supabase query fails
   */
  async listRoles(params?: ListRolesParams): Promise<RoleDTO[]> {
    let query = supabaseClient.from('roles').select(params?.select ?? '*');

    if (params?.order) {
      const [column, direction] = params.order.split('.') as [
        string,
        'asc' | 'desc',
      ];
      query = query.order(column, { ascending: direction === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as unknown as RoleDTO[];
  },

  /**
   * Fetch a single role by ID
   * @param roleId - The ID of the role to fetch
   * @returns Promise<RoleDTO | null> - Role data or null if not found
   * @throws Error if Supabase query fails
   */
  async getRoleById(roleId: number): Promise<RoleDTO | null> {
    const { data, error } = await supabaseClient
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned - role not found
      }
      throw new Error(error.message);
    }

    return data as RoleDTO;
  },
};
