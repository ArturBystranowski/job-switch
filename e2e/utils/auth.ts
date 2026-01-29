import { Page } from '@playwright/test';
import { RegisterPage, LoginPage } from '../page-objects';

export async function registerUser(
  page: Page,
  email: string,
  password: string
) {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.register(email, password);
}

export async function loginUser(page: Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
}
