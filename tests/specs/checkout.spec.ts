import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test-fixtures';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { productNames, products } from '../test-data/products';
import { sauceDemoUsers } from '../test-data/users';

const customer = { firstName: 'Jean', lastName: 'Dupont', postalCode: '75001' };

function moneyToCents(value: string): number {
  return Math.round(Number(value.replace(/[^\d.]/gu, '')) * 100);
}

async function openCheckout(page: Page, products: readonly string[] = []) {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  for (const product of products) await inventory.addProductByName(product);
  await inventory.openCart();
  await cart.checkout();
}

test.describe('Checkout', () => {
  // US-05
  // AC-CHK-01
  // RISK-CHK-01
  // Technique: EP, BVA, DT, ST, SBT
  // TC-CHK-01
  test('TC-CHK-01 @positive @smoke @regression @checkout @risk-chk-01 - finalisation d’une commande nominale', async ({
    authenticatedPage: page,
  }) => {
    const checkout = new CheckoutPage(page);
    // 1. Ouvrir Cart et Checkout. 2. Saisir les trois informations. 3. Continuer.
    await openCheckout(page, ['Sauce Labs Backpack']);
    await checkout.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.continue();
    // 4. Vérifier l’article. 5. Choisir Finish.
    await expect(checkout.itemByName('Sauce Labs Backpack')).toBeVisible();
    await checkout.finish();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkout.title).toHaveText('Checkout: Complete!');
    await expect(checkout.confirmationMessage).toHaveText('Thank you for your order!');
    await expect(checkout.backHomeButton).toBeVisible();
  });

  // US-05
  // AC-CHK-02
  // RISK-CHK-02
  // TC-CHK-02
  test('TC-CHK-02 @positive @smoke @regression @checkout @risk-chk-02 - exactitude du récapitulatif financier', async ({
    authenticatedPage: page,
  }) => {
    const checkout = new CheckoutPage(page);
    // 1. Accéder au checkout. 2. Renseigner les informations. 3. Continuer.
    await openCheckout(page, productNames);
    await checkout.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.continue();
    // 4. Additionner les prix et comparer sous-total, taxe et total.
    await expect(checkout.items).toHaveCount(products.length);
    for (const product of products) await expect(checkout.itemPrice(product.name)).toHaveText(product.price);
    const amounts = await checkout.items.getByTestId('inventory-item-price').allTextContents();
    const expectedSubtotalCents = products.reduce((total, product) => total + moneyToCents(product.price), 0);
    const subtotalCents = amounts.reduce((total, value) => total + moneyToCents(value), 0);
    const taxCents = moneyToCents(await checkout.tax.innerText());
    const totalCents = moneyToCents(await checkout.total.innerText());
    const expectedTotalCents = expectedSubtotalCents + taxCents;
    expect(subtotalCents).toBe(expectedSubtotalCents);
    await expect(checkout.subtotal).toHaveText(`Item total: $${(expectedSubtotalCents / 100).toFixed(2)}`);
    await expect(checkout.tax).toHaveText('Tax: $10.40');
    await expect(checkout.total).toHaveText(`Total: $${(expectedTotalCents / 100).toFixed(2)}`);
    expect(totalCents).toBe(expectedTotalCents);
  });

  // US-05
  // AC-CHK-03
  // RISK-CHK-04
  // Technique: EP, DT
  // TC-CHK-03
  test('TC-CHK-03 @error @regression @checkout @risk-chk-04 - prénom obligatoire', async ({
    authenticatedPage: page,
  }) => {
    const checkout = new CheckoutPage(page);
    await openCheckout(page);
    // 1. Choisir Continue sans saisie.
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  // US-05
  // AC-CHK-04
  // RISK-CHK-04
  // Technique: EP, DT
  // TC-CHK-04
  test('TC-CHK-04 @error @regression @checkout @risk-chk-04 - nom obligatoire', async ({ authenticatedPage: page }) => {
    const checkout = new CheckoutPage(page);
    await openCheckout(page);
    // 1. Saisir Jean. 2. Choisir Continue.
    await checkout.firstNameInput.fill('Jean');
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  // US-05
  // AC-CHK-05
  // RISK-CHK-04
  // Technique: EP, DT
  // TC-CHK-05
  test('TC-CHK-05 @error @regression @checkout @risk-chk-04 - code postal obligatoire', async ({
    authenticatedPage: page,
  }) => {
    const checkout = new CheckoutPage(page);
    await openCheckout(page);
    // 1. Saisir prénom et nom. 2. Choisir Continue.
    await checkout.firstNameInput.fill('Jean');
    await checkout.lastNameInput.fill('Dupont');
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  // US-05
  // AC-CHK-06
  // RISK-CHK-03
  // Technique: BVA, DT, SBT
  // TC-CHK-06
  test('TC-CHK-06 @negative @regression @checkout @risk-chk-03 - commande finalisée avec panier vide', async ({
    authenticatedPage: page,
  }) => {
    const checkout = new CheckoutPage(page);
    // 1. Ouvrir Checkout depuis le panier vide. 2. Saisir les informations. 3. Continuer.
    await openCheckout(page);
    await checkout.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.continue();
    // 4. Relever les montants. 5. Choisir Finish.
    await expect(checkout.items).toHaveCount(0);
    await expect(checkout.subtotal).toHaveText('Item total: $0');
    await expect(checkout.total).toHaveText('Total: $0.00');
    await checkout.finish();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkout.confirmationMessage).toHaveText('Thank you for your order!');
  });

  // US-05
  // AC-CHK-07
  // RISK-CHK-01, RISK-CHK-04
  // TC-CHK-07
  test('TC-CHK-07 @error @regression @checkout @risk-chk-01 @risk-chk-04 - nom impossible à renseigner pour problem_user', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const checkout = new CheckoutPage(page);
    await login.goto();
    await login.login(sauceDemoUsers.problem.username, sauceDemoUsers.problem.password);
    await openCheckout(page, ['Sauce Labs Backpack']);
    // 1. Saisir prénom, nom et code postal. 2. Relire les champs. 3. Choisir Continue.
    await checkout.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await expect(checkout.lastNameInput).toHaveValue('');
    await checkout.continue();
    await expect(checkout.errorMessage).toHaveText('Error: Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  // US-05
  // AC-CHK-08
  // RISK-CHK-01
  // Technique: ST
  // TC-CHK-08
  test('TC-CHK-08 @error @regression @checkout @risk-chk-01 - Finish inopérant pour error_user', async ({ page }) => {
    const login = new LoginPage(page);
    const checkout = new CheckoutPage(page);
    await login.goto();
    await login.login(sauceDemoUsers.error.username, sauceDemoUsers.error.password);
    await openCheckout(page, ['Sauce Labs Backpack']);
    await checkout.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.continue();
    // 1. Vérifier le récapitulatif. 2. Choisir Finish. 3. Observer l’adresse et les messages.
    await expect(checkout.itemByName('Sauce Labs Backpack')).toBeVisible();
    await checkout.finish();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkout.confirmationMessage).toBeHidden();
    await expect(checkout.errorMessage).toBeHidden();
  });
});
