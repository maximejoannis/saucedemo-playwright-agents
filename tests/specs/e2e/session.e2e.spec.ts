import { test, expect } from '../../fixtures/test-fixtures';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Session complète et protection après logout', () => {
  test('E2E-03 @e2e @negative @error @regression - Session fermée et accès protégé refusé', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Login.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // 2. Naviguer sur le catalogue.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');

    // 3. Ajouter un produit.
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 4. Effectuer Logout.
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // 5. Vérifier la page Login.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();

    // 6. Tenter un accès direct à `/inventory.html`.
    await page.goto('/inventory.html');

    // 7. Vérifier que l'accès est refusé.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(inventoryPage.title).toHaveCount(0);

    // 8. Vérifier le message d'accès interdit exact.
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });
});
