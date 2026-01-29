export const generateTestUser = () => ({
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
});

export const testUser = generateTestUser();

export const questionnaireResponses = [
  'independent',
  'minimal',
  'low',
  'medium',
  'analytical',
  'executor',
  'deep',
  'data',
  'daily_coding',
  'stability',
];

export const testCVPath = './e2e/fixtures/sample-cv.pdf';
