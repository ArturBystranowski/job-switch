import { describe, it, expect } from 'vitest';
import {
  isQuestionnaireComplete,
  hasAIRecommendations,
  hasValidResources,
} from '../types';

describe('Type Guards', () => {
  describe('isQuestionnaireComplete', () => {
    const validCompleteResponses = {
      work_style: 'independent',
      client_interaction: 'minimal',
      aesthetic_focus: 'low',
      teamwork_preference: 'medium',
      problem_solving_approach: 'analytical',
      leadership_preference: 'executor',
      technical_depth: 'deep',
      data_vs_design: 'data',
      coding_interest: 'daily_coding',
      uncertainty_handling: 'stability',
    };

    it('returns true for valid complete questionnaire', () => {
      expect(isQuestionnaireComplete(validCompleteResponses)).toBe(true);
    });

    it('returns true for complete questionnaire with optional open_answer', () => {
      const responsesWithOpenAnswer = {
        ...validCompleteResponses,
        open_answer: 'Additional comments here',
      };
      expect(isQuestionnaireComplete(responsesWithOpenAnswer)).toBe(true);
    });

    it('returns false for missing required field - work_style', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { work_style: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - client_interaction', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { client_interaction: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - aesthetic_focus', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { aesthetic_focus: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - teamwork_preference', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { teamwork_preference: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - problem_solving_approach', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { problem_solving_approach: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - leadership_preference', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { leadership_preference: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - technical_depth', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { technical_depth: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - data_vs_design', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data_vs_design: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - coding_interest', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { coding_interest: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for missing required field - uncertainty_handling', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { uncertainty_handling: _, ...incompleteResponses } = validCompleteResponses;
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for partial responses with only 2 fields', () => {
      const incompleteResponses = {
        work_style: 'independent',
        client_interaction: 'minimal',
      };
      expect(isQuestionnaireComplete(incompleteResponses)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isQuestionnaireComplete(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isQuestionnaireComplete(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isQuestionnaireComplete({})).toBe(false);
    });

    it('returns false when a field has non-string value', () => {
      const invalidResponses = {
        ...validCompleteResponses,
        work_style: 123, // should be string
      };
      expect(isQuestionnaireComplete(invalidResponses)).toBe(false);
    });

    it('returns false for array input', () => {
      expect(isQuestionnaireComplete([])).toBe(false);
    });

    it('returns false for primitive string', () => {
      expect(isQuestionnaireComplete('string')).toBe(false);
    });

    it('returns false for number input', () => {
      expect(isQuestionnaireComplete(42)).toBe(false);
    });

    it('handles open_answer as optional - undefined is valid', () => {
      const responsesWithoutOpenAnswer = {
        ...validCompleteResponses,
        open_answer: undefined,
      };
      expect(isQuestionnaireComplete(responsesWithoutOpenAnswer)).toBe(true);
    });
  });

  describe('hasAIRecommendations', () => {
    const validRecommendations = {
      recommendations: [
        {
          role_id: 1,
          role_name: 'Frontend Developer',
          justification: 'Based on your preferences...',
        },
        {
          role_id: 2,
          role_name: 'Backend Developer',
          justification: 'Your technical depth suggests...',
        },
      ],
      generated_at: '2025-01-27T12:00:00Z',
    };

    it('returns true for valid recommendations with multiple items', () => {
      expect(hasAIRecommendations(validRecommendations)).toBe(true);
    });

    it('returns true for valid recommendations with single item', () => {
      const singleRecommendation = {
        recommendations: [
          {
            role_id: 1,
            role_name: 'Frontend Developer',
            justification: 'Based on your preferences...',
          },
        ],
        generated_at: '2025-01-27T12:00:00Z',
      };
      expect(hasAIRecommendations(singleRecommendation)).toBe(true);
    });

    it('returns false for empty recommendations array', () => {
      const emptyRecommendations = {
        recommendations: [],
        generated_at: '2025-01-27T12:00:00Z',
      };
      expect(hasAIRecommendations(emptyRecommendations)).toBe(false);
    });

    it('returns false for missing generated_at', () => {
      const missingTimestamp = {
        recommendations: [
          {
            role_id: 1,
            role_name: 'Frontend Developer',
            justification: 'Based on your preferences...',
          },
        ],
      };
      expect(hasAIRecommendations(missingTimestamp)).toBe(false);
    });

    it('returns false for missing recommendations array', () => {
      const missingArray = {
        generated_at: '2025-01-27T12:00:00Z',
      };
      expect(hasAIRecommendations(missingArray)).toBe(false);
    });

    it('returns false for recommendations not being an array', () => {
      const invalidRecommendations = {
        recommendations: 'not-an-array',
        generated_at: '2025-01-27T12:00:00Z',
      };
      expect(hasAIRecommendations(invalidRecommendations)).toBe(false);
    });

    it('returns false for generated_at not being a string', () => {
      const invalidTimestamp = {
        recommendations: [
          {
            role_id: 1,
            role_name: 'Frontend Developer',
            justification: 'Based on your preferences...',
          },
        ],
        generated_at: 1234567890,
      };
      expect(hasAIRecommendations(invalidTimestamp)).toBe(false);
    });

    it('returns false for null', () => {
      expect(hasAIRecommendations(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(hasAIRecommendations(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(hasAIRecommendations({})).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(hasAIRecommendations('string')).toBe(false);
      expect(hasAIRecommendations(123)).toBe(false);
      expect(hasAIRecommendations(true)).toBe(false);
    });
  });

  describe('hasValidResources', () => {
    const validResources = {
      links: [
        {
          title: 'React Documentation',
          url: 'https://reactjs.org/docs',
          type: 'documentation',
        },
        {
          title: 'JavaScript Course',
          url: 'https://example.com/course',
          type: 'course',
        },
      ],
    };

    it('returns true for valid resources with multiple links', () => {
      expect(hasValidResources(validResources)).toBe(true);
    });

    it('returns true for valid resources with single link', () => {
      const singleLink = {
        links: [
          {
            title: 'React Documentation',
            url: 'https://reactjs.org/docs',
            type: 'documentation',
          },
        ],
      };
      expect(hasValidResources(singleLink)).toBe(true);
    });

    it('returns true for empty links array (still valid structure)', () => {
      const emptyLinks = {
        links: [],
      };
      expect(hasValidResources(emptyLinks)).toBe(true);
    });

    it('returns false for missing links property', () => {
      const missingLinks = {};
      expect(hasValidResources(missingLinks)).toBe(false);
    });

    it('returns false for links not being an array', () => {
      const invalidLinks = {
        links: 'not-an-array',
      };
      expect(hasValidResources(invalidLinks)).toBe(false);
    });

    it('returns false for links being an object', () => {
      const invalidLinks = {
        links: { url: 'https://example.com' },
      };
      expect(hasValidResources(invalidLinks)).toBe(false);
    });

    it('returns false for null', () => {
      expect(hasValidResources(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(hasValidResources(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(hasValidResources({})).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(hasValidResources('string')).toBe(false);
      expect(hasValidResources(123)).toBe(false);
      expect(hasValidResources(true)).toBe(false);
    });

    it('returns false for array input', () => {
      expect(hasValidResources([])).toBe(false);
    });
  });
});
