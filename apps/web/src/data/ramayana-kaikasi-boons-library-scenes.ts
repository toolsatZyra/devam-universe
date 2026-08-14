import type { StoryBeat, StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const b = (id: string, en: string, hi: string, enText: string, hiText: string, visualCue: string, characterIds: string[]): StoryBeat => ({ id, title: { en, hi }, narration: { en: enText, hi: hiText }, visualCue, characterIds });
const s = (id: string, detailOrdinal: number, sourceOrdinal: number, spanSha256: string, title: { en: string; hi: string }, synopsis: { en: string; hi: string }, decisiveChange: { en: string; hi: string }, places: string[], nodeIds: string[], beats: StoryBeat[]): RamayanaLibraryScene => ({
  id, turnId: "origins-behind-war", detailOrdinal, title, synopsis, sourceStart: sourceOrdinal, sourceEnd: sourceOrdinal, sourceGlobalOrdinal: sourceOrdinal, spanSha256s: [spanSha256], nodeIds, places, moment: { id, decisiveChange, beats } satisfies StoryMoment,
});

export const RAMAYANA_KAIKASI_BOONS_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  s(
    "kaikasi-enters-visravas-house-under-family-pressure",
    23,
    9,
    "92553f0b238ca76e22a7736c6d3fee0a3e2147ce7794095a3d52684a1f689e1b",
    { en: "Kaikasi enters Visrava's house under family pressure", hi: "कैकसी पारिवारिक दबाव में विश्रवा के घर पहुँचती हैं" },
    {
      en: "After defeat and exile, Sumali directs Kaikasi toward Visrava to produce powerful descendants; she approaches under her father's mandate, asks that the predicted children not all be cruel, and later sees her sons choose sharply different paths.",
      hi: "पराजय और निर्वासन के बाद सुमाली शक्तिशाली वंशजों के लिए कैकसी को विश्रवा के पास भेजते हैं; वे पिता के आदेश में पहुँचकर माँग करती हैं कि सभी संतान क्रूर न हों, और आगे अपने पुत्रों को बहुत अलग मार्ग चुनते देखती हैं।",
    },
    {
      en: "A dynastic plan creates a household, but constrained consent, birth imagery, and prophecy do not erase Kaikasi's intervention or determine every child's conduct.",
      hi: "वंश बढ़ाने की योजना एक परिवार बनाती है, पर सीमित सहमति, जन्म-चित्र और भविष्यकथन कैकसी के हस्तक्षेप को नहीं मिटाते और हर संतान का आचरण तय नहीं करते।",
    },
    ["Nether regions", "Earth road", "Visrava's hermitage", "Forest household", "Gokarna"],
    ["sumali", "kaikasi", "visrava", "kubera", "ravana", "kumbhakarna", "surpanakha", "vibhishana", "family-pressure", "choice-not-birth"],
    [
      b(
        "defeat-turns-kaikasi-into-a-dynastic-strategy",
        "Defeat turns Kaikasi into a dynastic strategy",
        "पराजय कैकसी को वंश-रणनीति में बदल देती है",
        "While living in the nether regions after losing Lanka, Sumali sees Kubera's power and decides that his daughter Kaikasi should seek Visrava as a husband so her children may rival him. His speech treats her youth and marriage as instruments of family recovery and emphasizes a father's anxiety about arranging a daughter. Kaikasi's own preferred future is not first invited.",
        "लंका खोकर पाताल में रहते हुए सुमाली कुबेर की शक्ति देखते हैं और तय करते हैं कि उनकी पुत्री कैकसी विश्रवा को पति बनाए ताकि उनकी संतान कुबेर की बराबरी करे। उनकी बात कैकसी के यौवन और विवाह को परिवार की वापसी का साधन बनाती और बेटी के विवाह की पिता की चिंता पर जोर देती है। कैकसी से उनका अपना पसंदीदा भविष्य पहले नहीं पूछा जाता।",
        "Show the family-power plan closing around Kaikasi before her route to the hermitage opens.",
        ["sumali", "kaikasi", "kubera", "visrava", "family-pressure", "dynastic-strategy"],
      ),
      b(
        "kaikasi-says-she-came-by-her-fathers-command",
        "Kaikasi says she came by her father's command",
        "कैकसी कहती हैं कि वे पिता के आदेश से आई हैं",
        "Kaikasi approaches Visrava while he tends the sacred fire. When he asks her identity and purpose, she says directly that she has come under her father's command and asks him to discern the rest. The line records participation under family authority; it should not be silently rewritten as either entirely free courtship or complete absence of agency.",
        "कैकसी विश्रवा के अग्निकर्म के समय उनके पास पहुँचती हैं। परिचय और उद्देश्य पूछे जाने पर वे साफ कहती हैं कि पिता के आदेश से आई हैं और बाकी बात समझ लेने को कहती हैं। यह पंक्ति पारिवारिक सत्ता के भीतर भागीदारी दर्ज करती है; इसे न पूरी तरह स्वतंत्र प्रेम-प्रस्ताव, न संपूर्ण एजेंसीहीनता बनाकर लिखना चाहिए।",
        "Keep the father's command visibly behind Kaikasi while her own speech and presence remain active in the foreground.",
        ["kaikasi", "visrava", "sumali", "constrained-choice", "family-authority"],
      ),
      b(
        "kaikasi-asks-that-prophecy-not-define-every-child",
        "Kaikasi asks that prophecy not define every child",
        "कैकसी माँगती हैं कि भविष्यकथन हर संतान को तय न करे",
        "Visrava predicts fierce children because she arrived at an ominous ritual hour. Kaikasi immediately says she does not want only cruel sons from a Vedic ascetic and asks for favour. Visrava answers that her last son will be righteous. Her objection changes the announced future inside the story, even though the account still uses prophecy and birth timing as explanatory devices.",
        "विश्रवा अशुभ अनुष्ठान-समय पर आने के कारण उग्र संतानों की भविष्यवाणी करते हैं। कैकसी तुरंत कहती हैं कि वे वेदज्ञ तपस्वी से केवल क्रूर पुत्र नहीं चाहतीं और कृपा माँगती हैं। विश्रवा कहते हैं कि अंतिम पुत्र धर्मनिष्ठ होगा। कथा में उनका विरोध घोषित भविष्य बदलता है, भले वर्णन समय और भविष्यकथन को व्याख्या की तरह उपयोग करता रहे।",
        "Let Kaikasi's objection physically alter the prophecy branch instead of presenting her as a passive receiver.",
        ["kaikasi", "visrava", "prophecy", "vibhishana", "agency"],
      ),
      b(
        "four-siblings-are-not-one-inherited-nature",
        "Four siblings are not one inherited nature",
        "चार भाई-बहन एक वंशगत स्वभाव नहीं हैं",
        "Ravana, Kumbhakarna, Surpanakha, and Vibhishana are born into the same household. The account surrounds Ravana's birth with frightening bodily imagery and omens, yet later conduct—not appearance—must carry moral responsibility. Kumbhakarna harms people, Vibhishana practises restraint and study, and Surpanakha's full life cannot be reduced to a birth list between brothers.",
        "रावण, कुंभकर्ण, शूर्पणखा और विभीषण एक ही परिवार में जन्मते हैं। कथा रावण के जन्म के साथ भयावह शारीरिक चित्र और संकेत जोड़ती है, पर नैतिक जिम्मेदारी रूप नहीं, आगे के कर्मों से आनी चाहिए। कुंभकर्ण लोगों को हानि पहुँचाते, विभीषण संयम और अध्ययन करते हैं, और शूर्पणखा का पूरा जीवन भाइयों के बीच की जन्म-सूची में नहीं समा सकता।",
        "Branch four distinct life routes from one household and refuse moral colour-coding based on bodies or birth omens.",
        ["ravana", "kumbhakarna", "surpanakha", "vibhishana", "kaikasi", "visrava", "bodily-difference", "choice-not-birth"],
      ),
      b(
        "comparison-with-kubera-turns-into-rivalry",
        "Comparison with Kubera turns into rivalry",
        "कुबेर से तुलना प्रतिद्वंद्विता बनती है",
        "When Kubera visits Visrava in Pushpaka, Kaikasi tells Ravana to look at his half-brother's splendour and strive to equal him. Ravana answers with a vow to match or surpass Kubera and begins austerities at Gokarna with his brothers. The comparison helps explain ambition, but Kaikasi's pressure does not excuse the later choices made in pursuit of superiority.",
        "कुबेर पुष्पक से विश्रवा से मिलने आते हैं तो कैकसी रावण से उनके वैभव को देखकर बराबरी करने को कहती हैं। रावण कुबेर की बराबरी या उनसे आगे निकलने का वचन देकर भाइयों के साथ गोकर्ण में तप शुरू करते हैं। तुलना महत्वाकांक्षा समझाती है, पर कैकसी का दबाव श्रेष्ठता पाने के लिए आगे किए चुनावों को निर्दोष नहीं बनाता।",
        "Turn the comparison line into a chosen rivalry road toward Gokarna, keeping explanation separate from excuse.",
        ["kaikasi", "ravana", "kubera", "pushpaka", "gokarna", "rivalry", "responsibility"],
      ),
    ],
  ),
  s(
    "three-brothers-ask-for-three-different-futures",
    24,
    10,
    "e09839aaa71a5e8d9235fce2cb862e1fe8dc2c3edd928dd2e8e0752c08b2f06f",
    { en: "Three brothers ask for three different futures", hi: "तीन भाई तीन अलग भविष्य माँगते हैं" },
    {
      en: "Ravana, Vibhishana, and Kumbhakarna complete severe austerities, but their requests expose different priorities: immunity built on contempt for humans, ethical steadiness under pressure, and a sleep boon produced by divine interference with speech.",
      hi: "रावण, विभीषण और कुंभकर्ण कठोर तप पूरा करते हैं, पर उनकी माँगें अलग प्राथमिकताएँ दिखाती हैं—मनुष्यों को तुच्छ मानकर बनाई सुरक्षा, संकट में नैतिक स्थिरता और वाणी में दैवी हस्तक्षेप से निकला निद्रा-वर।",
    },
    {
      en: "Shared austerity does not produce one moral outcome, and a granted boon may contain arrogance, prejudice, or coercion that later drives the story.",
      hi: "साझा तप एक नैतिक परिणाम नहीं बनाता; मिला हुआ वर अहंकार, पूर्वाग्रह या दबाव समेट सकता है जो आगे कथा को मोड़ता है।",
    },
    ["Gokarna austerity ground", "Brahma's assembly", "Sleshmātaka wood"],
    ["ravana", "vibhishana", "kumbhakarna", "brahma", "saraswati", "celestials", "humans", "boon-constraint", "coerced-speech"],
    [
      b(
        "shared-austerity-hides-different-intentions",
        "Shared austerity hides different intentions",
        "साझा तप अलग उद्देश्यों को छिपाता है",
        "All three brothers undergo prolonged physical austerities. Ravana offers his heads into fire, Vibhishana maintains study and restraint, and Kumbhakarna endures heat, rain, and cold. Severity alone does not reveal ethical purpose. The same discipline can be directed toward domination, steadfastness, or a request whose outcome others manipulate.",
        "तीनों भाई लंबे शारीरिक तप करते हैं। रावण अपने सिर अग्नि में अर्पित करते, विभीषण अध्ययन और संयम रखते और कुंभकर्ण गर्मी, वर्षा व शीत सहते हैं। केवल कठोरता नैतिक उद्देश्य नहीं बताती—एक ही अनुशासन प्रभुत्व, स्थिरता या दूसरों द्वारा बदली जाने वाली माँग की ओर जा सकता है।",
        "Run three parallel austerity paths with their still-hidden requests kept separate until Brahma arrives.",
        ["ravana", "vibhishana", "kumbhakarna", "gokarna", "austerity", "different-intentions"],
      ),
      b(
        "ravana-builds-a-loophole-from-contempt-for-humans",
        "Ravana builds a loophole from contempt for humans",
        "रावण मनुष्यों को तुच्छ मानकर सुरक्षा में छेद छोड़ते हैं",
        "Brahma refuses Ravana's request for complete immortality. Ravana then asks to be immune from death at the hands of gods, Yakshas, Rakshasas, serpents, Daityas, Danavas, and birds, but omits humans because he considers them insignificant. Brahma grants the bounded protection and restores the offered heads. The unprotected human category is created by Ravana's own contempt.",
        "ब्रह्मा रावण की पूर्ण अमरता की माँग अस्वीकार करते हैं। तब रावण देव, यक्ष, राक्षस, नाग, दैत्य, दानव और पक्षियों से मृत्यु न होने का वर माँगते हैं, पर मनुष्यों को तुच्छ मानकर छोड़ देते हैं। ब्रह्मा सीमित सुरक्षा देते और अर्पित सिर लौटा देते हैं। मनुष्य वाला असुरक्षित मार्ग रावण के अपने तिरस्कार से बनता है।",
        "Build the protection sphere with one deliberately omitted human-sized opening created by Ravana's own words.",
        ["ravana", "brahma", "humans", "boon-constraint", "contempt", "future-vulnerability"],
      ),
      b(
        "vibhishana-asks-for-ethical-steadiness-under-pressure",
        "Vibhishana asks for ethical steadiness under pressure",
        "विभीषण संकट में नैतिक स्थिरता माँगते हैं",
        "When offered a boon, Vibhishana asks that his mind remain fixed on righteousness even in grave danger and that understanding arise in harmony with it. Brahma grants the request and immortality. The account's praise includes a prejudiced surprise that such thought could arise in a Rakshasa lineage; the consumer story keeps Vibhishana's chosen commitment without endorsing that inherited suspicion.",
        "वर माँगने पर विभीषण कहते हैं कि बड़े संकट में भी उनका मन धर्म पर स्थिर रहे और उसी के अनुरूप समझ मिले। ब्रह्मा माँग और अमरता देते हैं। कथा की प्रशंसा में यह पूर्वाग्रही आश्चर्य भी है कि राक्षस वंश में ऐसी सोच कैसे आई; उपभोक्ता कथा विभीषण का चुना संकल्प रखती है, वंशगत संदेह को स्वीकार नहीं करती।",
        "Illuminate Vibhishana's chosen principle while the lineage prejudice around Brahma's praise is visibly bounded and rejected.",
        ["vibhishana", "brahma", "ethical-steadiness", "lineage-prejudice", "choice-not-birth"],
      ),
      b(
        "the-celestials-ask-to-control-kumbhakarnas-boon",
        "The celestials ask to control Kumbhakarna's boon",
        "देव कुंभकर्ण का वर नियंत्रित करने को कहते हैं",
        "The celestials cite people Kumbhakarna has already killed or consumed and fear what greater power would enable. Instead of openly contesting his request, they ask Brahma to preserve the appearance of honour while secretly making the boon disabling. Their safety concern follows real harm, but the chosen method relies on deception and control of another person's speech.",
        "देव उन लोगों का नाम लेते हैं जिन्हें कुंभकर्ण पहले मार या खा चुके हैं और डरते हैं कि अधिक शक्ति क्या करेगी। वे उसकी माँग का खुला विरोध करने के बजाय ब्रह्मा से सम्मान का रूप बचाकर वर को छिपे ढंग से निष्क्रिय बनाने को कहते हैं। उनकी सुरक्षा-चिंता वास्तविक हानि से आती है, पर चुना तरीका छल और दूसरे की वाणी पर नियंत्रण है।",
        "Hold the documented harms and the deceptive response on separate evidence paths so one does not erase the other.",
        ["celestials", "kumbhakarna", "brahma", "prior-victims", "deception", "speech-control"],
      ),
      b(
        "saraswati-alters-speech-and-kumbhakarna-recognizes-it",
        "Saraswati alters speech, and Kumbhakarna recognizes it",
        "सरस्वती वाणी बदलती हैं और कुंभकर्ण इसे पहचानते हैं",
        "At Brahma's direction, Saraswati enters Kumbhakarna's speech as he asks for his boon, and a long sleep comes from his mouth. After the gods depart and his awareness clears, Kumbhakarna recognizes that his words were manipulated. The resulting sleep is therefore not presented as his free, informed preference, even though it becomes a lasting condition in the epic.",
        "ब्रह्मा के निर्देश पर सरस्वती वर माँगते समय कुंभकर्ण की वाणी में प्रवेश करती हैं और उनके मुँह से लंबी निद्रा की माँग निकलती है। देवों के जाने और चेतना लौटने पर कुंभकर्ण समझते हैं कि उनके शब्द बदले गए थे। इसलिए स्थायी महाकाव्य-स्थिति बन जाने पर भी निद्रा को उनकी स्वतंत्र और सूचित इच्छा नहीं कहा जाता।",
        "Distinguish Kumbhakarna's intended but unrecorded request from the spoken sleep boon and preserve his later recognition of manipulation.",
        ["saraswati", "brahma", "kumbhakarna", "coerced-speech", "sleep-boon", "recognition"],
      ),
    ],
  ),
];
