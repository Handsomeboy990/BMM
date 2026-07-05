# Bitcoin Blood, guide de la plateforme

Ce document décrit le parcours de chaque profil sur la plateforme, explique
comment l'authenticité d'un donneur est vérifiée, et se termine par un regard
critique sur les limites et les pistes d'amélioration.

---

## 1. Le parcours de chaque profil

La plateforme sépare strictement trois espaces. Chaque espace est protégé : un
utilisateur ne peut pas accéder à un espace qui n'est pas le sien.

- Le donneur accède à l'espace donneur (`/donneur`).
- La structure de santé accède à l'espace structures (`/dashboard`, `/alerts`,
  `/donors`, `/campaigns`, `/cards`, `/reseau`).
- Le super-administrateur accède au tableau de bord d'administration.

Si un donneur tente d'ouvrir une page structures, il est renvoyé vers son
espace, et inversement. À la connexion, si quelqu'un se trompe d'espace, un
message le prévient et un bouton le redirige au bon endroit.

### 1.1 Le donneur

1. **Inscription.** Le donneur remplit un formulaire simple : nom, ville,
   téléphone, et groupe sanguin s'il le connaît (sinon il peut laisser vide).
   Il choisit comment il veut être récompensé : Mobile Money (dépôt par SMS) ou
   Bitcoin. Il partage sa position pour n'être alerté qu'en cas de besoin
   proche, et il accepte le traitement de ses données.
2. **Réception de sa carte.** À l'inscription, une clé personnelle est générée
   sur son téléphone. Cette clé sert de mot de passe pour se reconnecter. Elle
   n'est jamais envoyée par email ni stockée sur nos serveurs : le donneur la
   télécharge et la garde.
3. **Son espace.** Le donneur retrouve sa carte de donneur (deux QR codes à
   faire scanner en centre de don), son solde de récompenses, l'historique de
   ses dons, son canal de récompense (modifiable), son QR code de groupe
   sanguin utilisable même sans internet, et son lien de parrainage.
4. **Le don.** Quand une alerte proche correspond à son groupe, il se rend au
   centre. Le personnel scanne sa carte pour confirmer son identité, puis
   valide le don.
5. **La récompense.** Après validation, le donneur reçoit sa récompense :
   dépôt Mobile Money, paiement Bitcoin, points de fidélité, ou crédit sur son
   solde qu'il pourra retirer lui-même vers son Mobile Money quand il le
   souhaite.
6. **La carte physique.** Le donneur peut obtenir une carte physique,
   gratuitement s'il a au moins trois activités à son actif (dons, parrainages,
   séances de sensibilisation), ou à l'achat.
7. **Le parrainage.** Il partage son lien. Chaque personne inscrite grâce à ce
   lien compte comme une activité à son crédit.

### 1.2 La structure de santé (hôpital, centre de collecte, ONG)

1. **Inscription et vérification.** La structure crée un compte et dépose ses
   justificatifs. Tant qu'elle n'est pas validée par un administrateur, elle
   voit un écran d'attente et n'accède pas au tableau de bord.
2. **Tableau de bord.** Une fois validée, elle pilote son activité : vue
   d'ensemble, alertes, annuaire des donneurs, recherche de donneurs
   compatibles, campagnes, récompenses, réseau et stock.
3. **Lancer une alerte.** En cas de besoin, elle déclare une urgence (groupe,
   quantité, lieu). L'alerte est diffusée aux donneurs compatibles proches par
   email et par un réseau public de secours, fiable même en cas de panne des
   opérateurs télécoms.
4. **Trouver des donneurs.** Le moteur de recherche classe les donneurs
   compatibles par pertinence : compatibilité du groupe, distance, et fidélité
   (donneurs réguliers prioritaires).
5. **Inscrire un donneur.** Depuis l'annuaire, la structure peut inscrire un
   donneur sur place, sans être déconnectée de son propre compte. Une clé à
   remettre au donneur est générée.
6. **Vérifier une carte.** Elle scanne le QR code du donneur (ou colle son
   identifiant) pour confirmer que la carte est authentique et lire le groupe
   sanguin, sans accéder aux informations privées. Cette vérification
   fonctionne aussi sans connexion internet.
7. **Récompenser.** Après un don validé, la structure verse la récompense selon
   le canal choisi. Une règle de sécurité empêche de récompenser deux fois le
   même donneur en moins de soixante jours.
8. **Fiche donneur.** Chaque donneur dispose d'une fiche dédiée (solde,
   activités, statut de carte, authenticité).

### 1.3 Le super-administrateur

1. **Validation des structures.** Il examine les justificatifs des structures
   qui demandent l'accès, puis les approuve ou les refuse avec un motif.
2. **Supervision.** Il a une vue d'ensemble du réseau (structures, donneurs,
   activité).
3. **Accès complet.** Contrairement aux autres profils, l'administrateur n'est
   pas bloqué s'il ouvre un autre espace : il peut naviguer librement.

---

## 2. Comment l'authenticité d'un donneur est vérifiée

L'objectif est double : permettre à un centre de confirmer qu'une carte de
donneur est vraie et n'a pas été modifiée, tout en gardant les informations
médicales privées.

### 2.1 Ce qui se passe à l'inscription

Au moment de l'inscription, le téléphone du donneur crée une paire de clés
personnelles. Il calcule ensuite une empreinte unique de son profil (une sorte
de photographie numérique de ses informations) et la signe avec sa clé. Si une
seule information du profil changeait plus tard, cette empreinte ne
correspondrait plus. Le serveur vérifie la signature avant d'enregistrer le
donneur : cela prouve que le profil a bien été créé par le détenteur de la clé.

### 2.2 L'enregistrement permanent

Après validation d'un don, l'empreinte du profil est enregistrée de façon
permanente sur Bitcoin. Concrètement, cela donne une preuve datée et
impossible à modifier après coup : personne, pas même un administrateur, ne
peut réécrire l'historique d'un donneur. C'est cette permanence qui rend la
carte digne de confiance dans le temps.

### 2.3 La vérification sur le terrain

Trois manières de vérifier une carte, de la plus simple à la plus autonome :

1. **Scan du QR public.** Le QR code de la carte renvoie vers une page de
   vérification qui affiche immédiatement si la carte est authentique et
   confirmée, ainsi que le groupe sanguin. Aucune donnée privée n'est exposée.
2. **Scan direct dans l'outil de vérification.** Depuis l'espace structures ou
   la page de vérification, le personnel ouvre la caméra et scanne le QR du
   donneur. L'outil remplit les champs et affiche aussitôt le résultat
   (authentique ou non).
3. **Saisie manuelle ou hors-ligne.** Sans caméra ou sans réseau, le personnel
   peut coller l'identifiant et le code de validation à la main. La
   vérification se fait alors entièrement sur l'appareil, sans internet, ce qui
   est précieux dans les zones à connexion instable.

Dans tous les cas, le résultat est clair sur l'écran : « carte authentique » ou
« vérification échouée ».

---

## 3. Regard d'expert : limites, failles et pistes d'amélioration

_Cette section prend le point de vue d'un responsable expérimenté du secteur de
la santé et de la biologie médicale, chargé d'évaluer la solidité réelle du
système et la voie vers une transformation digitale complète._

### 3.1 Les vraies limites aujourd'hui

- **Le groupe sanguin déclaré n'est pas une preuve médicale.** Un donneur peut
  saisir un groupe erroné ou le laisser vide. Tant qu'un test biologique
  officiel n'est pas rattaché au profil, l'information reste déclarative. La
  sécurité transfusionnelle exige toujours un contrôle en laboratoire avant
  toute transfusion.
- **L'identité de la personne n'est pas fortement vérifiée.** La signature
  garantit que c'est bien la même clé qui agit, mais pas que la personne est
  bien celle qu'elle prétend être. Rien ne relie encore le compte à une pièce
  d'identité officielle.
- **La chaîne de responsabilité côté structure.** Un compte structure validé
  peut récompenser et valider des dons. Une structure malveillante ou un accès
  volé pourrait générer de faux dons. La confiance repose beaucoup sur la
  validation initiale.
- **La dépendance à des services externes.** Le versement Mobile Money, l'envoi
  d'emails et le paiement de cartes reposent sur des partenaires. Une panne ou
  un changement de politique chez eux affecte directement le service.
- **La couverture réelle.** La plateforme suppose un smartphone et une adresse
  email. Une partie de la population cible (zones rurales, personnes âgées) en
  est de fait exclue tant qu'il n'y a pas de canal SMS ou USSD.
- **Le cadre légal des données de santé.** Le stockage et le traitement de
  données de santé imposent un cadre strict (consentement, hébergement agréé,
  droit à l'effacement). Le consentement est demandé, mais la conformité
  complète reste à construire avec les autorités compétentes.

### 3.2 Les failles à corriger en priorité

- **Rattacher un résultat de laboratoire au profil.** Le groupe sanguin devrait
  devenir « confirmé » uniquement après un test réalisé et signé par un centre
  agréé, et non par simple déclaration.
- **Renforcer l'authentification.** Ajouter une double vérification pour les
  comptes structures, une traçabilité des actions sensibles (qui a validé quel
  don, quand), et un rattachement optionnel à une identité officielle pour les
  donneurs.
- **Prévenir la fraude aux récompenses.** La règle des soixante jours est un bon
  début, mais il faut des garde-fous supplémentaires : plafonds par structure,
  détection des schémas anormaux, et validation croisée pour les gros montants.
- **Protéger la clé du donneur.** Aujourd'hui, perdre sa clé revient à perdre
  l'accès. Il faut une procédure de récupération sûre, sans compromettre le
  principe de propriété par le donneur.

### 3.3 Ce qu'il faut vraiment pour une transformation digitale réussie

1. **Partir du terrain, pas de la technologie.** La blockchain n'est pas le
   produit : elle est l'infrastructure de confiance en arrière-plan. L'écran vu
   par le donneur et le personnel doit rester simple, dans un langage humain.
   Cette version a justement retiré le jargon technique de l'interface.
2. **Interopérer avec l'existant.** Se connecter aux systèmes des banques de
   sang et des laboratoires (résultats, stocks, historiques) pour éviter la
   double saisie et fiabiliser les données médicales.
3. **Couvrir tout le monde.** Ajouter un canal SMS ou USSD pour les donneurs
   sans smartphone, et un accès en langues locales. Sans cela, l'impact reste
   urbain.
4. **Encadrer juridiquement.** Travailler avec les agences nationales de
   transfusion et les autorités de protection des données pour un cadre clair,
   condition indispensable d'un déploiement à grande échelle.
5. **Prouver l'impact.** Mesurer et publier des indicateurs concrets : délai
   moyen entre une alerte et un don, taux de réponse, poches effectivement
   collectées. C'est ce qui convainc les hôpitaux et les financeurs, plus que
   la technologie.
6. **Valoriser la vraie force de la blockchain ici.** Elle apporte trois choses
   que les systèmes classiques peinent à garantir : un historique de dons
   impossible à falsifier, des récompenses instantanées et à faible coût même
   transfrontalières (utile pour la diaspora et les bailleurs), et une
   transparence vérifiable par des tiers. C'est sur ces trois points, et non
   sur la promesse crypto en elle-même, qu'il faut communiquer.

### 3.4 En résumé

La plateforme pose des fondations solides : séparation des rôles, carte de
donneur infalsifiable, vérification simple y compris hors-ligne, et récompenses
souples adaptées au contexte local. Pour passer d'un prototype convaincant à un
outil de santé publique de référence, l'effort doit désormais porter sur la
fiabilité médicale (tests de laboratoire rattachés), la conformité légale,
l'inclusion des populations non connectées, et la démonstration chiffrée de
l'impact. La technologie est déjà au rendez-vous ; la réussite se jouera sur le
terrain et dans la confiance des institutions.
