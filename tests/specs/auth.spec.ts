import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md

test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto();
  });

  test('TC-AUTH-01 @positive @smoke @regression @auth - Connexion de l’utilisateur standard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Saisir `standard_user` dans le champ Username.
    await loginPage.fillUsername('standard_user');

    // 2. Saisir `secret_sauce` dans le champ Password.
    await loginPage.fillPassword('secret_sauce');

    // 3. Cliquer sur Login.
    await loginPage.submit();

    // 4. Vérifier la page affichée.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.errorMessage).toHaveCount(0);
    await expect(page.getByText('Swag Labs', { exact: true })).toBeVisible();
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
    await expect(page.getByTestId('shopping-cart-link')).toBeVisible();
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('TC-AUTH-02 @regression @negative @auth - Refus d’identifiants incorrects', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Saisir `bad_user` dans Username.
    await loginPage.fillUsername('bad_user');

    // 2. Saisir `wrong` dans Password.
    await loginPage.fillPassword('wrong');

    // 3. Cliquer sur Login.
    await loginPage.submit();

    // Résultats attendus : rester sur la connexion, afficher l’erreur et refuser le catalogue.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(page.getByText('Products', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
  });

  test('TC-AUTH-03 @error @negative @regression @auth - Message d’erreur pour l’utilisateur verrouillé', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // 1. Saisir `locked_out_user` dans Username.
    await loginPage.fillUsername('locked_out_user');

    // 2. Saisir `secret_sauce` dans Password.
    await loginPage.fillPassword('secret_sauce');

    // 3. Cliquer sur Login.
    await loginPage.submit();

    // Résultats attendus : rester sur la connexion, afficher l’erreur et refuser le catalogue.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(page.getByText('Products', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
  });

  test('TC-AUTH-04 @error @negative @auth - Username obligatoire', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Ne renseigner que Password puis cliquer sur Login.
    await loginPage.fillPassword('secret_sauce');
    await loginPage.submit();

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
  });

  test('TC-AUTH-05 @error @negative @auth - Password obligatoire', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Ne renseigner que Username puis cliquer sur Login.
    await loginPage.fillUsername('standard_user');
    await loginPage.submit();

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
  });

  test('TC-AUTH-06 @error @negative @auth - Soumission du formulaire entièrement vide', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Cliquer sur Login sans saisir de donnée.
    await loginPage.submit();

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
  });
});
