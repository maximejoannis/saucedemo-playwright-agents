# Rapport qualité du code — ESLint et Prettier

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Objectif

Créer un rapport HTML de qualité du code pour le projet SauceDemo Playwright.

Le rapport doit synthétiser les résultats de :

- ESLint ;
- Prettier.

Il doit être compatible avec :

- exécution locale ;
- GitHub Actions ;
- futur portail QA ;
- GitHub Pages.

Le design doit rester cohérent avec le projet de référence :

`maximejoannis/saucedemo-playwright-automation`

et avec le futur portail QA.

---

# 1. Architecture

Créer ou compléter :

```text
reporting/
├── coverage/
├── qa-portal/
└── scripts/
    ├── generate-coverage-report.js ou .mjs
    └── generate-quality-report.mjs
```

Le rapport généré doit être écrit dans :

```text
quality-report/
```

avec au minimum :

```text
quality-report/
└── index.html
```

Le dossier `quality-report/` est un artefact généré.

Il ne doit pas contenir les sources principales du générateur.

---

# 2. Script de génération

Créer :

```text
reporting/scripts/generate-quality-report.mjs
```

Privilégier `.mjs` pour rester cohérent avec l'architecture du projet de référence.

Le script doit fonctionner :

- sous Windows ;
- sous Linux ;
- dans GitHub Actions.

Utiliser uniquement les APIs Node.js multiplateformes.

---

# 3. Contrôle ESLint

Le script doit exécuter le contrôle ESLint réellement configuré dans le projet.

Utiliser le script npm existant :

```text
npm run lint
```

ou appeler ESLint d'une manière équivalente si cela permet de récupérer des données structurées.

Ne simule pas le résultat.

Le rapport doit distinguer :

- erreurs ;
- warnings ;
- fichiers analysés si disponible ;
- statut global.

Statut ESLint :

```text
PASS
```

si aucune erreur bloquante n'est présente.

Sinon :

```text
FAIL
```

---

# 4. Contrôle Prettier

Le script doit réellement vérifier Prettier.

Utiliser :

```text
npm run format:check
```

ou une méthode équivalente permettant d'obtenir le résultat.

Afficher :

- statut PASS / FAIL ;
- nombre de fichiers non conformes si cette information est disponible ;
- message synthétique.

Ne lance pas automatiquement `prettier --write` dans le générateur.

Le rapport doit mesurer la qualité, pas modifier silencieusement les fichiers.

---

# 5. Ne pas masquer les erreurs

Le script de génération du rapport doit pouvoir produire le rapport même si :

- ESLint échoue ;
- Prettier échoue.

Le rapport doit refléter l'échec.

Évite donc que le processus s'arrête avant d'avoir généré le HTML.

Après génération, le script peut retourner un code approprié uniquement si cela est compatible avec le workflow futur.

Pour le moment, privilégie la génération fiable du rapport.

---

# 6. Métriques principales

Afficher au minimum :

## Statut qualité global

PASS uniquement si :

- ESLint passe ;
- Prettier passe.

## ESLint

Afficher :

```text
Errors
Warnings
Status
```

## Prettier

Afficher :

```text
Formatted / compliant
Non-compliant
Status
```

Si certaines valeurs ne peuvent pas être déterminées de manière fiable, ne les invente pas.

---

# 7. Rapport HTML

Le rapport doit être autonome et utilisable depuis :

```text
quality-report/index.html
```

HTML/CSS/JavaScript natif uniquement.

Pas de React.

Pas de Bootstrap.

Pas de framework CSS.

Pas de bibliothèque externe nécessaire au rendu.

---

# 8. Design

Utilise la même identité graphique que le reporting QA de référence.

Palette :

```css
--bg: #090c0b;
--panel: #111614;
--panel-2: #171d1a;
--text: #f3f7f1;
--muted: #9ba69e;
--line: #29312c;
--lime: #c7ff4a;
--cyan: #4be5ff;
--orange: #ffac4b;
--red: #ff6b72;
```

Le rendu doit comporter :

- fond sombre ;
- cartes ;
- accent lime ;
- grandes métriques ;
- badges PASS / FAIL ;
- responsive ;
- cohérence visuelle avec le rapport Coverage ;
- mode sombre prioritaire.

Ne crée pas une UI différente du portail QA.

---

# 9. Header

Afficher par exemple :

```text
SD
QA Quality
```

avec :

```text
ESLint + Prettier
```

et la date/heure de génération.

---

# 10. Hero

Le rapport doit commencer par un statut clair :

```text
QUALITÉ DU CODE
```

avec :

```text
PASS
```

ou :

```text
FAIL
```

selon les contrôles réellement exécutés.

Ajouter une phrase expliquant :

> Le quality gate vérifie la conformité statique du code TypeScript/JavaScript et son formatage.

---

# 11. Cartes KPI

Créer au minimum des cartes pour :

### ESLint

Exemple :

```text
0 erreurs
0 warnings
PASS
```

### Prettier

Exemple :

```text
Tous les fichiers conformes
PASS
```

### Quality Gate

```text
2 / 2 contrôles réussis
```

Les valeurs doivent provenir de l'exécution réelle.

---

# 12. Détails ESLint

Si possible, afficher une liste structurée des erreurs/warnings :

- fichier ;
- ligne ;
- colonne ;
- règle ESLint ;
- message ;
- niveau.

Si aucun problème :

```text
Aucun problème ESLint détecté.
```

---

# 13. Détails Prettier

Afficher les fichiers non conformes lorsqu'il y en a.

Si aucun problème :

```text
Tous les fichiers analysés respectent le formatage Prettier.
```

---

# 14. Scope analysé

Le rapport doit préciser que les contrôles concernent notamment :

```text
tests/
reporting/
playwright.config.ts
```

et les autres fichiers couverts par la configuration réelle ESLint/Prettier.

Ne prétends pas analyser un dossier ignoré par les configurations.

---

# 15. Fichiers générés

Le script doit générer :

```text
quality-report/index.html
```

Il peut générer également :

```text
quality-report/summary.json
```

si cela facilite l'intégration avec le futur portail QA.

Je recommande fortement de créer :

```text
quality-report/summary.json
```

avec une structure similaire à :

```json
{
  "generatedAt": "...",
  "status": "passed",
  "eslint": {
    "status": "passed",
    "errors": 0,
    "warnings": 0
  },
  "prettier": {
    "status": "passed",
    "nonCompliantFiles": 0
  }
}
```

Les valeurs doivent être calculées.

---

# 16. Compatibilité portail QA

Le futur portail QA doit pouvoir lire :

```text
quality-report/summary.json
```

Le format doit donc être :

- simple ;
- stable ;
- documenté dans le code ;
- sans informations inutiles.

---

# 17. Scripts npm

Ajouter dans `package.json` :

```json
{
  "quality:report": "node reporting/scripts/generate-quality-report.mjs"
}
```

Conserver tous les scripts existants.

---

# 18. Attention aux appels récursifs

Le script :

```text
quality:report
```

ne doit pas appeler lui-même :

```text
npm run quality:report
```

Évite toute boucle.

Il peut exécuter directement :

```text
npm run lint
npm run format:check
```

ou les outils correspondants.

---

# 19. Ignorer les artefacts générés

Vérifie que les dossiers suivants ne perturbent pas ESLint/Prettier :

```text
quality-report/
coverage-report/
allure-report/
allure-results/
playwright-report/
test-results/
```

Les sources dans :

```text
reporting/
```

doivent rester analysables.

---

# 20. Validation

Exécute :

```powershell
npm run quality:report
```

Vérifie :

```text
quality-report/index.html
quality-report/summary.json
```

---

# 21. Validation qualité

Exécute ensuite séparément :

```powershell
npm run lint
npm run format:check
```

Les deux doivent réussir dans l'état actuel du projet.

---

# 22. Validation Playwright

Exécute :

```powershell
npm test
```

La suite fonctionnelle doit rester entièrement passante.

---

# 23. Ne pas modifier

Ne modifie pas :

- tests Playwright ;
- Page Objects ;
- fixtures ;
- plan fonctionnel ;
- agents Playwright ;
- données métier ;
- rapport Coverage sauf nécessité technique de cohérence visuelle.

---

# 24. Résultat final

À la fin indique :

## Fichiers créés

Notamment :

```text
reporting/scripts/generate-quality-report.mjs
quality-report/index.html
quality-report/summary.json
```

## Scripts npm

Confirme :

```text
quality:report
```

## Résultats

Indique :

```text
ESLint : PASS / FAIL
Prettier : PASS / FAIL
Quality Gate : PASS / FAIL
```

## Validation

Donne les résultats de :

```text
npm run quality:report
npm run lint
npm run format:check
npm test
```

## Compatibilité

Confirme que `summary.json` peut être utilisé ultérieurement par le portail QA et le workflow GitHub Actions.