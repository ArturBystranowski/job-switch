import { test, expect } from '@playwright/test';
import {
  LandingPage,
  RegisterPage,
  LoginPage,
  QuestionnairePage,
  UploadCVPage,
  RecommendationsPage,
  RoadmapPage,
} from './page-objects';
import { generateTestUser, questionnaireResponses } from './fixtures/test-data';

test.describe('User Journey - Registration to Roadmap', () => {
  test('complete user journey from registration to roadmap display', async ({
    page,
  }) => {
    const testUser = generateTestUser();

    const landingPage = new LandingPage(page);
    const registerPage = new RegisterPage(page);
    const questionnairePage = new QuestionnairePage(page);
    const uploadCVPage = new UploadCVPage(page);
    const recommendationsPage = new RecommendationsPage(page);
    const roadmapPage = new RoadmapPage(page);

    await test.step('Step 1: Landing Page', async () => {
      await landingPage.goto();
      await expect(landingPage.hero).toBeVisible();
      await landingPage.clickStart();
    });

    await test.step('Step 2: Register new user', async () => {
      await expect(page).toHaveURL(/\/(login|register)/);

      if (page.url().includes('/login')) {
        await page.getByRole('link', { name: /zarejestruj/i }).click();
      }

      await expect(registerPage.form).toBeVisible();
      await registerPage.register(testUser.email, testUser.password);

      await expect(page).toHaveURL('/', { timeout: 15000 });
    });

    await test.step('Step 3: Start questionnaire from homepage', async () => {
      await expect(landingPage.hero).toBeVisible();
      await landingPage.clickStart();

      await page.waitForURL(/\/(questionnaire|recommendations|roadmap)/, {
        timeout: 15000,
      });
    });

    await test.step('Step 4: Complete questionnaire', async () => {
      if (!page.url().includes('/questionnaire')) {
        await questionnairePage.goto();
      }

      await expect(questionnairePage.stepper).toBeVisible();

      for (const optionValue of questionnaireResponses) {
        await expect(questionnairePage.questionCard).toBeVisible({
          timeout: 10000,
        });
        await questionnairePage.selectOption(optionValue);
        await questionnairePage.clickNext();
      }

      await expect(questionnairePage.openAnswerInput).toBeVisible({
        timeout: 10000,
      });
      await questionnairePage.clickNext();

      await page.waitForURL('/upload-cv', { timeout: 15000 });
    });

    await test.step('Step 5: Upload CV (skip for faster testing)', async () => {
      await expect(uploadCVPage.dropzone).toBeVisible();

      await uploadCVPage.skipUpload();

      await page.waitForURL('/recommendations', { timeout: 15000 });
    });

    await test.step('Step 6: Generate and view recommendations', async () => {
      await recommendationsPage.generateButton.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await recommendationsPage.clickGenerateRecommendations();

      const errorLocator = page.getByTestId('recommendations-generate-error');
      await Promise.race([
        recommendationsPage.container.waitFor({
          state: 'visible',
          timeout: 90000,
        }),
        errorLocator.waitFor({ state: 'visible', timeout: 90000 }).then(() => {
          throw new Error(
            'Recommendation generation failed (e.g. Failed to fetch). ' +
              'Check Supabase Edge Function logs and OPENROUTER_API_KEY in project secrets.'
          );
        }),
      ]);
      await expect(recommendationsPage.container).toBeVisible();

      const roleIds = await recommendationsPage.getRecommendedRoleIds();
      expect(roleIds.length).toBeGreaterThanOrEqual(1);

      for (const roleId of roleIds) {
        await expect(recommendationsPage.getRoleCard(roleId)).toBeVisible();
      }
    });

    await test.step('Step 7: Select a role', async () => {
      const roleIds = await recommendationsPage.getRecommendedRoleIds();
      const selectedRoleId = roleIds[0];

      await recommendationsPage.selectRole(selectedRoleId);

      await page.waitForURL('/roadmap', { timeout: 15000 });
    });

    await test.step('Step 8: Verify roadmap is displayed', async () => {
      await roadmapPage.waitForRoadmapLoaded();

      await expect(roadmapPage.container).toBeVisible();
      await expect(roadmapPage.progressHeader).toBeVisible();

      const progressText = await roadmapPage.getProgressPercentage();
      expect(progressText).toMatch(/\d+%/);

      const stepsCount = await roadmapPage.getStepsCount();
      expect(stepsCount).toBeGreaterThan(0);

      const step1 = roadmapPage.getStep(1);
      await expect(step1).toBeVisible({ timeout: 5000 });
    });
  });

  test('landing page loads correctly for unauthenticated user', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await landingPage.goto();

    await expect(landingPage.hero).toBeVisible();
    await expect(landingPage.startButton).toBeVisible();
    await expect(landingPage.startButton).toContainText(/zaloguj/i);
  });

  test('registration form validation works', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.fillForm('invalid-email', 'weak', 'different');
    await registerPage.submit();

    await expect(page.getByText(/nieprawidłowy format email/i)).toBeVisible();
  });

  test('login form shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('nonexistent@example.com', 'WrongPassword123!');

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
  });
});
