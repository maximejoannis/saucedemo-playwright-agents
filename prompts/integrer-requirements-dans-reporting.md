# Intégrer les Requirements et la traçabilité dans le reporting QA

## Agent

Utilise l'agent `playwright_test_generator`.

## Objectif

Faire évoluer le reporting existant afin d'intégrer :

- User Stories ;
- Acceptance Criteria ;
- Requirements Coverage ;
- tests de validation d'exigences ;
- tests de caractérisation ;
- Requirements Traceability Matrix.

Ne modifie pas les tests Playwright.

---

# 1. Sources de vérité

Lire :

```text
tests/specs/requirements/user-stories.md
tests/specs/requirements/traceability-matrix.md
tests/specs/plan-tests-fonctionnels-saucedemo.md
tests/specs/**/*.spec.ts
```

Les nouvelles métriques doivent être calculées depuis ces fichiers.

Ne pas coder les valeurs suivantes en dur :

```text
6
23
24
5
29
32
100 %
```

Elles correspondent à l'état actuel mais doivent rester dynamiques.

---

# 2. Architecture existante

Conserver :

```text
reporting/
├── coverage/
├── qa-portal/
└── scripts/
```

Rapports générés :

```text
coverage-report/
quality-report/
allure-report/
playwright-report/
```

---

# 3. Générateur Coverage

Faire évoluer :

```text
reporting/scripts/generate-coverage-report.js
```

Le script doit désormais calculer également :

```text
User Stories totales
User Stories couvertes
Acceptance Criteria totaux
Acceptance Criteria couverts
Requirements Coverage
TC de validation
TC de caractérisation
TC sans traçabilité
```

---

# 4. Requirements Coverage

Calcul :

```text
Acceptance Criteria couverts par au moins un test automatisé
────────────────────────────────────────────────────────── × 100
Acceptance Criteria totaux
```

La valeur actuelle attendue est :

```text
23 / 23 = 100 %
```

Mais elle doit être calculée.

---

# 5. User Story Coverage

Calcul :

```text
User Stories disposant d'au moins un AC couvert
─────────────────────────────────────────────── × 100
User Stories totales
```

Valeur actuelle attendue :

```text
6 / 6 = 100 %
```

Calcul dynamique obligatoire.

---

# 6. Classification des TC

Le rapport doit distinguer :

```text
Requirement validation
Characterization
```

À l'état actuel :

```text
24 Requirement validation
5 Characterization
```

Ne code pas ces valeurs en dur.

Utilise la RTM comme source.

---

# 7. Tests sans traçabilité

Calculer :

```text
TC fonctionnels présents
-
TC présents dans la RTM
```

Afficher clairement le résultat.

La cible actuelle est :

```text
0
```

Si un futur TC n'est relié à aucune exigence ou marqué Characterization, le rapport doit le signaler.

---

# 8. E2E

Conserver le calcul E2E existant.

Les 3 E2E restent une couche transverse.

Ne pas les intégrer dans :

```text
29 scénarios fonctionnels
23 Acceptance Criteria
```

---

# 9. coverage-report/data.json

Faire évoluer les données générées avec une structure similaire :

```json
{
  "requirements": {
    "userStories": {
      "covered": 6,
      "total": 6,
      "rate": 100
    },
    "acceptanceCriteria": {
      "covered": 23,
      "total": 23,
      "rate": 100
    },
    "traceability": {
      "requirementValidation": 24,
      "characterization": 5,
      "untraced": 0
    }
  }
}
```

Les valeurs doivent être calculées.

Conserver les données existantes :

```text
functionalCoverage
tags
e2e
```

---

# 10. Rapport Coverage — nouveaux KPI

Ajouter dans le rapport Coverage des KPI pour :

```text
User Stories
Acceptance Criteria
Requirements Coverage
Scénarios fonctionnels
Matrice
E2E
```

---

# 11. Hero

Le score principal peut rester :

```text
Functional Scenario Coverage
```

basé sur :

```text
scénarios automatisés / scénarios planifiés
```

Mais ajouter clairement un second indicateur :

```text
Requirements Coverage
```

---

# 12. Requirements Traceability Matrix

Ajouter une section :

```text
04 / REQUIREMENTS TRACEABILITY
```

Afficher une table issue de la RTM.

Colonnes recommandées :

```text
User Story
Acceptance Criterion
Test Case
Type
Priority
Nature
Automated
```

Ajouter filtres :

```text
User Story
Nature
Type
Automated / Untraced
```

---

# 13. Nature Characterization

Les tests de caractérisation doivent être visuellement distingués.

Exemple de badge :

```text
CHARACTERIZATION
```

Ils ne doivent pas être présentés comme validation d'un comportement attendu.

Ajouter une explication :

> Un test de caractérisation documente un comportement réellement observé de SauceDemo sans nécessairement représenter le comportement fonctionnel souhaité.

---

# 14. Section méthodologie

Ajouter les définitions :

## Functional Coverage

```text
TC automatisés / TC planifiés
```

## Requirements Coverage

```text
Acceptance Criteria couverts / Acceptance Criteria totaux
```

## User Story Coverage

```text
User Stories couvertes / User Stories totales
```

## Traceability

```text
US → AC → TC → Automated Test
```

---

# 15. Formulation du rapport

Lorsque la couverture actuelle vaut 100 %, générer dynamiquement une phrase similaire à :

> Les 6 User Stories reconstituées sont couvertes par l'automatisation. Les 23 critères d'acceptation disposent tous d'au moins un test automatisé, soit une Requirements Coverage de 100 %. Les 29 scénarios fonctionnels sont tous tracés : 24 valident directement des exigences et 5 caractérisent des comportements observés.

Construire cette phrase dynamiquement.

---

# 16. Portail QA

Faire évoluer :

```text
reporting/qa-portal/
```

Le portail doit afficher dans sa synthèse :

```text
Functional Coverage
Requirements Coverage
User Stories
Acceptance Criteria
Matrix
E2E
Quality
```

---

# 17. Carte Coverage

La carte Coverage doit afficher par exemple :

```text
100 %
29 / 29 scénarios
23 / 23 critères d'acceptation
```

sans valeurs codées en dur.

---

# 18. Section Requirements dans le portail

Ajouter une petite section ou un bloc synthétique :

```text
REQUIREMENTS TRACEABILITY
```

avec :

```text
User Stories          x / x
Acceptance Criteria   x / x
Requirement Tests     x
Characterization      x
Untraced               x
```

---

# 19. build-info.json

Faire évoluer le workflow uniquement si nécessaire pour intégrer les données Requirements du :

```text
coverage-report/data.json
```

Le `build-info.json` pourra exposer :

```json
{
  "requirements": {
    "userStories": {},
    "acceptanceCriteria": {},
    "traceability": {}
  }
}
```

Ne recalculer aucune donnée métier dans le YAML si le générateur Coverage la fournit déjà.

---

# 20. Workflow

Si `.github/workflows/playwright.yml` lit déjà :

```text
coverage-report/data.json
```

étendre uniquement la copie des données dans `build-info.json`.

Ne changer ni les jobs ni la philosophie :

```text
validate
deploy
quality-gate
```

---

# 21. Tests d'intégrité du reporting

Ajouter des contrôles dans le générateur.

Signaler une erreur si :

- un AC référence un TC inexistant ;
- un TC de validation n'est relié à aucun AC ;
- un ID US est dupliqué ;
- un ID AC est dupliqué ;
- un TC est dupliqué dans les données fonctionnelles ;
- la RTM contient un fichier Playwright inexistant.

Les tests Characterization sont autorisés à ne pas valider directement un AC, mais doivent rester rattachés à une User Story et être explicitement identifiés.

---

# 22. Ne pas modifier

Ne modifie pas :

```text
tests/specs/*.spec.ts
tests/specs/e2e/
tests/pages/
tests/fixtures/
.codex/agents/
```

Ne modifie pas le contenu fonctionnel des Requirements sauf découverte d'une incohérence réelle.

---

# 23. Validation Coverage

Exécuter :

```powershell
npm run coverage:report
```

Le terminal doit afficher au minimum :

```text
User Stories: x/x
Acceptance Criteria: x/x
Requirements Coverage: x%
Requirement validation tests: x
Characterization tests: x
Untraced tests: x
```

---

# 24. Validation actuelle attendue

Avec l'état actuel du projet, les données calculées devraient aboutir à :

```text
User Stories              6 / 6
Acceptance Criteria      23 / 23
Requirements Coverage   100 %
Requirement Validation    24
Characterization           5
Untraced                    0

Functional Scenarios     29 / 29
Functional Matrix        18 / 18
E2E                        3
```

Ces nombres servent uniquement de contrôle de cohérence.

Ils ne doivent pas être codés dans les templates HTML ou JS.

---

# 25. Validation qualité

Exécuter :

```powershell
npm run lint
npm run format:check
```

---

# 26. Validation tests

Exécuter :

```powershell
npm test
```

Le résultat attendu actuellement est :

```text
32 tests
```

mais ne modifie aucun test pour obtenir ce nombre.

---

# 27. Validation JavaScript

Exécuter :

```powershell
node --check reporting/coverage/app.js
node --check reporting/qa-portal/app.js
```

---

# 28. Résultat final

À la fin fournir :

## Requirements

```text
User Stories :
Acceptance Criteria :
Requirements Coverage :
```

## Traceability

```text
Requirement validation :
Characterization :
Untraced :
```

## Functional

```text
Scenarios :
Matrix :
E2E :
```

## Reporting

Lister les fichiers modifiés.

## Workflow

Indiquer si `build-info.json` a été enrichi.

## Validation

Donner les résultats de :

```text
npm run coverage:report
npm run lint
npm run format:check
npm test
```

Confirmer que les métriques sont calculées dynamiquement depuis les Requirements, la RTM, le plan et les tests.