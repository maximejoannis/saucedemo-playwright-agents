import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { productNames } from '../test-data/products';
import { sauceDemoUsers, type SauceDemoUser } from '../test-data/users';

const partiallyAdded = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Onesie'];

async function assertPartialAdds(page: Page, user: SauceDemoUser) {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  await login.goto();
  await login.login(user.username, user.password);
  for (const name of productNames) await inventory.addProductByName(name);
  await expect(inventory.cartBadge).toHaveText('3');
  for (const name of partiallyAdded) await expect(inventory.productActionButton(name)).toHaveText('Remove');
  for (const name of productNames.filter((name) => !partiallyAdded.includes(name)))
    await expect(inventory.productActionButton(name)).toHaveText('Add to cart');
  await inventory.openCart();
  expect(await cart.getProductNames()).toEqual(partiallyAdded);
}

test.describe('Panier', () => {
  // US-04
  // AC-CART-01
  // TC-PAN-01
  test('TC-PAN-01 @positive @smoke @regression @cart - ajout d’un produit', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    // 1. Ajouter Backpack. 2. Contrôler le badge et le bouton.
    await inventory.addProductByName('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await expect(inventory.productActionButton('Sauce Labs Backpack')).toHaveText('Remove');
    // 3. Ouvrir Cart.
    await inventory.openCart();
    await expect(cart.itemByName('Sauce Labs Backpack')).toBeVisible();
    await expect(cart.productPrice('Sauce Labs Backpack')).toHaveText('$29.99');
    await expect(cart.productQuantity('Sauce Labs Backpack')).toHaveText('1');
  });

  // US-04
  // AC-CART-02
  // TC-PAN-02
  test('TC-PAN-02 @positive @regression @cart - retrait d’un produit', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    await inventory.addProductByName('Sauce Labs Backpack');
    // 1. Ouvrir Cart. 2. Choisir Remove.
    await inventory.openCart();
    await cart.removeProductByName('Sauce Labs Backpack');
    await expect(cart.items).toHaveCount(0);
    await expect(cart.cartBadge).toBeHidden();
  });

  // US-04
  // AC-CART-03
  // TC-PAN-03
  test('TC-PAN-03 @positive @regression @cart - conservation du panier pendant la navigation', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    // 1. Ajouter Bike Light. 2. Ouvrir une fiche puis revenir.
    await inventory.addProductByName('Sauce Labs Bike Light');
    await inventory.openProductByName('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(inventory.cartBadge).toHaveText('1');
    // 3. Ouvrir Cart. 4. Revenir à Inventory.
    await inventory.openCart();
    await expect(cart.itemByName('Sauce Labs Bike Light')).toBeVisible();
    await cart.continueShopping();
    await expect(inventory.cartBadge).toHaveText('1');
  });

  // US-04
  // AC-CART-04
  // TC-PAN-04
  test('TC-PAN-04 @negative @regression @cart - accès au checkout avec panier vide', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    // 1. Ouvrir Cart. 2. Vérifier l’absence de ligne. 3. Choisir Checkout.
    await inventory.openCart();
    await expect(cart.items).toHaveCount(0);
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  // US-04
  // AC-CART-05
  // TC-PAN-05
  test('TC-PAN-05 @error @regression @cart - ajouts partiels de problem_user', async ({ page }) => {
    // 1. Choisir Add to cart sur chaque produit. 2. Observer boutons et badge. 3. Ouvrir Cart.
    await assertPartialAdds(page, sauceDemoUsers.problem);
    await expect(page).toHaveURL(/cart\.html$/);
  });

  // US-04
  // AC-CART-05
  // TC-PAN-06
  test('TC-PAN-06 @error @regression @cart - ajouts partiels de error_user', async ({ page }) => {
    // 1. Ajouter les six produits. 2. Observer badge et boutons. 3. Ouvrir Cart.
    await assertPartialAdds(page, sauceDemoUsers.error);
    await expect(page).toHaveURL(/cart\.html$/);
  });
});
