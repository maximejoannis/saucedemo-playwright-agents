import { expect, test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type SauceDemoFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<SauceDemoFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await use(page);
  },
});

export { expect };
