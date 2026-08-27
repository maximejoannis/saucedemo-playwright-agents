# Prompt Planner — Amélioration du plan SauceDemo

Utilise l'agent `playwright_test_planner`.

Relis le plan existant :

`specs/plan-tests-fonctionnels-saucedemo.md`

Ne génère aucun test Playwright.

Améliore le plan existant en appliquant les règles suivantes.

## 1. Ajouter priorité et tags à chaque scénario

Pour chaque scénario, ajoute :

**Priorité :**

* `P0` — parcours critique bloquant
* `P1` — fonctionnalité importante
* `P2` — fonctionnalité secondaire

**Tags :**
Utilise uniquement les tags pertinents parmi :

* `@smoke`
* `@regression`
* `@negative`
* `@auth`
* `@catalog`
* `@sorting`
* `@cart`
* `@checkout`
* `@session`

Un scénario peut avoir plusieurs tags.

Exemple :

```md
### TC-AUTH-01 — Authentification réussie avec l’utilisateur standard

**Priorité :** P0  
**Tags :** `@smoke` `@regression` `@auth`
```

Le tag `@smoke` doit être réservé aux parcours essentiels permettant de déterminer rapidement si l'application est globalement utilisable.

Les scénarios négatifs doivent recevoir `@negative` lorsqu'il s'agit réellement d'un contrôle d'erreur ou de validation.

## 2. Séparer TC-CHK-02

Le scénario actuel :

`TC-CHK-02 — Validation des champs obligatoires du checkout`

teste plusieurs validations dans le même parcours.

Remplace-le par trois scénarios indépendants :

### TC-CHK-02 — Prénom obligatoire

Vérifier le comportement lorsque First Name est vide alors que les autres données nécessaires sont renseignées.

### TC-CHK-03 — Nom obligatoire

Vérifier le comportement lorsque Last Name est vide alors que les autres données nécessaires sont renseignées.

### TC-CHK-04 — Code postal obligatoire

Vérifier le comportement lorsque Zip/Postal Code est vide alors que les autres données nécessaires sont renseignées.

Chaque scénario doit démarrer depuis son propre état initial et ne doit pas dépendre du scénario précédent.

Renumérote ensuite les scénarios checkout suivants afin de conserver des identifiants uniques et cohérents.

## 3. Définir la stratégie de comparaison des textes

Ajoute au plan une section :

`## Stratégie d'assertion des textes`

Applique les règles suivantes.

### Comparaison stricte

Utiliser une comparaison exacte pour les textes qui constituent une valeur fonctionnelle précise et stable, notamment :

* messages d'erreur de validation ;
* messages d'authentification ;
* noms des produits lorsqu'ils constituent la donnée vérifiée ;
* prix ;
* montants ;
* compteur du panier ;
* titres fonctionnels importants lorsque le scénario vérifie explicitement leur valeur.

Dans les futurs tests Playwright, cela devra généralement conduire à :

```ts
await expect(locator).toHaveText('texte attendu');
```

### Comparaison partielle

Utiliser une comparaison partielle uniquement lorsque le scénario cherche volontairement la présence d'une information dans un texte plus large ou susceptible de contenir du contenu complémentaire.

Dans les futurs tests Playwright, cela pourra conduire à :

```ts
await expect(locator).toContainText('fragment attendu');
```

Ne pas utiliser `toContainText` simplement pour rendre une assertion plus permissive.

## 4. Préserver les observations existantes

Ne modifie pas les résultats fonctionnels déjà observés pendant l'exploration sauf si une nouvelle vérification de l'application démontre qu'ils sont incorrects.

Conserve notamment :

* comptes de test ;
* produits ;
* prix ;
* messages observés ;
* montants du checkout ;
* comportements de navigation.

## 5. Indépendance des scénarios

Tous les scénarios doivent pouvoir être automatisés indépendamment.

Évite qu'un scénario contienne plusieurs cas de validation différents lorsqu'ils peuvent échouer indépendamment.

Chaque test négatif doit idéalement valider une seule règle métier principale.

## 6. Résultat attendu

Mets à jour :

`specs/plan-tests-fonctionnels-saucedemo.md`

Ne crée aucun fichier `.spec.ts`.

À la fin, résume uniquement :

* le nombre total de scénarios avant/après ;
* les scénarios ajoutés ou séparés ;
* les priorités/tags ajoutés ;
* la stratégie d'assertion ajoutée.
