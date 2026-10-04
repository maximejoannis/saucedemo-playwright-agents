# Catalogue des risques produit

## Objectif

Ce document est la source de référence unique des risques produit identifiés pour le périmètre SauceDemo. Il relie chaque menace au besoin métier, à la User Story, aux Acceptance Criteria, aux Test Cases et aux défenses QA qui permettent d’en détecter la matérialisation.

Un lien vers un TC ne suffit pas à déclarer un risque couvert : le scénario doit réellement exercer le comportement attendu ou le mode de défaillance concerné. Les états ci-dessous évaluent donc la pertinence et la profondeur de la défense, sans chercher un taux artificiel de 100 %.

Ce registre ne porte aucune sévérité S1 à S4. Le risque est potentiel et évalué par Probabilité × Impact; la sévérité reste réservée à un défaut produit réellement constaté. La priorité P0/P1/P2 demeure une propriété du Test Case.

## Convention des identifiants

Format : `RISK-<DOMAINE>-<NN>`. Le suffixe est stable et n’est incrémenté que pour un scénario de risque durable ayant une conséquence métier distincte.

| Préfixe | Domaine |
|---|---|
| `AUTH` | Authentification et contrôle initial de l’accès |
| `CAT` | Catalogue et information produit |
| `SORT` | Tri du catalogue |
| `CART` | Constitution et intégrité du panier |
| `CHK` | Checkout, commande et calcul financier |
| `SESSION` | Conservation, terminaison et réinitialisation de session |

## Méthode d’évaluation

Le registre reprend sans modification la méthode du plan de test :

- Probabilité : 1 = Faible, 2 = Moyenne, 3 = Élevée;
- Impact : 1 = Faible, 2 = Moyen, 3 = Fort;
- Score = Probabilité × Impact;
- Niveau : 1–2 = Faible, 3–4 = Moyen, 6 = Élevé, 9 = Critique.

Le niveau de risque oriente la réponse QA. Il ne détermine automatiquement ni la priorité d’un TC, ni la sévérité d’un éventuel défaut.

En l’absence de données de production ou de télémétrie SauceDemo, la probabilité est une estimation QA documentée et non une fréquence mesurée. Elle doit être réévaluée si des données d’usage ou d’incident fiables deviennent disponibles, sans être déduite du nombre de tests, de leur priorité ou de leur résultat.

## États de couverture

| État | Définition |
|---|---|
| Couvert | Une ou plusieurs défenses pertinentes exercent le risque sur son périmètre défini, avec une référence attendue capable de détecter sa matérialisation. Un risque résiduel peut néanmoins subsister. |
| Partiellement couvert | Une défense pertinente existe, mais une condition, une transition, une règle métier ou une classe de données significative reste non testée ou non définie. |
| Non couvert | Aucune défense actuelle ne permet de détecter de façon crédible la matérialisation du risque. |
| Accepté / hors périmètre | Le risque est identifié mais sa couverture n’est pas prévue dans le périmètre actuel à la suite d’une décision explicite. |

Les campagnes Smoke et Regression, ou plusieurs tests répétant la même référence attendue, ne sont pas comptés comme défenses indépendantes à eux seuls. L’indépendance vient d’un niveau ou d’un mode de détection différent : contrôle fonctionnel ciblé, test négatif, transition d’état, E2E ou exploration.

## Catalogue

| ID | Fonctionnalité | Risque | Conséquence | US | AC | Probabilité | Impact | Niveau | Réponse QA | TC | État | Risque résiduel / remarque |
|---|---|---|---|---|---|---:|---:|---|---|---|---|---|
| RISK-AUTH-01 | Authentification | Un utilisateur légitime ne peut pas s’authentifier. | Accès au service marchand et achat entièrement bloqués. | US-01 | AC-AUTH-01 | 3 | 3 | Critique (9) | Smoke + régression nominale; défense E2E transverse. | TC-AUTH-01 | Couvert | Un seul compte nominal exercé. |
| RISK-AUTH-02 | Authentification | Des identifiants invalides ou un compte verrouillé obtiennent un accès. | Accès non autorisé au domaine marchand ou aux données de l’utilisateur précédent. | US-01, US-06 | AC-AUTH-02, AC-AUTH-03, AC-AUTH-04, AC-AUTH-05, AC-SESSION-03 | 2 | 3 | Élevé (6) | Tests négatifs à l’entrée et transitions refusées vers Cart. | TC-AUTH-02, TC-AUTH-03, TC-AUTH-04, TC-AUTH-05, TC-SESSION-03, TC-SESSION-05 | Couvert | Seule Cart est contrôlée; les autres routes ne possèdent pas de politique générale spécifiée. |
| RISK-CAT-01 | Catalogue | Produit, description ou prix absent, erroné ou incohérent entre liste et fiche. | Mauvaise décision d’achat et montant attendu trompeur. | US-02 | AC-CAT-01, AC-CAT-02, AC-CAT-03 | 2 | 2 | Moyen (4) | Régression des six produits et cohérence liste/fiche. | TC-CAT-01, TC-CAT-02, TC-CAT-03 | Couvert | Contenu marketing non validé exhaustivement. |
| RISK-CAT-02 | Catalogue | Image incorrecte ou indisponible. | Compréhension du produit dégradée sans blocage du parcours. | US-02 | AC-CAT-01, AC-CAT-04 | 2 | 1 | Faible (2) | Contrôle nominal ciblé, caractérisation séparée et vérification humaine de la correspondance produit/image. | TC-CAT-01, TC-CAT-04 | Partiellement couvert | Les sources absentes, dupliquées ou `sl-404` sont détectables; la justesse sémantique d’une image valide n’est pas démontrée. |
| RISK-SORT-01 | Tri | Le catalogue n’est pas ordonné selon le nom ou le prix choisi. | Recherche moins efficace sans altération du panier ou du montant. | US-03 | AC-SORT-01, AC-SORT-02, AC-SORT-03, AC-SORT-04, AC-SORT-05, AC-SORT-06 | 2 | 1 | Faible (2) | Régression automatisée des quatre ordres; caractérisations hors Smoke. | TC-TRI-01, TC-TRI-02, TC-TRI-03, TC-TRI-04, TC-TRI-05, TC-TRI-06 | Couvert | Collation internationale et catalogues volumineux non couverts. |
| RISK-CART-01 | Panier | Un ajout ou retrait échoue, ou un article est perdu, dupliqué ou remplacé pendant la navigation. | Commande incorrecte, abandon ou facturation potentielle d’un mauvais contenu. | US-04 | AC-CART-01, AC-CART-02, AC-CART-03, AC-CART-05 | 2 | 3 | Élevé (6) | Smoke sur l’ajout; transitions multi-articles; E2E d’achat. | TC-PAN-01, TC-PAN-02, TC-PAN-03, TC-PAN-05, TC-PAN-06 | Couvert | Volumes et modifications concurrentes non couverts. |
| RISK-CART-02 | Panier | Le panier disparaît au rafraîchissement ou réapparaît dans une session ultérieure de façon inattendue. | Perte de sélection ou exposition d’un état d’achat résiduel. | US-04, US-06 | AC-SESSION-01 | 2 | 3 | Élevé (6) | Transition après rafraîchissement; clarification inter-session requise. | TC-SESSION-01 | Partiellement couvert | Logout/relogin, changement d’utilisateur et nouveau contexte non testés. |
| RISK-CHK-01 | Checkout | Une commande valide ne peut pas être finalisée ou aucune confirmation n’est produite. | Conversion bloquée ou statut de commande ambigu. | US-05 | AC-CHK-01, AC-CHK-07, AC-CHK-08 | 3 | 3 | Critique (9) | Smoke + régression du parcours complet; E2E d’achat. | TC-CHK-01, TC-CHK-07, TC-CHK-08 | Couvert | Statut persistant hors page de confirmation non vérifié. |
| RISK-CHK-02 | Checkout | Sous-total, taxe, total ou lignes du récapitulatif incorrects. | Montant annoncé ou facturé incorrect et risque financier/réglementaire. | US-05 | AC-CHK-02 | 2 | 3 | Élevé (6) | Référence arithmétique indépendante pour les lignes, le sous-total et la cohérence total = sous-total + taxe; règle de taxe à clarifier. | TC-CHK-02 | Partiellement couvert | Le taux ou la formule de taxe et les règles d’arrondi ne sont pas spécifiés; la valeur exacte de taxe n’a donc pas de référence métier indépendante. |
| RISK-CHK-03 | Checkout | Une commande vide peut être finalisée. | Données parasites et métriques de commande faussées. | US-04, US-05 | AC-CART-04, AC-CHK-06 | 3 | 2 | Élevé (6) | Caractérisation négative; décision produit sur le blocage souhaité. | TC-PAN-04, TC-CHK-06 | Partiellement couvert | Comportement détecté mais attendu métier non arbitré. |
| RISK-CHK-04 | Checkout | Des données de livraison obligatoires manquent mais le parcours continue, ou une saisie valide est rejetée. | Livraison impossible ou abandon d’une saisie pourtant valide. | US-05 | AC-CHK-03, AC-CHK-04, AC-CHK-05, AC-CHK-07 | 2 | 2 | Moyen (4) | Tests négatifs des champs requis et exploration des classes de saisie. | TC-CHK-03, TC-CHK-04, TC-CHK-05, TC-CHK-07 | Partiellement couvert | Formats, longueurs et validité postale non définis. |
| RISK-SESSION-01 | Session | La session active est perdue ou son contexte est mal conservé pendant le parcours. | Interruption, perte du panier et abandon. | US-06 | AC-SESSION-01 | 2 | 3 | Élevé (6) | Smoke après rafraîchissement; exploration du cycle de vie. | TC-SESSION-01 | Partiellement couvert | Cart, Checkout, expiration et reprise non couverts. |
| RISK-SESSION-02 | Session | Logout ne termine pas réellement la session ou une route protégée reste accessible. | Actions ou données accessibles à l’utilisateur suivant. | US-01, US-06 | AC-SESSION-02, AC-SESSION-03 | 2 | 3 | Élevé (6) | Smoke logout, refus de Cart après logout et depuis une session vierge, E2E de protection. | TC-SESSION-02, TC-SESSION-03, TC-SESSION-05 | Partiellement couvert | Seule la route Cart est contrôlée; la politique des autres routes reste inconnue. |
| RISK-SESSION-03 | Session | Reset App State ne vide pas exactement le panier ou déconnecte l’utilisateur. | État d’achat résiduel ou interruption évitable. | US-06 | AC-SESSION-04 | 1 | 2 | Faible (2) | Test automatisé de transition d’état. | TC-SESSION-04 | Couvert | Réinitialisation testée avec un seul article. |

## Fiches détaillées des risques critiques et élevés

### RISK-AUTH-01 — Accès légitime impossible

- **Besoin menacé :** permettre à un utilisateur valide d’accéder au catalogue (US-01).
- **Conséquence :** accès au service marchand et achat entièrement bloqués.
- **Réponse QA :** Smoke et régression automatisée de la connexion nominale; parcours E2E d’achat comme défense transverse.
- **Défense effective :** TC-AUTH-01 détecte directement l’échec de connexion et confirme l’accès à Inventory. E2E-01 réutilise le même compte et le même mécanisme d’authentification avant de poursuivre le parcours : il renforce la confiance transverse, mais ne constitue pas une seconde défense indépendante contre ce risque.
- **Risque résiduel :** un seul compte nominal et aucune variation de politique d’authentification ne sont couverts.

### RISK-AUTH-02 — Accès indu

- **Besoin menacé :** contrôler l’accès et empêcher la réutilisation d’une session terminée (US-01, US-06).
- **Conséquence :** accès non autorisé au domaine marchand ou aux données de l’utilisateur précédent.
- **Réponse QA :** tests négatifs des identifiants, champs obligatoires et compte verrouillé; transition logout puis accès direct; E2E de protection de session.
- **Défenses effectives :** TC-AUTH-02/03/04/05 couvrent plusieurs refus à l’entrée; TC-SESSION-03 exerce la frontière après logout; TC-SESSION-05 contrôle Cart depuis une session vierge; E2E-03 assemble logout et refus de route.
- **Risque résiduel :** seule la route Cart est contrôlée; les autres routes ne possèdent pas de politique générale spécifiée.

### RISK-CART-01 — Intégrité du panier

- **Besoin menacé :** constituer et revoir une sélection conforme à l’intention d’achat (US-04).
- **Conséquence :** commande incorrecte, abandon ou facturation potentielle d’un mauvais contenu.
- **Réponse QA :** Smoke sur l’ajout; tests de transitions ajout/retrait/navigation multi-articles; E2E d’achat.
- **Défenses effectives :** TC-PAN-01 contrôle les représentations de l’ajout; TC-PAN-02 le retrait; TC-PAN-03 la conservation, l’unicité et la non-réapparition; E2E-01 vérifie la transmission au checkout. TC-PAN-05/06 caractérisent des modes de défaillance spéciaux mais ne remplacent pas les défenses nominales.
- **Risque résiduel :** combinaisons de volumes et modifications concurrentes non couvertes.

### RISK-CART-02 — Persistance incorrecte du panier

- **Besoin menacé :** conserver le contexte d’achat pendant la session sans exposer un état résiduel inattendu (US-04, US-06).
- **Conséquence :** perte de sélection ou exposition du panier à un utilisateur/session ultérieur.
- **Réponse QA :** test de transition après rafraîchissement; clarification puis test inter-session/inter-utilisateur.
- **Défense effective :** TC-SESSION-01 vérifie un article après rafraîchissement d’Inventory.
- **État partiel :** logout/relogin, changement d’utilisateur et nouveau contexte ne sont ni spécifiés ni testés. Il s’agit d’un risque élevé avec une seule défense.

### RISK-CHK-01 — Finalisation impossible

- **Besoin menacé :** terminer l’achat et obtenir une confirmation non ambiguë (US-05).
- **Conséquence :** conversion bloquée ou statut de commande incertain.
- **Réponse QA :** Smoke et régression du parcours complet; E2E d’achat; caractérisation séparée des comptes spéciaux.
- **Défense effective :** TC-CHK-01 contrôle directement le tunnel nominal jusqu’à la confirmation. E2E-01 rejoue la même finalisation avec le même article, les mêmes données client et la même référence de confirmation : il apporte un contrôle transverse, mais pas un mécanisme de détection indépendant. TC-CHK-07/08 illustrent des modes de défaillance spéciaux, sans définir l’attendu métier nominal.
- **Risque résiduel :** absence de vérification d’un statut persistant de commande en dehors de la page de confirmation.

### RISK-CHK-02 — Montant incorrect

- **Besoin menacé :** vérifier un montant de commande exact avant confirmation (US-05).
- **Conséquence :** montant annoncé ou facturé incorrect, perte de confiance et risque financier/réglementaire.
- **Réponse QA :** référence arithmétique indépendante sur plusieurs articles pour les lignes, le sous-total et la relation total = sous-total + taxe; contrôle transverse sur un article dans E2E-01; clarification métier de la taxe avant toute BVA d’arrondi.
- **Défense effective :** TC-CHK-02 compare chaque ligne, recalcule le sous-total et contrôle la relation entre sous-total, taxe affichée et total. E2E-01 répète cette cohérence sur un article avec des valeurs attendues fixes; cette variante de données ne crée pas un mécanisme de détection indépendant. La valeur de taxe observée sert de baseline de régression, pas de démonstration indépendante de sa justesse métier.
- **État partiel :** le taux ou la formule de taxe, les règles d’arrondi et les partitions de montant ne sont pas spécifiés. Les contrôles actuels peuvent détecter une variation ou une incohérence arithmétique, mais pas prouver que la taxe calculée est correcte.

### RISK-CHK-03 — Commande vide finalisée

- **Besoin menacé :** finaliser une commande ayant une valeur métier (US-04, US-05).
- **Conséquence :** données parasites et métriques de commande faussées.
- **Réponse QA :** caractérisation négative des étapes panier et checkout; décision produit sur le blocage souhaité.
- **Défense effective :** TC-PAN-04 et TC-CHK-06 couvrent deux étapes d’un même parcours vide; ils constituent une seule chaîne de défense, pas deux défenses indépendantes.
- **État partiel :** le comportement est détecté, mais aucun AC ne précise encore s’il doit être bloqué. Risque élevé avec une seule chaîne de défense.

### RISK-CHK-04 — Validation de livraison inadéquate

- **Besoin menacé :** fournir des informations permettant la livraison et poursuivre avec des données acceptables (US-05).
- **Conséquence :** livraison impossible ou abandon d’une saisie pourtant valide.
- **Réponse QA :** tests négatifs des champs obligatoires et exploration ciblée des classes de saisie.
- **Défenses effectives :** TC-CHK-03/04/05 détectent chaque champ absent; E2E-02 contrôle une validation au sein du parcours. TC-CHK-07 reste une caractérisation spéciale.
- **État partiel :** formats, longueurs, espaces, caractères spéciaux et validité du code postal ne sont pas définis.

### RISK-SESSION-01 — Perte de session active

- **Besoin menacé :** conserver le contexte utilisateur pendant le parcours (US-06).
- **Conséquence :** interruption, perte de panier et abandon.
- **Réponse QA :** Smoke après rafraîchissement; exploration des transitions prolongées et clarification de l’expiration.
- **Défense effective :** TC-SESSION-01 vérifie session et panier après rafraîchissement d’Inventory.
- **État partiel :** Cart, Checkout, expiration et reprise après interruption ne sont pas couverts. Risque élevé avec une seule défense.

### RISK-SESSION-02 — Session non terminée ou route exposée

- **Besoin menacé :** terminer explicitement l’accès et protéger les routes authentifiées (US-06).
- **Conséquence :** actions ou données accessibles à l’utilisateur suivant.
- **Réponse QA :** Smoke du logout, test négatif d’accès direct et E2E de protection; extension conditionnée à l’inventaire des routes sensibles.
- **Défenses effectives :** TC-SESSION-02 contrôle la terminaison visible; TC-SESSION-03 refuse `/cart.html` après Logout; TC-SESSION-05 la refuse depuis une session vierge; E2E-03 assemble les deux premières transitions.
- **État partiel :** seule Cart est exercée, après logout et depuis une session jamais authentifiée; les autres routes ne sont pas spécifiées.

## Vue consolidée des défenses QA

Cette vue réconcilie le catalogue et la matrice sans compter les campagnes comme des défenses supplémentaires. Le nombre indique des signaux fonctionnellement distincts actuellement exécutables. Un E2E qui enchaîne les mêmes contrôles n’ajoute pas systématiquement une défense; un charter `À explorer` signale une investigation planifiée, pas une couverture réalisée.

| Risque | Niveau | AC | TC / E2E / EXP associés | Défenses indépendantes | État | Gap ou limite de lecture |
|---|---|---|---|---:|---|---|
| RISK-AUTH-01 | Critique (9) | AC-AUTH-01 | TC-AUTH-01; E2E-01 | 1 | Couvert | Un seul compte nominal; E2E-01 rejoue la même authentification et n’ajoute pas de mécanisme de détection indépendant. |
| RISK-AUTH-02 | Élevé (6) | AC-AUTH-02/03/04/05, AC-SESSION-03 | TC-AUTH-02/03/04/05; TC-SESSION-03/05; E2E-03; EXP-AUTH-01 | 2 | Couvert | Refus à l’entrée et frontière de Cart sont distincts; TC-SESSION-03/05 exercent deux états initiaux sans créer une politique pour les autres routes. |
| RISK-CAT-01 | Moyen (4) | AC-CAT-01/02/03 | TC-CAT-01/02/03; E2E-01; EXP-CAT-01 | 3 | Couvert | Complétude du catalogue, cohérence liste/fiche et gestion d’une référence absente; contenu marketing non validé exhaustivement. |
| RISK-CAT-02 | Faible (2) | AC-CAT-01/04 | TC-CAT-01/04; EXP-CAT-01 | 2 | Partiellement couvert | Présence, unicité et dégradation explicite sont détectées; la correspondance sémantique produit/image reste sans référence fiable. |
| RISK-SORT-01 | Faible (2) | AC-SORT-01/02/03/04/05/06 | TC-TRI-01/02/03/04/05/06; EXP-SORT-01 | 2 | Couvert | Deux familles nominales, nom et prix; les deux comptes spéciaux sont des caractérisations redondantes entre elles, et le charter n’est pas exécuté. |
| RISK-CART-01 | Élevé (6) | AC-CART-01/02/03/05 | TC-PAN-01/02/03/05/06; E2E-01; EXP-CART-01, EXP-CHK-01 | 4 | Couvert | Ajout, retrait, conservation/navigation et transmission au checkout sont distincts; TC-PAN-05/06 caractérisent le même mode spécial et les charters ne sont pas exécutés. |
| RISK-CART-02 | Élevé (6) | AC-SESSION-01 | TC-SESSION-01; EXP-CART-01, EXP-SESSION-01 | 1 | Partiellement couvert | Rafraîchissement d’Inventory seulement; reconnexion, changement d’utilisateur et nouvelle session non spécifiés. |
| RISK-CHK-01 | Critique (9) | AC-CHK-01/07/08 | TC-CHK-01/07/08; E2E-01; EXP-CHK-01/02 | 1 | Couvert | TC-CHK-01 et E2E-01 rejouent la même finalisation nominale; TC-CHK-07/08 sont des caractérisations et les charters ne sont pas exécutés. |
| RISK-CHK-02 | Élevé (6) | AC-CHK-02 | TC-CHK-02; E2E-01; EXP-CHK-01 | 1 | Partiellement couvert | E2E-01 répète le même mécanisme arithmétique sur un autre jeu de données; aucun contrôle ne démontre le taux de taxe ni l’arrondi métier et le charter n’est pas exécuté. |
| RISK-CHK-03 | Élevé (6) | AC-CART-04, AC-CHK-06 | TC-PAN-04/TC-CHK-06; EXP-CHK-01/02 | 1 | Partiellement couvert | Les deux TC forment une seule chaîne de commande vide; attendu produit non arbitré et charters non exécutés. |
| RISK-CHK-04 | Moyen (4) | AC-CHK-03/04/05/07 | TC-CHK-03/04/05/07; E2E-02; EXP-CHK-03 | 3 | Partiellement couvert | Trois règles obligatoires distinctes; E2E-02 rejoue le nom absent, TC-CHK-07 est une caractérisation et le charter n’est pas exécuté. |
| RISK-SESSION-01 | Élevé (6) | AC-SESSION-01 | TC-SESSION-01; EXP-CART-01, EXP-CHK-01, EXP-SESSION-01 | 1 | Partiellement couvert | Rafraîchissement d’Inventory seulement; Cart, Checkout, expiration et reprise non couverts; charters non exécutés. |
| RISK-SESSION-02 | Élevé (6) | AC-SESSION-02/03 | TC-SESSION-02/03/05; E2E-03; EXP-AUTH-01, EXP-SESSION-01 | 2 | Partiellement couvert | Logout visible et refus de `/cart.html` sont distincts; TC-SESSION-03/05 exercent après Logout et depuis une session vierge, sans généraliser aux autres routes. |
| RISK-SESSION-03 | Faible (2) | AC-SESSION-04 | TC-SESSION-04; EXP-SESSION-01 | 1 | Couvert | Reset vérifié avec un article seulement; charter non exécuté. |

## Gaps de couverture

| Risque | Gap | Réponse QA recommandée | Nouveau TC dans cette étape |
|---|---|---|---|
| RISK-CAT-02 | Les contrôles détectent une image absente, dupliquée ou explicitement dégradée, mais pas une image valide associée au mauvais produit. | Vérification manuelle ciblée de la correspondance sémantique produit/image; envisager une référence visuelle seulement si elle devient stable et maintenable. | Non |
| RISK-CART-02 | Persistance après logout/relogin, changement d’utilisateur et nouvelle session non spécifiée. | Clarification produit, puis test de transition d’état inter-session si la règle est confirmée. | Non |
| RISK-CHK-02 | La formule ou le taux de taxe et les règles d’arrondi ne sont pas définis; le montant fiscal exact ne peut pas être dérivé indépendamment. | Obtenir la règle métier de taxe et d’arrondi, puis compléter la conception par partitions et valeurs limites justifiées. | Non |
| RISK-CHK-03 | Le système confirme une commande vide, mais l’attendu souhaité n’est pas défini. | Décision Product Owner et acceptation explicite ou nouvel AC avant toute évolution de test. | Non |
| RISK-CHK-04 | Validité des formats et classes de saisie non définie. | Test exploratoire ciblé, puis partitions fonctionnelles après clarification. | Non |
| RISK-SESSION-01 | Rafraîchissement hors Inventory, expiration et reprise non couverts. | Exploration du cycle de vie, définition de la politique de session, puis tests de transition ciblés. | Non |
| RISK-SESSION-02 | Seule Cart est contrôlée; la politique de protection des autres routes n’est pas définie. | Inventaire des routes sensibles, puis test négatif paramétré si la règle commune est confirmée. | Non |

**Risques critiques ou élevés avec une seule défense indépendante :** RISK-AUTH-01, RISK-CART-02, RISK-CHK-01, RISK-CHK-02, RISK-CHK-03 et RISK-SESSION-01.

**Risques critiques ou élevés disposant de plusieurs défenses complémentaires :** RISK-AUTH-02, RISK-CART-01 et RISK-SESSION-02. Les E2E qui rejouent le même mécanisme que le TC ciblé renforcent la confiance transverse sans être comptés comme défenses indépendantes.

## Risques résiduels

- L’authentification nominale est exercée avec un seul compte standard.
- Les routes protégées ne sont pas inventoriées exhaustivement.
- La persistance entre utilisateurs ou sessions n’est pas spécifiée.
- Les règles de taxe, d’arrondi et de validation détaillée des coordonnées ne sont pas disponibles.
- Les durées de session, l’expiration et la reprise ne sont pas définies.
- La concurrence de sessions, la sécurité offensive, la performance, le multi-navigateur et l’accessibilité exhaustive restent acceptés hors périmètre du plan actuel. Ces thèmes ne deviennent pas de nouveaux risques produit catalogués sans conséquence métier et décision de périmètre explicites.
- Les comportements de `problem_user` et `error_user` restent des données de caractérisation; ils ne constituent ni des besoins métier ni des défauts à déclarer automatiquement.

## Synthèse

| Indicateur | Nombre |
|---|---:|
| Risques identifiés | 14 |
| Couvert | 7 |
| Partiellement couvert | 7 |
| Non couvert | 0 |
| Accepté / hors périmètre | 0 |
| Risques critiques ou élevés avec plusieurs défenses | 3 |
| Risques critiques ou élevés nécessitant une couverture supplémentaire | 5 |
| Risques critiques ou élevés avec une seule défense indépendante | 6 |

Les cinq risques critiques ou élevés nécessitant une couverture supplémentaire sont RISK-CART-02, RISK-CHK-02, RISK-CHK-03, RISK-SESSION-01 et RISK-SESSION-02. RISK-CAT-02 et RISK-CHK-04 restent également partiellement couverts, respectivement aux niveaux Faible et Moyen.
