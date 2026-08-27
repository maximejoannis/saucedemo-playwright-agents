# Rapport de couverture automatisée — SauceDemo

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Objectif

Mettre en place un rapport HTML de couverture fonctionnelle automatisée pour le projet SauceDemo.

Le rapport doit être généré automatiquement à partir :

- du plan fonctionnel ;
- des tests Playwright réellement présents ;
- de leurs identifiants et tags.

Il ne s'agit PAS d'un rapport de couverture de code.

Le rapport mesure la couverture du périmètre fonctionnel défini.

---

# 1. Sources de vérité

Utilise comme source fonctionnelle principale :

`tests/specs/plan-tests-fonctionnels-saucedemo.md`

Les tests automatisés sont situés sous :

`tests/specs/`

Les tests E2E situés sous :

`tests/specs/e2e/`

ne doivent PAS être comptabilisés une deuxième fois dans le taux d'automatisation des scénarios fonctionnels.

Ils constituent une couche E2E supplémentaire.

---

# 2. Métriques fonctionnelles attendues

Le rapport doit calculer automatiquement les métriques suivantes.

## Couverture des fonctionnalités

Formule :

```text
fonctionnalités couvertes / fonctionnalités identifiées × 100
```

Le périmètre actuel contient :

- Authentification
- Catalogue
- Tri
- Panier
- Checkout
- Session / Logout

Avec le plan actuel, la valeur attendue est :

```text
6 / 6 = 100 %
```

Mais ne code pas `6` et `100 %` directement dans le HTML.

Calcule ces valeurs depuis le plan.

---

# 3. Taux d'automatisation des scénarios

Formule :

```text
scénarios fonctionnels automatisés
────────────────────────────────── × 100
scénarios fonctionnels planifiés
```

Le plan contient actuellement 29 scénarios fonctionnels identifiés par des IDs comme :

```text
TC-AUTH-01
TC-CAT-01
TC-TRI-01
TC-PAN-01
TC-CHK-01
TC-SESSION-01
```

Les IDs doivent être extraits du plan et comparés aux IDs réellement présents dans les fichiers `.spec.ts`.

Avec l'état actuel attendu :

```text
29 / 29 = 100 %
```

Ne code pas cette valeur en dur.

---

# 4. Matrice Passant / Non passant / Erreur

Le plan contient six domaines fonctionnels et trois axes de couverture :

- Passant
- Non passant
- Erreur

Cela représente :

```text
6 fonctionnalités × 3 axes = 18 cellules
```

Une cellule est couverte lorsqu'au moins un scénario correspondant est automatisé.

Calcul attendu actuellement :

```text
18 / 18 = 100 %
```

Le rapport doit calculer automatiquement cette matrice.

---

# 5. Tags fonctionnels

Calcule le nombre de scénarios fonctionnels portant :

- `@positive`
- `@negative`
- `@error`
- `@smoke`
- `@regression`

Les valeurs actuelles de référence sont :

```text
@positive   12
@negative   14
@error      11
@smoke       7
@regression 25
```

Attention :

les catégories peuvent se chevaucher.

Par exemple un scénario peut être :

```text
@negative @error
```

Il ne faut donc jamais additionner ces nombres pour obtenir le nombre total de scénarios uniques.

---

# 6. Tests E2E

Si les tests E2E existent sous :

`tests/specs/e2e/`

détecte-les séparément.

Affiche une métrique spécifique :

```text
Tests E2E
```

avec le nombre de scénarios `@e2e`.

Ne les ajoute PAS aux 29 scénarios fonctionnels planifiés.

Le rapport doit clairement distinguer :

```text
Couverture fonctionnelle
```

et :

```text
Couverture E2E
```

---

# 7. Taux de réussite

Si des données fiables de dernière exécution sont disponibles dans un fichier généré par Playwright ou par un reporter JSON, le rapport peut afficher :

```text
tests exécutés
tests passés
tests échoués
taux de réussite
```

Ne confonds jamais :

```text
taux de couverture
```

avec :

```text
taux de réussite
```

Une suite peut être couverte à 100 % et contenir des tests en échec.

Si aucune donnée fiable de dernière exécution n'est disponible, ne fabrique pas un taux de réussite.

Prépare simplement l'architecture pour pouvoir l'intégrer ultérieurement.

---

# 8. Script de génération

Crée :

`scripts/generate-coverage-report.js`

Le script doit :

1. lire le plan Markdown ;
2. détecter les fonctionnalités ;
3. détecter tous les IDs `TC-*`;
4. détecter leur type :
   - Passant
   - Non passant
   - Erreur ;
5. détecter leurs tags ;
6. parcourir les fichiers Playwright fonctionnels ;
7. détecter les IDs réellement automatisés ;
8. comparer plan et automatisation ;
9. calculer les métriques ;
10. générer les données du rapport.

Le script doit fonctionner sous :

- Windows ;
- Linux ;
- GitHub Actions.

Utilise uniquement des APIs Node.js multiplateformes.

Évite les commandes shell spécifiques à Unix.

---

# 9. Ne pas compter deux fois les E2E

Lors du calcul des scénarios fonctionnels automatisés :

ignore les fichiers situés dans :

`tests/specs/e2e/`

ou utilise une logique basée sur les IDs `TC-*`.

Les E2E ont des IDs :

```text
E2E-01
E2E-02
...
```

et doivent être calculés séparément.

---

# 10. Données intermédiaires

Crée si cela améliore l'architecture :

`reports/coverage/data.json`

Ce fichier peut contenir une structure similaire à :

```json
{
  "generatedAt": "...",
  "functionalCoverage": {
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
    }
  },
  "tags": {
    "positive": 12,
    "negative": 14,
    "error": 11,
    "smoke": 7,
    "regression": 25
  },
  "e2e": {
    "total": 3
  }
}
```

Les valeurs doivent être calculées, pas codées en dur.

---

# 11. Rapport HTML

Créer :

```text
reports/
└── coverage/
    ├── index.html
    ├── styles.css
    ├── app.js
    └── data.json
```

---

# 12. Design à reproduire

S'inspirer très fidèlement du rapport de référence :

`maximejoannis/saucedemo-qa-automation`

et notamment :

`reports/coverage/index.html`

`reports/coverage/styles.css`

Le design attendu comprend :

- fond sombre ;
- cartes sombres ;
- accent lime ;
- mode dark/light ;
- topbar sticky ;
- logo circulaire `SD` ;
- grandes typographies ;
- score circulaire ;
- cartes KPI ;
- sections numérotées ;
- responsive mobile ;
- export impression/PDF ;
- animations discrètes ;
- navigation interne.

Conserver la même identité graphique.

Couleurs de référence :

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

Ne transforme pas le portail en dashboard Bootstrap, Material UI ou autre design générique.

Ne rajoute aucune dépendance front-end.

HTML + CSS + JavaScript natif uniquement.

---

# 13. Hero principal

Le hero doit présenter en priorité :

```text
COUVERTURE FONCTIONNELLE AUTOMATISÉE
```

avec un score circulaire.

La formulation doit être :

> Le taux d'automatisation du périmètre fonctionnel défini mesure la proportion des scénarios planifiés disposant d'un test Playwright automatisé.

Le rapport doit explicitement préciser :

> Ce taux mesure la couverture fonctionnelle automatisée et non la couverture du code source de SauceDemo.

---

# 14. KPI principaux

Afficher au minimum quatre cartes :

### Fonctionnalités couvertes

Exemple actuel :

```text
6 / 6
100 %
```

### Scénarios automatisés

Exemple actuel :

```text
29 / 29
100 %
```

### Matrice de couverture

Exemple actuel :

```text
18 / 18
100 %
```

### Tests E2E

Afficher le nombre réellement détecté.

---

# 15. Section Couverture fonctionnelle

Afficher une table ou une grille :

| Fonctionnalité | Passant | Non passant | Erreur | Couverture |
| --- | --- | --- | --- | --- |
| Authentification | ✓ | ✓ | ✓ | 100 % |
| Catalogue | ✓ | ✓ | ✓ | 100 % |
| Tri | ✓ | ✓ | ✓ | 100 % |
| Panier | ✓ | ✓ | ✓ | 100 % |
| Checkout | ✓ | ✓ | ✓ | 100 % |
| Session | ✓ | ✓ | ✓ | 100 % |

Les valeurs doivent provenir du calcul du script.

Ne code pas cette table directement avec des données statiques.

---

# 16. Section Types de tests

Afficher des cartes ou barres pour :

```text
@positive
@negative
@error
```

Préciser que ces ensembles peuvent se chevaucher.

Ajouter un texte :

> Les catégories Positive, Negative et Error ne sont pas mutuellement exclusives. Un scénario d'erreur peut également être classé comme scénario négatif.

---

# 17. Section Suites

Afficher également :

```text
Smoke
Regression
E2E
```

avec les nombres calculés.

---

# 18. Section scénarios

Afficher la liste des scénarios fonctionnels.

Pour chacun :

- ID ;
- fonctionnalité ;
- type ;
- priorité ;
- tags ;
- état automatisé.

Permettre :

- filtrage ;
- recherche ;
- filtre par type ;
- filtre par fonctionnalité ;
- filtre automatisé / manquant si nécessaire.

---

# 19. Méthodologie

Ajouter une section expliquant clairement :

## Couverture des fonctionnalités

```text
fonctionnalités automatisées / fonctionnalités identifiées × 100
```

## Couverture des scénarios

```text
scénarios automatisés / scénarios planifiés × 100
```

## Couverture de matrice

```text
cellules Passant/Non passant/Erreur couvertes
──────────────────────────────────────────── × 100
cellules attendues
```

---

# 20. Formulation finale

Dans le rapport actuel, lorsque toutes les valeurs sont bien calculées à 100 %, le résumé doit pouvoir produire une phrase comme :

> Le taux d'automatisation du périmètre fonctionnel défini est de 100 % : 6 fonctionnalités sur 6 et 29 scénarios sur 29 sont couverts par des tests Playwright automatisés. La matrice Passant / Non passant / Erreur est également couverte à 100 % sur les 6 domaines fonctionnels.

Cette phrase doit être construite à partir des données calculées.

---

# 21. Cas de couverture incomplète

Le rapport doit aussi fonctionner si la couverture descend sous 100 %.

Par exemple, si un scénario est ajouté au plan mais pas encore automatisé :

```text
29 / 30
96,7 %
```

doit apparaître automatiquement.

Le rapport ne doit donc pas être conçu uniquement pour afficher 100 %.

---

# 22. Score circulaire

Le cercle principal doit utiliser le taux de scénarios automatisés.

Exemple :

```css
conic-gradient(
  var(--lime) calc(var(--score) * 1%),
  var(--line) 0
)
```

Le score doit venir des données calculées.

---

# 23. JavaScript frontend

`reports/coverage/app.js` doit :

- charger ou utiliser les données calculées ;
- remplir les KPI ;
- remplir la matrice ;
- générer les lignes de scénarios ;
- gérer les filtres ;
- gérer la recherche ;
- gérer dark/light ;
- gérer l'impression PDF.

Pas de framework JavaScript.

---

# 24. Mode fichier local

Le rapport doit si possible être consultable localement sans nécessiter un serveur HTTP.

Si `fetch('data.json')` pose problème avec `file://`, préfère générer les données dans un fichier JS comme :

`coverage-data.js`

avec :

```js
window.COVERAGE_DATA = {...};
```

ou injecter proprement les données au moment de la génération.

Choisis la solution la plus robuste pour :

- ouverture locale ;
- GitHub Pages.

---

# 25. Accessibilité

Conserver :

- HTML sémantique ;
- labels ;
- `aria-label` lorsque nécessaire ;
- contraste suffisant ;
- navigation clavier ;
- responsive.

---

# 26. Script npm

Ajouter :

```json
{
  "coverage:report": "node scripts/generate-coverage-report.js"
}
```

Conserver tous les scripts existants.

---

# 27. Validation automatique

Après génération :

```powershell
npm run coverage:report
```

Vérifie l'existence de :

```text
reports/coverage/index.html
reports/coverage/styles.css
reports/coverage/app.js
```

et du fichier de données utilisé.

---

# 28. Validation des données

Le script doit afficher dans le terminal un résumé comparable à :

```text
Functional coverage report generated

Features: 6/6 (100%)
Scenarios: 29/29 (100%)
Matrix: 18/18 (100%)

Positive: 12
Negative: 14
Error: 11
Smoke: 7
Regression: 25
E2E: 3
```

Les nombres doivent être calculés.

---

# 29. Qualité du code

Après génération, exécute :

```powershell
npm run lint
npm run format:check
```

Si nécessaire :

```powershell
npm run format
```

puis recommence les validations.

---

# 30. Tests

Exécute ensuite :

```powershell
npm test
```

Le générateur de rapport ne doit modifier aucun test.

---

# 31. Contraintes

Ne :

- modifie aucun scénario fonctionnel ;
- modifie aucune assertion Playwright ;
- modifie aucun POM ;
- modifie aucune fixture ;
- modifie pas les agents Playwright ;
- réactive pas Firefox ou WebKit ;
- ajoute aucune bibliothèque frontend ;
- code pas les métriques principales en dur dans le HTML ;
- compte pas les E2E deux fois.

---

# 32. Résultat final

À la fin indique :

## Fichiers créés

Liste notamment :

```text
scripts/generate-coverage-report.js
reports/coverage/index.html
reports/coverage/styles.css
reports/coverage/app.js
```

et le fichier de données utilisé.

## Métriques calculées

Donne :

- fonctionnalités couvertes / totales ;
- scénarios automatisés / planifiés ;
- matrice couverte / totale ;
- Positive ;
- Negative ;
- Error ;
- Smoke ;
- Regression ;
- E2E.

## Validation

Confirme le résultat de :

```text
npm run coverage:report
npm run lint
npm run format:check
npm test
```

## Architecture

Explique brièvement comment les données sont extraites du plan et rapprochées des tests Playwright.

Confirme explicitement qu'aucune métrique de couverture fonctionnelle n'est saisie manuellement dans le HTML.