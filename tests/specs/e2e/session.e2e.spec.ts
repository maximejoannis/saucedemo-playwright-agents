import { test, expect } from '../../fixtures/test-fixtures';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';

test.describe('Parcours E2E de protection de session', () => {
  // Parcours transversal : Authentification → Catalogue → Session → Route protégée
  test('E2E-03 @e2e @negative @error @regression - protection de session après logout', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const login = new LoginPage(page);

    // Vérifier la connexion initiale au catalogue.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');

    // Se déconnecter et vérifier le retour à l’écran de connexion.
    await inventory.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.loginButton).toBeVisible();
    await expect(inventory.title).toBeHidden();

    // Tenter d’accéder directement à la page protégée du panier.
    await page.goto('/cart.html');

    // Vérifier le refus d’accès et l’absence de session active rétablie.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.errorMessage).toHaveText(
      "Epic sadface: You can only access '/cart.html' when you are logged in.",
    );
    await expect(login.loginButton).toBeVisible();
    await expect(inventory.title).toBeHidden();
  });
});
