import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Session', () => {
  // US-06
  // AC-SESSION-01
  // TC-SESSION-01
  test('TC-SESSION-01 @positive @regression @session - conservation après rafraîchissement', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    // 1. Rafraîchir Inventory. 2. Contrôler la page et le badge.
    await page.reload();
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.cartBadge).toHaveText('1');
    // 3. Ouvrir Cart.
    await inventory.openCart();
    await expect(cart.itemByName('Sauce Labs Backpack')).toBeVisible();
  });

  // US-06
  // AC-SESSION-02
  // TC-SESSION-02
  test('TC-SESSION-02 @positive @smoke @regression @session - déconnexion explicite', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const login = new LoginPage(page);
    // 1. Ouvrir le menu. 2. Choisir Logout.
    await inventory.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.loginButton).toBeVisible();
    await expect(inventory.title).toBeHidden();
  });

  // US-06
  // AC-SESSION-03
  // TC-SESSION-03
  test('TC-SESSION-03 @error @regression @session - refus d’une route protégée après logout', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const login = new LoginPage(page);
    await inventory.logout();
    // 1. Demander directement la route du panier.
    await page.goto('/cart.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.errorMessage).toHaveText(
      "Epic sadface: You can only access '/cart.html' when you are logged in.",
    );
  });

  // US-06
  // AC-SESSION-04
  // TC-SESSION-04
  test('TC-SESSION-04 @positive @regression @session - réinitialisation de l’état applicatif', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    // 1. Ouvrir le menu. 2. Choisir Reset App State. 3. Fermer le menu et ouvrir Cart.
    await inventory.resetAppState();
    await expect(inventory.cartBadge).toBeHidden();
    await inventory.closeMenu();
    await inventory.openCart();
    await expect(cart.items).toHaveCount(0);
    await expect(page).toHaveURL(/cart\.html$/);
  });
});
