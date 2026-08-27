# Generator — Catalogue et tri SauceDemo

Utilise l'agent `playwright_test_generator`.

Lis le plan :

`specs/plan-tests-fonctionnels-saucedemo.md`

Génère uniquement les scénarios :

* `TC-CAT-01`
* `TC-CAT-02`
* `TC-TRI-01`
* `TC-TRI-02`

Ne génère pas encore les scénarios panier, checkout ou session.

## Architecture existante

Le projet possède déjà :

* `tests/pages/login.page.ts`
* `tests/fixtures/test-fixtures.ts`
* la fixture `authenticatedPage`
* `tests/auth.spec.ts`
* une `baseURL`
* `testIdAttribute: 'data-test'`

Réutilise cette architecture.

Ne duplique pas la logique d'authentification.

## Page Object Model

Crée :

`tests/pages/inventory.page.ts`

La classe `InventoryPage` doit encapsuler les éléments et interactions réutilisables du catalogue.

Elle peut notamment exposer :

* titre du catalogue ;
* sélecteur de tri ;
* liste des produits ;
* noms des produits ;
* descriptions ;
* prix ;
* images ;
* boutons Add to cart / Remove ;
* accès à un produit par son nom.

Elle doit également fournir des méthodes utiles comme :

* récupérer les noms des produits ;
* récupérer les prix ;
* sélectionner un ordre de tri ;
* ouvrir un produit par son nom.

Ne crée pas un Page Object gigantesque.

N'intègre pas les assertions métier principales dans `InventoryPage`.

## Fiche produit

Pour `TC-CAT-02`, crée un `ProductPage` séparé uniquement si la fiche produit possède suffisamment de comportements propres pour justifier cette abstraction.

Sinon, utilise des locators Playwright simples dans le scénario.

Ne crée pas un Page Object uniquement pour respecter artificiellement le pattern POM.

## Fixture authenticatedPage

Pour ces tests, l'authentification constitue une précondition.

Utilise donc la fixture :

`authenticatedPage`

depuis :

`tests/fixtures/test-fixtures.ts`

Ne reproduis pas manuellement le login dans chaque test.

## Locators

Respecte cet ordre de préférence :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. locator CSS stable uniquement en dernier recours

Pour les collections de produits, l'utilisation de `getByTestId()` est appropriée lorsque SauceDemo fournit un `data-test` stable.

Évite :

* les chemins CSS structurels ;
* `nth()` pour identifier un produit métier ;
* les locators dépendant de la position dans le DOM.

## TC-CAT-01 — Catalogue

Vérifie conformément au plan :

* titre `Products` ;
* tri par défaut ;
* exactement six produits ;
* noms attendus ;
* prix attendus ;
* présence des descriptions ;
* présence des images ;
* présence d'une action Add to cart pour chaque produit.

Ne vérifie pas uniquement le nombre de produits.

Les données doivent correspondre au plan de tests.

## TC-CAT-02 — Détail produit

Utilise :

`Sauce Labs Backpack`

Vérifie notamment :

* navigation vers le détail ;
* nom ;
* description ;
* prix `$29.99` ;
* action Add to cart ;
* retour au catalogue avec `Back to products`.

Utilise des locators orientés utilisateur lorsque possible.

## TC-TRI-01 — Tri alphabétique

Ne valide pas le tri uniquement avec des positions codées en dur.

Après sélection de :

`Name (Z to A)`

récupère réellement les noms affichés.

Construis l'ordre attendu dans le test et compare les tableaux.

Exemple de principe :

```ts
const actualNames = await inventoryPage.getProductNames();

const expectedNames = [...actualNames].sort((a, b) =>
  b.localeCompare(a)
);

expect(actualNames).toEqual(expectedNames);
```

Pour `Name (A to Z)`, applique la logique inverse.

La vérification doit prouver que la liste est réellement triée.

## TC-TRI-02 — Tri des prix

Après sélection de :

`Price (low to high)`

récupère les prix réellement affichés.

Convertis les valeurs telles que :

```text
$29.99
```

en nombres.

Exemple :

```ts
const numericPrices = prices.map(price =>
  Number(price.replace('$', ''))
);
```

Construis ensuite l'ordre attendu avec une copie du tableau :

```ts
const expected = [...numericPrices].sort((a, b) => a - b);
```

puis compare :

```ts
expect(numericPrices).toEqual(expected);
```

Fais l'équivalent pour le tri décroissant.

Ne vérifie pas uniquement le premier et le dernier prix.

## Assertions

Privilégie les assertions Playwright web-first pour le DOM :

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText(...);
await expect(locator).toHaveCount(...);
await expect(page).toHaveURL(...);
```

Pour comparer des tableaux récupérés depuis la page, une assertion standard :

```ts
expect(actual).toEqual(expected);
```

est appropriée.

Respecte la stratégie de comparaison des textes définie dans le plan.

## Synchronisation

N'utilise pas :

```ts
page.waitForTimeout(...)
```

Utilise l'auto-waiting Playwright et les assertions adaptées.

## Indépendance

Chaque scénario doit :

* utiliser son propre contexte ;
* être indépendant ;
* utiliser `authenticatedPage` comme précondition ;
* ne dépendre d'aucun autre scénario ;
* pouvoir être exécuté seul ;
* rester compatible avec une exécution parallèle.

## Organisation attendue

À la fin, vise :

```text
tests/
├── fixtures/
│   └── test-fixtures.ts
├── pages/
│   ├── login.page.ts
│   └── inventory.page.ts
├── auth.spec.ts
├── inventory.spec.ts
└── sorting.spec.ts
```

Un `product.page.ts` peut être ajouté uniquement s'il apporte une vraie valeur.

## Traçabilité

Conserve les identifiants du plan dans les noms des tests :

```ts
test('TC-CAT-01 - ...', ...)
test('TC-CAT-02 - ...', ...)
test('TC-TRI-01 - ...', ...)
test('TC-TRI-02 - ...', ...)
```

Conserve également une référence :

```ts
// spec: specs/plan-tests-fonctionnels-saucedemo.md
```

## Validation

Avant de considérer le travail terminé :

1. vérifie les comportements avec Playwright ;
2. génère les tests ;
3. exécute uniquement les nouveaux tests sur Chromium ;
4. vérifie que les quatre scénarios passent ;
5. vérifie qu'aucun `waitForTimeout()` n'a été introduit ;
6. vérifie que le login n'est pas dupliqué ;
7. vérifie que les tests restent indépendants.

Exécute :

`npx playwright test tests/inventory.spec.ts tests/sorting.spec.ts --project=chromium`

Ne lance pas le Healer automatiquement si un test échoue.

Diagnostique d'abord la cause et indique clairement s'il s'agit :

* du test généré ;
* du locator ;
* des données attendues ;
* ou du comportement de SauceDemo.

## Résultat final

À la fin, indique :

* fichiers créés ;
* fichiers modifiés ;
* Page Objects utilisés ;
* utilisation de la fixture `authenticatedPage` ;
* résultat des quatre tests ;
* éventuels problèmes rencontrés.
