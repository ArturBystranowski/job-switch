import { Page, Locator } from '@playwright/test';

export class RecommendationsPage {
  readonly page: Page;
  readonly container: Locator;
  readonly loadingIndicator: Locator;
  readonly generateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('recommendations-container');
    this.loadingIndicator = page.getByTestId('recommendations-loading');
    this.generateButton = page.getByTestId('recommendations-generate-button');
  }

  async goto() {
    await this.page.goto('/recommendations');
  }

  async waitForRecommendations(timeout = 90000) {
    await this.container.waitFor({ state: 'visible', timeout });
  }

  async clickGenerateRecommendations() {
    await this.generateButton.click();
  }

  async isGenerateButtonVisible(): Promise<boolean> {
    return this.generateButton.isVisible({ timeout: 15000 }).catch(() => false);
  }

  getRoleCard(roleId: number): Locator {
    return this.page.getByTestId(`role-card-${roleId}`);
  }

  getRoleSelectButton(roleId: number): Locator {
    return this.page.getByTestId(`role-select-button-${roleId}`);
  }

  getRoleJustification(roleId: number): Locator {
    return this.page.getByTestId(`role-justification-${roleId}`);
  }

  async selectRole(roleId: number) {
    await this.getRoleSelectButton(roleId).click();
    const confirmCheckbox = this.page.getByTestId('role-confirm-checkbox');
    await confirmCheckbox.check();
    const confirmButton = this.page.getByRole('button', {
      name: /potwierdź wybór|confirm/i,
    });
    await confirmButton.click();
  }

  async getRecommendedRoleIds(): Promise<number[]> {
    const roleCards = await this.page
      .locator('[data-testid^="role-card-"]')
      .all();
    const roleIds: number[] = [];

    for (const card of roleCards) {
      const testId = await card.getAttribute('data-testid');
      if (testId) {
        const roleId = parseInt(testId.replace('role-card-', ''), 10);
        if (!isNaN(roleId)) {
          roleIds.push(roleId);
        }
      }
    }

    return roleIds;
  }
}
