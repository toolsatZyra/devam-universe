import type { GroundedSarthiAnswer, SarthiRequest } from "../sarthi/contracts";
import type { LibrarySearchResult } from "./library-search";

type Language = "en" | "hi";

type OfficialSource = {
  id: string;
  title: string;
  url: string;
};

type WorldRecord = {
  slug: string;
  title: Record<Language, string>;
  statement: Record<Language, string>;
  aliases: string[];
  source: OfficialSource;
};

const DISTRICT_VISHWANATH: OfficialSource = {
  id: "varanasi-district-kashi-vishwanath",
  title: "Shree Kashi Vishvanath Temple",
  url: "https://varanasi.nic.in/tourist-place/shri-kashi-vishwanath-temple/",
};

const DISTRICT_TEMPLES: OfficialSource = {
  id: "varanasi-district-important-temples",
  title: "Temples of Importance",
  url: "https://varanasi.nic.in/temples-of-importance/",
};

const DISTRICT_GHATS: OfficialSource = {
  id: "varanasi-district-ganga-ghats",
  title: "Ganga Ghat",
  url: "https://varanasi.nic.in/tourist-place/ganga-ghat/",
};

const DISTRICT_SARNATH: OfficialSource = {
  id: "varanasi-district-sarnath",
  title: "Sarnath",
  url: "https://varanasi.nic.in/tourist-place/sarnath/",
};

const UNESCO_MUSIC: OfficialSource = {
  id: "unesco-creative-city-varanasi",
  title: "Varanasi - UNESCO Creative Cities Network",
  url: "https://www.unesco.org/en/creative-cities/varanasi",
};

const INCREDIBLE_VARANASI: OfficialSource = {
  id: "incredible-india-varanasi",
  title: "Places to Visit in Varanasi",
  url: "https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi",
};

const DISTRICT_HANDICRAFT: OfficialSource = {
  id: "varanasi-district-handicraft",
  title: "Handicraft",
  url: "https://varanasi.nic.in/handicraft/",
};

const IP_INDIA_BROCADES: OfficialSource = {
  id: "ip-india-gi-banaras-brocades-99",
  title: "GI Application 99 - Banaras Brocades and Sarees",
  url: "https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/99",
};

const SOURCE_BOUNDARY = {
  en: "Citation-only Devam synthesis from an official Government of India, Government of Uttar Pradesh, Intellectual Property India, or UNESCO page observed 2026-08-09. The page is not retained or quoted as a Devam source object. Sacred identity, living authority, textual tradition, archaeology, history, physical geography, community, rights, and current visitor information remain separate evidence lanes.",
  hi: "यह 9 अगस्त 2026 को देखे गए भारत सरकार, उत्तर प्रदेश सरकार, Intellectual Property India या UNESCO के आधिकारिक पृष्ठ पर आधारित केवल-संदर्भ Devam संश्लेषण है। पृष्ठ को Devam स्रोत-वस्तु के रूप में न रखा गया है, न उद्धृत किया गया है। पवित्र पहचान, जीवित प्रामाणिकता, ग्रंथ-परंपरा, पुरातत्त्व, इतिहास, भौतिक भूगोल, समुदाय, अधिकार और वर्तमान यात्रा-सूचना अलग प्रमाण-स्तर हैं।",
} as const;

const records: WorldRecord[] = [
  {
    slug: "kashi-vishwanath-temple",
    title: { en: "Kashi Vishwanath Temple", hi: "काशी विश्वनाथ मंदिर" },
    statement: {
      en: "The district administration describes Kashi Vishwanath as a living Shiva temple on the western bank of the Ganga and part of the Jyotirlinga tradition. Devam uses it as one doorway into Kashi, never as a substitute for the whole city or for temple authority.",
      hi: "जिला प्रशासन काशी विश्वनाथ को गंगा के पश्चिमी तट पर स्थित जीवित शिव मंदिर और ज्योतिर्लिंग परंपरा का भाग बताता है। Devam इसे काशी के एक प्रवेश-द्वार के रूप में रखता है, पूरे नगर या मंदिर-प्रामाणिकता के विकल्प के रूप में नहीं।",
    },
    aliases: ["kashi vishwanath temple varanasi", "kashi vishvanath temple", "काशी विश्वनाथ मंदिर"],
    source: DISTRICT_VISHWANATH,
  },
  {
    slug: "vishvanatha-kashi",
    title: { en: "Vishvanatha of Kashi", hi: "काशी के विश्वनाथ" },
    statement: {
      en: "The official place account names the temple's main deity Vishvanatha or Vishveshvara, meaning ruler of the universe. This opens a route to Shiva while keeping other Shiva forms, texts, temples, lineages, and practices distinct.",
      hi: "आधिकारिक स्थान-विवरण मंदिर के मुख्य देवता को विश्वनाथ या विश्वेश्वर नाम देता है। यह शिव के व्यापक जगत की ओर मार्ग खोलता है, पर अन्य शिव-रूप, ग्रंथ, मंदिर, परंपराएँ और साधनाएँ अलग रहती हैं।",
    },
    aliases: ["vishvanatha vishveshvara kashi shiva", "vishvanatha of kashi", "काशी विश्वनाथ स्वरूप"],
    source: DISTRICT_VISHWANATH,
  },
  {
    slug: "ganga-varanasi",
    title: { en: "Ganga at Varanasi", hi: "वाराणसी में गंगा" },
    statement: {
      en: "Ganga is both the physical river beside Varanasi and the centre of many separately governed sacred, social, economic, ecological, and cultural worlds. The Atlas keeps those lanes connected but does not treat them as one claim.",
      hi: "गंगा वाराणसी के पास बहती भौतिक नदी भी है और अनेक अलग-अलग पवित्र, सामाजिक, आर्थिक, पारिस्थितिक तथा सांस्कृतिक जगतों का केंद्र भी। Atlas इन मार्गों को जोड़ता है, पर एक ही दावा नहीं मानता।",
    },
    aliases: ["ganga river varanasi ghats", "ganga at varanasi", "वाराणसी गंगा"],
    source: DISTRICT_GHATS,
  },
  {
    slug: "varanasi-ghats",
    title: { en: "The ghats of Varanasi", hi: "वाराणसी के घाट" },
    statement: {
      en: "The district page describes a riverfront system of 88 ghats, most associated broadly with bathing and puja and two with cremation. Every ghat still needs its own history, community, practice, access, conservation, and safety record.",
      hi: "जिला पृष्ठ 88 घाटों वाले नदी-तटीय तंत्र का वर्णन करता है, जिनमें अधिकांश स्नान और पूजा तथा दो दाह-संस्कार से व्यापक रूप से जुड़े हैं। हर घाट का इतिहास, समुदाय, अभ्यास, पहुँच, संरक्षण और सुरक्षा अलग प्रमाण माँगते हैं।",
    },
    aliases: ["varanasi ganga ghats riverfront", "ghats of varanasi", "वाराणसी के घाट"],
    source: DISTRICT_GHATS,
  },
  {
    slug: "dashashwamedh-ghat",
    title: { en: "Dashashwamedh Ghat", hi: "दशाश्वमेध घाट" },
    statement: {
      en: "The national tourism portal identifies Dashashwamedh as a prominent ghat associated with a public evening Ganga Aarti. Devam opens the place without turning a tourism summary into ritual instructions, a live schedule, or a complete history.",
      hi: "राष्ट्रीय पर्यटन पोर्टल दशाश्वमेध को सार्वजनिक संध्या गंगा आरती से जुड़ा प्रमुख घाट बताता है। Devam इस स्थान को खोलता है, पर पर्यटन-सार को अनुष्ठान-विधि, जीवित समय-सारिणी या पूर्ण इतिहास नहीं बनाता।",
    },
    aliases: ["dashashwamedh ghat varanasi", "dashashwamedh ghat", "दशाश्वमेध घाट"],
    source: INCREDIBLE_VARANASI,
  },
  {
    slug: "kalabhairava-kashi-temple",
    title: { en: "Kalabhairava Temple in Kashi", hi: "काशी का कालभैरव मंदिर" },
    statement: {
      en: "The district temple page attributes to Kalabhairava a living belief as the 'Kotwal of Varanasi'. Devam presents that as an attributed place tradition and connects it to a separately sourced Jayanti lane, not as a supernatural rule or universal Bhairava doctrine.",
      hi: "जिला मंदिर-पृष्ठ कालभैरव से 'वाराणसी के कोतवाल' की जीवित मान्यता जोड़ता है। Devam इसे स्थान-परंपरा के रूप में श्रेय सहित दिखाता है और अलग स्रोत वाले जयंती मार्ग से जोड़ता है, सार्वभौमिक नियम या भैरव-सिद्धांत के रूप में नहीं।",
    },
    aliases: ["kalabhairava temple kashi varanasi", "kal bhairav temple varanasi", "कालभैरव मंदिर काशी"],
    source: DISTRICT_TEMPLES,
  },
  {
    slug: "annapurna-kashi-temple",
    title: { en: "Annapurna Temple in Kashi", hi: "काशी का अन्नपूर्णा मंदिर" },
    statement: {
      en: "The district page identifies a nearby Annapurna temple and a living association with food. This is a doorway into goddess, hospitality, food, household, story, and temple worlds, not a complete theology or ritual guide.",
      hi: "जिला पृष्ठ निकट स्थित अन्नपूर्णा मंदिर और अन्न से उसकी जीवित संबद्धता बताता है। यह देवी, आतिथ्य, भोजन, गृह-परंपरा, कथा और मंदिर जगत का प्रवेश-द्वार है, पूर्ण धर्मशास्त्र या पूजा-विधि नहीं।",
    },
    aliases: ["annapurna temple kashi varanasi", "maa annapurna temple varanasi", "अन्नपूर्णा मंदिर काशी"],
    source: DISTRICT_TEMPLES,
  },
  {
    slug: "tulsi-manas-temple",
    title: { en: "Tulsi Manas Temple", hi: "तुलसी मानस मंदिर" },
    statement: {
      en: "Official local heritage pages connect Tulsi Manas Temple with Rama, Tulsidas, and Ramcharitmanas memory. Devam uses that place-memory to open text and performance routes while leaving composition history and manuscript evidence separate.",
      hi: "आधिकारिक स्थानीय विरासत-पृष्ठ तुलसी मानस मंदिर को राम, तुलसीदास और रामचरितमानस की स्मृति से जोड़ते हैं। Devam इस स्थान-स्मृति से ग्रंथ और प्रदर्शन मार्ग खोलता है, जबकि रचना-इतिहास और पांडुलिपि-प्रमाण अलग रहते हैं।",
    },
    aliases: ["tulsi manas temple tulsidas ramcharitmanas", "tulsi manas mandir", "तुलसी मानस मंदिर"],
    source: DISTRICT_TEMPLES,
  },
  {
    slug: "tulsidas-varanasi",
    title: { en: "Tulsidas in Varanasi", hi: "वाराणसी में तुलसीदास" },
    statement: {
      en: "Varanasi's official heritage memory links Tulsidas with the city, Ramcharitmanas, and Sankat Mochan. The Atlas treats this as a route into sources, biography, devotion, performance, and local memory rather than a complete critical life.",
      hi: "वाराणसी की आधिकारिक विरासत-स्मृति तुलसीदास को नगर, रामचरितमानस और संकटमोचन से जोड़ती है। Atlas इसे स्रोत, जीवनी, भक्ति, प्रदर्शन और स्थानीय स्मृति की ओर मार्ग मानता है, पूर्ण आलोचनात्मक जीवन-वृत्त नहीं।",
    },
    aliases: ["tulsidas varanasi ramcharitmanas", "tulsidas in varanasi", "वाराणसी तुलसीदास"],
    source: DISTRICT_TEMPLES,
  },
  {
    slug: "sankat-mochan-varanasi",
    title: { en: "Sankat Mochan Temple", hi: "संकटमोचन मंदिर" },
    statement: {
      en: "The district page identifies Sankat Mochan as a Hanuman temple and attributes its establishment to Tulsidas. Devam keeps the living temple's authority separate while opening routes to Hanuman, poetry, performance, and music.",
      hi: "जिला पृष्ठ संकटमोचन को हनुमान मंदिर बताता है और उसकी स्थापना तुलसीदास से जोड़ता है। Devam जीवित मंदिर की प्रामाणिकता अलग रखते हुए हनुमान, काव्य, प्रदर्शन और संगीत की ओर मार्ग खोलता है।",
    },
    aliases: ["sankat mochan temple varanasi hanuman tulsidas", "sankat mochan varanasi", "संकटमोचन मंदिर वाराणसी"],
    source: DISTRICT_TEMPLES,
  },
  {
    slug: "sarnath",
    title: { en: "Sarnath", hi: "सारनाथ" },
    statement: {
      en: "The district administration places Sarnath near Varanasi and identifies it with the Buddha's first teaching and the emergence of the Sangha. Devam opens it as a distinct Buddhist, archaeological, institutional, and living pilgrimage world.",
      hi: "जिला प्रशासन सारनाथ को वाराणसी के निकट रखता है और इसे बुद्ध के प्रथम उपदेश तथा संघ के उद्भव से जोड़ता है। Devam इसे अलग बौद्ध, पुरातात्त्विक, संस्थागत और जीवित तीर्थ-जगत के रूप में खोलता है।",
    },
    aliases: ["sarnath buddha first sermon", "sarnath varanasi", "सारनाथ बुद्ध प्रथम उपदेश"],
    source: DISTRICT_SARNATH,
  },
  {
    slug: "buddha-sarnath",
    title: { en: "The Buddha at Sarnath", hi: "सारनाथ में बुद्ध" },
    statement: {
      en: "The official Sarnath account remembers the Buddha teaching Dhamma there after enlightenment. This encounter opens a much wider Buddhist universe while remaining far short of a complete biography, doctrine, chronology, or cross-school authority.",
      hi: "आधिकारिक सारनाथ-विवरण ज्ञान प्राप्ति के बाद बुद्ध द्वारा वहाँ धम्म सिखाने की स्मृति रखता है। यह भेंट व्यापक बौद्ध जगत खोलती है, पर पूर्ण जीवनी, सिद्धांत, कालक्रम या सभी परंपराओं की प्रामाणिकता नहीं।",
    },
    aliases: ["buddha sarnath first teaching", "buddha at sarnath", "सारनाथ में बुद्ध"],
    source: DISTRICT_SARNATH,
  },
  {
    slug: "first-sermon-sarnath",
    title: { en: "The first teaching at Sarnath", hi: "सारनाथ का प्रथम उपदेश" },
    statement: {
      en: "The first-teaching event is a route into Dhamma, early community, texts, art, pilgrimage, and archaeology. The official summary is only an orientation; it is not the discourse text, doctrinal commentary, or proof of every historical detail.",
      hi: "प्रथम उपदेश की घटना धम्म, आरंभिक समुदाय, ग्रंथ, कला, तीर्थ और पुरातत्त्व की ओर मार्ग है। आधिकारिक सार केवल परिचय है; वह उपदेश-पाठ, सिद्धांत-व्याख्या या हर ऐतिहासिक विवरण का प्रमाण नहीं।",
    },
    aliases: ["buddha first sermon sarnath dhamma", "first teaching at sarnath", "सारनाथ प्रथम उपदेश"],
    source: DISTRICT_SARNATH,
  },
  {
    slug: "buddhist-sangha-sarnath",
    title: { en: "The early Sangha at Sarnath", hi: "सारनाथ का आरंभिक संघ" },
    statement: {
      en: "The district page connects Kondanna's understanding with the remembered emergence of the Buddhist Sangha. Devam opens institutional and community history from there without defining every ordination, lineage, school, or living community.",
      hi: "जिला पृष्ठ कौण्डिन्य की समझ को बौद्ध संघ के स्मरणीय उद्भव से जोड़ता है। Devam वहाँ से संस्थागत और सामुदायिक इतिहास खोलता है, पर हर दीक्षा, वंश, संप्रदाय या जीवित समुदाय को परिभाषित नहीं करता।",
    },
    aliases: ["sarnath early buddhist sangha kondanna", "early sangha sarnath", "सारनाथ आरंभिक संघ"],
    source: DISTRICT_SARNATH,
  },
  {
    slug: "varanasi-city-of-music",
    title: { en: "Varanasi, City of Music", hi: "वाराणसी, संगीत का नगर" },
    statement: {
      en: "UNESCO recognizes Varanasi in the Creative Cities Network for music and describes music across festivals, teaching, and cultural life. The node opens a living ecology, not a complete list of musicians, gharanas, repertoires, communities, or rights.",
      hi: "UNESCO वाराणसी को संगीत के लिए Creative Cities Network में मान्यता देता है और उत्सव, शिक्षण तथा सांस्कृतिक जीवन में संगीत का वर्णन करता है। यह नोड जीवित पारिस्थितिकी खोलता है, संगीतकारों, घरानों, रचनाओं, समुदायों या अधिकारों की पूर्ण सूची नहीं।",
    },
    aliases: ["varanasi unesco creative city of music", "varanasi city of music", "वाराणसी संगीत का नगर"],
    source: UNESCO_MUSIC,
  },
  {
    slug: "varanasi-guru-shishya-music",
    title: { en: "Guru-shishya music transmission", hi: "गुरु-शिष्य संगीत परंपरा" },
    statement: {
      en: "UNESCO identifies guru-shishya transmission as important to Varanasi's music heritage and safeguarding plans. Every teacher, learner, lineage, repertoire, institution, access condition, and social history remains separately attributable.",
      hi: "UNESCO गुरु-शिष्य परंपरा को वाराणसी की संगीत-विरासत और संरक्षण योजनाओं के लिए महत्वपूर्ण बताता है। हर गुरु, शिष्य, वंश, रचना-संग्रह, संस्था, पहुँच और सामाजिक इतिहास अलग श्रेय माँगते हैं।",
    },
    aliases: ["varanasi music guru shishya parampara unesco", "guru shishya music varanasi", "गुरु शिष्य संगीत वाराणसी"],
    source: UNESCO_MUSIC,
  },
  {
    slug: "banaras-brocades-sarees",
    title: { en: "Banaras brocades and sarees", hi: "बनारस ब्रोकेड और साड़ियाँ" },
    statement: {
      en: "Banaras Brocades and Sarees are a registered GI craft. Official pages describe finely woven silk, zari, motifs, and conventional Banaras handlooms, opening routes into design, trade, ceremony, technology, and maker knowledge.",
      hi: "बनारस ब्रोकेड और साड़ियाँ पंजीकृत GI शिल्प हैं। आधिकारिक पृष्ठ महीन रेशम, ज़री, रूपांकन और पारंपरिक बनारस हथकरघों का वर्णन करते हैं तथा डिज़ाइन, व्यापार, समारोह, तकनीक और कारीगर-ज्ञान की ओर मार्ग खोलते हैं।",
    },
    aliases: ["banaras brocades and sarees gi weaving", "banarasi saree weaving", "बनारस ब्रोकेड साड़ी"],
    source: IP_INDIA_BROCADES,
  },
  {
    slug: "banaras-weaver-community",
    title: { en: "Banaras weaver communities", hi: "बनारस के बुनकर समुदाय" },
    statement: {
      en: "Official craft pages locate silk weaving in local artisan and applicant communities. Devam deliberately uses the plural: no one caste, religion, family, cooperative, technique, labour condition, or spokesperson represents the whole maker world.",
      hi: "आधिकारिक शिल्प-पृष्ठ रेशम-बुनाई को स्थानीय कारीगर और आवेदक समुदायों में रखते हैं। Devam जानबूझकर बहुवचन प्रयोग करता है: कोई एक जाति, धर्म, परिवार, सहकारी संस्था, तकनीक, श्रम-स्थिति या प्रवक्ता पूरे कारीगर-जगत का प्रतिनिधि नहीं।",
    },
    aliases: ["banaras weavers silk weaving community", "banaras weaver communities", "बनारस बुनकर समुदाय"],
    source: DISTRICT_HANDICRAFT,
  },
  {
    slug: "maratha-ghat-patronage",
    title: { en: "Maratha patronage of the ghats", hi: "घाटों का मराठा संरक्षण" },
    statement: {
      en: "The district page says many Varanasi ghats were rebuilt after 1700 and names Maratha, Shinde, Holkar, Bhonsle, and Peshwa patrons. This is a historical layer, not a complete building chronology or political history.",
      hi: "जिला पृष्ठ कहता है कि 1700 के बाद वाराणसी के अनेक घाट पुनर्निर्मित हुए और मराठा, शिंदे, होलकर, भोंसले तथा पेशवा संरक्षकों का नाम देता है। यह ऐतिहासिक स्तर है, पूर्ण निर्माण-कालक्रम या राजनीतिक इतिहास नहीं।",
    },
    aliases: ["varanasi ghats maratha patronage history", "maratha ghat patronage", "वाराणसी घाट मराठा संरक्षण"],
    source: DISTRICT_GHATS,
  },
  {
    slug: "kashi-rulers-music-patronage",
    title: { en: "Kashi rulers and music patronage", hi: "काशी शासक और संगीत संरक्षण" },
    statement: {
      en: "UNESCO notes that patronage associated with Kashi's rulers helped sustain the city's music sector and festivals. Devam treats patronage as one historical process, not a complete ruler chronology or sole explanation for cultural vitality.",
      hi: "UNESCO बताता है कि काशी के शासकों से जुड़ा संरक्षण नगर के संगीत क्षेत्र और उत्सवों को सहारा देता रहा। Devam संरक्षण को एक ऐतिहासिक प्रक्रिया मानता है, पूर्ण शासक-कालक्रम या सांस्कृतिक जीवंतता का एकमात्र कारण नहीं।",
    },
    aliases: ["maharajas of kashi music patronage unesco", "kashi rulers music patronage", "काशी संगीत संरक्षण"],
    source: UNESCO_MUSIC,
  },
  {
    slug: "ganga-mahotsav-varanasi",
    title: { en: "Ganga Mahotsav", hi: "गंगा महोत्सव" },
    statement: {
      en: "The national tourism portal describes Ganga Mahotsav as showcasing regional music, dance, and crafts. The Atlas uses it as a cultural intersection, not as a current programme, ritual authority, or complete representation of Varanasi.",
      hi: "राष्ट्रीय पर्यटन पोर्टल गंगा महोत्सव को क्षेत्रीय संगीत, नृत्य और शिल्प के प्रदर्शन से जोड़ता है। Atlas इसे सांस्कृतिक संगम के रूप में रखता है, वर्तमान कार्यक्रम, अनुष्ठान-प्रामाणिकता या वाराणसी का पूर्ण प्रतिनिधित्व नहीं।",
    },
    aliases: ["ganga mahotsav varanasi music dance crafts", "ganga mahotsav varanasi", "गंगा महोत्सव वाराणसी"],
    source: INCREDIBLE_VARANASI,
  },
];

function citation(record: WorldRecord) {
  return {
    passageId: `citation-only:${record.source.id}:${record.slug}`,
    sourceObjectId: `citation-only:${record.source.id}`,
    sourceOrdinal: 0,
    workTitle: record.source.title,
    editionTitle: "Official page observed 2026-08-09",
    locator: { url: record.source.url, observedAt: "2026-08-09", sourceTextReturned: false },
    rightsLane: "citation_only" as const,
  };
}

function normalize(value: string) {
  return value.toLocaleLowerCase("en-IN").replace(/[^\p{L}\p{M}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}

function matchesAlias(query: string, alias: string) {
  const normalizedAlias = normalize(alias);
  return query.includes(normalizedAlias) || normalizedAlias.includes(query) || normalizedAlias.split(" ").every((token) => query.includes(token));
}

function requestedLanguage(languageCode: string | undefined, value: string): Language {
  return languageCode?.toLowerCase().startsWith("hi") || /[\u0900-\u097f]/.test(value) ? "hi" : "en";
}

function toResult(record: WorldRecord, language: Language): LibrarySearchResult {
  return {
    id: `kashi-sacred-city:${record.slug}`,
    title: record.title[language],
    statement: record.statement[language],
    languageCode: language,
    claimKind: "citation_only_connected_sacred_city_context",
    citations: [citation(record)],
    sourceBoundary: SOURCE_BOUNDARY[language],
  };
}

export function searchKashiSacredCityWorld(query: string, languageCode?: string): LibrarySearchResult[] {
  const normalized = normalize(query);
  if (normalized.length < 3) return [];
  const language = requestedLanguage(languageCode, query);
  return records.filter((record) => record.aliases.some((alias) => matchesAlias(normalized, alias))).map((record) => toResult(record, language));
}

export function answerKashiSacredCityWorld(request: SarthiRequest): GroundedSarthiAnswer | null {
  const query = normalize(request.message);
  const contextualReference = /\b(this|here|it|looking|simply|relevant)\b/.test(query) || /(यह|इसके|यहाँ|बताओ|समझाओ)/.test(query);
  const contextualRecord = records.find((record) => record.slug === request.context?.atlasNodeSlug);
  const explicitRecord = records.find((record) => record.aliases.some((alias) => matchesAlias(query, alias)));
  const record = contextualRecord && contextualReference ? contextualRecord : explicitRecord;
  if (!record) return null;
  const language = requestedLanguage(request.context?.languageCode, request.message);
  return {
    ok: true,
    mode: "deterministic_source_bounded_preview",
    answer: record.statement[language],
    citations: [citation(record)],
    alternativesAvailable: true,
    sourceBoundary: SOURCE_BOUNDARY[language],
  };
}

export const KASHI_SACRED_CITY_WORLD_FIXITY = {
  nodeCount: records.length,
  sourceIds: [...new Set(records.map((record) => record.source.id))],
  citationOnly: true,
  languages: ["en", "hi"],
} as const;
