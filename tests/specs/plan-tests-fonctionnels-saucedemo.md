# Plan de tests fonctionnels — SauceDemo

## Périmètre et principes

- Application : `https://www.saucedemo.com/`
- Exploration réelle : Chromium, 27 août 2026.
- Compte nominal : `standard_user` / `secret_sauce`.
- Comptes spéciaux observés : `locked_out_user`, `problem_user`, `error_user` / `secret_sauce`.
- Chaque scénario part d’un contexte navigateur vierge, sans cookie, stockage, session ni panier préexistant.
- Les anomalies des comptes spéciaux sont décrites telles qu’observées, sans manipulation du DOM ou du JavaScript.

## Matrice de couverture

| Fonctionnalité | Passant | Non passant | Erreur |
| --- | --- | --- | --- |
| Authentification | ✅ TC-AUTH-01 | ✅ TC-AUTH-02 | ✅ TC-AUTH-03, TC-AUTH-04, TC-AUTH-05, TC-AUTH-06 |
| Catalogue | ✅ TC-CAT-01, TC-CAT-02 | ✅ TC-CAT-03 | ✅ TC-CAT-04 |
| Tri | ✅ TC-TRI-01, TC-TRI-02 | ✅ TC-TRI-03 | ✅ TC-TRI-04 |
| Panier | ✅ TC-PAN-01, TC-PAN-02, TC-PAN-03 | ✅ TC-PAN-04 | ✅ TC-PAN-05 |
| Checkout | ✅ TC-CHK-01, TC-CHK-05, TC-CHK-06 | ✅ TC-CHK-07 | ✅ TC-CHK-02, TC-CHK-03, TC-CHK-04 |
| Session | ✅ TC-SESSION-01 | ✅ TC-SESSION-02 | ✅ TC-SESSION-03 |

## Données de référence

Le catalogue nominal contient : Backpack `$29.99`, Bike Light `$9.99`, Bolt T-Shirt `$15.99`, Fleece Jacket `$49.99`, Onesie `$7.99`, T-Shirt (Red) `$15.99`.

## Authentification

### TC-AUTH-01 — Connexion de l’utilisateur standard

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@auth`

**État initial :** page de connexion dans un contexte vierge.  
**Données de test :** `standard_user` / `secret_sauce`.

**Étapes :**
1. Renseigner Username et Password, puis cliquer sur Login.
2. Examiner la page obtenue.

**Résultats attendus :** `/inventory.html`, titre « Products », menu, panier et six produits sont affichés sans erreur.  
**Critères de réussite :** la session est ouverte et tous les éléments nominaux sont présents ; toute erreur ou absence constitue un échec.

### TC-AUTH-02 — Refus d’identifiants incorrects

**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative` `@regression` `@auth`

**État initial :** page de connexion vierge.  
**Données de test :** `bad_user` / `wrong`.

**Étapes :**
1. Renseigner les identifiants incorrects et cliquer sur Login.

**Résultats attendus :** la navigation vers le catalogue n’aboutit pas et la page de connexion reste affichée.  
**Critères de réussite :** l’accès est refusé ; l’accès au catalogue constitue un échec.

### TC-AUTH-03 — Message d’erreur pour l’utilisateur verrouillé

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@regression` `@auth`

**État initial :** page de connexion vierge.  
**Données de test :** `locked_out_user` / `secret_sauce`.

**Étapes :**
1. Renseigner les identifiants et cliquer sur Login.

**Résultats attendus :** `Epic sadface: Sorry, this user has been locked out.` est affiché et la connexion échoue.  
**Critères de réussite :** le message exact est visible et `/inventory.html` n’est pas atteint.

### TC-AUTH-04 — Username obligatoire

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@auth`

**État initial :** page de connexion vierge.  
**Données de test :** Username vide ; Password `secret_sauce`.

**Étapes :**
1. Ne renseigner que Password puis cliquer sur Login.

**Résultats attendus :** `Epic sadface: Username is required` est affiché.  
**Critères de réussite :** le message exact apparaît et aucune session n’est créée.

### TC-AUTH-05 — Password obligatoire

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@auth`

**État initial :** page de connexion vierge.  
**Données de test :** Username `standard_user` ; Password vide.

**Étapes :**
1. Ne renseigner que Username puis cliquer sur Login.

**Résultats attendus :** `Epic sadface: Password is required` est affiché.  
**Critères de réussite :** le message exact apparaît et aucune session n’est créée.

### TC-AUTH-06 — Soumission du formulaire entièrement vide

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@auth`

**État initial :** page de connexion vierge.  
**Données de test :** Username et Password vides.

**Étapes :**
1. Cliquer sur Login sans saisir de donnée.

**Résultats attendus :** la validation s’arrête au premier champ et affiche `Epic sadface: Username is required`.  
**Critères de réussite :** le message exact apparaît et le catalogue reste inaccessible.

## Catalogue

### TC-CAT-01 — Affichage nominal du catalogue

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@catalog`

**État initial :** contexte vierge, connecté comme `standard_user`.  
**Données de test :** les six produits et prix de référence.

**Étapes :**
1. Vérifier le titre, le tri par défaut et chaque fiche (nom, description, image, prix, bouton).

**Résultats attendus :** exactement six fiches distinctes et complètes sont affichées, triées A–Z.  
**Critères de réussite :** noms, prix et composants correspondent aux références sans élément manquant.

### TC-CAT-02 — Consultation puis retour depuis le détail du Backpack

**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive` `@regression` `@catalog`

**État initial :** catalogue nominal ouvert avec `standard_user`.  
**Données de test :** Sauce Labs Backpack, `$29.99`.

**Étapes :**
1. Cliquer sur le nom du Backpack et vérifier sa fiche.
2. Cliquer sur Back to products.

**Résultats attendus :** le détail conserve nom, description et prix ; le retour rouvre le catalogue.  
**Critères de réussite :** aucune substitution de produit et retour fonctionnel.

### TC-CAT-03 — Le parcours produit n’aboutit pas au produit choisi avec problem_user

**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative` `@catalog` `@regression`

**État initial :** contexte vierge, connecté comme `problem_user`.  
**Données de test :** lien « Sauce Labs Backpack ».

**Étapes :**
1. Cliquer sur le nom du Backpack.
2. Relever l’URL, le nom et le prix du détail affiché.

**Résultats attendus :** l’action n’aboutit pas au Backpack : `/inventory-item.html?id=5` affiche « Sauce Labs Fleece Jacket » à `$49.99`.  
**Critères de réussite :** l’incohérence observée est reproductible ; l’affichage du Backpack ferait échouer ce test de caractérisation.

### TC-CAT-04 — Erreur visible pour un identifiant produit inexistant

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@catalog` `@regression`

**État initial :** contexte vierge, connecté comme `standard_user`.  
**Données de test :** URL `/inventory-item.html?id=999`.

**Étapes :**
1. Ouvrir directement l’URL du produit inexistant.
2. Examiner la fiche affichée.

**Résultats attendus :** la page affiche `ITEM NOT FOUND` et un texte d’indisponibilité, avec retour au catalogue.  
**Critères de réussite :** l’erreur utilisateur est explicite et aucun produit réel n’est présenté comme l’élément demandé.

## Tri

### TC-TRI-01 — Tris alphabétiques A–Z et Z–A

**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive` `@regression` `@catalog` `@sorting`

**État initial :** catalogue nominal ouvert.  
**Données de test :** options Name (A to Z), Name (Z to A).

**Étapes :**
1. Choisir Z–A et relever les noms.
2. Choisir A–Z et relever les noms.

**Résultats attendus :** Z–A donne T-Shirt (Red), Onesie, Fleece Jacket, Bolt T-Shirt, Bike Light, Backpack ; A–Z donne l’ordre inverse.  
**Critères de réussite :** les six produits sont présents dans l’ordre exact pour chaque option.

### TC-TRI-02 — Tris de prix croissant et décroissant

**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive` `@regression` `@catalog` `@sorting`

**État initial :** catalogue nominal ouvert.  
**Données de test :** Price low to high, puis high to low.

**Étapes :**
1. Appliquer chaque option et relever produits et prix.

**Résultats attendus :** croissant : `$7.99`, `$9.99`, `$15.99`, `$15.99`, `$29.99`, `$49.99` ; décroissant : ordre inverse.  
**Critères de réussite :** prix monotones et association produit/prix inchangée.

### TC-TRI-03 — Tri Z–A sans effet avec problem_user

**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative` `@sorting` `@regression`

**État initial :** catalogue ouvert avec `problem_user`.  
**Données de test :** option Name (Z to A).

**Étapes :**
1. Choisir Z–A et relever l’ordre affiché.

**Résultats attendus :** la sélection n’aboutit pas au tri demandé ; l’ordre reste Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, T-Shirt (Red).  
**Critères de réussite :** l’absence de réordonnancement observée est reproduite sans manipulation technique.

### TC-TRI-04 — Comportement dégradé du tri avec error_user

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@sorting` `@regression`

**État initial :** catalogue ouvert avec `error_user`.  
**Données de test :** option Name (Z to A).

**Étapes :**
1. Choisir Z–A et relever l’ordre résultant.

**Résultats attendus :** le catalogue reste en A–Z malgré l’action, comportement dégradé observable du compte d’erreur.  
**Critères de réussite :** les six noms restent dans l’ordre initial et aucun faux ordre Z–A n’est accepté.

## Panier

### TC-PAN-01 — Ajout de deux produits et compteur

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@cart`

**État initial :** catalogue nominal, panier vide.  
**Données de test :** Backpack et Bike Light.

**Étapes :**
1. Ajouter Backpack, puis Bike Light.
2. Ouvrir le panier.

**Résultats attendus :** boutons Remove, badge `2`, deux lignes de quantité `1` aux prix `$29.99` et `$9.99`.  
**Critères de réussite :** contenu et compteur reflètent exactement les deux ajouts.

### TC-PAN-02 — Suppression jusqu’au panier vide

**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive` `@regression` `@cart`

**État initial :** Backpack et Bike Light dans le panier.  
**Données de test :** les deux lignes produit.

**Étapes :**
1. Supprimer Bike Light, puis Backpack.

**Résultats attendus :** badge `1` après la première suppression, puis aucune ligne et aucun badge après la seconde.  
**Critères de réussite :** chaque suppression décrémente exactement le panier.

### TC-PAN-03 — Conservation entre catalogue et panier

**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive` `@regression` `@cart`

**État initial :** catalogue nominal, Backpack ajouté.  
**Données de test :** Backpack.

**Étapes :**
1. Ouvrir le panier, cliquer Continue Shopping, puis rouvrir le panier.

**Résultats attendus :** bouton Remove et badge `1` persistent ; Backpack est toujours dans le panier.  
**Critères de réussite :** aucune perte ou duplication durant la navigation.

### TC-PAN-04 — Checkout accessible malgré un panier vide

**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative` `@cart` `@checkout`

**État initial :** connecté comme `standard_user`, panier vide.  
**Données de test :** aucun produit ; informations `Jean`, `Dupont`, `75001`.

**Étapes :**
1. Ouvrir le panier vide et cliquer Checkout.
2. Renseigner les trois champs puis continuer.

**Résultats attendus :** l’action non nominale n’est pas bloquée : l’overview est atteint, affiche `Item total: $0` et Finish reste visible.  
**Critères de réussite :** le comportement réellement observé est reproduit ; toute ligne produit constituerait un échec.

### TC-PAN-05 — Ajouts refusés silencieusement avec error_user

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@cart` `@regression`

**État initial :** catalogue ouvert avec `error_user`, panier vide.  
**Données de test :** Bolt T-Shirt, puis Fleece Jacket.

**Étapes :**
1. Cliquer Add to cart sur Bolt T-Shirt puis Fleece Jacket.
2. Examiner boutons et badge.

**Résultats attendus :** les boutons restent Add to cart et le badge ne s’incrémente pas : les deux opérations échouent sans message.  
**Critères de réussite :** aucun des deux produits n’est ajouté et l’incohérence est observable.

## Checkout

### TC-CHK-01 — Accès au checkout depuis le panier

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@checkout`

**État initial :** Backpack dans le panier nominal.  
**Données de test :** Backpack.

**Étapes :**
1. Ouvrir le panier et cliquer Checkout.

**Résultats attendus :** « Checkout: Your Information », trois champs, Cancel, Continue et badge `1` sont visibles.  
**Critères de réussite :** `/checkout-step-one.html` est atteint avec tous les contrôles.

### TC-CHK-02 — First Name obligatoire

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@regression` `@checkout`

**État initial :** checkout information avec Backpack.  
**Données de test :** First Name vide, Last Name `Dupont`, Postal Code `75001`.

**Étapes :**
1. Renseigner les données puis cliquer Continue.

**Résultats attendus :** `Error: First Name is required` ; l’overview n’est pas atteint.  
**Critères de réussite :** message exact et maintien sur `/checkout-step-one.html`.

### TC-CHK-03 — Last Name obligatoire

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@regression` `@checkout`

**État initial :** checkout information avec Backpack.  
**Données de test :** First Name `Jean`, Last Name vide, Postal Code `75001`.

**Étapes :**
1. Renseigner les données puis cliquer Continue.

**Résultats attendus :** `Error: Last Name is required` ; l’overview n’est pas atteint.  
**Critères de réussite :** message exact et maintien sur `/checkout-step-one.html`.

### TC-CHK-04 — Postal Code obligatoire

**Type :** Erreur  
**Priorité :** P1  
**Tags :** `@error` `@negative` `@regression` `@checkout`

**État initial :** checkout information avec Backpack.  
**Données de test :** First Name `Jean`, Last Name `Dupont`, Postal Code vide.

**Étapes :**
1. Renseigner les données puis cliquer Continue.

**Résultats attendus :** `Error: Postal Code is required` ; l’overview n’est pas atteint.  
**Critères de réussite :** message exact et maintien sur `/checkout-step-one.html`.

### TC-CHK-05 — Cohérence du récapitulatif

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@checkout`

**État initial :** checkout avec un Backpack.  
**Données de test :** `Jean`, `Dupont`, `75001`.

**Étapes :**
1. Continuer vers l’overview et vérifier produit, paiement, livraison et montants.

**Résultats attendus :** quantité `1`, `$29.99`, `SauceCard #31337`, `Free Pony Express Delivery!`, sous-total `$29.99`, taxe `$2.40`, total `$32.39`.  
**Critères de réussite :** chaque valeur exacte est présente, avec Cancel et Finish.

### TC-CHK-06 — Finalisation d’une commande

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@checkout`

**État initial :** overview valide d’un Backpack.  
**Données de test :** commande décrite dans TC-CHK-05.

**Étapes :**
1. Cliquer Finish, vérifier la confirmation, puis Back Home.

**Résultats attendus :** « Checkout: Complete! », `Thank you for your order!`, texte d’expédition, Back Home et Generate PDF order ; retour catalogue sans badge.  
**Critères de réussite :** confirmation complète et panier remis à zéro.

### TC-CHK-07 — Annulation du checkout

**Type :** Non passant  
**Priorité :** P1  
**Tags :** `@negative` `@regression` `@checkout`

**État initial :** checkout avec un Backpack.  
**Données de test :** informations valides lors du second passage.

**Étapes :**
1. Annuler depuis Your Information.
2. Revenir jusqu’à Overview puis annuler.

**Résultats attendus :** la commande n’est pas finalisée ; la première annulation retourne au panier, la seconde au catalogue, avec Backpack et badge `1` conservés.  
**Critères de réussite :** aucune confirmation de commande et contenu du panier inchangé.

## Session / Logout

### TC-SESSION-01 — Logout normal

**Type :** Passant  
**Priorité :** P0  
**Tags :** `@positive` `@smoke` `@regression` `@session`

**État initial :** connecté comme `standard_user`.  
**Données de test :** action Logout du menu.

**Étapes :**
1. Ouvrir le menu et cliquer Logout.

**Résultats attendus :** retour à `https://www.saucedemo.com/` avec formulaire de connexion.  
**Critères de réussite :** la session est fermée et le catalogue n’est plus affiché.

### TC-SESSION-02 — Accès protégé refusé après logout

**Type :** Non passant  
**Priorité :** P0  
**Tags :** `@negative` `@regression` `@session`

**État initial :** se connecter puis effectuer Logout.  
**Données de test :** URL directe `/cart.html`.

**Étapes :**
1. Après Logout, ouvrir directement `/cart.html`.

**Résultats attendus :** la navigation vers le panier n’aboutit pas ; le formulaire de connexion reste affiché.  
**Critères de réussite :** aucune donnée protégée du panier n’est accessible.

### TC-SESSION-03 — Message d’accès interdit après logout

**Type :** Erreur  
**Priorité :** P0  
**Tags :** `@error` `@negative` `@regression` `@session`

**État initial :** se connecter puis effectuer Logout.  
**Données de test :** URL directe `/inventory.html`.

**Étapes :**
1. Après Logout, ouvrir directement `/inventory.html`.

**Résultats attendus :** la page de connexion affiche `Epic sadface: You can only access '/inventory.html' when you are logged in.`.  
**Critères de réussite :** message exact visible et catalogue inaccessible.

## Stratégie d’assertion

- Comparer strictement les messages d’erreur, titres fonctionnels, noms, prix, montants, quantités, badges et ordres explicitement attendus (`toHaveText`).
- N’utiliser une comparaison partielle que lorsque le scénario recherche volontairement une information dans un texte plus large ; ne jamais l’employer pour assouplir un contrôle.

## Critères globaux de sortie

- Chaque scénario est indépendant, reproductible dans un contexte vierge et possède un résultat observable.
- Chaque cellule de la matrice renvoie à au moins un scénario identifié et correctement tagué.
- Les anomalies des comptes spéciaux et du panier vide sont des observations de l’application réelle, non des comportements inventés.
- Toute divergence de navigation, texte, produit, ordre, quantité ou montant est consignée avec données, étape, résultat réel et attendu.
