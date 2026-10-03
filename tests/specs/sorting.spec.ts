import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { productNames } from '../test-data/products';
import { sauceDemoUsers, type SauceDemoUser } from '../test-data/users';

const ascendingNames = [...productNames].sort();
const descendingNames = [...ascendingNames].reverse();

async function assertBrokenSorting(page: Page, user: SauceDemoUser) {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  await login.goto();
  await login.login(user.username, user.password);
  const initial = await inventory.getProductNames();
  expect(initial).toEqual(ascendingNames);
  for (const option of ['za', 'lohi', 'hilo'] as const) {
    await inventory.selectSortOrder(option);
    expect(await inventory.getProductNames()).toEqual(initial);
  }
}

test.describe('Tri', () => {
  // US-03
  // AC-SORT-01
  // RISK-SORT-01
  // TC-TRI-01
  test('TC-TRI-01 @positive @regression @sorting @risk-sort-01 - tri des noms de A à Z', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    // 1. Choisir A-Z. 2. Relever les noms de haut en bas.
    await inventory.selectSortOrder('az');
    expect(await inventory.getProductNames()).toEqual(ascendingNames);
  });

  // US-03
  // AC-SORT-02
  // RISK-SORT-01
  // TC-TRI-02
  test('TC-TRI-02 @positive @regression @sorting @risk-sort-01 - tri des noms de Z à A', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    // 1. Choisir Z-A. 2. Relever les noms.
    await inventory.selectSortOrder('za');
    expect(await inventory.getProductNames()).toEqual(descendingNames);
  });

  // US-03
  // AC-SORT-03
  // RISK-SORT-01
  // TC-TRI-03
  test('TC-TRI-03 @positive @regression @sorting @risk-sort-01 - tri des prix croissants', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    // 1. Choisir le prix croissant. 2. Relever les six prix.
    await inventory.selectSortOrder('lohi');
    expect(await inventory.getProductPrices()).toEqual(['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99']);
  });

  // US-03
  // AC-SORT-04
  // RISK-SORT-01
  // TC-TRI-04
  test('TC-TRI-04 @positive @regression @sorting @risk-sort-01 - tri des prix décroissants', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    // 1. Choisir le prix décroissant. 2. Relever les six prix.
    await inventory.selectSortOrder('hilo');
    expect(await inventory.getProductPrices()).toEqual(['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99']);
  });

  // US-03
  // AC-SORT-05
  // RISK-SORT-01
  // TC-TRI-05
  test('TC-TRI-05 @error @regression @sorting @risk-sort-01 - tri inopérant de problem_user', async ({ page }) => {
    // 1. Noter l’ordre initial. 2. Choisir chaque option. 3. Relever chaque ordre.
    await assertBrokenSorting(page, sauceDemoUsers.problem);
    await expect(page).toHaveURL(/inventory\.html$/);
  });

  // US-03
  // AC-SORT-06
  // RISK-SORT-01
  // TC-TRI-06
  test('TC-TRI-06 @error @regression @sorting @risk-sort-01 - tri inopérant de error_user', async ({ page }) => {
    // 1. Noter l’ordre initial. 2. Choisir chaque option. 3. Comparer chaque ordre.
    await assertBrokenSorting(page, sauceDemoUsers.error);
    await expect(page).toHaveURL(/inventory\.html$/);
  });
});
