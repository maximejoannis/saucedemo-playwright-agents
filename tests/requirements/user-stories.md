# User Stories — SauceDemo

## Objectif

Décrire le besoin utilisateur observable sur SauceDemo avant toute automatisation et fournir le premier niveau de traçabilité vers les critères d’acceptation et les cas de test.

## Périmètre

Le périmètre couvre les six domaines demandés : authentification, catalogue, tri, panier, checkout et session. L’étude repose sur Chromium, une session vierge par scénario, et les comptes `standard_user`, `locked_out_user`, `problem_user` et `error_user` avec le mot de passe `secret_sauce`.

Les liens externes, la génération de PDF, la performance, l’accessibilité exhaustive, la compatibilité multi-navigateurs et les autres comptes affichés sur la page de connexion sont hors périmètre. Aucun domaine majeur supplémentaire n’a été ajouté : la consultation d’une fiche produit est rattachée au catalogue et le menu à la session.

## Fonctionnalités et relation avec les User Stories

| Fonctionnalité | User Story | Besoin couvert |
|---|---|---|
| Authentification | US-01 | Accéder de façon contrôlée à l’espace marchand |
| Catalogue | US-02 | Consulter les produits et leurs informations |
| Tri | US-03 | Ordonner les produits selon le nom ou le prix |
| Panier | US-04 | Constituer et revoir une sélection |
| Checkout | US-05 | Renseigner la livraison et finaliser une commande |
| Session | US-06 | Conserver ou terminer explicitement son contexte utilisateur |

## US-01 — Authentification

En tant qu’utilisateur,
je veux m’authentifier avec mes identifiants,
afin d’accéder de manière contrôlée au catalogue.

## US-02 — Catalogue

En tant qu’acheteur,
je veux consulter la liste et le détail des produits,
afin de choisir des articles en connaissance de cause.

## US-03 — Tri

En tant qu’acheteur,
je veux trier le catalogue par nom ou par prix,
afin de retrouver plus facilement les produits qui m’intéressent.

## US-04 — Panier

En tant qu’acheteur,
je veux ajouter, retirer et revoir les articles de mon panier,
afin de préparer ma commande.

## US-05 — Checkout

En tant qu’acheteur,
je veux fournir mes informations de livraison, vérifier le montant et confirmer ma commande,
afin de terminer mon achat.

## US-06 — Session

En tant qu’utilisateur authentifié,
je veux que mon contexte soit conservé pendant mon parcours et pouvoir me déconnecter ou le réinitialiser,
afin de maîtriser l’état et l’accès à ma session.
