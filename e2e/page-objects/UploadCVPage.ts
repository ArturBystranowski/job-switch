import { Page, Locator } from '@playwright/test';

export class UploadCVPage {
  readonly page: Page;
  readonly dropzone: Locator;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly nextButton: Locator;
  readonly skipButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropzone = page.getByTestId('cv-dropzone');
    this.fileInput = page.getByTestId('cv-file-input');
    this.uploadButton = page.getByTestId('cv-upload-button');
    this.nextButton = page.getByTestId('cv-next-button');
    this.skipButton = page.getByTestId('cv-skip-button');
  }

  async goto() {
    await this.page.goto('/upload-cv');
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async clickUpload() {
    await this.uploadButton.click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async skipUpload() {
    await this.skipButton.click();
  }

  async uploadAndProceed(filePath: string) {
    await this.uploadFile(filePath);
    await this.clickUpload();
    await this.page.waitForTimeout(2000);
    await this.clickNext();
  }

  async waitForUploadComplete() {
    await this.page.waitForURL('/recommendations', { timeout: 60000 });
  }
}
