# Generator — Checkout SauceDemo

Utilise l'agent `playwright_test_generator`.

Lis le plan :

`specs/plan-tests-fonctionnels-saucedemo.md`

Génère uniquement les scénarios checkout actuellement définis dans le plan.

Ne génère pas encore le scénario de logout/session.

## Architecture existante

Réutilise l'architecture déjà en place :

* `LoginPage`
* `InventoryPage`
* `CartPage`
* fixture `authenticatedPage`
* `baseURL`
* `getByTestId()` configuré avec `data-test`

Ne duplique pas la logique existante.

## Page Object Model

Crée :

`tests/pages/checkout.page.ts`

La classe `CheckoutPage` doit encapsuler uniquement les éléments et interactions propres au checkout.

Elle peut notamment exposer :

* champ First Name ;
* champ Last Name ;
* champ Zip/Postal Code ;
* bouton Continue ;
* bouton Cancel ;
* bouton Finish ;
* message d'erreur ;
* titre de la page ;
* ligne(s) produit(s) du récapitulatif ;
* sous-total ;
* taxe ;
* total ;
* informations de paiement ;
* informations de livraison ;
* message de confirmation ;
* bouton Back Home.

Elle peut fournir des méthodes comme :

* `fillCustomerInformation(...)`
* `continue()`
* `cancel()`
* `finish()`
* récupération des montants si cela améliore la lisibilité.

Ne place pas les assertions métier principales dans le Page Object.

## Préparation des scénarios

Pour atteindre le checkout :

1. utiliser `authenticatedPage` ;
2. ajouter `Sauce Labs Backpack` via `InventoryPage` ;
3. ouvrir le panier ;
4. utiliser `CartPage.checkout()`.

Ne crée pas encore de fixture personnalisée du type `checkoutPageReady`.

La précondition doit rester visible dans les tests.

## Locators

Respecte l'ordre de préférence :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. CSS stable uniquement en dernier recours

Évite les sélecteurs structurels fragiles.

Évite `nth()` pour identifier une donnée métier.

## Scénario d'accès au checkout

Teste l'accès à :

`Checkout: Your Information`

Vérifie :

* First Name ;
* Last Name ;
* Zip/Postal Code ;
* Cancel ;
* Continue ;
* badge du panier toujours à `1`.

## Validations des champs obligatoires

Les validations doivent être générées comme des tests indépendants.

Ne regroupe pas les trois erreurs dans un seul test séquentiel.

### First Name obligatoire

Renseigner :

* Last Name : `Dupont`
* Zip/Postal Code : `75001`

Laisser First Name vide.

Cliquer Continue.

Vérifier exactement :

`Error: First Name is required`

Le test doit rester sur l'étape d'information du checkout.

### Last Name obligatoire

Renseigner :

* First Name : `Jean`
* Zip/Postal Code : `75001`

Laisser Last Name vide.

Cliquer Continue.

Vérifier exactement :

`Error: Last Name is required`

### Postal Code obligatoire

Renseigner :

* First Name : `Jean`
* Last Name : `Dupont`

Laisser Zip/Postal Code vide.

Cliquer Continue.

Vérifier exactement :

`Error: Postal Code is required`

Utilise `toHaveText()` pour ces messages d'erreur si le plan indique qu'ils sont stables et exacts.

## Checkout Overview

Avec :

* First Name : `Jean`
* Last Name : `Dupont`
* Zip/Postal Code : `75001`

continuer vers :

`Checkout: Overview`

Vérifier conformément au plan :

* `Sauce Labs Backpack`
* quantité `1`
* prix `$29.99`
* paiement `SauceCard #31337`
* livraison `Free Pony Express Delivery!`
* Item total `$29.99`
* Tax `$2.40`
* Total `$32.39`
* boutons Cancel et Finish

Utilise des assertions précises.

Ne remplace pas les montants par des vérifications partielles vagues.

## Finalisation de commande

Depuis le récapitulatif valide :

1. cliquer Finish ;
2. vérifier `Checkout: Complete!` ;
3. vérifier exactement `Thank you for your order!` ;
4. vérifier le texte d'expédition selon le plan ;
5. vérifier Back Home ;
6. vérifier l'action `Generate PDF order` si elle fait toujours partie du plan actuel ;
7. cliquer Back Home ;
8. vérifier le retour au catalogue ;
9. vérifier l'absence du badge numérique du panier.

Si le comportement réel observé diffère du plan, ne modifie pas silencieusement l'attendu. Signale l'écart.

## Annulation du checkout

Couvre les scénarios d'annulation définis dans le plan actuel.

Vérifie notamment :

* annulation depuis `Checkout: Your Information` ;
* retour au panier ;
* conservation du Backpack ;
* badge `1` ;
* annulation depuis `Checkout: Overview` ;
* retour au catalogue ;
* conservation du contenu du panier.

Si le plan révisé a séparé ces comportements en plusieurs scénarios, respecte cette séparation.

## Indépendance

Chaque test checkout doit :

* utiliser son propre contexte ;
* utiliser `authenticatedPage` ;
* préparer son Backpack lui-même ;
* ne dépendre d'aucun autre test ;
* fonctionner seul ;
* rester compatible avec l'exécution parallèle.

## Assertions

Utilise les assertions Playwright web-first pour le DOM :

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText(...);
await expect(page).toHaveURL(...);
```

Pour les messages d'erreur exacts et les montants fonctionnels, privilégie `toHaveText()`.

N'utilise `toContainText()` que si le plan autorise explicitement une comparaison partielle.

## Synchronisation

N'utilise pas :

`page.waitForTimeout(...)`

Utilise :

* auto-waiting Playwright ;
* assertions web-first ;
* navigation ;
* visibilité ;
* changement d'état.

## Organisation attendue

L'architecture devrait devenir :

```text
tests/
├── fixtures/
│   └── test-fixtures.ts
├── pages/
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
├── auth.spec.ts
├── inventory.spec.ts
├── sorting.spec.ts
├── cart.spec.ts
└── checkout.spec.ts
```

## Traçabilité

Conserve les identifiants exacts présents dans le plan révisé.

Ne suppose pas que les anciens numéros `TC-CHK-03`, `TC-CHK-04`, etc. sont encore valides après séparation des validations.

Lis le fichier de plan et utilise les identifiants actuellement présents.

Ajoute également :

```ts
// spec: specs/plan-tests-fonctionnels-saucedemo.md
```

## Validation

Avant de terminer :

1. explore les comportements nécessaires avec Playwright ;
2. génère uniquement les tests checkout ;
3. exécute `checkout.spec.ts` sur Chromium ;
4. vérifie que tous les scénarios passent ;
5. vérifie qu'aucun `waitForTimeout()` n'a été ajouté ;
6. vérifie que les validations First Name, Last Name et Postal Code sont des tests indépendants ;
7. vérifie que le login n'est pas dupliqué ;
8. vérifie que les Page Objects ne contiennent pas les assertions métier principales.

Exécute :

`npx playwright test tests/checkout.spec.ts --project=chromium`

Si un test échoue, ne lance pas automatiquement le Healer.

Diagnostique d'abord la cause et précise s'il s'agit :

* du test ;
* du locator ;
* des données attendues ;
* de la synchronisation ;
* ou du comportement réel de SauceDemo.

## Résultat final

À la fin, indique :

* fichiers créés ;
* fichiers modifiés ;
* responsabilités de `CheckoutPage` ;
* identifiants des scénarios générés ;
* résultat des tests ;
* éventuels écarts entre le plan et l'application observée.
