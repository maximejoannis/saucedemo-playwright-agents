# Ajouter ESLint et Prettier au projet Playwright SauceDemo

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Objectif

Ajouter ESLint et Prettier au projet Playwright TypeScript existant sans modifier le comportement fonctionnel des tests.

Tous les tests passent actuellement sur Chromium.

L'objectif est d'améliorer :

- la qualité du code ;
- la cohérence du style ;
- la détection des erreurs statiques ;
- le formatage automatique.

---

## 1. Installer les dépendances nécessaires

Ajoute uniquement les dépendances de développement nécessaires pour :

- ESLint ;
- TypeScript + ESLint ;
- Prettier ;
- compatibilité ESLint / Prettier.

Privilégie la configuration ESLint moderne dite "flat config".

Ne modifie pas les versions de Playwright ou TypeScript existantes sans nécessité.

---

## 2. Configuration ESLint

Crée une configuration ESLint adaptée à :

- TypeScript ;
- Playwright Test ;
- Node.js ;
- fichiers `.ts`.

Utilise une configuration moderne de type :

`eslint.config.js`

ou :

`eslint.config.mjs`

selon ce qui est le plus approprié dans le projet.

Active les règles TypeScript utiles sans rendre la configuration inutilement stricte.

---

## 3. Règles Playwright

Ajoute le plugin ESLint officiel ou reconnu pour Playwright si nécessaire.

Active les règles utiles permettant notamment de détecter :

- `test.only` laissé accidentellement ;
- mauvaises pratiques Playwright ;
- attentes manquantes ou incorrectes lorsque détectables ;
- usages problématiques dans les tests.

Ne crée pas de conflit avec les bonnes pratiques déjà appliquées dans le projet.

---

## 4. Configuration Prettier

Crée :

`.prettierrc`

ou une configuration équivalente.

Utilise une configuration simple et standard.

Exemple acceptable :

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120
}