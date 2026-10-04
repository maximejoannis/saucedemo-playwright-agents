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

La probabilité estime la vraisemblance raisonnable de la défaillance ou de sa régression. En l’absence de données de production ou de télémétrie SauceDemo, elle reste une estimation QA explicite fondée sur l’exposition du parcours, les transitions concernées et les comportements observés; elle ne constitue pas une fréquence mesurée. L’impact estime la conséquence maximale crédible pour l’utilisateur ou le métier si elle survient. Le score aide à comparer les risques, mais ne remplace pas le jugement QA : la priorité d’un TC tient aussi compte de son rôle de garde-barrière, de la redondance de couverture, de la vitesse de retour attendue et du fait qu’il s’agit ou non d’un comportement spécial de démonstration.

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
| 9 | Critique | Envisager une garde-barrière P0 et une couverture Smoke/régression lorsque le contrôle est stable, déterministe et pertinent. |

Les scores 5, 7 et 8 ne peuvent pas résulter de l’échelle 1 à 3.

### Référentiel des risques et gouvernance

Le catalogue concret, ses liens US/AC/TC, ses défenses, ses états de couverture et ses risques résiduels sont centralisés dans [`../requirements/risk-register.md`](../requirements/risk-register.md). Ce registre est la source de référence; le plan ne duplique pas les fiches de risques.

La stratégie générale consiste à renforcer les risques critiques et élevés par des contrôles ciblés, négatifs ou de transition, puis par un parcours E2E lorsque celui-ci apporte une défense distincte. Un nombre élevé de tests redondants n’est pas assimilé à plusieurs défenses. Les risques faibles reçoivent une couverture proportionnée et restent hors de la boucle Smoke sauf nécessité de parcours.

Les états Couvert, Partiellement couvert, Non couvert et Accepté / hors périmètre sont décidés dans le registre après examen de la référence attendue et du périmètre réellement exercé. Un lien TC ou un test vert ne suffit pas à supprimer le risque produit.

### Lien entre risque et priorité des tests

La priorité traduit l’ordre et la fréquence d’exécution d’un TC, pas directement le score du risque. Les règles de décision retenues sont :

- **P0** : garde-barrière rapide nécessaire avant de poursuivre l’évaluation d’une livraison, notamment Smoke, parcours essentiel ou contrôle indispensable d’intégrité financière, d’état ou d’autorisation;
- **P1** : régression fonctionnelle importante, test négatif significatif, transition d’état ou complément détaillé d’un P0 qui ne nécessite pas systématiquement un signal Smoke;
- **P2** : scénario secondaire, rare ou de caractérisation, acceptable hors de la boucle de retour rapide.

Le niveau de risque contribue à cette décision sans la fixer : un risque critique peut ne pas disposer d’un contrôle P0 pertinent ou suffisamment déterministe, et un TC P0 peut servir de garde-barrière de parcours tout en détectant une anomalie de faible impact.

La revue initiale a produit les écarts suivants. Ils sont désormais arbitrés et propagés dans les fiches TC, la matrice et l’automatisation :

| TC concerné | Priorité avant arbitrage | Lecture par le risque | Décision propagée |
|---|---:|---|---|
| TC-CHK-02 | P1 | RISK-CHK-02 élevé (6), référence de calcul financier centrale. | **Arbitré P0 + Smoke** : un parcours confirmé avec un total faux n’est pas un succès métier. |
| TC-SESSION-01 | P1 | RISK-CART-02 et RISK-SESSION-01 élevés (6). | **Arbitré P0 + Smoke** : ce contrôle court devient un garde-barrière de persistance. |
| TC-CHK-06 | P2 | RISK-CHK-03 élevé (6) et défaillance observée. | **Arbitré P1** tant que le produit n’a pas accepté explicitement les commandes vides; il ne justifie pas P0 car il ne bloque pas l’achat nominal. |
| TC-CAT-04 | P1 | RISK-CAT-02 faible (2), comportement spécial de `problem_user`. | **Arbitré P2**, maintenu dans la Regression comme caractérisation dédiée. |
| TC-TRI-05, TC-TRI-06 | P1 | RISK-SORT-01 faible (2), comportements spéciaux sans altération de commande. | **Arbitrés P2**, maintenus dans la Regression comme caractérisations dédiées. |
| TC-PAN-05, TC-PAN-06 | P1 | RISK-CART-01 élevé (6), mais caractérisations de comptes spéciaux disposant de défenses nominales plus fortes. | **Arbitrés P2**, maintenus automatisés dans la Regression et hors de la boucle Smoke. |

Les P0 existants `TC-AUTH-01`, `TC-PAN-01`, `TC-CHK-01`, `TC-SESSION-02` et `TC-SESSION-03` restent justifiés. Les validations obligatoires du checkout restent P1. Les changements arbitrés ci-dessus ne modifient ni la probabilité, ni l’impact, ni le niveau des risques.

### Revue de cohérence et transmission au Generator

- **Risques identifiés :** le catalogue de référence recense 14 risques distincts — 2 critiques, 7 élevés, 2 moyens et 3 faibles — sur les six fonctionnalités.
- **État de couverture :** le catalogue classe 7 risques comme couverts et 7 comme partiellement couverts; aucun n’est déclaré non couvert ou accepté/hors périmètre.
- **Risques partiellement couverts :** `RISK-CAT-02`, `RISK-CART-02`, `RISK-CHK-02`, `RISK-CHK-03`, `RISK-CHK-04`, `RISK-SESSION-01` et `RISK-SESSION-02`; leurs gaps et réponses QA recommandées sont maintenus dans `../requirements/risk-register.md`.
- **Priorités revues :** `TC-CHK-02` et `TC-SESSION-01` sont P0 + Smoke, `TC-CHK-06` est P1, `TC-CAT-04`, `TC-TRI-05/06` et `TC-PAN-05/06` sont P2 en Regression de caractérisation.
- **Recommandations de conception au Generator :** préserver les IDs et liens US/AC/TC; utiliser des références d’état et de calcul indépendantes; concevoir un scénario multi-articles par transitions plutôt qu’une explosion combinatoire; séparer les tests métier nominaux des caractérisations `problem_user`/`error_user`; ne générer aucun nouveau test sur les gaps tant que les règles produit signalées ne sont pas clarifiées.

## 8. Priorité des tests, risque produit et sévérité des défauts

### Trois notions distinctes

Les trois notions répondent à des décisions différentes et ne sont jamais converties automatiquement l’une dans l’autre.

| Notion | S’applique à | Moment | Question | Exemple SauceDemo |
|---|---|---|---|---|
| Risque produit | Produit / fonctionnalité | Conception, avant ou indépendamment de l’exécution | Qu’est-ce qui pourrait mal se passer et quel serait son niveau de risque ? | Une commande valide pourrait ne pas être finalisable (`RISK-CHK-01`). |
| Priorité | Test Case | Planification / exécution | Quand et avec quelle importance devons-nous exécuter ce test ? | Le parcours nominal de checkout est exécuté en P0 pour fournir un signal rapide. |
| Sévérité | Défaut constaté | Après observation et analyse | Maintenant que le défaut est constaté, quel est l’impact réel du problème ? | Une sévérité n’est attribuée qu’après confirmation du défaut, de son étendue et d’un éventuel contournement. |

#### Risque produit

Un risque produit est un événement potentiel susceptible d’affecter l’utilisateur ou le métier. Il existe même si aucun test n’a échoué et peut ne jamais se matérialiser. Dans ce plan, il est identifié par `RISK-*`, évalué par sa probabilité et son impact, puis classé selon le niveau Faible, Moyen, Élevé ou Critique défini en section 7.

Le score du risque guide la stratégie préventive de couverture. Il ne constitue ni la priorité automatique d’un TC, ni la sévérité anticipée d’un futur défaut.

#### Priorité du Test Case

La priorité appartient au Test Case. Elle détermine son importance dans la campagne et son ordre d’exécution :

| Priorité | Convention d’exécution |
|---|---|
| P0 | Test essentiel à exécuter en priorité, notamment garde-barrière d’un parcours critique ou contrôle de la Smoke. Un échec doit interrompre l’évaluation de la livraison et déclencher un diagnostic immédiat. |
| P1 | Test important de régression fonctionnelle, exécuté après ou en complément des contrôles essentiels. |
| P2 | Test de priorité moindre, scénario secondaire, rare ou de caractérisation, exécutable après les contrôles essentiels. |

Une priorité élevée peut être motivée par la rapidité du retour, la place du test dans le tunnel, sa capacité à bloquer les tests suivants ou la fréquence d’exécution attendue. Elle ne préjuge pas de la gravité d’un éventuel bug. En particulier, `P0` ne signifie pas `S1`, `P1` ne signifie pas `S2` et `P2` ne signifie ni `S3` ni `S4`.

### Conversions automatiques interdites

Il n’existe aucune table de correspondance entre les trois notions. Sont notamment interdites les déductions automatiques suivantes :

- `Risque critique → P0`;
- `P0 → S1`;
- `P2 → S3 ou S4`;
- `test rouge → S1`;
- `risque faible → défaut mineur`;
- `risque élevé → automatisation obligatoire`.

Une corrélation peut guider une discussion, jamais remplacer l’analyse. Le Risk-Based Testing peut influencer la profondeur de test, la diversité des techniques, la fréquence d’exécution et la décision d’automatisation; chacune de ces décisions conserve toutefois ses propres critères et sa propre justification.

#### Sévérité du défaut

La sévérité qualifie l’impact réel d’un défaut constaté sur le produit, l’utilisateur ou le métier. Elle est attribuée seulement après reproduction, collecte des éléments de diagnostic et analyse du périmètre réellement affecté. Un TC qui réussit, qui n’a pas été exécuté ou qui ne révèle qu’un incident de test/environnement ne possède aucun défaut produit auquel attribuer une sévérité.

| Sévérité | Convention SauceDemo | Exemples indicatifs |
|---|---|---|
| S1 — Critique | Fonction métier essentielle empêchée ou compromise, sans contournement acceptable; accès, intégrité financière ou données critiques menacés. | Utilisateur légitime incapable de se connecter; accès non autorisé à une route protégée; finalisation généralisée impossible; montant faux; perte ou corruption critique du parcours. |
| S2 — Majeure | Fonction importante fortement dégradée, mais avec contournement possible ou périmètre limité. | Ajout impossible pour certains produits; étape importante du checkout dégradée mais contournable; perte d’état sur une navigation particulière; fonction majeure indisponible dans certaines conditions. |
| S3 — Modérée | Défaut fonctionnel réel sur une fonction secondaire, sans blocage du parcours principal. | Tri incorrect; retour ou navigation secondaire incorrecte; incohérence fonctionnelle d’impact limité. |
| S4 — Mineure | Défaut principalement visuel, cosmétique ou de confort, sans conséquence significative sur le parcours métier. | Image incorrecte; alignement; libellé secondaire; anomalie visuelle sans perte fonctionnelle. |

Ces exemples sont des guides de calibration, pas une table de conversion. La sévérité finale dépend du comportement réellement observé, des utilisateurs touchés, de l’étendue, de la fréquence, de l’existence d’un contournement et des conséquences métier. Elle ne se déduit ni de P0/P1/P2, ni du score du risque, ni du seul intitulé du TC.

### Règles d’attribution de la sévérité

1. Confirmer que l’écart est un défaut produit reproductible, et non un problème de test, de données ou d’environnement.
2. Comparer le comportement observé au résultat attendu et identifier précisément les utilisateurs, données et étapes affectés.
3. Évaluer l’impact réel sur l’accès, le panier, la commande, les montants, la session ou une fonction secondaire.
4. Rechercher un contournement acceptable et déterminer si l’impact est généralisé ou limité à une condition.
5. Attribuer S1 à S4 avec une justification factuelle dans le ticket de défaut; réévaluer si le périmètre observé évolue.
6. Conserver séparément dans le ticket les références `RISK-*`, US, AC et TC : elles donnent le contexte de détection, pas la sévérité par elles-mêmes.

Les comportements documentés de `problem_user` et `error_user` ne sont pas des défauts à déclarer automatiquement. Ils restent des caractérisations spéciales de SauceDemo. Une sévérité ne serait attribuée que si un comportement équivalent constituait un écart à une exigence applicable au contexte réellement testé.

### Exemples de non-équivalence dans SauceDemo

| Situation | Priorité du TC | Sévérité possible après analyse | Pourquoi les valeurs diffèrent |
|---|---|---|---|
| `TC-TRI-02` est rejoué régulièrement et le tri Z–A devient incorrect, sans empêcher l’achat. | P1 | S3 possible | Le TC est important pour la régression; le défaut constaté touche une fonction secondaire. **P1 ≠ S3.** |
| `TC-SESSION-03` révèle qu’un utilisateur déconnecté accède réellement au panier protégé. | P0 | S1 possible | P0 fixe l’ordre d’exécution; S1 exprime ensuite l’accès non autorisé observé. Les deux coexistent sans être équivalents. |
| `TC-CHK-02` échoue parce que le total affiché est faux pour une commande réelle. | P0 | S1 possible | Le contrôle financier est exécuté tôt; la sévérité vient de l’impact financier constaté, pas de P0 ni du niveau de RISK-CHK-02. |
| `TC-CAT-01` échoue uniquement parce qu’une image nominale est incorrecte, tandis que noms et prix restent justes. | P0 | S4 possible | Le test Smoke contrôle plusieurs attributs essentiels; la cause précise de l’échec reste seulement visuelle. **Un TC P0 peut donc révéler un défaut S4.** |
| `TC-CAT-03`, exécuté en P2, révèle après analyse que toute référence valide affiche le mauvais produit et le mauvais prix. | P2 | S1 ou S2 possible selon l’étendue | La priorité du scénario initial reste faible, mais l’observation peut mettre au jour un défaut beaucoup plus large. |
| Un test P0 échoue sur `ERR_NETWORK_ACCESS_DENIED` dans l’environnement d’exécution, sans écart reproductible dans SauceDemo. | P0 | Aucune sévérité produit | Il s’agit d’un incident d’environnement à diagnostiquer, pas d’un défaut produit automatiquement classé S1. |

### Impact potentiel en cas d’échec

Avant exécution, un TC peut documenter un **Impact potentiel en cas d’échec** afin d’aider au triage et au diagnostic. Cette information décrit ce que l’échec pourrait signifier si un défaut produit était confirmé. Elle n’est pas une sévérité préattribuée : le résultat peut aussi provenir du test, des données ou de l’environnement, et un même TC peut échouer pour des causes d’impacts très différents.

Cette mention est réservée aux garde-barrières pour lesquels elle apporte une aide décisionnelle. Le Generator doit la conserver comme métadonnée documentaire ou de reporting, sans créer de tag `S1` à `S4` dans les tests.

### Revue de cohérence et transmission au Generator

- **Priorités existantes :** les 8 P0, 19 P1 et 6 P2 sont cohérents avec leur rôle d’exécution dans l’état actuel. La précédente évolution de `TC-CAT-01` de P1 vers P0 est déjà propagée.
- **Arbitrage humain propagé :** `TC-PAN-05/06` passent de P1 à P2. Leur rôle de caractérisation de comptes spéciaux, leur absence de la Smoke et l’existence de défenses nominales plus fortes justifient leur exécution hors de la boucle de retour rapide, sans modifier `RISK-CART-01` ni leur mode automatisé en Regression.
- **Articulation avec le risque :** les 14 risques, leurs probabilités, impacts et niveaux restent inchangés. Ils orientent la couverture préventive; P0/P1/P2 ordonne l’exécution; S1/S2/S3/S4 qualifie seulement un défaut produit confirmé.
- **Sévérité dans les TC :** aucune propriété fixe `Sévérité` n’est ajoutée aux 34 TC. Les exemples S1 à S4 restent des guides de triage après observation.
- **À propager par le Generator :** conserver les priorités, les références `RISK-*` et les impacts potentiels; exposer clairement ces champs dans le reporting; permettre la référence au TC lors de la création d’un défaut; ne jamais dériver ni taguer automatiquement une sévérité à partir d’un risque, d’une priorité ou d’un résultat Playwright.

## Techniques de conception des tests

### Définitions, codes et règles d’utilisation

| Code | Technique | Utilisation dans ce plan |
|---|---|---|
| EP | Partition d’équivalence | Regrouper des données ou conditions supposées produire le même comportement et choisir un représentant justifié. |
| BVA | Analyse des valeurs limites | Exercer une frontière métier ou technique connue, avec des valeurs situées de part et d’autre. Une valeur numérique seule ne suffit pas. |
| DT | Table de décision | Représenter plusieurs conditions dont les combinaisons conduisent à des résultats distincts. |
| ST | Transition d’état | Vérifier un événement depuis un état source et l’état cible obtenu, y compris une transition refusée ou un état inchangé. |
| PW | Pairwise | Réduire un espace combinatoire important de paramètres suffisamment indépendants. |
| EXP | Test exploratoire | Guider une investigation humaine autour d’une incertitude sans prédéterminer toutes les actions ou conclusions. |
| SBT | Test basé sur les scénarios | Représenter un parcours utilisateur cohérent traversant plusieurs interactions orientées vers un objectif métier. |

Une technique n’est déclarée sur un TC que si elle explique réellement la sélection de ses données, conditions ou transitions. Elle ne détermine ni le niveau du risque, ni la priorité P0/P1/P2, ni la sévérité d’un éventuel défaut. `EXP` reste attaché aux charters et n’est pas ajouté aux TC scriptés.

### Partitions d’équivalence

| Domaine | Partition | Représentant | Comportement attendu | TC | Risque |
|---|---|---|---|---|---|
| Authentification | Identifiants valides d’un compte autorisé | `standard_user` / `secret_sauce` | Inventory accessible | TC-AUTH-01 | RISK-AUTH-01 |
| Authentification | Combinaison inconnue | `unknown_user` / `wrong_password` | Accès refusé, message d’incompatibilité | TC-AUTH-02 | RISK-AUTH-02 |
| Authentification | Username absent | chaîne vide, avec ou sans mot de passe | Accès refusé, username requis | TC-AUTH-03 | RISK-AUTH-02 |
| Authentification | Password absent avec username présent | `standard_user` / vide | Accès refusé, password requis | TC-AUTH-04 | RISK-AUTH-02 |
| Authentification | Compte reconnu mais verrouillé | `locked_out_user` / mot de passe valide | Accès refusé, compte verrouillé | TC-AUTH-05 | RISK-AUTH-02 |
| Catalogue | Identifiant d’un produit existant | Backpack (`id=4`) | Fiche correspondant au produit sélectionné | TC-CAT-02 | RISK-CAT-01 |
| Catalogue | Identifiant de produit absent du catalogue | `id=999` | Produit signalé introuvable | TC-CAT-03 | RISK-CAT-01 |
| Checkout | Première donnée obligatoire absente | trois champs vides | Prénom requis | TC-CHK-03 | RISK-CHK-04 |
| Checkout | Prénom présent, nom absent | `Jean` / vide / vide | Nom requis | TC-CHK-04 | RISK-CHK-04 |
| Checkout | Prénom et nom présents, code postal absent | `Jean` / `Dupont` / vide | Code postal requis | TC-CHK-05 | RISK-CHK-04 |
| Checkout | Trois données obligatoires présentes | `Jean` / `Dupont` / `75001` | Accès au récapitulatif | TC-CHK-01 | RISK-CHK-01, RISK-CHK-04 |

Ces partitions portent sur la présence et le statut fonctionnel explicitement décrits. Les espaces, accents, Unicode, longueurs et formats des coordonnées restent des pistes de `EXP-CHK-03`; aucune partition normative n’est créée sans exigence ou observation qualifiée.

### Valeurs limites

| Domaine | Frontière | Valeurs autour de la frontière | TC | Statut |
|---|---|---|---|---|
| Panier / Checkout | Nombre minimal ou maximal d’articles | Aucune borne fonctionnelle connue | TC-PAN-01/04, TC-CHK-01/06 | Les états 0 et 1 article sont exercés, mais aucune exigence ne définit un seuil autorisé : ils ne démontrent donc pas une BVA. Le comportement de commande vide reste une caractérisation à arbitrer. |
| Authentification | Longueur username/password | Aucune borne minimale ou maximale connue | — | BVA non justifiable actuellement; ne pas inventer 0/1/max sans spécification. |
| Coordonnées Checkout | Longueur et format des trois champs | Aucune borne fonctionnelle connue | — | Gap documentaire; exploration avant toute BVA formelle. |
| Montants | Arrondi de taxe et total | Règle de taxe et précision non spécifiées | TC-CHK-02 | Référence arithmétique existante, mais BVA d’arrondi non justifiable. |

La valeur zéro d’un champ absent relève ici d’EP sur la présence, pas d’une BVA de longueur. Aucune limite minimale, maximale ou seuil numérique n’est actuellement spécifié : l’Analyse des valeurs limites (BVA) n’est donc démontrable sur aucun des 34 TC.

### Table de décision — validation et progression du checkout

`—` signifie que la condition n’influence pas la règle parce qu’un champ obligatoire antérieur est déjà absent.

| Règle | Prénom présent | Nom présent | Code postal présent | Article présent | Résultat observable | TC |
|---|---|---|---|---|---|---|
| R1 | Non | — | — | — | Rester à Step One; prénom requis | TC-CHK-03 |
| R2 | Oui | Non | — | — | Rester à Step One; nom requis | TC-CHK-04 |
| R3 | Oui | Oui | Non | — | Rester à Step One; code postal requis | TC-CHK-05 |
| R4 | Oui | Oui | Oui | Oui | Atteindre Step Two puis permettre la finalisation nominale | TC-CHK-01 |
| R5 | Oui | Oui | Oui | Non | Atteindre Step Two avec total nul puis observer la confirmation | TC-CHK-06 |

La table démontre la sélection progressive des trois partitions manquantes et la différence aval entre panier rempli et vide. Elle ne prétend pas que la confirmation d’une commande vide est souhaitée : R5 caractérise le comportement observé et maintient le gap de RISK-CHK-03.

Une table de décision d’authentification séparée n’est pas ajoutée : les classes compte valide, inconnu, verrouillé et champs absents sont suffisamment lisibles par EP, sans combinaison métier supplémentaire démontrée.

### Transitions d’état

| État source | Événement | État cible | Valide ? | TC / EXP | Risque |
|---|---|---|---|---|---|
| Déconnecté | Identifiants valides | Authentifié / Inventory | Oui | TC-AUTH-01 | RISK-AUTH-01 |
| Inventory, panier vide | Add | Inventory, panier avec article | Oui | TC-PAN-01 | RISK-CART-01 |
| Cart, panier avec article | Remove du dernier article | Cart, panier vide | Oui | TC-PAN-02 | RISK-CART-01 |
| Inventory / fiche / Cart | Navigation avec plusieurs articles puis retrait partiel | Même sélection cohérente sur les écrans | Oui | TC-PAN-03 | RISK-CART-01 |
| Authentifié, panier rempli | Refresh Inventory | Même session et même panier | Oui, auto-transition | TC-SESSION-01 | RISK-CART-02, RISK-SESSION-01 |
| Authentifié | Logout | Déconnecté | Oui | TC-SESSION-02 | RISK-SESSION-02 |
| Déconnecté après logout | Accès direct à Cart | Déconnecté avec refus | Non, transition protégée | TC-SESSION-03, EXP-AUTH-01 | RISK-AUTH-02, RISK-SESSION-02 |
| Authentifié, panier rempli | Reset App State | Authentifié, panier vide | Oui | TC-SESSION-04, EXP-SESSION-01 | RISK-SESSION-03 |
| Checkout Step One, données complètes | Continue | Checkout Step Two | Oui | TC-CHK-01 | RISK-CHK-01 |
| Checkout Step Two | Finish | Checkout Complete | Oui | TC-CHK-01 | RISK-CHK-01 |
| Checkout Step Two avec `error_user` | Finish | Checkout Step Two inchangé | Transition dégradée connue | TC-CHK-08 | RISK-CHK-01 |
| Étape Checkout intermédiaire | Refresh, Back ou accès direct | À découvrir | Non spécifié | EXP-CHK-01 | RISK-CHK-01, RISK-SESSION-01 |
| Session avec panier | Logout puis reconnexion, même/autre utilisateur | À découvrir | Non spécifié | EXP-SESSION-01 | RISK-CART-02, RISK-SESSION-01, RISK-SESSION-02 |

Les transitions marquées « à découvrir » ne deviennent pas des résultats attendus. Elles expliquent pourquoi une investigation précède la formalisation éventuelle d’un AC ou TC.

### Test basé sur les scénarios

SBT est retenu lorsque la valeur du contrôle vient du parcours cohérent plutôt que d’une donnée isolée :

- `TC-CAT-02` : ouvrir une fiche cohérente puis restaurer le catalogue;
- `TC-PAN-01` et `TC-PAN-03` : constituer puis vérifier une sélection à travers plusieurs représentations;
- `TC-CHK-01` : réaliser l’objectif métier complet de commande nominale;
- `TC-CHK-06` : caractériser le parcours alternatif complet d’une commande vide.

Les E2E transverses appliquent également SBT, mais restent distincts des 34 TC fonctionnels et ne modifient pas la couverture des AC.

### Pairwise

**Non nécessaire à ce stade.** Les paramètres potentiels — type utilisateur, état du panier, état de session, étape checkout et complétude du formulaire — ne forment pas aujourd’hui un modèle combinatoire homogène : certains comptes décrivent des comportements spéciaux, plusieurs combinaisons sont impossibles ou non spécifiées, et les règles critiques connues tiennent dans les partitions, la table de décision et les transitions ci-dessus.

Pairwise pourra être réévalué si des règles stables rendent plusieurs paramètres indépendants et si l’espace exhaustif devient significatif. Il faudra alors définir leurs valeurs et contraintes avant de générer toute combinaison.

### Exploration

Les huit charters de [`../exploratory/charters.md`](../exploratory/charters.md) utilisent la technique `EXP` :

| Charter | Axe de conception exploratoire | Risque(s) |
|---|---|---|
| EXP-AUTH-01 | Frontières d’accès, historique et onglets après changement d’état | RISK-AUTH-02, RISK-SESSION-02 |
| EXP-CAT-01 | Identité produit, image et paramètres d’URL | RISK-CAT-01, RISK-CAT-02 |
| EXP-SORT-01 | Répétition, interruption et restauration du tri | RISK-SORT-01 |
| EXP-CART-01 | Transitions rapides et synchronisation des représentations du panier | RISK-CART-01, RISK-CART-02, RISK-SESSION-01 |
| EXP-CHK-01 | Reprise, navigation directe, panier/récapitulatif et calculs | RISK-CART-01, RISK-CHK-01, RISK-CHK-02, RISK-CHK-03, RISK-SESSION-01 |
| EXP-CHK-02 | Répétition de Continue/Finish et idempotence apparente | RISK-CHK-01, RISK-CHK-03 |
| EXP-CHK-03 | Classes de saisie non spécifiées et correction après erreur | RISK-CHK-04 |
| EXP-SESSION-01 | Persistance, reconnexion, logout et Reset multi-écrans | RISK-CART-02, RISK-SESSION-01, RISK-SESSION-02, RISK-SESSION-03 |

`EXP` conserve la liberté d’investigation. Un charter n’est ni une partition validée, ni un TC, ni une couverture exécutée tant qu’une session n’a pas produit et qualifié des observations.

### Gaps révélés et suites recommandées

| Gap | Risque / valeur | Pertinence | Automatisabilité actuelle | Recommandation |
|---|---|---|---|---|
| Longueurs et formats username/password non spécifiés | Accès utilisateur; portée inconnue | Faible sans exigence | Non justifiée | Ne pas créer de BVA; réévaluer après règle ou découverte. |
| Formats, longueurs et normalisation des coordonnées | RISK-CHK-04, livraison | Moyenne | Prématurée | Exécuter EXP-CHK-03 puis décider d’éventuelles partitions. |
| Commande à zéro article acceptée | RISK-CHK-03 élevé | Forte | Techniquement stable, attendu métier non arbitré | Décision produit avant nouveau TC normatif. |
| Accès direct et reprise des étapes Checkout | RISK-CHK-01 / SESSION-01 | Forte | À évaluer après exploration | Exécuter EXP-CHK-01; formaliser seulement les transitions décidées. |
| Persistance logout/relogin ou changement d’utilisateur | RISK-CART-02 / SESSION-01 / SESSION-02 | Forte | À évaluer après règle de session | Exécuter EXP-SESSION-01 et clarifier la politique. |
| Arrondis et règle de taxe | RISK-CHK-02 élevé | Forte | Référence attendue insuffisante | Obtenir la règle métier avant BVA ou nouvelles partitions de montants. |
| Espace combinatoire multi-paramètres | Aucun besoin démontré à ce stade | Faible | Pairwise prématuré | Maintenir PW non applicable; revoir après stabilisation des règles. |

**Techniques réellement utilisées :** EP, DT, ST, SBT et EXP. **Technique non pertinente actuellement :** PW. **BVA non applicable actuellement :** quantité d’articles, longueurs des identifiants, coordonnées et arrondis sans bornes ou règles.

**Transmission au Generator :** propager uniquement les champs `Technique(s) de conception` présents; ne pas inférer une technique depuis le type, le nombre d’étapes ou les tags; ne créer aucun TC pour les gaps sans arbitrage; maintenir `EXP` au niveau des charters et ne pas produire de Playwright à partir de cette section.

## 9. Cas de test

### Convention d’enrichissement des Test Cases

**Référence attendue : information fiable utilisée par le QA pour déterminer si le comportement observé est correct ou incorrect.**

Une analyse renforcée est ajoutée lorsqu’un TC protège un parcours essentiel, un contrôle d’accès, l’intégrité du panier ou des montants, une finalisation de commande, une transition de session, ou lorsqu’il constitue un contrôle principal d’un risque important. Aucun critère isolé ne déclenche automatiquement cet enrichissement : être P0 ou être relié à un risque élevé ne suffit pas à lui seul. Les autres TC conservent leur description actuelle lorsqu’elle permet déjà de comprendre sans ambiguïté leur objectif et leur résultat attendu.

L’analyse renforcée documente trois informations distinctes :

- **Impact si échec :** conséquence potentielle pour l’utilisateur ou le produit si l’échec provient d’un défaut réel. Cet impact n’attribue pas une sévérité à l’avance.
- **Référence attendue :** règle ou information fiable sur laquelle repose le contrôle. Elle est **spécifiée** lorsqu’une exigence la définit, **dérivée** lorsqu’elle se calcule ou se déduit d’informations fiables, et **baseline observée** lorsqu’elle sert seulement à détecter un changement sans prouver la conformité métier. Si aucune règle fiable n’existe, le TC indique `Comportement observé à caractériser`.
- **Justification du test :** raison pour laquelle le contrôle mérite d’être conservé et exécuté dans la stratégie QA. Elle est différente de la technique de conception, qui explique comment les données, conditions ou transitions ont été choisies.

Le résultat attendu décrit ensuite la manifestation concrète pour les données du scénario. Le risque reste un événement potentiel analysé avant l’exécution. La sévérité n’est attribuée qu’après confirmation d’un défaut et analyse de son impact réel. Ainsi, `Impact si échec`, risque, priorité, sévérité, référence attendue et technique de conception ne sont jamais convertis automatiquement les uns dans les autres.

Dans les fiches ci-dessous, le champ historique **Impact potentiel en cas d’échec** correspond à **Impact si échec**. La **Justification du test** explique pourquoi le contrôle existe. La **Justification de la priorité** explique pourquoi il est exécuté à ce niveau par rapport aux autres contrôles. Le reporting présente ces deux informations séparément, sans modifier les priorités.

### Authentification

### TC-AUTH-01 — Connexion avec un utilisateur standard

**Mode d’exécution :** Automatisé
**Justification du mode d’exécution :** garde-barrière Smoke déterministe, fréquent et indispensable aux parcours authentifiés.

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-01  
**Risque(s) couvert(s) :** RISK-AUTH-01
**Technique(s) de conception :** EP, ST
**Type :** Passant  
**Priorité :** P0  
**Impact potentiel en cas d’échec :** accès au catalogue et parcours d’achat bloqués pour un utilisateur légitime.
**Référence attendue :** AC-AUTH-01 et transition d’état Déconnecté → Inventory authentifié après credentials valides.
**Type de référence :** Référence spécifiée. La transition vers Inventory est déjà définie explicitement par AC-AUTH-01; elle n’est donc pas comptée une seconde fois comme référence dérivée.
**Justification du test :** protège l’accès d’un utilisateur autorisé au parcours d’achat principal.

**Justification de la priorité :** garde-barrière du parcours essentiel et de toutes les fonctionnalités authentifiées; signal Smoke court et indispensable.
**Tags :** `@positive @smoke @regression @auth`

**Préconditions :** Page de connexion ouverte dans un contexte vierge.  
**Données de test :** `standard_user` / `secret_sauce`.

**Étapes :**
1. Saisir le nom d’utilisateur puis le mot de passe.
2. Choisir Login.

**Résultat attendu :** Inventory s’affiche avec le titre Products et sans erreur.  
**Critère de réussite :** La session est ouverte sur `/inventory.html`.

### TC-AUTH-02 — Refus d’identifiants inconnus

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** validation négative stable et répétitive de la frontière d’accès.

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-02  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Technique(s) de conception :** EP
**Type :** Non passant  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** accès accordé à une combinaison inconnue ou information de refus trompeuse.

**Référence attendue :** AC-AUTH-02 impose le refus et le message d’incompatibilité pour la partition des identifiants inconnus.
**Type de référence :** Référence spécifiée.
**Justification du test :** contrôle que des identifiants inconnus ne franchissent pas la frontière d’accès.

**Justification de la priorité :** contrôle important de la frontière d’accès lié à RISK-AUTH-02 élevé; exécuté en régression après le Smoke nominal.
**Tags :** `@negative @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** `unknown_user` / `wrong_password`.

**Étapes :** 1. Saisir les deux valeurs. 2. Choisir Login.  
**Résultat attendu :** L’accès est refusé et le message d’incompatibilité des identifiants s’affiche.  
**Critère de réussite :** L’utilisateur reste sur `/` sans catalogue.

### TC-AUTH-03 — Nom d’utilisateur absent

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** règle obligatoire déterministe avec message précis, peu coûteuse à rejouer.

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-03  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Technique(s) de conception :** EP
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** validation incomplète permettant une tentative ambiguë ou message incapable de guider l’utilisateur.

**Référence attendue :** AC-AUTH-03 définit le username comme obligatoire et le message associé.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie une validation obligatoire qui aide l’utilisateur à corriger sa saisie.

**Justification de la priorité :** partition négative stable protégeant la validation d’entrée; importante en régression mais non nécessaire au signal Smoke nominal.
**Tags :** `@error @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** nom vide, mot de passe vide puis `secret_sauce`.

**Étapes :** 1. Laisser le nom vide. 2. Choisir Login. 3. Refaire avec seulement le mot de passe renseigné.  
**Résultat attendu :** « Epic sadface: Username is required » s’affiche dans les deux variantes.  
**Critère de réussite :** Aucun accès au catalogue et message exact visible.

### TC-AUTH-04 — Mot de passe absent

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** partition négative stable complétant la validation du formulaire.

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-04  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Technique(s) de conception :** EP
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** tentative sans secret correctement contrôlé ou message de validation incorrect.

**Référence attendue :** AC-AUTH-04 définit le password comme obligatoire lorsque le username est présent.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie que l’absence du mot de passe est refusée et expliquée clairement.

**Justification de la priorité :** partition négative complémentaire de la frontière d’accès; valeur de régression sans bloquer le Smoke nominal.
**Tags :** `@error @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** `standard_user`, mot de passe vide.

**Étapes :** 1. Saisir le nom. 2. Laisser le mot de passe vide. 3. Choisir Login.  
**Résultat attendu :** « Epic sadface: Password is required » s’affiche.  
**Critère de réussite :** Aucun accès au catalogue et message exact visible.

### TC-AUTH-05 — Refus du compte verrouillé

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** règle d’autorisation explicite, déterministe et importante en régression.

**User Story :** US-01  
**Critère(s) couvert(s) :** AC-AUTH-05  
**Risque(s) couvert(s) :** RISK-AUTH-02
**Technique(s) de conception :** EP
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** un compte verrouillé pourrait accéder au domaine marchand malgré son statut.

**Référence attendue :** AC-AUTH-05 et règle fonctionnelle explicite interdisant l’ouverture de session à `locked_out_user`.
**Type de référence :** Référence spécifiée.
**Justification du test :** protège la règle d’autorisation propre au compte verrouillé.

**Justification de la priorité :** protège une règle d’autorisation importante liée à RISK-AUTH-02 élevé; conservé en régression, distinct du Smoke d’un compte autorisé.
**Tags :** `@error @regression @auth`

**Préconditions :** Page de connexion vierge.  
**Données de test :** `locked_out_user` / `secret_sauce`.

**Étapes :** 1. Saisir les identifiants. 2. Choisir Login.  
**Résultat attendu :** « Epic sadface: Sorry, this user has been locked out. » s’affiche.  
**Critère de réussite :** L’utilisateur demeure sur `/`.

### Catalogue

### TC-CAT-01 — Affichage du catalogue nominal

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Smoke répétitif vérifiant de nombreux attributs avant panier et checkout.

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-01  
**Risque(s) couvert(s) :** RISK-CAT-01, RISK-CAT-02
**Type :** Passant  
**Priorité :** P0
**Impact potentiel en cas d’échec :** catalogue indisponible ou informations produit essentielles absentes, empêchant une sélection fiable.
**Référence attendue :** AC-CAT-01 et jeu de référence des six produits, avec nom, description, prix et image présents.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie que le catalogue fournit les informations nécessaires à une sélection fiable.

**Justification de la priorité :** contrôle l’entrée dans le catalogue dont dépendent panier et checkout; fournit un signal Smoke rapide sans attribuer un impact élevé à chaque anomalie visuelle.
**Tags :** `@positive @smoke @regression @catalog`

**Préconditions :** `standard_user` connecté, Inventory ouverte.  
**Données de test :** les six produits et prix listés en section 5.

**Étapes :** 1. Parcourir les six cartes. 2. Contrôler nom, description, prix, image et bouton d’ajout de chacune.  
**Résultat attendu :** Six produits distincts, complets et aux prix attendus sont présentés.  
**Critère de réussite :** Aucun produit ni attribut attendu ne manque.

### TC-CAT-02 — Consultation d’une fiche et retour

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** scénario stable de cohérence liste/fiche et de navigation retour.

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-02  
**Risque(s) couvert(s) :** RISK-CAT-01
**Technique(s) de conception :** EP, SBT
**Type :** Passant  
**Priorité :** P1  
**Tags :** `@positive @regression @catalog`

**Préconditions :** Catalogue nominal ouvert.  
**Données de test :** Sauce Labs Backpack, 29,99 $.

**Étapes :** 1. Ouvrir le produit par son nom. 2. Comparer nom, description, prix et image. 3. Choisir Back to products.  
**Résultat attendu :** La fiche correspond au produit puis Inventory revient.  
**Critère de réussite :** La navigation aller-retour conserve une information cohérente.

### TC-CAT-03 — Consultation d’un produit inexistant

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** route négative déterministe avec signalement et récupération vérifiables.

**User Story :** US-02  
**Critère(s) couvert(s) :** AC-CAT-03  
**Risque(s) couvert(s) :** RISK-CAT-01
**Technique(s) de conception :** EP
**Type :** Erreur  
**Priorité :** P2  
**Tags :** `@error @regression @catalog`

**Préconditions :** `standard_user` connecté.  
**Données de test :** `/inventory-item.html?id=999`.

**Étapes :** 1. Ouvrir directement l’adresse de la fiche inexistante. 2. Observer le contenu. 3. Choisir Back to products.  
**Résultat attendu :** « ITEM NOT FOUND » et le texte d’indisponibilité s’affichent; le retour mène au catalogue.  
**Critère de réussite :** La référence absente est explicitement signalée sans bloquer le retour.

### TC-CAT-04 — Images dégradées de problem_user

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** caractérisation actuellement reproductible sur six produits; rentabilité à surveiller si la démo évolue.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** comparaison ordonnée déterministe, fréquente et plus fiable qu’un contrôle manuel répétitif.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** règle de tri inverse stable avec résultat objectif.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** vérification numérique déterministe sur l’ensemble du catalogue.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** complément de régression stable du tri numérique.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** caractérisation répétable multi-options; maintenance à réévaluer si le compte spécial change.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** caractérisation déterministe partagée avec la logique de tri, sous surveillance de rentabilité.

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

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Contrôle Smoke répétitif et déterministe de la cohérence entre l’action utilisateur, le badge et le contenu du panier.

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-01  
**Risque(s) couvert(s) :** RISK-CART-01
**Technique(s) de conception :** ST, SBT
**Type :** Passant  
**Priorité :** P0  
**Impact potentiel en cas d’échec :** impossibilité de constituer correctement la commande ou contenu du panier incohérent.
**Référence attendue :** AC-CART-01; cohérence entre l’action Add, le bouton devenu Remove, le badge à 1 et la ligne correspondante au panier.
**Type de référence :** Référence spécifiée et référence dérivée de l’état du panier.
**Justification du test :** protège la première transition permettant de constituer une commande.

**Justification de la priorité :** première transition critique de constitution de commande, dépendance directe du checkout et contrôle Smoke de RISK-CART-01 élevé.
**Tags :** `@positive @smoke @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Sauce Labs Backpack.

**Étapes :** 1. Ajouter Backpack. 2. Contrôler le badge et le bouton. 3. Ouvrir Cart.  
**Résultat attendu :** Badge 1, bouton Remove, ligne Backpack à 29,99 $ en quantité 1.  
**Critère de réussite :** Les trois représentations de la sélection concordent.

### TC-PAN-02 — Retrait d’un produit

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Transition d’état stable, fréquemment rejouée en régression et vérifiable sans jugement humain.

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-02  
**Risque(s) couvert(s) :** RISK-CART-01
**Technique(s) de conception :** ST
**Type :** Passant  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** article indésirable conservé, badge erroné ou commande ne reflétant plus la sélection de l’utilisateur.

**Référence attendue :** AC-CART-02 et état précédent connu : retirer le dernier article fait passer lignes et badge de 1 à 0.
**Type de référence :** Référence spécifiée et référence dérivée de l’état précédent.
**Justification du test :** vérifie que l’utilisateur peut réellement retirer un article indésirable.

**Justification de la priorité :** transition importante pour l’intégrité du panier, mais exécutée après la preuve Smoke qu’un article peut être ajouté.
**Tags :** `@positive @regression @cart`

**Préconditions :** Backpack seul au panier.  
**Données de test :** Sauce Labs Backpack.

**Étapes :** 1. Ouvrir Cart. 2. Choisir Remove.  
**Résultat attendu :** La ligne disparaît et le badge n’est plus affiché.  
**Critère de réussite :** Le panier est vide et ne présente pas de quantité résiduelle.

### TC-PAN-03 — Conservation du panier pendant la navigation

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Forte valeur de régression sur la persistance du panier au fil de transitions déterministes.

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-03  
**Risque(s) couvert(s) :** RISK-CART-01
**Technique(s) de conception :** ST, SBT
**Type :** Passant  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** perte, duplication ou réapparition d’un article pendant la navigation.

**Référence attendue :** AC-CART-03 et comparaison avec l’état de sélection précédent; badge, lignes et boutons doivent représenter les mêmes identités produit après chaque transition.
**Type de référence :** Référence spécifiée et référence dérivée de la sélection précédente.
**Justification du test :** protège l’intégrité du panier pendant un parcours de navigation et de modification.

**Justification de la priorité :** défense de régression plus profonde de RISK-CART-01 élevé; parcours multi-transition plus long que le garde-barrière Smoke.
**Tags :** `@positive @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Bike Light et Backpack.

**Étapes :** 1. Ajouter Bike Light et Backpack. 2. Ouvrir une fiche puis revenir. 3. Ouvrir Cart et retirer Backpack. 4. Revenir à Inventory puis rouvrir Cart.
**Résultat attendu :** Les deux ajouts restent uniques pendant la navigation; après le retrait, le badge vaut 1 et seul Bike Light demeure à chaque étape pertinente.
**Critère de réussite :** Aucune navigation interne ne perd, ne duplique ni ne réintroduit un article retiré.

### TC-PAN-04 — Accès au checkout avec panier vide

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Caractérisation répétable d’une transition sensible, utile pour détecter rapidement une évolution du comportement actuel.

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-04  
**Risque(s) couvert(s) :** RISK-CHK-03
**Technique(s) de conception :** — (règle fonctionnelle directe; aucune limite spécifiée)
**Type :** Non passant  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** possibilité de démarrer un parcours sans article, avec risque de commande vide et de données métier parasites.

**Référence attendue :** Comportement observé à caractériser. AC-CART-04 documente l’accès actuellement observé à Step One, sans décider si ce comportement est souhaité.
**Type de référence :** Comportement observé à caractériser.
**Justification du test :** maintient visible le parcours avec panier vide afin de détecter une évolution et soutenir l’arbitrage produit.
**Incertitude métier :** le projet ne définit pas si le checkout doit accepter ou refuser un panier vide.

**Justification de la priorité :** RISK-CHK-03 est élevé et le comportement doit rester visible en régression; il n’est pas P0 tant que la règle produit sur le blocage n’est pas arbitrée.
**Tags :** `@negative @regression @cart`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** aucune.

**Étapes :** 1. Ouvrir Cart. 2. Vérifier l’absence de ligne. 3. Choisir Checkout.  
**Résultat attendu :** L’étape `checkout-step-one.html` s’ouvre malgré le panier vide.  
**Critère de réussite :** Le comportement alternatif observé est reproduit sans inventer de blocage.

### TC-PAN-05 — Ajouts partiels de problem_user

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Caractérisation reproductible d’un mode dégradé spécial ; conservation sous surveillance de sa stabilité et de son coût de maintenance.

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-05  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Erreur  
**Priorité :** P2
**Impact potentiel en cas d’échec :** sélection partielle et silencieuse pouvant conduire l’utilisateur affecté à un panier différent de son intention.

**Référence attendue :** AC-CART-05 comme comportement spécial documenté de `problem_user`, et non comme référence métier nominale.
**Type de référence :** Baseline observée.
**Justification du test :** caractérise une dégradation reproductible de `problem_user` sans en faire un besoin nominal.

**Justification de la priorité :** caractérisation complémentaire de RISK-CART-01, maintenue en Regression mais classée P2 car elle décrit un compte volontairement dégradé, reste hors Smoke et ne remplace pas les défenses nominales plus fortes.
**Tags :** `@error @regression @cart`

**Préconditions :** `problem_user` connecté, panier vide.  
**Données de test :** les six produits.

**Étapes :** 1. Choisir Add to cart sur chaque produit. 2. Observer boutons et badge. 3. Ouvrir Cart.  
**Résultat attendu :** Seuls Backpack, Bike Light et Onesie passent à Remove et figurent au panier; badge 3; aucun message visible pour les autres.  
**Critère de réussite :** Les trois succès et trois échecs correspondent à l’observation.

### TC-PAN-06 — Ajouts partiels de error_user

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Caractérisation reproductible d’un mode dégradé spécial ; conservation sous surveillance de sa stabilité et de son coût de maintenance.

**User Story :** US-04  
**Critère(s) couvert(s) :** AC-CART-05  
**Risque(s) couvert(s) :** RISK-CART-01
**Type :** Erreur  
**Priorité :** P2
**Impact potentiel en cas d’échec :** sélection partielle et silencieuse pouvant rendre le contenu du panier imprévisible pour l’utilisateur affecté.

**Référence attendue :** AC-CART-05 comme comportement spécial documenté de `error_user`, sans en faire une règle souhaitée.
**Type de référence :** Baseline observée.
**Justification du test :** caractérise une dégradation reproductible de `error_user` sans en faire un besoin nominal.

**Justification de la priorité :** caractérisation complémentaire d’un mode de défaillance du panier, maintenue en Regression mais classée P2 car elle concerne un compte spécial, reste hors Smoke et ne remplace pas les défenses nominales plus fortes.
**Tags :** `@error @regression @cart`

**Préconditions :** `error_user` connecté, panier vide.  
**Données de test :** les six produits.

**Étapes :** 1. Ajouter successivement les six produits. 2. Observer badge et boutons. 3. Ouvrir Cart.  
**Résultat attendu :** Backpack, Bike Light et Onesie seulement sont ajoutés; badge 3; les autres restent ajoutables sans message visible.  
**Critère de réussite :** L’état du panier contient exactement ces trois articles.

### Checkout

### TC-CHK-01 — Finalisation d’une commande nominale

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Parcours métier essentiel, stable et déterministe, apportant un signal Smoke rapide sur la capacité à commander.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-01  
**Risque(s) couvert(s) :** RISK-CHK-01
**Technique(s) de conception :** EP, DT, ST, SBT
**Type :** Passant  
**Priorité :** P0  
**Impact potentiel en cas d’échec :** achat impossible ou statut de commande ambigu après tentative de finalisation.
**Référence attendue :** AC-CHK-01, règle R4 de la table de décision et modèle Step One → Step Two → Checkout Complete.
**Type de référence :** Référence spécifiée et référence dérivée des transitions attendues.
**Justification du test :** protège le parcours principal permettant à un utilisateur de finaliser une commande.

**Justification de la priorité :** aboutissement du tunnel d’achat et RISK-CHK-01 critique; signal Smoke indispensable sur la conversion nominale.
**Tags :** `@positive @smoke @regression @checkout`

**Préconditions :** `standard_user` connecté, Backpack au panier.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Ouvrir Cart et Checkout. 2. Saisir les trois informations. 3. Continuer. 4. Vérifier l’article. 5. Choisir Finish.  
**Résultat attendu :** La page Checkout Complete remercie l’utilisateur et propose Back Home.  
**Critère de réussite :** `/checkout-complete.html` est atteint avec le message de confirmation.

### TC-CHK-02 — Exactitude du récapitulatif financier

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Règle arithmétique fiable à forte valeur métier, propice à des assertions répétables en régression.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-02  
**Risque(s) couvert(s) :** RISK-CHK-02
**Type :** Passant  
**Priorité :** P0
**Impact potentiel en cas d’échec :** montant présenté incorrect, avec conséquence financière ou réglementaire potentielle.
**Référence attendue :** le sous-total correspond à la somme des prix des lignes du panier; le total correspond au sous-total augmenté de la taxe affichée. Les valeurs 129,94 $ et 140,34 $ dérivent des six produits du scénario et de cette relation. La taxe de 10,40 $ est une baseline observée de régression : faute de taux, de formule et de règle d’arrondi spécifiés, elle ne constitue pas une référence métier indépendante.
**Type de référence :** Référence dérivée pour le sous-total et le total; baseline observée pour la taxe de 10,40 $.
**Justification du test :** contrôle l’intégrité financière du récapitulatif et la qualité du signal Smoke.
**Incertitude métier :** le taux, la formule, l’arrondi et la conformité métier de la taxe de 10,40 $ ne sont pas démontrés.

**Justification de la priorité :** contrôle d’intégrité financière de RISK-CHK-02 élevé; un tunnel techniquement finalisable avec un montant faux ne constitue pas un Smoke acceptable.
**Tags :** `@positive @smoke @regression @checkout`

**Préconditions :** Les six produits nominaux au panier.  
**Données de test :** Jean / Dupont / 75001; somme attendue 129,94 $.

**Étapes :** 1. Accéder au checkout. 2. Renseigner les informations. 3. Continuer. 4. Additionner les prix et comparer sous-total, taxe et total.  
**Résultat attendu :** Sous-total 129,94 $, taxe 10,40 $, total 140,34 $.  
**Critère de réussite :** Sous-total = somme des lignes et total = sous-total + taxe.

### TC-CHK-03 — Prénom obligatoire

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Validation négative stable d’une règle obligatoire, peu coûteuse à rejouer avec un résultat déterministe.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-03  
**Risque(s) couvert(s) :** RISK-CHK-04
**Technique(s) de conception :** EP, DT
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** progression avec identité de livraison incomplète ou absence d’indication exploitable pour corriger la saisie.

**Référence attendue :** AC-CHK-03 et règle R1 de la table de décision : prénom absent implique maintien à Step One et message correspondant.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie la première donnée obligatoire et le guidage permettant de corriger la saisie.

**Justification de la priorité :** validation importante de RISK-CHK-04 moyen, répétable en régression; le parcours nominal P0 reste le premier signal.
**Tags :** `@error @regression @checkout`

**Préconditions :** `standard_user` à l’étape d’informations.  
**Données de test :** trois champs vides.

**Étapes :** 1. Choisir Continue sans saisie.  
**Résultat attendu :** « Error: First Name is required »; même étape conservée.  
**Critère de réussite :** Aucun récapitulatif ne s’affiche.

### TC-CHK-04 — Nom obligatoire

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Validation négative stable d’une règle obligatoire, peu coûteuse à rejouer avec un résultat déterministe.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-04  
**Risque(s) couvert(s) :** RISK-CHK-04
**Technique(s) de conception :** EP, DT
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** progression avec nom de livraison absent ou validation ciblant le mauvais champ.

**Référence attendue :** AC-CHK-04 et règle R2 de la table de décision : prénom présent et nom absent impliquent le message Last Name.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie la deuxième donnée obligatoire et l’ordre de validation du formulaire.

**Justification de la priorité :** complète la couverture des champs obligatoires et la règle de validation progressive en régression.
**Tags :** `@error @regression @checkout`

**Préconditions :** `standard_user` à l’étape d’informations.  
**Données de test :** prénom Jean uniquement.

**Étapes :** 1. Saisir Jean. 2. Choisir Continue.  
**Résultat attendu :** « Error: Last Name is required »; étape inchangée.  
**Critère de réussite :** La validation cible le premier champ manquant suivant.

### TC-CHK-05 — Code postal obligatoire

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Validation négative stable d’une règle obligatoire, peu coûteuse à rejouer avec un résultat déterministe.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-05  
**Risque(s) couvert(s) :** RISK-CHK-04
**Technique(s) de conception :** EP, DT
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** progression sans information postale nécessaire à la livraison.

**Référence attendue :** AC-CHK-05 et règle R3 de la table de décision : prénom et nom présents, code postal absent, impliquent le message Postal Code.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie la dernière donnée obligatoire avant l’accès au récapitulatif.

**Justification de la priorité :** dernière règle obligatoire avant le récapitulatif; importante en régression sans justifier un contrôle Smoke distinct.
**Tags :** `@error @regression @checkout`

**Préconditions :** `standard_user` à l’étape d’informations.  
**Données de test :** Jean / Dupont, code postal vide.

**Étapes :** 1. Saisir prénom et nom. 2. Choisir Continue.  
**Résultat attendu :** « Error: Postal Code is required »; étape inchangée.  
**Critère de réussite :** Aucun récapitulatif n’est accessible sans code postal.

### TC-CHK-06 — Commande finalisée avec panier vide

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Caractérisation déterministe d’un chemin limite du checkout, maintenue pour signaler toute modification de ce comportement non nominal.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-06  
**Risque(s) couvert(s) :** RISK-CHK-03
**Technique(s) de conception :** DT, SBT
**Type :** Non passant  
**Priorité :** P1
**Impact potentiel en cas d’échec :** commande sans article confirmée, métriques métier polluées ou statut utilisateur trompeur.

**Référence attendue :** Comportement observé à caractériser. AC-CHK-06 et la règle R5 documentent le total nul et la confirmation observée, sans définir que cette confirmation est souhaitée.
**Type de référence :** Comportement observé à caractériser.
**Justification du test :** surveille le parcours complet d’une commande vide sans déclarer son résultat conforme.
**Incertitude métier :** le projet ne définit pas si une commande vide doit être acceptée, refusée ou signalée autrement.

**Justification de la priorité :** RISK-CHK-03 élevé et comportement reproductible à surveiller; P1 plutôt que P0 tant que la décision produit n’est pas prise.
**Tags :** `@negative @regression @checkout`

**Préconditions :** `standard_user` connecté, panier vide.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Ouvrir Checkout depuis le panier vide. 2. Saisir les informations. 3. Continuer. 4. Relever les montants. 5. Choisir Finish.  
**Résultat attendu :** Sous-total 0 $, total 0,00 $, puis confirmation de commande.  
**Critère de réussite :** Le parcours vide observé aboutit sans article.

### TC-CHK-07 — Nom impossible à renseigner pour problem_user

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Mode dégradé spécial reproductible et utile au diagnostic ; automatisation conservée sous surveillance de rentabilité.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-07  
**Risque(s) couvert(s) :** RISK-CHK-01, RISK-CHK-04
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** impossibilité pour l’utilisateur affecté de fournir une donnée obligatoire et donc de poursuivre sa commande.

**Référence attendue :** AC-CHK-07 comme caractérisation explicite de `problem_user`; ce comportement n’est pas une règle métier souhaitée pour le checkout nominal.
**Type de référence :** Baseline observée.
**Justification du test :** caractérise la dégradation reproductible de `problem_user` pendant la saisie du checkout.

**Justification de la priorité :** mode de défaillance majeur pour le compte concerné, conservé en régression mais exclu du Smoke nominal.
**Tags :** `@error @regression @checkout`

**Préconditions :** `problem_user` à l’étape d’informations avec un produit au panier.  
**Données de test :** Jean / Dupont / 75001.

**Étapes :** 1. Saisir prénom, nom et code postal. 2. Relire les champs. 3. Choisir Continue.  
**Résultat attendu :** Le nom reste vide; « Error: Last Name is required » s’affiche; pas de récapitulatif.  
**Critère de réussite :** Le défaut est visible sans forcer ni contourner le champ.

### TC-CHK-08 — Finish inopérant pour error_user

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Mode dégradé spécial reproductible sur une transition critique ; automatisation conservée sous surveillance de rentabilité.

**User Story :** US-05  
**Critère(s) couvert(s) :** AC-CHK-08  
**Risque(s) couvert(s) :** RISK-CHK-01
**Technique(s) de conception :** ST
**Type :** Erreur  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** commande impossible à finaliser et absence de retour explicatif pour l’utilisateur affecté.

**Référence attendue :** AC-CHK-08 comme transition dégradée documentée de `error_user`; la référence métier nominale reste AC-CHK-01.
**Type de référence :** Baseline observée.
**Justification du test :** caractérise l’échec reproductible de finalisation de `error_user` sans remplacer le contrôle nominal.

**Justification de la priorité :** caractérise un mode de défaillance relié à RISK-CHK-01 critique, sans remplacer ni alourdir le Smoke nominal.
**Tags :** `@error @regression @checkout`

**Préconditions :** `error_user` au récapitulatif avec Backpack au panier et informations acceptées.  
**Données de test :** Jean / Dupont / 75001; l’étape 2 doit avoir été atteinte par les interactions normales de l’interface.

**Étapes :** 1. Vérifier le récapitulatif. 2. Choisir Finish. 3. Observer l’adresse et les messages.  
**Résultat attendu :** L’adresse reste `/checkout-step-two.html`, aucune confirmation et aucun message d’erreur visible.  
**Critère de réussite :** Le clic n’achève pas la commande.

### Session

### TC-SESSION-01 — Conservation après rafraîchissement

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Contrôle Smoke répétitif de persistance, stable et déterministe, avec un fort besoin de feedback rapide.

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-01  
**Risque(s) couvert(s) :** RISK-CART-02, RISK-SESSION-01
**Technique(s) de conception :** ST
**Type :** Passant  
**Priorité :** P0
**Impact potentiel en cas d’échec :** perte du contexte d’achat ou du panier pendant une session active.
**Référence attendue :** AC-SESSION-01 et état précédent connu : utilisateur authentifié, Backpack sélectionné et badge à 1 doivent rester cohérents après refresh.
**Type de référence :** Référence spécifiée et référence dérivée de l’état précédent.
**Justification du test :** vérifie que le contexte d’achat testé reste cohérent après un Refresh dans la même session.

**Justification de la priorité :** garde-barrière court de RISK-CART-02 et RISK-SESSION-01 élevés; détecte tôt une perte de contexte affectant le parcours d’achat.
**Tags :** `@positive @smoke @regression @session`

**Préconditions :** `standard_user` connecté, Backpack ajouté.  
**Données de test :** badge 1.

**Étapes :** 1. Rafraîchir Inventory. 2. Contrôler la page et le badge. 3. Ouvrir Cart.  
**Résultat attendu :** L’utilisateur reste connecté; badge 1 et Backpack sont conservés.  
**Critère de réussite :** Session et état panier survivent au rafraîchissement.

### TC-SESSION-02 — Déconnexion explicite

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Contrôle Smoke de session essentiel, fréquent et vérifiable de manière fiable sans interprétation humaine.

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-02  
**Risque(s) couvert(s) :** RISK-SESSION-02
**Technique(s) de conception :** ST
**Type :** Passant  
**Priorité :** P0  
**Impact potentiel en cas d’échec :** session non terminée et accès possible par l’utilisateur suivant.
**Référence attendue :** AC-SESSION-02 et transition Authentifié → Déconnecté déclenchée par Logout.
**Type de référence :** Référence spécifiée.
**Justification du test :** protège la terminaison explicite d’une session authentifiée.

**Justification de la priorité :** contrôle Smoke essentiel de terminaison de session lié à RISK-SESSION-02 élevé et préalable aux vérifications de routes protégées.
**Tags :** `@positive @smoke @regression @session`

**Préconditions :** `standard_user` connecté.  
**Données de test :** aucune.

**Étapes :** 1. Ouvrir le menu. 2. Choisir Logout.  
**Résultat attendu :** La page de connexion est affichée.  
**Critère de réussite :** Inventory n’est plus affichée et l’adresse revient à `/`.

### TC-SESSION-03 — Refus d’une route protégée après logout

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Test négatif stable protégeant une frontière d’autorisation à fort impact et nécessitant une régression fréquente.

**User Story :** US-06
**Critère(s) couvert(s) :** AC-SESSION-03
**Risque(s) couvert(s) :** RISK-AUTH-02, RISK-SESSION-02
**Technique(s) de conception :** ST
**Type :** Erreur  
**Priorité :** P0  
**Impact potentiel en cas d’échec :** accès non autorisé à une zone protégée après déconnexion.
**Référence attendue :** AC-SESSION-03 et transition interdite Déconnecté → Cart; la route doit rester protégée après logout.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie que la route Cart réellement testée reste inaccessible après Logout.
**Incertitude métier :** ce contrôle ne démontre pas que toutes les routes sont protégées ni une politique générale de session.

**Justification de la priorité :** contrôle de sécurité fonctionnelle à impact fort sur RISK-AUTH-02 et RISK-SESSION-02; P0 même hors tag Smoke afin de rester prioritaire dans la régression de session.
**Tags :** `@error @regression @session`

**Préconditions :** Une connexion nominale vient d’être fermée par Logout.  
**Données de test :** `/cart.html`.

**Étapes :** 1. Demander directement la route du panier.  
**Résultat attendu :** La connexion est présentée avec « Epic sadface: You can only access '/cart.html' when you are logged in. »  
**Critère de réussite :** Aucun contenu du panier protégé n’est accessible.

### TC-SESSION-04 — Réinitialisation de l’état applicatif

**Mode d’exécution :** Automatisé  
**Justification du mode d’exécution :** Transition d’état déterministe et répétitive, utile pour prévenir les incohérences de panier et de session.

**User Story :** US-06  
**Critère(s) couvert(s) :** AC-SESSION-04  
**Risque(s) couvert(s) :** RISK-SESSION-03
**Technique(s) de conception :** ST
**Type :** Passant  
**Priorité :** P1  
**Impact potentiel en cas d’échec :** état d’achat résiduel après Reset ou déconnexion involontaire interrompant le parcours.

**Référence attendue :** AC-SESSION-04 et transition Authentifié avec panier → Authentifié avec panier vide.
**Type de référence :** Référence spécifiée.
**Justification du test :** vérifie que Reset App State vide le panier tout en conservant la session dans le scénario testé.

**Justification de la priorité :** contrôle de régression de RISK-SESSION-03 faible; utile mais exécuté après les protections P0 de persistance et logout.
**Tags :** `@positive @regression @session`

**Préconditions :** `standard_user` connecté avec Backpack au panier.  
**Données de test :** badge initial 1.

**Étapes :** 1. Ouvrir le menu. 2. Choisir Reset App State. 3. Fermer le menu et ouvrir Cart.  
**Résultat attendu :** Le badge disparaît et Cart est vide; la session reste sur l’espace authentifié.  
**Critère de réussite :** L’état d’achat est remis à zéro sans logout.

### TC-SESSION-05 — Refuser l'accès direct au panier depuis une session jamais authentifiée

**Mode d’exécution :** Automatisé

**Justification du mode d’exécution :** Le résultat est clair et déterministe, le scénario est court, utile en régression et observable de façon fiable par Playwright à faible coût.

**User Story :** US-06

**Critère(s) couvert(s) :** AC-SESSION-03

**Risque(s) couvert(s) :** RISK-SESSION-02, RISK-AUTH-02
**Technique(s) de conception :** ST
**Type :** Erreur
**Priorité :** P1
**Impact potentiel en cas d’échec :** une personne jamais authentifiée pourrait accéder à une zone qui doit être réservée à une session authentifiée.
**Référence attendue :** AC-SESSION-03 uniquement; une session déconnectée doit être refusée lorsqu’elle demande directement `/cart.html`.
**Type de référence :** Référence spécifiée.
**Justification du test :** contrôle la protection de Cart depuis un état initial vierge, distinct de la protection après Logout vérifiée par TC-SESSION-03.
**Incertitude métier :** ce contrôle ne démontre pas que Inventory ou les routes du checkout sont protégées.

**Justification de la priorité :** contrôle négatif court d’un risque élevé, utile en régression, mais ne nécessitant pas d’être ajouté automatiquement à la Smoke.
**Tags :** `@error @regression @session`

**Préconditions :** Nouveau contexte navigateur sans authentification préalable et sans état utilisateur réutilisé.
**Données de test :** `/cart.html`.

**Étapes :** 1. Démarrer avec une session navigateur vierge. 2. Ouvrir directement `/cart.html`. 3. Observer la redirection. 4. Vérifier la page de connexion et le message d’accès refusé.
**Résultat attendu :** La page de connexion est affichée avec « Epic sadface: You can only access '/cart.html' when you are logged in. »
**Critère de réussite :** Aucun contenu du panier authentifié n’est accessible.

## 10. Matrice Passant / Non passant / Erreur

Un tiret signifie qu’aucun comportement « non passant » distinct et pertinent n’a été observé pour le domaine; les dégradations explicites sont classées Erreur.

| Fonctionnalité | Passant | Non passant | Erreur |
|---|---|---|---|
| Authentification | TC-AUTH-01 | TC-AUTH-02 | TC-AUTH-03, TC-AUTH-04, TC-AUTH-05 |
| Catalogue | TC-CAT-01, TC-CAT-02 | — | TC-CAT-03, TC-CAT-04 |
| Tri | TC-TRI-01, TC-TRI-02, TC-TRI-03, TC-TRI-04 | — | TC-TRI-05, TC-TRI-06 |
| Panier | TC-PAN-01, TC-PAN-02, TC-PAN-03 | TC-PAN-04 | TC-PAN-05, TC-PAN-06 |
| Checkout | TC-CHK-01, TC-CHK-02 | TC-CHK-06 | TC-CHK-03, TC-CHK-04, TC-CHK-05, TC-CHK-07, TC-CHK-08 |
| Session | TC-SESSION-01, TC-SESSION-02, TC-SESSION-04 | — | TC-SESSION-03, TC-SESSION-05 |

## 11. Priorisation

| Priorité | Définition appliquée | Nombre |
|---|---|---:|
| P0 | Tests essentiels et garde-barrières de Smoke, d’accès, panier, commande, montant, persistance et session | 8 |
| P1 | Tests importants de régression fonctionnelle exécutés après ou en complément des P0 | 20 |
| P2 | Scénarios secondaires, rares ou de caractérisation, y compris lorsqu’ils contribuent à un risque élevé déjà protégé par des défenses nominales plus fortes | 6 |

Les P0 sont : TC-AUTH-01, TC-CAT-01, TC-PAN-01, TC-CHK-01, TC-CHK-02, TC-SESSION-01, TC-SESSION-02 et TC-SESSION-03. Cette priorité fixe leur ordre d’exécution et ne leur attribue aucune sévérité de défaut.

## 12. Tags

| Tag | Usage |
|---|---|
| `@positive` | Parcours passant |
| `@negative` | Parcours alternatif/refusé non explicitement en erreur |
| `@error` | Validation ou dégradation explicite |
| `@smoke` | Sous-ensemble critique rapide |
| `@regression` | Cas à rejouer lors d’une campagne complète |
| `@auth`, `@catalog`, `@sorting`, `@cart`, `@checkout`, `@session` | Domaine fonctionnel propriétaire |

Chaque cas porte exactement un tag de nature, au moins un tag de campagne et son tag de domaine.

La Smoke contient sept cas : TC-AUTH-01, TC-CAT-01, TC-PAN-01, TC-CHK-01, TC-CHK-02, TC-SESSION-01 et TC-SESSION-02. Elle vérifie l’accès, le catalogue, la sélection, la commande, l’exactitude financière, la persistance et la fermeture de session. Les refus et dégradations spéciales restent dans la Regression afin que la Smoke demeure ciblée. Les 34 cas portent `@regression`.

## 13. Risques et comportements spécifiques SauceDemo

- `locked_out_user` est volontairement refusé; ce n’est pas une panne de données de test.
- `problem_user` affiche six images `sl-404`, ne réordonne pas le catalogue, n’ajoute que trois produits sur six et ne conserve pas le nom au checkout.
- `error_user` ne réordonne pas le catalogue, n’ajoute que les mêmes trois produits et laisse Finish sans effet ni message visible.
- Le panier vide peut entrer dans le checkout et produire une confirmation à 0,00 $; le plan conserve ce comportement observé comme parcours non passant, sans supposer un blocage inexistant.
- Une fiche inconnue affiche un faux produit « ITEM NOT FOUND » avec un prix atypique; la vérification porte sur le signalement et le retour, pas sur une hypothétique page HTTP 404.
- Les défauts spéciaux peuvent évoluer avec la version publique de la démo; une nouvelle exploration est recommandée avant automatisation.
- Les montants et le copyright dépendent de l’état public de l’application; les valeurs présentées sont celles observées à la date de référence.

### Automatisabilité future

- Les 34 cas sont automatisables avec des interactions utilisateur et des observations déterministes dans Chromium; aucun ne requiert de manipulation du DOM, d’injection de script ou de comparaison visuelle subjective.
- Les cas de caractérisation TC-CAT-04, TC-TRI-05, TC-TRI-06, TC-PAN-05, TC-PAN-06, TC-CHK-07 et TC-CHK-08 sont volontairement couplés à la version publique de la démo. Ils sont déterministes à la date de référence mais devront être reconfirmés avant implémentation si SauceDemo évolue.
- TC-CAT-03 dépend d’une navigation directe vers une référence inexistante et reste reproductible depuis une session authentifiée.
- TC-CHK-02 utilise des montants observés exacts; sa référence attendue dérive indépendamment le sous-total depuis les lignes et vérifie la relation total = sous-total + taxe affichée. La valeur exacte de taxe reste une baseline observée, sans preuve métier indépendante tant que son taux, sa formule et son arrondi ne sont pas spécifiés.
- TC-CHK-08 doit construire l’étape 2 par le parcours normal; aucun état interne ne doit être forcé. Si ce parcours n’est plus accessible lors de la prochaine exploration, le cas devra être révisé plutôt que contourné.

### Revue de la raison d’être et des priorités

- **TC enrichis :** 24 cas — les cinq cas d’authentification, TC-CAT-01, les six cas panier, les huit cas checkout et les quatre cas session — documentent désormais leur impact, leur référence attendue et leur justification de priorité.
- **TC non enrichis :** TC-CAT-02/03/04 et TC-TRI-01 à TC-TRI-06 conservent leur documentation existante. Leur priorité et leur résultat sont suffisamment lisibles; répéter leur AC et une justification générique ajouterait du bruit. Le tri reste un contrôle P1/P2 de recherche et de confort, sans impact artificiellement élevé.
- **Références identifiées :** AC explicites, partitions, règles R1 à R5 de la table de décision, modèle de transitions, état précédent du panier et relations arithmétiques des montants.
- **Références à clarifier :** TC-PAN-04 et TC-CHK-06 décrivent l’acceptation observée d’un panier vide; aucune règle produit ne dit encore si le parcours doit être bloqué.
- **Priorités confirmées :** les huit P0 restent des garde-barrières d’accès, catalogue, panier, commande, calcul et session. Les validations et transitions approfondies restent P1; les scénarios secondaires ou de caractérisation restent P2 selon leur valeur d’exécution.
- **Arbitrage appliqué :** TC-PAN-05 et TC-PAN-06 passent de P1 à P2. Ils restent automatisés en Regression, mais leur rôle de caractérisation de comptes spéciaux et les défenses nominales plus fortes de RISK-CART-01 ne justifient pas leur maintien dans la boucle prioritaire P1.

# Stratégie d’automatisation

## Objectif

L’automatisation fournit un contrôle répétable et un feedback rapide lorsque sa valeur de régression dépasse durablement son coût de création et de maintenance. Elle n’est ni une finalité, ni une preuve de qualité, ni une obligation applicable à toute future idée de test. Cette stratégie décide du mode d’exécution à partir du besoin, du risque, de la référence attendue, de la répétabilité et du besoin de jugement humain.

**Déterministe :** test pour lequel les mêmes conditions doivent produire un résultat clairement défini et reproductible.

**Valeur d’automatisation :** bénéfice obtenu en exécutant automatiquement un contrôle plutôt qu’en le répétant manuellement.

**Faux échec :** test rouge alors que le produit fonctionne correctement, par exemple à cause d’un délai, du réseau, de données instables ou d’un sélecteur fragile.

Un scénario techniquement automatisable n’est pas automatiquement un bon candidat à l’automatisation. La possibilité technique, la valeur QA et le coût de maintenance répondent à trois questions différentes : Playwright peut-il agir et observer, le contrôle apporte-t-il un signal utile, et ce signal vaut-il les efforts nécessaires pour le maintenir ?

## Principes

- Décider à partir de plusieurs critères convergents; aucune règle telle que `P0 = automatisé`, `risque élevé = E2E` ou `TC existant = automatisation obligatoire` n’est suffisante.
- Automatiser le contrôle le plus petit capable de donner un signal fiable, sans dupliquer inutilement un même chemin. Le projet est actuellement un portfolio E2E/UI Playwright : il ne démontre pas une pyramide de tests et ne revendique aucune couverture unitaire, API ou d’intégration inexistante.
- Conserver un scénario manuel ou exploratoire lorsque l’interprétation humaine produit davantage d’information qu’une assertion déterministe.
- Exiger une référence attendue claire avant de transformer une découverte en contrôle automatisé normatif.
- Évaluer le coût de maintenance, la stabilité des données et l’environnement aussi bien que le coût d’exécution manuelle.
- Réexaminer les automatisations couplées à un comportement de démonstration lorsque SauceDemo évolue, sans modifier leur résultat attendu uniquement pour les maintenir vertes.
- Maintenir séparées les notions de risque, priorité, sévérité, technique de conception et mode d’exécution.
- Ne pas présenter le Healer comme une raison d’accepter des tests fragiles : une réparation possible ne remplace pas des sélecteurs robustes, une synchronisation adaptée, des données maîtrisées, des assertions utiles et des scénarios stables.

### Smoke, Regression et mode d’exécution

- **Smoke :** petit ensemble de contrôles rapides donnant un premier signal sur les fonctions essentielles.
- **Regression :** ensemble plus large destiné à détecter le retour de défauts sur des comportements déjà connus.
- **Mode d’exécution :** façon d’effectuer le contrôle : automatisée, manuelle ou exploratoire.

Ces dimensions sont indépendantes. `P0` ne signifie pas automatiquement `Automatisé`, et `P2` ne signifie pas automatiquement `Manuel`. Un test peut légitimement être `P2 + Regression + Automatisé`. De même, un risque élevé ou critique influence la décision sans imposer une automatisation : il peut nécessiter un test automatisé, un contrôle manuel, une investigation exploratoire, une revue métier ou plusieurs de ces approches.

## Modes d’exécution

| Mode | Utilisation |
|---|---|
| Automatisé | Contrôle de régression répétitif, stable et déterministe, disposant d’une référence attendue exploitable et d’un bénéfice supérieur à sa maintenance. |
| Candidat à l’automatisation | Valeur probable identifiée, mais règle, stabilité, données, niveau de contrôle ou coût encore à confirmer. |
| Manuel | Vérification guidée dont la fréquence, la subjectivité ou le besoin de jugement humain rendent l’automatisation peu rentable. |
| Exploratoire | Investigation destinée à apprendre, varier et découvrir; la liberté de la session serait appauvrie par un script prématuré. |
| Non retenu | Proposition dont le signal attendu est redondant, ponctuel ou trop faible pour justifier un contrôle régulier. La décision et sa raison doivent rester traçables. |

Le mode décrit comment le contrôle est exécuté. Il ne change ni la priorité du besoin, ni le niveau du risque, ni la sévérité d’un défaut éventuellement découvert.

## Critères favorables

Une automatisation présente une forte valeur lorsque plusieurs éléments suivants sont réunis :

- exécution fréquente en Smoke ou Regression;
- contrôle répétitif et coûteux manuellement;
- comportement déterministe et données contrôlables;
- référence attendue claire et assertions métier fiables;
- fonctionnalité suffisamment stable;
- risque produit significatif ou rôle dans un parcours essentiel;
- besoin de feedback rapide;
- nombreuses données ou relations à comparer, notamment prix, lignes, badge et états;
- calcul ou règle de décision pouvant être exprimé sans constante opaque;
- faible besoin d’interprétation humaine;
- maintenance raisonnable et niveau de test adapté.

La présence d’un seul facteur favorable ne suffit pas. Un P0 subjectif ou instable peut rester manuel; un P2 déterministe et très peu coûteux peut rester automatisé s’il protège utilement la régression.

## Critères défavorables

La valeur d’automatisation devient conditionnelle ou faible lorsque plusieurs éléments suivants sont présents :

- comportement non spécifié ou comportement observé à caractériser;
- objectif d’investigation exploratoire;
- résultat visuel, qualitatif ou subjectif nécessitant un jugement humain;
- contrôle ponctuel ou faible probabilité de réexécution;
- environnement ou données difficilement contrôlables;
- forte instabilité sans impact métier proportionné;
- coût de maintenance supérieur au bénéfice attendu;
- résultat dépendant d’une version publique volontairement dégradée;
- besoin important de comparer, interpréter ou reformuler pendant la session;
- couverture déjà fournie par un contrôle plus petit et plus fiable.

Ces critères ne rendent pas un scénario « inférieur ». Ils orientent vers Manuel, Exploratoire, Candidat ou Non retenu selon la valeur recherchée.

Un jugement visuel subjectif, par exemple déterminer si une image représente sémantiquement le bon produit, ne devient pas fiable simplement parce que Playwright peut lire son URL. Une règle métier inconnue ne devient pas correcte parce que le comportement actuel est automatisé. Les commandes vides, la conformité métier de la taxe et les politiques de session non spécifiées restent donc clairement limitées ou à caractériser.

## Grille de décision

| Critère | Favorable | Défavorable |
|---|---|---|
| Fréquence | Smoke, régression régulière ou exécution à chaque changement | Vérification ponctuelle ou rare |
| Résultat | Déterministe et observable | Subjectif, ambigu ou non spécifié |
| Référence attendue | Règle, AC, calcul ou état clairement défini | Référence à clarifier ou simple comportement observé |
| Stabilité | Fonction, données et sélecteurs stables | Variations fréquentes sans valeur métier proportionnée |
| Valeur de régression | Détecte rapidement une régression significative | Signal redondant ou faible |
| Risque couvert | Menace un besoin ou un parcours important | Conséquence faible déjà suffisamment défendue |
| Coût manuel | Élevé, répétitif ou source d’erreur humaine | Faible et occasionnel |
| Jugement humain | Faible; comparaison objective | Important; interprétation ou appréciation nécessaire |
| Maintenance automatisée | Simple, localisée et prévisible | Disproportionnée ou dépendante d’un environnement incontrôlable |
| Données / combinaisons | Nombreuses vérifications stables | Données rares, non maîtrisées ou règles absentes |

### Décision argumentée

- **Forte valeur d’automatisation :** plusieurs critères favorables, référence claire, exécution régulière et maintenance proportionnée.
- **Valeur conditionnelle :** bénéfice plausible, mais clarification, exploration, stabilisation ou choix du niveau de test encore nécessaire.
- **Faible valeur d’automatisation :** jugement humain dominant, faible réexécution, redondance ou coût disproportionné; privilégier Manuel, Exploratoire ou Non retenu.

Aucun score numérique n’est calculé : les informations disponibles ne justifient pas une précision mathématique et les compromis doivent rester lisibles.

## Audit individuel des 34 TC

La décision ci-dessous a été recalculée à partir du besoin, du risque, de la priorité, de la campagne, de la stabilité, du caractère répétitif, de la référence attendue, de ce que Playwright observe réellement, du coût manuel et du coût probable de maintenance. Elle ne change le mode d’exécution d’aucun TC.

| TC | Décision | Pourquoi | Réserve éventuelle |
|---|---|---|---|
| TC-AUTH-01 | Automatisation fortement justifiée | Garde-barrière court et fréquent : une URL et un titre définis confirment de façon déterministe l’accès nominal. | Dépend du service public SauceDemo, comme toute la suite UI. |
| TC-AUTH-02 | Automatisation justifiée | Le refus d’une combinaison inconnue et son message sont stables, objectifs et peu coûteux à rejouer. | Ne prouve pas à lui seul la sécurité complète de l’authentification. |
| TC-AUTH-03 | Automatisation justifiée | La validation du nom d’utilisateur obligatoire est répétitive et possède un message précis. | Faible coût manuel unitaire, compensé par la fréquence de régression. |
| TC-AUTH-04 | Automatisation justifiée | Complète la validation des champs obligatoires avec un résultat déterministe distinct. | Même réserve de rendement que TC-AUTH-03. |
| TC-AUTH-05 | Automatisation justifiée | Le refus de `locked_out_user` est une règle explicite, stable et automatiquement observable. | Le compte est fourni par la démo; son contrat doit être reconfirmé si elle évolue. |
| TC-CAT-01 | Automatisation fortement justifiée | Compare en une exécution les six produits et leurs informations essentielles; le contrôle manuel répété serait lent et sujet aux oublis. | La présence d’une image ne prouve pas sa pertinence sémantique. |
| TC-CAT-02 | Automatisation justifiée | Vérifie un parcours fréquent fiche → retour et la cohérence de données produit avec des assertions objectives. | Recouvre une partie des données déjà contrôlées par TC-CAT-01. |
| TC-CAT-03 | Automatisation justifiée | La référence inexistante produit un état d’erreur reproductible et simple à surveiller. | Comportement couplé à une URL interne de la démo. |
| TC-CAT-04 | Automatisation discutable | Le motif `sl-404` fournit une baseline reproductible pour `problem_user`. | Il ne démontre pas qu’une image est sémantiquement correcte; valeur faible et couplage technique fort. |
| TC-TRI-01 | Automatisation justifiée | Compare objectivement toute la liste au tri alphabétique croissant; répétitif et propice aux erreurs manuelles. | Dépend du jeu de six produits public. |
| TC-TRI-02 | Automatisation justifiée | Vérifie l’ordre alphabétique inverse sur toutes les lignes avec un résultat calculable. | Même dépendance aux données que TC-TRI-01. |
| TC-TRI-03 | Automatisation justifiée | Convertit et compare tous les prix en ordre croissant, contrôle fastidieux à répéter manuellement. | Ne valide pas la justesse métier de chaque prix au-delà du jeu de référence. |
| TC-TRI-04 | Automatisation justifiée | Vérifie objectivement l’ordre décroissant des prix et complète la régression du composant de tri. | Même réserve que TC-TRI-03. |
| TC-TRI-05 | Automatisation discutable | Fige le tri inopérant de `problem_user` comme comportement spécial reproductible. | Très proche de TC-TRI-06 et non représentatif du besoin nominal. |
| TC-TRI-06 | Automatisation discutable | Distingue le profil `error_user` et détecte une évolution de son tri dégradé. | Signal potentiellement redondant avec TC-TRI-05. |
| TC-PAN-01 | Automatisation fortement justifiée | Contrôle rapidement bouton, badge, ligne, quantité et prix lors de la première transition du panier. | Aucun enjeu de maintenance particulier au-delà de l’UI publique. |
| TC-PAN-02 | Automatisation justifiée | Le retrait du dernier article et le passage à zéro sont objectifs, fréquents et faciles à vérifier. | Parcours court et faible coût manuel, mais forte répétitivité en régression. |
| TC-PAN-03 | Automatisation fortement justifiée | Plusieurs transitions et identités produit doivent rester cohérentes; l’automatisation évite des vérifications manuelles nombreuses. | Parcours plus long, donc davantage exposé aux changements d’interface. |
| TC-PAN-04 | Automatisation discutable | La baseline rend visible l’accès actuel au checkout avec panier vide. | La règle produit est inconnue : un test vert ne prouve pas que ce comportement est correct. |
| TC-PAN-05 | Automatisation discutable | Vérifie précisément et à faible coût le sous-ensemble d’ajouts de `problem_user` en Regression. | Même sous-ensemble que TC-PAN-06; baseline de démo, pas besoin nominal. |
| TC-PAN-06 | Automatisation discutable | Surveille séparément le profil `error_user` et fournit un diagnostic lors d’une évolution. | Redondance possible avec TC-PAN-05 et dépendance à la version publique. |
| TC-CHK-01 | Automatisation fortement justifiée | Protège le parcours essentiel jusqu’à la confirmation avec des transitions et messages clairement définis. | Parcours UI plus long qu’un contrôle composant, mais niveau UI imposé par le projet disponible. |
| TC-CHK-02 | Automatisation fortement justifiée | Additionne six prix, vérifie les lignes, le sous-total et la cohérence additive du total; fort gain face au calcul manuel répété. | La taxe de 10,40 $ reste une baseline; taux, formule et arrondi ne sont pas prouvés. |
| TC-CHK-03 | Automatisation justifiée | Vérifie la première règle déterministe de validation du formulaire et son message. | Faible coût manuel isolé; valeur apportée par la répétition en régression. |
| TC-CHK-04 | Automatisation justifiée | Vérifie la deuxième combinaison de la validation progressive, distincte de l’absence de prénom. | L’E2E-02 recouvre une partie du même comportement. |
| TC-CHK-05 | Automatisation justifiée | Vérifie la dernière donnée obligatoire et empêche une régression silencieuse de l’ordre de validation. | Même réserve de coût manuel faible que les deux validations précédentes. |
| TC-CHK-06 | Automatisation discutable | Surveille le parcours reproductible d’une commande vide jusqu’à sa confirmation. | Comportement observé à caractériser : l’automatisation ne dit pas s’il devrait être accepté ou refusé. |
| TC-CHK-07 | Automatisation discutable | Caractérise de façon reproductible le nom non saisissable de `problem_user`. | Baseline d’un compte volontairement dégradé, non exigence nominale. |
| TC-CHK-08 | Automatisation discutable | Vérifie que Finish reste inopérant pour `error_user` après un parcours normal. | Scénario plus long et fortement couplé à un comportement spécial de la démo. |
| TC-SESSION-01 | Automatisation justifiée | Refresh et conservation du panier dans la même session sont objectivement observables et utiles en régression. | Ne démontre aucune persistance après reconnexion ou changement d’utilisateur. |
| TC-SESSION-02 | Automatisation fortement justifiée | Logout est une transition essentielle, courte, déterministe et fréquemment rejouée. | Ne couvre pas l’expiration ou les autres formes de fin de session. |
| TC-SESSION-03 | Automatisation fortement justifiée | Vérifie rapidement que la route Cart testée est refusée après Logout. | Ne permet pas de généraliser la protection à toutes les routes. |
| TC-SESSION-04 | Automatisation justifiée | Le passage panier rempli → panier vide tout en restant authentifié est précis et facilement observable. | Ne définit pas une politique globale de Reset sur tous les écrans. |
| TC-SESSION-05 | Automatisation justifiée | Le refus de Cart depuis une session vierge est court, déterministe et fondé sur AC-SESSION-03. | Ne permet pas de généraliser la protection aux autres routes. |

Synthèse de l’audit :

- **Automatisation fortement justifiée : 8** — TC-AUTH-01, TC-CAT-01, TC-PAN-01, TC-PAN-03, TC-CHK-01, TC-CHK-02, TC-SESSION-02 et TC-SESSION-03.
- **Automatisation justifiée : 17** — TC-AUTH-02 à TC-AUTH-05, TC-CAT-02, TC-CAT-03, TC-TRI-01 à TC-TRI-04, TC-PAN-02, TC-CHK-03 à TC-CHK-05, TC-SESSION-01, TC-SESSION-04 et TC-SESSION-05.
- **Automatisation discutable : 9** — TC-CAT-04, TC-TRI-05, TC-TRI-06, TC-PAN-04 à TC-PAN-06, TC-CHK-06 à TC-CHK-08.
- **Plutôt manuel : 0.** Aucun TC scripté actuel ne repose principalement sur un jugement humain; les contrôles visuels sémantiques plus larges restent dans les missions exploratoires.
- **Plutôt exploratoire : 0.** Les 34 TC ont un chemin et une assertion reproductibles; les questions ouvertes qui nécessitent de varier librement les actions sont séparées dans les huit missions exploratoires.

Une automatisation discutable n’est ni inutile ni à supprimer immédiatement. Elle doit être réévaluée lorsque sa maintenance augmente, que son comportement spécial change ou qu’un autre contrôle fournit le même signal à moindre coût.

## Gouvernance des nouveaux tests

Toute nouvelle proposition de TC doit contenir :

- **Mode d’exécution :** Automatisé, Candidat à l’automatisation, Manuel, Exploratoire ou Non retenu;
- **Justification du mode d’exécution :** décision fondée sur la grille, le risque, la fréquence, la référence attendue et le besoin de jugement humain.

Le flux de gouvernance est le suivant :

```text
Besoin / observation
    ↓
Risque et référence attendue
    ↓
Technique et conditions de test
    ↓
Décision du mode d’exécution
    ↓
TC formel si pertinent
    ↓
Automatisation seulement si sa valeur est confirmée
```

Une découverte exploratoire ne devient candidate qu’après reproductibilité, clarification de la référence, conséquence pertinente et besoin de régression. Un TC manuel n’est pas une dette par nature. Un scénario Non retenu peut être réévalué si son risque, sa fréquence ou son contexte change.

### Fiche de décision pour un futur TC

```text
Fréquence d’exécution :
Résultat déterministe : OUI/NON
Référence attendue fiable : OUI/NON
Stabilité estimée :
Coût manuel :
Valeur pour la régression :
Vérifiable avec Playwright : OUI/NON
Coût de maintenance estimé :
Décision : Automatiser / Manuel / Exploratoire / À réévaluer
Justification :
```

Cette fiche appartient à la convention de stratégie; elle n’est pas recopiée mécaniquement dans les 34 TC existants.

### Promotion et désautomatisation

Un futur contrôle manuel peut être promu vers l’automatisation lorsque son comportement attendu est clair, reproductible, rejoué assez souvent, vérifiable automatiquement, utile en régression et maintenable à un coût acceptable.

Une automatisation existante peut être remise en question si elle devient très instable, rarement utile, disproportionnée à maintenir, dépendante d’un jugement humain ou redondante sans signal supplémentaire. La décision doit être documentée; elle ne doit jamais consister à affaiblir une assertion pour garder un test vert.

### Passage de l’exploration à une automatisation

```text
Observation exploratoire
→ analyse
→ comportement attendu confirmé
→ éventuel Test Case
→ décision séparée d’automatisation
```

Les huit missions exploratoires restent prévues et non exécutées. Elles apportent une valeur différente : le QA peut varier ses actions, suivre une observation inattendue, changer de direction et exercer son jugement. Le raccourci `observation intéressante → test Playwright` est interdit.

## Mesures et limites

Les trois mesures suivantes répondent à des questions différentes :

- **Couverture fonctionnelle :** quelles fonctionnalités, US et AC du périmètre défini possèdent un contrôle ?
- **Couverture des risques :** quels modes de défaillance sont suffisamment défendus, partiellement couverts ou résiduels ?
- **Taux d’automatisation :** quelle part des TC scriptés définis possède une implémentation automatisée ?

Formule retenue :

```text
Taux d’automatisation = TC automatisés / TC scriptés définis
```

Cette métrique décrit l’état du portefeuille; elle ne mesure ni la qualité des assertions, ni la maîtrise des risques, ni la couverture des charters, ni le ROI. Un futur TC Manuel fera légitimement diminuer le taux sans dégrader automatiquement la stratégie. Les charters `EXP-*`, qui ne sont pas des TC, restent exclus du numérateur et du dénominateur.

## État actuel

| Indicateur | État |
|---|---:|
| TC scriptés définis | 34 |
| TC automatisés | 34 |
| Taux descriptif actuel | 100 % |
| Charters exploratoires | 8 |
| Sessions exploratoires terminées | 0 |
| TC manuels définis | 0 |
| Candidats à l’automatisation définis | 0 |
| Scénarios Non retenus formalisés | 0 |

Le taux `34/34` est factuellement exact mais ne constitue pas une cible. Après audit individuel, 25 automatisations ont une valeur forte ou justifiée et 9 sont discutables sans exiger de désautomatisation immédiate. Leur maintien actuel est défendable parce que les baselines sont reproductibles, les assertions sont précises, les scénarios restent stables et le coût marginal est contenu par les Page Objects communs. Ce verdict devra être revu si la démo change, si des faux échecs apparaissent ou si la maintenance devient disproportionnée.

Le taux d’automatisation décrit ce qui est automatisé; il ne mesure pas à lui seul la qualité de la stratégie QA.

### Automatisations à revoir

Le statut `À revoir` est un signal de gouvernance et ne change pas le mode d’exécution validé. Il impose de réévaluer la valeur lors d’une évolution de SauceDemo, d’une instabilité ou d’une hausse du coût de maintenance; il ne déclenche ni suppression ni affaiblissement des assertions.

| Tests | Statut | Justification de la revue |
|---|---|---|
| TC-CAT-04 | À revoir | Caractérisation visuelle de `problem_user`, couplée au motif technique `sl-404`; signal déterministe, mais valeur de régression plus faible et dépendante de la démo. |
| TC-TRI-05, TC-TRI-06 | À revoir | Même mode dégradé de tri exercé avec deux comptes spéciaux; utile pour distinguer les profils, mais rendement à reconfirmer si leurs comportements convergent durablement. |
| TC-PAN-05, TC-PAN-06 | À revoir | Même sous-ensemble d’ajouts partiels attendu pour deux comptes spéciaux; assertions diagnostiques précises, avec risque de redondance si les profils restent identiques. |
| TC-CHK-07, TC-CHK-08 | À revoir | Défaillances spéciales reproductibles sur le checkout; valeur de caractérisation réelle, mais elles ne constituent pas des exigences métier souhaitées. |
| E2E-02 | À revoir | Recouvre largement la règle de nom obligatoire déjà contrôlée par TC-CHK-04; son apport transversal panier → checkout doit rester supérieur à son coût d’exécution et de maintenance. |

Lors de l’audit de robustesse du 4 octobre 2026, deux exécutions consécutives de la suite Chromium ont donné 72/72 succès sans retry local, attente arbitraire ni instabilité observée. Cette mesure confirme la stabilité à cet instant; elle ne dispense pas de la revue de rentabilité ci-dessus.

Les huit charters `EXP-AUTH-01`, `EXP-CAT-01`, `EXP-SORT-01`, `EXP-CART-01`, `EXP-CHK-01`, `EXP-CHK-02`, `EXP-CHK-03` et `EXP-SESSION-01` restent Exploratoires. Leur existence ne constitue pas une file de tests à automatiser.

Les futurs scénarios suivants restent à décision différée : persistance inter-session, routes protégées supplémentaires, reprise du checkout, données de livraison inhabituelles, règle de commande vide, règle de taxe/arrondi et correspondance exhaustive produit/image. Leur mode sera décidé après clarification ou session exploratoire; aucun n’est automatiquement classé Candidat.

### Recommandations au Generator

- Exiger `Mode d’exécution` et `Justification du mode d’exécution` pour tout nouveau TC proposé.
- Ne pas générer de `.spec.ts` pour Manuel, Exploratoire ou Non retenu.
- Ne générer un candidat qu’après validation explicite de son passage à Automatisé.
- Préserver les 34 tests actuels et signaler les sept caractérisations lors d’un changement applicatif plutôt que d’adapter silencieusement les résultats attendus.
- Maintenir séparés les compteurs TC, Playwright, risques et charters dans le reporting.
- Réévaluer le niveau de test et les duplications avant d’ajouter un nouvel E2E.

## Partie 8 — Plan de renforcement piloté par les risques

### Règle de décision

Un risque résiduel est la partie d’un risque qui reste présente après les contrôles déjà en place. Un scénario supplémentaire n’est retenu que s’il vise un risque résiduel précis, apporte un signal différent des 34 TC et des 3 E2E, et possède une Référence attendue fiable. Une mission exploratoire non exécutée décrit une intention d’investigation : elle ne suffit pas à fixer un résultat attendu.

Chaque manque est classé dans une seule catégorie :

- **A — Nouveau TC justifié maintenant :** comportement attendu connu et contrôle distinct utile en régression, c’est-à-dire après une modification pour vérifier qu’un comportement connu fonctionne toujours.
- **B — Investigation exploratoire d’abord :** observation et jugement humain nécessaires avant de figer un résultat.
- **C — Bloqué par une décision produit :** règle métier manquante.
- **D — Déjà suffisamment couvert :** contrôle équivalent ou plus fort déjà présent.
- **E — Faible valeur actuellement :** scénario possible, mais gain trop faible ou essentiellement cosmétique.

### Analyse des cinq risques majeurs à renforcer

| Risque | Contrôle actuel | Manque réel | Référence attendue connue | Mission prévue | Catégorie et action |
|---|---|---|---|---|---|
| `RISK-CART-02` — persistance du panier | `TC-SESSION-01` contrôle le refresh d’Inventory dans la même session. | Logout/reconnexion, changement d’utilisateur et nouvelle session ne sont pas spécifiés. Le refresh de Cart et du checkout n’est pas couvert par `AC-SESSION-01`, limité à Inventory. | Non pour les frontières inter-session et inter-utilisateur. | `EXP-CART-01`, `EXP-SESSION-01` | **C** pour la persistance inter-session/inter-utilisateur : décision produit requise. **B** séparément pour le refresh hors Inventory : explorer avant de sélectionner une transition utile. |
| `RISK-CHK-02` — montants incorrects | `TC-CHK-02` vérifie les lignes, les prix, la somme, le sous-total et `total = sous-total + taxe affichée`; `E2E-01` répète ce mécanisme sur un article. | Taux de taxe, formule et arrondi non définis. Une variation de contenu supplémentaire répéterait le même mécanisme sans démontrer la taxe. | Oui pour l’addition; non pour la taxe métier. | `EXP-CHK-01` | **C** pour la taxe. **D** pour un simple autre sous-ensemble d’articles. Étudier le recalcul après modification du panier dans la mission avant de décider s’il révèle un signal distinct. |
| `RISK-CHK-03` — commande vide | `TC-PAN-04` et `TC-CHK-06` caractérisent une seule chaîne, de Cart à la confirmation. | Le projet ne dit pas si la commande vide doit être acceptée ou refusée. | Non. | `EXP-CHK-01`, `EXP-CHK-02` | **C** : décision produit avant tout TC normatif supplémentaire. Les actions Continue/Finish répétées restent **B** tant qu’un effet métier unique n’est pas observable et spécifié. |
| `RISK-SESSION-01` — perte de contexte actif | `TC-SESSION-01` contrôle la session et le panier après refresh d’Inventory. | Refresh de Cart/Checkout, Back/Forward, reprise et expiration ne sont pas définis. | Non au-delà du cas Inventory de `AC-SESSION-01`. | `EXP-CART-01`, `EXP-CHK-01`, `EXP-SESSION-01` | **B** : explorer les transitions réelles; demander une règle produit avant tout TC portant sur expiration ou reprise longue. |
| `RISK-SESSION-02` — session non terminée ou route exposée | `TC-SESSION-02` contrôle Logout; `TC-SESSION-03` et `E2E-03` refusent Cart après Logout; `TC-SESSION-05` refuse Cart depuis une session vierge. | Les autres routes ne possèdent pas de politique générale spécifiée. | Oui pour Cart : `AC-SESSION-03` vise une session déconnectée et définit le refus et son message. Non pour une généralisation à toutes les routes. | `EXP-AUTH-01`, `EXP-SESSION-01` | **D** pour Cart depuis une session vierge, désormais contrôlée. **C** séparément pour Inventory et les étapes du checkout : définir explicitement les routes protégées avant tout TC. |

### Décision appliquée — TC-SESSION-05

- **Catégorie :** A — Nouveau TC justifié maintenant.
- **Niveau de renforcement :** Niveau 1 — risque élevé insuffisamment contrôlé et comportement attendu connu.
- **Fonctionnalité :** Session.
- **User Story :** US-06.
- **Critère couvert :** AC-SESSION-03.
- **Risque(s) :** RISK-SESSION-02 et RISK-AUTH-02.
- **Objectif :** vérifier qu’une session vierge ne peut pas ouvrir directement la route Cart, sans dépendre d’un Logout exécuté auparavant.
- **Préconditions :** nouveau contexte navigateur, sans authentification préalable et sans état réutilisé.
- **Étapes principales :** 1. Ouvrir directement `/cart.html`. 2. Observer l’URL, l’écran de connexion et le message. 3. Vérifier qu’aucun contenu du panier ni écran authentifié n’est accessible.
- **Résultat attendu :** retour à la page de connexion et message `You can only access '/cart.html' when you are logged in`.
- **Référence attendue :** AC-SESSION-03, qui définit le refus de Cart pour une session déconnectée. Le candidat ne généralise pas ce résultat à Inventory ou aux routes de checkout.
- **Impact si échec :** une personne jamais authentifiée pourrait accéder au panier ou à un état utilisateur qui devrait rester inaccessible.
- **Technique de conception :** Transition d’état : l’accès demandé depuis l’état non authentifié doit être refusé et laisser le système dans cet état. Aucune autre technique formelle n’est ajoutée artificiellement.
- **Priorité proposée :** P1.
- **Justification de priorité :** contrôle négatif court d’un risque élevé, utile en régression mais non nécessaire dans la Smoke déjà centrée sur Logout et la route Cart après Logout.
- **Mode recommandé :** Candidat à l’automatisation.
- **Décision d’automatisation :** Oui maintenant après validation du Generator.
- **Justification de l’automatisation :** résultat déterministe, Référence attendue explicite, faible coût d’exécution et contrôle facilement observable par Playwright. Il apporte un état initial différent de `TC-SESSION-03` au lieu de rejouer sa transition Logout.

Le Generator a validé la proposition : TC-SESSION-05 est désormais un TC canonique, relié à la matrice et implémenté dans la spec Session.

### Scénarios à ne pas transformer maintenant en TC

| Scénario | Catégorie | Information manquante ou raison | Action recommandée |
|---|---|---|---|
| Logout puis reconnexion du même utilisateur avec panier rempli | C | Politique de persistance non définie. | Une exploration peut documenter SauceDemo, mais une décision produit est nécessaire avant un TC normatif. |
| Connexion d’un autre utilisateur après Logout | C | Isolation inter-utilisateur non décrite par un AC. | Une exploration peut rechercher une fuite, puis le produit doit définir l’isolation attendue. |
| Refresh de Cart, Step One ou Step Two | B | `AC-SESSION-01` ne couvre que Inventory. | Échantillonner dans `EXP-CART-01` et `EXP-CHK-01`; formaliser ensuite les transitions utiles. |
| Back/Forward, accès direct ou manipulation d’URL pendant le checkout | B | Politique de reprise et préconditions des étapes intermédiaires inconnues. | Exécuter `EXP-CHK-01`. |
| Routes Inventory et checkout depuis une session vierge ou après Logout | C | Seule Cart possède une règle et un message explicitement définis. | Inventorier les routes sensibles, puis obtenir une règle commune avant un éventuel test paramétré. |
| Double clic, Continue/Finish répété, Back/Forward ou Reset répété | B | Une action répétée ne devrait pas produire plusieurs effets involontaires, mais aucun identifiant de commande ni résultat métier unique ne permet actuellement de le prouver. | Exécuter `EXP-CART-01`, `EXP-CHK-02` ou `EXP-SESSION-01` selon l’action. |
| Interdire ou accepter une commande vide | C | Règle métier absente. | Arbitrage produit, puis nouvel AC ou mise à jour explicite avant un TC normatif. |
| Valider taux, formule et arrondi de taxe | C | Aucune formule officielle. | Obtenir la règle financière avant partitions ou Analyse des valeurs limites. |
| Recalcul avec un autre simple sous-ensemble d’articles | D | `TC-CHK-02` exerce déjà la somme de six lignes; `E2E-01` utilise un article. Une variation de données seule n’ajoute pas de mécanisme de détection. | Ne pas créer de TC; ne reconsidérer qu’en présence d’une transition de panier distincte confirmée. |
| Add → Remove → Add nominal | D | `TC-PAN-01`, `TC-PAN-02` et `TC-PAN-03` contrôlent déjà ajout, retrait, absence de réapparition et cohérence des représentations. | Aucun nouveau TC sans mode de défaillance différent. |
| Alignements, couleurs et espacements | E | Aucune exigence visuelle ni conséquence utilisateur prioritaire documentée. | Conserver hors priorité actuelle. |

### Décisions humaines nécessaires avant le Generator

| Question | Risque | Observation actuelle | Pourquoi décider | Action possible après décision |
|---|---|---|---|---|
| Le panier doit-il persister après Logout puis reconnexion du même utilisateur ? | RISK-CART-02, RISK-SESSION-01 | Non qualifiée; mission non exécutée. | Distinguer conservation dans la même session et persistance entre sessions. | AC de transition, puis TC ciblé; automatisation évaluée séparément. |
| Un autre utilisateur doit-il toujours recevoir un panier vierge ? | RISK-CART-02, RISK-SESSION-02 | Non qualifiée; aucune règle inter-utilisateur. | Définir l’isolation attendue sans transformer SauceDemo en règle produit. | AC d’isolation, puis TC de changement d’utilisateur si retenu. |
| Quelles routes sont protégées en plus de Cart, et dans quels états ? | RISK-SESSION-02 | Seule `/cart.html` est spécifiée et contrôlée. | Éviter de généraliser un résultat à toutes les routes. | Test négatif paramétré limité aux routes explicitement décidées. |
| Quel état doit survivre à Refresh, Back/Forward et reprise sur les étapes du checkout ? | RISK-SESSION-01, RISK-CHK-01, RISK-CHK-02 | À explorer dans `EXP-CHK-01`. | Fixer les préconditions et la reprise correcte avant une assertion stable. | TC de transition après compte rendu exploratoire et décision. |
| Une commande vide doit-elle être refusée ou acceptée ? | RISK-CHK-03 | SauceDemo la confirme actuellement. | Le comportement actuel n’est pas une règle métier. | AC explicite, puis adaptation ou création du contrôle normatif. |
| Quels sont le taux, la formule et l’arrondi officiels de la taxe ? | RISK-CHK-02 | 10,40 $ est seulement une baseline sur le scénario à six produits. | Permettre une vérification financière indépendante. | Partitions et valeurs limites uniquement lorsque les règles sont connues. |

### Impact prévisionnel du plan de renforcement

- **Nouveaux TC justifiés et intégrés : 1** — `TC-SESSION-05`.
- **Scénarios bloqués par décision produit : 5 familles** — reconnexion même utilisateur, changement d’utilisateur, routes supplémentaires, commande vide, taxe/arrondi.
- **Scénarios nécessitant une exploration préalable : 4 familles** — navigation checkout, actions répétées, refresh hors Inventory, cycle logout/reconnexion/Reset.
- **Propositions rejetées comme doublons ou faible valeur : 3 familles** — simple autre sous-ensemble financier, Add/Remove/Add nominal, cosmétique non spécifié.

## Synthèse chiffrée

| Indicateur | Valeur |
|---|---:|
| Fonctionnalités | 6 |
| User Stories | 6 |
| Critères d’acceptation | 32 |
| Cas de test | 34 |
| Cas passants | 15 |
| Cas non passants | 3 |
| Cas d’erreur | 16 |
| P0 / P1 / P2 | 8 / 20 / 6 |
| Smoke | 7 |
| Regression | 34 |
| Critères couverts | 32 / 32 |
| Taux de couverture des critères | 100 % |
