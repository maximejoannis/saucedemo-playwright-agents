# Generator — Session et Logout SauceDemo

Utilise l'agent `playwright_test_generator`.

Lis le plan :
`specs/plan-tests-fonctionnels-saucedemo.md`

Génère uniquement les scénarios Session / Logout actuellement présents dans le plan.

Ne modifie pas les scénarios Auth, Catalogue, Tri, Panier ou Checkout existants.

## Architecture existante

Réutilise :
- `LoginPage`
- `InventoryPage`
- `CartPage`
- `CheckoutPage`
- fixture `authenticatedPage`
- `baseURL`
- `getByTestId()` configuré avec `data-test`

Ne duplique pas la logique existante.

## Page Object Model

Analyse d'abord l'application et l'architecture existante.

Pour les éléments globaux de navigation comme le menu latéral et Logout :

- ajoute-les à `InventoryPage` si leur responsabilité reste clairement liée à cette page ;
- ou crée un petit composant/page object réutilisable si cela apporte une vraie valeur.

Ne crée pas une abstraction uniquement pour appliquer artificiellement POM.

Les assertions métier doivent rester dans le fichier spec.

## Logout

Utilise `authenticatedPage`.

Conformément au plan :

1. ouvrir le menu latéral ;
2. cliquer sur Logout ;
3. vérifier le retour à la page de connexion ;
4. vérifier que le formulaire de connexion est visible ;
5. tenter ensuite un accès direct à `/inventory.html` ;
6. vérifier que cet accès est refusé ;
7. vérifier exactement le message attendu défini dans le plan.

La vérification de sécurité de session est importante :
le test ne doit pas seulement vérifier que Logout redirige vers `/`.

Il doit également démontrer qu'une page protégée n'est plus accessible après la déconnexion.

## Locators

Privilégie :

1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByText
5. getByTestId
6. CSS stable en dernier recours

N'utilise pas `nth()` pour identifier une action métier.

## Assertions

Utilise les assertions web-first Playwright.

Pour le message d'accès refusé après logout, utilise une comparaison exacte si le plan le définit comme texte fonctionnel stable.

## Synchronisation

N'utilise jamais :

page.waitForTimeout(...)

Utilise l'auto-waiting et les assertions Playwright.

## Indépendance

Le test doit :
- utiliser son propre contexte ;
- utiliser `authenticatedPage` comme précondition ;
- fonctionner seul ;
- ne dépendre d'aucun autre scénario ;
- être compatible avec l'exécution parallèle.

## Organisation

Crée :

tests/session.spec.ts

Ajoute un nouveau Page Object uniquement si cela apporte réellement une valeur.

## Traçabilité

Conserve exactement l'identifiant du scénario présent dans le plan.

Ajoute :

// spec: specs/plan-tests-fonctionnels-saucedemo.md

## Validation

Après génération :

1. exécute uniquement `session.spec.ts` ;
2. utilise Chromium ;
3. vérifie que le scénario passe ;
4. vérifie l'absence de `waitForTimeout()`;
5. vérifie qu'aucune logique de login n'est dupliquée.

Exécute :

npx playwright test tests/session.spec.ts --project=chromium

Ne lance pas automatiquement le Healer en cas d'échec.

Diagnostique d'abord la cause.

## Résultat final

Indique :
- fichiers créés ;
- fichiers modifiés ;
- éventuelle évolution des Page Objects ;
- résultat du test ;
- éventuels écarts entre le plan et SauceDemo.