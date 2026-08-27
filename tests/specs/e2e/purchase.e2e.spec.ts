import { test, expect } from '../../fixtures/test-fixtures';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

const productName = 'Sauce Labs Backpack';

test.describe('Achat complet', () => {
  test('E2E-01 @e2e @positive @smoke @regression - Achat complet de bout en bout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Ouvrir SauceDemo.
    await loginPage.goto();

    // 2. Se connecter avec `standard_user / secret_sauce`.
    await loginPage.login('standard_user', 'secret_sauce');

    // 3. Vérifier l'accès au catalogue.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');

    // 4. Ajouter `Sauce Labs Backpack`.
    await inventoryPage.addProductByName(productName);

    // 5. Vérifier le badge `1`.
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 6. Ouvrir le panier.
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);

    // 7. Vérifier le produit et le prix `$29.99`.
    await expect(cartPage.itemByName(productName)).toBeVisible();
    await expect(cartPage.productPrice(productName)).toHaveText('$29.99');

    // 8. Démarrer Checkout.
    await cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 9. Renseigner First Name `Jean`, Last Name `Dupont` et Postal Code `75001`.
    await checkoutPage.fillCustomerInformation('Jean', 'Dupont', '75001');

    // 10. Continuer vers l'overview.
    await checkoutPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    // 11. Vérifier le produit, la quantité, le prix, le sous-total, la taxe et le total.
    const overviewItem = checkoutPage.itemByName(productName);
    await expect(overviewItem.getByTestId('inventory-item-name')).toHaveText(productName);
    await expect(overviewItem.getByTestId('item-quantity')).toHaveText('1');
    await expect(overviewItem.getByTestId('inventory-item-price')).toHaveText('$29.99');
    await expect(checkoutPage.subtotal).toHaveText('Item total: $29.99');
    await expect(checkoutPage.tax).toHaveText('Tax: $2.40');
    await expect(checkoutPage.total).toHaveText('Total: $32.39');

    // 12. Cliquer Finish.
    await checkoutPage.finish();

    // 13. Vérifier la confirmation.
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');

    // 14. Cliquer Back Home.
    await checkoutPage.backHome();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // 15. Vérifier que le panier est vide.
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    // 16. Effectuer Logout.
    await inventoryPage.openMenu();
    await inventoryPage.logout();

    // 17. Vérifier le retour à la page Login.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
