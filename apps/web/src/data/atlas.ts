import type { Gateway, PlaceThread, WorldEdge, WorldNode } from "@/lib/domain/atlas";

export const eras = ["Origins", "Epics", "Classical", "Medieval", "Living"] as const;

export const gateways: Gateway[] = [
  {
    id: "ramayana",
    title: "Ramayana",
    devanagari: "रामायण",
    invitation: "Begin at Ayodhya",
    tone: "saffron",
    position: { x: 27, y: 34 },
    threads: ["Ayodhya", "Chitrakoot", "Dharma in action"],
  },
  {
    id: "ganesha",
    title: "Ganesha",
    devanagari: "गणेश",
    invitation: "Enter the Ganesha world",
    tone: "moon",
    position: { x: 48, y: 63 },
    threads: ["Ganesh Chaturthi", "Ashtavinayak", "Meaning & symbolism"],
  },
  {
    id: "durga",
    title: "Durga",
    devanagari: "दुर्गा",
    invitation: "Follow the path of Shakti",
    tone: "rose",
    position: { x: 72, y: 31 },
    threads: ["Navaratri", "Devi Mahatmya", "Durga Puja"],
  },
  {
    id: "diwali",
    title: "Diwali",
    devanagari: "दीपावली",
    invitation: "Follow the festival of many lights",
    tone: "gold",
    position: { x: 76, y: 66 },
    threads: ["Lakshmi Puja", "Regional Deepavali", "Jain and Sikh traditions"],
  },
];

export const placeThreads: PlaceThread[] = [
  {
    gatewayId: "ramayana",
    title: "Ayodhya to Chitrakoot",
    invitation: "Follow two living place traditions into the epic journey.",
    evidenceBoundary: "This is an exploratory place thread, not a literal route, archaeological chronology, or claim that one geography settles every Ramayana telling.",
    nodeIds: ["ayodhya", "chitrakoot"],
  },
  {
    gatewayId: "ganesha",
    title: "Maharashtra to Ujjain",
    invitation: "Move between a pilgrimage constellation and a living city thread.",
    evidenceBoundary: "Screen positions are not map coordinates, and this preview is not a complete route, temple guide, history, or ritual authority.",
    nodeIds: ["ashtavinayak", "ujjain"],
  },
  {
    gatewayId: "durga",
    title: "Three Shakti place worlds",
    invitation: "Compare Kamakhya, Kolkata, and Kanchipuram without flattening them.",
    evidenceBoundary: "The three doorways preserve distinct regional, textual, historical, temple, and lineage contexts; proximity on screen implies no equivalence.",
    nodeIds: ["kamakhya", "kolkata", "kanchipuram"],
  },
  {
    gatewayId: "diwali",
    title: "Many lights, distinct places",
    invitation: "Cross Jain, Sikh, sacred-city, and Vaishnava place threads.",
    evidenceBoundary: "Seasonal connection does not merge Pavapuri, Amritsar, Kashi, or Nathdwara into one festival, theology, calendar, or ritual practice.",
    nodeIds: ["pavapuri", "amritsar", "kashi", "nathdwara"],
  },
];

export const worldNodes: WorldNode[] = [
  { id: "ayodhya", label: "Ayodhya", kind: "Place", eras: ["Origins", "Epics", "Living"], gatewayId: "ramayana", summary: "Enter the Ramayana through Ayodhya, then follow the source-bounded seven-kanda journey without treating one telling as the whole tradition.", searchQuery: "Ayodhya Ramayana", evidenceBoundary: "Origins is a story-world lens, not an archaeological date. Historical, archaeological, textual, and living Ayodhya claims remain separately sourced.", revealAt: 1, size: "major", position: { x: 38, y: 24 }, geography: { position: { x: 54, y: 35 }, region: "Uttar Pradesh" } },
  { id: "chitrakoot", label: "Chitrakoot", kind: "Place", eras: ["Epics", "Living"], gatewayId: "ramayana", summary: "Explore Chitrakoot as a Ramayana place-thread and continue into the epic's forest journey and its living sacred geography.", searchQuery: "Chitrakoot Ramayana", evidenceBoundary: "The Atlas connection does not collapse different Ramayana tellings, place traditions, or historical claims.", revealAt: 1.18, size: "connected", position: { x: 18, y: 48 }, geography: { position: { x: 51, y: 45 }, region: "Uttar Pradesh / Madhya Pradesh" } },
  { id: "ashtavinayak", label: "Ashtavinayak", kind: "Pilgrimage", eras: ["Medieval", "Living"], gatewayId: "ganesha", summary: "Open the Maharashtra pilgrimage thread connecting eight distinct Ganesha sites, their stories, places, and living practice.", searchQuery: "Ashtavinayak temples pilgrimage", evidenceBoundary: "This doorway is not a complete temple guide, route plan, origin history, or ritual authority for all eight sites.", revealAt: 1, size: "major", position: { x: 24, y: 73 }, geography: { position: { x: 46, y: 64 }, region: "Maharashtra" } },
  { id: "ujjain", label: "Ujjain", kind: "Place", eras: ["Classical", "Living"], gatewayId: "ganesha", summary: "Follow a living Ganesha thread through Ujjain while keeping temple, city, textual, and historical evidence distinct.", searchQuery: "Ujjain Ganesha temples", evidenceBoundary: "This preview signals a research path; it does not yet establish a complete Ujjain Ganesha corpus or visitor guide.", revealAt: 1.18, size: "connected", position: { x: 57, y: 77 }, geography: { position: { x: 47, y: 49 }, region: "Madhya Pradesh" } },
  { id: "kamakhya", label: "Kamakhya", kind: "Shakti Peetha", eras: ["Medieval", "Living"], gatewayId: "durga", summary: "Enter a major Shakti place-thread through Kamakhya, with textual traditions, regional histories, and present practice kept attributable.", searchQuery: "Kamakhya Shakti Peetha", evidenceBoundary: "The Atlas does not treat every Shakti Peetha list, origin account, or ritual lineage as interchangeable.", revealAt: 1, size: "major", position: { x: 84, y: 47 }, geography: { position: { x: 68, y: 42 }, region: "Assam" } },
  { id: "kolkata", label: "Kolkata", kind: "Living tradition", eras: ["Living"], gatewayId: "durga", summary: "Explore Bengal's living Durga Puja and Kali Puja worlds through their distinct calendars, stories, public forms, and household contexts.", searchQuery: "Kolkata Durga Puja Kali Puja", evidenceBoundary: "Bengal Durga Puja and Kali Puja are connected here but remain different observances with different applicability and authority.", revealAt: 1.18, size: "connected", position: { x: 68, y: 18 }, geography: { position: { x: 62, y: 55 }, region: "West Bengal" } },
  { id: "kashi", label: "Kashi", kind: "Sacred city", eras: ["Classical", "Medieval", "Living"], gatewayId: "diwali", summary: "Open Kashi as a sacred-city thread connecting Dev Deepawali, Shiva and Bhairava traditions, texts, places, and living observance.", searchQuery: "Kashi Dev Deepawali Shiva Bhairava", evidenceBoundary: "This preview does not substitute one city story or modern festival programme for Kashi's full historical and religious universe.", revealAt: 1.42, size: "connected", position: { x: 53, y: 35 }, geography: { position: { x: 57, y: 44 }, region: "Uttar Pradesh" } },
  { id: "kanchipuram", label: "Kanchipuram", kind: "Sacred city", eras: ["Classical", "Medieval", "Living"], gatewayId: "durga", summary: "Explore Kanchipuram through a South Indian Shakti and sacred-city thread while preserving temple and lineage distinctions.", searchQuery: "Kanchipuram Shakti temples", evidenceBoundary: "This doorway is not a universal account of Kanchipuram's temples, history, theology, or ritual practice.", revealAt: 1.42, size: "connected", position: { x: 72, y: 69 }, geography: { position: { x: 52, y: 86 }, region: "Tamil Nadu" } },
  { id: "pavapuri", label: "Pavapuri", kind: "Jain sacred place", eras: ["Classical", "Living"], gatewayId: "diwali", summary: "Follow Diwali into the Jain remembrance of Mahavira's nirvana while keeping sect, sangh, calendar, and practice variants visible.", searchQuery: "Pavapuri Mahavira Jain Diwali", evidenceBoundary: "The current Jain Diwali lane is a participation companion, not complete sect-specific ritual guidance.", revealAt: 1, size: "major", position: { x: 60, y: 81 }, geography: { position: { x: 60, y: 47 }, region: "Bihar" } },
  { id: "amritsar", label: "Amritsar", kind: "Sikh sacred city", eras: ["Medieval", "Living"], gatewayId: "diwali", summary: "Follow the Bandi Chhor Divas thread through Guru Hargobind Sahib, collective freedom, seva, and the living Amritsar context.", searchQuery: "Amritsar Bandi Chhor Divas Guru Hargobind", evidenceBoundary: "Bandi Chhor Divas is connected to the season without being merged into a Hindu or Jain Diwali ritual.", revealAt: 1.18, size: "connected", position: { x: 59, y: 15 }, geography: { position: { x: 43, y: 18 }, region: "Punjab" } },
  { id: "nathdwara", label: "Nathdwara", kind: "Vaishnava tradition", eras: ["Medieval", "Living"], gatewayId: "diwali", summary: "Explore a Vaishnava Annakut and Govardhan thread through Nathdwara while keeping regional and sampradaya practices distinct.", searchQuery: "Nathdwara Annakut Govardhan Puja", evidenceBoundary: "The current actionable Govardhana lane is ISKCON Bangalore-specific; it is not presented as Nathdwara ritual authority.", revealAt: 1.18, size: "connected", position: { x: 58, y: 79 }, geography: { position: { x: 43, y: 43 }, region: "Rajasthan" } },

  // Ramayana detail appears only as the user looks closer. Each doorway resolves
  // to an already reviewed source structure or episode rather than an invented map fact.
  { id: "ramcharitmanas", label: "Ramcharitmanas", kind: "Devotional epic", eras: ["Medieval", "Living"], gatewayId: "ramayana", summary: "Enter Tulsidas's Awadhi Ramcharitmanas through 802 source-addressed beta pages spanning all seven sopanas in one fixed Belvedere Press edition.", searchQuery: "Ramcharitmanas seven sopanas Belvedere Press", evidenceBoundary: "This doorway covers 802 published pages in one edition; 359 low-quality pages and 11 markup anomalies remain outside retrieval, and no claim is made for every Ramcharitmanas edition, commentary, performance, or tradition.", revealAt: 1.32, size: "major", position: { x: 27, y: 45 } },
  { id: "bala-kanda", label: "Balakanda", kind: "Epic book", eras: ["Epics"], gatewayId: "ramayana", summary: "Open the first book through the exact first-sarga boundary of the retained seven-book Sanskrit carrier.", searchQuery: "Ramayana Bala Kanda", evidenceBoundary: "This is one electronic Sanskrit carrier's book boundary, not every recension, translation, or Ramayana tradition.", revealAt: 1.55, size: "connected", position: { x: 12, y: 23 } },
  { id: "ayodhya-kanda", label: "Ayodhyakanda", kind: "Epic book", eras: ["Epics"], gatewayId: "ramayana", summary: "Follow the second source-bounded book while keeping the textual region distinct from the living city of Ayodhya.", searchQuery: "Ramayana Ayodhya Kanda", evidenceBoundary: "The source book and the Atlas place node are related but not interchangeable historical, geographic, or textual claims.", revealAt: 1.72, size: "connected", position: { x: 29, y: 15 } },
  { id: "aranya-kanda", label: "Aranyakanda", kind: "Epic book", eras: ["Epics"], gatewayId: "ramayana", summary: "Enter the forest book through its independently addressable opening sarga and preserved book identity.", searchQuery: "Ramayana Aranya Kanda", evidenceBoundary: "This node proves one carrier-level book boundary; it does not settle geography, chronology, or every telling.", revealAt: 1.72, size: "connected", position: { x: 8, y: 39 } },
  { id: "kishkindha-kanda", label: "Kishkindhakanda", kind: "Epic book", eras: ["Epics"], gatewayId: "ramayana", summary: "Continue into the fourth book without flattening its sarga structure into an unsourced story summary.", searchQuery: "Ramayana Kishkindha Kanda", evidenceBoundary: "The exact structure belongs to the retained GRETIL Sanskrit transcription and is not a universal edition claim.", revealAt: 1.88, size: "connected", position: { x: 17, y: 59 } },
  { id: "sundara-kanda", label: "Sundarakanda", kind: "Epic book", eras: ["Epics", "Living"], gatewayId: "ramayana", summary: "Reach the fifth book and its unusually long 190-group opening sarga before entering a reviewed Hanuman episode.", searchQuery: "Ramayana Sundara Kanda", evidenceBoundary: "Book and sarga coordinates remain edition-specific; devotional use and other textual traditions remain separate.", revealAt: 1.72, size: "connected", position: { x: 34, y: 49 } },
  { id: "hanuman-deliberation", label: "Hanuman's deliberation", kind: "Reviewed episode", eras: ["Epics"], gatewayId: "ramayana", summary: "Explore how Hanuman weighs Sita's fear, his language, the guards, and the wider mission before speaking.", searchQuery: "Hanuman's deliberation before speaking to Sita", evidenceBoundary: "This is a three-witness, episode-bounded Devam reflection, not binding precedent or every Ramayana telling.", revealAt: 2.05, size: "connected", position: { x: 37, y: 59 } },
  { id: "yuddha-kanda", label: "Yuddhakanda", kind: "Epic book", eras: ["Epics"], gatewayId: "ramayana", summary: "Open the sixth book as a separate source region with its first sarga and carrier identity intact.", searchQuery: "Ramayana Yuddha Kanda", evidenceBoundary: "The Atlas preserves one source structure and makes no universal recension, translation, or historical claim.", revealAt: 1.88, size: "connected", position: { x: 43, y: 40 } },
  { id: "uttara-kanda", label: "Uttarakanda", kind: "Epic book", eras: ["Epics"], gatewayId: "ramayana", summary: "Arrive at the seventh book that closes this carrier-level route while the wider tradition remains open.", searchQuery: "Ramayana Uttara Kanda", evidenceBoundary: "Terminal carrier coverage is not proof that every Ramayana work, recension, interpretation, or tradition is complete.", revealAt: 1.72, size: "connected", position: { x: 43, y: 14 } },

  // Ganesha festival nodes route into current location- and practice-bounded lanes.
  { id: "ganesha-purana", label: "Ganesha Purana", kind: "Source-bounded Purana", eras: ["Classical", "Medieval", "Living"], gatewayId: "ganesha", summary: "Explore the complete two-khaṇḍa structure of one exact Sanskrit Wikisource universe: 92 Upāsanā chapters and 155 Krīḍā chapters.", searchQuery: "Ganesha Purana two khandas 247 chapters", evidenceBoundary: "Complete only for 65 pinned Wikisource revisions and 62 lossless chapter-range passages; the underlying print edition, recension, translations, Mudgala Purana, ritual authority, and wider Ganesha corpus remain separate.", revealAt: 1.45, size: "major", position: { x: 57, y: 54 } },
  { id: "ganesh-chaturthi", label: "Ganesh Chaturthi", kind: "Festival", eras: ["Living"], gatewayId: "ganesha", summary: "Open the reviewed West India household lane for welcome, daily care, closing, and chosen immersion timing.", searchQuery: "What should I do for Ganesh Chaturthi?", evidenceBoundary: "The lane is West India Smarta household guidance, not priest-led liturgy, every stay duration, or all regional practice.", revealAt: 1.45, size: "major", position: { x: 40, y: 78 } },
  { id: "sankashti-chaturthi", label: "Sankashti Chaturthi", kind: "Recurring observance", eras: ["Living"], gatewayId: "ganesha", summary: "Follow the four resolved September-December 2026 West India Sankashti dates and their bounded family practice.", searchQuery: "Sankashti Chaturthi", evidenceBoundary: "Each month keeps its own moonrise and identity; fasting, katha, food, arghya, and every tradition are not universalized.", revealAt: 1.72, size: "connected", position: { x: 49, y: 90 } },
  { id: "ananta-chaturdashi", label: "Ananta Chaturdashi", kind: "Observance", eras: ["Living"], gatewayId: "ganesha", summary: "Explore the separate Ananta devotional lane while seeing its calendrical connection to some Ganeshotsav closings.", searchQuery: "Ananta Chaturdashi", evidenceBoundary: "Ananta worship is not reduced to Ganesh Visarjan, and the current guide is not a formal Ananta vrata procedure.", revealAt: 1.88, size: "connected", position: { x: 33, y: 91 } },

  // Durga nodes connect a source text, a North/West household sequence, Bengal
  // participation, and a separately scoped Karnataka Navami lane.
  { id: "devi-mahatmya", label: "Devi Mahatmya", kind: "Scriptural work", eras: ["Classical", "Medieval", "Living"], gatewayId: "durga", summary: "Enter the thirteen-chapter source sequence through exact chapter boundaries, with source-aligned English and Hindi beta translations for every preserved passage.", searchQuery: "Devimahatmya chapter 82", evidenceBoundary: "The exact Sanskrit provider revisions and AI-assisted beta translations are bounded evidence, not an identified recension, independently reviewed translation, every commentary, or ritual authority.", revealAt: 1.45, size: "major", position: { x: 82, y: 26 } },
  { id: "madhu-kaitabha", label: "Madhu and Kaiṭabha", kind: "Source-bounded narrative pair", eras: ["Classical"], gatewayId: "durga", summary: "Follow the Madhu and Kaiṭabha narrative identity from the exact chapter 81 evidence passage in the pinned Devī Māhātmya provider revision.", searchQuery: "Madhu and Kaitabha", evidenceBoundary: "This is a Devam narrative index for Sanskrit Wikisource revision 410281, chapter 81 verse 68; it is not a universal theological, historical, social, or ritual claim.", revealAt: 1.72, size: "connected", position: { x: 73, y: 34 } },
  { id: "mahishasura", label: "Mahiṣāsura", kind: "Source-bounded narrative figure", eras: ["Classical"], gatewayId: "durga", summary: "Open the Mahiṣāsura narrative identity through the exact chapter 83 evidence passage retained in Devam's pinned Devī Māhātmya source universe.", searchQuery: "Mahishasura", evidenceBoundary: "This is a Devam narrative index for Sanskrit Wikisource revision 410281, chapter 83 verse 41; it is not a universal theological, historical, social, or ritual claim.", revealAt: 1.72, size: "connected", position: { x: 94, y: 39 } },
  { id: "shumbha", label: "Śumbha", kind: "Source-bounded narrative figure", eras: ["Classical"], gatewayId: "durga", summary: "Enter the Śumbha narrative identity at the exact chapter 84 transition passage in the pinned Devī Māhātmya provider revision.", searchQuery: "Shumbha", evidenceBoundary: "This is a Devam narrative index for Sanskrit Wikisource revision 410281, chapter 84 verse 37; it is not a universal theological, historical, social, or ritual claim.", revealAt: 1.88, size: "connected", position: { x: 74, y: 8 } },
  { id: "nishumbha", label: "Niśumbha", kind: "Source-bounded narrative figure", eras: ["Classical"], gatewayId: "durga", summary: "Enter the Niśumbha narrative identity at the exact chapter 84 transition passage in the pinned Devī Māhātmya provider revision.", searchQuery: "Nishumbha", evidenceBoundary: "This is a Devam narrative index for Sanskrit Wikisource revision 410281, chapter 84 verse 37; it is not a universal theological, historical, social, or ritual claim.", revealAt: 1.88, size: "connected", position: { x: 85, y: 7 } },
  { id: "shardiya-navaratri", label: "Shardiya Navaratri", kind: "Festival sequence", eras: ["Living"], gatewayId: "durga", summary: "Open a nine-night North and West India household lane with deterministic 2026 boundaries and daily context.", searchQuery: "What should I do for Shardiya Navaratri?", evidenceBoundary: "Bengal Durga Puja, South Indian Golu and Saraswati forms, family kuladevi practice, and priest-led rites stay separate.", revealAt: 1.55, size: "major", position: { x: 90, y: 14 } },
  { id: "maha-ashtami", label: "Maha Ashtami", kind: "Festival day", eras: ["Living"], gatewayId: "durga", summary: "Enter the Kolkata participant lane for Maha Ashtami while keeping community and priestly roles distinct.", searchQuery: "Maha Ashtami in Kolkata", evidenceBoundary: "This is a Bengal Shakta community-participant scope, not household consecration or universal Ashtami liturgy.", revealAt: 1.72, size: "connected", position: { x: 95, y: 32 } },
  { id: "saraswati-ayudha-puja", label: "Saraswati and Ayudha Puja", kind: "Regional Navami", eras: ["Living"], gatewayId: "durga", summary: "Explore the Bengaluru Karnataka Navami lane for books, instruments, tools, Gombe Habba context, and safe participation.", searchQuery: "Karnataka Saraswati Puja", evidenceBoundary: "Formal mantra, homa, consecration, machinery operation, temple procedure, and other regional Navami forms remain separate.", revealAt: 1.88, size: "connected", position: { x: 88, y: 62 } },

  // Diwali expands as a sequence of distinct applicable observances, not one generic day.
  { id: "vasu-baras", label: "Vasu Baras", kind: "Festival opening", eras: ["Living"], gatewayId: "diwali", summary: "Begin a Maharashtra Diwali path with the separate Govatsa Dwadashi family lane where it applies.", searchQuery: "Vasu Baras", evidenceBoundary: "This Maharashtra family form is not a universal opening day, cattle rite, or substitute for local household practice.", revealAt: 1.55, size: "connected", position: { x: 69, y: 91 } },
  { id: "dhantrayodashi", label: "Dhanteras", kind: "Festival day", eras: ["Living"], gatewayId: "diwali", summary: "Explore Dhantrayodashi through a North and West India household lane without collapsing Dhanvantari and Yama practices.", searchQuery: "Dhanteras", evidenceBoundary: "Purchases, health claims, wealth promises, Dhanvantari worship, and Yama Deepam are not treated as one compulsory rite.", revealAt: 1.55, size: "connected", position: { x: 78, y: 85 } },
  { id: "yama-deepam", label: "Yama Deepam", kind: "Festival practice", eras: ["Living"], gatewayId: "diwali", summary: "Follow the separately attributable lamp practice and its local timing rather than hiding it inside a generic Dhanteras card.", searchQuery: "Yama Deepam", evidenceBoundary: "This bounded North and West India household lane does not guarantee outcomes or universalize direction, count, or mantra.", revealAt: 1.88, size: "connected", position: { x: 87, y: 84 } },
  { id: "naraka-chaturdashi", label: "Naraka Chaturdashi", kind: "Festival day", eras: ["Living"], gatewayId: "diwali", summary: "Open the Maharashtra Abhyanga Snan lane while retaining Kali Chaudas and Tamil Deepavali as different traditions.", searchQuery: "Maharashtra Naraka Chaturdashi", evidenceBoundary: "The guide is not a universal Naraka Chaturdashi form and does not merge Gujarati, Tamil, or other regional observances.", revealAt: 1.55, size: "connected", position: { x: 94, y: 75 } },
  { id: "lakshmi-puja", label: "Lakshmi Puja", kind: "Festival practice", eras: ["Living"], gatewayId: "diwali", summary: "Enter the reviewed West India household Lakshmi Puja lane with materials, timing, sequence, closing, and substitutions.", searchQuery: "Lakshmi Puja at home", evidenceBoundary: "Bengal Kali Puja, institutional rites, priest-led paddhati, business-book rites, and every regional form remain separate.", revealAt: 1.45, size: "major", position: { x: 94, y: 58 } },
  { id: "kali-puja", label: "Kali Puja", kind: "Regional festival", eras: ["Living"], gatewayId: "diwali", summary: "Connect Diwali's night to the distinct Bengal Kali Puja participant world without relabelling it as Lakshmi Puja.", searchQuery: "Bengal Kali Puja", evidenceBoundary: "The current lane supports a Bengal participant context, not priest-led Mahanisha Puja or all Shakta traditions.", revealAt: 1.72, size: "connected", position: { x: 82, y: 47 } },
  { id: "bali-pratipada", label: "Bali Pratipada", kind: "Festival day", eras: ["Living"], gatewayId: "diwali", summary: "Explore the Maharashtra family Padwa lane while preserving Karnataka Balipadyami and Govardhan paths separately.", searchQuery: "Maharashtra Bali Pratipada", evidenceBoundary: "This Maharashtra family scope does not universalize marriage customs, royal-Bali narratives, or other Pratipada traditions.", revealAt: 1.72, size: "connected", position: { x: 83, y: 96 } },
  { id: "govardhana-puja", label: "Govardhana Puja", kind: "Vaishnava festival", eras: ["Living"], gatewayId: "diwali", summary: "Open the ISKCON Bengaluru participant lane and continue toward Annakut traditions without merging their authorities.", searchQuery: "ISKCON Govardhan Puja", evidenceBoundary: "The reviewed participant lane is ISKCON-specific and is not a Nathdwara, BAPS, temple-wide, or universal household procedure.", revealAt: 1.88, size: "connected", position: { x: 69, y: 74 } },
  { id: "bhai-dooj", label: "Bhai Dooj", kind: "Festival day", eras: ["Living"], gatewayId: "diwali", summary: "Close the North India sequence through a household sibling lane while keeping Bhau Beej and Bhai Phota distinct.", searchQuery: "North India Bhai Dooj", evidenceBoundary: "This lane does not universalize gender roles, travel expectations, gifts, food, or regional sibling observances.", revealAt: 1.72, size: "connected", position: { x: 96, y: 92 } },
  { id: "tamil-deepavali", label: "Tamil Deepavali", kind: "Regional festival", eras: ["Living"], gatewayId: "diwali", summary: "Explore the Tamil early-morning household lane as its own Deepavali world rather than a variant footnote.", searchQuery: "Tamil Deepavali", evidenceBoundary: "The Tamil household lane does not become North Indian Lakshmi Puja, Maharashtra Abhyanga Snan, or all South Indian practice.", revealAt: 1.88, size: "connected", position: { x: 95, y: 46 } },
];

export const worldEdges: WorldEdge[] = [
  { id: "ramayana-ayodhya", from: "ramayana", to: "ayodhya", relation: "begins in" },
  { id: "ramayana-chitrakoot", from: "ramayana", to: "chitrakoot", relation: "journey through" },
  { id: "ganesha-ashtavinayak", from: "ganesha", to: "ashtavinayak", relation: "pilgrimage tradition" },
  { id: "ganesha-ujjain", from: "ganesha", to: "ujjain", relation: "living worship" },
  { id: "durga-kamakhya", from: "durga", to: "kamakhya", relation: "Shakti tradition" },
  { id: "durga-kolkata", from: "durga", to: "kolkata", relation: "Durga Puja" },
  { id: "durga-kanchipuram", from: "durga", to: "kanchipuram", relation: "Shakti tradition" },
  { id: "diwali-kolkata", from: "diwali", to: "kolkata", relation: "Kali Puja" },
  { id: "diwali-pavapuri", from: "diwali", to: "pavapuri", relation: "Jain Diwali" },
  { id: "diwali-amritsar", from: "diwali", to: "amritsar", relation: "Bandi Chhor Divas" },
  { id: "diwali-nathdwara", from: "diwali", to: "nathdwara", relation: "Annakut tradition" },
  { id: "diwali-kashi", from: "diwali", to: "kashi", relation: "Dev Deepawali" },

  { id: "ramayana-bala-kanda", from: "ramayana", to: "bala-kanda", relation: "opens with" },
  { id: "ramayana-ramcharitmanas", from: "ramayana", to: "ramcharitmanas", relation: "Awadhi devotional telling" },
  { id: "bala-to-ayodhya-kanda", from: "bala-kanda", to: "ayodhya-kanda", relation: "continues into" },
  { id: "ayodhya-kanda-to-ayodhya", from: "ayodhya-kanda", to: "ayodhya", relation: "text and place thread" },
  { id: "ayodhya-to-chitrakoot", from: "ayodhya", to: "chitrakoot", relation: "journey toward" },
  { id: "chitrakoot-to-aranya", from: "chitrakoot", to: "aranya-kanda", relation: "forest journey" },
  { id: "aranya-to-kishkindha", from: "aranya-kanda", to: "kishkindha-kanda", relation: "continues into" },
  { id: "kishkindha-to-sundara", from: "kishkindha-kanda", to: "sundara-kanda", relation: "mission continues" },
  { id: "sundara-to-hanuman-deliberation", from: "sundara-kanda", to: "hanuman-deliberation", relation: "contains episode" },
  { id: "sundara-to-yuddha", from: "sundara-kanda", to: "yuddha-kanda", relation: "continues into" },
  { id: "yuddha-to-uttara", from: "yuddha-kanda", to: "uttara-kanda", relation: "continues into" },

  { id: "ganesha-ganesh-chaturthi", from: "ganesha", to: "ganesh-chaturthi", relation: "annual festival" },
  { id: "ganesha-ganesha-purana", from: "ganesha", to: "ganesha-purana", relation: "source text" },
  { id: "ganesha-sankashti", from: "ganesha", to: "sankashti-chaturthi", relation: "recurring observance" },
  { id: "ganesh-chaturthi-to-ananta", from: "ganesh-chaturthi", to: "ananta-chaturdashi", relation: "some festival closings" },
  { id: "ganesh-chaturthi-to-ashtavinayak", from: "ganesh-chaturthi", to: "ashtavinayak", relation: "Maharashtra Ganesha world" },

  { id: "durga-devi-mahatmya", from: "durga", to: "devi-mahatmya", relation: "scriptural source" },
  { id: "devi-mahatmya-madhu-kaitabha", from: "devi-mahatmya", to: "madhu-kaitabha", relation: "contains narrative of" },
  { id: "devi-mahatmya-mahishasura", from: "devi-mahatmya", to: "mahishasura", relation: "contains narrative of" },
  { id: "devi-mahatmya-shumbha", from: "devi-mahatmya", to: "shumbha", relation: "contains narrative of" },
  { id: "devi-mahatmya-nishumbha", from: "devi-mahatmya", to: "nishumbha", relation: "contains narrative of" },
  { id: "durga-navaratri", from: "durga", to: "shardiya-navaratri", relation: "nine-night sequence" },
  { id: "navaratri-to-maha-ashtami", from: "shardiya-navaratri", to: "maha-ashtami", relation: "regional day path" },
  { id: "navaratri-to-saraswati-ayudha", from: "shardiya-navaratri", to: "saraswati-ayudha-puja", relation: "Karnataka Navami path" },
  { id: "maha-ashtami-to-kolkata", from: "maha-ashtami", to: "kolkata", relation: "Bengal participant context" },
  { id: "saraswati-ayudha-to-kanchipuram", from: "saraswati-ayudha-puja", to: "kanchipuram", relation: "South India exploration" },

  { id: "diwali-vasu-baras", from: "diwali", to: "vasu-baras", relation: "Maharashtra opening" },
  { id: "vasu-to-dhanteras", from: "vasu-baras", to: "dhantrayodashi", relation: "festival sequence" },
  { id: "dhanteras-to-yama", from: "dhantrayodashi", to: "yama-deepam", relation: "separate lamp practice" },
  { id: "dhanteras-to-naraka", from: "dhantrayodashi", to: "naraka-chaturdashi", relation: "festival sequence" },
  { id: "naraka-to-lakshmi", from: "naraka-chaturdashi", to: "lakshmi-puja", relation: "West India sequence" },
  { id: "naraka-to-tamil", from: "naraka-chaturdashi", to: "tamil-deepavali", relation: "distinct regional world" },
  { id: "lakshmi-to-kali", from: "lakshmi-puja", to: "kali-puja", relation: "same night, distinct practice" },
  { id: "kali-to-kolkata", from: "kali-puja", to: "kolkata", relation: "Bengal context" },
  { id: "lakshmi-to-bali", from: "lakshmi-puja", to: "bali-pratipada", relation: "Maharashtra sequence" },
  { id: "lakshmi-to-govardhana", from: "lakshmi-puja", to: "govardhana-puja", relation: "Vaishnava sequence" },
  { id: "govardhana-to-nathdwara", from: "govardhana-puja", to: "nathdwara", relation: "Annakut exploration" },
  { id: "bali-to-bhai-dooj", from: "bali-pratipada", to: "bhai-dooj", relation: "festival sequence" },
];
