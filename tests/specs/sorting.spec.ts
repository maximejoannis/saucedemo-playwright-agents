// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md

import { test, expect } from '../fixtures/test-fixtures';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

const ascendingNames = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

test.describe('Tri des produits', () => {
  test('TC-TRI-01 @positive @regression @catalog @sorting - Tris alphabétiques A–Z et Z–A', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // 1. Choisir Name (Z to A) dans le sélecteur de tri.
    await inventoryPage.selectSortOrder('za');
    await expect(inventoryPage.sortSelect).toHaveValue('za');

    // 2. Relever l’ordre des produits.
    const descendingNames = await inventoryPage.getProductNames();
    const expectedDescendingNames = [...descendingNames].sort((a, b) => b.localeCompare(a));
    expect(descendingNames).toEqual(expectedDescendingNames);

    // 3. Choisir Name (A to Z).
    await inventoryPage.selectSortOrder('az');
    await expect(inventoryPage.sortSelect).toHaveValue('az');

    // 4. Relever de nouveau l’ordre.
    const ascendingNames = await inventoryPage.getProductNames();
    const expectedAscendingNames = [...ascendingNames].sort((a, b) => a.localeCompare(b));
    expect(ascendingNames).toEqual(expectedAscendingNames);
    expect(ascendingNames).toEqual([...descendingNames].reverse());
  });

  test('TC-TRI-02 @positive @regression @catalog @sorting - Tris de prix croissant et décroissant', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // 1. Choisir Price (low to high).
    await inventoryPage.selectSortOrder('lohi');
    await expect(inventoryPage.sortSelect).toHaveValue('lohi');

    // 2. Relever les prix et les produits dans l’ordre affiché.
    const ascendingPrices = (await inventoryPage.getProductPrices()).map((price) => Number(price.replace('$', '')));
    const expectedAscendingPrices = [...ascendingPrices].sort((a, b) => a - b);
    expect(ascendingPrices).toEqual(expectedAscendingPrices);

    // 3. Choisir Price (high to low).
    await inventoryPage.selectSortOrder('hilo');
    await expect(inventoryPage.sortSelect).toHaveValue('hilo');

    // 4. Relever les prix et les produits dans l’ordre affiché.
    const descendingPrices = (await inventoryPage.getProductPrices()).map((price) => Number(price.replace('$', '')));
    const expectedDescendingPrices = [...descendingPrices].sort((a, b) => b - a);
    expect(descendingPrices).toEqual(expectedDescendingPrices);
    expect(descendingPrices).toEqual([...ascendingPrices].reverse());
  });

  test('TC-TRI-03 @negative @sorting @regression - Tri Z–A sans effet avec problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);

    // 1. Choisir Z–A et relever l’ordre affiché.
    await inventoryPage.selectSortOrder('za');
    await expect(inventoryPage.productNames).toHaveText(ascendingNames);
  });

  test('TC-TRI-04 @error @sorting @regression - Comportement dégradé du tri avec error_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('error_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);

    // 1. Choisir Z–A et relever l’ordre résultant.
    await inventoryPage.selectSortOrder('za');
    await expect(inventoryPage.productNames).toHaveText(ascendingNames);
  });
});
