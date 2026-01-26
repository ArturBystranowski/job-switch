import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { questionnaireApi } from '../api/questionnaire.api';
import type { QuestionnaireConfigDTO, QuestionnaireQuestionDTO } from '../types';

/** Query key for questionnaire configuration */
export const QUESTIONNAIRE_CONFIG_QUERY_KEY = ['questionnaire', 'config'] as const;

/** Query key factory for single question */
export const questionQueryKey = (fieldName: string) =>
  ['questionnaire', 'question', fieldName] as const;

/**
 * Hook to fetch complete questionnaire configuration
 * Questions and options are cached for 1 hour (config rarely changes)
 */
export const useQuestionnaireConfig = (
  options?: Omit<
    UseQueryOptions<QuestionnaireConfigDTO, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: QUESTIONNAIRE_CONFIG_QUERY_KEY,
    queryFn: () => questionnaireApi.getQuestionnaireConfig(),
    staleTime: 1000 * 60 * 60, // 1 hour - config changes rarely
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

/**
 * Hook to fetch a single question by field name
 * Useful for step-by-step questionnaire forms
 */
export const useQuestion = (
  fieldName: string,
  options?: Omit<
    UseQueryOptions<QuestionnaireQuestionDTO | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: questionQueryKey(fieldName),
    queryFn: () => questionnaireApi.getQuestionByFieldName(fieldName),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!fieldName,
    ...options,
  });
};

/**
 * Helper to get option label by value from config
 * Useful for displaying selected answers in summary
 */
export const getOptionLabel = (
  config: QuestionnaireConfigDTO,
  fieldName: string,
  optionValue: string
): string | undefined => {
  const question = config.find((q) => q.field_name === fieldName);
  if (!question) return undefined;

  const option = question.options.find((o) => o.option_value === optionValue);
  return option?.option_label;
};

/**
 * Helper to validate if all required fields are filled
 */
export const validateQuestionnaireResponses = (
  config: QuestionnaireConfigDTO,
  responses: Record<string, string>
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  for (const question of config) {
    if (!responses[question.field_name]) {
      missingFields.push(question.field_name);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
