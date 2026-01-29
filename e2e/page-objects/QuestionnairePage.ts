import { Page, Locator } from '@playwright/test';

export class QuestionnairePage {
  readonly page: Page;
  readonly stepper: Locator;
  readonly questionCard: Locator;
  readonly backButton: Locator;
  readonly nextButton: Locator;
  readonly openAnswerInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepper = page.getByTestId('questionnaire-stepper');
    this.questionCard = page.getByTestId('questionnaire-card');
    this.backButton = page.getByTestId('questionnaire-back-button');
    this.nextButton = page.getByTestId('questionnaire-next-button');
    this.openAnswerInput = page.getByTestId('questionnaire-open-answer-input');
  }

  async goto() {
    await this.page.goto('/questionnaire');
  }

  async selectOption(value: string) {
    await this.page.getByTestId(`questionnaire-option-${value}`).click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async fillOpenAnswer(text: string) {
    await this.openAnswerInput.fill(text);
  }

  async answerQuestionAndProceed(optionValue: string) {
    await this.selectOption(optionValue);
    await this.clickNext();
  }

  async completeQuestionnaire(responses: string[], openAnswer?: string) {
    for (const value of responses) {
      await this.selectOption(value);
      await this.clickNext();
    }

    if (openAnswer) {
      await this.fillOpenAnswer(openAnswer);
    }

    await this.clickNext();
  }
}
