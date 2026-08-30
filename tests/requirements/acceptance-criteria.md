# Critères d’acceptation — SauceDemo

Les comportements marqués « dégradé spécial » sont volontairement exposés par SauceDemo via `problem_user` ou `error_user`; ils sont documentés comme tests de caractérisation de résultats observés et non comme comportements nominaux souhaités. Le refus de `locked_out_user` est, à l’inverse, une règle fonctionnelle attendue du compte verrouillé.

## US-01 — Authentification

### AC-AUTH-01 — Connexion nominale
- **Description :** un utilisateur standard valide atteint le catalogue.
- **Étant donné** la page de connexion dans une session vierge, **quand** `standard_user` saisit `secret_sauce` et se connecte, **alors** la page Inventory est affichée sans erreur.
- **Type de comportement :** Passant.

### AC-AUTH-02 — Identifiants inconnus
- **Description :** une combinaison inconnue est refusée.
- **Étant donné** la page de connexion, **quand** des identifiants inconnus sont soumis, **alors** l’accès est refusé et le message « Username and password do not match any user in this service » est affiché.
- **Type de comportement :** Non passant.

### AC-AUTH-03 — Nom obligatoire
- **Description :** le nom d’utilisateur est obligatoire.
- **Étant donné** la page de connexion, **quand** le formulaire est soumis sans nom d’utilisateur, **alors** le message « Username is required » est affiché.
- **Type de comportement :** Erreur.

### AC-AUTH-04 — Mot de passe obligatoire
- **Description :** le mot de passe est obligatoire.
- **Étant donné** un nom d’utilisateur saisi, **quand** le formulaire est soumis sans mot de passe, **alors** le message « Password is required » est affiché.
- **Type de comportement :** Erreur.

### AC-AUTH-05 — Compte verrouillé
- **Description :** le compte verrouillé ne peut pas ouvrir de session.
- **Étant donné** `locked_out_user`, **quand** le mot de passe valide est soumis, **alors** l’utilisateur reste sur la connexion et le message « Sorry, this user has been locked out » est affiché.
- **Type de comportement :** Erreur — règle fonctionnelle de refus attendue.

## US-02 — Catalogue

### AC-CAT-01 — Liste des produits
- **Description :** le catalogue nominal présente six articles avec nom, description, prix et image propres.
- **Étant donné** `standard_user` connecté, **quand** Inventory s’affiche, **alors** les six produits observés et leurs prix sont visibles.
- **Type de comportement :** Passant.

### AC-CAT-02 — Détail et retour
- **Description :** une fiche reprend les informations du produit et permet de revenir à Inventory.
- **Étant donné** le catalogue, **quand** l’utilisateur ouvre « Sauce Labs Backpack » puis choisit « Back to products », **alors** la fiche correcte s’affiche puis le catalogue est restauré.
- **Type de comportement :** Passant.

### AC-CAT-03 — Produit inexistant
- **Description :** une référence absente est signalée explicitement.
- **Étant donné** une session authentifiée, **quand** une fiche sans identifiant valide est demandée, **alors** la page affiche « ITEM NOT FOUND » et permet le retour aux produits.
- **Type de comportement :** Erreur.

### AC-CAT-04 — Images dégradées de problem_user
- **Description :** `problem_user` reçoit la même image d’erreur pour les six produits.
- **Étant donné** `problem_user` connecté, **quand** le catalogue s’affiche, **alors** les six noms et prix sont présents mais toutes les images utilisent la ressource `sl-404`.
- **Type de comportement :** Erreur — dégradé spécial observé.

## US-03 — Tri

### AC-SORT-01 — Nom croissant
- **Étant donné** le catalogue nominal, **quand** « Name (A to Z) » est choisi, **alors** les noms sont en ordre alphabétique croissant.
- **Type de comportement :** Passant.

### AC-SORT-02 — Nom décroissant
- **Étant donné** le catalogue nominal, **quand** « Name (Z to A) » est choisi, **alors** les noms sont en ordre alphabétique décroissant.
- **Type de comportement :** Passant.

### AC-SORT-03 — Prix croissant
- **Étant donné** le catalogue nominal, **quand** « Price (low to high) » est choisi, **alors** les prix vont de 7,99 $ à 49,99 $ sans décroissance.
- **Type de comportement :** Passant.

### AC-SORT-04 — Prix décroissant
- **Étant donné** le catalogue nominal, **quand** « Price (high to low) » est choisi, **alors** les prix vont de 49,99 $ à 7,99 $ sans croissance.
- **Type de comportement :** Passant.

### AC-SORT-05 — Tri inopérant de problem_user
- **Étant donné** `problem_user` connecté, **quand** chaque option autre que A–Z est choisie, **alors** l’ordre initial des six produits reste inchangé.
- **Type de comportement :** Erreur — dégradé spécial observé.

### AC-SORT-06 — Tri inopérant de error_user
- **Étant donné** `error_user` connecté, **quand** chaque option autre que A–Z est choisie, **alors** l’ordre initial des six produits reste inchangé.
- **Type de comportement :** Erreur — dégradé spécial observé.

## US-04 — Panier

### AC-CART-01 — Ajout
- **Étant donné** un produit non sélectionné, **quand** `standard_user` l’ajoute, **alors** le badge augmente, le bouton devient « Remove » et l’article apparaît au panier en quantité 1.
- **Type de comportement :** Passant.

### AC-CART-02 — Retrait
- **Étant donné** un produit au panier, **quand** il est retiré, **alors** il disparaît et le badge diminue ou disparaît à zéro.
- **Type de comportement :** Passant.

### AC-CART-03 — Conservation pendant la navigation
- **Étant donné** un article ajouté, **quand** l’utilisateur navigue entre Inventory, une fiche et Cart, **alors** la sélection et le badge sont conservés.
- **Type de comportement :** Passant.

### AC-CART-04 — Panier vide
- **Étant donné** un panier vide, **quand** Cart est ouvert puis Checkout sélectionné, **alors** aucun article n’est listé et SauceDemo autorise néanmoins l’étape d’informations.
- **Type de comportement :** Non passant — parcours alternatif observé.

### AC-CART-05 — Ajouts partiels des comptes spéciaux
- **Étant donné** `problem_user` ou `error_user`, **quand** les six boutons d’ajout sont sollicités, **alors** seuls Backpack, Bike Light et Onesie sont ajoutés; les trois autres restent « Add to cart » sans message visible.
- **Type de comportement :** Erreur — dégradé spécial observé.

## US-05 — Checkout

### AC-CHK-01 — Commande nominale
- **Étant donné** un article au panier et des informations valides, **quand** `standard_user` continue, vérifie le récapitulatif et termine, **alors** « Checkout: Complete! » et « Thank you for your order! » sont affichés.
- **Type de comportement :** Passant.

### AC-CHK-02 — Calcul des montants
- **Étant donné** des articles au checkout, **quand** le récapitulatif s’affiche, **alors** le sous-total égale la somme des prix, la taxe est affichée et le total égale sous-total plus taxe.
- **Type de comportement :** Passant.

### AC-CHK-03 — Prénom obligatoire
- **Étant donné** l’étape d’informations, **quand** aucune information n’est saisie et Continue est choisi, **alors** « First Name is required » est affiché et l’étape ne change pas.
- **Type de comportement :** Erreur.

### AC-CHK-04 — Nom obligatoire
- **Étant donné** seulement un prénom, **quand** Continue est choisi, **alors** « Last Name is required » est affiché et l’étape ne change pas.
- **Type de comportement :** Erreur.

### AC-CHK-05 — Code postal obligatoire
- **Étant donné** un prénom et un nom, **quand** Continue est choisi sans code postal, **alors** « Postal Code is required » est affiché et l’étape ne change pas.
- **Type de comportement :** Erreur.

### AC-CHK-06 — Commande vide
- **Étant donné** un panier vide, **quand** des informations valides sont fournies et Finish est choisi, **alors** SauceDemo affiche un sous-total de 0 $, un total de 0,00 $ et confirme néanmoins la commande.
- **Type de comportement :** Non passant — parcours alternatif observé.

### AC-CHK-07 — Nom non saisissable de problem_user
- **Étant donné** `problem_user` à l’étape d’informations, **quand** un nom est saisi, **alors** le champ reste vide et Continue affiche « Last Name is required ».
- **Type de comportement :** Erreur — dégradé spécial observé.

### AC-CHK-08 — Finalisation inopérante de error_user
- **Étant donné** `error_user` au récapitulatif avec des informations acceptées, **quand** Finish est choisi, **alors** l’utilisateur reste sur `checkout-step-two.html` sans confirmation ni message visible.
- **Type de comportement :** Erreur — dégradé spécial observé.

## US-06 — Session

### AC-SESSION-01 — Conservation après rafraîchissement
- **Étant donné** `standard_user` connecté avec un article au panier, **quand** Inventory est rafraîchi, **alors** la session, le catalogue et le badge sont conservés.
- **Type de comportement :** Passant.

### AC-SESSION-02 — Déconnexion
- **Étant donné** une session authentifiée, **quand** Logout est choisi dans le menu, **alors** la page de connexion est affichée.
- **Type de comportement :** Passant.

### AC-SESSION-03 — Route protégée après déconnexion
- **Étant donné** une session déconnectée, **quand** `/cart.html` est demandé directement, **alors** l’accès est refusé avec « You can only access '/cart.html' when you are logged in ».
- **Type de comportement :** Erreur.

### AC-SESSION-04 — Réinitialisation
- **Étant donné** une session authentifiée avec un article sélectionné, **quand** « Reset App State » est choisi, **alors** le panier et son badge sont vidés sans déconnecter l’utilisateur.
- **Type de comportement :** Passant.

## Récapitulatif

| User Story | Nombre de critères |
|---|---:|
| US-01 | 5 |
| US-02 | 4 |
| US-03 | 6 |
| US-04 | 5 |
| US-05 | 8 |
| US-06 | 4 |
| **Total** | **32** |
