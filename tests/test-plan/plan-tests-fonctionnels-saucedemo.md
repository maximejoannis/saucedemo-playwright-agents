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

## 7. Cas de test

### Authentification

### TC-AUTH-01 — Connexion avec un utilisateur standard

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-01  
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
**Type :** Erreur  
**Priorité :** P1  
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
**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error @regression @sorting`

**Préconditions :** `problem_user` connecté.  
**Données de test :** Z–A, prix croissant, prix décroissant.

**Étapes :** 1. Noter l’ordre initial. 2. Choisir successivement chaque option. 3. Relever l’ordre après chaque choix.  
**Résultat attendu :** L’ordre A–Z initial ne change jamais.  
**Critère de réussite :** Les trois échecs de réordonnancement sont reproduits.

### TC-TRI-06 — Tri inopérant de error_user

**User Story :** US-03  
**Critère(s) couvert(s) :** AC-SORT-06  
**Type :** Erreur  
**Priorité :** P1  
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
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Bike Light.

**Étapes :** 1. Ajouter Bike Light. 2. Ouvrir une fiche puis revenir. 3. Ouvrir Cart. 4. Revenir à Inventory.  
**Résultat attendu :** Badge 1 et Bike Light restent présents à chaque étape pertinente.  
**Critère de réussite :** Aucune navigation interne ne perd la sélection.

### TC-PAN-04 — Accès au checkout avec panier vide

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-04  
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
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @checkout`

**Préconditions :** Les six produits nominaux au panier.  
**Données de test :** Jean / Dupont / 75001; somme attendue 129,94 $.

**Étapes :** 1. Accéder au checkout. 2. Renseigner les informations. 3. Continuer. 4. Additionner les prix et comparer sous-total, taxe et total.  
**Résultat attendu :** Sous-total 129,94 $, taxe 10,40 $, total 140,34 $.  
**Critère de réussite :** Sous-total = somme des lignes et total = sous-total + taxe.

### TC-CHK-03 — Prénom obligatoire

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-03  
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
**Type :** Non passant  
**Priorité :** P2  
**Tags :** `@negative @regression @checkout`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Ouvrir Checkout depuis le panier vide. 2. Saisir les informations. 3. Continuer. 4. Relever les montants. 5. Choisir Finish.  
**Résultat attendu :** Sous-total 0 $, total 0,00 $, puis confirmation de commande.  
**Critère de réussite :** Le parcours vide observé aboutit sans article.

### TC-CHK-07 — Nom impossible à renseigner pour problem_user

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-07  
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
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @session`

**Préconditions :** `standard_user` connecté, Backpack ajouté.  
**Données de test :** badge 1.

**Étapes :** 1. Rafraîchir Inventory. 2. Contrôler la page et le badge. 3. Ouvrir Cart.  
**Résultat attendu :** L’utilisateur reste connecté; badge 1 et Backpack sont conservés.  
**Critère de réussite :** Session et état panier survivent au rafraîchissement.

### TC-SESSION-02 — Déconnexion explicite

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-02  
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
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @session`

**Préconditions :** `standard_user` connecté avec Backpack au panier.  
**Données de test :** badge initial 1.

**Étapes :** 1. Ouvrir le menu. 2. Choisir Reset App State. 3. Fermer le menu et ouvrir Cart.  
**Résultat attendu :** Le badge disparaît et Cart est vide; la session reste sur l’espace authentifié.  
**Critère de réussite :** L’état d’achat est remis à zéro sans logout.

## 8. Matrice Passant / Non passant / Erreur

Un tiret signifie qu’aucun comportement « non passant » distinct et pertinent n’a été observé pour le domaine; les dégradations explicites sont classées Erreur.

| Fonctionnalité | Passant | Non passant | Erreur |
|---|---|---|---|
| Authentification | TC-AUTH-01 | TC-AUTH-02 | TC-AUTH-03, TC-AUTH-04, TC-AUTH-05 |
| Catalogue | TC-CAT-01, TC-CAT-02 | — | TC-CAT-03, TC-CAT-04 |
| Tri | TC-TRI-01, TC-TRI-02, TC-TRI-03, TC-TRI-04 | — | TC-TRI-05, TC-TRI-06 |
| Panier | TC-PAN-01, TC-PAN-02, TC-PAN-03 | TC-PAN-04 | TC-PAN-05, TC-PAN-06 |
| Checkout | TC-CHK-01, TC-CHK-02 | TC-CHK-06 | TC-CHK-03, TC-CHK-04, TC-CHK-05, TC-CHK-07, TC-CHK-08 |
| Session | TC-SESSION-01, TC-SESSION-02, TC-SESSION-04 | — | TC-SESSION-03 |

## 9. Priorisation

| Priorité | Définition appliquée | Nombre |
|---|---|---:|
| P0 | Accès nominal, ajout, commande, logout et protection post-logout | 5 |
| P1 | Comportement fonctionnel important ou défaut spécial à surveiller | 26 |
| P2 | Ressource inexistante ou commande vide secondaire | 2 |

Les P0 sont : TC-AUTH-01, TC-PAN-01, TC-CHK-01, TC-SESSION-02 et TC-SESSION-03.

## 10. Tags

| Tag | Usage |
|---|---|
| `@positive` | Parcours passant |
| `@negative` | Parcours alternatif/refusé non explicitement en erreur |
| `@error` | Validation ou dégradation explicite |
| `@smoke` | Sous-ensemble critique rapide |
| `@regression` | Cas à rejouer lors d’une campagne complète |
| `@auth`, `@catalog`, `@sorting`, `@cart`, `@checkout`, `@session` | Domaine fonctionnel propriétaire |

Chaque cas porte exactement un tag de nature, au moins un tag de campagne et son tag de domaine.

La Smoke est volontairement limitée à cinq cas : TC-AUTH-01, TC-CAT-01, TC-PAN-01, TC-CHK-01 et TC-SESSION-02. Elle vérifie l’accès, l’affichage du catalogue, la sélection, la commande et la fermeture de session. Les refus et dégradations spéciales restent dans la Regression afin que la Smoke demeure courte. Les 33 cas portent `@regression`.

## 11. Risques et comportements spécifiques SauceDemo

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
| P0 / P1 / P2 | 5 / 26 / 2 |
| Smoke | 5 |
| Regression | 33 |
| Critères couverts | 32 / 32 |
| Taux de couverture des critères | 100 % |
