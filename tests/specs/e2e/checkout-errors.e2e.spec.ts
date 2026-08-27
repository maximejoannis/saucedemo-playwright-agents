import { test, expect } from '../../fixtures/test-fixtures';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test.describe('Checkout bloqué par une validation', () => {
  test('E2E-02 @e2e @negative @error @regression - Checkout interrompu par validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login avec `standard_user`.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // 2. Ajouter Backpack.
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 3. Ouvrir le panier.
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);

    // 4. Démarrer Checkout.
    await cartPage.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 5. Laisser First Name vide.
    await checkoutPage.firstNameInput.fill('');

    // 6. Renseigner Last Name et Postal Code.
    await checkoutPage.lastNameInput.fill('Dupont');
    await checkoutPage.postalCodeInput.fill('75001');

    // 7. Cliquer Continue.
    await checkoutPage.continue();

    // 8. Vérifier exactement `Error: First Name is required`.
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');

    // 9. Vérifier que l'utilisateur reste sur `checkout-step-one.html`.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 10. Vérifier que la commande n'a pas été créée.
    await expect(checkoutPage.finishButton).toHaveCount(0);
    await expect(checkoutPage.confirmationMessage).toHaveCount(0);
    await expect(checkoutPage.cartBadge).toHaveText('1');
  });
});
