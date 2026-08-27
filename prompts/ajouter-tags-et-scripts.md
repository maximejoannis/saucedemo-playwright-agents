# Exploitation de la suite Playwright — Tags, scripts npm et diagnostic

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Contexte

Le projet SauceDemo possède déjà une suite Playwright fonctionnelle et entièrement passante sur Chromium.

Le projet utilise notamment :

- Page Object Model ;
- fixtures Playwright ;
- `authenticatedPage` ;
- locators orientés utilisateur ;
- `getByTestId()` configuré avec `data-test` ;
- assertions web-first ;
- Chromium comme navigateur principal.

Tous les tests passent actuellement.

L'objectif de cette tâche n'est pas de modifier leur comportement fonctionnel mais d'améliorer l'exploitation quotidienne de la suite.

---

## 1. Lire le plan de tests

Lis :

`specs/plan-tests-fonctionnels-saucedemo.md`

Utilise les priorités et tags définis dans ce plan comme source de vérité.

Ne modifie pas le plan.

---

## 2. Ajouter les tags aux tests

Ajoute aux noms des tests les tags correspondant au plan.

Tags possibles :

- `@smoke`
- `@regression`
- `@negative`
- `@auth`
- `@catalog`
- `@sorting`
- `@cart`
- `@checkout`
- `@session`

Exemple :

```ts
test(
  'TC-AUTH-01 @smoke @regression @auth - Authentification réussie avec standard_user',
  async ({ page }) => {
    // ...
  }
);