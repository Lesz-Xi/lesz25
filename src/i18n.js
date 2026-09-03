// Language: registry, string table, and the picker.
// No imports here — data.js, overlays.js and ocean.js all read from this, so it
// must stay a leaf module or the graph goes circular.
//
// Proper nouns (project names, Solaris/Atoman, the Japanese principles Ma,
// Shibui, Wabi-sabi, Kanso, Shinkei, Kiroku, GitHub/LinkedIn/X) are deliberately
// left untranslated — they are names, not words.

export const LANGUAGES = [
  { code: 'en', label: 'English',  short: 'EN' },
  { code: 'de', label: 'Deutsch',  short: 'DE' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'it', label: 'Italiano', short: 'IT' },
  { code: 'zh', label: '中文',      short: 'ZH' },
];

const STORAGE_KEY = 'rhine-lang';

const STRINGS = {
  en: {
    'hero': '{build}',
    'hero.build': 'trying to exist',

    'nav.work': 'Work',
    'nav.research': 'Research',
    'nav.photography': 'Photography',
    'nav.about': 'About',
    'nav.archive': 'Archive',
    'nav.contact': 'Contact',
    'nav.purpose': 'Purpose',

    'kicker.work': 'Selected work',
    'kicker.research': 'Papers & preprints',
    'kicker.about': 'Three registers, one practice',
    'kicker.archive': 'Field notes',
    'kicker.contact': 'Say hello',
    'kicker.purpose': 'The ground under the work',

    'purpose.p1': 'Everything here is one practice wearing three registers. The photograph trains the eye to see what is actually there. The code has to survive contact with reality. The research asks why — and each register keeps the others honest.',
    'purpose.p2': 'Across every project, one guardrail kept reappearing before it had a name: a system must never hand back a confident answer it cannot ground — and cannot be caught being wrong about. Fluency is cheap. The catch is the work.',
    'purpose.p3': 'The projects will change; the tools will change. The ground will not: truth — provenance kept visible, uncertainty kept honest, and every claim kept answerable.',
    'purpose.pr0': 'Truth before performance',
    'purpose.pr1': 'Causality before narrative',
    'purpose.pr2': 'Explanation before bluffing',
    'purpose.pr3': 'Provenance over fluent confidence',
    'purpose.pr4': 'Beauty aligned with truth',
    'purpose.pr5': 'Claims that stay answerable',

    'ui.visit': 'Visit →',
    'ui.read': 'Read →',
    'ui.close': 'Close',
    'ui.albums': '‹ Albums',
    'ui.prev': 'Previous image',
    'ui.next': 'Next image',
    'ui.openAlbum': 'Open album',
    'ui.language': 'Language',

    'theme.tip.toLight': 'let there be light',
    'theme.tip.toDark': 'return to the dark',
    'theme.aria.day': 'Switch to dark',
    'theme.aria.night': 'Switch to light',

    'status.dev': 'In development',
    'status.private': 'Private',
    'career.present': 'Present',
    'career.independent': 'Independent Practice',

    'work.0.desc': 'A causal AI workbench for hypothesis, intervention, and counterfactual reasoning — scientific reasoning made inspectable.',
    'work.1.desc': 'A companion-agent runtime where Solaris and Atoman preserve continuity, route attention, and turn explanation into a living operating surface.',
    'work.2.desc': 'A terminal-native AI workspace for structured execution, memory-aware routing, and companion-grade software work inside the command line.',
    'work.3.desc': 'A frontend motion craftbench and landing template gallery shaped by a photographer’s eye — seeing first, building with care.',
    'work.4.desc': 'An observational seismic interface — confirmed events, felt reports, elapsed windows, and watch cycles kept visibly separate.',

    'res.0.kind': 'Preprint · Computational Virology',
    'res.0.desc': 'HIV-1 eradication via thermodynamic targeting, using a TC-GAN approach.',
    'res.1.kind': 'Preprint · Affective Intelligence',
    'res.1.desc': 'A model for affect-aware intelligence with continuous valence correction.',
    'res.2.kind': 'White Paper · Causal AI',
    'res.2.desc': 'do-calculus, sovereign memory, and critique as a scientific-reasoning method.',
    'res.3.kind': 'Preprint · Threat Assessment',
    'res.3.desc': 'A failed ecology of containment in Philippine school violence — moving past single-cause blame.',
    'res.4.kind': 'Boundary · Posture',
    'res.4.desc': 'Keeping each claim answerable — provenance, uncertainty, and boundary held visible.',
    'res.5.kind': 'Preprint · AI Alignment',
    'res.5.desc': 'Test-time latent-algebraic constraints that collapse unsafe reasoning branches before tool emission.',

    'career.0.note': 'Causal AI workbench',
    'career.1.note': 'Companion-agent runtime',
    'career.2.note': 'Terminal-native AI workspace',
    'career.3.note': 'Frontend motion craftbench & templates',
    'career.4.note': 'Observational seismic interface',
    'career.5.note': 'Academic-integrity surface',
    'career.6.note': 'Adaptive coaching system',
    'career.7.note': 'Many-worlds decision model',
    'career.8.note': 'HIV research publication (Zenodo)',
    'career.9.note': 'Affective intelligence preprint',
    'career.10.note': 'School violence & containment preprint',
    'career.11.note': 'Building, seeing, asking why',

    'album.switzerland.title': 'Alpine Serenity',
    'album.switzerland.place': 'Zug, Switzerland',
    'album.paris.title': 'City of Light(s)',
    'album.paris.place': 'Paris',
    'album.nature.title': 'Nature',
    'album.nature.place': 'Collections',
    'album.sunset.title': 'Sunrise & Sunset',
    'album.sunset.place': 'Davao',
    'album.philippines.title': 'Islands & Icons',
    'album.philippines.place': 'Davao',
    'album.flowers.title': 'Flowers',
    'album.flowers.place': 'Botanical Garden',
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.locationVal': 'Philippines',

    'about.body': 'Designer, photographer, and researcher based in the Philippines. I work across three registers — <em>Photographer: see first · Designer: make it work · Researcher: ask why</em> — under a small set of principles: Ma, Shibui, Wabi-sabi, Kanso, Shinkei, Kiroku. Ultimately trying to understand how knowledge actually grows.',
    'photo.intro': 'Photography is my escape — a way to find beauty in the ordinary.',
    'contact.body': 'Open to research collaboration, photography, and quiet, careful software work.',
  },

  de: {
    'hero': '{build}',
    'hero.build': 'versuche zu existieren',

    'nav.work': 'Arbeit',
    'nav.research': 'Forschung',
    'nav.photography': 'Fotografie',
    'nav.about': 'Über mich',
    'nav.archive': 'Archiv',
    'nav.contact': 'Kontakt',
    'nav.purpose': 'Zweck',

    'kicker.work': 'Ausgewählte Arbeiten',
    'kicker.research': 'Aufsätze & Preprints',
    'kicker.about': 'Drei Register, eine Praxis',
    'kicker.archive': 'Feldnotizen',
    'kicker.contact': 'Sag Hallo',
    'kicker.purpose': 'Der Grund unter der Arbeit',

    'purpose.p1': 'Alles hier ist eine Praxis in drei Registern. Die Fotografie schult das Auge, zu sehen, was wirklich da ist. Der Code muss den Kontakt mit der Wirklichkeit überstehen. Die Forschung fragt nach dem Warum — und jedes Register hält die anderen ehrlich.',
    'purpose.p2': 'In jedem Projekt tauchte dieselbe Leitplanke wieder auf, noch bevor sie einen Namen hatte: Ein System darf nie eine selbstsichere Antwort zurückgeben, die es nicht begründen kann — und bei der es nicht beim Irrtum ertappt werden kann. Flüssigkeit ist billig. Die Prüfung ist die Arbeit.',
    'purpose.p3': 'Die Projekte werden sich ändern; die Werkzeuge auch. Der Grund nicht: Wahrheit — Herkunft sichtbar gehalten, Unsicherheit ehrlich gehalten, jede Behauptung verantwortbar gehalten.',
    'purpose.pr0': 'Wahrheit vor Darbietung',
    'purpose.pr1': 'Kausalität vor Erzählung',
    'purpose.pr2': 'Erklärung vor Bluff',
    'purpose.pr3': 'Herkunft über flüssige Gewissheit',
    'purpose.pr4': 'Schönheit im Einklang mit der Wahrheit',
    'purpose.pr5': 'Behauptungen, die verantwortbar bleiben',

    'ui.visit': 'Besuchen →',
    'ui.read': 'Lesen →',
    'ui.close': 'Schließen',
    'ui.albums': '‹ Alben',
    'ui.prev': 'Vorheriges Bild',
    'ui.next': 'Nächstes Bild',
    'ui.openAlbum': 'Album öffnen',
    'ui.language': 'Sprache',

    'theme.tip.toLight': 'es werde Licht',
    'theme.tip.toDark': 'zurück ins Dunkel',
    'theme.aria.day': 'Zu Dunkel wechseln',
    'theme.aria.night': 'Zu Hell wechseln',

    'status.dev': 'In Entwicklung',
    'status.private': 'Privat',
    'career.present': 'Gegenwart',
    'career.independent': 'Unabhängige Praxis',

    'work.0.desc': 'Eine kausale KI-Werkbank für Hypothese, Intervention und kontrafaktisches Denken — wissenschaftliches Schließen, nachvollziehbar gemacht.',
    'work.1.desc': 'Eine Begleiter-Agenten-Laufzeit, in der Solaris und Atoman Kontinuität bewahren, Aufmerksamkeit lenken und Erklärung in eine lebendige Bedienoberfläche verwandeln.',
    'work.2.desc': 'Ein terminal-nativer KI-Arbeitsraum für strukturierte Ausführung, gedächtnisbewusstes Routing und begleiterwürdige Softwarearbeit in der Kommandozeile.',
    'work.3.desc': 'Eine Frontend-Bewegungswerkbank und Galerie für Landingpage-Vorlagen, geprägt vom Blick des Fotografen — zuerst sehen, sorgfältig bauen.',
    'work.4.desc': 'Eine beobachtende seismische Oberfläche — bestätigte Ereignisse, Spürberichte, verstrichene Zeitfenster und Wachzyklen bleiben sichtbar getrennt.',

    'res.0.kind': 'Preprint · Computergestützte Virologie',
    'res.0.desc': 'HIV-1-Eradikation durch thermodynamisches Targeting mit einem TC-GAN-Ansatz.',
    'res.1.kind': 'Preprint · Affektive Intelligenz',
    'res.1.desc': 'Ein Modell affektbewusster Intelligenz mit kontinuierlicher Valenzkorrektur.',
    'res.2.kind': 'White Paper · Kausale KI',
    'res.2.desc': 'do-Kalkül, souveränes Gedächtnis und Kritik als Methode wissenschaftlichen Denkens.',
    'res.3.kind': 'Preprint · Gefahrenanalyse',
    'res.3.desc': 'Eine gescheiterte Ökologie der Eindämmung bei philippinischer Schulgewalt — jenseits monokausaler Schuldzuweisungen.',
    'res.4.kind': 'Grenze · Haltung',
    'res.4.desc': 'Jede Behauptung verantwortbar halten — Herkunft, Unsicherheit und Grenze bleiben sichtbar.',

    'career.0.note': 'Kausale KI-Werkbank',
    'career.1.note': 'Begleiter-Agenten-Laufzeit',
    'career.2.note': 'Terminal-nativer KI-Arbeitsraum',
    'career.3.note': 'Frontend-Bewegungswerkbank & Vorlagen',
    'career.4.note': 'Beobachtende seismische Oberfläche',
    'career.5.note': 'Oberfläche für akademische Integrität',
    'career.6.note': 'Adaptives Coaching-System',
    'career.7.note': 'Viele-Welten-Entscheidungsmodell',
    'career.8.note': 'HIV-Forschungspublikation (Zenodo)',
    'career.9.note': 'Preprint zur affektiven Intelligenz',
    'career.10.note': 'Preprint zu Schulgewalt & Eindämmung',
    'career.11.note': 'Bauen, sehen, nach dem Warum fragen',

    'album.switzerland.title': 'Alpine Stille',
    'album.switzerland.place': 'Zug, Schweiz',
    'album.paris.title': 'Stadt des Lichts',
    'album.paris.place': 'Paris',
    'album.nature.title': 'Natur',
    'album.nature.place': 'Sammlungen',
    'album.sunset.title': 'Sonnenauf- & -untergang',
    'album.sunset.place': 'Davao',
    'album.philippines.title': 'Inseln & Ikonen',
    'album.philippines.place': 'Davao',
    'album.flowers.title': 'Blumen',
    'album.flowers.place': 'Botanischer Garten',
    'contact.email': 'E-Mail',
    'contact.location': 'Ort',
    'contact.locationVal': 'Philippinen',

    'about.body': 'Designer, Fotograf und Forscher mit Sitz auf den Philippinen. Ich arbeite in drei Registern — <em>Fotograf: zuerst sehen · Designer: zum Laufen bringen · Forscher: nach dem Warum fragen</em> — unter wenigen Prinzipien: Ma, Shibui, Wabi-sabi, Kanso, Shinkei, Kiroku. Letztlich der Versuch zu verstehen, wie Wissen tatsächlich wächst.',
    'photo.intro': 'Die Fotografie ist mein Ausweg — eine Art, im Gewöhnlichen Schönheit zu finden.',
    'contact.body': 'Offen für Forschungskooperationen, Fotografie und ruhige, sorgfältige Softwarearbeit.',
  },

  fr: {
    'hero': '{build}',
    'hero.build': "essaie d'exister",

    'nav.work': 'Travaux',
    'nav.research': 'Recherche',
    'nav.photography': 'Photographie',
    'nav.about': 'À propos',
    'nav.archive': 'Archives',
    'nav.contact': 'Contact',
    'nav.purpose': 'Dessein',

    'kicker.work': 'Travaux choisis',
    'kicker.research': 'Articles & prépublications',
    'kicker.about': 'Trois registres, une pratique',
    'kicker.archive': 'Notes de terrain',
    'kicker.contact': 'Dites bonjour',
    'kicker.purpose': 'Le sol sous le travail',

    'purpose.p1': 'Tout ici est une seule pratique en trois registres. La photographie apprend à l’œil à voir ce qui est réellement là. Le code doit survivre au contact de la réalité. La recherche demande pourquoi — et chaque registre garde les autres honnêtes.',
    'purpose.p2': 'Dans chaque projet, le même garde-fou réapparaissait avant même d’avoir un nom : un système ne doit jamais rendre une réponse assurée qu’il ne peut pas fonder — et sur laquelle on ne peut pas le prendre en défaut. La fluidité ne coûte rien. Le garde-fou, c’est le travail.',
    'purpose.p3': 'Les projets changeront ; les outils aussi. Le sol, non : la vérité — la provenance tenue visible, l’incertitude tenue honnête, chaque affirmation tenue redevable.',
    'purpose.pr0': 'La vérité avant la performance',
    'purpose.pr1': 'La causalité avant le récit',
    'purpose.pr2': 'L’explication avant le bluff',
    'purpose.pr3': 'La provenance plutôt que l’assurance fluide',
    'purpose.pr4': 'La beauté alignée sur la vérité',
    'purpose.pr5': 'Des affirmations qui restent redevables',

    'ui.visit': 'Visiter →',
    'ui.read': 'Lire →',
    'ui.close': 'Fermer',
    'ui.albums': '‹ Albums',
    'ui.prev': 'Image précédente',
    'ui.next': 'Image suivante',
    'ui.openAlbum': 'Ouvrir l’album',
    'ui.language': 'Langue',

    'theme.tip.toLight': 'que la lumière soit',
    'theme.tip.toDark': 'retour à l’obscurité',
    'theme.aria.day': 'Passer en sombre',
    'theme.aria.night': 'Passer en clair',

    'status.dev': 'En développement',
    'status.private': 'Privé',
    'career.present': 'Aujourd’hui',
    'career.independent': 'Pratique indépendante',

    'work.0.desc': 'Un atelier d’IA causale pour l’hypothèse, l’intervention et le raisonnement contrefactuel — le raisonnement scientifique rendu inspectable.',
    'work.1.desc': 'Un environnement d’agents compagnons où Solaris et Atoman préservent la continuité, orientent l’attention et transforment l’explication en une surface vivante.',
    'work.2.desc': 'Un espace de travail IA natif du terminal pour l’exécution structurée, le routage conscient de la mémoire et un travail logiciel de qualité compagnon, en ligne de commande.',
    'work.3.desc': 'Un atelier de mouvement frontend et une galerie de modèles de pages d’atterrissage façonnés par l’œil d’un photographe — voir d’abord, bâtir avec soin.',
    'work.4.desc': 'Une interface sismique d’observation — événements confirmés, témoignages ressentis, fenêtres écoulées et cycles de veille tenus visiblement séparés.',

    'res.0.kind': 'Prépublication · Virologie computationnelle',
    'res.0.desc': 'Éradication du VIH-1 par ciblage thermodynamique, via une approche TC-GAN.',
    'res.1.kind': 'Prépublication · Intelligence affective',
    'res.1.desc': 'Un modèle d’intelligence sensible à l’affect, avec correction continue de la valence.',
    'res.2.kind': 'Livre blanc · IA causale',
    'res.2.desc': 'do-calcul, mémoire souveraine et critique comme méthode de raisonnement scientifique.',
    'res.3.kind': 'Prépublication · Évaluation des menaces',
    'res.3.desc': 'Une écologie défaillante du confinement face aux violences scolaires aux Philippines — dépasser le blâme monocausal.',
    'res.4.kind': 'Limite · Posture',
    'res.4.desc': 'Garder chaque affirmation redevable — provenance, incertitude et limite tenues visibles.',

    'career.0.note': 'Atelier d’IA causale',
    'career.1.note': 'Runtime d’agents compagnons',
    'career.2.note': 'Espace de travail IA natif du terminal',
    'career.3.note': 'Atelier de mouvement frontend & modèles',
    'career.4.note': 'Interface sismique d’observation',
    'career.5.note': 'Surface d’intégrité académique',
    'career.6.note': 'Système de coaching adaptatif',
    'career.7.note': 'Modèle de décision à mondes multiples',
    'career.8.note': 'Publication de recherche VIH (Zenodo)',
    'career.9.note': 'Prépublication sur l’intelligence affective',
    'career.10.note': 'Prépublication sur la violence scolaire et la contention',
    'career.11.note': 'Construire, voir, demander pourquoi',

    'album.switzerland.title': 'Sérénité alpine',
    'album.switzerland.place': 'Zoug, Suisse',
    'album.paris.title': 'Ville Lumière',
    'album.paris.place': 'Paris',
    'album.nature.title': 'Nature',
    'album.nature.place': 'Collections',
    'album.sunset.title': 'Lever & coucher de soleil',
    'album.sunset.place': 'Davao',
    'album.philippines.title': 'Îles & icônes',
    'album.philippines.place': 'Davao',
    'album.flowers.title': 'Fleurs',
    'album.flowers.place': 'Jardin botanique',
    'contact.email': 'E-mail',
    'contact.location': 'Lieu',
    'contact.locationVal': 'Philippines',

    'about.body': 'Designer, photographe et chercheur basé aux Philippines. Je travaille sur trois registres — <em>Photographe : voir d’abord · Designer : faire fonctionner · Chercheur : demander pourquoi</em> — sous quelques principes : Ma, Shibui, Wabi-sabi, Kanso, Shinkei, Kiroku. Au fond, chercher à comprendre comment le savoir grandit vraiment.',
    'photo.intro': 'La photographie est mon échappée — une façon de trouver la beauté dans l’ordinaire.',
    'contact.body': 'Ouvert à la collaboration de recherche, à la photographie et à un travail logiciel calme et soigné.',
  },

  it: {
    'hero': '{build}',
    'hero.build': 'cerca di esistere',

    'nav.work': 'Lavori',
    'nav.research': 'Ricerca',
    'nav.photography': 'Fotografia',
    'nav.about': 'Chi sono',
    'nav.archive': 'Archivio',
    'nav.contact': 'Contatti',
    'nav.purpose': 'Proposito',

    'kicker.work': 'Lavori selezionati',
    'kicker.research': 'Articoli e preprint',
    'kicker.about': 'Tre registri, una pratica',
    'kicker.archive': 'Note dal campo',
    'kicker.contact': 'Fatevi sentire',
    'kicker.purpose': 'Il fondamento sotto il lavoro',

    'purpose.p1': 'Tutto qui è una sola pratica in tre registri. La fotografia allena l’occhio a vedere ciò che c’è davvero. Il codice deve sopravvivere al contatto con la realtà. La ricerca chiede perché — e ogni registro tiene onesti gli altri.',
    'purpose.p2': 'In ogni progetto riaffiorava la stessa barriera, prima ancora di avere un nome: un sistema non deve mai restituire una risposta sicura che non sa fondare — e su cui non può essere colto in errore. La fluidità costa poco. Il controllo è il lavoro.',
    'purpose.p3': 'I progetti cambieranno; gli strumenti anche. Il fondamento no: la verità — la provenienza tenuta visibile, l’incertezza tenuta onesta, ogni affermazione tenuta responsabile.',
    'purpose.pr0': 'La verità prima della performance',
    'purpose.pr1': 'La causalità prima della narrazione',
    'purpose.pr2': 'La spiegazione prima del bluff',
    'purpose.pr3': 'La provenienza più della sicurezza fluente',
    'purpose.pr4': 'La bellezza allineata alla verità',
    'purpose.pr5': 'Affermazioni che restano responsabili',

    'ui.visit': 'Visita →',
    'ui.read': 'Leggi →',
    'ui.close': 'Chiudi',
    'ui.albums': '‹ Album',
    'ui.prev': 'Immagine precedente',
    'ui.next': 'Immagine successiva',
    'ui.openAlbum': 'Apri album',
    'ui.language': 'Lingua',

    'theme.tip.toLight': 'sia la luce',
    'theme.tip.toDark': 'ritorno al buio',
    'theme.aria.day': 'Passa a scuro',
    'theme.aria.night': 'Passa a chiaro',

    'status.dev': 'In sviluppo',
    'status.private': 'Privato',
    'career.present': 'Oggi',
    'career.independent': 'Pratica indipendente',

    'work.0.desc': 'Un banco di lavoro di IA causale per ipotesi, interventi e ragionamento controfattuale — il ragionamento scientifico reso ispezionabile.',
    'work.1.desc': 'Un runtime di agenti compagni dove Solaris e Atoman preservano la continuità, orientano l’attenzione e trasformano la spiegazione in una superficie operativa viva.',
    'work.2.desc': 'Uno spazio di lavoro IA nativo del terminale per esecuzione strutturata, routing consapevole della memoria e lavoro software di livello compagno, dalla riga di comando.',
    'work.3.desc': 'Un banco di lavoro per il movimento frontend e una galleria di template per landing page modellati dall’occhio del fotografo — vedere prima, costruire con cura.',
    'work.4.desc': 'Un’interfaccia sismica di osservazione — eventi confermati, segnalazioni percepite, finestre trascorse e cicli di sorveglianza mantenuti visibilmente distinti.',

    'res.0.kind': 'Preprint · Virologia computazionale',
    'res.0.desc': 'Eradicazione dell’HIV-1 tramite targeting termodinamico, con un approccio TC-GAN.',
    'res.1.kind': 'Preprint · Intelligenza affettiva',
    'res.1.desc': 'Un modello di intelligenza consapevole dell’affetto, con correzione continua della valenza.',
    'res.2.kind': 'White paper · IA causale',
    'res.2.desc': 'do-calcolo, memoria sovrana e critica come metodo di ragionamento scientifico.',
    'res.3.kind': 'Preprint · Valutazione delle minacce',
    'res.3.desc': 'Un’ecologia fallita del contenimento nella violenza scolastica nelle Filippine — oltre la colpa monocausale.',
    'res.4.kind': 'Confine · Postura',
    'res.4.desc': 'Mantenere ogni affermazione responsabile — provenienza, incertezza e confine resi visibili.',

    'career.0.note': 'Banco di lavoro IA causale',
    'career.1.note': 'Runtime di agenti compagni',
    'career.2.note': 'Spazio di lavoro IA nativo del terminale',
    'career.3.note': 'Banco di lavoro per movimento frontend & template',
    'career.4.note': 'Interfaccia sismica di osservazione',
    'career.5.note': 'Superficie per l’integrità accademica',
    'career.6.note': 'Sistema di coaching adattivo',
    'career.7.note': 'Modello decisionale a molti mondi',
    'career.8.note': 'Pubblicazione di ricerca sull’HIV (Zenodo)',
    'career.9.note': 'Preprint sull’intelligenza affettiva',
    'career.10.note': 'Preprint su violenza scolastica e contenimento',
    'career.11.note': 'Costruire, vedere, chiedere perché',

    'album.switzerland.title': 'Serenità alpina',
    'album.switzerland.place': 'Zugo, Svizzera',
    'album.paris.title': 'Città della luce',
    'album.paris.place': 'Parigi',
    'album.nature.title': 'Natura',
    'album.nature.place': 'Collezioni',
    'album.sunset.title': 'Alba e tramonto',
    'album.sunset.place': 'Davao',
    'album.philippines.title': 'Isole e icone',
    'album.philippines.place': 'Davao',
    'album.flowers.title': 'Fiori',
    'album.flowers.place': 'Giardino botanico',
    'contact.email': 'E-mail',
    'contact.location': 'Luogo',
    'contact.locationVal': 'Filippine',

    'about.body': 'Designer, fotografo e ricercatore con base nelle Filippine. Lavoro su tre registri — <em>Fotografo: vedere prima · Designer: farlo funzionare · Ricercatore: chiedere perché</em> — sotto pochi principi: Ma, Shibui, Wabi-sabi, Kanso, Shinkei, Kiroku. In fondo, cercare di capire come la conoscenza cresce davvero.',
    'photo.intro': 'La fotografia è la mia via di fuga — un modo di trovare bellezza nell’ordinario.',
    'contact.body': 'Aperto a collaborazioni di ricerca, fotografia e lavoro software quieto e accurato.',
  },

  zh: {
    'hero': '{build}',
    'hero.build': '试着存在',

    'nav.work': '作品',
    'nav.research': '研究',
    'nav.photography': '摄影',
    'nav.about': '关于',
    'nav.archive': '档案',
    'nav.contact': '联系',
    'nav.purpose': '初衷',

    'kicker.work': '精选作品',
    'kicker.research': '论文与预印本',
    'kicker.about': '三种音区，一种实践',
    'kicker.archive': '田野笔记',
    'kicker.contact': '打个招呼',
    'kicker.purpose': '作品之下的根基',

    'purpose.p1': '这里的一切，是同一种实践的三种音区。摄影训练眼睛去看真正在场的东西；代码必须经受与现实的接触；研究追问为何——三者彼此守望，互相保真。',
    'purpose.p2': '在每一个项目里，同一道护栏总是先于它的名字出现：一个系统绝不能交回一个它无法立足、也无从被证伪的自信答案。流利很廉价，把关才是真正的工作。',
    'purpose.p3': '项目会变，工具会变，根基不变：真——出处保持可见，不确定性保持诚实，每一个论断都可被追问。',
    'purpose.pr0': '真在表演之前',
    'purpose.pr1': '因果在叙事之前',
    'purpose.pr2': '解释在虚张之前',
    'purpose.pr3': '出处胜于流利的自信',
    'purpose.pr4': '美与真对齐',
    'purpose.pr5': '每个论断都可被追问',

    'ui.visit': '访问 →',
    'ui.read': '阅读 →',
    'ui.close': '关闭',
    'ui.albums': '‹ 相册',
    'ui.prev': '上一张',
    'ui.next': '下一张',
    'ui.openAlbum': '打开相册',
    'ui.language': '语言',

    'theme.tip.toLight': '要有光',
    'theme.tip.toDark': '重归黑暗',
    'theme.aria.day': '切换为黑暗',
    'theme.aria.night': '切换为明亮',

    'status.dev': '开发中',
    'status.private': '私有',
    'career.present': '至今',
    'career.independent': '独立实践',

    'work.0.desc': '一个因果 AI 工作台，用于假设、干预与反事实推理——让科学推理变得可检视。',
    'work.1.desc': '一个伴随式智能体运行时：Solaris 与 Atoman 维系连续性、引导注意力，并将解释化为可操作的活界面。',
    'work.2.desc': '一个以终端为家的 AI 工作空间：结构化执行、具记忆意识的路由，以及命令行内的伴随级软件工作。',
    'work.3.desc': '一个前端动效工坊与落地页模板合集，以摄影师之眼塑造——先看见，再审慎建造。',
    'work.4.desc': '一个观测式地震界面——已确认事件、有感报告、经过窗口与值守周期，始终清晰分列。',

    'res.0.kind': '预印本 · 计算病毒学',
    'res.0.desc': '以 TC-GAN 方法，通过热力学靶向实现 HIV-1 清除。',
    'res.1.kind': '预印本 · 情感智能',
    'res.1.desc': '一个具情感意识的智能模型，带有连续效价校正。',
    'res.2.kind': '白皮书 · 因果 AI',
    'res.2.desc': 'do-演算、自主记忆，以及作为科学推理方法的批判。',
    'res.3.kind': '预印本 · 威胁评估',
    'res.3.desc': '菲律宾校园暴力中失效的围堵生态——超越单一归咎的因果分析。',
    'res.4.kind': '边界 · 姿态',
    'res.4.desc': '让每一个论断都可被追问——来源、不确定性与边界始终可见。',

    'career.0.note': '因果 AI 工作台',
    'career.1.note': '伴随式智能体运行时',
    'career.2.note': '终端原生 AI 工作空间',
    'career.3.note': '前端动效工坊与模板',
    'career.4.note': '观测式地震界面',
    'career.5.note': '学术诚信界面',
    'career.6.note': '自适应教练系统',
    'career.7.note': '多世界决策模型',
    'career.8.note': 'HIV 研究论文（Zenodo）',
    'career.9.note': '情感智能预印本',
    'career.10.note': '校园暴力与围堵预印本',
    'career.11.note': '建造、观看、追问为何',

    'album.switzerland.title': '阿尔卑斯的宁静',
    'album.switzerland.place': '瑞士，楚格',
    'album.paris.title': '光之城',
    'album.paris.place': '巴黎',
    'album.nature.title': '自然',
    'album.nature.place': '合集',
    'album.sunset.title': '日出与日落',
    'album.sunset.place': '达沃',
    'album.philippines.title': '岛屿与图腾',
    'album.philippines.place': '达沃',
    'album.flowers.title': '花',
    'album.flowers.place': '植物园',
    'contact.email': '邮箱',
    'contact.location': '所在地',
    'contact.locationVal': '菲律宾',

    'about.body': '设计师、摄影师与研究者，常驻菲律宾。我在三个音区之间工作——<em>摄影师：先看见 · 设计师：让它跑起来 · 研究者：追问为何</em>——遵循少数几条原则：Ma、Shibui、Wabi-sabi、Kanso、Shinkei、Kiroku。归根结底，是想理解知识究竟如何生长。',
    'photo.intro': '摄影是我的出口——一种在平凡中寻见美的方式。',
    'contact.body': '欢迎研究合作、摄影，以及安静而审慎的软件工作。',
  },
};

const SUPPORTED = LANGUAGES.map((l) => l.code);

function detectLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch (_) { /* storage unavailable */ }
  // No stored choice: meet them in their own language if we speak it.
  const nav = (navigator.languages && navigator.languages.length)
    ? navigator.languages : [navigator.language || 'en'];
  for (const tag of nav) {
    const base = String(tag).toLowerCase().split('-')[0];
    if (SUPPORTED.includes(base)) return base;
  }
  return 'en';
}

let current = detectLang();
const listeners = new Set();

export function getLang() { return current; }

// Missing keys fall back to English rather than rendering an empty node.
export function t(key) {
  const table = STRINGS[current] || STRINGS.en;
  const value = table[key];
  if (value !== undefined) return value;
  return STRINGS.en[key] !== undefined ? STRINGS.en[key] : key;
}

export function onLangChange(fn) { listeners.add(fn); }

export function setLang(code) {
  if (!SUPPORTED.includes(code) || code === current) return;
  current = code;
  try { localStorage.setItem(STORAGE_KEY, code); } catch (_) { /* ignore */ }
  applyLang();
  listeners.forEach((fn) => fn(code));
}

// Static text carried by markup: [data-i18n] sets textContent,
// [data-i18n-aria] sets aria-label.
export function applyLang() {
  document.documentElement.lang = current;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  const trigger = document.querySelector('.lang-current');
  const active = LANGUAGES.find((l) => l.code === current);
  if (trigger && active) trigger.textContent = active.short;
  const picker = document.querySelector('[data-lang-picker]');
  if (picker) {
    picker.querySelectorAll('[data-lang]').forEach((btn) => {
      const on = btn.dataset.lang === current;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      btn.classList.toggle('is-active', on);
    });
    const t2 = picker.querySelector('.lang-trigger');
    if (t2) t2.setAttribute('aria-label', t('ui.language'));
  }
}

export function initLangPicker() {
  const picker = document.querySelector('[data-lang-picker]');
  if (!picker) return;
  const trigger = picker.querySelector('.lang-trigger');
  const menu = picker.querySelector('.lang-menu');
  if (!trigger || !menu) return;

  menu.innerHTML = LANGUAGES.map((l) => `
    <li role="none">
      <button class="lang-option" type="button" role="option" data-lang="${l.code}" aria-selected="false">
        <span class="lang-name">${l.label}</span>
        <span class="lang-check" aria-hidden="true">✓</span>
        <span class="lang-code">${l.short}</span>
      </button>
    </li>`).join('');

  const setOpen = (open) => {
    picker.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
  };
  setOpen(false);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(menu.hidden);
  });

  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    setLang(btn.dataset.lang);
    setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setOpen(false); trigger.focus(); }
  });

  applyLang();
}
