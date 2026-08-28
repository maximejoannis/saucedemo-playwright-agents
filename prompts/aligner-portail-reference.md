# Aligner exactement le portail QA sur le projet de référence

## Agent

Utilise `playwright_test_generator`.

## Objectif

Le portail QA du projet :

https://maximejoannis.github.io/saucedemo-playwright-agents/

doit reprendre exactement le HTML, le CSS, la structure visuelle et le design du portail de référence :

https://maximejoannis.github.io/saucedemo-playwright-automation/

Le dépôt de référence est :

https://github.com/maximejoannis/saucedemo-playwright-automation

Le dépôt à modifier est :

https://github.com/maximejoannis/saucedemo-playwright-agents

---

## Principe fondamental

Ne pas simplement s'inspirer du portail de référence.

Utiliser directement comme base les fichiers :

```text
saucedemo-playwright-automation/
└── reporting/
    └── qa-portal/
        ├── index.html
        ├── styles.css
        └── app.js
```

Le rendu visuel du portail `saucedemo-playwright-agents` doit être identique au portail de référence :

- même structure générale ;
- même layout ;
- même topbar ;
- même hero ;
- même typographie ;
- mêmes espacements ;
- mêmes cartes ;
- mêmes bordures ;
- mêmes ombres ;
- mêmes boutons ;
- mêmes couleurs ;
- même thème clair ;
- même thème sombre ;
- même bouton de changement de thème ;
- même responsive ;
- mêmes transitions et états visuels.

---

# 1. Fichiers concernés

Modifier uniquement :

```text
reporting/qa-portal/index.html
reporting/qa-portal/styles.css
reporting/qa-portal/app.js
```

Et, uniquement si nécessaire pour conserver le chargement dynamique :

```text
.github/workflows/playwright.yml
```

Ne pas modifier :

```text
tests/
reporting/coverage/
reporting/scripts/
playwright.config.ts
package.json
```

sauf nécessité technique démontrée.

---

# 2. HTML

Prendre comme base :

```text
maximejoannis/saucedemo-playwright-automation
reporting/qa-portal/index.html
```

Reprendre sa structure HTML.

Le portail doit notamment conserver le modèle du portail de référence :

```text
Topbar
├── identité du projet
├── lien vers SauceDemo
├── lien GitHub
└── bouton thème

Hero
├── titre
├── description
├── actions
└── carte état du pipeline

Métriques principales

Section rapports
├── Allure
├── Playwright
├── Couverture fonctionnelle
└── Qualité du code

Section stratégie de test

Footer
```

---

# 3. CSS

Prendre comme base exacte :

```text
maximejoannis/saucedemo-playwright-automation
reporting/qa-portal/styles.css
```

Conserver la palette du portail de référence.

Notamment :

```css
--background: #f5f7fc;
--surface: #ffffff;
--text: #172033;
--text-muted: #647089;
--border: #dbe3f1;
--primary: #245af5;
--primary-hover: #173fb9;
--primary-soft: #eaf1ff;
--violet: #6d46e8;
```

et son équivalent sombre.

Supprimer l'identité visuelle actuelle spécifique au portail Agents basée sur :

```text
lime
cyan
orange
red
fond noir
status-orbit
cartes numérotées
```

Le portail Agents doit utiliser exactement l'identité visuelle du portail de référence.

---

# 4. Adapter uniquement le contenu métier

Le design est identique, mais les données doivent correspondre au projet Playwright Agents.

Ne jamais reprendre les métriques métier du projet de référence.

Le portail Agents doit présenter son propre périmètre.

Valeurs actuelles attendues :

```text
6 fonctionnalités couvertes
29 scénarios fonctionnels automatisés
18 / 18 pour la matrice fonctionnelle
3 parcours E2E
32 tests Playwright
100 % du périmètre fonctionnel défini
```

Ces valeurs doivent continuer à provenir des données générées lorsque cela est déjà possible.

Ne pas les coder en dur si le portail les reçoit actuellement depuis `build-info.json` ou les rapports générés.

---

# 5. Hero

Adapter les textes du hero au projet Agents.

Exemple :

```text
Pilotage qualité automatisé

Un point d’entrée unique pour la qualité du projet.

Consultez les exécutions Playwright, le rapport Allure,
la qualité du code et la couverture fonctionnelle automatisée.
```

Conserver exactement le layout du portail de référence.

---

# 6. Identité du projet

Dans la topbar :

```text
SauceDemo
Playwright Agents
```

ou :

```text
SauceDemo
Portail QA
```

Le sous-titre doit être en français.

Ne pas utiliser :

```text
Quality Assurance Portal
```

Utiliser par exemple :

```text
Portail d'assurance qualité
```

---

# 7. Liens

Application :

```text
https://www.saucedemo.com/
```

Dépôt GitHub :

```text
https://github.com/maximejoannis/saucedemo-playwright-agents
```

Les liens internes doivent rester :

```text
./allure/
./functional/
./coverage/
./quality/
```

Ne pas reprendre les URLs du dépôt de référence.

---

# 8. Rapports

Conserver le style exact des cartes du portail de référence.

Le projet Agents possède quatre rapports principaux.

## Allure

Titre :

```text
Allure
```

Description adaptée au projet Agents.

Lien :

```text
./allure/
```

---

## Playwright

Titre :

```text
Tests fonctionnels
```

Catégorie :

```text
Playwright HTML
```

Lien :

```text
./functional/
```

Mentionner Chromium uniquement.

Ne pas reprendre :

```text
Firefox
WebKit
44 parcours
```

---

## Couverture fonctionnelle

Titre :

```text
Couverture automatisée
```

La description doit rester simple :

```text
Mesure de la couverture du périmètre fonctionnel défini par les tests Playwright automatisés.
```

Afficher :

```text
6 / 6 fonctionnalités
29 / 29 scénarios
18 / 18 matrice fonctionnelle
100 %
```

Ne jamais mentionner :

```text
User Stories
Récits utilisateur
Acceptance Criteria
Critères d'acceptation
Requirements
Couverture des exigences
```

---

## Qualité du code

Afficher :

```text
ESLint
Prettier
```

Ne pas ajouter TypeScript comme contrôle si ce projet ne possède pas de contrôle TypeScript explicite dans le quality gate.

---

# 9. Ne pas ajouter de régression visuelle

Le portail de référence possède éventuellement une carte liée à la régression visuelle.

Le projet Agents ne doit pas afficher une fonctionnalité qui n'existe pas.

Ne pas créer de faux rapport.

Adapter la grille pour quatre rapports tout en conservant exactement le langage visuel du portail de référence.

---

# 10. Métriques principales

Adapter les quatre métriques du portail de référence.

Utiliser :

```text
29
scénarios fonctionnels

32
tests Playwright

3
parcours E2E

100 %
couverture fonctionnelle
```

ou une disposition équivalente permettant de conserver exactement le composant visuel de référence.

---

# 11. Stratégie de test

Conserver le design de la section :

```text
Stratégie de test
```

du portail de référence.

Adapter son contenu aux six domaines du projet Agents :

```text
Authentification
Catalogue
Tri
Panier
Checkout
Session
```

Descriptions courtes en français.

Ne pas introduire de nouveaux concepts fonctionnels.

---

# 12. Langue

Tous les textes visibles doivent être en français.

Exception :

```text
PASS
```

Les noms propres et technologies restent inchangés :

```text
SauceDemo
Playwright
Allure
ESLint
Prettier
GitHub
GitHub Actions
GitHub Pages
Chromium
JavaScript
TypeScript
Node.js
Codex
```

Traduire notamment :

```text
Quality Assurance Portal
→ Portail d'assurance qualité

Quality gate
→ Contrôle qualité
```

Les clés internes JavaScript peuvent rester en anglais.

---

# 13. Statut

Conserver :

```text
PASS
```

pour un pipeline réussi.

Les autres statuts visibles doivent rester en français :

```text
ÉCHEC
INDISPONIBLE
CHARGEMENT
PLANIFIÉ
```

si ces états sont nécessaires.

---

# 14. JavaScript

Prendre le JavaScript du portail de référence comme base pour :

- changement de thème ;
- stockage du thème ;
- récupération de `build-info.json` ;
- statut global ;
- branche ;
- commit ;
- date ;
- états des rapports.

Adapter uniquement les noms de champs lorsque la structure de `build-info.json` du projet Agents est différente.

Ne pas casser le contrat de données existant.

---

# 15. Thème

Le comportement clair/sombre doit être exactement celui du portail de référence :

- préférence système ;
- bouton manuel ;
- persistance ;
- styles clair et sombre.

Le portail ne doit plus démarrer artificiellement avec :

```html
data-theme="dark"
```

si le portail de référence ne fonctionne pas ainsi.

---

# 16. Responsive

Le rendu doit rester fidèle au portail de référence sur :

```text
Desktop
Tablette
Mobile
```

Ne pas simplifier le responsive existant du portail de référence.

---

# 17. Accessibilité

Conserver les éléments d'accessibilité présents dans le portail de référence :

```text
skip-link
aria-label
aria-live
focus-visible
navigation sémantique
```

Adapter uniquement leurs textes en français.

---

# 18. Vérification visuelle

Après modification, comparer :

```text
https://maximejoannis.github.io/saucedemo-playwright-automation/
```

avec le portail local du projet Agents.

Le design doit paraître appartenir exactement à la même famille et utiliser le même système UI.

Les différences visibles doivent uniquement provenir :

- du nom du projet ;
- des métriques ;
- des rapports disponibles ;
- des contenus métier.

Pas du design.

---

# 19. Validation technique

Exécuter :

```powershell
node --check reporting/qa-portal/app.js
npm run lint
npm run format:check
npm run coverage:report
npm run quality:report
npm test
```

Tous les tests doivent rester passants.

---

# 20. Vérifications finales

Confirmer :

```text
- HTML aligné sur le portail de référence
- CSS aligné sur le portail de référence
- thème clair identique
- thème sombre identique
- topbar identique
- hero identique
- cartes identiques
- boutons identiques
- métriques adaptées au projet Agents
- URLs adaptées au projet Agents
- contenu entièrement en français
- aucune User Story
- aucun critère d'acceptation
- aucune notion Requirements
- aucune fausse fonctionnalité ajoutée
- données dynamiques conservées
- tests Playwright inchangés
```

---

## Résultat attendu

Le portail :

```text
https://maximejoannis.github.io/saucedemo-playwright-agents/
```

doit avoir exactement le même système visuel, la même structure HTML et la même feuille de style que :

```text
https://maximejoannis.github.io/saucedemo-playwright-automation/
```

tout en affichant uniquement les données et fonctionnalités réellement présentes dans `saucedemo-playwright-agents`.