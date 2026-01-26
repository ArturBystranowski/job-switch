import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import type { RoleDTO, ListRolesParams } from '../types';

/** Query key for roles list */
export const ROLES_QUERY_KEY = ['roles'] as const;

/** Query key factory for single role */
export const roleQueryKey = (roleId: number) => ['roles', roleId] as const;

/**
 * Hook to fetch all available IT roles
 * Uses React Query for caching and state management
 * No authentication required - roles are public data
 */
export const useRoles = (
  params?: ListRolesParams,
  options?: Omit<UseQueryOptions<RoleDTO[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, params],
    queryFn: () => rolesApi.listRoles(params),
    staleTime: 1000 * 60 * 60, // 1 hour - roles are static data
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    ...options,
  });
};

/**
 * Hook to fetch a single role by ID
 * Uses React Query for caching and state management
 * No authentication required - roles are public data
 */
export const useRole = (
  roleId: number,
  options?: Omit<UseQueryOptions<RoleDTO | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roleQueryKey(roleId),
    queryFn: () => rolesApi.getRoleById(roleId),
    staleTime: 1000 * 60 * 60, // 1 hour - roles are static data
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    enabled: roleId > 0, // Only fetch if valid roleId provided
    ...options,
  });
};
