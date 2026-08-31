# QA Automation SauceDemo

[![QA Pipeline](https://github.com/maximejoannis/saucedemo-playwright-agents/actions/workflows/qa.yml/badge.svg)](https://github.com/maximejoannis/saucedemo-playwright-agents/actions/workflows/qa.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.62-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
![Chromium](https://img.shields.io/badge/navigateur-Chromium-4285f4?logo=googlechrome&logoColor=white)

> **[Accéder au portail QA public](https://maximejoannis.github.io/saucedemo-playwright-agents/)** — dashboard centralisant Playwright Report, Allure Report, Coverage QA et Quality Report.

Projet complet de QA Automation appliqué à [SauceDemo](https://www.saucedemo.com/). Il met en œuvre une démarche traçable :

```text
Conception fonctionnelle → User Stories → Acceptance Criteria → Test Cases
→ Playwright → Reporting → Quality Gate → CI/CD
```

La suite utilise Playwright, TypeScript et Chromium, avec Allure pour le reporting détaillé et GitHub Actions pour la validation et la publication. Les agents Playwright/Codex — Planner, Generator et Healer — sont des outils intégrés au workflow ; la conception, la revue et la validation restent pilotées par la démarche QA.

## Synthèse QA

| Indicateur                        | Résultat |
| --------------------------------- | -------: |
| Fonctionnalités                   |        6 |
| User Stories                      |        6 |
| Acceptance Criteria               |       32 |
| Cas de test fonctionnels          |       33 |
| TC automatisés                    |    33/33 |
| Parcours E2E complémentaires      |        3 |
| Tests Playwright                  |       36 |
| Smoke fonctionnelle               |        5 |
| Regression fonctionnelle          |       33 |
| Couverture du périmètre QA défini |    100 % |
| Quality Gate                      | 3/3 PASS |

Le taux de 100 % correspond à la couverture automatisée du périmètre QA documenté (User Stories, Acceptance Criteria et cas de test). **Il ne représente pas une couverture du code source.**

Les 33 TC fonctionnels se répartissent en **15 passants, 3 non passants et 15 erreurs**. Les trois E2E ne sont pas inclus dans cette classification.

## Périmètre et stratégie de test

Le périmètre couvre six fonctionnalités : **Authentification, Catalogue, Tri, Panier, Checkout et Session**. Le détail est conservé dans le plan de tests et le rapport Coverage QA.

- **Tests fonctionnels** : 33 TC issus de la conception QA et reliés aux exigences.
- **E2E** : 3 parcours complémentaires vérifiant des enchaînements transverses — achat complet, erreur pendant le checkout et protection de session après déconnexion.

Les E2E ne sont pas comptabilisés comme de nouveaux TC fonctionnels ni comme des Acceptance Criteria supplémentaires.

| Campagne   | Fonctionnelle | E2E | Suite Playwright globale |
| ---------- | ------------: | --: | -----------------------: |
| Smoke      |             5 |   1 |                        6 |
| Regression |            33 |   3 |                       36 |

### Tests de caractérisation

Certains tests documentent volontairement les comportements dégradés observés avec `problem_user` et `error_user`. Ce sont des **tests de caractérisation**, pas des exigences nominales de SauceDemo. Le refus de `locked_out_user` est en revanche la règle fonctionnelle attendue pour un compte verrouillé.

## Traçabilité

```text
Fonctionnalité → User Story → Acceptance Criteria → Test Case → Playwright
```

La matrice de traçabilité constitue une source de vérité du projet. Elle confirme : **6/6 fonctionnalités**, **6/6 User Stories**, **32/32 AC** et **33/33 TC automatisés**.

- [User Stories](tests/requirements/user-stories.md)
- [Acceptance Criteria](tests/requirements/acceptance-criteria.md)
- [Matrice de traçabilité](tests/requirements/traceability-matrix.md)
- [Plan de tests fonctionnels](tests/test-plan/plan-tests-fonctionnels-saucedemo.md)

## Architecture Playwright

```text
tests/
├── fixtures/
├── pages/
├── requirements/
├── specs/
│   └── e2e/
├── test-data/
└── test-plan/

reporting/
├── coverage/
├── quality/
├── qa-portal/
└── scripts/

.github/
└── workflows/
```

Le Page Object Model repose sur `LoginPage`, `InventoryPage`, `CartPage` et `CheckoutPage`. Il sépare les interactions navigateur des scénarios et privilégie des locators robustes, notamment `data-test`. Fixtures et données de test limitent la duplication ; les scénarios restent indépendants et compatibles avec l’exécution parallèle configurée par Playwright.

## Agents Playwright / Codex

- **Planner** : exploration, conception fonctionnelle, User Stories, Acceptance Criteria, plan de tests et revue QA.
- **Generator** : architecture Playwright, automatisation, E2E, reporting et CI/CD.
- **Healer** : revue indépendante, détection de fragilité et correction ciblée.

Les agents de `.codex/agents/` s’appuient sur Playwright MCP pour assister l’exploration et les interactions navigateur. La suite finale reste validée par TypeScript, ESLint, Prettier, Playwright et GitHub Actions.

## Reporting et Quality Gate

Le portail QA regroupe quatre surfaces :

- **Playwright Report** : rapport natif de l’exécution Chromium ;
- **Allure Report** : rapport détaillé généré dans GitHub Actions avec Java 17 ;
- **Coverage QA** : couverture des fonctionnalités, User Stories, Acceptance Criteria, Test Cases et de leur automatisation — pas du code ;
- **Quality Report** : Quality Gate Prettier, ESLint et TypeScript, soit **3/3 PASS** sur l’état validé.

```text
Prettier ↓ ESLint ↓ TypeScript ↓ Quality Gate
```

Le Quality Gate échoue si l’un de ces trois contrôles échoue. Playwright et Allure restent des validations CI séparées.

## CI/CD et GitHub Pages

Le workflow [`.github/workflows/qa.yml`](.github/workflows/qa.yml) s’exécute sur les `push` vers `main`, les Pull Requests ciblant `main` et `workflow_dispatch`.

```text
Checkout → Node.js 24 → Java 17 → npm ci → Chromium → Quality Gate
→ Playwright → Coverage QA → Allure → QA Portal → GitHub Pages
```

Les Pull Requests valident et assemblent le portail sans le publier. Un `push` réussi sur `main` déclenche en plus le déploiement GitHub Pages :

```text
/
├── playwright/
├── allure/
├── coverage/
└── quality/
```

La CI génère `portal-data.js` pendant l’assemblage. Le portail affiche les données de la **dernière exécution CI publiée** : branche, commit, date d’exécution, résultats Playwright, Quality Gate et couverture QA. Ces données ne sont pas en temps réel.

## Installation locale

Prérequis : Node.js, npm, Git et Chromium installé par Playwright.

```bash
git clone https://github.com/maximejoannis/saucedemo-playwright-agents.git
cd saucedemo-playwright-agents
npm ci
npx playwright install chromium
```

Java n’est pas nécessaire pour exécuter la suite. Il est uniquement requis pour générer Allure HTML localement.

## Commandes principales

| Commande                  | Usage                           |
| ------------------------- | ------------------------------- |
| `npm test`                | Suite Chromium complète         |
| `npm run test:positive`   | Cas `@positive`                 |
| `npm run test:negative`   | Cas `@negative`                 |
| `npm run test:error`      | Cas `@error`                    |
| `npm run test:smoke`      | Smoke globale                   |
| `npm run test:regression` | Regression globale              |
| `npm run test:e2e`        | Trois parcours E2E              |
| `npm run test:e2e:smoke`  | Smoke E2E                       |
| `npm run format:check`    | Contrôle Prettier               |
| `npm run lint`            | Analyse ESLint                  |
| `npm run typecheck`       | Contrôle TypeScript             |
| `npm run quality:report`  | Quality Gate et rapport qualité |
| `npm run coverage:report` | Rapport de couverture QA        |
| `npm run allure:generate` | Génération Allure HTML          |
| `npm run allure:open`     | Ouverture du rapport Allure     |

Dans l’état actuel, `npm test` exécute **36 tests Chromium : 33 TC fonctionnels + 3 E2E**. Ce total évoluera avec le périmètre automatisé.

## Allure : local et CI

Les tests produisent `allure-results/`. Les commandes Allure nécessitent Java pour créer ou servir `allure-report/`. La génération officielle est réalisée dans GitHub Actions avec Java 17 ; Java n’est donc pas une dépendance obligatoire pour le développement local courant.

## Artefacts générés

| Répertoire           | Rôle                               |
| -------------------- | ---------------------------------- |
| `playwright-report/` | Rapport HTML Playwright            |
| `allure-results/`    | Résultats bruts Allure             |
| `allure-report/`     | Rapport HTML Allure                |
| `coverage-report/`   | Couverture du périmètre QA         |
| `quality-report/`    | Rapport du Quality Gate            |
| `site/`              | Portail assemblé pour GitHub Pages |

Ces répertoires générés sont exclus de Git. Les artefacts de diagnostic CI sont conservés pendant 30 jours.

---

Le projet démontre par ses livrables la conception QA, l’analyse des exigences, la stratégie de tests, la traçabilité, l’automatisation Playwright en TypeScript, le Page Object Model, les E2E, le reporting, la qualité de code et la CI/CD.

## Licence

Projet personnel et pédagogique autour de l’automatisation QA avec Playwright et des agents IA.

SauceDemo appartient à son éditeur respectif et est utilisé ici comme application publique de démonstration et d’entraînement.