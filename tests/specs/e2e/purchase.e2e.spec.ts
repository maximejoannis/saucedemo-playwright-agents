import { test, expect } from '../../fixtures/test-fixtures';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { InventoryPage } from '../../pages/inventory.page';

const product = { name: 'Sauce Labs Backpack', price: '$29.99' };
const customer = { firstName: 'Jean', lastName: 'Dupont', postalCode: '75001' };

test.describe('Parcours E2E d’achat', () => {
  // Parcours transversal : Authentification → Catalogue → Panier → Checkout
  // RISK-AUTH-01, RISK-CAT-01, RISK-CART-01, RISK-CHK-01, RISK-CHK-02
  test('E2E-01 @e2e @positive @smoke @regression @risk-auth-01 @risk-cat-01 @risk-cart-01 @risk-chk-01 @risk-chk-02 - parcours d’achat complet', async ({
    authenticatedPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Vérifier la connexion et sélectionner un produit depuis le catalogue.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.productByName(product.name)).toBeVisible();
    await expect(inventory.productByName(product.name).getByTestId('inventory-item-price')).toHaveText(product.price);
    await inventory.addProductByName(product.name);
    await expect(inventory.cartBadge).toHaveText('1');
    await expect(inventory.productActionButton(product.name)).toHaveText('Remove');

    // Ouvrir le panier et vérifier le produit sélectionné.
    await inventory.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cart.itemByName(product.name)).toBeVisible();
    await expect(cart.productPrice(product.name)).toHaveText(product.price);
    await expect(cart.productQuantity(product.name)).toHaveText('1');

    // Accéder au checkout et renseigner les informations client.
    await cart.checkout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await checkout.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.continue();

    // Vérifier la cohérence du produit et des montants dans l’overview.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkout.itemByName(product.name)).toBeVisible();
    await expect(checkout.itemPrice(product.name)).toHaveText(product.price);
    await expect(checkout.subtotal).toHaveText('Item total: $29.99');
    await expect(checkout.tax).toHaveText('Tax: $2.40');
    await expect(checkout.total).toHaveText('Total: $32.39');

    // Finaliser la commande et vérifier la confirmation.
    await checkout.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkout.title).toHaveText('Checkout: Complete!');
    await expect(checkout.confirmationMessage).toHaveText('Thank you for your order!');
    await expect(checkout.shippingMessage).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );

    // Revenir au catalogue.
    await checkout.backHome();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.products).toHaveCount(6);
    await expect(inventory.cartBadge).toBeHidden();
  });
});
