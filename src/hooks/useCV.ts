import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { cvApi } from '../api/cv.api';
import type { CVUploadResponseDTO, SignedURLResponseDTO } from '../types';
import { PROFILE_QUERY_KEY, profileQueryKey } from './useProfile';

/** Query key for CV status */
export const cvStatusQueryKey = (userId: string) => ['cv', userId, 'status'] as const;

/** Query key for CV metadata */
export const cvMetadataQueryKey = (userId: string) => ['cv', userId, 'metadata'] as const;

/** Query key for CV download URL */
export const cvDownloadUrlQueryKey = (userId: string) => ['cv', userId, 'url'] as const;

/**
 * Hook to check if CV has been uploaded
 */
export const useCVStatus = (
  userId: string,
  options?: Omit<UseQueryOptions<boolean, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: cvStatusQueryKey(userId),
    queryFn: () => cvApi.hasCVUploaded(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook to get CV metadata
 */
export const useCVMetadata = (
  userId: string,
  options?: Omit<
    UseQueryOptions<{ name: string; size: number; createdAt: string } | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: cvMetadataQueryKey(userId),
    queryFn: () => cvApi.getCVMetadata(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook to get CV download URL
 * Only fetches when CV exists
 */
export const useCVDownloadUrl = (
  userId: string,
  enabled = true,
  options?: Omit<UseQueryOptions<SignedURLResponseDTO, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: cvDownloadUrlQueryKey(userId),
    queryFn: () => cvApi.getCVDownloadUrl(userId),
    staleTime: 1000 * 60 * 30, // 30 minutes (URL valid for 1 hour)
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!userId && enabled,
    retry: false, // Don't retry if CV doesn't exist
    ...options,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

interface UploadCVVariables {
  userId: string;
  file: File;
}

/**
 * Hook to upload CV file
 * Validates file (PDF only, max 3MB) before upload
 * Invalidates CV and profile queries on success
 */
export const useUploadCV = (
  options?: Omit<
    UseMutationOptions<CVUploadResponseDTO, Error, UploadCVVariables>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, file }: UploadCVVariables) => cvApi.uploadCV(userId, file),
    onSuccess: (_data, variables) => {
      // Invalidate CV queries
      queryClient.invalidateQueries({ queryKey: cvStatusQueryKey(variables.userId) });
      queryClient.invalidateQueries({ queryKey: cvMetadataQueryKey(variables.userId) });
      // Invalidate profile queries (cv_uploaded_at was updated)
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: profileQueryKey(variables.userId) });
    },
    ...options,
  });
};

/**
 * Helper hook to validate file before showing upload UI
 * Returns validation result without uploading
 */
export const useValidateCV = () => {
  return {
    validate: (file: File): { valid: boolean; error?: string } => {
      try {
        cvApi.validateFile(file);
        return { valid: true };
      } catch (error) {
        return {
          valid: false,
          error: error instanceof Error ? error.message : 'Unknown validation error',
        };
      }
    },
    maxSize: 3 * 1024 * 1024, // 3MB
    maxSizeFormatted: '3MB',
    acceptedTypes: '.pdf',
    acceptedMimeTypes: ['application/pdf'],
  };
};
