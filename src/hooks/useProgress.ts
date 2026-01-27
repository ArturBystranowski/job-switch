import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { progressApi } from '../api/progress.api';
import type { UserProgressDTO, UserProgressWithTaskDTO } from '../types';

/** Query key factory for user progress */
export const progressQueryKey = (userId: string) => ['progress', userId] as const;

/** Query key factory for user progress by role */
export const progressByRoleQueryKey = (userId: string, roleId: number) =>
  ['progress', userId, 'role', roleId] as const;

/** Query key for completed task IDs */
export const completedTasksQueryKey = (userId: string) =>
  ['progress', userId, 'completed-ids'] as const;

/**
 * Hook to fetch all user progress with task details
 */
export const useUserProgress = (
  userId: string,
  options?: Omit<
    UseQueryOptions<UserProgressWithTaskDTO[], Error>,
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
    UseQueryOptions<UserProgressWithTaskDTO[], Error>,
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
 * Hook to fetch completed task IDs (lightweight)
 */
export const useCompletedTaskIds = (
  userId: string,
  options?: Omit<UseQueryOptions<number[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: completedTasksQueryKey(userId),
    queryFn: () => progressApi.getCompletedTaskIds(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
    ...options,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

interface MarkTaskVariables {
  userId: string;
  stepTaskId: number;
}

/**
 * Hook to mark a task as completed
 * Invalidates progress queries on success
 */
export const useMarkTaskCompleted = (
  options?: Omit<
    UseMutationOptions<UserProgressDTO, Error, MarkTaskVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, stepTaskId }: MarkTaskVariables) =>
      progressApi.markTaskCompleted(userId, stepTaskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKey(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: completedTasksQueryKey(variables.userId),
      });
    },
    ...options,
  });
};

/**
 * Hook to unmark a task as completed
 * Invalidates progress queries on success
 */
export const useUnmarkTaskCompleted = (
  options?: Omit<UseMutationOptions<void, Error, MarkTaskVariables>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, stepTaskId }: MarkTaskVariables) =>
      progressApi.unmarkTaskCompleted(userId, stepTaskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKey(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: completedTasksQueryKey(variables.userId),
      });
    },
    ...options,
  });
};

/**
 * Hook to toggle task completion status
 * Convenience hook that marks or unmarks based on current state
 */
export const useToggleTaskCompleted = (
  options?: Omit<UseMutationOptions<void, Error, MarkTaskVariables & { isCompleted: boolean }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, stepTaskId, isCompleted }: MarkTaskVariables & { isCompleted: boolean }) => {
      if (isCompleted) {
        await progressApi.unmarkTaskCompleted(userId, stepTaskId);
      } else {
        await progressApi.markTaskCompleted(userId, stepTaskId);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKey(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: completedTasksQueryKey(variables.userId),
      });
    },
    ...options,
  });
};
