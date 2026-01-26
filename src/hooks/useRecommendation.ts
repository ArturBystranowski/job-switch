import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { recommendationApi } from '../api/recommendation.api';
import type { AIRecommendationDTO, AIRecommendationsDTO } from '../types';
import { PROFILE_QUERY_KEY } from './useProfile';

/** Query key factory for recommendations */
export const recommendationsQueryKey = (userId: string) =>
  ['recommendations', userId] as const;

/** Query key factory for recommendation status */
export const recommendationStatusQueryKey = (userId: string) =>
  ['recommendation', 'status', userId] as const;

interface RecommendationStatus {
  canGenerate: boolean;
  questionnaireCompleted: boolean;
  cvUploaded: boolean;
  recommendationsExist: boolean;
}

interface GenerateRecommendationResult {
  success: boolean;
  recommendations: AIRecommendationDTO[];
  generated_at: string;
}

/**
 * Hook to fetch existing recommendations for a user
 */
export const useRecommendations = (
  userId: string,
  options?: Omit<
    UseQueryOptions<AIRecommendationsDTO | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: recommendationsQueryKey(userId),
    queryFn: () => recommendationApi.getRecommendations(userId),
    staleTime: 1000 * 60 * 60, // 1 hour - recommendation doesn't change
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook to check if user can generate recommendation
 */
export const useRecommendationStatus = (
  userId: string,
  options?: Omit<
    UseQueryOptions<RecommendationStatus, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: recommendationStatusQueryKey(userId),
    queryFn: () => recommendationApi.canGenerateRecommendation(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
    ...options,
  });
};

interface GenerateRecommendationVariables {
  userId: string;
}

/**
 * Hook to generate AI recommendation
 * Invalidates recommendation and profile queries on success
 */
export const useGenerateRecommendation = (
  options?: Omit<
    UseMutationOptions<GenerateRecommendationResult, Error, GenerateRecommendationVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: GenerateRecommendationVariables) =>
      recommendationApi.generateRecommendation(userId),
    onSuccess: (_data, variables) => {
      // Invalidate recommendation queries
      queryClient.invalidateQueries({ queryKey: recommendationsQueryKey(variables.userId) });
      queryClient.invalidateQueries({ queryKey: recommendationStatusQueryKey(variables.userId) });
      // Invalidate profile queries (ai_recommendations field was updated)
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    ...options,
  });
};

/**
 * Helper to check if error is a specific recommendation error
 */
export const isRecommendationError = (
  error: Error,
  errorCode: 'QUESTIONNAIRE_INCOMPLETE' | 'RECOMMENDATIONS_EXIST' | 'AUTH_ERROR' | 'INTERNAL_ERROR'
): boolean => {
  return error.message.startsWith(errorCode);
};
