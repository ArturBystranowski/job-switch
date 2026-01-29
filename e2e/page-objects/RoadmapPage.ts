import { Page, Locator } from '@playwright/test';

export class RoadmapPage {
  readonly page: Page;
  readonly container: Locator;
  readonly progressHeader: Locator;
  readonly progressPercentage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('roadmap-container');
    this.progressHeader = page.getByTestId('roadmap-progress-header');
    this.progressPercentage = page.getByTestId('roadmap-progress-percentage');
  }

  async goto() {
    await this.page.goto('/roadmap');
  }

  getStep(stepNumber: number): Locator {
    return this.page.getByTestId(`roadmap-step-${stepNumber}`);
  }

  async waitForRoadmapLoaded() {
    await this.container.waitFor({ state: 'visible', timeout: 30000 });
  }

  async getProgressPercentage(): Promise<string> {
    const text = await this.progressPercentage.textContent();
    return text ?? '0%';
  }

  async clickStep(stepNumber: number) {
    await this.getStep(stepNumber).click();
  }

  async getStepsCount(): Promise<number> {
    const steps = await this.page
      .locator('[data-testid^="roadmap-step-"]')
      .all();
    return steps.length;
  }
}
