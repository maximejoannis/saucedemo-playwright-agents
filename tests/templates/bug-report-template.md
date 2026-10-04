# Modèle de rapport d’anomalie

## Objectif

Ce modèle aide à documenter une observation inhabituelle sans la déclarer automatiquement comme un bug. Il est destiné à une anomalie réellement observée et suffisamment documentée, pas à un exemple fictif ni à une statistique.

Dans ce portfolio SauceDemo, aucune anomalie produit n’est actuellement confirmée. Les huit missions exploratoires sont prévues mais aucune n’a encore été exécutée. Un modèle vide ne constitue donc pas un rapport d’anomalie et ne doit pas être compté par le reporting.

## Règles d’utilisation

Utiliser la chaîne suivante :

`Observation → Reproduction → Référence attendue → Impact → Qualification`

- **Observation :** décrire ce qui a été vu, sans supposer sa cause.
- **Reproduction :** répéter les mêmes actions et indiquer la reproductibilité. La reproductibilité est la capacité à provoquer de nouveau le même problème avec les mêmes conditions.
- **Référence attendue :** information fiable utilisée par le QA pour déterminer si le comportement observé est correct ou incorrect. Elle peut être un critère d’acceptation, une règle métier connue, un comportement explicitement documenté ou un calcul démontrable.
- **Impact :** conséquence concrète pour l’utilisateur ou le métier. Il ne s’agit pas encore d’une sévérité.
- **Qualification :** décider si l’observation est une anomalie confirmée, un comportement à clarifier, un problème non reproduit ou un élément à clore.

Un test échoué ne signifie pas automatiquement qu’un bug produit existe. Il peut s’agir d’un incident de test, d’environnement, d’une règle inconnue ou d’un comportement à clarifier.

Les liens vers une User Story, un critère d’acceptation, un Test Case, un risque ou une mission exploratoire sont renseignés seulement lorsqu’ils existent réellement. Les champs non applicables peuvent rester vides.

## Modèle à copier

> Les valeurs entre chevrons sont des placeholders à remplacer. Ce bloc ne décrit aucun incident réel.

```markdown
# <BUG-ID> — <Titre court et descriptif>

## Identification

- Identifiant : `<BUG-ID>`
- Titre : `<Décrire le problème sans supposer sa cause>`
- Date d’observation : `<AAAA-MM-JJ>`
- Testeur : `<Nom ou identifiant>`
- Statut : `À analyser`

## Contexte

- Environnement : `<local, CI, autre>`
- URL : `<URL réellement utilisée, si pertinente>`
- Navigateur : `<navigateur>`
- Version du navigateur : `<version, si disponible>`
- Version ou commit testé : `<version, commit ou build, si disponible>`
- Données utilisées : `<données réellement utilisées>`
- Compte utilisé : `<compte réellement utilisé, sans secret>`
- Préconditions :
  - `<état nécessaire avant les actions>`

## Traçabilité QA

- User Story : `<US-* ou Non applicable>`
- Critère d’acceptation : `<AC-* ou Non applicable>`
- Test Case : `<TC-* ou Non applicable>`
- Risque associé : `<RISK-* ou Non applicable>`
- Mission exploratoire d’origine : `<EXP-* ou Non applicable>`

## Étapes pour reproduire

1. `<Action précise>`
2. `<Action précise>`
3. `<Action précise>`

- Reproductibilité : `<Systématique / Fréquente / Intermittente / Observée une seule fois / Non reproduite>`
- Nombre d’essais utiles : `<nombre, si connu>`
- Conditions particulières : `<conditions réellement observées>`

## Référence attendue

La Référence attendue est l’information fiable utilisée par le QA pour déterminer si le comportement observé est correct ou incorrect.

- Source : `<AC, règle métier, comportement documenté, calcul démontrable ou autre source identifiable>`
- Référence attendue : `<Ce qui devrait se produire>`
- Niveau de confiance ou limite : `<Référence spécifiée, dérivée, baseline observée ou comportement à clarifier>`

Une observation historique seule ne devient pas automatiquement une règle métier. Si aucune Référence attendue fiable n’est disponible, utiliser le statut `Comportement à clarifier` plutôt que déclarer une anomalie confirmée.

## Résultat observé

Décrire uniquement ce qui a réellement été constaté :

`<Résultat observé, message exact, état de l’écran ou autre fait vérifiable>`

Ne pas affirmer une cause technique qui n’a pas été démontrée.

## Impact

- Impact utilisateur : `<Blocage, information trompeuse, perte de données, gêne ou Aucun impact démontré>`
- Impact métier : `<Commande impossible, montant potentiellement incorrect, risque de données ou Aucun impact métier démontré>`
- Étendue connue : `<Utilisateur, compte, parcours ou environnement concernés>`
- Contournement connu : `<Contournement réellement observé ou Aucun>`

## Sévérité proposée

- Sévérité proposée : `<S1 — Critique / S2 — Majeure / S3 — Modérée / S4 — Mineure / À déterminer>`
- Justification : `<Conséquence réelle, étendue, fréquence, contournement et limites connues>`

La sévérité proposée concerne une anomalie produit confirmée. Elle n’est pas déduite automatiquement de la priorité P0/P1/P2, du score d’un risque, du type de test ou d’un montant financier supposé.

## Preuves

- Capture d’écran : `<chemin ou Non disponible>`
- Vidéo : `<chemin ou Non disponible>`
- Trace Playwright : `<chemin ou Non disponible>`
- Console ou logs accessibles : `<chemin ou Non disponible>`
- Résultat de test : `<commande et résultat, si pertinent>`
- Autres éléments : `<URL, données, comparaison ou Non disponible>`

## Investigation

- Hypothèse ou zone suspecte : `<Piste à examiner, sans l’affirmer comme cause>`
- Vérifications réalisées : `<Vérifications réellement effectuées>`
- Vérifications restantes : `<Investigation à poursuivre>`

Une hypothèse n’est pas une cause confirmée. Éviter d’affirmer un défaut JavaScript, une erreur de base de données, une race condition ou une autre cause interne sans preuve accessible.

## Qualification et décision

- Statut : `<À analyser / Anomalie confirmée / Comportement à clarifier / Non reproduit / Clos / non retenu>`
- Décision : `<Action décidée>`
- Décideur ou validation nécessaire : `<Personne, équipe ou Produit, si applicable>`
- Commentaire : `<Raison de la décision et prochaine étape>`
```

## Quand ne pas créer un bug

Ne pas créer un rapport d’anomalie confirmée dans les situations suivantes, sauf si une Référence attendue fiable est ensuite établie :

- **Aucune Référence attendue :** une différence avec le comportement imaginé ou préféré ne suffit pas. La classer comme `Comportement à clarifier`.
- **Commande vide :** constater que SauceDemo l’accepte ou la refuse ne permet pas de décider quelle règle métier devrait s’appliquer.
- **Taxe :** une valeur observée ne permet pas de confirmer le taux, la formule ou l’arrondi. Il faut une règle officielle ou un calcul de référence.
- **`problem_user` ou `error_user` :** un comportement particulier d’un compte d’entraînement ne devient pas automatiquement un défaut du parcours nominal.
- **Mission exploratoire non reproduite :** une observation issue d’une mission doit être répétée et comparée à une Référence attendue avant toute qualification.
- **Échec de test seul :** vérifier d’abord l’environnement, les données, le navigateur, les preuves et la reproductibilité.

La chaîne recommandée pour une mission exploratoire est :

`Mission exploratoire → Observation → Reproduction → Recherche de la Référence attendue → Analyse de l’impact → Qualification → éventuellement rapport d’anomalie`

Les 8 missions exploratoires prévues ne représentent donc ni 8 bugs potentiels ni 8 rapports à créer. Ce modèle ne crée aucune anomalie et n’alimente aucune métrique de défaut tant qu’un rapport réel n’existe pas.
