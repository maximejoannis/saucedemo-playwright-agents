import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { products } from '../test-data/products';
import { sauceDemoUsers } from '../test-data/users';

test.describe('Catalogue', () => {
  // US-02
  // AC-CAT-01
  // TC-CAT-01
  test('TC-CAT-01 @positive @smoke @regression @catalog - affichage du catalogue nominal', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    // 1. Parcourir les six cartes. 2. Contrôler chaque attribut attendu.
    await expect(inventory.products).toHaveCount(6);
    for (const product of products) {
      const card = inventory.productByName(product.name);
      await expect(card).toBeVisible();
      await expect(card.getByTestId('inventory-item-desc')).not.toBeEmpty();
      await expect(card.getByTestId('inventory-item-price')).toHaveText(product.price);
      await expect(inventory.productImage(product.name)).toBeVisible();
      await expect(inventory.productActionButton(product.name)).toHaveText('Add to cart');
    }
  });

  // US-02
  // AC-CAT-02
  // TC-CAT-02
  test('TC-CAT-02 @positive @regression @catalog - consultation d’une fiche et retour', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const card = inventory.productByName('Sauce Labs Backpack');
    const description = await card.getByTestId('inventory-item-desc').innerText();
    const imageSource = await inventory.productImage('Sauce Labs Backpack').getAttribute('src');
    // 1. Ouvrir le produit par son nom. 2. Comparer nom, description, prix et image.
    await inventory.openProductByName('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item\.html\?id=4$/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(page.getByTestId('inventory-item-desc')).toHaveText(description);
    await expect(page.getByTestId('inventory-item-price')).toHaveText('$29.99');
    await expect(page.getByRole('img', { name: 'Sauce Labs Backpack' })).toHaveAttribute('src', imageSource!);
    // 3. Choisir Back to products.
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
  });

  // US-02
  // AC-CAT-03
  // TC-CAT-03
  test('TC-CAT-03 @error @regression @catalog - consultation d’un produit inexistant', async ({
    authenticatedPage: page,
  }) => {
    // 1. Ouvrir directement l’adresse de la fiche inexistante. 2. Observer le contenu.
    await page.goto('/inventory-item.html?id=999');
    await expect(page.getByTestId('inventory-item-name')).toHaveText('ITEM NOT FOUND');
    await expect(page.getByTestId('inventory-item-desc')).toContainText(
      "We're sorry, but your call could not be completed",
    );
    // 3. Choisir Back to products.
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL(/inventory\.html$/);
  });

  // US-02
  // AC-CAT-04
  // TC-CAT-04
  test('TC-CAT-04 @error @regression @catalog - images dégradées de problem_user', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    // 1. Se connecter.
    await login.goto();
    await login.login(sauceDemoUsers.problem.username, sauceDemoUsers.problem.password);
    // 2. Comparer les images des six cartes à leurs noms.
    await expect(inventory.products).toHaveCount(6);
    for (const product of products) {
      await expect(inventory.productByName(product.name)).toContainText(product.price);
      await expect(inventory.productImage(product.name)).toHaveAttribute('src', /sl-404/);
    }
  });
});
