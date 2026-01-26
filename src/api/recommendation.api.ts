import { supabaseClient } from '../db/supabase.client';
import type { AIRecommendationDTO, AIRecommendationsDTO } from '../types';

interface GenerateRecommendationResponse {
  success: boolean;
  recommendations: AIRecommendationDTO[];
  generated_at: string;
}

interface RecommendationError {
  error: string;
  message: string;
  missing_fields?: string[];
}

/**
 * Recommendation API module
 * Handles AI-powered role recommendation generation
 * Note: MVP version works without authentication using hardcoded dev user
 */
export const recommendationApi = {
  /**
   * Generate AI role recommendation based on questionnaire and CV
   * For MVP: Uses service role key or anon key with user_id in body
   * @param userId - UUID of the user (for MVP without auth)
   * @returns Promise<GenerateRecommendationResponse>
   * @throws Error with specific error codes
   */
  async generateRecommendation(userId: string): Promise<GenerateRecommendationResponse> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-recommendation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as RecommendationError;
      throw new Error(`${errorData.error}: ${errorData.message}`);
    }

    return data as GenerateRecommendationResponse;
  },

  /**
   * Check if user can generate recommendation
   * Returns status of prerequisites (questionnaire, CV)
   * @param userId - UUID of the user
   */
  async canGenerateRecommendation(userId: string): Promise<{
    canGenerate: boolean;
    questionnaireCompleted: boolean;
    cvUploaded: boolean;
    recommendationsExist: boolean;
  }> {
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('questionnaire_responses, cv_uploaded_at, ai_recommendations')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const responses = profile.questionnaire_responses as Record<string, unknown> | null;
    const requiredFields = ['work_style', 'client_interaction', 'aesthetic_focus', 'teamwork_preference', 'problem_solving_approach'];
    
    const questionnaireCompleted = requiredFields.every(
      field => responses && responses[field]
    );

    const cvUploaded = !!profile.cv_uploaded_at;
    const recommendationsExist = !!profile.ai_recommendations;

    return {
      canGenerate: questionnaireCompleted && !recommendationsExist,
      questionnaireCompleted,
      cvUploaded,
      recommendationsExist,
    };
  },

  /**
   * Get existing recommendations from profile
   * @param userId - UUID of the user
   */
  async getRecommendations(userId: string): Promise<AIRecommendationsDTO | null> {
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('ai_recommendations')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    return profile.ai_recommendations as AIRecommendationsDTO | null;
  },
};
