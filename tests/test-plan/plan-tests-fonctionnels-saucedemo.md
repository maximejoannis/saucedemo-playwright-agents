# Plan de tests fonctionnels — SauceDemo

## 1. Objectif

Définir une base QA testable et traçable pour SauceDemo, depuis le besoin utilisateur jusqu’au cas de test. Ce plan découle d’une exploration réelle de `https://www.saucedemo.com/` avec Chromium le 30 août 2026. Il ne contient aucune automatisation.

Chaque cas est indépendant : il démarre avec un nouveau contexte de navigation, sauf mention explicite d’un état construit dans ses préconditions.

## 2. Périmètre

- Authentification et messages de refus.
- Liste et détail du catalogue.
- Quatre tris proposés.
- Ajout, retrait, conservation et panier vide.
- Saisie, récapitulatif, calcul et confirmation du checkout.
- Conservation, déconnexion, protection des routes et réinitialisation de session.
- Dégradations observées avec `locked_out_user`, `problem_user` et `error_user`.

La consultation d’une fiche produit reste dans « Catalogue » et les actions du menu dans « Session ». Aucune nouvelle fonctionnalité majeure n’a donc été ajoutée.

## 3. Hors périmètre

- Automatisation et détails d’implémentation technique.
- Tests d’API, charge, sécurité offensive, accessibilité exhaustive et responsive.
- Firefox, WebKit et appareils mobiles.
- Liens Twitter, Facebook, LinkedIn, About, mentions légales et confidentialité.
- « Generate PDF order ».
- Comptes `performance_glitch_user` et `visual_user`.
- Validation du contenu marketing des descriptions au-delà de sa présence et de sa cohérence entre liste et fiche.

## 4. Environnement

| Élément | Valeur |
|---|---|
| Application | `https://www.saucedemo.com/` |
| Navigateur d’exploration | Chromium, bureau, mode sans interface |
| Date de référence | 30 août 2026 |
| État initial | Nouveau contexte, stockage et cookies vierges |
| Langue observée | Interface anglaise |
| Réseau | Application publique disponible |

## 5. Données de test

| Usage | Nom d’utilisateur | Mot de passe | Comportement observé |
|---|---|---|---|
| Nominal | `standard_user` | `secret_sauce` | Parcours complet opérationnel |
| Verrouillé | `locked_out_user` | `secret_sauce` | Connexion refusée explicitement |
| Dégradé | `problem_user` | `secret_sauce` | Images 404, tris inopérants, ajouts partiels, nom checkout non saisissable |
| Dégradé | `error_user` | `secret_sauce` | Tris inopérants, ajouts partiels, Finish inopérant |
| Inconnu | `unknown_user` | `wrong_password` | Combinaison refusée |
| Livraison valide | Jean / Dupont / 75001 | — | Informations acceptées avec compte nominal |

Catalogue nominal observé : Backpack 29,99 $, Bike Light 9,99 $, Bolt T-Shirt 15,99 $, Fleece Jacket 49,99 $, Onesie 7,99 $, Test.allTheThings() T-Shirt (Red) 15,99 $.

## 6. Fonctionnalités

| Fonctionnalité | User Story | Enjeu |
|---|---|---|
| Authentification | US-01 | Contrôler l’accès |
| Catalogue | US-02 | Informer avant sélection |
| Tri | US-03 | Faciliter la recherche |
| Panier | US-04 | Construire la commande |
| Checkout | US-05 | Valider et confirmer l’achat |
| Session | US-06 | Préserver et terminer le contexte |

## 7. Analyse des risques produit

### Objectif de l’approche Risk-Based Testing

Cette analyse sert à concentrer l’effort QA sur les défaillances qui compromettraient le plus le besoin utilisateur ou l’activité métier. Elle complète la traçabilité Fonctionnalité → User Story → Acceptance Criterion → Test Case : un critère couvert n’implique pas à lui seul que le risque associé soit suffisamment couvert.

Le risque produit décrit ce qui pourrait mal fonctionner dans le produit et ses conséquences. Il ne doit être confondu ni avec la priorité d’exécution d’un cas (P0/P1/P2), ni avec la sévérité d’un bug effectivement découvert, ni avec la difficulté d’automatisation. L’évaluation ci-dessous repose sur le parcours d’achat nominal, les contrôles d’accès et les états observés au 30 août 2026. Les comportements de `problem_user` et `error_user` restent des modes de défaillance spéciaux observés, et non des exigences métier souhaitées.

### Méthode de calcul

Chaque risque reçoit un score simple :

`Score de risque = Probabilité × Impact`

La probabilité estime la vraisemblance raisonnable de la défaillance ou de sa régression. L’impact estime la conséquence maximale crédible pour l’utilisateur ou le métier si elle survient. Le score aide à comparer les risques, mais ne remplace pas le jugement QA : la priorité d’un TC tient aussi compte de son rôle de garde-barrière, de la redondance de couverture, de la vitesse de retour attendue et du fait qu’il s’agit ou non d’un comportement spécial de démonstration.

| Valeur | Probabilité | Définition |
|---:|---|---|
| 1 | Faible | Défaillance peu vraisemblable, chemin rare ou mécanisme stable et isolé. |
| 2 | Moyenne | Défaillance plausible lors d’une évolution, d’une transition d’état ou d’une combinaison de données. |
| 3 | Élevée | Défaillance fréquente, déjà observée sur le parcours concerné ou exposée à de nombreuses modifications. |

| Valeur | Impact | Définition |
|---:|---|---|
| 1 | Faible | Gêne visuelle ou de confort, sans blocage du parcours ni altération de donnée métier. |
| 2 | Moyen | Parcours dégradé, mauvaise décision possible ou contournement disponible, sans impossibilité générale d’acheter. |
| 3 | Fort | Accès indu ou impossible, perte/corruption d’une sélection, montant faux, commande impossible ou état utilisateur compromis. |

| Score | Niveau de risque | Règle de traitement |
|---:|---|---|
| 1–2 | Faible | Couverture ciblée ou risque accepté et surveillé. |
| 3–4 | Moyen | Régression proportionnée et contrôle du scénario représentatif. |
| 6 | Élevé | Couverture renforcée, négative ou de transition selon le risque. |
| 9 | Critique | Garde-barrière P0, Smoke et régression automatisée sur le chemin nominal. |

Les scores 5, 7 et 8 ne peuvent pas résulter de l’échelle 1 à 3.

### Matrice des risques

| ID | Fonctionnalité | Risque métier | Conséquence | Probabilité | Impact | Niveau | Réponse QA |
|---|---|---|---|---:|---:|---|---|
| RISK-AUTH-01 | Authentification | Un utilisateur légitime ne peut pas s’authentifier. | Accès au catalogue et achat entièrement bloqués. | 3 | 3 | Critique (9) | Smoke + régression automatisée sur la connexion nominale (`AC-AUTH-01`, `TC-AUTH-01`). |
| RISK-AUTH-02 | Authentification | Des identifiants invalides ou un compte verrouillé obtiennent un accès. | Accès non autorisé au domaine marchand et perte de confiance. | 2 | 3 | Élevé (6) | Tests négatifs automatisés des refus (`AC-AUTH-02`, `AC-AUTH-05`, `TC-AUTH-02`, `TC-AUTH-05`) et contrôle de route protégée avec RISK-SESSION-02. |
| RISK-CAT-01 | Catalogue | Produit, description ou prix absent, erroné ou incohérent entre liste et fiche. | Mauvaise décision d’achat et montant attendu trompeur. | 2 | 2 | Moyen (4) | Régression automatisée des six produits et contrôle liste/fiche (`AC-CAT-01/02`, `TC-CAT-01/02`). |
| RISK-CAT-02 | Catalogue | Image incorrecte ou indisponible. | Compréhension du produit dégradée, sans blocage du parcours. | 2 | 1 | Faible (2) | Vérification ciblée du nominal; `TC-CAT-04` reste un test de caractérisation de `problem_user`, à isoler de l’oracle métier nominal. |
| RISK-SORT-01 | Tri | Le catalogue n’est pas ordonné selon le nom ou le prix choisi. | Recherche moins efficace; aucun article, panier ou montant n’est altéré. | 2 | 1 | Faible (2) | Régression automatisée représentative des quatre ordres; caractérisations `TC-TRI-05/06` hors Smoke. |
| RISK-CART-01 | Panier | Un ajout/retrait échoue, un article est perdu, dupliqué ou remplacé pendant la navigation. | Commande non conforme à l’intention, abandon ou facturation potentielle d’un mauvais contenu. | 2 | 3 | Élevé (6) | Smoke sur l’ajout + régression automatisée des transitions ajout/retrait/navigation (`AC-CART-01/02/03`, `TC-PAN-01/02/03`) et test multi-articles recommandé. |
| RISK-CART-02 | Panier | Le panier disparaît au rafraîchissement ou réapparaît dans une session ultérieure de façon inattendue. | Perte de sélection ou exposition d’un état d’achat résiduel. | 2 | 3 | Élevé (6) | Test de transition d’état et de persistance (`AC-SESSION-01`, `TC-SESSION-01`); analyse complémentaire après logout/relogin et nouvelle session. |
| RISK-CHK-01 | Checkout | Une commande valide ne peut pas être finalisée ou aucune confirmation n’est produite. | Achat et conversion bloqués; statut de commande ambigu. | 3 | 3 | Critique (9) | Smoke + régression automatisée du parcours complet (`AC-CHK-01`, `TC-CHK-01`); `TC-CHK-08` caractérise séparément `error_user`. |
| RISK-CHK-02 | Checkout | Sous-total, taxe ou total incorrect, ou lignes du panier incohérentes avec le récapitulatif. | Montant facturé ou annoncé incorrect et risque financier/réglementaire. | 2 | 3 | Élevé (6) | Régression automatisée avec oracle arithmétique indépendant et plusieurs articles (`AC-CHK-02`, `TC-CHK-02`); ajout recommandé à la Smoke ciblée checkout. |
| RISK-CHK-03 | Checkout | Une commande vide peut être finalisée. | Commande sans valeur, données parasites et métriques métier faussées. | 3 | 2 | Élevé (6) | Test négatif de caractérisation (`AC-CART-04`, `AC-CHK-06`, `TC-PAN-04`, `TC-CHK-06`), clarification produit attendue sur le blocage souhaité. |
| RISK-CHK-04 | Checkout | Des données de livraison obligatoires manquent mais le parcours continue, ou une saisie valide est rejetée. | Livraison impossible ou abandon du checkout. | 2 | 2 | Moyen (4) | Tests négatifs automatisés des trois champs (`AC-CHK-03/04/05`, `TC-CHK-03/04/05`) et exploration de classes de saisie non définies. |
| RISK-SESSION-01 | Session | La session active est perdue ou son contexte est mal conservé pendant le parcours. | Interruption du parcours, perte du panier et abandon. | 2 | 3 | Élevé (6) | Régression automatisée après rafraîchissement (`AC-SESSION-01`, `TC-SESSION-01`) et tests de transitions/navigation prolongée à compléter. |
| RISK-SESSION-02 | Session | Logout ne termine pas réellement la session ou une route protégée reste accessible. | Accès non autorisé aux données et actions de l’utilisateur précédent. | 2 | 3 | Élevé (6) | Smoke du logout + test négatif automatisé d’accès direct (`AC-SESSION-02/03`, `TC-SESSION-02/03`), à étendre aux autres routes sensibles. |
| RISK-SESSION-03 | Session | Reset App State ne vide pas exactement le panier ou déconnecte l’utilisateur. | État d’achat résiduel ou interruption évitable du parcours. | 1 | 2 | Faible (2) | Test de transition d’état automatisé (`AC-SESSION-04`, `TC-SESSION-04`). |

### Risques critiques et élevés

- **RISK-AUTH-01** et **RISK-CHK-01** sont critiques : ils encadrent l’entrée et l’aboutissement du tunnel. Une panne rend le service marchand inutilisable même si les fonctions intermédiaires restent disponibles. Leurs TC nominaux P0 doivent rester des garde-barrières Smoke et Regression.
- **RISK-AUTH-02** et **RISK-SESSION-02** protègent la frontière d’accès. Le chemin nominal ne suffit pas : les refus, le logout et la tentative d’accès direct doivent être contrôlés comme transitions d’autorisation.
- **RISK-CART-01**, **RISK-CART-02** et **RISK-SESSION-01** portent sur l’intégrité du contexte d’achat. Une sélection perdue, dupliquée ou résiduelle peut modifier la commande ou provoquer l’abandon; la couverture doit vérifier l’état, pas seulement la présence d’un bouton.
- **RISK-CHK-02** exige un oracle financier indépendant : recopier une valeur affichée ne démontrerait pas l’exactitude du calcul. La somme des lignes, le sous-total, la taxe et le total doivent être comparés.
- **RISK-CHK-03** est élevé parce que le comportement est déjà observé. Il n’est toutefois pas assimilé à l’impossibilité d’acheter : son impact porte surtout sur l’intégrité des commandes et des indicateurs métier.

À l’inverse, **RISK-SORT-01** et **RISK-CAT-02** restent faibles : un tri ou une image incorrecte gêne le choix, mais ne bloque ni l’accès, ni la constitution du panier, ni la finalisation. Leur automatisation existante ne les rend pas plus critiques.

### Risques résiduels et gaps de couverture

La matrice de traçabilité annonce 100 % des AC couverts, mais les risques suivants ne sont pas entièrement démontrés par les AC/TC actuels :

| Risque | Couverture actuelle | Gap résiduel | Réponse recommandée avant création de TC |
|---|---|---|---|
| RISK-AUTH-02 / RISK-SESSION-02 | Refus d’identifiants, compte verrouillé et `/cart.html` après logout. | Absence de contrôle explicite d’une route protégée depuis une session jamais authentifiée et couverture d’une seule route après logout. | Analyse complémentaire des routes sensibles, puis test négatif paramétré si la règle d’accès est confirmée. |
| RISK-CART-01 | Ajout/retrait unitaire et conservation en navigation. | Pas de transition multi-articles combinant ajouts, retrait partiel, aller-retour détail/panier et absence de duplication. | Concevoir un test de transition d’état multi-articles; ne pas créer un cas par combinaison. |
| RISK-CART-02 | Rafraîchissement avec un article via `TC-SESSION-01`. | État du panier après logout/relogin, changement d’utilisateur ou nouvelle session non spécifié. | Clarifier la règle produit et la confidentialité attendue avant d’écrire un AC ou un TC. |
| RISK-CHK-02 | Six produits, somme, taxe et total dans `TC-CHK-02`. | Règle de taxe non spécifiée; peu de classes de montant et aucun arrondi limite. | Analyse des règles de calcul nécessaire; compléter les partitions seulement après définition de l’oracle métier. |
| RISK-CHK-03 | Comportement vide observé et couvert. | Aucun AC ne dit si accepter une commande vide est souhaité ou constitue une anomalie. | Décision Product Owner requise; conserver jusque-là un test de caractérisation, sans transformer l’observation en exigence souhaitée. |
| RISK-CHK-04 | Présence obligatoire des trois champs. | Formats, longueurs, espaces, caractères spéciaux et validité du code postal non définis. | Test exploratoire ciblé puis clarification des règles; risque accepté tant qu’aucune contrainte métier n’est fournie. |
| RISK-SESSION-01 | Rafraîchissement d’Inventory couvert. | Navigation prolongée, rafraîchissement depuis Cart/Checkout, expiration et reprise après interruption non couverts. | Tests exploratoires de session et définition de la politique d’expiration avant extension de la régression. |

Les contrôles de sécurité offensive, la concurrence de sessions, la performance, le multi-navigateur et l’accessibilité exhaustive restent hors périmètre conformément à la section 3. Ce sont des risques résiduels acceptés par le périmètre actuel, pas des preuves d’absence de risque.

### Lien entre risque et priorité des tests

La priorité traduit l’ordre et la fréquence d’exécution d’un TC, pas directement le score du risque. Les règles de décision retenues sont :

- **P0** : garde-barrière rapide d’un risque critique, ou contrôle indispensable d’intégrité financière, d’état ou d’autorisation dont l’échec invalide une livraison;
- **P1** : régression importante d’un risque moyen/élevé, test négatif, transition d’état ou complément détaillé d’un P0;
- **P2** : comportement secondaire, rare ou faible impact, acceptable hors boucle de retour rapide.

La revue initiale a produit les écarts suivants. Ils sont désormais arbitrés et propagés dans les fiches TC, la matrice et l’automatisation :

| TC concerné | Priorité actuelle | Lecture par le risque | Proposition argumentée |
|---|---:|---|---|
| TC-CHK-02 | P1 | RISK-CHK-02 élevé (6), oracle financier central. | **Arbitré P0 + Smoke** : un parcours confirmé avec un total faux n’est pas un succès métier. |
| TC-SESSION-01 | P1 | RISK-CART-02 et RISK-SESSION-01 élevés (6). | **Arbitré P0 + Smoke** : ce contrôle court devient un garde-barrière de persistance. |
| TC-CHK-06 | P2 | RISK-CHK-03 élevé (6) et défaillance observée. | **Arbitré P1** tant que le produit n’a pas accepté explicitement les commandes vides; il ne justifie pas P0 car il ne bloque pas l’achat nominal. |
| TC-CAT-04 | P1 | RISK-CAT-02 faible (2), comportement spécial de `problem_user`. | **Arbitré P2**, maintenu dans la Regression comme caractérisation dédiée. |
| TC-TRI-05, TC-TRI-06 | P1 | RISK-SORT-01 faible (2), comportements spéciaux sans altération de commande. | **Arbitrés P2**, maintenus dans la Regression comme caractérisations dédiées. |

Les P0 existants `TC-AUTH-01`, `TC-PAN-01`, `TC-CHK-01`, `TC-SESSION-02` et `TC-SESSION-03` restent justifiés. Les validations obligatoires du checkout restent P1. Les changements arbitrés ci-dessus ne modifient ni la probabilité, ni l’impact, ni le niveau des risques.

### Revue de cohérence et transmission au Generator

- **Risques identifiés :** 14 risques distincts — 2 critiques, 7 élevés, 2 moyens et 3 faibles — sur les six fonctionnalités.
- **Risques couverts :** chaque risque possède au moins un AC/TC contribuant à sa maîtrise; la connexion, le parcours de commande, les refus d’accès, le panier nominal, les montants nominaux, le logout et le reset disposent d’observations explicites.
- **Risques insuffisamment couverts :** accès direct sans authentification préalable, transitions panier multi-articles, persistance inter-session/inter-utilisateur, règles de taxe et d’arrondi, validation étendue des coordonnées et cycle de vie/expiration de session.
- **Priorités revues :** `TC-CHK-02` et `TC-SESSION-01` sont P0 + Smoke, `TC-CHK-06` est P1, `TC-CAT-04` et `TC-TRI-05/06` sont P2 en Regression de caractérisation.
- **Recommandations de conception au Generator :** préserver les IDs et liens US/AC/TC; utiliser des oracles d’état et de calcul indépendants; concevoir un scénario multi-articles par transitions plutôt qu’une explosion combinatoire; séparer les tests métier nominaux des caractérisations `problem_user`/`error_user`; ne générer aucun nouveau test sur les gaps tant que les règles produit signalées ne sont pas clarifiées.

## 8. Cas de test

### Authentification

### TC-AUTH-01 — Connexion avec un utilisateur standard

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-01  
**Risque(s) couvert(s) :** RISK-AUTH-01
**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive @smoke @regression @auth`

**Préconditions :** Page de connexion ouverte dans un contexte vierge.  
**Données de test :** `standard_user` / `secret_sauce`.

**Étapes :**
1. Saisir le nom d’utilisateur puis le mot de passe.
2. Choisir Login.

**Résultat attendu :** Inventory s’affiche avec le titre Products et sans erreur.  
**Critère de réussite :** La session est ouverte sur `/inventory.html`.

### TC-AUTH-02 — Refus d’identifiants inconnus

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-02  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** `unknown_user` / `wrong_password`.

**Étapes :** 1. Saisir les deux valeurs. 2. Choisir Login.  
**Résultat attendu :** L’accès est refusé et le message d’incompatibilité des identifiants s’affiche.  
**Critère de réussite :** L’utilisateur reste sur `/` sans catalogue.

### TC-AUTH-03 — Nom d’utilisateur absent

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-03  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** nom vide, mot de passe vide puis `secret_sauce`.

**Étapes :** 1. Laisser le nom vide. 2. Choisir Login. 3. Refaire avec seulement le mot de passe renseigné.  
**Résultat attendu :** « Epic sadface: Username is required » s’affiche dans les deux variantes.  
**Critère de réussite :** Aucun accès au catalogue et message exact visible.

### TC-AUTH-04 — Mot de passe absent

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-04  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** `standard_user`, mot de passe vide.

**Étapes :** 1. Saisir le nom. 2. Laisser le mot de passe vide. 3. Choisir Login.  
**Résultat attendu :** « Epic sadface: Password is required » s’affiche.  
**Critère de réussite :** Aucun accès au catalogue et message exact visible.

### TC-AUTH-05 — Refus du compte verrouillé

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-05  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** `locked_out_user` / `secret_sauce`.

**Étapes :** 1. Saisir les identifiants. 2. Choisir Login.  
**Résultat attendu :** « Epic sadface: Sorry, this user has been locked out. » s’affiche.  
**Critère de réussite :** L’utilisateur demeure sur `/`.

### Catalogue

### TC-CAT-01 — Affichage du catalogue nominal

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-01  
**Risque(s) couvert(s) :** RISK-CAT-01, RISK-CAT-02
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @smoke @regression @catalog`

**Préconditions :** `standard_user` connecté, Inventory ouverte.  
**Données de test :** les six produits et prix listés en section 5.

**Étapes :** 1. Parcourir les six cartes. 2. Contrôler nom, description, prix, image et bouton d’ajout de chacune.  
**Résultat attendu :** Six produits distincts, complets et aux prix attendus sont présentés.  
**Critère de réussite :** Aucun produit ni attribut attendu ne manque.

### TC-CAT-02 — Consultation d’une fiche et retour

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-02  
**Risque(s) couvert(s) :** RISK-CAT-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @catalog`

**Préconditions :** Catalogue nominal ouvert.  
**Données de test :** Sauce Labs Backpack, 29,99 $.

**Étapes :** 1. Ouvrir le produit par son nom. 2. Comparer nom, description, prix et image. 3. Choisir Back to products.  
**Résultat attendu :** La fiche correspond au produit puis Inventory revient.  
**Critère de réussite :** La navigation aller-retour conserve une information cohérente.

### TC-CAT-03 — Consultation d’un produit inexistant

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-03  
**Risque(s) couvert(s) :** RISK-CAT-01
**Type :** Erreur  
**Priorité :** P2  
**Tags :** `@error @regression @catalog`

**Préconditions :** `standard_user` connecté.  
**Données de test :** `/inventory-item.html?id=999`.

**Étapes :** 1. Ouvrir directement l’adresse de la fiche inexistante. 2. Observer le contenu. 3. Choisir Back to products.  
**Résultat attendu :** « ITEM NOT FOUND » et le texte d’indisponibilité s’affichent; le retour mène au catalogue.  
**Critère de réussite :** La référence absente est explicitement signalée sans bloquer le retour.

### TC-CAT-04 — Images dégradées de problem_user

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-04  
**Risque(s) couvert(s) :** RISK-CAT-02
**Type :** Erreur  
**Priorité :** P2
**Tags :** `@error @regression @catalog`

**Préconditions :** Session vierge.  
**Données de test :** `problem_user` / `secret_sauce`.

**Étapes :** 1. Se connecter. 2. Comparer les images des six cartes à leurs noms.  
**Résultat attendu :** Les six noms et prix sont corrects, mais chaque produit affiche la même ressource d’erreur `sl-404`.  
**Critère de réussite :** Le défaut intentionnel est reproductible sur les six articles.

### Tri

### TC-TRI-01 — Tri des noms de A à Z

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-01  
**Risque(s) couvert(s) :** RISK-SORT-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @sorting`

**Préconditions :** Catalogue de `standard_user` ouvert.  
**Données de test :** option Name (A to Z).

**Étapes :** 1. Choisir A–Z. 2. Relever les noms de haut en bas.  
**Résultat attendu :** Backpack est premier, le T-shirt rouge dernier et chaque paire est croissante.  
**Critère de réussite :** Les six noms respectent l’ordre alphabétique croissant.

### TC-TRI-02 — Tri des noms de Z à A

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-02  
**Risque(s) couvert(s) :** RISK-SORT-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @sorting`

**Préconditions :** Catalogue nominal ouvert.  
**Données de test :** option Name (Z to A).

**Étapes :** 1. Choisir Z–A. 2. Relever les noms.  
**Résultat attendu :** T-shirt rouge est premier, Backpack dernier, ordre décroissant complet.  
**Critère de réussite :** Les six noms sont classés sans inversion.

### TC-TRI-03 — Tri des prix croissants

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-03  
**Risque(s) couvert(s) :** RISK-SORT-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @sorting`

**Préconditions :** Catalogue nominal ouvert.  
**Données de test :** option Price (low to high).

**Étapes :** 1. Choisir le prix croissant. 2. Relever les six prix.  
**Résultat attendu :** 7,99; 9,99; 15,99; 15,99; 29,99; 49,99 $.  
**Critère de réussite :** Aucun prix n’est inférieur au précédent.

### TC-TRI-04 — Tri des prix décroissants

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-04  
**Risque(s) couvert(s) :** RISK-SORT-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @sorting`

**Préconditions :** Catalogue nominal ouvert.  
**Données de test :** option Price (high to low).

**Étapes :** 1. Choisir le prix décroissant. 2. Relever les six prix.  
**Résultat attendu :** 49,99; 29,99; 15,99; 15,99; 9,99; 7,99 $.  
**Critère de réussite :** Aucun prix n’est supérieur au précédent.

### TC-TRI-05 — Tri inopérant de problem_user

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-05  
**Risque(s) couvert(s) :** RISK-SORT-01
**Type :** Erreur  
**Priorité :** P2
**Tags :** `@error @regression @sorting`

**Préconditions :** `problem_user` connecté.  
**Données de test :** Z–A, prix croissant, prix décroissant.

**Étapes :** 1. Noter l’ordre initial. 2. Choisir successivement chaque option. 3. Relever l’ordre après chaque choix.  
**Résultat attendu :** L’ordre A–Z initial ne change jamais.  
**Critère de réussite :** Les trois échecs de réordonnancement sont reproduits.

### TC-TRI-06 — Tri inopérant de error_user

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-06  
**Risque(s) couvert(s) :** RISK-SORT-01
**Type :** Erreur  
**Priorité :** P2
**Tags :** `@error @regression @sorting`

**Préconditions :** `error_user` connecté.  
**Données de test :** Z–A, prix croissant, prix décroissant.

**Étapes :** 1. Noter l’ordre initial. 2. Choisir les trois options. 3. Comparer chaque ordre.  
**Résultat attendu :** L’ordre A–Z initial demeure inchangé.  
**Critère de réussite :** Le défaut est reproduit pour chaque tri non initial.

### Panier

### TC-PAN-01 — Ajout d’un produit

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-01  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive @smoke @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Sauce Labs Backpack.

**Étapes :** 1. Ajouter Backpack. 2. Contrôler le badge et le bouton. 3. Ouvrir Cart.  
**Résultat attendu :** Badge 1, bouton Remove, ligne Backpack à 29,99 $ en quantité 1.  
**Critère de réussite :** Les trois représentations de la sélection concordent.

### TC-PAN-02 — Retrait d’un produit

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-02  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @cart`

**Préconditions :** Backpack seul au panier.  
**Données de test :** Sauce Labs Backpack.

**Étapes :** 1. Ouvrir Cart. 2. Choisir Remove.  
**Résultat attendu :** La ligne disparaît et le badge n’est plus affiché.  
**Critère de réussite :** Le panier est vide et ne présente pas de quantité résiduelle.

### TC-PAN-03 — Conservation du panier pendant la navigation

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-03  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Bike Light et Backpack.

**Étapes :** 1. Ajouter Bike Light et Backpack. 2. Ouvrir une fiche puis revenir. 3. Ouvrir Cart et retirer Backpack. 4. Revenir à Inventory puis rouvrir Cart.
**Résultat attendu :** Les deux ajouts restent uniques pendant la navigation; après le retrait, le badge vaut 1 et seul Bike Light demeure à chaque étape pertinente.
**Critère de réussite :** Aucune navigation interne ne perd, ne duplique ni ne réintroduit un article retiré.

### TC-PAN-04 — Accès au checkout avec panier vide

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-04  
**Risque(s) couvert(s) :** RISK-CHK-03
**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** aucune.

**Étapes :** 1. Ouvrir Cart. 2. Vérifier l’absence de ligne. 3. Choisir Checkout.  
**Résultat attendu :** L’étape `checkout-step-one.html` s’ouvre malgré le panier vide.  
**Critère de réussite :** Le comportement alternatif observé est reproduit sans inventer de blocage.

### TC-PAN-05 — Ajouts partiels de problem_user

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-05  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @cart`

**Préconditions :** `problem_user` connecté, panier vide.  
**Données de test :** les six produits.

**Étapes :** 1. Choisir Add to cart sur chaque produit. 2. Observer boutons et badge. 3. Ouvrir Cart.  
**Résultat attendu :** Seuls Backpack, Bike Light et Onesie passent à Remove et figurent au panier; badge 3; aucun message visible pour les autres.  
**Critère de réussite :** Les trois succès et trois échecs correspondent à l’observation.

### TC-PAN-06 — Ajouts partiels de error_user

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-05  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @cart`

**Préconditions :** `error_user` connecté, panier vide.  
**Données de test :** les six produits.

**Étapes :** 1. Ajouter successivement les six produits. 2. Observer badge et boutons. 3. Ouvrir Cart.  
**Résultat attendu :** Backpack, Bike Light et Onesie seulement sont ajoutés; badge 3; les autres restent ajoutables sans message visible.  
**Critère de réussite :** L’état du panier contient exactement ces trois articles.

### Checkout

### TC-CHK-01 — Finalisation d’une commande nominale

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-01  
**Risque(s) couvert(s) :** RISK-CHK-01
**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive @smoke @regression @checkout`

**Préconditions :** `standard_user` connecté, Backpack au panier.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Ouvrir Cart et Checkout. 2. Saisir les trois informations. 3. Continuer. 4. Vérifier l’article. 5. Choisir Finish.  
**Résultat attendu :** La page Checkout Complete remercie l’utilisateur et propose Back Home.  
**Critère de réussite :** `/checkout-complete.html` est atteint avec le message de confirmation.

### TC-CHK-02 — Exactitude du récapitulatif financier

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-02  
**Risque(s) couvert(s) :** RISK-CHK-02
**Type :** Passant  
**Priorité :** P0
**Tags :** `@positive @smoke @regression @checkout`

**Préconditions :** Les six produits nominaux au panier.  
**Données de test :** Jean / Dupont / 75001; somme attendue 129,94 $.

**Étapes :** 1. Accéder au checkout. 2. Renseigner les informations. 3. Continuer. 4. Additionner les prix et comparer sous-total, taxe et total.  
**Résultat attendu :** Sous-total 129,94 $, taxe 10,40 $, total 140,34 $.  
**Critère de réussite :** Sous-total = somme des lignes et total = sous-total + taxe.

### TC-CHK-03 — Prénom obligatoire

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-03  
**Risque(s) couvert(s) :** RISK-CHK-04
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @checkout`

**Préconditions :** `standard_user` à l’étape d’informations.  
**Données de test :** trois champs vides.

**Étapes :** 1. Choisir Continue sans saisie.  
**Résultat attendu :** « Error: First Name is required »; même étape conservée.  
**Critère de réussite :** Aucun récapitulatif ne s’affiche.

### TC-CHK-04 — Nom obligatoire

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-04  
**Risque(s) couvert(s) :** RISK-CHK-04
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @checkout`

**Préconditions :** `standard_user` à l’étape d’informations.  
**Données de test :** prénom Jean uniquement.

**Étapes :** 1. Saisir Jean. 2. Choisir Continue.  
**Résultat attendu :** « Error: Last Name is required »; étape inchangée.  
**Critère de réussite :** La validation cible le premier champ manquant suivant.

### TC-CHK-05 — Code postal obligatoire

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-05  
**Risque(s) couvert(s) :** RISK-CHK-04
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @checkout`

**Préconditions :** `standard_user` à l’étape d’informations.  
**Données de test :** Jean / Dupont, code postal vide.

**Étapes :** 1. Saisir prénom et nom. 2. Choisir Continue.  
**Résultat attendu :** « Error: Postal Code is required »; étape inchangée.  
**Critère de réussite :** Aucun récapitulatif n’est accessible sans code postal.

### TC-CHK-06 — Commande finalisée avec panier vide

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-06  
**Risque(s) couvert(s) :** RISK-CHK-03
**Type :** Non passant  
**Priorité :** P1
**Tags :** `@negative @regression @checkout`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Ouvrir Checkout depuis le panier vide. 2. Saisir les informations. 3. Continuer. 4. Relever les montants. 5. Choisir Finish.  
**Résultat attendu :** Sous-total 0 $, total 0,00 $, puis confirmation de commande.  
**Critère de réussite :** Le parcours vide observé aboutit sans article.

### TC-CHK-07 — Nom impossible à renseigner pour problem_user

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-07  
**Risque(s) couvert(s) :** RISK-CHK-01, RISK-CHK-04
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @checkout`

**Préconditions :** `problem_user` à l’étape d’informations avec un produit au panier.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Saisir prénom, nom et code postal. 2. Relire les champs. 3. Choisir Continue.  
**Résultat attendu :** Le nom reste vide; « Error: Last Name is required » s’affiche; pas de récapitulatif.  
**Critère de réussite :** Le défaut est visible sans forcer ni contourner le champ.

### TC-CHK-08 — Finish inopérant pour error_user

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-08  
**Risque(s) couvert(s) :** RISK-CHK-01
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @checkout`

**Préconditions :** `error_user` au récapitulatif avec Backpack au panier et informations acceptées.  
**Données de test :** Jean / Dupont / 75001; l’étape 2 doit avoir été atteinte par les interactions normales de l’interface.

**Étapes :** 1. Vérifier le récapitulatif. 2. Choisir Finish. 3. Observer l’adresse et les messages.  
**Résultat attendu :** L’adresse reste `/checkout-step-two.html`, aucune confirmation et aucun message d’erreur visible.  
**Critère de réussite :** Le clic n’achève pas la commande.

### Session

### TC-SESSION-01 — Conservation après rafraîchissement

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-01  
**Risque(s) couvert(s) :** RISK-CART-02, RISK-SESSION-01
**Type :** Passant  
**Priorité :** P0
**Tags :** `@positive @smoke @regression @session`

**Préconditions :** `standard_user` connecté, Backpack ajouté.  
**Données de test :** badge 1.

**Étapes :** 1. Rafraîchir Inventory. 2. Contrôler la page et le badge. 3. Ouvrir Cart.  
**Résultat attendu :** L’utilisateur reste connecté; badge 1 et Backpack sont conservés.  
**Critère de réussite :** Session et état panier survivent au rafraîchissement.

### TC-SESSION-02 — Déconnexion explicite

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-02  
**Risque(s) couvert(s) :** RISK-SESSION-02
**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive @smoke @regression @session`

**Préconditions :** `standard_user` connecté.  
**Données de test :** aucune.

**Étapes :** 1. Ouvrir le menu. 2. Choisir Logout.  
**Résultat attendu :** La page de connexion est affichée.  
**Critère de réussite :** Inventory n’est plus affichée et l’adresse revient à `/`.

### TC-SESSION-03 — Refus d’une route protégée après logout

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-03  
**Risque(s) couvert(s) :** RISK-AUTH-02, RISK-SESSION-02
**Type :** Erreur  
**Priorité :** P0  
**Tags :** `@error @regression @session`

**Préconditions :** Une connexion nominale vient d’être fermée par Logout.  
**Données de test :** `/cart.html`.

**Étapes :** 1. Demander directement la route du panier.  
**Résultat attendu :** La connexion est présentée avec « Epic sadface: You can only access '/cart.html' when you are logged in. »  
**Critère de réussite :** Aucun contenu du panier protégé n’est accessible.

### TC-SESSION-04 — Réinitialisation de l’état applicatif

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-04  
**Risque(s) couvert(s) :** RISK-SESSION-03
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @session`

**Préconditions :** `standard_user` connecté avec Backpack au panier.  
**Données de test :** badge initial 1.

**Étapes :** 1. Ouvrir le menu. 2. Choisir Reset App State. 3. Fermer le menu et ouvrir Cart.  
**Résultat attendu :** Le badge disparaît et Cart est vide; la session reste sur l’espace authentifié.  
**Critère de réussite :** L’état d’achat est remis à zéro sans logout.

## 9. Matrice Passant / Non passant / Erreur

Un tiret signifie qu’aucun comportement « non passant » distinct et pertinent n’a été observé pour le domaine; les dégradations explicites sont classées Erreur.

| Fonctionnalité | Passant | Non passant | Erreur |
|---|---|---|---|
| Authentification | TC-AUTH-01 | TC-AUTH-02 | TC-AUTH-03, TC-AUTH-04, TC-AUTH-05 |
| Catalogue | TC-CAT-01, TC-CAT-02 | — | TC-CAT-03, TC-CAT-04 |
| Tri | TC-TRI-01, TC-TRI-02, TC-TRI-03, TC-TRI-04 | — | TC-TRI-05, TC-TRI-06 |
| Panier | TC-PAN-01, TC-PAN-02, TC-PAN-03 | TC-PAN-04 | TC-PAN-05, TC-PAN-06 |
| Checkout | TC-CHK-01, TC-CHK-02 | TC-CHK-06 | TC-CHK-03, TC-CHK-04, TC-CHK-05, TC-CHK-07, TC-CHK-08 |
| Session | TC-SESSION-01, TC-SESSION-02, TC-SESSION-04 | — | TC-SESSION-03 |

## 10. Priorisation

| Priorité | Définition appliquée | Nombre |
|---|---|---:|
| P0 | Garde-barrières d’accès, panier, commande, montant, persistance, logout et protection post-logout | 7 |
| P1 | Comportement fonctionnel important, validation ou risque élevé hors garde-barrière | 22 |
| P2 | Ressource inexistante ou caractérisation spéciale de faible risque | 4 |

Les P0 sont : TC-AUTH-01, TC-PAN-01, TC-CHK-01, TC-CHK-02, TC-SESSION-01, TC-SESSION-02 et TC-SESSION-03.

## 11. Tags

| Tag | Usage |
|---|---|
| `@positive` | Parcours passant |
| `@negative` | Parcours alternatif/refusé non explicitement en erreur |
| `@error` | Validation ou dégradation explicite |
| `@smoke` | Sous-ensemble critique rapide |
| `@regression` | Cas à rejouer lors d’une campagne complète |
| `@auth`, `@catalog`, `@sorting`, `@cart`, `@checkout`, `@session` | Domaine fonctionnel propriétaire |

Chaque cas porte exactement un tag de nature, au moins un tag de campagne et son tag de domaine.

La Smoke contient sept cas : TC-AUTH-01, TC-CAT-01, TC-PAN-01, TC-CHK-01, TC-CHK-02, TC-SESSION-01 et TC-SESSION-02. Elle vérifie l’accès, le catalogue, la sélection, la commande, l’exactitude financière, la persistance et la fermeture de session. Les refus et dégradations spéciales restent dans la Regression afin que la Smoke demeure ciblée. Les 33 cas portent `@regression`.

## 12. Risques et comportements spécifiques SauceDemo

- `locked_out_user` est volontairement refusé; ce n’est pas une panne de données de test.
- `problem_user` affiche six images `sl-404`, ne réordonne pas le catalogue, n’ajoute que trois produits sur six et ne conserve pas le nom au checkout.
- `error_user` ne réordonne pas le catalogue, n’ajoute que les mêmes trois produits et laisse Finish sans effet ni message visible.
- Le panier vide peut entrer dans le checkout et produire une confirmation à 0,00 $; le plan conserve ce comportement observé comme parcours non passant, sans supposer un blocage inexistant.
- Une fiche inconnue affiche un faux produit « ITEM NOT FOUND » avec un prix atypique; la vérification porte sur le signalement et le retour, pas sur une hypothétique page HTTP 404.
- Les défauts spéciaux peuvent évoluer avec la version publique de la démo; une nouvelle exploration est recommandée avant automatisation.
- Les montants et le copyright dépendent de l’état public de l’application; les valeurs présentées sont celles observées à la date de référence.

### Automatisabilité future

- Les 33 cas sont automatisables avec des interactions utilisateur et des observations déterministes dans Chromium; aucun ne requiert de manipulation du DOM, d’injection de script ou de comparaison visuelle subjective.
- Les cas de caractérisation TC-CAT-04, TC-TRI-05, TC-TRI-06, TC-PAN-05, TC-PAN-06, TC-CHK-07 et TC-CHK-08 sont volontairement couplés à la version publique de la démo. Ils sont déterministes à la date de référence mais devront être reconfirmés avant implémentation si SauceDemo évolue.
- TC-CAT-03 dépend d’une navigation directe vers une référence inexistante et reste reproductible depuis une session authentifiée.
- TC-CHK-02 utilise des montants observés exacts; son oracle devra comparer les lignes, le sous-total, la taxe et le total, sans dépendre d’une observation visuelle.
- TC-CHK-08 doit construire l’étape 2 par le parcours normal; aucun état interne ne doit être forcé. Si ce parcours n’est plus accessible lors de la prochaine exploration, le cas devra être révisé plutôt que contourné.

## Synthèse chiffrée

| Indicateur | Valeur |
|---|---:|
| Fonctionnalités | 6 |
| User Stories | 6 |
| Critères d’acceptation | 32 |
| Cas de test | 33 |
| Cas passants | 15 |
| Cas non passants | 3 |
| Cas d’erreur | 15 |
| P0 / P1 / P2 | 7 / 22 / 4 |
| Smoke | 7 |
| Regression | 33 |
| Critères couverts | 32 / 32 |
| Taux de couverture des critères | 100 % |
