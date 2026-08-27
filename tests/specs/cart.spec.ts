// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md

import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { CheckoutPage } from '../pages/checkout.page';
import { LoginPage } from '../pages/login.page';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';

test.describe('Panier', () => {
  test('TC-PAN-01 @positive @smoke @regression @cart - Ajout de deux produits et compteur', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    // 1. Cliquer sur Add to cart pour Sauce Labs Backpack.
    await inventoryPage.addProductByName(backpack);

    // 2. Vérifier le bouton de la fiche et le badge du panier.
    await expect(inventoryPage.productActionButton(backpack)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 3. Ajouter Sauce Labs Bike Light et vérifier le compteur.
    await inventoryPage.addProductByName(bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // 4. Ouvrir le panier et vérifier son contenu.
    await inventoryPage.openCart();
    await expect(authenticatedPage).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemByName(backpack)).toHaveCount(1);
    await expect(cartPage.itemByName(bikeLight)).toHaveCount(1);
    await expect(cartPage.productQuantity(backpack)).toHaveText('1');
    await expect(cartPage.productQuantity(bikeLight)).toHaveText('1');
    await expect(cartPage.productPrice(backpack)).toHaveText('$29.99');
    await expect(cartPage.productPrice(bikeLight)).toHaveText('$9.99');
  });

  test('TC-PAN-02 @positive @regression @cart - Suppression jusqu’au panier vide', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    // Précondition : ajouter Backpack puis Bike Light.
    await inventoryPage.addProductByName(backpack);
    await inventoryPage.addProductByName(bikeLight);

    // 1. Ouvrir le panier et supprimer Bike Light.
    await inventoryPage.openCart();
    await cartPage.removeProductByName(bikeLight);

    // 2. Vérifier le contenu et le badge.
    await expect(cartPage.itemByName(bikeLight)).toHaveCount(0);
    await expect(cartPage.itemByName(backpack)).toHaveCount(1);
    await expect(cartPage.cartBadge).toHaveText('1');

    // 3. Supprimer Backpack.
    await cartPage.removeProductByName(backpack);

    // 4. Vérifier le panier et l'absence du badge numérique.
    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.cartBadge).toHaveCount(0);
  });

  test('TC-PAN-03 @positive @regression @cart - Conservation entre catalogue et panier', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    // 1. Ajouter Sauce Labs Backpack.
    await inventoryPage.addProductByName(backpack);

    // 2. Ouvrir le panier et vérifier la présence du produit.
    await inventoryPage.openCart();
    await expect(cartPage.itemByName(backpack)).toHaveCount(1);

    // 3. Cliquer sur Continue Shopping.
    await cartPage.continueShopping();

    // 4. Vérifier le catalogue, le bouton du produit et le compteur.
    await expect(authenticatedPage).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.productActionButton(backpack)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 5. Rouvrir le panier et vérifier que Backpack est toujours présent.
    await inventoryPage.openCart();
    await expect(cartPage.itemByName(backpack)).toHaveCount(1);
  });

  test('TC-PAN-04 @negative @cart @checkout - Checkout accessible malgré un panier vide', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    // 1. Ouvrir le panier vide et cliquer Checkout.
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(0);
    await cartPage.checkout();

    // 2. Renseigner les trois champs puis continuer.
    await checkoutPage.fillCustomerInformation('Jean', 'Dupont', '75001');
    await checkoutPage.continue();

    await expect(authenticatedPage).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.items).toHaveCount(0);
    await expect(checkoutPage.subtotal).toHaveText('Item total: $0');
    await expect(checkoutPage.finishButton).toBeVisible();
  });

  test('TC-PAN-05 @error @cart @regression - Ajouts refusés silencieusement avec error_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('error_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);

    // 1. Cliquer Add to cart sur Bolt T-Shirt puis Fleece Jacket.
    await inventoryPage.addProductByName('Sauce Labs Bolt T-Shirt');
    await inventoryPage.addProductByName('Sauce Labs Fleece Jacket');

    // 2. Examiner boutons et badge.
    await expect(inventoryPage.productActionButton('Sauce Labs Bolt T-Shirt')).toHaveText('Add to cart');
    await expect(inventoryPage.productActionButton('Sauce Labs Fleece Jacket')).toHaveText('Add to cart');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
