# Ajouter les User Stories, critères d'acceptation et la traçabilité QA

## Agent

Utilise `playwright_test_planner`.

## Contexte

Le projet automatise SauceDemo à partir d'un plan fonctionnel existant contenant 29 scénarios automatisés répartis sur 6 domaines :

- Authentification
- Catalogue
- Tri
- Panier
- Checkout
- Session

Le projet possède déjà :

- le plan fonctionnel ;
- les identifiants `TC-*` ;
- les tests Playwright correspondants ;
- les tags Positive / Negative / Error / Smoke / Regression ;
- les tests E2E.

L'objectif n'est PAS de refaire les tests.

---

# 1. Objectif

Ajouter une couche de traçabilité :

```text
User Story
    ↓
Acceptance Criteria
    ↓
Test Cases TC-*
    ↓
Tests Playwright automatisés
```

Cette couche servira ensuite au calcul de couverture des exigences.

---

# 2. Important — SauceDemo

SauceDemo est une application publique de démonstration.

Nous ne disposons pas du backlog produit officiel ni des véritables User Stories et critères d'acceptation ayant servi à son développement.

Les User Stories et critères créés ici doivent donc être explicitement présentés comme :

> Exigences fonctionnelles reconstituées à des fins de démonstration QA à partir du comportement observable de SauceDemo et du plan de tests existant.

Ne jamais présenter ces éléments comme les exigences officielles de SauceDemo.

---

# 3. Source de vérité

Avant toute modification, analyser :

```text
tests/specs/plan-tests-fonctionnels-saucedemo.md
tests/specs/*.spec.ts
tests/specs/e2e/
```

Les 29 scénarios fonctionnels existants constituent la base.

Ne crée pas artificiellement de nouvelles exigences uniquement pour augmenter les métriques.

Chaque critère d'acceptation doit être justifié par un ou plusieurs scénarios existants.

---

# 4. Architecture

Créer :

```text
tests/specs/requirements/
├── user-stories.md
└── traceability-matrix.md
```

Ne déplacer aucun fichier existant.

---

# 5. User Stories

Créer des User Stories structurées par domaine fonctionnel.

Utiliser les identifiants :

```text
US-AUTH-01
US-CAT-01
US-SORT-01
US-CART-01
US-CHK-01
US-SESSION-01
```

Plusieurs User Stories par domaine sont autorisées uniquement si le plan fonctionnel le justifie réellement.

Ne cherche pas à obtenir artificiellement exactement une User Story par fonctionnalité.

---

# 6. Format des User Stories

Utiliser :

```text
En tant que ...
Je souhaite ...
Afin de ...
```

Exemple :

```md
## US-AUTH-01 — Authentification utilisateur

**En tant que** utilisateur de SauceDemo  
**Je souhaite** pouvoir m'authentifier avec mes identifiants  
**Afin de** pouvoir accéder au catalogue lorsque mon compte est autorisé.
```

---

# 7. Critères d'acceptation

Chaque User Story doit posséder des critères d'acceptation identifiés.

Convention :

```text
AC-AUTH-01
AC-AUTH-02
AC-AUTH-03

AC-CAT-01
AC-CAT-02

AC-SORT-01
...
```

Chaque ID doit être unique dans tout le projet.

---

# 8. Formulation des critères

Les critères doivent être :

- observables ;
- testables ;
- non ambigus ;
- liés au comportement fonctionnel ;
- indépendants de l'implémentation Playwright.

Ne pas écrire :

```text
Le locator doit trouver l'élément.
```

Écrire :

```text
Après une authentification valide, l'utilisateur autorisé accède au catalogue.
```

---

# 9. Critères positifs, négatifs et erreurs

Les critères d'acceptation doivent permettre de représenter :

```text
comportement nominal
comportement non nominal
validation / erreur
```

Mais ne crée pas obligatoirement trois critères artificiels pour chaque User Story.

La structure doit refléter le comportement réellement couvert par le plan.

---

# 10. Cas SauceDemo atypiques

Certains tests existants caractérisent volontairement des comportements dégradés de :

```text
problem_user
error_user
locked_out_user
```

Ne transforme pas une anomalie observée en comportement métier souhaité.

Distinguer clairement :

```text
Critère d'acceptation attendu
```

et :

```text
Comportement observé / test de caractérisation
```

Lorsqu'un TC caractérise une anomalie SauceDemo, documenter cette distinction dans la traçabilité.

---

# 11. Relation AC → TC

Chaque critère d'acceptation doit être associé à au moins un cas de test existant.

Exemple :

```text
AC-AUTH-01 → TC-AUTH-01
AC-AUTH-02 → TC-AUTH-02
AC-AUTH-03 → TC-AUTH-03
```

Un critère peut être couvert par plusieurs TC.

Un TC peut contribuer à plusieurs critères uniquement si cela est réellement justifié.

---

# 12. Ne pas renommer les TC

Conserver exactement tous les identifiants existants :

```text
TC-AUTH-*
TC-CAT-*
TC-TRI-*
TC-PAN-*
TC-CHK-*
TC-SESSION-*
```

Le reporting actuel dépend de ces identifiants.

---

# 13. user-stories.md

Le fichier doit commencer par une section :

```md
# Référentiel des exigences fonctionnelles reconstituées — SauceDemo

> Ces User Stories et critères d'acceptation ne constituent pas le backlog officiel de SauceDemo.
> Ils ont été reconstitués à des fins de démonstration QA à partir du comportement observable de l'application et du plan de tests du projet.
```

Pour chaque domaine, présenter :

```text
User Story
Description
Acceptance Criteria
TC associés
```

Exemple de structure :

```md
## Authentification

### US-AUTH-01 — Authentification utilisateur

**En tant que** ...
**Je souhaite** ...
**Afin de** ...

#### Critères d'acceptation

| ID | Critère | Tests associés |
|---|---|---|
| AC-AUTH-01 | ... | TC-AUTH-01 |
| AC-AUTH-02 | ... | TC-AUTH-02 |
```

---

# 14. Traceability Matrix

Créer :

```text
tests/specs/requirements/traceability-matrix.md
```

Cette matrice doit représenter la chaîne complète :

```text
Requirement
→ Acceptance Criterion
→ Test Case
→ Automated Test
```

Colonnes minimales :

```text
User Story
Acceptance Criterion
Test Case
Type
Priorité
Automatisé
Fichier Playwright
```

Ajouter lorsque pertinent :

```text
Nature
```

avec par exemple :

```text
Requirement validation
Characterization
```

---

# 15. Exemple de RTM

Exemple uniquement :

```md
| User Story | Acceptance Criterion | Test Case | Type | Priorité | Nature | Automatisé | Fichier |
|---|---|---|---|---|---|---|---|
| US-AUTH-01 | AC-AUTH-01 | TC-AUTH-01 | Passant | P0 | Requirement validation | ✅ | auth.spec.ts |
```

Les données finales doivent provenir du projet réel.

---

# 16. Couverture des User Stories

À la fin de `traceability-matrix.md`, calculer :

```text
Nombre total de User Stories
User Stories couvertes par ≥ 1 AC
User Stories couvertes par ≥ 1 TC automatisé
```

Ne pas annoncer automatiquement 100 %.

Calculer à partir des données créées.

---

# 17. Couverture des critères d'acceptation

Calculer :

```text
Nombre total d'Acceptance Criteria
Acceptance Criteria associés à ≥ 1 TC
Acceptance Criteria associés à ≥ 1 test automatisé
```

Définir :

```text
Requirements Coverage =
Acceptance Criteria couverts par au moins un test automatisé
/
Acceptance Criteria totaux
× 100
```

Afficher le résultat réel.

---

# 18. Traçabilité des 29 scénarios

Vérifier également l'autre sens :

```text
TC → AC
```

Chaque scénario fonctionnel parmi les 29 doit être présent dans la RTM.

Si un TC ne peut raisonnablement être relié à aucun critère d'acceptation parce qu'il caractérise une anomalie, ne crée pas un faux critère.

Dans ce cas :

- documenter explicitement le TC comme `Characterization` ;
- le rattacher à la User Story concernée ;
- expliquer qu'il ne valide pas un critère d'acceptation souhaité.

Le total doit rester transparent.

---

# 19. Tests E2E

Les tests sous :

```text
tests/specs/e2e/
```

ne doivent pas être transformés en nouveaux critères d'acceptation.

Ils constituent une couche de validation transverse.

Ajouter éventuellement une section séparée :

```text
E2E Traceability
```

indiquant quelles User Stories sont traversées par chaque parcours E2E.

Ne pas les compter une seconde fois dans les 29 TC fonctionnels.

---

# 20. Ne pas modifier les tests

Ne modifie pas :

```text
tests/specs/*.spec.ts
tests/specs/e2e/*.spec.ts
tests/pages/
tests/fixtures/
playwright.config.ts
```

Cette étape est documentaire.

---

# 21. Ne pas modifier le reporting

Ne modifie pas encore :

```text
reporting/
.github/workflows/
```

L'intégration de la Requirements Coverage sera réalisée dans une étape suivante.

---

# 22. Contrôle de cohérence

Avant de terminer, vérifier :

- tous les IDs `US-*` sont uniques ;
- tous les IDs `AC-*` sont uniques ;
- les 29 IDs `TC-*` existants sont préservés ;
- chaque TC de validation est rattaché à un AC ;
- les tests de caractérisation sont explicitement identifiés ;
- aucun TC inexistant n'est inventé ;
- aucun test Playwright n'est modifié.

---

# 23. Validation

Exécuter :

```text
npm test
```

Même si l'étape est documentaire, vérifier qu'aucune régression n'a été introduite.

---

# 24. Résultat final

À la fin, fournir :

## User Stories

```text
Total :
Couvertes :
```

## Acceptance Criteria

```text
Total :
Couverts par TC :
Couverts par automatisation :
Requirements Coverage :
```

## Test Cases

```text
TC fonctionnels analysés : 29
TC rattachés à des AC :
TC de caractérisation :
TC sans traçabilité :
```

## E2E

Indiquer les parcours E2E reliés aux User Stories sans les compter dans les 29 scénarios fonctionnels.

## Fichiers créés

```text
tests/specs/requirements/user-stories.md
tests/specs/requirements/traceability-matrix.md
```

## Tests

Donner le résultat de :

```text
npm test
```