import { expect, test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { sauceDemoUsers } from '../test-data/users';

type SauceDemoFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<SauceDemoFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(sauceDemoUsers.standard.username, sauceDemoUsers.standard.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');

    await use(page);
  },
});

export { expect };
