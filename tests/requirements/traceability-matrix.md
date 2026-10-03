# Matrice de traçabilité — SauceDemo

Cette matrice relie chaque cas au besoin, aux critères définis et aux risques produit validés. Le [catalogue des risques](risk-register.md) est la source de référence pour leur définition et leur état de couverture. Le comptage de couverture fonctionnelle porte sur les critères; la couverture des risques est suivie séparément et ne constitue pas un objectif artificiel de 100 % d’automatisation.

| Fonctionnalité | User Story | Critère d’acceptation | Risque(s) produit | Technique | Cas de test | Type | Priorité | Tags |
|---|---|---|---|---|---|---|---|---|
| Authentification | US-01 | AC-AUTH-01 | RISK-AUTH-01 | EP, ST | TC-AUTH-01 | Passant | P0 | `@positive @smoke @regression @auth` |
| Authentification | US-01 | AC-AUTH-02 | RISK-AUTH-02 | EP | TC-AUTH-02 | Non passant | P1 | `@negative @regression @auth` |
| Authentification | US-01 | AC-AUTH-03 | RISK-AUTH-02 | EP | TC-AUTH-03 | Erreur | P1 | `@error @regression @auth` |
| Authentification | US-01 | AC-AUTH-04 | RISK-AUTH-02 | EP | TC-AUTH-04 | Erreur | P1 | `@error @regression @auth` |
| Authentification | US-01 | AC-AUTH-05 | RISK-AUTH-02 | EP | TC-AUTH-05 | Erreur | P1 | `@error @regression @auth` |
| Catalogue | US-02 | AC-CAT-01 | RISK-CAT-01, RISK-CAT-02 | — | TC-CAT-01 | Passant | P0 | `@positive @smoke @regression @catalog` |
| Catalogue | US-02 | AC-CAT-02 | RISK-CAT-01 | EP, SBT | TC-CAT-02 | Passant | P1 | `@positive @regression @catalog` |
| Catalogue | US-02 | AC-CAT-03 | RISK-CAT-01 | EP | TC-CAT-03 | Erreur | P2 | `@error @regression @catalog` |
| Catalogue | US-02 | AC-CAT-04 | RISK-CAT-02 | — | TC-CAT-04 | Erreur | P2 | `@error @regression @catalog` |
| Tri | US-03 | AC-SORT-01 | RISK-SORT-01 | — | TC-TRI-01 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-02 | RISK-SORT-01 | — | TC-TRI-02 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-03 | RISK-SORT-01 | — | TC-TRI-03 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-04 | RISK-SORT-01 | — | TC-TRI-04 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-05 | RISK-SORT-01 | — | TC-TRI-05 | Erreur | P2 | `@error @regression @sorting` |
| Tri | US-03 | AC-SORT-06 | RISK-SORT-01 | — | TC-TRI-06 | Erreur | P2 | `@error @regression @sorting` |
| Panier | US-04 | AC-CART-01 | RISK-CART-01 | BVA, ST, SBT | TC-PAN-01 | Passant | P0 | `@positive @smoke @regression @cart` |
| Panier | US-04 | AC-CART-02 | RISK-CART-01 | ST | TC-PAN-02 | Passant | P1 | `@positive @regression @cart` |
| Panier | US-04 | AC-CART-03 | RISK-CART-01 | ST, SBT | TC-PAN-03 | Passant | P1 | `@positive @regression @cart` |
| Panier | US-04 | AC-CART-04 | RISK-CHK-03 | BVA | TC-PAN-04 | Non passant | P1 | `@negative @regression @cart` |
| Panier | US-04 | AC-CART-05 | RISK-CART-01 | — | TC-PAN-05 | Erreur | P1 | `@error @regression @cart` |
| Panier | US-04 | AC-CART-05 | RISK-CART-01 | — | TC-PAN-06 | Erreur | P1 | `@error @regression @cart` |
| Checkout | US-05 | AC-CHK-01 | RISK-CHK-01 | EP, BVA, DT, ST, SBT | TC-CHK-01 | Passant | P0 | `@positive @smoke @regression @checkout` |
| Checkout | US-05 | AC-CHK-02 | RISK-CHK-02 | — | TC-CHK-02 | Passant | P0 | `@positive @smoke @regression @checkout` |
| Checkout | US-05 | AC-CHK-03 | RISK-CHK-04 | EP, DT | TC-CHK-03 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-04 | RISK-CHK-04 | EP, DT | TC-CHK-04 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-05 | RISK-CHK-04 | EP, DT | TC-CHK-05 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-06 | RISK-CHK-03 | BVA, DT, SBT | TC-CHK-06 | Non passant | P1 | `@negative @regression @checkout` |
| Checkout | US-05 | AC-CHK-07 | RISK-CHK-01, RISK-CHK-04 | — | TC-CHK-07 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-08 | RISK-CHK-01 | ST | TC-CHK-08 | Erreur | P1 | `@error @regression @checkout` |
| Session | US-06 | AC-SESSION-01 | RISK-CART-02, RISK-SESSION-01 | ST | TC-SESSION-01 | Passant | P0 | `@positive @smoke @regression @session` |
| Session | US-06 | AC-SESSION-02 | RISK-SESSION-02 | ST | TC-SESSION-02 | Passant | P0 | `@positive @smoke @regression @session` |
| Session | US-06 | AC-SESSION-03 | RISK-AUTH-02, RISK-SESSION-02 | ST | TC-SESSION-03 | Erreur | P0 | `@error @regression @session` |
| Session | US-06 | AC-SESSION-04 | RISK-SESSION-03 | ST | TC-SESSION-04 | Passant | P1 | `@positive @regression @session` |

## Contrôle de couverture

| Mesure | Résultat |
|---|---:|
| Critères définis | 32 |
| Critères couverts par au moins un cas | 32 |
| Critères non couverts | 0 |
| Taux de couverture | **100 %** |
| Cas Smoke | 7 |
| Cas Regression | 33 |
| Risques produit définis | 14 |
| Risques reliés à au moins un cas automatisé | 14 |
| Risques couverts | 9 |
| Risques partiellement couverts | 5 |
| Risques non couverts | 0 |
| Risques acceptés / hors périmètre | 0 |
| Risques critiques ou élevés couverts par la Smoke | 7 / 9 |
| Risques critiques ou élevés avec plusieurs défenses indépendantes | 6 / 9 |
| Risques critiques ou élevés avec une seule défense indépendante | 3 / 9 |

**Critères non couverts :** aucun.

## Contrôle des références

- 6 fonctionnalités possèdent chacune exactement une User Story.
- 6 User Stories possèdent chacune de 4 à 8 critères.
- 32 critères uniques sont tous couverts; AC-CART-05 est volontairement couvert par deux comptes spéciaux.
- 33 cas uniques référencent tous une User Story, au moins un critère, au moins un risque validé, un type, une priorité et des tags.
- Les 14 risques du registre sont reliés à au moins un TC; cela mesure la traçabilité, pas la suffisance de leur couverture ni l’automatisation de leurs gaps résiduels.
- Les métriques de risque sont distinctes du taux de couverture fonctionnelle : 32/32 AC couverts ne signifie pas que les 14 risques sont entièrement maîtrisés.
- Aucun ID dupliqué, aucune référence orpheline et aucun cas absent de la matrice.

## Couverture exploratoire

Cette vue relie les risques aux questions d’investigation planifiées. Elle est indépendante de la couverture fonctionnelle scriptée : un charter `À explorer` n’est ni un TC, ni une exécution, ni une preuve de maîtrise du risque.

| Charter | Domaine | Risque(s) exploré(s) | Statut |
|---|---|---|---|
| EXP-AUTH-01 | Authentification / Session | RISK-AUTH-02, RISK-SESSION-02 | À explorer |
| EXP-CAT-01 | Catalogue | RISK-CAT-01, RISK-CAT-02 | À explorer |
| EXP-SORT-01 | Tri | RISK-SORT-01 | À explorer |
| EXP-CART-01 | Panier | RISK-CART-01, RISK-CART-02, RISK-SESSION-01 | À explorer |
| EXP-CHK-01 | Checkout | RISK-CART-01, RISK-CHK-01, RISK-CHK-02, RISK-CHK-03, RISK-SESSION-01 | À explorer |
| EXP-CHK-02 | Checkout | RISK-CHK-01, RISK-CHK-03 | À explorer |
| EXP-CHK-03 | Checkout / Données de formulaire | RISK-CHK-04 | À explorer |
| EXP-SESSION-01 | Session | RISK-CART-02, RISK-SESSION-01, RISK-SESSION-02, RISK-SESSION-03 | À explorer |

| Mesure exploratoire | Résultat |
|---|---:|
| Charters identifiés | 8 |
| Sessions exploratoires terminées | 0 |
| Risques liés à au moins une question exploratoire | 13 / 14 |

La présence d’un lien `RISK → EXP` signifie qu’une investigation est prévue. Elle ne change ni l’état de couverture du registre, ni les 32 AC couverts, ni les 33 TC automatisés, ni les 36 tests Playwright.
