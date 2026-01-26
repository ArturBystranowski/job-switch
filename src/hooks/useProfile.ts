import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { profilesApi } from '../api/profiles.api';
import type {
  ProfileDTO,
  ProfileWithRoleDTO,
  QuestionnaireResponsesDTO,
  PartialQuestionnaireResponsesDTO,
} from '../types';

/** Query key for current user profile */
export const PROFILE_QUERY_KEY = ['profile'] as const;

/** Query key factory for specific user profile */
export const profileQueryKey = (userId: string) => ['profile', userId] as const;

/**
 * Hook to fetch current authenticated user's profile
 * Uses React Query for caching and state management
 * Requires authentication - will fail if user not logged in
 */
export const useProfile = (
  options?: Omit<
    UseQueryOptions<ProfileWithRoleDTO | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profilesApi.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes - profile data may change
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1, // Don't retry too much for auth-dependent queries
    ...options,
  });
};

/**
 * Hook to fetch a specific user's profile by ID
 * Uses React Query for caching and state management
 * Requires authentication and appropriate permissions
 */
export const useProfileById = (
  userId: string,
  options?: Omit<
    UseQueryOptions<ProfileWithRoleDTO | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: profileQueryKey(userId),
    queryFn: () => profilesApi.getProfileById(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    enabled: !!userId, // Only fetch if userId provided
    ...options,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

interface UpdateQuestionnaireVariables {
  userId: string;
  responses: QuestionnaireResponsesDTO;
}

interface UpdatePartialQuestionnaireVariables {
  userId: string;
  partialResponses: PartialQuestionnaireResponsesDTO;
}

interface SelectRoleVariables {
  userId: string;
  roleId: number;
}

/**
 * Hook to update complete questionnaire responses
 * Invalidates profile cache on success
 */
export const useUpdateQuestionnaire = (
  options?: Omit<
    UseMutationOptions<ProfileDTO, Error, UpdateQuestionnaireVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, responses }: UpdateQuestionnaireVariables) =>
      profilesApi.updateQuestionnaire(userId, responses),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: profileQueryKey(variables.userId) });
    },
    ...options,
  });
};

/**
 * Hook to partially update questionnaire responses (for incremental saving)
 * Invalidates profile cache on success
 */
export const useUpdatePartialQuestionnaire = (
  options?: Omit<
    UseMutationOptions<ProfileDTO, Error, UpdatePartialQuestionnaireVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, partialResponses }: UpdatePartialQuestionnaireVariables) =>
      profilesApi.updatePartialQuestionnaire(userId, partialResponses),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: profileQueryKey(variables.userId) });
    },
    ...options,
  });
};

/**
 * Hook to select final role (irreversible in MVP)
 * Invalidates profile cache on success
 */
export const useSelectRole = (
  options?: Omit<
    UseMutationOptions<ProfileDTO, Error, SelectRoleVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: SelectRoleVariables) =>
      profilesApi.selectRole(userId, roleId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: profileQueryKey(variables.userId) });
    },
    ...options,
  });
};
