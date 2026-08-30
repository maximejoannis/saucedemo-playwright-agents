# Matrice de traçabilité — SauceDemo

Cette matrice relie chaque cas au besoin et aux critères définis. Le comptage de couverture porte sur les critères fonctionnels, pas sur le code.

| Fonctionnalité | User Story | Critère d’acceptation | Cas de test | Type | Priorité | Tags |
|---|---|---|---|---|---|---|
| Authentification | US-01 | AC-AUTH-01 | TC-AUTH-01 | Passant | P0 | `@positive @smoke @regression @auth` |
| Authentification | US-01 | AC-AUTH-02 | TC-AUTH-02 | Non passant | P1 | `@negative @regression @auth` |
| Authentification | US-01 | AC-AUTH-03 | TC-AUTH-03 | Erreur | P1 | `@error @regression @auth` |
| Authentification | US-01 | AC-AUTH-04 | TC-AUTH-04 | Erreur | P1 | `@error @regression @auth` |
| Authentification | US-01 | AC-AUTH-05 | TC-AUTH-05 | Erreur | P1 | `@error @regression @auth` |
| Catalogue | US-02 | AC-CAT-01 | TC-CAT-01 | Passant | P1 | `@positive @smoke @regression @catalog` |
| Catalogue | US-02 | AC-CAT-02 | TC-CAT-02 | Passant | P1 | `@positive @regression @catalog` |
| Catalogue | US-02 | AC-CAT-03 | TC-CAT-03 | Erreur | P2 | `@error @regression @catalog` |
| Catalogue | US-02 | AC-CAT-04 | TC-CAT-04 | Erreur | P1 | `@error @regression @catalog` |
| Tri | US-03 | AC-SORT-01 | TC-TRI-01 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-02 | TC-TRI-02 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-03 | TC-TRI-03 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-04 | TC-TRI-04 | Passant | P1 | `@positive @regression @sorting` |
| Tri | US-03 | AC-SORT-05 | TC-TRI-05 | Erreur | P1 | `@error @regression @sorting` |
| Tri | US-03 | AC-SORT-06 | TC-TRI-06 | Erreur | P1 | `@error @regression @sorting` |
| Panier | US-04 | AC-CART-01 | TC-PAN-01 | Passant | P0 | `@positive @smoke @regression @cart` |
| Panier | US-04 | AC-CART-02 | TC-PAN-02 | Passant | P1 | `@positive @regression @cart` |
| Panier | US-04 | AC-CART-03 | TC-PAN-03 | Passant | P1 | `@positive @regression @cart` |
| Panier | US-04 | AC-CART-04 | TC-PAN-04 | Non passant | P1 | `@negative @regression @cart` |
| Panier | US-04 | AC-CART-05 | TC-PAN-05 | Erreur | P1 | `@error @regression @cart` |
| Panier | US-04 | AC-CART-05 | TC-PAN-06 | Erreur | P1 | `@error @regression @cart` |
| Checkout | US-05 | AC-CHK-01 | TC-CHK-01 | Passant | P0 | `@positive @smoke @regression @checkout` |
| Checkout | US-05 | AC-CHK-02 | TC-CHK-02 | Passant | P1 | `@positive @regression @checkout` |
| Checkout | US-05 | AC-CHK-03 | TC-CHK-03 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-04 | TC-CHK-04 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-05 | TC-CHK-05 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-06 | TC-CHK-06 | Non passant | P2 | `@negative @regression @checkout` |
| Checkout | US-05 | AC-CHK-07 | TC-CHK-07 | Erreur | P1 | `@error @regression @checkout` |
| Checkout | US-05 | AC-CHK-08 | TC-CHK-08 | Erreur | P1 | `@error @regression @checkout` |
| Session | US-06 | AC-SESSION-01 | TC-SESSION-01 | Passant | P1 | `@positive @regression @session` |
| Session | US-06 | AC-SESSION-02 | TC-SESSION-02 | Passant | P0 | `@positive @smoke @regression @session` |
| Session | US-06 | AC-SESSION-03 | TC-SESSION-03 | Erreur | P0 | `@error @regression @session` |
| Session | US-06 | AC-SESSION-04 | TC-SESSION-04 | Passant | P1 | `@positive @regression @session` |

## Contrôle de couverture

| Mesure | Résultat |
|---|---:|
| Critères définis | 32 |
| Critères couverts par au moins un cas | 32 |
| Critères non couverts | 0 |
| Taux de couverture | **100 %** |
| Cas Smoke | 5 |
| Cas Regression | 33 |

**Critères non couverts :** aucun.

## Contrôle des références

- 6 fonctionnalités possèdent chacune exactement une User Story.
- 6 User Stories possèdent chacune de 4 à 8 critères.
- 32 critères uniques sont tous couverts; AC-CART-05 est volontairement couvert par deux comptes spéciaux.
- 33 cas uniques référencent tous une User Story, au moins un critère, un type, une priorité et des tags.
- Aucun ID dupliqué, aucune référence orpheline et aucun cas absent de la matrice.
