# Generator — Panier SauceDemo

Utilise l'agent `playwright_test_generator`.

Lis le plan :

`specs/plan-tests-fonctionnels-saucedemo.md`

Génère uniquement les scénarios panier définis dans le plan :

* `TC-PAN-01`
* `TC-PAN-02`
* `TC-PAN-03`

Ne génère pas encore les scénarios checkout ou session.

## Architecture existante

Réutilise impérativement l'architecture existante :

* `LoginPage`
* `InventoryPage`
* fixture `authenticatedPage`
* `baseURL`
* `getByTestId()` configuré avec `data-test`

Ne duplique pas la logique déjà disponible.

## Page Object Model

Conserve `InventoryPage` pour les opérations appartenant au catalogue.

Ajoute uniquement les méthodes nécessaires au panier depuis le catalogue, par exemple :

* ajouter un produit par son nom ;
* supprimer un produit par son nom lorsque l'action est disponible depuis le catalogue ;
* ouvrir le panier ;
* accéder au badge du panier si nécessaire.

Crée :

`tests/pages/cart.page.ts`

La classe `CartPage` doit encapsuler les éléments et interactions propres au panier, notamment :

* lignes du panier ;
* noms des produits ;
* prix ;
* quantités ;
* badge du panier si pertinent ;
* suppression d'un produit par son nom ;
* action Continue Shopping ;
* action Checkout.

Ne place pas les assertions métier principales dans les Page Objects.

## Identification des produits

Ne sélectionne jamais un produit avec `nth()` ou sa position dans le DOM.

Identifie les produits par leur nom fonctionnel.

Pour retrouver une ligne correspondant à un produit, utilise une approche robuste basée sur la ligne du panier et son nom.

## Locators

Respecte l'ordre de préférence :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. CSS stable uniquement en dernier recours

L'utilisation de `getByTestId()` est appropriée pour les attributs `data-test` stables de SauceDemo.

Évite les sélecteurs structurels fragiles.

## Fixture

Utilise :

`authenticatedPage`

pour tous ces scénarios.

Ne crée pas une nouvelle fixture du type `cartWithProducts` pour seulement trois tests.

Prépare le panier explicitement dans chaque scénario avec les méthodes du Page Object afin que les préconditions restent lisibles.

Nous créerons une fixture supplémentaire uniquement si une vraie duplication importante apparaît plus tard.

## TC-PAN-01 — Ajout de produits et compteur

Conformément au plan :

1. ajouter `Sauce Labs Backpack` ;
2. vérifier que son bouton devient `Remove` ;
3. vérifier que le badge vaut `1` ;
4. ajouter `Sauce Labs Bike Light` ;
5. vérifier que le badge vaut `2` ;
6. ouvrir le panier.

Dans le panier, vérifier :

* exactement deux produits ;
* Backpack présent ;
* Bike Light présent ;
* quantité `1` pour chacun ;
* Backpack à `$29.99` ;
* Bike Light à `$9.99`.

Utilise des assertions web-first.

## TC-PAN-02 — Suppression et compteur

Précondition :

* utilisateur authentifié ;
* Backpack ajouté ;
* Bike Light ajouté.

Puis :

1. ouvrir le panier ;
2. supprimer Bike Light ;
3. vérifier que Bike Light disparaît ;
4. vérifier que Backpack reste ;
5. vérifier que le badge vaut `1` ;
6. supprimer Backpack ;
7. vérifier qu'aucune ligne produit ne reste ;
8. vérifier que le badge numérique n'est plus affiché.

Ne vérifie pas uniquement le compteur : vérifie également le contenu réel du panier.

## TC-PAN-03 — Conservation du panier

1. ajouter Backpack depuis le catalogue ;
2. ouvrir le panier ;
3. vérifier sa présence ;
4. cliquer sur `Continue Shopping` ;
5. vérifier le retour sur `/inventory.html` ;
6. vérifier que le bouton du Backpack est toujours `Remove` ;
7. vérifier que le badge vaut toujours `1` ;
8. rouvrir le panier ;
9. vérifier que Backpack est toujours présent.

Ce test doit démontrer la conservation de l'état du panier pendant la navigation.

## Assertions sur le badge

Lorsque le panier est vide, SauceDemo peut conserver l'icône/lien du panier tout en supprimant uniquement le badge numérique.

Ne confonds donc pas :

* le lien/icone du panier ;
* le badge numérique contenant la quantité.

Lorsque le plan dit que le badge n'est plus affiché, vérifie spécifiquement l'absence du badge numérique.

## Synchronisation

Interdiction de :

`page.waitForTimeout(...)`

Utilise :

* auto-waiting Playwright ;
* assertions web-first ;
* changements de texte ;
* visibilité/absence ;
* navigation.

## Indépendance

Les trois tests doivent :

* être exécutables individuellement ;
* démarrer avec un contexte propre ;
* utiliser `authenticatedPage` ;
* préparer eux-mêmes leurs produits ;
* ne dépendre d'aucun autre test ;
* fonctionner en parallèle.

## Organisation attendue

L'architecture devrait devenir :

```text
tests/
├── fixtures/
│   └── test-fixtures.ts
├── pages/
│   ├── login.page.ts
│   ├── inventory.page.ts
│   └── cart.page.ts
├── auth.spec.ts
├── inventory.spec.ts
├── sorting.spec.ts
└── cart.spec.ts
```

## Traçabilité

Conserve les identifiants du plan :

```ts
test('TC-PAN-01 - ...', ...)
test('TC-PAN-02 - ...', ...)
test('TC-PAN-03 - ...', ...)
```

et la référence :

```ts
// spec: specs/plan-tests-fonctionnels-saucedemo.md
```

## Validation

Avant de terminer :

1. explore/reproduis les comportements nécessaires avec Playwright ;
2. génère les tests ;
3. exécute uniquement `cart.spec.ts` sur Chromium ;
4. vérifie que les trois tests passent ;
5. vérifie l'absence de `waitForTimeout()` ;
6. vérifie l'absence de `nth()` utilisé pour identifier un produit ;
7. vérifie qu'aucune logique de login n'est dupliquée ;
8. vérifie que les Page Objects ne contiennent pas les assertions métier.

Exécute :

`npx playwright test tests/cart.spec.ts --project=chromium`

Si un test échoue, ne lance pas automatiquement le Healer.

Diagnostique d'abord la cause et précise s'il s'agit :

* du test ;
* d'un locator ;
* des données attendues ;
* de la synchronisation ;
* ou d'un comportement réel de SauceDemo.

## Résultat final

Indique :

* fichiers créés ;
* fichiers modifiés ;
* méthodes ajoutées à `InventoryPage` ;
* responsabilités de `CartPage` ;
* résultat des trois tests ;
* éventuels problèmes rencontrés.
