# Migration du reporting vers l'architecture de référence

## Agent à utiliser

Utilise l'agent `playwright_test_generator`.

## Objectif

Migrer proprement l'implémentation actuelle du reporting vers l'architecture utilisée dans le projet de référence :

`maximejoannis/saucedemo-playwright-automation`

Ne recrée pas inutilement ce qui existe déjà.

Réutilise au maximum :

- le script de génération de couverture existant ;
- le HTML existant ;
- le CSS existant ;
- le JavaScript existant ;
- les métriques déjà calculées ;
- les scripts npm déjà ajoutés.

L'objectif est principalement de réorganiser les fichiers et séparer :

- les sources/templates de reporting ;
- les rapports générés.

---

## 1. Architecture cible

La structure source attendue est :

```text
reporting/
├── coverage/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── qa-portal/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── scripts/
    ├── generate-coverage-report.js
    └── generate-quality-report.js