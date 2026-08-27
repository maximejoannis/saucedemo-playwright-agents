# Réorganisation de l'architecture Playwright

## Objectif

Réorganise le projet SauceDemo sans modifier le comportement fonctionnel des tests existants.

Tous les tests passent actuellement sur Chromium.

La nouvelle organisation doit placer :

- le dossier `specs` sous `tests` ;
- tous les fichiers de tests `.spec.ts` dans `tests/specs/`.

## Structure cible

La structure principale attendue est :

```text
tests/
├── specs/
│   ├── plan-tests-fonctionnels-saucedemo.md
│   ├── auth.spec.ts
│   ├── inventory.spec.ts
│   ├── sorting.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── session.spec.ts
│
├── pages/
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
│
└── fixtures/
    └── test-fixtures.ts