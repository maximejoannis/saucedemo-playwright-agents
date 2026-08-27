# Matrice de traçabilité des exigences — SauceDemo

> Cette matrice repose sur des exigences fonctionnelles reconstituées à des fins de démonstration QA. Elle ne représente pas le backlog officiel de SauceDemo.

La chaîne couverte est : **User Story → Acceptance Criterion → Test Case → test Playwright automatisé**. La valeur `—` dans la colonne Acceptance Criterion signale un test de caractérisation qui documente un comportement observé sans en faire une exigence souhaitée.

## Traçabilité fonctionnelle

| User Story    | Acceptance Criterion | Test Case     | Type        | Priorité | Nature                 | Automatisé | Fichier Playwright              |
| ------------- | -------------------- | ------------- | ----------- | -------- | ---------------------- | ---------- | ------------------------------- |
| US-AUTH-01    | AC-AUTH-01           | TC-AUTH-01    | Passant     | P0       | Requirement validation | ✅         | `tests/specs/auth.spec.ts`      |
| US-AUTH-01    | AC-AUTH-02           | TC-AUTH-02    | Non passant | P1       | Requirement validation | ✅         | `tests/specs/auth.spec.ts`      |
| US-AUTH-01    | AC-AUTH-03           | TC-AUTH-03    | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/auth.spec.ts`      |
| US-AUTH-01    | AC-AUTH-04           | TC-AUTH-04    | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/auth.spec.ts`      |
| US-AUTH-01    | AC-AUTH-05           | TC-AUTH-05    | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/auth.spec.ts`      |
| US-AUTH-01    | AC-AUTH-04           | TC-AUTH-06    | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/auth.spec.ts`      |
| US-CAT-01     | AC-CAT-01            | TC-CAT-01     | Passant     | P0       | Requirement validation | ✅         | `tests/specs/inventory.spec.ts` |
| US-CAT-01     | AC-CAT-02            | TC-CAT-02     | Passant     | P1       | Requirement validation | ✅         | `tests/specs/inventory.spec.ts` |
| US-CAT-01     | —                    | TC-CAT-03     | Non passant | P1       | Characterization       | ✅         | `tests/specs/inventory.spec.ts` |
| US-CAT-01     | AC-CAT-03            | TC-CAT-04     | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/inventory.spec.ts` |
| US-SORT-01    | AC-SORT-01           | TC-TRI-01     | Passant     | P1       | Requirement validation | ✅         | `tests/specs/sorting.spec.ts`   |
| US-SORT-01    | AC-SORT-02           | TC-TRI-02     | Passant     | P1       | Requirement validation | ✅         | `tests/specs/sorting.spec.ts`   |
| US-SORT-01    | —                    | TC-TRI-03     | Non passant | P1       | Characterization       | ✅         | `tests/specs/sorting.spec.ts`   |
| US-SORT-01    | —                    | TC-TRI-04     | Erreur      | P1       | Characterization       | ✅         | `tests/specs/sorting.spec.ts`   |
| US-CART-01    | AC-CART-01           | TC-PAN-01     | Passant     | P0       | Requirement validation | ✅         | `tests/specs/cart.spec.ts`      |
| US-CART-01    | AC-CART-02           | TC-PAN-02     | Passant     | P1       | Requirement validation | ✅         | `tests/specs/cart.spec.ts`      |
| US-CART-01    | AC-CART-03           | TC-PAN-03     | Passant     | P1       | Requirement validation | ✅         | `tests/specs/cart.spec.ts`      |
| US-CART-01    | —                    | TC-PAN-04     | Non passant | P1       | Characterization       | ✅         | `tests/specs/cart.spec.ts`      |
| US-CART-01    | —                    | TC-PAN-05     | Erreur      | P1       | Characterization       | ✅         | `tests/specs/cart.spec.ts`      |
| US-CHK-01     | AC-CHK-01            | TC-CHK-01     | Passant     | P0       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-CHK-01     | AC-CHK-02            | TC-CHK-02     | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-CHK-01     | AC-CHK-03            | TC-CHK-03     | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-CHK-01     | AC-CHK-04            | TC-CHK-04     | Erreur      | P1       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-CHK-01     | AC-CHK-05            | TC-CHK-05     | Passant     | P0       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-CHK-01     | AC-CHK-06            | TC-CHK-06     | Passant     | P0       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-CHK-01     | AC-CHK-07            | TC-CHK-07     | Non passant | P1       | Requirement validation | ✅         | `tests/specs/checkout.spec.ts`  |
| US-SESSION-01 | AC-SESSION-01        | TC-SESSION-01 | Passant     | P0       | Requirement validation | ✅         | `tests/specs/session.spec.ts`   |
| US-SESSION-01 | AC-SESSION-02        | TC-SESSION-02 | Non passant | P0       | Requirement validation | ✅         | `tests/specs/session.spec.ts`   |
| US-SESSION-01 | AC-SESSION-03        | TC-SESSION-03 | Erreur      | P0       | Requirement validation | ✅         | `tests/specs/session.spec.ts`   |

## Tests de caractérisation

- `TC-CAT-03` reproduit la substitution du Backpack par un autre produit avec `problem_user` ; il ne valide pas le critère attendu `AC-CAT-02`.
- `TC-TRI-03` et `TC-TRI-04` reproduisent l'absence de tri demandé avec `problem_user` et `error_user` ; ils ne valident pas `AC-SORT-01`.
- `TC-PAN-04` documente que SauceDemo autorise la poursuite d'un checkout avec un panier vide. Le plan ne définit pas le blocage attendu comme une exigence, donc aucun faux critère n'est créé.
- `TC-PAN-05` reproduit l'échec silencieux des ajouts avec `error_user` ; il ne valide pas `AC-CART-01`.

## E2E Traceability

Ces parcours sont une validation transverse et ne sont pas recomptés parmi les 29 cas fonctionnels.

| Parcours E2E                                    | Nature           | User Stories traversées                                     | Fichier Playwright                            |
| ----------------------------------------------- | ---------------- | ----------------------------------------------------------- | --------------------------------------------- |
| E2E-01 — Achat complet de bout en bout          | Positive / Smoke | US-AUTH-01, US-CAT-01, US-CART-01, US-CHK-01, US-SESSION-01 | `tests/specs/e2e/purchase.e2e.spec.ts`        |
| E2E-02 — Checkout interrompu par validation     | Negative / Error | US-AUTH-01, US-CART-01, US-CHK-01                           | `tests/specs/e2e/checkout-errors.e2e.spec.ts` |
| E2E-03 — Session fermée et accès protégé refusé | Negative / Error | US-AUTH-01, US-CAT-01, US-CART-01, US-SESSION-01            | `tests/specs/e2e/session.e2e.spec.ts`         |

## Métriques de couverture

### User Stories

- Nombre total de User Stories : **6**
- User Stories couvertes par au moins un Acceptance Criterion : **6**
- User Stories couvertes par au moins un Test Case automatisé : **6**

### Acceptance Criteria

- Nombre total d'Acceptance Criteria : **23**
- Acceptance Criteria associés à au moins un Test Case : **23**
- Acceptance Criteria associés à au moins un test automatisé : **23**
- **Requirements Coverage : 23 / 23 × 100 = 100 %**

### Test Cases fonctionnels

- Test Cases fonctionnels analysés : **29**
- Test Cases rattachés à des Acceptance Criteria : **24**
- Test Cases de caractérisation rattachés à une User Story sans faux critère : **5**
- Test Cases sans traçabilité : **0**

Le taux de 100 % porte uniquement sur les 23 critères reconstitués et justifiés par le plan existant. Il ne prétend ni mesurer la couverture d'un backlog officiel, indisponible, ni convertir les cinq anomalies caractérisées en comportements souhaités.
