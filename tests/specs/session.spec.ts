// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md

import { test, expect } from '../fixtures/test-fixtures';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Session / Logout', () => {
  test('TC-SESSION-01 @positive @smoke @regression @session - Logout normal', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const loginPage = new LoginPage(authenticatedPage);

    // 1. Ouvrir le menu latéral.
    await inventoryPage.openMenu();

    // 2. Cliquer sur Logout.
    await inventoryPage.logout();

    // 3. Vérifier la page obtenue.
    await expect(authenticatedPage).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-SESSION-02 @negative @regression @session - Accès protégé refusé après logout', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const loginPage = new LoginPage(authenticatedPage);
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // 1. Après Logout, ouvrir directement `/cart.html`.
    await authenticatedPage.goto('/cart.html');
    await expect(authenticatedPage).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(authenticatedPage.getByTestId('inventory-item')).toHaveCount(0);
  });

  test('TC-SESSION-03 @error @negative @regression @session - Message d’accès interdit après logout', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const loginPage = new LoginPage(authenticatedPage);
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // 1. Après Logout, ouvrir directement `/inventory.html`.
    await authenticatedPage.goto('/inventory.html');
    await expect(authenticatedPage).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
    await expect(authenticatedPage.getByTestId('inventory-item')).toHaveCount(0);
  });
});
