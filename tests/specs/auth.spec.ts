import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { sauceDemoUsers } from '../test-data/users';

test.describe('Authentification', () => {
  // US-01
  // AC-AUTH-01
  // RISK-AUTH-01
  // Technique: EP, ST
  // TC-AUTH-01
  test('TC-AUTH-01 @positive @smoke @regression @auth @risk-auth-01 - connexion avec un utilisateur standard', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    // 1. Saisir le nom d'utilisateur puis le mot de passe.
    await login.goto();
    await login.fillUsername(sauceDemoUsers.standard.username);
    await login.fillPassword(sauceDemoUsers.standard.password);
    // 2. Choisir Login.
    await login.submit();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
    await expect(login.errorMessage).toBeHidden();
  });

  // US-01
  // AC-AUTH-02
  // RISK-AUTH-02
  // Technique: EP
  // TC-AUTH-02
  test('TC-AUTH-02 @negative @regression @auth @risk-auth-02 - refus d’identifiants inconnus', async ({ page }) => {
    const login = new LoginPage(page);
    // 1. Saisir les deux valeurs. 2. Choisir Login.
    await login.goto();
    await login.login('unknown_user', 'wrong_password');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(login.errorMessage).toHaveText(/Username and password do not match any user in this service/);
  });

  // US-01
  // AC-AUTH-03
  // RISK-AUTH-02
  // Technique: EP
  // TC-AUTH-03
  test('TC-AUTH-03 @error @regression @auth @risk-auth-02 - nom d’utilisateur absent', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // 1. Laisser le nom vide. 2. Choisir Login.
    await login.submit();
    await expect(login.errorMessage).toHaveText('Epic sadface: Username is required');
    // 3. Refaire avec seulement le mot de passe renseigné.
    await login.fillPassword('secret_sauce');
    await login.submit();
    await expect(login.errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // US-01
  // AC-AUTH-04
  // RISK-AUTH-02
  // Technique: EP
  // TC-AUTH-04
  test('TC-AUTH-04 @error @regression @auth @risk-auth-02 - mot de passe absent', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // 1. Saisir le nom. 2. Laisser le mot de passe vide. 3. Choisir Login.
    await login.fillUsername(sauceDemoUsers.standard.username);
    await login.submit();
    await expect(login.errorMessage).toHaveText('Epic sadface: Password is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // US-01
  // AC-AUTH-05
  // RISK-AUTH-02
  // Technique: EP
  // TC-AUTH-05
  test('TC-AUTH-05 @error @regression @auth @risk-auth-02 - refus du compte verrouillé', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    // 1. Saisir les identifiants. 2. Choisir Login.
    await login.login(sauceDemoUsers.lockedOut.username, sauceDemoUsers.lockedOut.password);
    await expect(login.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
