// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md

import { test, expect } from '../fixtures/test-fixtures';
import { type Page } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

const productName = 'Sauce Labs Backpack';

async function openCheckout(authenticatedPage: Page) {
  const inventoryPage = new InventoryPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);

  await inventoryPage.addProductByName(productName);
  await inventoryPage.openCart();
  await cartPage.checkout();

  return { inventoryPage, cartPage, checkoutPage: new CheckoutPage(authenticatedPage) };
}

test.describe('Checkout', () => {
  test('TC-CHK-01 @positive @smoke @regression @checkout - Accès au checkout depuis le panier', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    await inventoryPage.addProductByName(productName);

    // 1. Ouvrir le panier.
    await inventoryPage.openCart();

    // 2. Cliquer sur Checkout.
    await cartPage.checkout();

    await expect(authenticatedPage).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
    await expect(checkoutPage.cancelButton).toBeVisible();
    await expect(checkoutPage.continueButton).toBeVisible();
    await expect(checkoutPage.cartBadge).toHaveText('1');
  });

  test('TC-CHK-02 @error @negative @regression @checkout - First Name obligatoire', async ({ authenticatedPage }) => {
    const { checkoutPage } = await openCheckout(authenticatedPage);

    // 1. Laisser First Name vide.
    await checkoutPage.firstNameInput.fill('');

    // 2. Saisir `Dupont` dans Last Name.
    await checkoutPage.lastNameInput.fill('Dupont');

    // 3. Saisir `75001` dans Zip/Postal Code.
    await checkoutPage.postalCodeInput.fill('75001');

    // 4. Cliquer sur Continue.
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(authenticatedPage).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('TC-CHK-03 @error @negative @regression @checkout - Last Name obligatoire', async ({ authenticatedPage }) => {
    const { checkoutPage } = await openCheckout(authenticatedPage);

    // 1. Saisir `Jean` dans First Name.
    await checkoutPage.firstNameInput.fill('Jean');

    // 2. Laisser Last Name vide.
    await checkoutPage.lastNameInput.fill('');

    // 3. Saisir `75001` dans Zip/Postal Code.
    await checkoutPage.postalCodeInput.fill('75001');

    // 4. Cliquer sur Continue.
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
    await expect(authenticatedPage).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('TC-CHK-04 @error @negative @regression @checkout - Postal Code obligatoire', async ({ authenticatedPage }) => {
    const { checkoutPage } = await openCheckout(authenticatedPage);

    // 1. Saisir `Jean` dans First Name.
    await checkoutPage.firstNameInput.fill('Jean');

    // 2. Saisir `Dupont` dans Last Name.
    await checkoutPage.lastNameInput.fill('Dupont');

    // 3. Laisser Zip/Postal Code vide.
    await checkoutPage.postalCodeInput.fill('');

    // 4. Cliquer sur Continue.
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
    await expect(authenticatedPage).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('TC-CHK-05 @positive @smoke @regression @checkout - Cohérence du récapitulatif', async ({
    authenticatedPage,
  }) => {
    const { checkoutPage } = await openCheckout(authenticatedPage);
    await checkoutPage.fillCustomerInformation('Jean', 'Dupont', '75001');

    // 1. Cliquer sur Continue.
    await checkoutPage.continue();

    await expect(authenticatedPage).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');

    // 2. Vérifier la ligne produit, les informations de paiement et de livraison.
    const backpack = checkoutPage.itemByName(productName);
    await expect(backpack.getByTestId('inventory-item-name')).toHaveText(productName);
    await expect(backpack.getByTestId('item-quantity')).toHaveText('1');
    await expect(backpack.getByTestId('inventory-item-price')).toHaveText('$29.99');
    await expect(checkoutPage.paymentInformation).toHaveText('SauceCard #31337');
    await expect(checkoutPage.shippingInformation).toHaveText('Free Pony Express Delivery!');

    // 3. Vérifier tous les montants.
    await expect(checkoutPage.subtotal).toHaveText('Item total: $29.99');
    await expect(checkoutPage.tax).toHaveText('Tax: $2.40');
    await expect(checkoutPage.total).toHaveText('Total: $32.39');
    await expect(checkoutPage.cancelButton).toBeVisible();
    await expect(checkoutPage.finishButton).toBeVisible();
  });

  test('TC-CHK-06 @positive @smoke @regression @checkout - Finalisation d’une commande', async ({
    authenticatedPage,
  }) => {
    const { checkoutPage } = await openCheckout(authenticatedPage);
    await checkoutPage.fillCustomerInformation('Jean', 'Dupont', '75001');
    await checkoutPage.continue();

    // 1. Cliquer sur Finish.
    await checkoutPage.finish();

    // 2. Vérifier la page de confirmation.
    await expect(authenticatedPage).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
    await expect(checkoutPage.shippingMessage).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
    await expect(checkoutPage.backHomeButton).toBeVisible();
    await expect(checkoutPage.generatePdfButton).toBeVisible();

    // 3. Cliquer sur Back Home.
    await checkoutPage.backHome();

    await expect(authenticatedPage).toHaveURL(/\/inventory\.html$/);
    await expect(new InventoryPage(authenticatedPage).title).toHaveText('Products');
    await expect(checkoutPage.cartBadge).toHaveCount(0);
  });

  test('TC-CHK-07 @negative @regression @checkout - Annulation du checkout', async ({ authenticatedPage }) => {
    const { cartPage, checkoutPage } = await openCheckout(authenticatedPage);

    // 1. Cliquer sur Cancel.
    await checkoutPage.cancel();

    await expect(authenticatedPage).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.productNames).toHaveText([productName]);
    await expect(cartPage.cartBadge).toHaveText('1');

    // 2. Recommencer le checkout avec des informations valides jusqu’à « Checkout: Overview ».
    await cartPage.checkout();
    await checkoutPage.fillCustomerInformation('Jean', 'Dupont', '75001');
    await checkoutPage.continue();
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');

    // 3. Cliquer sur Cancel.
    await checkoutPage.cancel();

    await expect(authenticatedPage).toHaveURL(/\/inventory\.html$/);
    const inventoryPage = new InventoryPage(authenticatedPage);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.productActionButton(productName)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
