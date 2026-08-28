# Simplifier le projet autour de la couverture fonctionnelle

## Agent

Utilise `playwright_test_planner`.

## Objectif

Revenir à une approche simple et cohérente avec la nature du projet SauceDemo.

SauceDemo est une application publique d'entraînement.

Nous ne disposons pas de son backlog produit officiel.

Le projet doit donc se concentrer sur :

- les fonctionnalités principales identifiées ;
- le plan de tests fonctionnels ;
- les scénarios automatisés ;
- les tests E2E ;
- la couverture du périmètre fonctionnel défini.

Ne pas utiliser de User Stories ou de critères d'acceptation reconstitués.

---

## 1. Supprimer la couche Requirements

Supprimer :

tests/specs/requirements/user-stories.md
tests/specs/requirements/traceability-matrix.md

Si le dossier devient vide, supprimer également :

tests/specs/requirements/

---

## 2. Ne pas modifier le plan fonctionnel

Conserver :

tests/specs/plan-tests-fonctionnels-saucedemo.md

Il reste la référence documentaire principale du périmètre fonctionnel.

---

## 3. Ne pas modifier les tests

Ne modifier aucun :

- test fonctionnel ;
- test E2E ;
- Page Object ;
- fixture ;
- tag Playwright.

Les 29 scénarios fonctionnels et les 3 E2E existants doivent rester inchangés.

---

## 4. Reporting

Vérifier le reporting existant.

Il doit rester centré sur :

- fonctionnalités couvertes ;
- scénarios fonctionnels automatisés ;
- matrice Passant / Non passant / Erreur ;
- tags ;
- E2E ;
- résultats d'exécution.

Supprimer toute référence éventuelle à :

- User Stories ;
- Récits utilisateur ;
- Acceptance Criteria ;
- Critères d'acceptation ;
- Requirements ;
- Requirements Coverage ;
- Couverture des exigences ;
- Requirements Traceability.

Ne pas modifier les calculs fonctionnels existants.

---

## 5. Portail QA

Le portail QA doit présenter principalement :

Couverture fonctionnelle
Scénarios automatisés
Matrice fonctionnelle
Tests E2E
Qualité
Playwright
Allure

Tous les textes visibles doivent rester en français, à l'exception de :

PASS

et des noms propres / technologies :

SauceDemo
Playwright
Allure
ESLint
Prettier
GitHub
GitHub Actions
GitHub Pages
Chromium

---

## 6. Définition de la couverture

Conserver une formulation claire :

> La couverture fonctionnelle mesure la proportion du périmètre fonctionnel défini disposant de tests Playwright automatisés.

Préciser également :

> Cette métrique ne représente ni une couverture exhaustive de toutes les fonctionnalités possibles de SauceDemo, ni une couverture du code source de l'application.

---

## 7. Métriques

Les métriques doivent continuer à être calculées depuis le plan et les tests.

Ne pas coder les valeurs en dur.

L'état actuel attendu est :

Fonctionnalités couvertes : 6 / 6
Scénarios automatisés : 29 / 29
Matrice fonctionnelle : 18 / 18
E2E : 3

Ces valeurs servent uniquement à vérifier le résultat.

---

## 8. README

Si le README contient déjà des références aux User Stories, critères d'acceptation ou Requirements Coverage, les supprimer.

Présenter plutôt le projet comme une automatisation des fonctionnalités principales de SauceDemo à partir d'un plan fonctionnel.

Ne pas supprimer les autres informations du README.

---

## 9. Workflow

Ne modifier `.github/workflows/playwright.yml` que si des données Requirements y ont déjà été ajoutées.

Sinon, ne pas y toucher.

---

## 10. Validation

Exécuter :

npm run coverage:report
npm run lint
npm run format:check
npm test

Vérifier que les 32 tests Playwright restent passants.

---

## 11. Résultat

À la fin, indiquer :

- fichiers supprimés ;
- fichiers éventuellement modifiés ;
- références Requirements supprimées ;
- métriques fonctionnelles conservées ;
- résultat des validations.

Confirmer explicitement :

> Le projet est désormais centré sur la couverture automatisée des fonctionnalités principales identifiées de SauceDemo, sans reconstituer artificiellement un backlog produit.