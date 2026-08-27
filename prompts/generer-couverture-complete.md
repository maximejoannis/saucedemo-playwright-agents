# Generator — Compléter la couverture fonctionnelle SauceDemo

## Agent à utiliser

Utilise l'agent :

`playwright_test_generator`

---

## 1. Objectif

Complète la suite automatisée Playwright SauceDemo à partir du plan de tests enrichi.

La suite doit couvrir, pour chaque fonctionnalité lorsque le plan le prévoit :

- les cas passants ;
- les cas non passants ;
- les cas d'erreur.

Ne réinvente pas les scénarios.

Le fichier suivant constitue la source de vérité :

`tests/specs/plan-tests-fonctionnels-saucedemo.md`

Les comportements observés et documentés par le Planner doivent être respectés.

---

## 2. Lire le plan avant toute modification

Lis intégralement :

`tests/specs/plan-tests-fonctionnels-saucedemo.md`

Identifie :

- tous les scénarios du plan ;
- leurs identifiants ;
- leur type ;
- leur priorité ;
- leurs tags ;
- leurs données ;
- leurs résultats attendus.

Identifie ensuite les scénarios déjà automatisés et ceux qui manquent.

Ne génère pas un doublon d'un test existant.

---

## 3. Matrice de couverture

Le plan contient une matrice :

- Passant ;
- Non passant ;
- Erreur.

Utilise cette matrice comme référence.

Les fonctionnalités concernées sont :

- Authentification ;
- Catalogue ;
- Tri ;
- Panier ;
- Checkout ;
- Session / Logout.

Chaque scénario automatisé doit rester traçable vers son identifiant dans le plan.

---

## 4. Structure du projet

Respecte la nouvelle organisation :

```text
tests/
├── specs/
│   ├── plan-tests-fonctionnels-saucedemo.md
│   ├── auth.spec.ts
│   ├── inventory.spec.ts
│   ├── sorting.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── session.spec.ts
│
├── pages/
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
│
└── fixtures/
    └── test-fixtures.ts
```

Tous les fichiers de tests fonctionnels `.spec.ts` doivent rester dans :

`tests/specs/`

Les Page Objects doivent rester dans :

`tests/pages/`

Les fixtures doivent rester dans :

`tests/fixtures/`

---

## 5. Références au plan

Dans chaque fichier `.spec.ts`, utilise :

```ts
// spec: tests/specs/plan-tests-fonctionnels-saucedemo.md
```

Ne réintroduis pas l'ancien chemin :

`specs/plan-tests-fonctionnels-saucedemo.md`

---

## 6. Ne pas casser les tests existants

Les tests existants qui passent doivent être conservés.

Ne les réécris pas inutilement.

Tu peux les modifier uniquement si cela est nécessaire pour :

- ajouter ou corriger un tag conformément au plan ;
- adapter un import après réorganisation ;
- respecter un changement explicitement défini dans le plan ;
- factoriser une duplication devenue réellement importante.

Ne change jamais une assertion métier simplement pour obtenir un PASS.

---

## 7. Page Object Model

Réutilise les Page Objects existants :

- `LoginPage`
- `InventoryPage`
- `CartPage`
- `CheckoutPage`

Avant de créer un nouveau Page Object, vérifie qu'il apporte une réelle valeur.

Ne crée pas de :

- `BasePage` générique ;
- classe abstraite inutile ;
- service layer ;
- repository ;
- factory ;
- builder ;
- singleton.

L'architecture doit rester simple.

---

## 8. Responsabilités des Page Objects

Les Page Objects doivent principalement contenir :

- locators ;
- interactions ;
- opérations réutilisables.

Les assertions métier doivent rester principalement dans les fichiers `.spec.ts`.

Exemple :

```ts
await inventoryPage.addProductByName('Sauce Labs Backpack');

await expect(inventoryPage.cartBadge).toHaveText('1');
```

Le Page Object effectue l'action.

Le test vérifie le résultat métier.

---

## 9. Fixtures

Réutilise :

`authenticatedPage`

lorsque l'authentification constitue uniquement une précondition.

Les tests qui vérifient directement le processus de connexion doivent continuer à utiliser la fixture native `page`.

Ne crée une nouvelle fixture que si :

- plusieurs tests utilisent exactement la même précondition complexe ;
- la duplication est significative ;
- la fixture améliore réellement la lisibilité.

Ne crée pas une fixture uniquement pour quelques lignes de préparation.

---

## 10. Locators

Respecte cet ordre de préférence :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. locator CSS stable uniquement en dernier recours

Le projet utilise :

```ts
testIdAttribute: 'data-test'
```

Les attributs `data-test` de SauceDemo peuvent donc être utilisés avec :

```ts
page.getByTestId(...)
```

---

## 11. Locators interdits ou déconseillés

Évite :

- les sélecteurs CSS structurels fragiles ;
- XPath sauf nécessité démontrée ;
- `nth()` pour identifier une donnée métier ;
- les sélecteurs dépendant de la position dans le DOM ;
- les textes partiels ambigus.

Un produit doit être identifié par son nom fonctionnel et non par sa position dans la liste.

---

## 12. Assertions

Utilise les assertions web-first Playwright lorsque la vérification concerne le DOM :

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText(...);
await expect(locator).toHaveCount(...);
await expect(locator).toHaveValue(...);
await expect(page).toHaveURL(...);
```

Pour des données récupérées sous forme de tableaux ou valeurs JavaScript :

```ts
expect(actual).toEqual(expected);
```

est approprié.

---

## 13. Comparaison des textes

Respecte la stratégie définie dans le plan.

Utilise une comparaison exacte pour :

- messages d'erreur stables ;
- prix ;
- montants ;
- quantités ;
- noms produits ;
- titres fonctionnels lorsque leur valeur exacte est vérifiée.

Privilégie alors :

```ts
await expect(locator).toHaveText('valeur exacte');
```

N'utilise pas `toContainText()` uniquement pour rendre un test plus permissif.

---

## 14. Cas passants

Les scénarios de type :

`Passant`

doivent recevoir :

`@positive`

ainsi que les autres tags prévus dans le plan.

Ils doivent vérifier le fonctionnement nominal complet.

Ne limite pas un cas passant à la vérification qu'une page est simplement visible lorsque le plan exige davantage.

---

## 15. Cas non passants

Les scénarios de type :

`Non passant`

doivent recevoir :

`@negative`

ainsi que les tags fonctionnels correspondants.

Ils doivent vérifier qu'une opération non nominale :

- est refusée ;
- n'aboutit pas ;
- ne modifie pas incorrectement l'état ;
- ou produit le comportement prévu dans le plan.

Ne transforme pas automatiquement tout cas négatif en cas d'erreur.

Respecte la classification du Planner.

---

## 16. Cas d'erreur

Les scénarios de type :

`Erreur`

doivent recevoir :

`@error`

ainsi que les tags fonctionnels correspondants.

Ils doivent vérifier explicitement le comportement d'erreur documenté dans le plan :

- message d'erreur ;
- validation ;
- accès interdit ;
- incohérence observable ;
- autre comportement documenté.

Ne crée aucune erreur artificielle en manipulant le DOM, le JavaScript interne ou le réseau uniquement pour obtenir un scénario `@error`.

Automatise uniquement les comportements réels documentés par le Planner.

---

## 17. Authentification

Complète `tests/specs/auth.spec.ts` avec les scénarios manquants du plan.

Conserve les tests existants.

Respecte notamment les scénarios documentés concernant :

- connexion valide ;
- identifiants incorrects ;
- utilisateur verrouillé ;
- champs obligatoires ;
- autres comportements réellement observés par le Planner.

Chaque validation indépendante doit avoir son propre test si le plan la définit séparément.

---

## 18. Catalogue

Complète :

`tests/specs/inventory.spec.ts`

avec les scénarios manquants.

Réutilise :

`InventoryPage`

N'invente pas de comportement d'erreur pour le catalogue.

Si le Planner a documenté un comportement particulier avec un utilisateur spécial SauceDemo, reproduis exactement ce scénario.

---

## 19. Tri

Complète :

`tests/specs/sorting.spec.ts`

avec les scénarios manquants.

Pour les tris valides, continue à vérifier réellement l'ordre de l'ensemble des données.

Ne vérifie pas uniquement :

- le premier élément ;
- le dernier élément.

Pour les scénarios non passants ou d'erreur, reproduis uniquement les comportements documentés dans le plan.

---

## 20. Panier

Complète :

`tests/specs/cart.spec.ts`

Réutilise :

- `InventoryPage`
- `CartPage`
- `authenticatedPage`

Vérifie selon les scénarios :

- contenu réel du panier ;
- quantités ;
- prix ;
- badge ;
- absence du badge lorsque pertinent ;
- conservation de l'état ;
- comportements non nominaux ;
- comportements d'erreur documentés.

Ne vérifie pas uniquement le badge si le scénario concerne également le contenu réel du panier.

---

## 21. Checkout

Complète :

`tests/specs/checkout.spec.ts`

Réutilise :

- `InventoryPage`
- `CartPage`
- `CheckoutPage`
- `authenticatedPage`

Conserve l'indépendance des validations :

- First Name ;
- Last Name ;
- Postal Code.

Ne regroupe pas plusieurs erreurs indépendantes dans un même test si le plan les définit séparément.

Conserve les vérifications précises des montants :

- sous-total ;
- taxe ;
- total.

---

## 22. Session / Logout

Complète :

`tests/specs/session.spec.ts`

Les scénarios doivent respecter la séparation définie par le plan entre :

- logout nominal ;
- accès non autorisé après logout ;
- comportement d'erreur lié à la session.

Si l'ancien test regroupait plusieurs comportements désormais séparés dans le plan, refactorise-le proprement en tests indépendants.

Ne duplique pas inutilement la logique de logout.

---

## 23. Tags

Respecte exactement les tags définis dans le plan.

Les catégories principales sont :

```text
@positive
@negative
@error
```

Les tags fonctionnels sont :

```text
@auth
@catalog
@sorting
@cart
@checkout
@session
```

Conserve également selon le plan :

```text
@smoke
@regression
```

N'ajoute pas arbitrairement un tag absent du scénario dans le plan.

---

## 24. Nommage

Le nom de chaque test doit contenir :

1. l'identifiant du scénario ;
2. ses tags ;
3. son intitulé fonctionnel.

Exemple :

```ts
test(
  'TC-AUTH-01 @positive @smoke @regression @auth - Connexion réussie avec standard_user',
  async ({ page }) => {
    // ...
  }
);
```

La traçabilité avec le plan doit rester immédiatement visible.

---

## 25. Tests indépendants

Chaque test doit :

- pouvoir être exécuté seul ;
- commencer avec son propre état ;
- ne pas dépendre d'un test précédent ;
- ne pas dépendre de l'ordre d'exécution ;
- rester compatible avec l'exécution parallèle.

N'utilise pas un scénario précédent pour préparer le scénario suivant.

---

## 26. Synchronisation

N'utilise jamais :

```ts
page.waitForTimeout(...)
```

Utilise :

- auto-waiting Playwright ;
- locators ;
- assertions web-first ;
- attentes de navigation ;
- attentes sur l'état visible.

---

## 27. Chromium uniquement

Tous les tests doivent être exécutés uniquement sur le projet :

`chromium`

Ne réactive pas Firefox ou WebKit.

---

## 28. Première validation — cas passants

Exécute les tests :

```powershell
npx playwright test --project=chromium --grep @positive
```

Indique :

- nombre exécuté ;
- nombre passé ;
- nombre échoué.

---

## 29. Deuxième validation — cas non passants

Exécute :

```powershell
npx playwright test --project=chromium --grep @negative
```

Indique :

- nombre exécuté ;
- nombre passé ;
- nombre échoué.

---

## 30. Troisième validation — cas d'erreur

Exécute :

```powershell
npx playwright test --project=chromium --grep @error
```

Indique :

- nombre exécuté ;
- nombre passé ;
- nombre échoué.

---

## 31. Smoke

Exécute :

```powershell
npm run test:smoke
```

Tous les scénarios sélectionnés doivent correspondre aux scénarios `@smoke` définis dans le plan.

---

## 32. Régression

Exécute :

```powershell
npm run test:regression
```

Tous les scénarios sélectionnés doivent correspondre aux scénarios `@regression`.

---

## 33. Suite complète

Exécute enfin :

```powershell
npm test
```

La totalité de la suite doit être exécutée sur Chromium.

---

## 34. Gestion des échecs

Si un test échoue :

1. diagnostique la cause ;
2. compare avec le plan ;
3. vérifie le comportement réel de SauceDemo ;
4. détermine s'il s'agit :
   - du test ;
   - du locator ;
   - des données ;
   - de la synchronisation ;
   - d'un comportement réel de l'application.

Ne lance pas automatiquement le Healer pendant cette génération.

Ne corrige pas silencieusement le résultat attendu.

Si SauceDemo se comporte différemment du plan, signale l'écart.

---

## 35. Interdictions

Ne fais pas les actions suivantes :

- supprimer un test pour obtenir une suite verte ;
- utiliser `test.skip()` ;
- utiliser `test.fixme()` pour masquer un problème ;
- laisser `test.only()` ;
- affaiblir une assertion ;
- remplacer une comparaison exacte par une comparaison partielle sans justification ;
- ajouter `waitForTimeout()` ;
- modifier les données attendues sans preuve ;
- créer une dépendance npm supplémentaire sans nécessité ;
- dupliquer le login dans les tests utilisant `authenticatedPage`.

---

## 36. Vérification de la couverture finale

Après génération, construis une matrice à partir des tests réellement présents :

| Fonctionnalité | Passant | Non passant | Erreur |
| --- | --- | --- | --- |
| Authentification | ... | ... | ... |
| Catalogue | ... | ... | ... |
| Tri | ... | ... | ... |
| Panier | ... | ... | ... |
| Checkout | ... | ... | ... |
| Session / Logout | ... | ... | ... |

Dans chaque cellule, indique les identifiants des tests correspondants.

Compare cette matrice à celle du plan.

Signale toute différence.

---

## 37. Vérification de la qualité

Avant de terminer, vérifie également :

- aucun `waitForTimeout()` ;
- aucun `test.only()` ;
- aucun `test.skip()` ajouté ;
- aucune duplication évidente de login ;
- aucun locator fragile introduit sans justification ;
- aucun `nth()` utilisé pour identifier une donnée métier ;
- aucun scénario dupliqué ;
- tous les IDs du plan automatisables présents ;
- imports corrects après la réorganisation ;
- tous les fichiers `.spec.ts` fonctionnels dans `tests/specs/`.

---

## 38. Résultat final

À la fin, fournis un résumé structuré.

### Scénarios

Indique :

- nombre de tests avant modification ;
- nombre de nouveaux tests ;
- nombre total après modification.

### Répartition

Indique le nombre de tests :

- `@positive` ;
- `@negative` ;
- `@error` ;
- `@smoke` ;
- `@regression`.

### Fonctionnalités

Indique la couverture pour :

- Authentification ;
- Catalogue ;
- Tri ;
- Panier ;
- Checkout ;
- Session / Logout.

### Fichiers

Indique :

- fichiers créés ;
- fichiers modifiés ;
- Page Objects modifiés ;
- fixtures modifiées.

### Exécution

Indique les résultats de :

```text
@positive
@negative
@error
@smoke
@regression
suite complète
```

avec pour chacun :

- exécutés ;
- passés ;
- échoués.

### Qualité

Confirme :

- POM conservé ;
- fixtures conservées ;
- locators robustes ;
- assertions web-first ;
- tests indépendants ;
- absence de `waitForTimeout()` ;
- Chromium uniquement.

### Écarts

Liste explicitement tout scénario du plan qui n'a pas pu être automatisé et explique pourquoi.

Ne prétends pas qu'une couverture est complète si un scénario prévu dans le plan n'a pas été implémenté.