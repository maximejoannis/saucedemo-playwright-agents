# Generator — Tests E2E SauceDemo

## Agent à utiliser

Utilise l'agent :

`playwright_test_generator`

## Objectif

Ajouter une couche de tests End-to-End à la suite Playwright SauceDemo existante.

Les tests E2E doivent valider des parcours utilisateur complets traversant plusieurs fonctionnalités.

Ils ne doivent pas remplacer les tests fonctionnels existants.

## Architecture existante

Réutilise impérativement :

- `LoginPage`
- `InventoryPage`
- `CartPage`
- `CheckoutPage`
- fixtures existantes
- `baseURL`
- configuration `getByTestId`
- Chromium

Ne duplique pas les locators déjà encapsulés dans les Page Objects.

## Emplacement

Crée :

```text
tests/specs/e2e/
```

Les tests E2E doivent être placés dans ce dossier.

Structure attendue :

```text
tests/specs/e2e/
├── purchase.e2e.spec.ts
├── checkout-errors.e2e.spec.ts
└── session.e2e.spec.ts
```

## Tags

Tous les tests E2E doivent contenir :

`@e2e`

Ajoute également les tags pertinents existants :

- `@positive`
- `@negative`
- `@error`
- `@smoke`
- `@regression`

Ne remplace pas les tags fonctionnels existants.

## E2E-01 — Achat complet nominal

Créer un scénario complet couvrant :

1. ouvrir SauceDemo ;
2. se connecter avec `standard_user / secret_sauce` ;
3. vérifier l'accès au catalogue ;
4. ajouter `Sauce Labs Backpack` ;
5. vérifier le badge `1` ;
6. ouvrir le panier ;
7. vérifier le produit et le prix `$29.99` ;
8. démarrer Checkout ;
9. renseigner :
   - First Name : `Jean`
   - Last Name : `Dupont`
   - Postal Code : `75001`
10. continuer vers l'overview ;
11. vérifier :
    - produit ;
    - quantité ;
    - prix ;
    - sous-total ;
    - taxe ;
    - total ;
12. cliquer Finish ;
13. vérifier la confirmation ;
14. cliquer Back Home ;
15. vérifier que le panier est vide ;
16. effectuer Logout ;
17. vérifier le retour à la page Login.

Nom recommandé :

```ts
E2E-01 @e2e @positive @smoke @regression - Achat complet de bout en bout
```

## E2E-02 — Checkout bloqué par une validation

Créer un parcours complet :

1. login avec `standard_user` ;
2. ajouter Backpack ;
3. panier ;
4. Checkout ;
5. laisser First Name vide ;
6. renseigner Last Name et Postal Code ;
7. cliquer Continue ;
8. vérifier exactement :

`Error: First Name is required`

9. vérifier que l'utilisateur reste sur `checkout-step-one.html` ;
10. vérifier que la commande n'a pas été créée.

Nom recommandé :

```ts
E2E-02 @e2e @negative @error @regression - Checkout interrompu par validation
```

Ce test doit démontrer qu'un workflow complet est correctement interrompu par une erreur métier.

## E2E-03 — Session complète et protection après logout

Créer un parcours :

1. login ;
2. naviguer sur le catalogue ;
3. ajouter un produit ;
4. effectuer Logout ;
5. vérifier la page Login ;
6. tenter un accès direct à `/inventory.html` ;
7. vérifier que l'accès est refusé ;
8. vérifier le message d'accès interdit exact.

Nom recommandé :

```ts
E2E-03 @e2e @negative @error @regression - Session fermée et accès protégé refusé
```

## Test independence

Chaque test E2E doit :

- utiliser son propre contexte navigateur ;
- démarrer depuis un état propre ;
- ne dépendre d'aucun autre test ;
- fonctionner seul ;
- être compatible avec l'exécution parallèle.

## Fixtures

Pour `E2E-01`, n'utilise pas `authenticatedPage` au début du parcours si le but est de tester le login dans le workflow E2E.

Le test doit explicitement passer par Login.

Même règle pour les scénarios E2E qui doivent couvrir l'authentification.

Utilise les fixtures uniquement lorsqu'elles ne masquent pas une étape métier que le scénario E2E doit valider.

## Page Object Model

Réutilise les POM existants.

Un test E2E doit orchestrer plusieurs Page Objects.

Exemple conceptuel :

```ts
const loginPage = new LoginPage(page);
const inventoryPage = new InventoryPage(page);
const cartPage = new CartPage(page);
const checkoutPage = new CheckoutPage(page);
```

Ne place pas tout le workflow E2E dans une seule méthode comme :

```ts
completePurchase()
```

Le test doit rester lisible et montrer les principales étapes métier.

## Assertions

Utilise des assertions web-first :

```ts
await expect(page).toHaveURL(...);
await expect(locator).toBeVisible();
await expect(locator).toHaveText(...);
```

Vérifie des résultats métier à chaque étape importante.

Ne crée pas un E2E composé uniquement de clics.

## Synchronisation

N'utilise jamais :

```ts
page.waitForTimeout(...)
```

Utilise l'auto-waiting Playwright et les assertions adaptées.

## Locators

Continue à respecter :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. CSS stable en dernier recours

Pas de `nth()` pour identifier une donnée métier.

## Scripts npm

Ajoute dans `package.json` :

```json
{
  "test:e2e": "playwright test tests/specs/e2e --project=chromium",
  "test:e2e:smoke": "playwright test tests/specs/e2e --project=chromium --grep \"@smoke\""
}
```

Conserve tous les scripts existants.

## Validation

Exécute :

```powershell
npm run test:e2e
```

Puis :

```powershell
npm run test:e2e:smoke
```

Puis :

```powershell
npm test
```

Tous les tests doivent passer.

## ESLint et Prettier

Si ESLint et Prettier sont déjà installés, exécute également :

```powershell
npm run lint
npm run format:check
```

Les nouveaux fichiers E2E doivent respecter les mêmes règles de qualité.

## Contraintes

Ne :

- supprime aucun test existant ;
- ne modifie pas les assertions métier existantes ;
- ne duplique pas les locators des POM ;
- n'ajoute pas `waitForTimeout`;
- n'utilise pas `test.skip`;
- n'utilise pas `test.only`;
- ne réactive pas Firefox ou WebKit.

## Résultat attendu

À la fin, indique :

### Tests E2E créés

Liste les scénarios créés.

### Fichiers

Liste les fichiers créés/modifiés.

### Tags

Indique les tests :

- `@e2e`
- `@positive`
- `@negative`
- `@error`
- `@smoke`

### Validation

Indique le résultat de :

```text
npm run test:e2e
npm run test:e2e:smoke
npm run lint
npm run format:check
npm test
```

### Qualité

Confirme :

- POM réutilisé ;
- aucun locator dupliqué inutilement ;
- tests indépendants ;
- assertions métier présentes tout au long des workflows ;
- aucun `waitForTimeout`;
- Chromium uniquement.