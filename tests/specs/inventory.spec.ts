// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md

import { test, expect } from '../fixtures/test-fixtures';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

const expectedProducts = [
  { name: 'Sauce Labs Backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', price: '$9.99' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
  { name: 'Sauce Labs Onesie', price: '$7.99' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
];

test.describe('Catalogue des produits', () => {
  test('TC-CAT-01 @positive @smoke @regression @catalog - Affichage nominal du catalogue', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // 1. Vérifier le titre de la page et le sélecteur de tri.
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.sortSelect).toHaveValue('az');
    await expect(inventoryPage.sortSelect.locator('option:checked')).toHaveText('Name (A to Z)');

    // 2. Parcourir toutes les fiches du catalogue.
    await expect(inventoryPage.products).toHaveCount(6);
    await expect(inventoryPage.productNames).toHaveText(expectedProducts.map(({ name }) => name));
    await expect(inventoryPage.productPrices).toHaveText(expectedProducts.map(({ price }) => price));

    // 3. Vérifier pour chaque fiche le nom, la description, l’image, le prix et le bouton Add to cart.
    for (const { name, price } of expectedProducts) {
      const product = inventoryPage.productByName(name);
      await expect(product).toHaveCount(1);
      await expect(product.getByTestId('inventory-item-name')).toHaveText(name);
      await expect(product.getByTestId('inventory-item-desc')).not.toHaveText('');
      await expect(product.getByTestId('inventory-item-price')).toHaveText(price);
      await expect(product.getByRole('img', { name })).toBeVisible();
      await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }
  });

  test('TC-CAT-02 @positive @regression @catalog - Consultation puis retour depuis le détail du Backpack', async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    // 1. Cliquer sur le nom « Sauce Labs Backpack ».
    await inventoryPage.openProductByName('Sauce Labs Backpack');
    await expect(authenticatedPage).toHaveURL(/\/inventory-item\.html\?id=4$/);

    // 2. Vérifier le détail du produit.
    await expect(authenticatedPage.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(authenticatedPage.getByTestId('inventory-item-desc')).toHaveText(
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    );
    await expect(authenticatedPage.getByTestId('inventory-item-price')).toHaveText('$29.99');
    await expect(authenticatedPage.getByRole('button', { name: 'Add to cart' })).toBeVisible();

    // 3. Cliquer sur Back to products.
    await authenticatedPage.getByRole('button', { name: 'Back to products' }).click();
    await expect(authenticatedPage).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('TC-CAT-03 @negative @catalog @regression - Le parcours produit n’aboutit pas au produit choisi avec problem_user', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('problem_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);

    // 1. Cliquer sur le nom du Backpack.
    await inventoryPage.openProductByName('Sauce Labs Backpack');

    // 2. Relever l’URL, le nom et le prix du détail affiché.
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=5$/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(page.getByTestId('inventory-item-price')).toHaveText('$49.99');
  });

  test('TC-CAT-04 @error @catalog @regression - Erreur visible pour un identifiant produit inexistant', async ({
    authenticatedPage,
  }) => {
    // 1. Ouvrir directement l’URL du produit inexistant.
    await authenticatedPage.goto('/inventory-item.html?id=999');

    // 2. Examiner la fiche affichée.
    await expect(authenticatedPage.getByTestId('inventory-item-name')).toHaveText('ITEM NOT FOUND');
    await expect(authenticatedPage.getByTestId('inventory-item-desc')).toHaveText(
      "We're sorry, but your call could not be completed as dialled. Please check your number, and try your call again. If you are in need of assistance, please dial 0 to be connected with an operator. This is a recording. 4 T 1.",
    );
    await expect(authenticatedPage.getByRole('button', { name: 'Back to products' })).toBeVisible();
  });
});
