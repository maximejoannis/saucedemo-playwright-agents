# Aligner le design des rapports Couverture et Qualité sur le portail QA

## Agent

Utilise `playwright_test_generator`.

## Objectif

Uniformiser complètement l'identité visuelle des pages publiées sur GitHub Pages.

Les rapports :

```text
Couverture fonctionnelle
Qualité du code
```

doivent utiliser exactement le même design system que le portail QA, lui-même aligné sur le projet de référence :

https://maximejoannis.github.io/saucedemo-playwright-automation/

Le résultat doit donner l'impression que :

```text
Portail QA
Couverture fonctionnelle
Qualité du code
```

font partie d'une seule et même application.

---

## 1. Référence visuelle

Utiliser comme référence principale le CSS final du portail :

```text
reporting/qa-portal/styles.css
```

Le rapport Couverture et le rapport Qualité doivent reprendre les mêmes principes visuels.

Ne pas créer une nouvelle identité graphique.

---

## 2. Fichiers concernés

Analyser et adapter :

```text
reporting/coverage/index.html
reporting/coverage/styles.css
reporting/coverage/app.js
```

ainsi que les sources utilisées pour générer le rapport Qualité :

```text
reporting/scripts/generate-quality-report.mjs
```

et tout fichier HTML/CSS source réellement utilisé pour produire :

```text
quality-report/index.html
```

Ne pas modifier les données métier ou les calculs sauf nécessité technique liée au rendu.

---

## 3. Design system commun

Réutiliser les mêmes variables CSS que le portail QA.

Notamment :

```css
--background: #f5f7fc;
--surface: #ffffff;
--surface-elevated: #ffffff;
--surface-muted: #eef3fb;
--text: #172033;
--text-muted: #647089;
--border: #dbe3f1;
--primary: #245af5;
--primary-hover: #173fb9;
--primary-soft: #eaf1ff;
--violet: #6d46e8;
--success: #08783e;
--success-soft: #e5f8ed;
--danger: #ba2537;
--danger-soft: #ffeaed;
--warning: #9a6200;
--warning-soft: #fff3d5;
--unknown: #5e687c;
--unknown-soft: #edf0f5;
```

Reprendre également exactement les variables du thème sombre définies dans :

```text
reporting/qa-portal/styles.css
```

Ne pas conserver une ancienne palette spécifique aux rapports.

---

## 4. Typographie

Utiliser exactement la même pile de polices que le portail QA :

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

Conserver les mêmes principes pour :

```text
h1
h2
h3
paragraphes
eyebrows
métriques
badges
boutons
liens
```

---

## 5. Topbar commune

Les rapports Couverture et Qualité doivent reprendre la même topbar que le portail QA.

Afficher :

```text
SauceDemo
Portail QA
```

ou l'identité exacte retenue dans le portail final.

Prévoir :

```text
Retour au portail
Dépôt GitHub
bouton de changement de thème
```

Le lien Retour au portail doit utiliser un chemin relatif compatible avec GitHub Pages.

Depuis :

```text
/coverage/
```

et :

```text
/quality/
```

le retour doit fonctionner correctement vers la racine du portail.

---

## 6. Hero

Utiliser le même composant Hero que le portail.

### Rapport Couverture

Exemple de contenu :

```text
COUVERTURE FONCTIONNELLE

Couverture automatisée

Visualisez la couverture des fonctionnalités principales,
des scénarios fonctionnels et de la matrice de test.
```

### Rapport Qualité

Exemple :

```text
QUALITÉ DU CODE

Contrôles qualité

Consultez les résultats des contrôles ESLint et Prettier
appliqués au projet d'automatisation.
```

Le contenu change, mais le composant visuel doit être identique.

---

## 7. Cartes

Toutes les cartes doivent reprendre exactement le style du portail :

```text
border
border-radius
background
shadow
spacing
typography
hover si applicable
```

Les cartes de métriques doivent également utiliser le même langage visuel.

---

## 8. Badges et statuts

Utiliser les mêmes composants visuels que le portail.

Pour un contrôle réussi :

```text
PASS
```

Conserver `PASS` en anglais comme convenu.

Pour les autres états visibles :

```text
ÉCHEC
INDISPONIBLE
PLANIFIÉ
CHARGEMENT
```

Utiliser les mêmes couleurs :

```text
success
danger
warning
unknown
```

que le portail.

---

## 9. Rapport Couverture

Conserver toutes les données et fonctionnalités actuellement présentes.

Le rapport reste centré sur :

```text
6 / 6 fonctionnalités couvertes
29 / 29 scénarios automatisés
18 / 18 matrice fonctionnelle
100 % du périmètre fonctionnel défini
```

Les valeurs doivent continuer à être calculées dynamiquement.

Ne pas coder ces chiffres en dur.

Conserver également les informations utiles sur les tags si elles existent.

Ne jamais introduire :

```text
User Stories
Récits utilisateur
Acceptance Criteria
Critères d'acceptation
Requirements
Requirements Coverage
Couverture des exigences
```

---

## 10. Définition de la couverture

Conserver clairement l'explication :

> La couverture fonctionnelle mesure la proportion du périmètre fonctionnel défini disposant de tests Playwright automatisés.

Et :

> Cette métrique ne représente ni une couverture exhaustive de toutes les fonctionnalités possibles de SauceDemo, ni une couverture du code source de l'application.

Cette précision doit rester visible.

---

## 11. Rapport Qualité

Conserver les contrôles réellement présents dans le projet :

```text
ESLint
Prettier
```

Afficher leurs résultats avec les mêmes cartes et badges que le portail.

Exemple :

```text
ESLint
PASS

Prettier
PASS
```

Afficher également le statut global :

```text
PASS
```

lorsque tous les contrôles passent.

Ne pas inventer de contrôles supplémentaires.

---

## 12. Thème clair / sombre

Les trois interfaces doivent avoir exactement le même comportement :

```text
Portail QA
Rapport Couverture
Rapport Qualité
```

Reprendre la logique du portail pour :

- préférence système ;
- thème clair ;
- thème sombre ;
- bouton manuel ;
- persistance du choix.

Utiliser la même clé de stockage si cela permet de conserver le thème lors de la navigation entre les pages.

Objectif :

si l'utilisateur choisit le thème sombre dans le portail puis ouvre le rapport Couverture, le rapport doit également apparaître en thème sombre.

---

## 13. Navigation cohérente

La navigation doit donner l'impression de rester dans la même application.

Depuis le portail :

```text
Portail QA
   ↓
Couverture
```

puis :

```text
Couverture
   ↓
Retour au portail
```

Même principe pour :

```text
Qualité
```

Les boutons et liens doivent avoir exactement le même style.

---

## 14. Langue

Tous les textes visibles doivent être en français.

Exception :

```text
PASS
```

Conserver également les noms propres et technologies :

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

---

## 15. Responsive

Conserver exactement les principes responsive du portail de référence.

Vérifier :

```text
Desktop
Tablette
Mobile
```

Les tableaux du rapport Couverture doivent rester utilisables sur petit écran.

Utiliser un conteneur avec défilement horizontal si nécessaire plutôt que casser le layout.

---

## 16. Accessibilité

Conserver les mêmes principes :

```text
skip-link
focus-visible
aria-label
aria-live
contraste
HTML sémantique
```

---

## 17. Ne pas modifier

Ne modifier aucun :

```text
test Playwright
Page Object
fixture
tag
scénario E2E
plan fonctionnel
```

Ne pas modifier les règles de calcul de couverture.

Ne pas modifier la logique des contrôles ESLint / Prettier.

Ne pas modifier les URLs de publication.

Cette tâche concerne essentiellement la présentation.

---

## 18. Cohérence finale

Les trois pages :

```text
/
 /coverage/
 /quality/
```

doivent partager :

```text
même palette
même typographie
même topbar
même système de boutons
mêmes cartes
mêmes badges
mêmes ombres
mêmes bordures
mêmes espacements
même thème clair/sombre
même comportement responsive
```

Les différences doivent uniquement venir du contenu métier de chaque page.

---

## 19. Validation

Exécuter :

```powershell
npm run coverage:report
npm run quality:report
node --check reporting/coverage/app.js
npm run lint
npm run format:check
npm test
```

Vérifier également que les fichiers suivants sont générés correctement :

```text
coverage-report/index.html
coverage-report/data.json
quality-report/index.html
quality-report/summary.json
```

---

## 20. Vérification visuelle

Comparer localement :

```text
Portail QA
Rapport Couverture
Rapport Qualité
```

Vérifier qu'ils appartiennent visuellement au même produit.

Ne pas considérer la tâche terminée si les rapports utilisent encore une identité graphique différente du portail.

---

## Résultat attendu

Le portail QA, le rapport Couverture et le rapport Qualité doivent former un ensemble visuellement homogène basé sur exactement le même design system.

La modification ne doit avoir aucun impact sur les tests, les métriques ou la pipeline.