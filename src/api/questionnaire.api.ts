import { supabaseClient } from '../db/supabase.client';
import type { QuestionnaireConfigDTO, QuestionnaireQuestionDTO } from '../types';

/**
 * Questionnaire API module
 * Handles fetching questionnaire configuration (questions and options)
 */
export const questionnaireApi = {
  /**
   * Fetch complete questionnaire configuration
   * Returns questions with their predefined answer options
   * @returns Promise<QuestionnaireConfigDTO> - Array of questions with options
   * @throws Error if Supabase query fails
   */
  async getQuestionnaireConfig(): Promise<QuestionnaireConfigDTO> {
    // Fetch questions
    const { data: questions, error: questionsError } = await supabaseClient
      .from('questionnaire_questions')
      .select('id, field_name, question_text, question_order')
      .eq('is_active', true)
      .order('question_order', { ascending: true });

    if (questionsError) {
      throw new Error(questionsError.message);
    }

    if (!questions || questions.length === 0) {
      return [];
    }

    // Fetch all options for the questions
    const questionIds = questions.map((q) => q.id);
    const { data: options, error: optionsError } = await supabaseClient
      .from('questionnaire_options')
      .select('id, question_id, option_value, option_label, option_order')
      .in('question_id', questionIds)
      .order('option_order', { ascending: true });

    if (optionsError) {
      throw new Error(optionsError.message);
    }

    // Group options by question_id
    const optionsByQuestion = (options ?? []).reduce(
      (acc, opt) => {
        const qId = opt.question_id;
        if (!acc[qId]) {
          acc[qId] = [];
        }
        acc[qId].push({
          id: opt.id,
          option_value: opt.option_value,
          option_label: opt.option_label,
          option_order: opt.option_order,
        });
        return acc;
      },
      {} as Record<number, QuestionnaireQuestionDTO['options']>
    );

    // Combine questions with their options
    const config: QuestionnaireConfigDTO = questions.map((q) => ({
      id: q.id,
      field_name: q.field_name,
      question_text: q.question_text,
      question_order: q.question_order,
      options: optionsByQuestion[q.id] ?? [],
    }));

    return config;
  },

  /**
   * Get a single question by field name
   * @param fieldName - The field_name of the question
   * @returns Promise<QuestionnaireQuestionDTO | null>
   */
  async getQuestionByFieldName(
    fieldName: string
  ): Promise<QuestionnaireQuestionDTO | null> {
    const { data: question, error: questionError } = await supabaseClient
      .from('questionnaire_questions')
      .select('id, field_name, question_text, question_order')
      .eq('field_name', fieldName)
      .eq('is_active', true)
      .single();

    if (questionError) {
      if (questionError.code === 'PGRST116') return null;
      throw new Error(questionError.message);
    }

    const { data: options, error: optionsError } = await supabaseClient
      .from('questionnaire_options')
      .select('id, option_value, option_label, option_order')
      .eq('question_id', question.id)
      .order('option_order', { ascending: true });

    if (optionsError) {
      throw new Error(optionsError.message);
    }

    return {
      id: question.id,
      field_name: question.field_name,
      question_text: question.question_text,
      question_order: question.question_order,
      options: (options ?? []).map((opt) => ({
        id: opt.id,
        option_value: opt.option_value,
        option_label: opt.option_label,
        option_order: opt.option_order,
      })),
    };
  },
};
