import { test, expect } from '../../fixtures/test-fixtures';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Parcours E2E de validation du checkout', () => {
  // Parcours transversal : Authentification → Catalogue → Panier → Checkout → Validation d’erreur
  test('E2E-02 @e2e @negative @error @regression - blocage fonctionnel pendant le checkout', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Ajouter un produit et vérifier la mise à jour du panier.
    await inventory.addProductByName('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    // Accéder au checkout depuis le panier.
    await inventory.openCart();
    await expect(cart.itemByName('Sauce Labs Backpack')).toBeVisible();
    await cart.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // Renseigner le formulaire sans nom de famille et demander à continuer.
    await checkout.firstNameInput.fill('Jean');
    await checkout.postalCodeInput.fill('75001');
    await expect(checkout.lastNameInput).toHaveValue('');
    await checkout.continue();

    // Vérifier que la validation refuse la poursuite sur la même étape.
    await expect(checkout.errorMessage).toHaveText('Error: Last Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkout.title).toHaveText('Checkout: Your Information');
    await expect(checkout.continueButton).toBeVisible();
    await expect(checkout.items).toHaveCount(0);
  });
});
