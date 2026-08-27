# Ajouter Allure au projet Playwright SauceDemo

## Agent

Utilise l'agent `playwright_test_generator`.

## Objectif

Ajouter Allure Reporting à la suite Playwright existante sans modifier le comportement fonctionnel des tests.

La suite Playwright passe actuellement sur Chromium.

Allure devra fonctionner :

- en local ;
- plus tard dans GitHub Actions ;
- avec le futur portail QA.

---

## 1. Dépendances

Installe uniquement les dépendances nécessaires à l'intégration Allure avec Playwright.

Utilise les packages adaptés à Playwright et à la génération du rapport Allure HTML.

Ne modifie pas les versions de Playwright ou TypeScript sans nécessité.

---

## 2. Reporter Playwright

Modifie :

`playwright.config.ts`

Conserve le rapport HTML Playwright existant.

Ajoute Allure comme reporter supplémentaire.

La configuration doit permettre de générer :

`allure-results/`

après une exécution des tests.

Le reporter HTML Playwright doit rester disponible dans :

`playwright-report/`

Ne remplace donc pas :

`html`

par Allure.

Utilise plusieurs reporters.

---

## 3. Résultats Allure

Le dossier de résultats attendu est :

`allure-results/`

Le rapport HTML généré doit être :

`allure-report/`

---

## 4. Scripts npm

Ajoute les scripts nécessaires dans `package.json`.

Au minimum :

```json
{
  "allure:generate": "allure generate allure-results --clean -o allure-report",
  "allure:open": "allure open allure-report"
}