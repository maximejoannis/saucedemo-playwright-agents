# Enrichissement du plan de tests SauceDemo

## Agent

Utilise l'agent :

`playwright_test_planner`

## Source de vérité

Lis et mets à jour :

`tests/specs/plan-tests-fonctionnels-saucedemo.md`

N'écris encore aucun nouveau fichier `.spec.ts`.

## Objectif

Pour chaque fonctionnalité testée dans SauceDemo, le plan doit désormais contenir trois catégories de scénarios :

1. cas passant ;
2. cas non passant ;
3. cas d'erreur.

Les fonctionnalités concernées sont :

- authentification ;
- catalogue ;
- tri ;
- panier ;
- checkout ;
- session / logout.

## Définitions

### Cas passant

Un cas passant valide le fonctionnement nominal avec des données et actions valides.

Exemples :

- connexion valide ;
- ajout au panier ;
- tri valide ;
- checkout complet.

Tag :

`@positive`

### Cas non passant

Un cas non passant utilise une action, une donnée ou une situation qui ne doit pas aboutir au résultat nominal.

Le comportement attendu peut être :

- action refusée ;
- navigation empêchée ;
- donnée rejetée ;
- opération non réalisée.

Tag :

`@negative`

### Cas d'erreur

Un cas d'erreur vérifie explicitement un mécanisme d'erreur observable :

- message d'erreur ;
- validation obligatoire ;
- accès interdit ;
- comportement dégradé ;
- erreur métier visible.

Tag :

`@error`

Un même scénario peut recevoir plusieurs tags lorsqu'ils sont pertinents, mais il doit rester clair quel comportement principal il valide.

## Règle fondamentale

N'invente jamais un comportement d'erreur pour satisfaire artificiellement cette matrice.

Explore réellement SauceDemo avec Playwright.

Pour chaque fonctionnalité :

1. identifier un cas nominal observable ;
2. rechercher un comportement non passant réaliste ;
3. rechercher un comportement d'erreur réaliste ;
4. observer le résultat réel ;
5. seulement ensuite rédiger le scénario.

Les utilisateurs spéciaux de SauceDemo peuvent être utilisés lorsque cela est pertinent :

- `locked_out_user`
- `problem_user`
- `performance_glitch_user`
- `error_user`
- `visual_user`

Mais ne suppose pas leur comportement avant exploration.

## Matrice de couverture obligatoire

Ajoute au début ou à la fin du plan une matrice similaire à :

| Fonctionnalité | Passant | Non passant | Erreur |
| --- | --- | --- | --- |
| Authentification | ✅ | ✅ | ✅ |
| Catalogue | ✅ | ✅ | ✅ |
| Tri | ✅ | ✅ | ✅ |
| Panier | ✅ | ✅ | ✅ |
| Checkout | ✅ | ✅ | ✅ |
| Session | ✅ | ✅ | ✅ |

Chaque cellule doit correspondre à au moins un scénario identifiable du plan.

Indique les IDs des scénarios dans la matrice.

## Authentification

Conserver notamment les cas existants :

### Passant

Connexion valide avec :

`standard_user / secret_sauce`

### Non passant

Identifiants incorrects.

### Erreur

Utilisateur verrouillé et/ou validation de champs obligatoires si observée.

Explore également :

- Username vide ;
- Password vide ;
- formulaire entièrement vide.

Ajoute les scénarios pertinents selon le comportement réellement observé.

## Catalogue

Conserver les cas nominaux existants.

Identifier par exploration :

### Passant

Affichage normal du catalogue et accès au détail produit.

### Non passant

Trouver un parcours utilisateur réaliste où l'action attendue n'aboutit pas ou est refusée.

### Erreur

Rechercher un comportement erroné observable, notamment avec les utilisateurs spéciaux SauceDemo ou une navigation invalide.

Ne crée pas un faux scénario purement technique qui n'aurait aucun intérêt utilisateur.

## Tri

### Passant

Conserver les quatre tris valides.

### Non passant

Explorer un comportement non nominal pertinent lié au tri.

### Erreur

Explorer notamment les utilisateurs spéciaux pour voir si le tri ou l'affichage résultant présente une anomalie observable.

Ne manipule pas artificiellement le DOM ou le JavaScript uniquement pour créer une erreur.

Les scénarios doivent représenter un comportement observable du produit.

## Panier

### Passant

Conserver :

- ajout ;
- suppression ;
- conservation du panier.

### Non passant

Explorer notamment :

- action avec panier vide ;
- suppression lorsqu'il ne reste plus d'article ;
- navigation vers checkout sans article si l'interface le permet ;
- autres situations réelles observables.

### Erreur

Explorer les utilisateurs spéciaux et les actions susceptibles de provoquer une erreur ou une incohérence observable.

## Checkout

Conserver les cas existants.

### Passant

Checkout complet.

### Non passant

Checkout qui ne peut pas progresser avec données invalides.

### Erreur

Conserver séparément :

- First Name obligatoire ;
- Last Name obligatoire ;
- Postal Code obligatoire.

Les trois validations doivent rester trois scénarios indépendants.

## Session / Logout

### Passant

Logout normal.

### Non passant

Tentative d'accès à une page protégée après logout.

### Erreur

Vérifier le message d'accès interdit ou un autre comportement d'erreur observable lié à la session.

Si nécessaire, séparer l'ancien scénario Logout en plusieurs scénarios pour respecter l'indépendance et cette classification.

## Structure de chaque scénario

Chaque scénario doit comporter :

- identifiant ;
- titre ;
- type : `Passant`, `Non passant` ou `Erreur` ;
- priorité ;
- tags ;
- état initial ;
- données de test ;
- étapes ;
- résultats attendus ;
- critères de réussite.

Exemple :

```md
### TC-AUTH-XX — Nom du scénario

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@auth` `@regression`

**État initial :**
...

**Données de test :**
...

**Étapes :**
1. ...
2. ...

**Résultats attendus :**
...

**Critères de réussite :**
...