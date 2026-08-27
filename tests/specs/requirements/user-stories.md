# Référentiel des exigences fonctionnelles reconstituées — SauceDemo

> Ces User Stories et critères d'acceptation ne constituent pas le backlog officiel de SauceDemo.  
> Ils ont été reconstitués à des fins de démonstration QA à partir du comportement observable de l'application et du plan de tests du projet.

Les critères ci-dessous décrivent les comportements fonctionnels attendus. Les scénarios qui reproduisent une anomalie propre à un compte spécial ou un comportement atypique sont documentés séparément comme tests de caractérisation dans la matrice de traçabilité.

## Authentification

### US-AUTH-01 — Authentification utilisateur

**Description :** contrôle de l'accès au catalogue et validation du formulaire de connexion.

**En tant qu'** utilisateur de SauceDemo  
**Je souhaite** pouvoir m'authentifier avec mes identifiants  
**Afin de** pouvoir accéder au catalogue lorsque mon compte est autorisé.

#### Critères d'acceptation

| ID         | Critère                                                                                                                     | Tests associés         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| AC-AUTH-01 | Après une authentification valide d'un utilisateur autorisé, le catalogue et ses six produits sont accessibles sans erreur. | TC-AUTH-01             |
| AC-AUTH-02 | Des identifiants incorrects ne donnent pas accès au catalogue.                                                              | TC-AUTH-02             |
| AC-AUTH-03 | Un compte verrouillé ne peut pas ouvrir de session et un message explicite indique son verrouillage.                        | TC-AUTH-03             |
| AC-AUTH-04 | La soumission sans nom d'utilisateur est refusée avec le message indiquant que ce champ est obligatoire.                    | TC-AUTH-04, TC-AUTH-06 |
| AC-AUTH-05 | La soumission sans mot de passe est refusée avec le message indiquant que ce champ est obligatoire.                         | TC-AUTH-05             |

## Catalogue

### US-CAT-01 — Consultation du catalogue

**Description :** affichage de l'offre produit, consultation d'un détail et traitement d'une référence inconnue.

**En tant qu'** utilisateur authentifié  
**Je souhaite** consulter les produits et leur détail  
**Afin de** pouvoir identifier correctement les articles proposés avant de les acheter.

#### Critères d'acceptation

| ID        | Critère                                                                                                                                                        | Tests associés |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| AC-CAT-01 | Le catalogue nominal présente exactement les six produits de référence avec leur nom, description, image, prix et action d'ajout, dans l'ordre A–Z par défaut. | TC-CAT-01      |
| AC-CAT-02 | L'ouverture d'un produit affiche le détail du produit choisi et permet de revenir au catalogue.                                                                | TC-CAT-02      |
| AC-CAT-03 | Une référence produit inexistante affiche une indisponibilité explicite, sans présenter un produit réel à sa place, et permet le retour au catalogue.          | TC-CAT-04      |

## Tri

### US-SORT-01 — Tri du catalogue

**Description :** réorganisation des produits selon le nom ou le prix.

**En tant qu'** utilisateur consultant le catalogue  
**Je souhaite** trier les produits selon leur nom ou leur prix  
**Afin de** trouver plus facilement les articles qui m'intéressent.

#### Critères d'acceptation

| ID         | Critère                                                                                                                                    | Tests associés |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| AC-SORT-01 | Le tri par nom réordonne les six produits en A–Z ou Z–A selon l'option choisie, sans perte ni duplication.                                 | TC-TRI-01      |
| AC-SORT-02 | Le tri par prix réordonne les six produits par prix croissant ou décroissant en conservant l'association entre chaque produit et son prix. | TC-TRI-02      |

## Panier

### US-CART-01 — Gestion du panier

**Description :** ajout, suppression et conservation des produits sélectionnés pendant la navigation.

**En tant qu'** utilisateur authentifié  
**Je souhaite** gérer les produits de mon panier  
**Afin de** préparer et contrôler le contenu de ma future commande.

#### Critères d'acceptation

| ID         | Critère                                                                                                                          | Tests associés |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| AC-CART-01 | Chaque produit ajouté apparaît une fois dans le panier avec son prix et sa quantité, et le badge reflète le nombre d'articles.   | TC-PAN-01      |
| AC-CART-02 | La suppression d'un produit retire sa ligne et décrémente le badge ; un panier vide ne présente plus de ligne ni de badge.       | TC-PAN-02      |
| AC-CART-03 | Le contenu et le compteur du panier sont conservés lors des allers-retours entre catalogue et panier, sans perte ni duplication. | TC-PAN-03      |

## Checkout

### US-CHK-01 — Passage et finalisation de commande

**Description :** saisie des informations client, contrôle du récapitulatif, finalisation ou annulation de la commande.

**En tant qu'** utilisateur ayant sélectionné un produit  
**Je souhaite** renseigner mes informations, contrôler puis finaliser ma commande  
**Afin de** terminer mon achat avec un récapitulatif fiable.

#### Critères d'acceptation

| ID        | Critère                                                                                                                                               | Tests associés |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| AC-CHK-01 | Depuis un panier contenant un produit, l'utilisateur peut accéder au formulaire de checkout avec les trois champs client et les actions attendues.    | TC-CHK-01      |
| AC-CHK-02 | Le checkout ne progresse pas lorsque le prénom est absent et indique que le champ est obligatoire.                                                    | TC-CHK-02      |
| AC-CHK-03 | Le checkout ne progresse pas lorsque le nom est absent et indique que le champ est obligatoire.                                                       | TC-CHK-03      |
| AC-CHK-04 | Le checkout ne progresse pas lorsque le code postal est absent et indique que le champ est obligatoire.                                               | TC-CHK-04      |
| AC-CHK-05 | Le récapitulatif conserve le produit, la quantité et le prix, et affiche les informations de paiement, livraison, sous-total, taxe et total attendus. | TC-CHK-05      |
| AC-CHK-06 | La finalisation affiche une confirmation complète, puis le retour au catalogue présente un panier remis à zéro.                                       | TC-CHK-06      |
| AC-CHK-07 | L'annulation ne crée aucune commande, ramène vers l'écran prévu selon l'étape et conserve le contenu du panier.                                       | TC-CHK-07      |

## Session

### US-SESSION-01 — Fermeture et protection de session

**Description :** déconnexion et refus d'accès aux pages protégées après la fermeture de session.

**En tant qu'** utilisateur authentifié  
**Je souhaite** fermer ma session et empêcher l'accès ultérieur aux pages protégées  
**Afin de** protéger mes données après ma déconnexion.

#### Critères d'acceptation

| ID            | Critère                                                                                                                       | Tests associés |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| AC-SESSION-01 | Après Logout, la session est fermée et le formulaire de connexion est de nouveau affiché.                                     | TC-SESSION-01  |
| AC-SESSION-02 | Après Logout, un accès direct au panier protégé est refusé et aucune donnée du panier n'est exposée.                          | TC-SESSION-02  |
| AC-SESSION-03 | Après Logout, un accès direct au catalogue est refusé avec un message explicite indiquant que l'authentification est requise. | TC-SESSION-03  |
