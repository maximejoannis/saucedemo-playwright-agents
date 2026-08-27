# Prompt Generator — SauceDemo

Utilise l'agent `playwright_test_generator`.

Lis le plan de tests :

`specs/plan-tests-fonctionnels-saucedemo.md`

Commence uniquement par les scénarios d'authentification :

* `TC-AUTH-01`
* `TC-AUTH-02`
* `TC-AUTH-03`

Ne génère pas encore les autres scénarios.

## Objectif

Génère des tests Playwright TypeScript fiables, lisibles et maintenables à partir du plan existant.

Respecte strictement les résultats attendus décrits dans le plan.

## Bonnes pratiques Playwright obligatoires

### Locators

Privilégie dans cet ordre :

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`

Évite les sélecteurs CSS structurels fragiles.

Évite `nth()` sauf si aucune alternative robuste n'existe.

Ne sélectionne pas un élément uniquement en fonction de sa position dans le DOM.

### Assertions

Utilise les assertions web-first de Playwright :

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText(...);
await expect(page).toHaveURL(...);
```

Évite les assertions manuelles lorsque Playwright fournit une assertion adaptée.

### Synchronisation

N'utilise pas :

```ts
page.waitForTimeout(...)
```

sauf cas exceptionnel et explicitement justifié.

Utilise :

* l'auto-waiting Playwright ;
* les locators ;
* les assertions web-first ;
* les attentes sur URL ou état visible.

### Tests indépendants

Chaque test doit :

* pouvoir être exécuté seul ;
* ne pas dépendre d'un autre test ;
* commencer avec un état propre ;
* ne pas dépendre de l'ordre d'exécution ;
* être compatible avec une exécution parallèle lorsque cela est raisonnable.

## Page Object Model

Utilise un Page Object Model simple pour les pages ou comportements réellement réutilisés.

Pour les scénarios d'authentification, crée au minimum :

`tests/pages/login.page.ts`

Le Page Object doit encapsuler :

* les locators de la page Login ;
* la saisie du nom d'utilisateur ;
* la saisie du mot de passe ;
* l'action Login ;
* la lecture ou vérification du message d'erreur lorsque pertinent.

Exemple de responsabilité :

```ts
class LoginPage {
  readonly page: Page;

  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly errorMessage;

  constructor(page: Page) {
    ...
  }

  async goto() {
    ...
  }

  async login(username: string, password: string) {
    ...
  }
}
```

Ne place pas les assertions métier principales dans le Page Object sauf si cela améliore clairement la réutilisabilité.

Les assertions du scénario doivent rester autant que possible dans les fichiers `.spec.ts`.

## Fixtures

N'introduis une fixture personnalisée que si elle apporte une vraie réutilisation.

Pour ces trois scénarios d'authentification, ne crée pas de fixture complexe inutile.

La fixture native :

```ts
async ({ page }) => {}
```

est suffisante si aucune logique transversale supplémentaire n'est nécessaire.

Lorsque les scénarios catalogue, panier et checkout seront générés ultérieurement, une fixture d'utilisateur authentifié pourra être créée si cela réduit réellement la duplication.

## Organisation souhaitée

Pour cette première génération :

```text
tests/
├── pages/
│   └── login.page.ts
└── auth.spec.ts
```

Ne modifie pas inutilement les fichiers sans rapport avec ces scénarios.

## Données de test

Utilise les données documentées dans le plan :

Compte nominal :

* username : `standard_user`
* password : `secret_sauce`

Compte verrouillé :

* username : `locked_out_user`
* password : `secret_sauce`

Identifiants invalides :

* username : `bad_user`
* password : `wrong`

Ne remplace pas ces données sans raison.

## Nommage des tests

Conserve la traçabilité avec les identifiants du plan.

Exemple :

```ts
test('TC-AUTH-01 - Connexion réussie avec standard_user', async ({ page }) => {
  ...
});
```

Les noms des tests et les commentaires peuvent être en français.

Le code Playwright reste en anglais.

## Vérification avant génération

Avant d'écrire définitivement chaque test :

1. reproduis le scénario avec les outils Playwright ;
2. vérifie les locators sur l'application réelle ;
3. vérifie les messages réellement affichés ;
4. vérifie les URLs réellement obtenues ;
5. génère ensuite le code.

Ne suppose pas le comportement de SauceDemo.

## Vérification après génération

Après avoir créé les fichiers :

1. exécute uniquement `auth.spec.ts` ;
2. vérifie que les trois tests passent ;
3. si un test échoue, diagnostique d'abord la cause ;
4. corrige uniquement le code de test si le test est réellement incorrect ;
5. ne modifie jamais une assertion simplement pour obtenir PASS.

## Résultat attendu

À la fin, je veux :

* `tests/pages/login.page.ts`
* `tests/auth.spec.ts`
* trois scénarios correspondant exactement à `TC-AUTH-01`, `TC-AUTH-02` et `TC-AUTH-03`
* tous les tests exécutés et validés
* aucun scénario panier, catalogue ou checkout généré pour le moment.
