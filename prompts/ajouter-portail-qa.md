# Portail QA central — SauceDemo

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Objectif

Créer un portail QA central pour le projet SauceDemo Playwright.

Le portail doit regrouper et rendre accessibles :

- rapport de couverture fonctionnelle ;
- rapport Playwright HTML ;
- rapport Allure ;
- rapport qualité ESLint / Prettier.

Il doit reprendre très fidèlement le design et l'identité visuelle du projet de référence :

`maximejoannis/saucedemo-playwright-automation`

La structure de référence à reproduire est :

```text
reporting/qa-portal/
├── index.html
├── styles.css
└── app.js
```

---

# 1. Architecture

Créer :

```text
reporting/
├── coverage/
├── qa-portal/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── scripts/
```

Les fichiers de `reporting/qa-portal/` sont des sources statiques.

Ils seront copiés plus tard dans le site GitHub Pages.

---

# 2. Rapports à présenter

Le portail doit présenter quatre entrées principales :

## Couverture fonctionnelle

Lien cible futur :

```text
./coverage/
```

Description :

```text
Couverture du périmètre fonctionnel, scénarios automatisés et matrice Passant / Non passant / Erreur.
```

## Playwright

Lien cible futur :

```text
./functional/
```

Description :

```text
Rapport HTML natif Playwright de la dernière exécution.
```

## Allure

Lien cible futur :

```text
./allure/
```

Description :

```text
Rapport détaillé Allure : suites, étapes, pièces jointes, traces et historique.
```

## Qualité du code

Lien cible futur :

```text
./quality/
```

Description :

```text
Contrôles ESLint et Prettier avec quality gate.
```

---

# 3. Design

Conserver la même identité visuelle que le projet de référence.

Palette principale :

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

Le rendu doit conserver :

- fond sombre ;
- cartes sombres ;
- accents lime ;
- grandes typographies ;
- bordures fines ;
- coins arrondis ;
- animations hover discrètes ;
- responsive ;
- topbar ;
- mode dark/light si déjà utilisé dans le rapport Coverage.

Ne pas utiliser Bootstrap, Tailwind ou framework frontend.

HTML/CSS/JavaScript natif uniquement.

---

# 4. Header

Créer un header avec :

```text
SD
QA Portal
SauceDemo Playwright Automation
```

Afficher également lorsque les données sont disponibles :

- branche ;
- commit ;
- date de génération ;
- statut global.

Prévoir une zone dynamique pilotée par JavaScript.

---

# 5. Hero

Le hero doit présenter :

```text
Portail des rapports QA
```

et une phrase du type :

```text
Une vue consolidée de la qualité, de la couverture et des exécutions automatisées de SauceDemo.
```

Ajouter un indicateur global :

```text
QA STATUS
PASS / FAIL
```

Le statut doit pouvoir être alimenté dynamiquement par un futur fichier :

```text
build-info.json
```

---

# 6. Cartes de rapports

Créer quatre grandes cartes :

- Couverture
- Playwright
- Allure
- Qualité

Chaque carte doit afficher :

- nom ;
- courte description ;
- statut ;
- métrique principale si disponible ;
- lien vers le rapport.

Exemple Couverture :

```text
Couverture fonctionnelle
100 %
29 / 29 scénarios automatisés
```

Exemple Qualité :

```text
Qualité du code
PASS
ESLint + Prettier
```

Ne code pas définitivement ces valeurs dans le HTML.

Prépare leur mise à jour via JavaScript.

---

# 7. Données Coverage

Le portail devra pouvoir lire ou utiliser les données du rapport Coverage.

Source future :

```text
./coverage/summary.json
```

ou un fichier équivalent réellement produit par le générateur existant.

Si le générateur Coverage produit actuellement un autre nom, utilise le vrai fichier.

Afficher au minimum :

- fonctionnalités couvertes / totales ;
- scénarios automatisés / planifiés ;
- matrice couverte / totale ;
- taux principal.

Avec l'état actuel, le portail doit pouvoir afficher dynamiquement :

```text
6 / 6 fonctionnalités
29 / 29 scénarios
18 / 18 matrice
100 %
```

Mais ne code pas ces valeurs en dur dans le HTML.

---

# 8. Formulation couverture

Ajouter dans la carte Coverage ou une section dédiée la formulation :

> Le taux d'automatisation du périmètre fonctionnel défini mesure la proportion des scénarios planifiés disposant d'un test Playwright automatisé.

Préciser :

> Cette métrique correspond à la couverture fonctionnelle automatisée, pas à la couverture du code source de SauceDemo.

Lorsque les données actuelles valent 100 %, le portail doit pouvoir afficher :

> 6 fonctionnalités sur 6 et 29 scénarios sur 29 sont couverts. La matrice Passant / Non passant / Erreur est couverte sur 18 cellules sur 18.

Construire cette phrase depuis les données.

---

# 9. Données qualité

Lire :

```text
./quality/summary.json
```

ou le fichier réellement généré par le rapport qualité.

Afficher :

- statut global ;
- ESLint ;
- Prettier ;
- erreurs ;
- warnings si disponibles.

---

# 10. Données d'exécution

Préparer le portail à lire :

```text
build-info.json
```

Ce fichier sera créé par le workflow GitHub Actions.

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

Le portail doit continuer à fonctionner si `build-info.json` est absent localement.

---

# 11. Dégradation gracieuse

Si une donnée n'est pas disponible :

afficher :

```text
Indisponible
```

ou :

```text
Non généré
```

Ne provoquer aucune erreur JavaScript visible.

Le portail doit fonctionner :

- localement ;
- sur GitHub Pages.

---

# 12. JavaScript

`reporting/qa-portal/app.js` doit :

- charger `build-info.json` si présent ;
- charger les summaries Coverage et Quality ;
- alimenter les cartes ;
- gérer les statuts ;
- afficher date/commit/branche ;
- gérer dark/light si utilisé ;
- gérer les erreurs réseau/fichiers absents proprement.

Pas de framework.

---

# 13. Ouverture locale

Comme `fetch()` peut être bloqué sous `file://`, prévoir une dégradation propre.

Le portail statique doit rester visuellement exploitable même si les données dynamiques ne peuvent pas être chargées localement.

Ne masque pas toutes les cartes en cas d'absence de données.

---

# 14. Status badges

Utiliser des badges :

```text
PASS
FAIL
AVAILABLE
PLANNED
UNAVAILABLE
```

Couleurs suggérées :

```text
PASS       lime
FAIL       red
AVAILABLE  cyan
PLANNED    orange
```

---

# 15. Section synthèse

Ajouter une section synthétique avec par exemple :

```text
Couverture
Scénarios
Matrice
E2E
Qualité
```

Les données disponibles doivent être dynamiques.

---

# 16. Tests E2E

Si le rapport Coverage fournit le nombre de tests `@e2e`, afficher cette métrique séparément.

Ne les inclure pas dans :

```text
29 scénarios fonctionnels
```

La distinction doit rester claire.

---

# 17. Liens

Les liens doivent être relatifs et compatibles GitHub Pages :

```text
./coverage/
./functional/
./allure/
./quality/
```

Ne coder aucune URL GitHub Pages absolue.

---

# 18. Accessibilité

Prévoir :

- HTML sémantique ;
- focus visible ;
- aria-label lorsque pertinent ;
- contraste suffisant ;
- navigation clavier ;
- responsive mobile.

---

# 19. Aucune modification des tests

Ne modifie pas :

- tests Playwright ;
- POM ;
- fixtures ;
- plan fonctionnel ;
- configuration Allure ;
- logique Coverage ;
- logique Quality sauf nécessité stricte d'exposer les summaries.

---

# 20. Validation HTML/JS

Vérifie au minimum la syntaxe JavaScript :

```powershell
node --check reporting/qa-portal/app.js
```

Vérifie aussi que :

```text
reporting/qa-portal/index.html
reporting/qa-portal/styles.css
reporting/qa-portal/app.js
```

existent.

---

# 21. Validation qualité

Exécute :

```powershell
npm run lint
npm run format:check
```

Corrige les problèmes légitimes.

---

# 22. Validation Playwright

Exécute :

```powershell
npm test
```

La création du portail ne doit provoquer aucune régression.

---

# 23. Résultat final

À la fin indique :

## Fichiers créés

```text
reporting/qa-portal/index.html
reporting/qa-portal/styles.css
reporting/qa-portal/app.js
```

## Données consommées

Indique quels fichiers dynamiques le portail tente de charger.

## Rapports liés

Confirme les quatre destinations :

```text
coverage
functional
allure
quality
```

## Design

Confirme que le portail reprend l'identité graphique du projet de référence.

## Validation

Donne le résultat de :

```text
node --check reporting/qa-portal/app.js
npm run lint
npm run format:check
npm test
```