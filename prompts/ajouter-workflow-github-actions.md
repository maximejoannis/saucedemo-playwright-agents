# GitHub Actions — QA CI, rapports et portail SauceDemo

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Objectif

Créer le workflow GitHub Actions principal du projet SauceDemo Playwright.

Le workflow doit :

- installer les dépendances ;
- générer le rapport qualité ;
- générer le rapport de couverture fonctionnelle ;
- installer Chromium uniquement ;
- exécuter les tests Playwright ;
- générer Allure ;
- publier les artefacts ;
- construire le portail QA ;
- publier le portail sur GitHub Pages ;
- appliquer un quality gate final.

Le workflow doit s'inspirer de :

`maximejoannis/saucedemo-playwright-automation`

mais être adapté à l'architecture actuelle du projet.

---

# 1. Fichier

Créer :

```text
.github/workflows/playwright.yml
```

---

# 2. Déclencheurs

Le workflow doit être exécuté sur :

```yaml
push:
  branches:
    - main

pull_request:
  branches:
    - main

workflow_dispatch:
```

---

# 3. Permissions globales

Utiliser au minimum :

```yaml
permissions:
  contents: read
```

Les permissions Pages doivent être limitées au job de déploiement.

---

# 4. Concurrency

Éviter plusieurs publications Pages concurrentes.

Utiliser une clé tenant compte de la branche, par exemple :

```yaml
concurrency:
  group: qa-pages-${{ github.ref }}
  cancel-in-progress: true
```

---

# 5. Architecture des jobs

Créer trois jobs :

```text
validate
deploy
quality-gate
```

Responsabilités :

## validate

- installation ;
- qualité ;
- couverture ;
- Playwright ;
- Allure ;
- validation des rapports ;
- artefacts ;
- construction du site Pages.

## deploy

- publication GitHub Pages.

## quality-gate

- vérification finale de tous les statuts.

---

# 6. Job validate

Nom recommandé :

```text
Validate and build QA reports
```

Utiliser :

```yaml
runs-on: ubuntu-latest
timeout-minutes: 60
```

---

# 7. Checkout

Utiliser une version stable récente de :

```yaml
actions/checkout
```

Ne choisis pas une version inexistante.

Privilégie une version stable officiellement disponible.

---

# 8. Node.js

Configurer Node.js avec une version stable compatible avec le projet.

Utilise de préférence :

```yaml
actions/setup-node@v4
```

avec :

```yaml
node-version: 24
cache: npm
```

Si le projet impose une autre version dans `package.json`, respecte cette contrainte.

---

# 9. Installation npm

Utiliser :

```bash
npm ci
```

Ne pas utiliser `npm install` dans la CI si `package-lock.json` existe.

---

# 10. Rapport qualité

Exécuter :

```bash
npm run quality:report
```

Avec :

```yaml
id: quality
continue-on-error: true
```

Le workflow doit continuer afin de produire les autres rapports même si la qualité échoue.

Le statut doit être conservé pour le quality gate final.

---

# 11. Rapport de couverture

Exécuter :

```bash
npm run coverage:report
```

Avec :

```yaml
id: coverage
continue-on-error: true
```

Le rapport attendu est :

```text
coverage-report/
```

avec au minimum :

```text
coverage-report/index.html
```

et le summary réellement généré par le script.

Ne suppose pas son nom : inspecte le générateur existant.

---

# 12. Installation Playwright

Le projet utilise uniquement Chromium.

Installer uniquement Chromium :

```bash
npx playwright install --with-deps chromium
```

Ne pas installer Firefox et WebKit.

---

# 13. Exécution Playwright

Exécuter la suite complète via :

```bash
npm test
```

ou la commande équivalente actuellement définie dans `package.json`.

Créer :

```yaml
id: functional
continue-on-error: true
```

Le workflow doit conserver le statut de cette étape.

---

# 14. Rapport HTML Playwright

Le rapport Playwright doit être généré dans :

```text
playwright-report/
```

Si une variable d'environnement est nécessaire pour forcer le dossier de sortie, configure-la proprement.

Ne casse pas la configuration locale existante.

---

# 15. Allure

Après les tests, exécuter :

```bash
npm run allure:generate
```

Avec :

```yaml
id: allure
if: ${{ !cancelled() }}
continue-on-error: true
```

Le rapport attendu est :

```text
allure-report/
```

---

# 16. Validation des rapports

Ajouter une étape :

```text
Validate generated reports
```

Exécuter uniquement si le workflow n'est pas annulé.

Vérifier l'existence réelle de :

```text
playwright-report/index.html
allure-report/index.html
quality-report/index.html
coverage-report/index.html
```

Vérifier également :

- summary Coverage réellement généré ;
- summary Quality réellement généré.

Ne suppose pas arbitrairement leurs noms.

Inspecte les scripts existants.

Valider aussi la syntaxe JavaScript du portail :

```bash
node --check reporting/qa-portal/app.js
```

Si Coverage possède un `app.js` source, vérifier également sa syntaxe.

---

# 17. Artefacts GitHub Actions

Uploader un artefact consolidé :

```text
qa-reports
```

contenant :

```text
playwright-report/
allure-report/
allure-results/
quality-report/
coverage-report/
```

Utiliser :

```yaml
retention-days: 30
```

Si `allure-results/` n'existe pas, éviter que cela fasse échouer inutilement l'upload.

---

# 18. Construction du site GitHub Pages

Ne construire le site Pages que si :

```text
github.event_name != 'pull_request'
```

Créer :

```text
pages-site/
```

Structure cible :

```text
pages-site/
├── index.html
├── styles.css
├── app.js
├── build-info.json
├── allure/
├── functional/
├── quality/
└── coverage/
```

---

# 19. Portail QA

Copier :

```text
reporting/qa-portal/.
```

vers :

```text
pages-site/
```

---

# 20. Rapport Allure

Copier :

```text
allure-report/.
```

vers :

```text
pages-site/allure/
```

---

# 21. Rapport Playwright

Copier :

```text
playwright-report/.
```

vers :

```text
pages-site/functional/
```

---

# 22. Rapport qualité

Copier :

```text
quality-report/.
```

vers :

```text
pages-site/quality/
```

---

# 23. Rapport couverture

Copier :

```text
coverage-report/.
```

vers :

```text
pages-site/coverage/
```

---

# 24. build-info.json

Créer dynamiquement :

```text
pages-site/build-info.json
```

Ne coder aucune métrique statique comme :

```text
logicalTests: 44
executions: 132
browsers: 3
```

Ces valeurs du projet de référence ne correspondent pas à notre projet.

Le fichier doit contenir uniquement des informations réellement calculées ou disponibles.

Structure recommandée :

```json
{
  "status": "passed",
  "generatedAt": "...",
  "branch": "main",
  "commit": "abcdef1",
  "workflowUrl": "...",
  "reports": {
    "functional": {
      "available": true,
      "status": "passed"
    },
    "allure": {
      "available": true,
      "status": "passed"
    },
    "quality": {
      "available": true,
      "status": "passed"
    },
    "coverage": {
      "available": true,
      "status": "passed"
    }
  }
}
```

---

# 25. Métriques Coverage dans build-info

Si un summary Coverage existe, lis-le dans le script Node qui construit `build-info.json`.

Intègre les données calculées réelles comme :

```json
{
  "coverage": {
    "features": {
      "covered": 6,
      "total": 6,
      "rate": 100
    },
    "scenarios": {
      "automated": 29,
      "planned": 29,
      "rate": 100
    },
    "matrix": {
      "covered": 18,
      "total": 18,
      "rate": 100
    },
    "e2e": {
      "total": 3
    }
  }
}
```

Ces valeurs doivent être lues dans le fichier summary.

Ne les écris pas en dur.

---

# 26. Métriques qualité dans build-info

Si :

```text
quality-report/summary.json
```

existe, lis également :

- status ;
- ESLint ;
- Prettier.

Ne duplique pas les calculs qualité dans le workflow si le script les fournit déjà.

---

# 27. Status global

Le champ :

```text
status
```

de `build-info.json` doit être :

```text
passed
```

uniquement si les étapes principales sont réussies :

- quality ;
- coverage ;
- functional ;
- allure.

Sinon :

```text
failed
```

---

# 28. Workflow URL

Construire :

```text
${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

et l'inclure dans `build-info.json`.

---

# 29. .nojekyll

Créer :

```bash
touch pages-site/.nojekyll
```

afin de désactiver Jekyll.

---

# 30. Configure Pages

Utiliser l'action officielle GitHub Pages appropriée :

```yaml
actions/configure-pages
```

avec une version stable disponible.

---

# 31. Upload Pages Artifact

Utiliser :

```yaml
actions/upload-pages-artifact
```

avec :

```text
path: pages-site/
```

---

# 32. Job deploy

Le job `deploy` doit :

- dépendre de `validate` ;
- ne pas s'exécuter sur pull_request ;
- publier uniquement si la préparation du site a réussi.

Permissions :

```yaml
pages: write
id-token: write
```

Environment :

```yaml
github-pages
```

Utiliser :

```yaml
actions/deploy-pages
```

---

# 33. Condition de deploy

Évite une condition qui empêcherait la publication du portail uniquement parce qu'un test ou quality check a échoué, SI le but est de publier les rapports d'échec.

Privilégie une logique où :

- `validate` peut produire le portail même avec des sous-étapes en échec grâce à `continue-on-error`;
- `deploy` publie le portail si la construction technique du site a réussi ;
- le quality gate échoue ensuite séparément.

Ainsi, un run en échec reste consultable depuis le portail QA.

C'est une optimisation importante.

---

# 34. Quality gate

Créer un job :

```text
quality-gate
```

avec :

```yaml
if: ${{ always() }}
```

Il doit vérifier :

- résultat du job validate ;
- statut quality ;
- statut coverage ;
- statut functional ;
- statut allure ;
- déploiement Pages lorsque applicable.

---

# 35. Outputs du job validate

Définir des outputs :

```text
quality
coverage
functional
allure
```

issus des `steps.*.outcome`.

---

# 36. Échec final

Le quality gate doit échouer si :

```text
quality != success
coverage != success
functional != success
allure != success
```

Pour les événements hors pull request, vérifier aussi le résultat du déploiement.

---

# 37. PR

Sur une Pull Request :

- exécuter qualité ;
- coverage ;
- tests ;
- Allure ;
- validation des rapports ;
- artefacts.

Ne pas publier GitHub Pages.

Le quality gate doit tout de même fonctionner.

---

# 38. Optimisation cache Playwright

Ne mets pas en place un cache complexe des navigateurs Playwright pour le moment.

Privilégie la simplicité.

Le cache npm fourni par `setup-node` suffit.

---

# 39. Chromium

Confirme explicitement qu'aucune commande CI n'installe :

- Firefox ;
- WebKit.

---

# 40. Validation YAML

Après création, inspecte le fichier attentivement.

Vérifie :

- indentation ;
- expressions GitHub `${{ ... }}`;
- dépendances entre jobs ;
- outputs ;
- conditions `if`.

Ne crée pas de syntaxe YAML invalide.

---

# 41. Validation locale avant CI

Exécute localement :

```powershell
npm run quality:report
npm run coverage:report
npm test
npm run allure:generate
```

Vérifie :

```text
quality-report/index.html
coverage-report/index.html
playwright-report/index.html
allure-report/index.html
```

---

# 42. Validation scripts

Exécute :

```powershell
node --check reporting/qa-portal/app.js
```

et les autres JavaScript/MJS pertinents si nécessaire.

---

# 43. Ne pas modifier

Ne modifie pas :

- scénarios Playwright ;
- POM ;
- fixtures ;
- plan fonctionnel ;
- agents Playwright ;
- métriques Coverage calculées ;
- design du portail QA.

---

# 44. Résultat attendu

À la fin indique :

## Workflow

Confirme :

```text
.github/workflows/playwright.yml
```

## Jobs

Liste :

```text
validate
deploy
quality-gate
```

## Navigateurs

Confirme :

```text
Chromium uniquement
```

## Rapports

Confirme :

```text
playwright-report
allure-report
quality-report
coverage-report
```

## Portail

Confirme la structure :

```text
/
├── functional/
├── allure/
├── quality/
└── coverage/
```

## build-info

Explique quelles données sont calculées dynamiquement.

## Quality gate

Explique les conditions qui font échouer le workflow.

## Validation

Donne le résultat de :

```text
npm run quality:report
npm run coverage:report
npm test
npm run allure:generate
node --check reporting/qa-portal/app.js
```