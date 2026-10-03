# SauceDemo Playwright Agents

[![QA Portal](https://img.shields.io/badge/QA%20Portal-GitHub%20Pages-c7ff4a?logo=github&logoColor=black)](https://maximejoannis.github.io/saucedemo-playwright-agents/)
[![QA Pipeline](https://github.com/maximejoannis/saucedemo-playwright-agents/actions/workflows/qa.yml/badge.svg)](https://github.com/maximejoannis/saucedemo-playwright-agents/actions/workflows/qa.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.62-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)
![Chromium](https://img.shields.io/badge/Browser-Chromium-4285F4?logo=googlechrome&logoColor=white)
![Allure](https://img.shields.io/badge/Report-Allure-ff69b4)
![ESLint](https://img.shields.io/badge/ESLint-10.x-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.x-F7B93E?logo=prettier&logoColor=black)
![Coverage](https://img.shields.io/badge/Functional%20Coverage-100%25-brightgreen)
![Test Cases](https://img.shields.io/badge/Functional%20TC-33%2F33-brightgreen)
![E2E](https://img.shields.io/badge/E2E-3%20tests-brightgreen)
![License](https://img.shields.io/badge/License-ISC-blue)

Projet d’automatisation QA de [SauceDemo](https://www.saucedemo.com/) basé sur **Playwright**, **TypeScript** et des **agents IA spécialisés** pour la planification, la génération et la réparation des tests.

L’objectif du projet est de construire une suite de tests automatisés structurée, traçable et maintenable, avec :

- couverture fonctionnelle pilotée par un plan de tests ;
- scénarios positifs, négatifs et d’erreur ;
- tests E2E ;
- architecture Page Object Model ;
- fixtures réutilisables ;
- rapports Playwright et Allure ;
- mesure de couverture fonctionnelle ;
- contrôles Prettier, ESLint et TypeScript ;
- portail QA consolidé ;
- CI/CD GitHub Actions ;
- publication des rapports via GitHub Pages.

La conception et l’automatisation suivent une chaîne de traçabilité explicite :

```text
Fonctionnalité
→ User Story
→ Acceptance Criteria
→ Test Case
→ Playwright
```

---

## Objectifs du projet

Ce projet vise à couvrir les principales fonctionnalités de SauceDemo :

- authentification ;
- catalogue ;
- tri des produits ;
- panier ;
- checkout ;
- session et déconnexion.

Les tests sont construits à partir d’un plan fonctionnel détaillé et utilisent les comptes spéciaux fournis par SauceDemo pour caractériser plusieurs comportements non nominaux.

Le projet ne cherche pas à manipuler artificiellement le DOM ou le JavaScript de l’application pour provoquer des anomalies.

Les comportements testés correspondent à ceux réellement observables dans l’application.

---

## Stack technique

| Outil          | Usage                              |
| -------------- | ---------------------------------- |
| Playwright     | Automatisation navigateur          |
| TypeScript     | Écriture des tests et Page Objects |
| Node.js        | Runtime et scripts de reporting    |
| Codex CLI      | Exécution des agents IA            |
| Allure         | Rapport d’exécution avancé         |
| ESLint         | Analyse statique du code           |
| Prettier       | Vérification du formatage          |
| GitHub Actions | CI/CD                              |
| GitHub Pages   | Publication du portail QA          |

---

## Agents Playwright

Le projet utilise trois agents Playwright spécialisés, configurés sous :

```text
.codex/agents/
```

### Planner

```text
playwright_test_planner
```

Rôle :

- explorer l’application ;
- concevoir les User Stories, Acceptance Criteria et Test Cases ;
- construire ou enrichir le plan de tests ;
- réaliser la revue QA de la conception.

---

### Generator

```text
playwright_test_generator
```

Rôle :

- générer les tests Playwright ;
- créer ou faire évoluer les Page Objects ;
- ajouter les fixtures ;
- automatiser les TC et les parcours E2E ;
- maintenir le reporting, le portail QA et la CI/CD.

---

### Healer

```text
playwright_test_healer
```

Rôle :

- réaliser une revue de robustesse ;
- diagnostiquer les tests en échec ;
- appliquer une correction ciblée sans dégrader l’intention fonctionnelle.

Cette séparation permet de distinguer :

```text
Planifier
→ Générer
→ Réparer
```

---

## Couverture fonctionnelle

Le plan de tests couvre six domaines :

| Fonctionnalité   | Passant | Non passant | Erreur |
| ---------------- | ------- | ----------- | ------ |
| Authentification | ✅      | ✅          | ✅     |
| Catalogue        | ✅      | ✅          | ✅     |
| Tri              | ✅      | ✅          | ✅     |
| Panier           | ✅      | ✅          | ✅     |
| Checkout         | ✅      | ✅          | ✅     |
| Session          | ✅      | ✅          | ✅     |

Le périmètre fonctionnel actuel contient :

```text
6 fonctionnalités
6 User Stories
32 Acceptance Criteria
33 Test Cases fonctionnels
15 TC passants / 3 non passants / 15 erreurs
```

La couverture actuelle du périmètre défini est :

```text
Fonctionnalités : 6 / 6
User Stories    : 6 / 6
AC              : 32 / 32
TC automatisés  : 33 / 33
TC manuels      : 0
TC candidats    : 0
Charters EXP    : 8 (hors dénominateur des TC)
```

Soit :

```text
100 % de taux descriptif d’automatisation des TC actuellement définis
```

> Le ratio 33/33 décrit l’état actuel : chacun des TC fonctionnels définis a un mode d’exécution `Automatisé` validé et une implémentation Playwright. Ce taux n’est ni un objectif qualité à maintenir pour les futurs TC, ni une couverture exhaustive de SauceDemo ou de son code source. Un futur contrôle peut légitimement rester manuel, candidat ou exploratoire lorsque sa valeur le justifie.

La couche d’investigation humaine est documentée séparément dans [`tests/exploratory/charters.md`](tests/exploratory/charters.md). Un charter `EXP-*` planifié ou exécuté ne devient pas automatiquement un TC et n’augmente jamais la couverture automatisée ci-dessus.

### Important

La couverture fonctionnelle mesure les besoins et AC exercés par des contrôles définis. Le taux d’automatisation mesure séparément la proportion des TC dont le mode validé est `Automatisé`; il n’inclut jamais les charters exploratoires.

Cette métrique ne représente ni une couverture exhaustive de toutes les fonctionnalités possibles de SauceDemo, ni une couverture du code source de l'application.

Elle ne correspond pas à :

```text
line coverage
branch coverage
statement coverage
code coverage
```

du code source de SauceDemo.

Le code source de l’application n’est pas instrumenté par ce projet.

---

## Répartition des tags fonctionnels

Les TC fonctionnels utilisent notamment :

```text
@positive
@negative
@error
@smoke
@regression
@auth
@catalog
@sorting
@cart
@checkout
@session
@e2e
```

Sur les 33 TC fonctionnels actuels :

```text
@positive   : 15
@negative   : 3
@error      : 15
@smoke      : 5
@regression : 33
```

Chaque TC porte un seul tag de nature (`@positive`, `@negative` ou `@error`). Les tags de campagne s’ajoutent à cette classification :

```text
Smoke fonctionnelle     : 5
Regression fonctionnelle : 33
Smoke globale           : 6 (5 TC + 1 E2E)
Regression globale      : 36 (33 TC + 3 E2E)
```

---

## Tests E2E

Une couche E2E complémentaire est disponible sous :

```text
tests/specs/e2e/
```

Elle couvre notamment :

- un parcours d’achat complet ;
- une erreur de checkout ;
- un contrôle de session après déconnexion.

Les E2E sont volontairement distingués des 33 TC fonctionnels du plan afin d’éviter de compter deux fois une même couverture métier. La suite complète contient ainsi 33 TC fonctionnels et 3 E2E complémentaires, soit 36 tests Playwright.

Exécution :

```bash
npm run test:e2e
```

Smoke E2E :

```bash
npm run test:e2e:smoke
```

---

## 🌐 Portail QA

Le portail QA centralise les résultats de l'automatisation :

- couverture fonctionnelle ;
- rapport Playwright ;
- rapport Allure ;
- Quality Report et Quality Gate Prettier / ESLint / TypeScript ;
- statut global du pipeline.

La CI alimente le portail avec `portal-data.js`. Il présente les informations de la dernière exécution CI publiée, sans les qualifier de temps réel.

👉 **[Accéder au portail QA](https://maximejoannis.github.io/saucedemo-playwright-agents/)**

## Architecture du projet

```text
.
├── .codex/
│   └── agents/
│       ├── playwright_test_generator.toml
│       ├── playwright_test_healer.toml
│       └── playwright_test_planner.toml
│
├── .github/
│   └── workflows/
│       └── qa.yml
│
├── prompts/
│   └── ...
│
├── reporting/
│   ├── coverage/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   │
│   ├── quality/
│   │   ├── index.html
│   │   └── styles.css
│   │
│   ├── qa-portal/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   │
│   └── scripts/
│       ├── generate-coverage-report.js
│       ├── generate-quality-report.mjs
│       └── generate-portal-data.mjs
│
├── tests/
│   ├── fixtures/
│   │   └── test-fixtures.ts
│   │
│   ├── pages/
│   │   ├── login.page.ts
│   │   ├── inventory.page.ts
│   │   ├── cart.page.ts
│   │   └── checkout.page.ts
│   │
│   ├── requirements/
│   │   ├── user-stories.md
│   │   ├── acceptance-criteria.md
│   │   └── traceability-matrix.md
│   │
│   ├── specs/
│   │   ├── e2e/
│   │   │   ├── purchase.e2e.spec.ts
│   │   │   ├── checkout-errors.e2e.spec.ts
│   │   │   └── session.e2e.spec.ts
│   │   │
│   │   ├── auth.spec.ts
│   │   ├── inventory.spec.ts
│   │   ├── sorting.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── session.spec.ts
│   │
│   ├── test-data/
│   └── test-plan/
│       └── plan-tests-fonctionnels-saucedemo.md
│
├── eslint.config.mjs
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Page Object Model

Les interactions avec l’application sont encapsulées dans des Page Objects.

### LoginPage

Responsable notamment de :

- navigation vers la page de connexion ;
- saisie username/password ;
- soumission du formulaire ;
- lecture des erreurs d’authentification.

### InventoryPage

Responsable notamment de :

- catalogue ;
- noms et prix ;
- tri ;
- ajout/suppression de produits ;
- panier ;
- menu ;
- logout.

### CartPage

Responsable notamment de :

- contenu du panier ;
- quantité ;
- prix ;
- suppression ;
- navigation vers checkout.

### CheckoutPage

Responsable notamment de :

- formulaire client ;
- validation des erreurs ;
- overview ;
- totaux ;
- Finish ;
- confirmation de commande.

---

## Fixtures

Le projet contient des fixtures Playwright réutilisables sous :

```text
tests/fixtures/
```

Elles permettent notamment de fournir une page déjà authentifiée avec :

```text
standard_user
```

et d’éviter la duplication du même parcours de connexion dans les scénarios qui n’ont pas besoin de tester explicitement l’authentification.

---

## Configuration Playwright

Le projet utilise uniquement :

```text
Chromium
```

La configuration inclut :

```text
baseURL         https://www.saucedemo.com
testIdAttribute data-test
trace           retain-on-failure
screenshot      only-on-failure
```

En CI :

```text
retries = 2
workers = 1
```

Les reporters actifs sont :

```text
Playwright HTML
Allure
JSON (données du portail QA)
```

---

## Installation locale

### Prérequis

- Node.js ;
- npm ;
- Git ;
- Chromium Playwright.

Cloner le repository :

```bash
git clone https://github.com/maximejoannis/saucedemo-playwright-agents.git
```

Entrer dans le projet :

```bash
cd saucedemo-playwright-agents
```

Installer les dépendances :

```bash
npm ci
```

Installer Chromium :

```bash
npx playwright install chromium
```

---

## Exécuter les tests

### Suite complète

```bash
npm test
```

### Tests positifs

```bash
npm run test:positive
```

### Tests négatifs

```bash
npm run test:negative
```

### Tests d’erreur

```bash
npm run test:error
```

### Smoke

```bash
npm run test:smoke
```

### Régression

```bash
npm run test:regression
```

### E2E

```bash
npm run test:e2e
```

### Smoke E2E

```bash
npm run test:e2e:smoke
```

---

## Rapport Playwright

Après une exécution :

```bash
npm test
```

le rapport HTML Playwright est généré dans :

```text
playwright-report/
```

Pour l’ouvrir :

```bash
npx playwright show-report
```

---

## Rapport Allure

Les résultats bruts Allure sont produits dans :

```text
allure-results/
```

Générer le rapport :

```bash
npm run allure:generate
```

La génération HTML nécessite Java. Java n’est pas requis pour exécuter les tests Playwright localement ; la génération officielle du rapport Allure est réalisée dans GitHub Actions avec Java 17.

Le rapport est créé dans :

```text
allure-report/
```

L’ouvrir :

```bash
npm run allure:open
```

---

## Rapport de couverture fonctionnelle

Le rapport de couverture est généré automatiquement à partir :

- des [User Stories](tests/requirements/user-stories.md) ;
- des [Acceptance Criteria](tests/requirements/acceptance-criteria.md) ;
- de la [matrice de traçabilité](tests/requirements/traceability-matrix.md) ;
- du [plan fonctionnel](tests/test-plan/plan-tests-fonctionnels-saucedemo.md) ;
- des IDs `TC-*` présents dans les tests ;
- des tags ;
- des parcours E2E complémentaires.

Commande :

```bash
npm run coverage:report
```

Sortie :

```text
coverage-report/
```

Le générateur se trouve dans :

```text
reporting/scripts/generate-coverage-report.js
```

Les sources graphiques sont situées dans :

```text
reporting/coverage/
```

Le rapport calcule notamment :

```text
fonctionnalités couvertes
User Stories couvertes
Acceptance Criteria couverts
Test Cases automatisés
@positive
@negative
@error
@smoke
@regression
E2E
```

Les valeurs ne sont pas codées statiquement dans le rapport.

---

## Qualité du code

Le projet utilise :

```text
ESLint
Prettier
TypeScript
```

### Lint

```bash
npm run lint
```

Correction automatique :

```bash
npm run lint:fix
```

### Formatage

Vérification :

```bash
npm run format:check
```

Formatage :

```bash
npm run format
```

---

## Rapport qualité

Générer le rapport :

```bash
npm run quality:report
```

Sortie :

```text
quality-report/
```

Le générateur se trouve dans :

```text
reporting/scripts/generate-quality-report.mjs
```

Le rapport présente notamment :

```text
Prettier
→ ESLint
→ TypeScript
→ Quality Gate
```

Le Quality Gate échoue si l’un de ces trois contrôles échoue. Son résultat actuel est `3/3 PASS`. Playwright et Allure restent des validations CI séparées.

---

## Portail QA

Le projet possède un portail central consolidant :

```text
Couverture fonctionnelle
Playwright Report
Allure Report
Coverage QA
Quality Report
```

Les sources du portail sont situées dans :

```text
reporting/qa-portal/
```

Le portail affiche notamment :

- branche ;
- commit ;
- date de la dernière exécution CI publiée ;
- résultats Playwright ;
- couverture QA ;
- Quality Gate ;
- accès aux quatre rapports.

Ces informations sont injectées par la CI dans `portal-data.js` lors de l’assemblage du site.

Le frontend utilise uniquement :

```text
HTML
CSS
JavaScript natif
```

sans framework frontend.

---

## GitHub Actions

Le workflow principal est :

```text
.github/workflows/qa.yml
```

Il est déclenché sur :

```text
push sur main
pull_request vers main
workflow_dispatch
```

Le pipeline est organisé autour de deux jobs :

```text
qa
deploy
```

### QA

Ce job :

```text
installe Node.js
installe Node.js 24 et Java 17
installe les dépendances avec npm ci
installe Chromium et ses dépendances Linux
exécute le Quality Gate
exécute les 36 tests Playwright
génère la couverture QA
génère Allure avec Java 17
assemble le portail et génère portal-data.js
valide et conserve les artefacts QA
```

### Deploy

Publie le portail QA sur GitHub Pages uniquement après un `push` réussi sur `main`. Les Pull Requests et les lancements manuels exécutent les validations et assemblent le portail sans le déployer.

Une validation en échec bloque le déploiement. Les résultats Playwright et Allure disponibles sont néanmoins téléversés pour faciliter le diagnostic.

---

## Chromium uniquement en CI

Le projet installe explicitement :

```bash
npx playwright install --with-deps chromium
```

et n’installe pas :

```text
Firefox
WebKit
```

Cela réduit le temps et le coût d’exécution CI pour le périmètre actuel.

---

## Artefacts CI

GitHub Actions conserve notamment :

```text
playwright-report/
allure-report/
allure-results/
quality-report/
coverage-report/
```

dans un artefact de diagnostic :

```text
qa-artifacts-<run-id>-<attempt>
```

avec une rétention de 30 jours.

---

## GitHub Pages

Lors d’une exécution sur `main`, le workflow construit une arborescence du type :

```text
/
├── playwright/
├── allure/
├── quality/
└── coverage/
```

Le portail QA est placé à la racine.

La CI y génère `portal-data.js` avec la branche, le commit, la date, les résultats Playwright, le Quality Gate et la couverture QA de la dernière exécution CI publiée.

Les liens du portail restent relatifs afin de fonctionner sur GitHub Pages sans URL de dépôt codée en dur.

---

## Données de test SauceDemo

Compte nominal :

```text
standard_user
secret_sauce
```

Comptes spéciaux utilisés :

```text
locked_out_user
problem_user
error_user
```

Mot de passe :

```text
secret_sauce
```

Ces comptes sont fournis par SauceDemo et servent à explorer différents comportements de démonstration.

---

## Exemples de comportements caractérisés

La suite couvre notamment :

- login réussi ;
- login refusé ;
- utilisateur verrouillé ;
- champs obligatoires ;
- affichage des six produits ;
- détail produit ;
- tri alphabétique ;
- tri par prix ;
- comportements `problem_user` ;
- comportements `error_user` ;
- ajout et suppression du panier ;
- persistance du panier ;
- checkout vide ;
- validations du formulaire checkout ;
- overview ;
- calcul total/taxe ;
- fin de commande ;
- annulation checkout ;
- logout ;
- protection des URLs après logout.

---

## Philosophie des tests

Les tests suivent plusieurs principes :

```text
assertions explicites
locators stables
data-test prioritaire
pas de waitForTimeout
pas de test.skip
pas de test.fixme
pas de test.only
réutilisation via POM
fixtures ciblées
scénarios indépendants
```

Les assertions sont volontairement strictes pour les éléments stables :

```text
messages d’erreur
titres
noms produits
prix
totaux
quantités
badges
```

---

## Prompts et traçabilité IA

Le dossier :

```text
.codex/agents/
```

contient la configuration et les instructions des trois agents utilisés pour faire évoluer le projet.

Exemples :

```text
playwright_test_planner.toml
playwright_test_generator.toml
playwright_test_healer.toml
```

Cette approche permet de conserver une trace lisible des principales étapes de génération et d’évolution du projet.

---

## Commandes principales

```bash
npm test
npm run test:positive
npm run test:negative
npm run test:error
npm run test:smoke
npm run test:regression

npm run test:e2e
npm run test:e2e:smoke

npm run lint
npm run lint:fix
npm run typecheck

npm run format
npm run format:check

npm run allure:generate
npm run allure:open

npm run coverage:report
npm run quality:report
npm run portal:data
```

---

## État actuel

À l’état actuel du projet :

```text
6 / 6 fonctionnalités couvertes
6 / 6 User Stories couvertes
32 / 32 Acceptance Criteria couverts
33 / 33 TC fonctionnels automatisés
0 TC manuel / 0 candidat à l’automatisation
8 charters exploratoires hors dénominateur des TC
15 passants / 3 non passants / 15 erreurs
3 E2E complémentaires
36 tests Playwright
7 Smoke fonctionnels / 8 Smoke globaux
33 Regression fonctionnels / 36 Regression globaux
100 % de taux descriptif d’automatisation des TC actuellement définis (pas un objectif futur)
Quality Gate : 3 / 3 PASS
```

Le pipeline GitHub Actions valide :

```text
Tests Playwright
Coverage
ESLint
Prettier
TypeScript
Allure
Portail QA
GitHub Pages
Quality Gate
```

---

## Licence

Projet personnel et pédagogique autour de l’automatisation QA avec Playwright et des agents IA.

SauceDemo appartient à son éditeur respectif et est utilisé ici comme application publique de démonstration et d’entraînement.
