import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { progressApi } from '../api/progress.api';
import type { UserProgressDTO, UserProgressWithVariantDTO } from '../types';

/** Query key factory for user progress */
export const progressQueryKey = (userId: string) => ['progress', userId] as const;

/** Query key factory for user progress by role */
export const progressByRoleQueryKey = (userId: string, roleId: number) =>
  ['progress', userId, 'role', roleId] as const;

/** Query key for completed variant IDs */
export const completedVariantsQueryKey = (userId: string) =>
  ['progress', userId, 'completed-ids'] as const;

/**
 * Hook to fetch all user progress with variant details
 */
export const useUserProgress = (
  userId: string,
  options?: Omit<
    UseQueryOptions<UserProgressWithVariantDTO[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: progressQueryKey(userId),
    queryFn: () => progressApi.getUserProgress(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook to fetch user progress for a specific role
 */
export const useUserProgressByRole = (
  userId: string,
  roleId: number,
  options?: Omit<
    UseQueryOptions<UserProgressWithVariantDTO[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: progressByRoleQueryKey(userId, roleId),
    queryFn: () => progressApi.getUserProgressByRole(userId, roleId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId && roleId > 0,
    ...options,
  });
};

/**
 * Hook to fetch completed variant IDs (lightweight)
 */
export const useCompletedVariantIds = (
  userId: string,
  options?: Omit<UseQueryOptions<number[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: completedVariantsQueryKey(userId),
    queryFn: () => progressApi.getCompletedVariantIds(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
    ...options,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

interface MarkVariantVariables {
  userId: string;
  stepVariantId: number;
}

/**
 * Hook to mark a variant as completed
 * Invalidates progress queries on success
 */
export const useMarkVariantCompleted = (
  options?: Omit<
    UseMutationOptions<UserProgressDTO, Error, MarkVariantVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, stepVariantId }: MarkVariantVariables) =>
      progressApi.markVariantCompleted(userId, stepVariantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKey(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: completedVariantsQueryKey(variables.userId),
      });
    },
    ...options,
  });
};

/**
 * Hook to unmark a variant as completed
 * Invalidates progress queries on success
 */
export const useUnmarkVariantCompleted = (
  options?: Omit<UseMutationOptions<void, Error, MarkVariantVariables>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, stepVariantId }: MarkVariantVariables) =>
      progressApi.unmarkVariantCompleted(userId, stepVariantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKey(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: completedVariantsQueryKey(variables.userId),
      });
    },
    ...options,
  });
};

/**
 * Hook to toggle variant completion status
 * Convenience hook that marks or unmarks based on current state
 */
export const useToggleVariantCompleted = (
  options?: Omit<UseMutationOptions<void, Error, MarkVariantVariables & { isCompleted: boolean }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, stepVariantId, isCompleted }: MarkVariantVariables & { isCompleted: boolean }) => {
      if (isCompleted) {
        await progressApi.unmarkVariantCompleted(userId, stepVariantId);
      } else {
        await progressApi.markVariantCompleted(userId, stepVariantId);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKey(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: completedVariantsQueryKey(variables.userId),
      });
    },
    ...options,
  });
};
