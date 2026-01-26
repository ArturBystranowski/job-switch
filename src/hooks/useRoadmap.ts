import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { roadmapApi } from '../api/roadmap.api';
import type { RoadmapStepDTO, RoadmapStepWithVariantsDTO } from '../types';

/** Query key factory for roadmap by role */
export const roadmapQueryKey = (roleId: number) => ['roadmap', roleId] as const;

/** Query key factory for single step */
export const stepQueryKey = (stepId: number) => ['roadmap', 'step', stepId] as const;

/**
 * Hook to fetch complete roadmap with all steps and variants for a role
 * Uses React Query for caching and state management
 */
export const useRoadmap = (
  roleId: number,
  options?: Omit<
    UseQueryOptions<RoadmapStepWithVariantsDTO[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: roadmapQueryKey(roleId),
    queryFn: () => roadmapApi.getRoadmapByRoleId(roleId),
    staleTime: 1000 * 60 * 60, // 1 hour - roadmap data is static
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: roleId > 0, // Only fetch if valid roleId
    ...options,
  });
};

/**
 * Hook to fetch a single roadmap step with its variants
 * Uses React Query for caching and state management
 */
export const useRoadmapStep = (
  stepId: number,
  options?: Omit<
    UseQueryOptions<RoadmapStepWithVariantsDTO | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: stepQueryKey(stepId),
    queryFn: () => roadmapApi.getStepById(stepId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: stepId > 0, // Only fetch if valid stepId
    ...options,
  });
};

/**
 * Hook to fetch roadmap steps without variants (lighter payload)
 * Useful for navigation/overview components
 */
export const useRoadmapSteps = (
  roleId: number,
  options?: Omit<UseQueryOptions<RoadmapStepDTO[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...roadmapQueryKey(roleId), 'steps-only'],
    queryFn: () => roadmapApi.getStepsByRoleId(roleId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: roleId > 0,
    ...options,
  });
};
