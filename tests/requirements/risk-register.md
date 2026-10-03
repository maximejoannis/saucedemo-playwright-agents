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

## États de couverture

| État | Définition |
|---|---|
| Couvert | Une ou plusieurs défenses pertinentes exercent le risque sur son périmètre défini, avec un oracle capable de détecter sa matérialisation. Un risque résiduel peut néanmoins subsister. |
| Partiellement couvert | Une défense pertinente existe, mais une condition, une transition, une règle métier ou une classe de données significative reste non testée ou non définie. |
| Non couvert | Aucune défense actuelle ne permet de détecter de façon crédible la matérialisation du risque. |
| Accepté / hors périmètre | Le risque est identifié mais sa couverture n’est pas prévue dans le périmètre actuel à la suite d’une décision explicite. |

Les campagnes Smoke et Regression, ou plusieurs tests répétant le même oracle, ne sont pas comptés comme défenses indépendantes à eux seuls. L’indépendance vient d’un niveau ou d’un mode de détection différent : contrôle fonctionnel ciblé, test négatif, transition d’état, E2E ou exploration.

## Catalogue

| ID | Fonctionnalité | Risque | Conséquence | US | AC | Probabilité | Impact | Niveau | Réponse QA | TC | État | Risque résiduel / remarque |
|---|---|---|---|---|---|---:|---:|---|---|---|---|---|
| RISK-AUTH-01 | Authentification | Un utilisateur légitime ne peut pas s’authentifier. | Accès au service marchand et achat entièrement bloqués. | US-01 | AC-AUTH-01 | 3 | 3 | Critique (9) | Smoke + régression nominale; défense E2E transverse. | TC-AUTH-01 | Couvert | Un seul compte nominal exercé. |
| RISK-AUTH-02 | Authentification | Des identifiants invalides ou un compte verrouillé obtiennent un accès. | Accès non autorisé au domaine marchand ou aux données de l’utilisateur précédent. | US-01, US-06 | AC-AUTH-02, AC-AUTH-03, AC-AUTH-04, AC-AUTH-05, AC-SESSION-03 | 2 | 3 | Élevé (6) | Tests négatifs à l’entrée et transition après logout; E2E de protection. | TC-AUTH-02, TC-AUTH-03, TC-AUTH-04, TC-AUTH-05, TC-SESSION-03 | Couvert | Session jamais authentifiée et autres routes non contrôlées. |
| RISK-CAT-01 | Catalogue | Produit, description ou prix absent, erroné ou incohérent entre liste et fiche. | Mauvaise décision d’achat et montant attendu trompeur. | US-02 | AC-CAT-01, AC-CAT-02, AC-CAT-03 | 2 | 2 | Moyen (4) | Régression des six produits et cohérence liste/fiche. | TC-CAT-01, TC-CAT-02, TC-CAT-03 | Couvert | Contenu marketing non validé exhaustivement. |
| RISK-CAT-02 | Catalogue | Image incorrecte ou indisponible. | Compréhension du produit dégradée sans blocage du parcours. | US-02 | AC-CAT-01, AC-CAT-04 | 2 | 1 | Faible (2) | Contrôle nominal ciblé et caractérisation séparée. | TC-CAT-01, TC-CAT-04 | Couvert | Pas de comparaison visuelle subjective ou responsive. |
| RISK-SORT-01 | Tri | Le catalogue n’est pas ordonné selon le nom ou le prix choisi. | Recherche moins efficace sans altération du panier ou du montant. | US-03 | AC-SORT-01, AC-SORT-02, AC-SORT-03, AC-SORT-04, AC-SORT-05, AC-SORT-06 | 2 | 1 | Faible (2) | Régression automatisée des quatre ordres; caractérisations hors Smoke. | TC-TRI-01, TC-TRI-02, TC-TRI-03, TC-TRI-04, TC-TRI-05, TC-TRI-06 | Couvert | Collation internationale et catalogues volumineux non couverts. |
| RISK-CART-01 | Panier | Un ajout ou retrait échoue, ou un article est perdu, dupliqué ou remplacé pendant la navigation. | Commande incorrecte, abandon ou facturation potentielle d’un mauvais contenu. | US-04 | AC-CART-01, AC-CART-02, AC-CART-03, AC-CART-05 | 2 | 3 | Élevé (6) | Smoke sur l’ajout; transitions multi-articles; E2E d’achat. | TC-PAN-01, TC-PAN-02, TC-PAN-03, TC-PAN-05, TC-PAN-06 | Couvert | Volumes et modifications concurrentes non couverts. |
| RISK-CART-02 | Panier | Le panier disparaît au rafraîchissement ou réapparaît dans une session ultérieure de façon inattendue. | Perte de sélection ou exposition d’un état d’achat résiduel. | US-04, US-06 | AC-SESSION-01 | 2 | 3 | Élevé (6) | Transition après rafraîchissement; clarification inter-session requise. | TC-SESSION-01 | Partiellement couvert | Logout/relogin, changement d’utilisateur et nouveau contexte non testés. |
| RISK-CHK-01 | Checkout | Une commande valide ne peut pas être finalisée ou aucune confirmation n’est produite. | Conversion bloquée ou statut de commande ambigu. | US-05 | AC-CHK-01, AC-CHK-07, AC-CHK-08 | 3 | 3 | Critique (9) | Smoke + régression du parcours complet; E2E d’achat. | TC-CHK-01, TC-CHK-07, TC-CHK-08 | Couvert | Statut persistant hors page de confirmation non vérifié. |
| RISK-CHK-02 | Checkout | Sous-total, taxe, total ou lignes du récapitulatif incorrects. | Montant annoncé ou facturé incorrect et risque financier/réglementaire. | US-05 | AC-CHK-02 | 2 | 3 | Élevé (6) | Oracle arithmétique indépendant multi-articles; contrôle E2E sur un article. | TC-CHK-02 | Couvert | Règle de taxe et arrondis limites non spécifiés. |
| RISK-CHK-03 | Checkout | Une commande vide peut être finalisée. | Données parasites et métriques de commande faussées. | US-04, US-05 | AC-CART-04, AC-CHK-06 | 3 | 2 | Élevé (6) | Caractérisation négative; décision produit sur le blocage souhaité. | TC-PAN-04, TC-CHK-06 | Partiellement couvert | Comportement détecté mais attendu métier non arbitré. |
| RISK-CHK-04 | Checkout | Des données de livraison obligatoires manquent mais le parcours continue, ou une saisie valide est rejetée. | Livraison impossible ou abandon d’une saisie pourtant valide. | US-05 | AC-CHK-03, AC-CHK-04, AC-CHK-05, AC-CHK-07 | 2 | 2 | Moyen (4) | Tests négatifs des champs requis et exploration des classes de saisie. | TC-CHK-03, TC-CHK-04, TC-CHK-05, TC-CHK-07 | Partiellement couvert | Formats, longueurs et validité postale non définis. |
| RISK-SESSION-01 | Session | La session active est perdue ou son contexte est mal conservé pendant le parcours. | Interruption, perte du panier et abandon. | US-06 | AC-SESSION-01 | 2 | 3 | Élevé (6) | Smoke après rafraîchissement; exploration du cycle de vie. | TC-SESSION-01 | Partiellement couvert | Cart, Checkout, expiration et reprise non couverts. |
| RISK-SESSION-02 | Session | Logout ne termine pas réellement la session ou une route protégée reste accessible. | Actions ou données accessibles à l’utilisateur suivant. | US-01, US-06 | AC-SESSION-02, AC-SESSION-03 | 2 | 3 | Élevé (6) | Smoke logout, test négatif de route et E2E de protection. | TC-SESSION-02, TC-SESSION-03 | Partiellement couvert | Une seule route après logout; session vierge non testée. |
| RISK-SESSION-03 | Session | Reset App State ne vide pas exactement le panier ou déconnecte l’utilisateur. | État d’achat résiduel ou interruption évitable. | US-06 | AC-SESSION-04 | 1 | 2 | Faible (2) | Test automatisé de transition d’état. | TC-SESSION-04 | Couvert | Réinitialisation testée avec un seul article. |

## Fiches détaillées des risques critiques et élevés

### RISK-AUTH-01 — Accès légitime impossible

- **Besoin menacé :** permettre à un utilisateur valide d’accéder au catalogue (US-01).
- **Conséquence :** accès au service marchand et achat entièrement bloqués.
- **Réponse QA :** Smoke et régression automatisée de la connexion nominale; parcours E2E d’achat comme défense transverse.
- **Défenses effectives :** TC-AUTH-01 détecte directement l’échec de connexion; E2E-01 confirme que l’accès permet réellement de poursuivre le parcours.
- **Risque résiduel :** un seul compte nominal et aucune variation de politique d’authentification ne sont couverts.

### RISK-AUTH-02 — Accès indu

- **Besoin menacé :** contrôler l’accès et empêcher la réutilisation d’une session terminée (US-01, US-06).
- **Conséquence :** accès non autorisé au domaine marchand ou aux données de l’utilisateur précédent.
- **Réponse QA :** tests négatifs des identifiants, champs obligatoires et compte verrouillé; transition logout puis accès direct; E2E de protection de session.
- **Défenses effectives :** TC-AUTH-02/03/04/05 couvrent plusieurs refus à l’entrée; TC-SESSION-03 exerce la frontière après logout; E2E-03 assemble logout et refus de route.
- **Risque résiduel :** session jamais authentifiée et autres routes protégées non contrôlées explicitement.

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
- **Défenses effectives :** TC-CHK-01 contrôle directement la finalisation nominale; E2E-01 vérifie le tunnel complet. TC-CHK-07/08 illustrent des modes de défaillance spéciaux, sans définir l’attendu métier nominal.
- **Risque résiduel :** absence de vérification d’un statut persistant de commande en dehors de la page de confirmation.

### RISK-CHK-02 — Montant incorrect

- **Besoin menacé :** vérifier un montant de commande exact avant confirmation (US-05).
- **Conséquence :** montant annoncé ou facturé incorrect, perte de confiance et risque financier/réglementaire.
- **Réponse QA :** oracle arithmétique indépendant sur plusieurs articles en Smoke et régression; contrôle transverse sur un article dans E2E-01.
- **Défenses effectives :** TC-CHK-02 compare chaque ligne, la somme, la taxe et le total; E2E-01 contrôle la cohérence financière du parcours nominal.
- **Risque résiduel :** règle de taxe, partitions de montant et arrondis limites non spécifiés.

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
- **Défenses effectives :** TC-SESSION-02 contrôle la terminaison visible; TC-SESSION-03 le refus de `/cart.html`; E2E-03 assemble les deux transitions.
- **État partiel :** une seule route après logout est exercée et aucune route n’est testée depuis une session jamais authentifiée.

## Défenses QA

| Risque important | AC / règle | Fonctionnel ciblé | Négatif / transition | Smoke | E2E | Exploration / manuel | Lecture |
|---|---|---|---|---|---|---|---|
| RISK-AUTH-01 | AC-AUTH-01 | TC-AUTH-01 | — | Oui | E2E-01 | — | Plusieurs niveaux : contrôle ciblé et poursuite réelle du parcours. |
| RISK-AUTH-02 | AC-AUTH-02/03/04/05, AC-SESSION-03 | TC-AUTH-02/03/04/05 | TC-SESSION-03 | Non | E2E-03 | Extension des routes à analyser | Plusieurs modes de refus; couverture de routes encore étroite. |
| RISK-CART-01 | AC-CART-01/02/03 | TC-PAN-01/02/03 | Transition multi-articles dans TC-PAN-03 | Oui | E2E-01 | Volumes hors périmètre actuel | Plusieurs défenses complémentaires. |
| RISK-CART-02 | AC-SESSION-01 | TC-SESSION-01 | Rafraîchissement seulement | Oui | — | Clarification inter-session | Une seule défense fonctionnelle. |
| RISK-CHK-01 | AC-CHK-01 | TC-CHK-01 | Caractérisations TC-CHK-07/08 | Oui | E2E-01 | — | Plusieurs niveaux nominaux; caractérisations non comptées comme exigence métier. |
| RISK-CHK-02 | AC-CHK-02 | TC-CHK-02 | Oracle arithmétique indépendant | Oui | E2E-01 | Règle taxe/arrondi à clarifier | Deux jeux de données et niveaux de parcours. |
| RISK-CHK-03 | AC-CART-04, AC-CHK-06 | TC-PAN-04, TC-CHK-06 | Parcours vide | Non | — | Décision Product Owner | Une seule chaîne de défense; attendu métier non arbitré. |
| RISK-SESSION-01 | AC-SESSION-01 | TC-SESSION-01 | Rafraîchissement seulement | Oui | — | Cycle de vie à explorer | Une seule défense, partagée avec RISK-CART-02. |
| RISK-SESSION-02 | AC-SESSION-02/03 | TC-SESSION-02 | TC-SESSION-03 | Logout seulement | E2E-03 | Inventaire des routes | Plusieurs niveaux, périmètre de routes partiel. |

## Gaps de couverture

| Risque | Gap | Réponse QA recommandée | Nouveau TC dans cette étape |
|---|---|---|---|
| RISK-CART-02 | Persistance après logout/relogin, changement d’utilisateur et nouvelle session non spécifiée. | Clarification produit, puis test de transition d’état inter-session si la règle est confirmée. | Non |
| RISK-CHK-03 | Le système confirme une commande vide, mais l’attendu souhaité n’est pas défini. | Décision Product Owner et acceptation explicite ou nouvel AC avant toute évolution de test. | Non |
| RISK-CHK-04 | Validité des formats et classes de saisie non définie. | Test exploratoire ciblé, puis partitions fonctionnelles après clarification. | Non |
| RISK-SESSION-01 | Rafraîchissement hors Inventory, expiration et reprise non couverts. | Exploration du cycle de vie, définition de la politique de session, puis tests de transition ciblés. | Non |
| RISK-SESSION-02 | Une seule route est contrôlée après logout; session jamais authentifiée non couverte. | Inventaire des routes sensibles, puis test négatif paramétré si la règle commune est confirmée. | Non |

**Risques critiques ou élevés avec une seule défense indépendante :** RISK-CART-02, RISK-CHK-03 et RISK-SESSION-01.

**Risques critiques ou élevés disposant de plusieurs défenses complémentaires :** RISK-AUTH-01, RISK-AUTH-02, RISK-CART-01, RISK-CHK-01, RISK-CHK-02 et RISK-SESSION-02. Ce constat n’annule pas les gaps de portée signalés pour RISK-SESSION-02.

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
| Couvert | 9 |
| Partiellement couvert | 5 |
| Non couvert | 0 |
| Accepté / hors périmètre | 0 |
| Risques critiques ou élevés avec plusieurs défenses | 6 |
| Risques critiques ou élevés nécessitant une couverture supplémentaire | 4 |
| Risques critiques ou élevés avec une seule défense indépendante | 3 |

Les quatre risques critiques ou élevés nécessitant une couverture supplémentaire sont RISK-CART-02, RISK-CHK-03, RISK-SESSION-01 et RISK-SESSION-02. RISK-CHK-04 reste également partiellement couvert, mais son niveau est Moyen.
