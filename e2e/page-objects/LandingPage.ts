import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly hero: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hero = page.getByTestId('landing-hero');
    this.startButton = page.getByTestId('landing-start-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickStart() {
    await this.startButton.click();
  }
}
