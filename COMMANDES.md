# Commandes du projet SauceDemo Playwright Agents

Ce document regroupe les principales commandes nécessaires pour installer et utiliser l'environnement du projet :

* Node.js / npm
* Codex CLI
* Playwright
* Playwright MCP
* tests Playwright
* suites Smoke / Regression
* tests par catégorie
* tests E2E
* ESLint / Prettier
* Allure
* rapports de couverture et de qualité

---

## 1. Prérequis

Installer :

* Git
* Node.js
* npm

Vérifier les installations :

```powershell
git --version
node --version
npm --version
```

---

# 2. Cloner le projet

```powershell
git clone https://github.com/maximejoannis/saucedemo-playwright-agents.git
cd saucedemo-playwright-agents
```

---

# 3. Installer les dépendances du projet

Le projet contient déjà un `package.json` et un `package-lock.json`.

Installer les dépendances avec :

```powershell
npm ci
```

Pour un environnement de développement où le fichier de verrouillage doit éventuellement être mis à jour :

```powershell
npm install
```

Pour reproduire exactement l'environnement défini par le dépôt, privilégier :

```powershell
npm ci
```

---

# 4. Installer Codex CLI

Installer Codex CLI globalement avec npm :

```powershell
npm install -g @openai/codex
```

Vérifier l'installation :

```powershell
codex --version
```

Lancer Codex :

```powershell
codex
```

Lors du premier lancement, suivre la procédure d'authentification proposée par Codex.

---

# 5. Installer Playwright

## Nouveau projet Playwright

Pour initialiser Playwright Test dans un nouveau projet :

```powershell
npm init playwright@latest
```

## Projet déjà cloné

Dans ce projet, Playwright est déjà déclaré dans les dépendances.

Après :

```powershell
npm ci
```

installer Chromium :

```powershell
npx playwright install chromium
```

Vérifier Playwright :

```powershell
npx playwright --version
```

Afficher les tests détectés :

```powershell
npx playwright test --list
```

---

# 6. Playwright MCP

Playwright MCP permet à un agent IA compatible MCP d'interagir directement avec un navigateur via Playwright.

Avec Codex CLI, ajouter le serveur MCP Playwright :

```powershell
codex mcp add playwright npx "@playwright/mcp@latest"
```

Playwright MCP peut également être lancé directement avec :

```powershell
npx @playwright/mcp@latest
```

La configuration MCP standard correspond à :

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

---

# 7. Exécuter tous les tests

Le projet utilise Chromium.

```powershell
npm test
```

Équivalent Playwright :

```powershell
npx playwright test --project=chromium
```

---

# 8. Tests Smoke

Exécuter les tests identifiés avec le tag `@smoke` :

```powershell
npm run test:smoke
```

Équivalent :

```powershell
npx playwright test --project=chromium --grep "@smoke"
```

---

# 9. Tests Regression

Exécuter la suite de régression :

```powershell
npm run test:regression
```

Équivalent :

```powershell
npx playwright test --project=chromium --grep "@regression"
```

---

# 10. Tests positifs

```powershell
npm run test:positive
```

Équivalent :

```powershell
npx playwright test --project=chromium --grep "@positive"
```

---

# 11. Tests négatifs

```powershell
npm run test:negative
```

Équivalent :

```powershell
npx playwright test --project=chromium --grep "@negative"
```

---

# 12. Tests d'erreur

```powershell
npm run test:error
```

Équivalent :

```powershell
npx playwright test --project=chromium --grep "@error"
```

---

# 13. Tests E2E

Exécuter tous les parcours E2E :

```powershell
npm run test:e2e
```

Équivalent :

```powershell
npx playwright test tests/specs/e2e --project=chromium
```

Exécuter uniquement les E2E Smoke :

```powershell
npm run test:e2e:smoke
```

Équivalent :

```powershell
npx playwright test tests/specs/e2e --project=chromium --grep "@smoke"
```

---

# 14. Exécuter un fichier de test

Exemple :

```powershell
npx playwright test tests/specs/auth.spec.ts --project=chromium
```

Autres exemples :

```powershell
npx playwright test tests/specs/inventory.spec.ts --project=chromium
npx playwright test tests/specs/sorting.spec.ts --project=chromium
npx playwright test tests/specs/cart.spec.ts --project=chromium
npx playwright test tests/specs/checkout.spec.ts --project=chromium
npx playwright test tests/specs/session.spec.ts --project=chromium
```

---

# 15. Exécuter un test précis

Rechercher un test par son titre :

```powershell
npx playwright test --project=chromium --grep "TC-AUTH-01"
```

Même principe pour n'importe quel identifiant :

```powershell
npx playwright test --project=chromium --grep "TC-CHK-06"
```

---

# 16. Mode UI Playwright

Lancer Playwright en mode UI :

```powershell
npx playwright test --ui
```

---

# 17. Mode headed

Afficher Chromium pendant l'exécution :

```powershell
npx playwright test --project=chromium --headed
```

---

# 18. Mode debug

```powershell
npx playwright test --project=chromium --debug
```

Pour un fichier spécifique :

```powershell
npx playwright test tests/specs/auth.spec.ts --project=chromium --debug
```

---

# 19. Rapport Playwright HTML

Après une exécution :

```powershell
npx playwright show-report
```

Le rapport généré se trouve dans :

```text
playwright-report/
```

---

# 20. ESLint

Contrôler la qualité du code :

```powershell
npm run lint
```

Corriger automatiquement les problèmes pouvant l'être :

```powershell
npm run lint:fix
```

---

# 21. Prettier

Vérifier le formatage :

```powershell
npm run format:check
```

Appliquer automatiquement le formatage :

```powershell
npm run format
```

---

# 22. Rapport Allure

Les résultats Allure sont produits lors de l'exécution des tests.

Exécuter les tests :

```powershell
npm test
```

Générer ensuite le rapport Allure :

```powershell
npm run allure:generate
```

Ouvrir le rapport :

```powershell
npm run allure:open
```

Répertoires concernés :

```text
allure-results/
allure-report/
```

---

# 23. Rapport de couverture fonctionnelle

Générer le rapport de couverture :

```powershell
npm run coverage:report
```

Le rapport généré se trouve dans :

```text
coverage-report/
```

Cette couverture représente le périmètre fonctionnel défini et automatisé dans le projet.

Elle ne représente pas une couverture du code source de SauceDemo.

---

# 24. Rapport qualité

Générer le rapport qualité :

```powershell
npm run quality:report
```

Le rapport généré se trouve dans :

```text
quality-report/
```

---

# 25. Validation complète avant commit

Avant de pousser une modification, une validation complète peut être effectuée avec :

```powershell
npm run lint
npm run format:check
npm run coverage:report
npm run quality:report
npm test
npm run allure:generate
```

---

# 26. Commandes Git principales

Afficher l'état du dépôt :

```powershell
git status
```

Ajouter les modifications :

```powershell
git add .
```

Créer un commit :

```powershell
git commit -m "message du commit"
```

Envoyer les modifications :

```powershell
git push
```

Récupérer les dernières modifications :

```powershell
git pull
```

---

# 27. Mise à jour des dépendances

Afficher les dépendances obsolètes :

```powershell
npm outdated
```

Mettre à jour les dépendances compatibles avec les versions définies dans `package.json` :

```powershell
npm update
```

Après une modification des dépendances, vérifier le projet :

```powershell
npm run lint
npm run format:check
npm test
```

---

# 28. Réinstallation propre

En cas de problème avec les dépendances, supprimer `node_modules` puis réinstaller depuis le lockfile.

PowerShell :

```powershell
Remove-Item -Recurse -Force node_modules
npm ci
npx playwright install chromium
```

Puis :

```powershell
npm test
```

---

# 29. Commandes rapides

| Action                    | Commande                          |
| ------------------------- | --------------------------------- |
| Installer les dépendances | `npm ci`                          |
| Installer Chromium        | `npx playwright install chromium` |
| Tous les tests            | `npm test`                        |
| Smoke                     | `npm run test:smoke`              |
| Regression                | `npm run test:regression`         |
| Positifs                  | `npm run test:positive`           |
| Négatifs                  | `npm run test:negative`           |
| Erreurs                   | `npm run test:error`              |
| E2E                       | `npm run test:e2e`                |
| E2E Smoke                 | `npm run test:e2e:smoke`          |
| ESLint                    | `npm run lint`                    |
| Correction ESLint         | `npm run lint:fix`                |
| Vérifier Prettier         | `npm run format:check`            |
| Appliquer Prettier        | `npm run format`                  |
| Couverture fonctionnelle  | `npm run coverage:report`         |
| Rapport qualité           | `npm run quality:report`          |
| Générer Allure            | `npm run allure:generate`         |
| Ouvrir Allure             | `npm run allure:open`             |
| UI Playwright             | `npx playwright test --ui`        |
| Rapport Playwright        | `npx playwright show-report`      |

---

# 30. Installation complète depuis zéro

Pour résumer, après installation de Git et Node.js :

```powershell
git clone https://github.com/maximejoannis/saucedemo-playwright-agents.git
cd saucedemo-playwright-agents

npm ci
npx playwright install chromium

npm install -g @openai/codex
codex --version

codex mcp add playwright npx "@playwright/mcp@latest"

npm test
```

Le projet est alors prêt pour le développement, l'exécution des tests Playwright et l'utilisation de Codex avec Playwright MCP.
