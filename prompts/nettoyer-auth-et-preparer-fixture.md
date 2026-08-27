# Refactorisation Playwright — authentification et préparation des fixtures

Utilise l'agent `playwright_test_generator`.

Travaille sur le projet SauceDemo existant.

Les tests d'authentification actuels fonctionnent déjà. L'objectif est uniquement d'améliorer leur architecture et de préparer la suite des tests.

Ne modifie pas l'intention fonctionnelle des scénarios `TC-AUTH-01`, `TC-AUTH-02` et `TC-AUTH-03`.

## 1. Inspecter la configuration Playwright

Lis d'abord :

`playwright.config.ts`

Vérifie si `baseURL` est déjà configurée.

La valeur souhaitée est :

```ts
baseURL: 'https://www.saucedemo.com'
```

Si elle existe déjà avec cette valeur, ne la duplique pas.

Si elle n'existe pas, ajoute-la dans `use`.

## 2. Configurer les test ids SauceDemo

SauceDemo utilise principalement l'attribut :

```html
data-test="..."
```

Configure Playwright pour permettre l'utilisation de `getByTestId()` avec cet attribut.

Dans `playwright.config.ts`, configure si nécessaire :

```ts
testIdAttribute: 'data-test'
```

Ne duplique pas cette configuration si elle existe déjà.

## 3. Améliorer LoginPage

Modifier :

`tests/pages/login.page.ts`

### URL

Si `baseURL` est correctement définie dans `playwright.config.ts`, remplacer l'URL absolue :

```ts
await this.page.goto('https://www.saucedemo.com/');
```

par :

```ts
await this.page.goto('/');
```

### Message d'erreur

Le locator actuel basé uniquement sur :

```ts
page.getByRole('heading', { level: 3 })
```

est trop générique.

Utiliser le test id spécifique SauceDemo :

```ts
page.getByTestId('error')
```

Conserver les locators orientés utilisateur existants lorsqu'ils sont adaptés :

```ts
page.getByPlaceholder('Username')
page.getByPlaceholder('Password')
page.getByRole('button', { name: 'Login' })
```

## 4. Nettoyer auth.spec.ts

Modifier :

`tests/auth.spec.ts`

Lorsque des éléments SauceDemo possèdent un `data-test` stable et qu'il n'existe pas de locator utilisateur plus pertinent, utiliser `getByTestId()`.

Par exemple, préférer :

```ts
page.getByTestId('shopping-cart-link')
```

à :

```ts
page.locator('[data-test="shopping-cart-link"]')
```

et :

```ts
page.getByTestId('inventory-item')
```

à :

```ts
page.locator('[data-test="inventory-item"]')
```

Ne remplace pas un bon locator `getByRole`, `getByPlaceholder`, `getByText` ou `getByLabel` par un test id sans raison.

Ordre de préférence :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. locator CSS stable en dernier recours

## 5. Conserver les assertions métier dans les tests

Ne déplace pas les assertions principales des scénarios dans `LoginPage`.

Le Page Object doit principalement encapsuler :

* les éléments ;
* les interactions ;
* les opérations réutilisables.

Les assertions métier doivent rester principalement dans :

`auth.spec.ts`

## 6. Conserver login()

Conserve la méthode :

```ts
login(username: string, password: string)
```

dans `LoginPage`.

Les scénarios d'authentification peuvent continuer à appeler :

* `fillUsername`
* `fillPassword`
* `submit`

séparément afin de conserver la traçabilité avec les étapes du plan.

La méthode `login()` sera utilisée plus tard pour les scénarios où l'authentification constitue uniquement une précondition.

## 7. Préparer une fixture utilisateur authentifié

Créer :

`tests/fixtures/test-fixtures.ts`

Créer une fixture simple destinée aux futurs tests catalogue, panier et checkout.

Elle doit fournir un utilisateur authentifié avec :

* username : `standard_user`
* password : `secret_sauce`

Nom recommandé de la fixture :

```ts
authenticatedPage
```

Elle doit utiliser le `LoginPage` existant plutôt que dupliquer les locators de connexion.

Exemple d'intention :

```ts
import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type SauceDemoFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<SauceDemoFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);

    await use(page);
  },
});

export { expect };
```

Tu peux adapter légèrement cette implémentation si nécessaire pour respecter les API Playwright réellement installées.

Ne modifie pas encore `auth.spec.ts` pour utiliser cette fixture.

Les tests d'authentification doivent continuer à utiliser la fixture native `page`, car ils testent précisément le processus de connexion.

## 8. Ne pas sur-concevoir

Ne crée pas :

* BasePage ;
* service layer ;
* repository ;
* factory ;
* builder ;
* singleton ;
* classe abstraite ;
* dépendance supplémentaire.

Le projet SauceDemo doit rester simple.

## 9. Validation

Après les modifications :

1. exécute `auth.spec.ts` ;
2. vérifie que les trois tests passent ;
3. vérifie qu'aucun `waitForTimeout()` n'a été introduit ;
4. vérifie qu'aucune assertion fonctionnelle n'a été affaiblie ;
5. vérifie que la fixture `authenticatedPage` compile correctement.

Ne génère encore aucun test catalogue, panier ou checkout.

## Résultat attendu

L'architecture doit ressembler à :

```text
tests/
├── fixtures/
│   └── test-fixtures.ts
├── pages/
│   └── login.page.ts
├── auth.spec.ts
└── seed.spec.ts
```

À la fin, indique :

* les fichiers modifiés ;
* les fichiers créés ;
* les améliorations apportées ;
* le résultat de l'exécution de `auth.spec.ts`.
