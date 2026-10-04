# Missions de test exploratoire — SauceDemo

## Objectif

Ce référentiel décrit des **missions de test exploratoire (charters)** ciblées sur les incertitudes que les Test Cases scriptés ne lèvent pas encore : séquences inhabituelles, états intermédiaires, interruptions du navigateur, entrées non nominales et règles produit absentes. Il complète la chaîne Besoin → US → AC → Risque → TC → Playwright sans recopier les contrôles automatisés et sans présumer qu’une observation constitue un défaut.

Le [catalogue des risques](../requirements/risk-register.md) reste la source de référence des `RISK-*`. Un charter peut éclairer un risque existant ou révéler un sujet à analyser; il ne crée ni risque, ni exigence, ni Test Case par sa seule existence.

## Principes

- Explorer l’inconnu et les hypothèses non vérifiées, plutôt que rejouer les TC existants.
- Orienter les sessions par le besoin utilisateur et le risque métier, sans déduire leur importance de la facilité d’automatisation.
- Varier l’ordre, le rythme, les données et les points d’interruption; comparer les états visibles avant et après chaque variation.
- Distinguer comportement attendu, comportement connu, comportement non spécifié, anomalie probable et défaut confirmé.
- Ne pas considérer `problem_user` ou `error_user` comme une spécification métier; ils peuvent seulement aider à caractériser un mode de défaillance.
- Ne pas automatiser prématurément une observation instable, non spécifiée ou nécessitant un jugement humain.
- Capturer pendant la session le contexte, les données, la séquence minimale, les captures utiles et la reproductibilité, sans transformer le charter en procédure rigide.

## Statuts

| Statut                       | Signification                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| À explorer                   | Session identifiée, aucune investigation structurée encore réalisée.                               |
| En cours                     | Session ouverte et observations en cours de collecte.                                              |
| Exploré                      | Timebox terminée; notes et conclusion enregistrées, même sans anomalie.                            |
| Investigation complémentaire | Une observation mérite une nouvelle session ou des informations produit/techniques.                |
| Candidat TC                  | Un comportement stable et spécifié mérite une formalisation, après décision QA.                    |
| Candidat bug                 | Une observation reproductible contredit une référence établie; la qualification reste à confirmer. |

Un charter peut évoluer entre ces statuts. `Candidat bug` n’est ni un défaut confirmé ni une sévérité. La sévérité S1 à S4 ne s’attribue qu’après constat, analyse d’impact réel et qualification du défaut.

## Priorité, time-box et valeur de couverture

La **priorité exploratoire** organise les sessions lorsque le temps humain est limité; elle ne réutilise pas P0/P1/P2, réservés aux Test Cases. `Haute` cible d’abord un risque critique/élevé encore peu contrôlé ou une incertitude susceptible de bloquer un parcours essentiel; `Moyenne` vise un apprentissage utile sans urgence équivalente; `Basse` complète une zone déjà bien contrôlée ou de moindre impact.

Le **time-box** borne l’investissement et préserve l’adaptation du testeur. Il n’impose ni un nombre d’actions ni une couverture exhaustive. À son terme, la session est conclue ou une investigation complémentaire est décidée sur la base des notes.

Une mission `À explorer` représente une **intention de test**, jamais une couverture réellement vérifiée. Même prioritaire, elle reste hors des 34 TC, de la Smoke, de la Regression, du taux d’automatisation et du décompte des contrôles réellement différents tant qu’aucune session et aucun résultat ne sont consignés.

## Charters

### EXP-AUTH-01 — Frontières d’accès et historique après changement d’état

- **Domaine :** Authentification / Session
- **Objectif :** Explorer les frontières d’autorisation lorsque l’utilisateur contourne l’entrée normale, utilise l’historique ou alterne des états connecté/déconnecté.
- **Zone d’incertitude :** portée réelle de la protection des routes, comportement de l’historique et synchronisation de l’autorisation entre onglets après logout.
- **Risque(s) lié(s) :** RISK-AUTH-02, RISK-SESSION-02
- **Préconditions :** disposer d’une session vierge et d’une session authentifiée; connaître plusieurs URL internes déjà observées.
- **Données / états utiles :** `standard_user`, identifiants invalides, onglets multiples, URL Inventory, Cart, fiches produit et étapes Checkout.
- **Pistes d’exploration :** explorer les routes internes depuis une session jamais authentifiée; se déconnecter depuis différents écrans puis utiliser Précédent/Suivant, rafraîchir ou rouvrir une URL mémorisée; combiner plusieurs onglets avant et après logout; comparer les données visibles et les actions encore possibles.
- **Observations recherchées :** contenu protégé brièvement ou durablement visible, action acceptée après logout, état d’un autre contexte réutilisé, messages incohérents selon la route, différence entre affichage en cache et autorisation réelle.
- **Impact potentiel :** accès non autorisé, exposition du panier ou poursuite d’une action avec une session terminée.
- **Référence attendue :** AC-AUTH-02, AC-AUTH-05, AC-SESSION-02 et AC-SESSION-03 pour les situations spécifiées; ailleurs, comportement à comparer avec les règles métier, les AC existants et la cohérence générale du produit.
- **Pourquoi explorer humainement :** l’espace des routes, historiques et combinaisons multi-onglets n’est pas encore inventorié; l’exploration permet d’identifier les transitions significatives avant de paramétrer un contrôle stable.
- **Limites / hors périmètre :** pas de contournement offensif, interception réseau, vol de cookie ou test de pénétration.
- **Question QA :** une frontière d’autorisation devient-elle franchissable ou ambiguë lorsque l’état de session change hors du parcours nominal ?
- **Priorité exploratoire :** Haute — complète les risques élevés d’accès indu et de session terminée, actuellement partiellement exercés sur les routes et contextes.
- **Time-box :** 45 minutes.
- **Critères d’arrêt :** time-box atteinte; routes et variations d’historique prioritaires échantillonnées; observation à impact fort rendue reproductible; ou blocage empêchant toute poursuite.
- **Décision d’automatisation :** Rester exploratoire. Formaliser ensuite un TC seulement pour une transition reproductible, régie par une référence attendue validée; l’automatisation ferait l’objet d’une décision séparée.
- **Statut :** À explorer

### EXP-CAT-01 — Identité produit, images et navigation par URL

- **Domaine :** Catalogue
- **Objectif :** Examiner la cohérence d’identité d’un produit face aux identifiants et paramètres inhabituels, et déterminer si une image visible représente réellement le bon produit.
- **Zone d’incertitude :** traitement des paramètres non spécifiés et absence de référence exhaustive reliant chaque image nominale au bon produit.
- **Risque(s) lié(s) :** RISK-CAT-01, RISK-CAT-02
- **Préconditions :** session standard authentifiée; catalogue nominal accessible.
- **Données / états utiles :** identifiants connus, absent, négatif, vide, dupliqué ou non numérique; paramètres supplémentaires; noms, prix, descriptions et sources d’image observés dans la liste.
- **Pistes d’exploration :** varier les identifiants et paramètres de `inventory-item.html`; utiliser l’historique entre plusieurs fiches; ouvrir ou modifier des URL dans plusieurs onglets; comparer nom, prix, description, image et bouton d’action entre liste, fiche et panier; observer les URL inconnues ou incomplètes.
- **Observations recherchées :** mélange d’attributs entre produits, mauvaise image pourtant visible, produit précédent conservé après URL invalide, action panier appliquée à un autre article, erreur incohérente ou récupération ambiguë.
- **Impact potentiel :** mauvaise décision d’achat ou ajout d’un article différent de celui présenté.
- **Référence attendue :** AC-CAT-01 à AC-CAT-03 lorsque leur périmètre s’applique; pour les paramètres non définis, comportement à comparer avec les règles métier, les AC existants et la cohérence générale du produit.
- **Pourquoi explorer humainement :** l’exactitude sémantique des images et les partitions d’URL ne sont pas entièrement spécifiées; un jugement comparatif apporte plus de valeur qu’une liste arbitraire de paramètres automatisés.
- **Limites / hors périmètre :** qualité artistique des visuels, responsive exhaustif et disponibilité du CDN hors application.
- **Question QA :** une navigation ou un identifiant inhabituel peut-il désynchroniser l’identité fonctionnelle du produit, notamment sans image manifestement cassée ?
- **Priorité exploratoire :** Moyenne — le risque visuel est faible, mais l’absence de référence sémantique fiable justifie une investigation humaine ciblée.
- **Time-box :** 45 minutes.
- **Critères d’arrêt :** time-box atteinte; familles d’identifiants et comparaisons liste/fiche/panier échantillonnées; incohérence reproductible isolée; ou absence de référence empêchant une qualification plus poussée.
- **Décision d’automatisation :** Rester exploratoire et manuel tant qu’aucune référence produit/image stable n’existe. Une observation ne devient candidate à un TC qu’après validation de cette référence.
- **Statut :** À explorer

### EXP-SORT-01 — Tri répété au sein d’un catalogue en mouvement

- **Domaine :** Tri
- **Objectif :** Explorer la stabilité du tri lorsqu’il est répété, interrompu par la navigation ou combiné à des modifications du panier.
- **Zone d’incertitude :** stabilité de l’ordre et cohérence des cartes lors de changements rapides ou après restauration de navigation.
- **Risque(s) lié(s) :** RISK-SORT-01
- **Préconditions :** catalogue nominal chargé; possibilité d’ouvrir une fiche et de revenir.
- **Données / états utiles :** quatre ordres, changement rapide de sélection, produits ajoutés ou retirés, historique et refresh.
- **Pistes d’exploration :** alterner rapidement les ordres; répéter le même choix; naviguer vers une fiche puis revenir; ajouter ou retirer pendant plusieurs changements; rafraîchir et utiliser l’historique; comparer ordre visible, option affichée, identité des cartes et actions associées.
- **Observations recherchées :** ordre partiellement mis à jour, option et liste désynchronisées, carte associée au mauvais prix ou bouton, état instable après retour ou refresh.
- **Impact potentiel :** recherche dégradée ou sélection du mauvais produit, généralement sans blocage du parcours principal.
- **Référence attendue :** AC-SORT-01 à AC-SORT-04 pour l’ordre demandé; la persistance du choix après navigation n’est pas spécifiée et doit être évaluée par cohérence.
- **Pourquoi explorer humainement :** la valeur réside dans les enchaînements et les désynchronisations visuelles transitoires, pas dans la répétition des quatre références de tri déjà automatisées.
- **Limites / hors périmètre :** performance sur catalogue volumineux et règles de collation internationale absentes des données SauceDemo.
- **Question QA :** les représentations du catalogue restent-elles synchronisées lorsque le tri est répété ou interrompu par d’autres actions ?
- **Priorité exploratoire :** Basse — le tri nominal est déjà automatisé et le risque produit est faible; la valeur recherchée concerne uniquement des désynchronisations non nominales.
- **Time-box :** 30 minutes.
- **Critères d’arrêt :** time-box atteinte; répétition, navigation et refresh échantillonnés; désynchronisation reproductible isolée; ou absence de nouvel apprentissage après plusieurs variations.
- **Décision d’automatisation :** Rester exploratoire. Ne promouvoir qu’une séquence minimale reproductible apportant un signal distinct des quatre tris nominaux existants.
- **Statut :** À explorer

### EXP-CART-01 — Robustesse du panier sous transitions rapides et navigation inhabituelle

- **Domaine :** Panier
- **Objectif :** Explorer l’intégrité du panier lorsque les ajouts/retraits sont répétés ou que l’utilisateur change fréquemment de page et de point d’action.
- **Zone d’incertitude :** atomicité apparente des actions, synchronisation des représentations du panier et persistance après interruptions inhabituelles.
- **Risque(s) lié(s) :** RISK-CART-01, RISK-CART-02, RISK-SESSION-01
- **Préconditions :** session standard authentifiée; plusieurs produits disponibles.
- **Données / états utiles :** panier vide, un article, plusieurs articles; actions depuis Inventory, fiche et Cart; refresh, historique et onglets.
- **Pistes d’exploration :** répéter rapidement Add/Remove; alterner les actions entre liste, fiche et panier; interrompre une série par refresh, Précédent/Suivant ou ouverture d’un onglet; retirer partiellement puis reprendre la navigation; comparer après chaque transition badge, lignes, quantités, boutons et récapitulatif Checkout.
- **Observations recherchées :** duplication, disparition ou réapparition d’article, badge divergent, bouton dans un état opposé, ordre d’actions perdu, incohérence entre onglets ou entre panier et checkout.
- **Impact potentiel :** commande différente de l’intention, perte de sélection ou montant associé à un contenu erroné.
- **Référence attendue :** AC-CART-01 à AC-CART-03 et AC-SESSION-01 pour les états spécifiés; les comportements multi-onglets et actions concurrentes sont non spécifiés.
- **Pourquoi explorer humainement :** les rythmes, interruptions et combinaisons d’état utiles doivent être découverts avant de retenir une petite suite de transitions déterministes.
- **Limites / hors périmètre :** charge, concurrence distribuée et modification réelle par plusieurs utilisateurs.
- **Question QA :** une séquence rapide, interrompue ou exécutée depuis plusieurs points peut-elle produire des représentations contradictoires du panier ?
- **Priorité exploratoire :** Haute — cible `RISK-CART-02` et `RISK-SESSION-01`, risques élevés avec un seul contrôle réellement différent, ainsi que des modes d’intégrité non couverts par les transitions scriptées.
- **Time-box :** 45 minutes.
- **Critères d’arrêt :** time-box atteinte; au moins les axes répétition, changement de page et interruption échantillonnés; divergence reproductible réduite à une séquence utile; ou environnement devenu incohérent sans moyen fiable de reprise.
- **Décision d’automatisation :** Rester exploratoire. Une transition découverte pourra devenir un TC après clarification de la persistance attendue; son automatisation dépendra ensuite de sa stabilité et de sa valeur de régression.
- **Statut :** À explorer

### EXP-CHK-01 — Navigation et reprise aux étapes intermédiaires du checkout

- **Domaine :** Checkout
- **Objectif :** Comprendre quels états de commande persistent lorsque l’utilisateur quitte, rafraîchit, contourne ou reprend une étape du checkout.
- **Zone d’incertitude :** préconditions réelles des étapes, politique de reprise, synchronisation panier/récapitulatif et règles de taxe ou d’arrondi non spécifiées.
- **Risque(s) lié(s) :** RISK-CART-01, RISK-CHK-01, RISK-CHK-02, RISK-CHK-03, RISK-SESSION-01
- **Préconditions :** session standard avec panier vide, un article ou plusieurs articles.
- **Données / états utiles :** `checkout-step-one.html`, `checkout-step-two.html`, Cart, catalogue, historique, URL directes, formulaires partiellement remplis et différents sous-ensembles d’articles disponibles.
- **Pistes d’exploration :** rafraîchir chaque étape; utiliser Précédent/Suivant; retourner au catalogue puis reprendre; alterner Cart et Checkout; demander directement l’étape deux sans parcours préalable; modifier le panier avant reprise; interrompre après saisie partielle ou après affichage du récapitulatif; comparer les calculs pour plusieurs sous-ensembles et ordres d’ajout sans supposer une règle de taxe absente des exigences.
- **Observations recherchées :** accès à une étape incohérente, données personnelles ou panier perdus/résiduels, récapitulatif obsolète, total différent du panier courant, confirmation sans contexte valide, boucle ou blocage sans récupération.
- **Impact potentiel :** commande impossible, contenu ou montant incorrect, statut de commande ambigu ou exposition d’informations saisies.
- **Référence attendue :** AC-CHK-01, AC-CHK-02 et AC-CHK-06 lorsque leur état initial est respecté; pour l’accès direct et la reprise, comportement à comparer avec les règles métier, les AC existants et la cohérence générale du produit.
- **Pourquoi explorer humainement :** la politique de reprise et les préconditions des URL intermédiaires ne sont pas définies; l’objectif initial est d’apprendre les états réels, non d’imposer une référence attendue inventée.
- **Limites / hors périmètre :** paiement réel, livraison, persistance serveur de commande et système aval inexistants dans SauceDemo.
- **Question QA :** quels états incohérents ou obsolètes deviennent possibles lorsque l’ordre normal des étapes du checkout est interrompu ou contourné ?
- **Priorité exploratoire :** Haute — investigue des incertitudes sur la finalisation, les montants, la commande vide et la conservation de session, dont plusieurs risques élevés restent partiels.
- **Time-box :** 60 minutes.
- **Critères d’arrêt :** time-box atteinte; refresh, historique, accès direct et reprise après modification du panier échantillonnés; état incohérent reproductible isolé; ou règle attendue manquante consignée comme question produit.
- **Décision d’automatisation :** Rester exploratoire. Aucun calcul de taxe ou résultat de commande vide ne sera automatisé comme règle métier avant arbitrage; seule une transition stable et spécifiée pourra être promue.
- **Statut :** À explorer

### EXP-CHK-02 — Répétition de Continue et Finish

- **Domaine :** Checkout
- **Objectif :** Explorer l’idempotence apparente et les effets visibles d’actions répétées au moment de continuer ou finaliser.
- **Zone d’incertitude :** absence d’identifiant de commande et impossibilité actuelle de distinguer une répétition d’affichage d’une répétition métier réelle.
- **Risque(s) lié(s) :** RISK-CHK-01, RISK-CHK-03
- **Préconditions :** checkout valide avec article, checkout vide et formulaires valides ou invalides.
- **Données / états utiles :** clics rapprochés ou espacés, clavier et souris, retour historique après confirmation, réseau lent uniquement s’il peut être observé sans instrumentation intrusive.
- **Pistes d’exploration :** répéter Continue ou Finish; combiner double clic, touche Entrée et navigation arrière; revenir après confirmation puis tenter de reprendre; comparer URL, message, panier et possibilité de nouvelle action.
- **Observations recherchées :** confirmations multiples, transition double, état bloqué, messages contradictoires, commande vide répétée, panier non vidé ou action encore disponible après succès.
- **Impact potentiel :** duplication ou ambiguïté de commande, données parasites et perte de confiance.
- **Référence attendue :** AC-CHK-01 garantit une confirmation nominale unique observée mais ne spécifie pas l’idempotence; le reste doit être comparé avec la cohérence générale et soumis à décision métier.
- **Pourquoi explorer humainement :** le produit ne fournit ni identifiant de commande ni système aval permettant d’affirmer une duplication réelle; l’exploration doit d’abord distinguer répétition d’affichage, répétition d’action et défaut métier potentiel.
- **Limites / hors périmètre :** aucune affirmation sur une transaction serveur ou une facturation non observable.
- **Question QA :** la répétition d’une action de progression ou de finalisation laisse-t-elle un état visible unique, récupérable et cohérent ?
- **Priorité exploratoire :** Haute — examine un mode de défaillance distinct autour de la finalisation critique et de la commande vide sans prétendre observer une transaction aval.
- **Time-box :** 30 minutes.
- **Critères d’arrêt :** time-box atteinte; répétitions par souris, clavier et historique échantillonnées; effet visible reproductible caractérisé; ou impossibilité d’observer plus qu’une répétition d’affichage consignée.
- **Décision d’automatisation :** Rester exploratoire. Une automatisation ne serait envisagée qu’après définition de l’idempotence attendue et identification d’un résultat observable fiable.
- **Statut :** À explorer

### EXP-CHK-03 — Variété et correction des données de livraison

- **Domaine :** Checkout / Données de formulaire
- **Objectif :** Caractériser l’acceptation, la conservation et la correction des valeurs inhabituelles sans présumer qu’elles doivent être refusées.
- **Zone d’incertitude :** formats, longueurs, normalisation, persistance et règles de validité non définis pour les données de livraison.
- **Risque(s) lié(s) :** RISK-CHK-04
- **Préconditions :** étape d’informations accessible avec un panier contenant au moins un article.
- **Données / états utiles :** espaces seuls ou périphériques, Unicode, accents, apostrophes, tirets, caractères inhabituels, chaînes très longues, copier-coller et valeurs corrigées après erreur.
- **Pistes d’exploration :** varier une dimension à la fois puis les combiner; comparer frappe et collage; provoquer une erreur obligatoire puis corriger; revenir depuis l’étape deux; rafraîchir avant ou après validation; observer transformations, troncatures et persistance.
- **Observations recherchées :** acceptation incohérente, espace considéré comme donnée significative, perte ou altération silencieuse, champ impossible à corriger, erreur persistante après correction, données d’un essai précédent réutilisées.
- **Impact potentiel :** livraison impossible, abandon du checkout ou données personnelles incorrectes.
- **Référence attendue :** AC-CHK-03 à AC-CHK-05 pour l’absence de valeur; formats, longueurs et validité postale sont non spécifiés et doivent être observés sans règle de rejet inventée.
- **Pourquoi explorer humainement :** les partitions acceptables et les règles de normalisation ne sont pas définies; une session humaine peut produire un inventaire factuel avant toute décision produit ou automatisation.
- **Limites / hors périmètre :** validation auprès d’un service postal, règles internationales exhaustives et sécurité offensive des entrées.
- **Question QA :** quelles transformations, pertes ou incohérences apparaissent avec des données inhabituelles ou corrigées, sans présumer de leur validité métier ?
- **Priorité exploratoire :** Moyenne — `RISK-CHK-04` est moyen et partiel; la session vise d’abord à produire des faits utiles à une décision produit.
- **Time-box :** 45 minutes.
- **Critères d’arrêt :** time-box atteinte; principales familles de données et correction après erreur échantillonnées; comportement reproductible documenté; ou absence de règle empêchant toute qualification au-delà de l’observation.
- **Décision d’automatisation :** Rester exploratoire. Les observations ne deviennent partitions, TC ou automatisations qu’après définition des formats acceptables et d’un résultat attendu stable.
- **Statut :** À explorer

### EXP-SESSION-01 — Cycle de vie, reconnexion et Reset App State

- **Domaine :** Session
- **Objectif :** Explorer ce qui persiste ou disparaît lors du logout, de la reconnexion, du refresh et du Reset depuis différents écrans.
- **Zone d’incertitude :** portée temporelle et inter-utilisateur de l’état, comportement du Reset hors Inventory et cohérence entre onglets.
- **Risque(s) lié(s) :** RISK-CART-02, RISK-SESSION-01, RISK-SESSION-02, RISK-SESSION-03
- **Préconditions :** session standard avec panier rempli; accès à Inventory, fiche, Cart et Checkout; possibilité de se reconnecter avec le même compte puis un autre compte disponible.
- **Données / états utiles :** un ou plusieurs articles, formulaire partiellement rempli, étape deux ouverte, onglets multiples, même utilisateur et utilisateur différent.
- **Pistes d’exploration :** se déconnecter avec un panier rempli puis se reconnecter; utiliser l’historique et rafraîchir après logout; réinitialiser depuis plusieurs écrans, pendant le checkout et avec plusieurs articles; comparer même compte, compte différent et nouvel onglet; reprendre une URL ouverte avant Reset ou logout.
- **Observations recherchées :** panier transmis à un autre utilisateur, état réapparu après Reset, session utilisable après logout, données de formulaire persistantes, reset partiel selon l’écran, perte inattendue de session ou divergence entre onglets.
- **Impact potentiel :** exposition d’état utilisateur, perte de sélection, action non autorisée ou interruption du parcours.
- **Référence attendue :** AC-SESSION-01 à AC-SESSION-04 dans leurs contextes définis; persistance inter-session/inter-utilisateur et Reset pendant checkout sont à comparer avec les règles métier, les AC existants et la cohérence générale du produit.
- **Pourquoi explorer humainement :** la politique de durée et de portée de session n’est pas spécifiée; explorer plusieurs points du cycle évite d’automatiser une règle supposée.
- **Limites / hors périmètre :** expiration longue nécessitant une infrastructure de temps contrôlée, concurrence réelle et manipulation technique des cookies.
- **Question QA :** quel état utilisateur ou panier traverse à tort ou disparaît à tort lors des frontières logout, reconnexion, changement d’utilisateur et Reset ?
- **Priorité exploratoire :** Haute — cible directement trois risques élevés partiels, dont `RISK-CART-02` et `RISK-SESSION-01` avec un seul contrôle réellement différent.
- **Time-box :** 60 minutes.
- **Critères d’arrêt :** time-box atteinte; logout/reconnexion, changement d’utilisateur, Reset multi-écrans et reprise d’URL échantillonnés; fuite ou perte reproductible isolée; ou politique produit manquante enregistrée pour arbitrage.
- **Décision d’automatisation :** Rester exploratoire. Aucun comportement de persistance ou d’expiration ne sera figé en TC avant clarification; l’automatisation restera une décision distincte après formalisation.
- **Statut :** À explorer

## Questions transverses

Pendant chaque session, poser explicitement les questions suivantes :

- Qu’est-ce que nous n’avons pas testé ?
- Quelle hypothèse faisons-nous sans l’avoir vérifiée ?
- Que se passe-t-il si l’utilisateur change l’ordre normal des actions ?
- Que se passe-t-il si une action est répétée ?
- Que se passe-t-il si le navigateur interrompt le parcours ?
- Quel état persiste alors qu’il ne devrait peut-être pas ?
- Quel état disparaît alors qu’il devrait peut-être persister ?
- Les différents indicateurs visibles racontent-ils le même état : URL, badge, lignes, boutons, total et message ?
- Une observation dépend-elle du compte, de l’écran, de l’onglet ou de l’ordre précis des actions ?
- Quel serait l’impact en production ?

## Qualification des observations

| Qualification             | Critère de décision                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Comportement attendu      | Conforme à un AC, une règle métier ou une décision produit explicite.                                         |
| Comportement connu        | Déjà documenté, notamment pour un compte spécial, sans constituer automatiquement l’attendu nominal.          |
| Comportement non spécifié | Aucune référence ne permet encore de conclure; clarification ou observation complémentaire requise.           |
| Anomalie probable         | Incohérence reproductible avec le parcours, l’état ou un besoin, mais qualification métier encore nécessaire. |
| Défaut confirmé           | Contradiction reproductible avec une référence établie et validée; un bug report peut alors être créé.        |

## Trace d’une session exploratoire

Conserver les résultats dans une note de session datée, séparée du charter, avec au minimum :

- ID du charter, date, testeur et environnement/version;
- priorité prévue, time-box prévue et durée réelle;
- état initial, comptes et données réellement utilisés;
- variations et enchaînements effectivement essayés;
- observations factuelles, avec séquence minimale et éléments de preuve utiles;
- qualification provisoire : attendu, connu, non spécifié, anomalie probable ou défaut confirmé;
- anomalies ou bugs potentiels, sans sévérité automatique;
- questions produit/QA ouvertes et nouvelles idées d’exploration;
- limites rencontrées, couverture réellement atteinte et critères d’arrêt appliqués;
- risques réellement éclairés par les observations, ou `Aucun` si les résultats ne permettent pas encore d’apporter une information concrète sur un risque;
- décision de sortie : aucune action, investigation complémentaire, candidat TC, candidat bug ou clarification métier;
- statut du charter après la session.

L’absence d’anomalie est un résultat de session valide, mais ne prouve pas l’absence de risque. Aucun résultat, observation ou statut `Exploré` n’est prérempli avant exécution.

## Passage exploration → test formel

```text
Observation
    ↓
Analyse du contexte, de la reproductibilité et de l’impact
    ↓
Comparaison avec la référence attendue
    ↓
Qualification : attendu / connu / non spécifié / anomalie probable / défaut confirmé
    ↓
Décision QA et, si nécessaire, arbitrage produit
    ↓
Éventuellement nouveau RISK / AC / TC / Bug
    ↓
Éventuellement automatisation si le contrôle est stable, déterministe et utile en régression
```

- **Nouveau risque :** seulement si la découverte révèle un événement potentiel distinct, durable et doté d’une conséquence utilisateur ou métier explicite.
- **Nouvel AC :** si une règle attendue manquante est décidée et doit devenir vérifiable.
- **Nouveau TC :** si un comportement spécifié mérite un contrôle répétable; le TC ne découle pas automatiquement du charter.
- **Test automatisé :** si le scénario est déterministe, stable, important en régression et apporte un signal durable sans duplication.
- **Bug report :** si l’observation reproductible contredit une référence établie; la sévérité est évaluée sur l’impact réel, jamais déduite du risque ou de la priorité d’un TC.
- **Observation sans action :** si le comportement est cohérent, sans impact significatif, non reproductible ou explicitement accepté.

## Synthèse

| Indicateur                                                                        | Résultat                                                    |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Nombre de charters                                                                | 8                                                           |
| Sessions exécutées                                                                | 0                                                           |
| Priorité exploratoire Haute / Moyenne / Basse                                     | 5 / 2 / 1                                                   |
| Domaines explorés                                                                 | Authentification, Catalogue, Tri, Panier, Checkout, Session |
| Risques disposant d’une investigation prévue                                      | 13 / 14                                                     |
| Risque sans charter dédié                                                         | RISK-AUTH-01                                                |
| Missions prioritaires pour les risques avec un seul contrôle réellement différent | EXP-CART-01, EXP-CHK-01, EXP-CHK-02, EXP-SESSION-01         |

`RISK-AUTH-01` ne reçoit pas de charter dédié : la connexion nominale est déterministe, couverte par un Smoke ciblé et par le parcours E2E d’achat. Elle pourra être intégrée à une future session uniquement si une incertitude distincte apparaît; créer un charter pour répéter le TC nominal n’apporterait pas d’apprentissage.

Les principales zones d’incertitude sont la persistance entre sessions et utilisateurs, le cycle de vie après logout, la reprise des étapes du checkout, l’idempotence apparente de Finish, la cohérence du panier après interruptions, la validité des données de livraison et l’exactitude sémantique des images produit.

Recommandations pour les sessions : respecter les time-box de 30 à 60 minutes définis par charter; privilégier les cinq charters de priorité Haute, en commençant par `EXP-SESSION-01`, `EXP-CHK-01` et `EXP-CART-01` selon le risque à investiguer; travailler en binôme QA/Produit lorsque la règle attendue est absente; conserver des notes de session séparées du charter; ne promouvoir une découverte vers Risk, AC, TC ou Bug qu’après qualification.
