// Code Pénal d'Elyndra — données structurées
// Les montants sont en Couronnes (£), amendes de base.

export const PREAMBULE =
  "Les montants sont les amendes de base en Couronnes (£). Les règles de sanction et les démarches pour contester ou payer s'appliquent à tous les articles."

export const SECTIONS = [
  {
    id: 'contraventions',
    title: 'Contraventions',
    subtitle: "l'Ordre décide",
    intro:
      "Atteintes limitées : amende ou avertissement écrit si le trouble a cessé et que la situation le justifie.",
    articles: [
      {
        code: 'T01',
        titre: 'Tapage persistant',
        description:
          "Poursuivre une nuisance après une demande justifiée de cesser.",
        amende: 100,
      },
      {
        code: 'T02',
        titre: 'Obstruction volontaire',
        description:
          "Bloquer volontairement un accès dont la nécessité est établie.",
        amende: 200,
      },
      {
        code: 'T03',
        titre: 'Maintien dans un lieu privé',
        description:
          "Rester volontairement sans droit après la demande de départ d'une personne habilitée.",
        amende: 150,
      },
      {
        code: 'A01',
        titre: "Refus d'une consigne légale",
        description:
          "Refuser volontairement une consigne précise, proportionnée, expliquée et relevant des pouvoirs de l'agent.",
        amende: 150,
      },
      {
        code: 'B06',
        titre: 'Dégradation légère',
        description:
          "Causer volontairement un dommage superficiel et facilement réparable.",
        amende: 150,
      },
      {
        code: 'D01',
        titre: 'Nuisance magique interdite',
        description:
          "Produire volontairement une nuisance sonore, visuelle ou matérielle interdite par décret, pour perturber la tranquillité ou l'usage du lieu.",
        amende: 100,
      },
      {
        code: 'D02',
        titre: 'Vol aérien interdit',
        description:
          "Voler volontairement dans un périmètre publié et signalé, en connaissant l'interdiction et en maîtrisant son déplacement.",
        amende: 200,
      },
      {
        code: 'D03',
        titre: "Refus d'une règle de tenue ou d'équipement",
        description:
          "Refuser une exigence objective publiée et affichée à l'entrée, après explication et possibilité réelle de s'adapter ou de repartir.",
        amende: 100,
      },
      {
        code: 'D04',
        titre: 'Fermeture de sécurité franchie',
        description:
          "Entrer ou rester volontairement dans une zone publique temporairement fermée et signalée pour un danger ou des travaux établis, après information et possibilité réelle de respecter la fermeture.",
        amende: 200,
      },
      {
        code: 'D05',
        titre: 'Dépôt de déchets interdit',
        description:
          "Abandonner volontairement des déchets dans un espace public visé par décret, hors emplacement autorisé, puis refuser de les retirer après rappel malgré la possibilité de le faire sans danger.",
        amende: 100,
      },
      {
        code: 'D06',
        titre: 'Affichage sur un support interdit',
        description:
          "Poser ou maintenir volontairement une affiche sur un support public interdit par décret, puis refuser son retrait après rappel malgré la possibilité de le faire sans danger.",
        amende: 100,
      },
    ],
    notes: [
      "**D01 à D06** : il faut un décret signé, publié, en vigueur, applicable au lieu et non suspendu ou annulé. Le même refus continu ne donne pas plusieurs sanctions à chaque rappel.",
      "**Magie** : soins, usages utiles et manifestations inoffensives sans nuisance interdite restent permis. Menaces et violences suivent leur propre article.",
      "**Vol aérien** : un décret peut couvrir tout le quartier résidentiel cartographié. Entrée involontaire : sortie ou atterrissage sûr possible. Chute incontrôlée ou secours justifié : pas de violation volontaire.",
      "**Tenue** : une arrivée de bonne foi suivie d'une mise en conformité n'est pas sanctionnée. Les tenues des nations respectant les critères restent admises ; soins urgents et défense restent accessibles.",
      "**Affichage** : l'interdiction vise les supports, pas les opinions. L'auteur ou responsable doit être identifié par des faits.",
    ],
  },
  {
    id: 'delits',
    title: 'Délits',
    subtitle: 'le juge décide',
    intro:
      "Atteintes importantes, même lorsqu'une amende seule est envisagée.",
    articles: [
      {
        code: 'P01',
        titre: 'Menace crédible',
        description:
          "Annoncer ou manifester une violence dont le contexte établit le sérieux. Une grossièreté ne suffit pas.",
        amende: 350,
      },
      {
        code: 'P02',
        titre: 'Violence volontaire limitée',
        description:
          "Porter volontairement atteinte à une personne, sans blessure grave ni danger concret de mort.",
        amende: 650,
      },
      {
        code: 'P06',
        titre: 'Mise en danger par imprudence',
        description:
          "Créer un danger concret causé par une imprudence prouvée.",
        amende: 350,
      },
      {
        code: 'P07',
        titre: 'Blessures par imprudence',
        description:
          "Causer des blessures par une faute prouvée, sans intention de les infliger.",
        amende: 650,
      },
      {
        code: 'P08',
        titre: 'Homicide par imprudence',
        description:
          "Causer un décès établi par une faute prouvée, sans intention de tuer.",
        amende: 1200,
      },
      {
        code: 'M01',
        titre: 'Intrusion mentale',
        description: "Lire les pensées d'une personne sans son consentement.",
        amende: 1000,
      },
      {
        code: 'B01',
        titre: 'Vol simple',
        description:
          "Prendre volontairement le bien d'autrui sans accord ni droit.",
        amende: 350,
      },
      {
        code: 'B02',
        titre: 'Cambriolage',
        description:
          "Entrer sans autorisation dans un lieu privé pour voler. Sans vol réalisé, les conditions de la tentative doivent être remplies.",
        amende: 650,
      },
      {
        code: 'B03',
        titre: 'Escroquerie',
        description:
          "Obtenir un bien ou un avantage par tromperie intentionnelle, sans droit, au détriment d'autrui.",
        amende: 650,
      },
      {
        code: 'B04',
        titre: 'Recel',
        description:
          "Conserver un bien en sachant qu'il a été volé. Cette connaissance doit être prouvée.",
        amende: 650,
      },
      {
        code: 'B07',
        titre: 'Dégradation importante',
        description:
          "Causer volontairement une destruction ou une mise hors d'usage importante.",
        amende: 650,
      },
      {
        code: 'A02',
        titre: "Fuite devant une arrestation",
        description:
          "Fuir volontairement pour se soustraire à une arrestation fondée et annoncée.",
        amende: 350,
      },
      {
        code: 'A03',
        titre: 'Résistance physique',
        description:
          "S'opposer physiquement et volontairement à une intervention légale et annoncée, sans violence grave.",
        amende: 650,
      },
      {
        code: 'J01',
        titre: 'Fabrication de preuve',
        description:
          "Créer ou altérer volontairement un élément destiné à passer pour une preuve authentique.",
        amende: 1000,
      },
      {
        code: 'J02',
        titre: 'Faux document',
        description:
          "Fabriquer ou altérer intentionnellement un document pour tromper sur son authenticité ou sa portée.",
        amende: 650,
      },
      {
        code: 'J03',
        titre: 'Accusation mensongère',
        description:
          "Accuser en sachant les faits rapportés faux. Une plainte non prouvée ne suffit pas.",
        amende: 1000,
      },
      {
        code: 'J05',
        titre: 'Abus volontaire de fonction',
        description:
          "Utiliser volontairement sa fonction publique pour porter atteinte aux droits, sauf infraction plus grave décrivant le même fait.",
        amende: 1000,
      },
      {
        code: 'I01',
        titre: "Détention d'un objet interdit",
        description:
          "Détenir consciemment un objet visé par une interdiction publique précise applicable, sans autorisation ni exception.",
        amende: 350,
      },
      {
        code: 'I02',
        titre: 'Fabrication ou remise interdite',
        description:
          "Fabriquer, vendre, donner ou prêter intentionnellement un objet contre une restriction publique précise, sans autorisation ni exception.",
        amende: 1000,
      },
    ],
    notes: [
      "**Biens** : une dette, un litige commercial ou un achat de bonne foi ne suffit pas à établir une infraction.",
      "**Objets** : la liste publique doit préciser l'objet et les actes interdits avant les faits. Signaler une découverte et organiser sa remise n'est pas une détention illégale, sans usage personnel ni vente ; cela n'efface pas les infractions antérieures.",
    ],
  },
  {
    id: 'crimes',
    title: 'Crimes',
    subtitle: 'le juge décide',
    intro:
      "Les faits les plus graves ; un crime n'exige pas nécessairement un décès.",
    articles: [
      {
        code: 'P03',
        titre: 'Violence volontaire grave',
        description:
          "Commettre une violence volontaire causant une blessure grave ou un danger concret de mort. Une arme ou un sort ne suffit pas, seul, à classer l'acte comme crime.",
        amende: 2500,
      },
      {
        code: 'P04',
        titre: "Tentative d'homicide",
        description:
          "Commencer réellement un acte avec l'intention prouvée de tuer, alors que la victime survit.",
        amende: 3500,
      },
      {
        code: 'P05',
        titre: 'Homicide volontaire',
        description:
          "Causer un décès établi avec l'intention prouvée de tuer.",
        amende: 5000,
      },
      {
        code: 'L01',
        titre: 'Enlèvement ou séquestration',
        description:
          "Enlever ou retenir volontairement une personne sans autorité ni justification.",
        amende: 2000,
      },
      {
        code: 'L02',
        titre: "Prise d'otage",
        description:
          "Retenir une personne pour imposer une rançon ou une condition à elle-même ou à un tiers.",
        amende: 3500,
      },
      {
        code: 'M02',
        titre: 'Contrôle imposé de la volonté',
        description:
          "Imposer une emprise dirigeant réellement la volonté d'une personne.",
        amende: 3500,
      },
      {
        code: 'B05',
        titre: 'Vol ou extorsion avec menace grave ou violence',
        description:
          "Prendre un bien ou imposer la remise d'un bien ou d'un avantage par menace grave ou violence.",
        amende: 2500,
      },
      {
        code: 'B08',
        titre: 'Destruction mettant des vies en danger',
        description:
          "Causer une destruction volontaire, notamment par incendie ou explosion, avec un danger concret pour des vies.",
        amende: 3500,
      },
      {
        code: 'J04',
        titre: 'Corruption',
        description:
          "Proposer ou accepter un avantage pour qu'un agent ou responsable public agisse contre ses obligations.",
        amende: 3000,
      },
      {
        code: 'J06',
        titre: 'Fabrication de preuve aggravée',
        description:
          "Fabriquer ou altérer volontairement une preuve pour faire condamner pour un crime une personne que l'on sait innocente.",
        amende: 3500,
      },
      {
        code: 'J07',
        titre: 'Accusation mensongère aggravée',
        description:
          "Accuser sciemment de faits faux une personne que l'on sait innocente, pour la faire condamner pour un crime.",
        amende: 3500,
      },
    ],
    notes: [
      "**Décès** : une perte de connaissance ou une hospitalisation ne prouve pas une mort. Des blessures graves ne prouvent pas, seules, l'intention de tuer.",
      "**Doublons** : pour le même fait, J06 remplace J01 et J07 remplace J03. Une arrestation légale n'est pas une séquestration.",
    ],
  },
  {
    id: 'decrets',
    title: 'Décrets de la Chancellerie',
    subtitle: '',
    intro: '',
    articles: [
      {
        code: 'DEC01',
        titre: 'Pouvoir',
        description:
          "La Chancellerie précise les règles locales autorisées par le code. Elle ne crée ni infraction générale de « non-respect d'un décret », ni peine nouvelle, ni pouvoir de fouille, ni autorité sur les nations.",
        amende: null,
      },
      {
        code: 'DEC02',
        titre: 'Application',
        description:
          "Signé par le chancelier et publié, le décret est présumé valable dès sa publication ou la date ultérieure annoncée, sans accord préalable du juge. Actes, lieux, conditions et exceptions doivent être précis.",
        amende: null,
      },
      {
        code: 'DEC03',
        titre: 'Peine',
        description:
          "Le décret cite l'article du code et sa sanction. Tous ses éléments doivent être prouvés. Aucun montant, frais ou supplément improvisé.",
        amende: null,
      },
      {
        code: 'DEC04',
        titre: 'Motif',
        description:
          "La sanction indique les faits, l'article, le décret appliqué et le moyen de contester.",
        amende: null,
      },
      {
        code: 'DEC05',
        titre: 'Contrôle',
        description:
          "Un juge non impliqué peut maintenir, suspendre ou annuler tout ou partie du décret. S'il demande une correction, il motive sa décision et précise les passages concernés, la date d'effet et ce qui reste applicable ou suspendu. L'Ordre et la Chancellerie la respectent dès qu'elle leur est communiquée et prend effet, sans attendre sa publication.",
        amende: null,
      },
    ],
    notes: [
      "**Correction** : la Chancellerie signe et publie le texte corrigé, sans rendre punissables des faits passés. Renuméroter le décret ne lève pas une suspension. Une contestation ou une demande de correction ne suspend rien automatiquement et ne prolonge pas le recours contre une amende.",
      "**Exemple** : « tenue correcte » est trop flou. Le juge peut demander des critères précis et suspendre cette règle ; une correction de titre peut laisser la règle applicable.",
    ],
  },
]

export const ALL_ARTICLES = SECTIONS.flatMap((s) =>
  s.articles.map((a) => ({ ...a, section: s.title, sectionId: s.id })),
)

export const AMENDES_UNIQUES = Array.from(
  new Set(ALL_ARTICLES.map((a) => a.amende).filter((v) => v != null)),
).sort((a, b) => a - b)
