# Aligner le rapport Qualité sur la référence et ajouter TypeScript au Quality Gate

## Agent

Utilise `playwright_test_generator`.

---

# 1. Objectif

Effectuer une dernière évolution du rapport Qualité du projet :

```text
saucedemo-playwright-agents
```

Cette évolution comporte deux objectifs indissociables :

1. aligner le rapport Qualité sur le rapport du projet de référence ;
2. ajouter TypeScript comme véritable troisième contrôle du Quality Gate.

Le rapport cible publié est :

```text
https://maximejoannis.github.io/saucedemo-playwright-agents/quality/index.html
```

Le rapport de référence est :

```text
https://maximejoannis.github.io/saucedemo-playwright-automation/quality/index.html
```

Dépôt de référence :

```text
https://github.com/maximejoannis/saucedemo-playwright-automation
```

Dépôt cible :

```text
https://github.com/maximejoannis/saucedemo-playwright-agents
```

---

# 2. Principe fondamental

Ne pas simplement appliquer le CSS du portail QA au rapport Qualité.

Le rapport Qualité de référence possède sa propre présentation dédiée.

Prendre directement comme référence :

```text
saucedemo-playwright-automation/
└── reporting/
    └── scripts/
        └── generate-quality-report.mjs
```

Étudier sa génération HTML et CSS avant de modifier le projet cible.

Le rapport Agents doit reprendre aussi fidèlement que possible :

- la structure HTML ;
- le layout ;
- le header ;
- le hero ;
- le score global ;
- le verdict ;
- les cartes de contrôle ;
- les badges ;
- les métriques ;
- les blocs de détails ;
- les sorties de commandes ;
- les métadonnées ;
- le footer ;
- la palette ;
- la typographie ;
- les bordures ;
- les ombres ;
- les espacements ;
- le responsive ;
- le thème clair / sombre.

Le résultat doit être visuellement quasiment identique au rapport de référence.

Les différences doivent uniquement provenir des données réelles du projet Agents.

---

# 3. Fichiers à analyser

Analyser au minimum :

```text
package.json
tsconfig.json
reporting/scripts/generate-quality-report.mjs
.github/workflows/playwright.yml
reporting/qa-portal/index.html
reporting/qa-portal/app.js
```

ainsi que tout fichier réellement impliqué dans la génération et la publication du rapport Qualité.

---

# 4. Fichiers pouvant être modifiés

Modifier uniquement ce qui est nécessaire parmi :

```text
package.json
tsconfig.json
reporting/scripts/generate-quality-report.mjs
.github/workflows/playwright.yml
reporting/qa-portal/index.html
reporting/qa-portal/app.js
```

Le portail QA ne doit être modifié que si son affichage du Quality Gate doit passer de `2/2` à `3/3` ou s'adapter aux nouvelles données.

Ne pas effectuer de refactoring sans rapport avec cette tâche.

---

# 5. Ne pas modifier directement les fichiers générés

Ne pas modifier directement :

```text
quality-report/index.html
quality-report/summary.json
```

Ces fichiers doivent être produits par :

```text
npm run quality:report
```

Toute modification du rendu doit donc être faite dans le générateur.

---

# 6. Ajouter TypeScript au Quality Gate

Le projet utilise TypeScript.

Le Quality Gate doit maintenant réellement vérifier :

```text
Prettier
ESLint
TypeScript
```

Avant toute modification, vérifier si un script `typecheck` existe déjà.

S'il n'existe pas, ajouter dans `package.json` :

```json
"typecheck": "tsc --noEmit"
```

Ne pas ajouter de nouvelle dépendance TypeScript si TypeScript est déjà installé.

---

# 7. Vérification TypeScript

Le contrôle TypeScript doit réellement exécuter :

```text
npm run typecheck
```

qui doit correspondre à :

```text
tsc --noEmit
```

L'objectif est de vérifier le typage du projet sans générer de fichiers JavaScript.

Ne jamais afficher TypeScript comme PASS sans exécuter réellement cette commande.

---

# 8. Vérifier tsconfig.json

Avant d'ajouter le contrôle au Quality Gate, vérifier que :

```text
npm run typecheck
```

fonctionne correctement avec le `tsconfig.json` actuel.

Ne pas assouplir artificiellement TypeScript uniquement pour obtenir un résultat PASS.

Ne pas désactiver des contrôles TypeScript existants pour contourner des erreurs.

Si une erreur TypeScript légitime existe dans le projet :

1. identifier sa cause ;
2. effectuer la correction minimale appropriée ;
3. ne pas modifier le comportement fonctionnel des tests.

---

# 9. Les trois contrôles

Le générateur doit maintenant exécuter exactement les contrôles réellement disponibles :

## Prettier

Commande :

```text
npm run format:check
```

Description :

```text
Vérification du formatage des fichiers versionnés.
```

---

## ESLint

Commande :

```text
npm run lint
```

Description :

```text
Analyse statique TypeScript et bonnes pratiques Playwright.
```

---

## TypeScript

Commande :

```text
npm run typecheck
```

Description :

```text
Vérification du typage TypeScript sans génération de fichiers.
```

---

# 10. Quality Gate

Le Quality Gate global est PASS uniquement lorsque :

```text
Prettier   PASS
ESLint     PASS
TypeScript PASS
```

Donc :

```text
3 / 3
```

lorsque tous les contrôles réussissent.

Si un seul contrôle échoue :

```text
ÉCHEC
```

Le calcul doit être dynamique.

Ne jamais coder `3/3` en dur dans le rapport.

---

# 11. Structure du rapport

Reprendre exactement la logique visuelle du rapport Qualité de référence.

Le rapport doit contenir :

```text
Topbar

Hero
├── titre
├── description
└── score global

Verdict global

Contrôles
├── Prettier
├── ESLint
└── TypeScript

Métadonnées

Footer
```

---

# 12. Topbar

Reprendre le design du rapport de référence.

Adapter l'identité au projet SauceDemo Playwright Agents.

Prévoir notamment un lien :

```text
Retour au portail QA
```

Le lien doit fonctionner depuis :

```text
/quality/
```

vers la racine du portail GitHub Pages.

Ne jamais utiliser une URL appartenant au dépôt de référence.

---

# 13. Hero

Reprendre exactement la structure visuelle du hero de référence.

Contenu adapté :

```text
QUALITÉ DU CODE

Rapport de qualité

Synthèse des contrôles automatiques appliqués au framework d'automatisation Playwright.
```

À droite ou à l'emplacement prévu par le design de référence, afficher le score réel :

```text
3 / 3
```

si les trois contrôles réussissent.

---

# 14. Verdict global

Reprendre le composant visuel du rapport de référence.

Lorsque tous les contrôles passent :

```text
PASS
```

avec un texte tel que :

```text
Tous les contrôles qualité sont conformes.
```

En cas d'échec :

```text
ÉCHEC
```

avec une description adaptée.

---

# 15. Cartes de contrôle

Afficher exactement trois cartes lorsque les trois contrôles sont configurés :

```text
Prettier
ESLint
TypeScript
```

Chaque carte doit afficher :

- nom ;
- description ;
- statut ;
- commande ;
- durée ;
- code de sortie ;
- sortie détaillée.

Reprendre les composants du rapport de référence, notamment :

```text
check-card
check-card__header
check-card__category
check-card__description
check-card__metrics
check-card__details
```

---

# 16. Statuts

Utiliser :

```text
PASS
```

pour un contrôle réussi.

Utiliser :

```text
ÉCHEC
```

pour un contrôle échoué.

Les couleurs doivent être celles du rapport de référence :

```text
success
danger
```

---

# 17. Sorties détaillées

Conserver le système :

```html
<details>
```

permettant d'afficher la sortie réelle des commandes.

Chaque contrôle doit permettre d'inspecter :

```text
stdout
stderr
```

ou leur sortie consolidée.

La sortie doit être correctement échappée avant insertion dans le HTML.

---

# 18. Métadonnées

Reprendre le composant de métadonnées du rapport de référence.

Afficher uniquement les informations réellement disponibles, par exemple :

```text
Branche
Commit
Date de génération
Plateforme
```

Ne rien inventer.

---

# 19. CSS

Reprendre aussi fidèlement que possible le CSS du rapport Qualité de référence.

Le rapport doit retrouver exactement le même langage visuel :

```text
fond clair
surfaces blanches
bleu primaire
violet
ombres légères
cartes arrondies
badges
hero
score
verdict
blocs techniques
```

et son équivalent sombre.

Conserver notamment la même famille typographique :

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

---

# 20. Thème sombre

Reprendre le fonctionnement du rapport de référence.

Si le rapport de référence utilise :

```css
@media (prefers-color-scheme: dark)
```

conserver ce comportement.

Ne pas inventer un mécanisme différent sans nécessité.

---

# 21. Responsive

Reprendre les breakpoints et adaptations du rapport de référence.

Vérifier le rendu :

```text
Desktop
Tablette
Mobile
```

Sur mobile, les trois cartes doivent rester parfaitement lisibles.

---

# 22. Accessibilité

Conserver ou améliorer les éléments présents dans la référence :

```text
focus-visible
HTML sémantique
details / summary
contraste
labels
navigation clavier
```

---

# 23. Langue

Tous les textes visibles doivent être en français.

Exception :

```text
PASS
```

Conserver les noms propres et technologies :

```text
SauceDemo
Playwright
TypeScript
ESLint
Prettier
GitHub
GitHub Actions
GitHub Pages
Node.js
Chromium
```

---

# 24. summary.json

Le fichier :

```text
quality-report/summary.json
```

doit désormais refléter les trois contrôles.

Il doit permettre d'identifier clairement :

```text
Prettier
ESLint
TypeScript
```

et leur statut réel.

Le statut global doit dépendre des trois résultats.

Préserver autant que possible le contrat JSON existant afin de ne pas casser le portail QA ou la CI.

---

# 25. Portail QA

Vérifier comment :

```text
reporting/qa-portal/app.js
```

interprète :

```text
quality-report/summary.json
```

Si nécessaire, adapter le portail pour reconnaître les trois contrôles.

Le portail doit pouvoir afficher :

```text
3 / 3
```

lorsque :

```text
Prettier = PASS
ESLint = PASS
TypeScript = PASS
```

Ne pas modifier le design du portail dans cette tâche.

---

# 26. GitHub Actions

Analyser :

```text
.github/workflows/playwright.yml
```

Vérifier que le contrôle TypeScript est réellement pris en compte par la CI.

Le Quality Gate de la pipeline doit prendre en compte :

```text
Prettier
ESLint
TypeScript
```

Ne pas se contenter de l'afficher dans le rapport HTML.

Si `npm run quality:report` exécute déjà les trois contrôles et produit un statut exploité par la CI, éviter de dupliquer inutilement les commandes.

Conserver le fonctionnement actuel de publication GitHub Pages.

---

# 27. Ne pas modifier le périmètre fonctionnel

Cette tâche ne doit avoir aucun impact sur :

```text
6 fonctionnalités
29 scénarios fonctionnels
18 / 18 matrice fonctionnelle
3 E2E
32 tests Playwright
```

Ne modifier aucun :

```text
test
Page Object
fixture
tag
scénario
plan fonctionnel
```

sauf correction TypeScript strictement nécessaire au passage de `tsc --noEmit`.

---

# 28. Concepts interdits

Ne pas réintroduire :

```text
User Stories
Récits utilisateur
Acceptance Criteria
Critères d'acceptation
Requirements
Requirements Coverage
Couverture des exigences
Characterization
```

---

# 29. Validation

Après modification, exécuter dans cet ordre :

```powershell
npm run format:check
npm run lint
npm run typecheck
npm run quality:report
npm test
```

Puis vérifier :

```text
quality-report/index.html
quality-report/summary.json
```

---

# 30. Vérification du rapport

Ouvrir localement :

```text
quality-report/index.html
```

Comparer visuellement avec :

```text
https://maximejoannis.github.io/saucedemo-playwright-automation/quality/index.html
```

Le rendu doit être quasiment identique.

Vérifier particulièrement :

```text
header
hero
score
verdict
3 cartes
badges
métriques
details
sorties techniques
métadonnées
footer
thème clair
thème sombre
responsive
```

---

# 31. Vérification finale

Confirmer explicitement :

```text
- rapport visuellement aligné sur la référence
- Prettier réellement exécuté
- ESLint réellement exécuté
- TypeScript réellement exécuté
- npm run typecheck utilise tsc --noEmit
- score calculé dynamiquement
- Quality Gate basé sur 3 contrôles
- summary.json contient les 3 contrôles
- portail compatible avec les 3 contrôles
- CI compatible avec les 3 contrôles
- aucune donnée fonctionnelle modifiée
- aucun test fonctionnel supprimé ou ajouté
- pipeline prête à rester verte
```

---

# Résultat attendu

Le rapport :

```text
https://maximejoannis.github.io/saucedemo-playwright-agents/quality/index.html
```

doit reprendre pratiquement à l'identique le design et la structure de :

```text
https://maximejoannis.github.io/saucedemo-playwright-automation/quality/index.html
```

tout en utilisant les données réelles de `saucedemo-playwright-agents`.

Le Quality Gate doit désormais être constitué de trois contrôles réellement exécutés :

```text
Prettier
ESLint
TypeScript
```

et afficher :

```text
3 / 3
PASS
```

uniquement lorsque les trois contrôles réussissent.