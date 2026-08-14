import type { StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const commonNodes = [
  "ravana",
  "pushpaka",
  "underworld",
  "cosmic-limits",
  "remembered-worlds",
];

export const RAMAYANA_COSMIC_CONQUESTS_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  {
    id: "stalemate-friendship-and-varunas-absent-court",
    turnId: "origins-behind-war",
    detailOrdinal: 9,
    title: { en: "A stalemate becomes friendship; Varuna is not there", hi: "गतिरोध मित्रता बनता है; वरुण वहाँ नहीं हैं" },
    synopsis: {
      en: "Ravana's underworld campaign moves from a year-long draw and a negotiated alliance to fresh killings, his own brother-in-law's death, and a battle at Varuna's palace whose absent king cannot answer his challenge.",
      hi: "रावण का पाताल-अभियान एक वर्ष के अनिर्णीत युद्ध और समझौते की मित्रता से आगे बढ़कर नई हत्याओं, अपने ही बहनोई की मृत्यु और वरुण के महल की लड़ाई तक पहुँचता है—पर अनुपस्थित वरुण उसकी चुनौती का उत्तर दे ही नहीं सकते।",
    },
    sourceStart: 23,
    sourceEnd: 23,
    sourceGlobalOrdinal: 23,
    spanSha256s: ["449abf96a7fbc0b72aa013fc8dc35c7f47c2f93c645074e6bd75cbf75667f1ba"],
    nodeIds: [...commonNodes, "nivatakavachas", "kalakeyas", "vidyujjihva", "surabhi", "varuna-sons", "varuna-realm"],
    places: ["Bhogavati", "Manimayi", "Ashma city", "Varuna's palace"],
    moment: {
      id: "stalemate-friendship-and-varunas-absent-court",
      decisiveChange: {
        en: "The campaign exposes conquest as a mixture of stalemate, alliance, family loss, spectacle, and victories claimed in a ruler's absence.",
        hi: "अभियान दिखाता है कि विजय वास्तव में गतिरोध, गठबंधन, पारिवारिक हानि, तमाशे और अनुपस्थित शासक के नाम पर घोषित जीतों का मिश्रण है।",
      },
      beats: [
        {
          id: "bhogavati-opens-the-underworld-road",
          title: { en: "Bhogavati opens the underworld road", hi: "भोगवती पाताल का मार्ग खोलती है" },
          narration: {
            en: "After leaving Yama's realm, Ravana takes Pushpaka into the watery regions. He enters Bhogavati, Vasuki's serpent city, forces its inhabitants into submission, and then searches deeper for the fortified city of the Nivatakavachas.",
            hi: "यमलोक से निकलकर रावण पुष्पक को जलमय क्षेत्रों में ले जाता है। वह वासुकि की नाग-नगरी भोगवती में प्रवेश करके वहाँ के निवासियों को अधीन करता है और फिर निवातकवचों की सुरक्षित नगरी खोजते हुए और भीतर बढ़ता है।",
          },
          visualCue: "Follow the route from the watery entrance of Bhogavati into a deeper fortified city.",
          characterIds: ["ravana", "vasuki", "serpent-communities", "nivatakavachas"],
        },
        {
          id: "one-year-produces-no-winner",
          title: { en: "One year produces no winner", hi: "एक वर्ष बाद भी कोई विजेता नहीं" },
          narration: {
            en: "The Nivatakavachas meet Ravana's forces with weapons and equal confidence. Rakshasas and Danavas fight for an entire year, yet neither side can defeat the other. The long duration matters: Ravana's protection does not turn every opponent into an easy trophy.",
            hi: "निवातकवच रावण की सेना का सामना समान आत्मविश्वास और अस्त्रों से करते हैं। राक्षस और दानव पूरे एक वर्ष तक लड़ते हैं, फिर भी कोई पक्ष दूसरे को हरा नहीं पाता। यह लंबी अवधि महत्वपूर्ण है—रावण का वर हर प्रतिद्वंद्वी को आसान पुरस्कार नहीं बनाता।",
          },
          visualCue: "Let a full cycle of seasons pass around two armies still locked at the same boundary.",
          characterIds: ["ravana", "nivatakavachas", "ravana-army"],
        },
        {
          id: "brahma-turns-the-draw-into-alliance",
          title: { en: "Brahma turns the draw into an alliance", hi: "ब्रह्मा अनिर्णीत युद्ध को गठबंधन में बदलते हैं" },
          narration: {
            en: "Brahma stops the deadlock because neither protected side can destroy the other. He urges them to make friendship instead. Ravana and the Nivatakavachas seal the agreement before fire, and Ravana spends a year among them learning many forms of illusion.",
            hi: "ब्रह्मा गतिरोध रोकते हैं क्योंकि वरों से सुरक्षित दोनों पक्ष एक-दूसरे को नष्ट नहीं कर सकते। वे उन्हें मित्रता करने को कहते हैं। रावण और निवातकवच अग्नि के सामने समझौता करते हैं, और रावण उनके बीच एक वर्ष रहकर अनेक मायावी विधियाँ सीखता है।",
          },
          visualCue: "Replace the battle line with an oath before fire, then open a year of exchanged knowledge behind it.",
          characterIds: ["brahma", "ravana", "nivatakavachas"],
        },
        {
          id: "the-next-victory-kills-a-brother-in-law",
          title: { en: "The next victory kills Ravana's brother-in-law", hi: "अगली विजय रावण के बहनोई की जान लेती है" },
          narration: {
            en: "The alliance does not end Ravana's aggression. In Ashma city he attacks the Kalakeyas and, amid the fighting, kills Vidyujjihva—the husband of his sister Surpanakha. Four hundred fighters die as well. The conquest has already crossed into his own family, although Surpanakha will confront him only after he returns.",
            hi: "गठबंधन रावण की आक्रामकता समाप्त नहीं करता। अश्म नगरी में वह कालकेयों पर चढ़ाई करता है और युद्ध के बीच अपनी बहन शूर्पणखा के पति विद्युत्जिह्व को भी मार देता है। चार सौ योद्धा और मारे जाते हैं। विजय अब उसके अपने परिवार को चोट पहुँचा चुकी है, यद्यपि शूर्पणखा लौटने पर उससे सामना करेगी।",
          },
          visualCue: "Connect the battlefield casualty directly to Surpanakha's family line instead of hiding it in a victory count.",
          characterIds: ["ravana", "vidyujjihva", "surpanakha", "kalakeyas"],
        },
        {
          id: "surabhi-stands-before-varunas-palace",
          title: { en: "Surabhi stands before Varuna's palace", hi: "वरुण के महल से पहले सुरभि मिलती हैं" },
          narration: {
            en: "Near Varuna's brilliant palace, Ravana encounters Surabhi, the wondrous cow whom the account connects with the ocean of milk, the moon, nourishment, and ambrosia. He circles her before entering the guarded palace. The pause places a sustaining cosmic presence in the middle of his military route.",
            hi: "वरुण के उज्ज्वल महल के पास रावण सुरभि से मिलता है—उस अद्भुत गौ से जिसे यह कथा क्षीर-सागर, चंद्रमा, पोषण और अमृत से जोड़ती है। वह उनकी परिक्रमा करके सुरक्षित महल में प्रवेश करता है। यह ठहराव उसके सैन्य मार्ग के बीच एक पोषणकारी ब्रह्मांडीय उपस्थिति रखता है।",
          },
          visualCue: "Pause the armed route around Surabhi and the flowing milk-world before the palace gates reopen.",
          characterIds: ["ravana", "surabhi", "moon", "varuna"],
        },
        {
          id: "varunas-descendants-defend-the-house",
          title: { en: "Varuna's descendants defend the house", hi: "वरुण के वंशज महल की रक्षा करते हैं" },
          narration: {
            en: "Ravana kills guards and demands that Varuna either fight or admit defeat. Varuna's sons and grandsons answer in the king's absence. They press Ravana hard in an aerial battle, Mahodara brings them down, and they rise again by their own power before Ravana's attack finally scatters their followers.",
            hi: "रावण रक्षकों को मारकर माँग करता है कि वरुण या तो युद्ध करें या हार मानें। राजा की अनुपस्थिति में वरुण के पुत्र और पौत्र उत्तर देते हैं। आकाश-युद्ध में वे रावण को दबाते हैं, महोदर उन्हें नीचे गिराता है और वे अपनी शक्ति से फिर उठते हैं; अंततः रावण का प्रहार उनके साथियों को बिखेर देता है।",
          },
          visualCue: "Keep the aerial battle reversible until the defenders' followers finally break away.",
          characterIds: ["ravana", "varuna-sons", "varuna-grandsons", "mahodara", "prahasta"],
        },
        {
          id: "an-absent-king-becomes-a-victory-claim",
          title: { en: "An absent king becomes a victory claim", hi: "अनुपस्थित राजा के नाम पर विजय घोषित होती है" },
          narration: {
            en: "Prahasta reports that Varuna is away in Brahma's region and cannot receive the challenge. Ravana leaves proclaiming his name after defeating the available defenders. The episode records a military success, but not the direct submission or defeat of Varuna that Ravana originally demanded.",
            hi: "प्रहस्त बताते हैं कि वरुण ब्रह्मलोक गए हैं और चुनौती स्वीकार करने के लिए उपस्थित नहीं हैं। उपलब्ध रक्षकों को हराकर रावण अपना नाम घोषित करता हुआ लौटता है। प्रसंग सैन्य सफलता तो दर्ज करता है, पर वह वरुण की प्रत्यक्ष पराजय या समर्पण नहीं है जिसकी रावण ने माँग की थी।",
          },
          visualCue: "Leave Varuna's seat visibly empty while Ravana's victory proclamation travels away from it.",
          characterIds: ["ravana", "prahasta", "varuna", "varuna-sons"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "bali-shows-ravana-the-weight-of-time",
    turnId: "origins-behind-war",
    detailOrdinal: 10,
    title: { en: "Bali shows Ravana the weight of time", hi: "बलि रावण को काल का भार दिखाते हैं" },
    synopsis: {
      en: "Ravana offers to free Bali, but Bali identifies the guardian who bound him, tells how older invincible rulers fell, and lets one ancestral ornament expose the limits of Ravana's strength.",
      hi: "रावण बलि को मुक्त करने का प्रस्ताव देता है, पर बलि उस रक्षक की पहचान बताते हैं जिसने उन्हें बाँधा, पुराने अजेय शासकों के पतन की कथा सुनाते हैं और एक पुराना आभूषण रावण की शक्ति की सीमा दिखा देता है।",
    },
    sourceStart: 24,
    sourceEnd: 24,
    sourceGlobalOrdinal: 24,
    spanSha256s: ["19391b3613042453360c312fbf78aacf0fc84535dd90df2c691a0cb4a4eff847"],
    nodeIds: [...commonNodes, "bali", "vishnu", "narasimha", "hiranyakashipu", "time"],
    places: ["Bali's many-chambered house", "Bali's hall", "Gateway guarded by Hari"],
    moment: {
      id: "bali-shows-ravana-the-weight-of-time",
      decisiveChange: {
        en: "Ravana enters as a rescuer and challenger but leaves after learning that greater conquerors also became subject to time and a power beyond them.",
        hi: "रावण उद्धारकर्ता और चुनौती देने वाला बनकर प्रवेश करता है, पर यह जानकर निकलता है कि उससे बड़े विजेता भी काल और अपने से बड़ी शक्ति के अधीन हुए।",
      },
      beats: [
        {
          id: "prahasta-finds-fire-and-a-guardian",
          title: { en: "Prahasta finds fire and a terrifying guardian", hi: "प्रहस्त अग्नि और भयानक द्वारपाल देखते हैं" },
          narration: {
            en: "In a magnificent, apparently empty house, Prahasta passes through seven chambers and finds blazing figures he can barely face. Ravana enters for himself and meets a mace-bearing guardian who asks whether he truly wants to fight Bali.",
            hi: "एक भव्य पर सूने दिखते भवन में प्रहस्त सात कक्ष पार करके अग्नि-जैसी आकृतियाँ देखते हैं जिनका सामना करना कठिन है। रावण स्वयं भीतर जाता है और गदा-धारी द्वारपाल से मिलता है, जो पूछता है कि क्या वह सचमुच बलि से लड़ना चाहता है।",
          },
          visualCue: "Use the seven empty chambers to slow the boast before the guardian finally blocks the door.",
          characterIds: ["prahasta", "ravana", "hari-guardian", "bali"],
        },
        {
          id: "bali-receives-the-challenger-with-laughter",
          title: { en: "Bali receives the challenger with laughter", hi: "बलि चुनौती देने वाले का हँसकर स्वागत करते हैं" },
          narration: {
            en: "Bali does not treat Ravana's arrival as an emergency. He laughs, draws the visitor close, and asks what he wants. Ravana says he has heard Vishnu bound Bali and offers to release him, assuming that another ruler's captivity is a problem his own strength can solve.",
            hi: "बलि रावण के आगमन को संकट नहीं मानते। वे हँसते हैं, अतिथि को पास बैठाते हैं और उसका उद्देश्य पूछते हैं। रावण कहता है कि उसने सुना है विष्णु ने बलि को बाँधा था और वह उन्हें मुक्त कर सकता है—मानो दूसरे शासक की कैद उसकी शक्ति से सुलझने वाली समस्या हो।",
          },
          visualCue: "Keep Bali relaxed and seated while Ravana performs the role of an unnecessary rescuer.",
          characterIds: ["bali", "ravana", "vishnu"],
        },
        {
          id: "bali-names-the-power-at-the-door",
          title: { en: "Bali names the power at the door", hi: "बलि द्वार पर खड़ी शक्ति का नाम बताते हैं" },
          narration: {
            en: "Bali explains that the guardian is Hari—the creator, preserver, destroyer, and time before whom generations of mighty Danavas have fallen. His long account makes one point repeatedly: learning, austerity, wealth, rule, and battlefield success did not make earlier powers permanent.",
            hi: "बलि बताते हैं कि द्वारपाल हरि हैं—सृष्टि के कर्ता, पालक, संहारक और काल, जिनके सामने शक्तिशाली दानवों की पीढ़ियाँ गिर चुकी हैं। उनका विस्तृत कथन एक बात दोहराता है: ज्ञान, तप, धन, शासन और युद्ध की सफलता ने पुराने महाबलियों को स्थायी नहीं बनाया।",
          },
          visualCue: "Let the names of fallen rulers recede behind the quiet guardian rather than becoming a triumphal list.",
          characterIds: ["bali", "ravana", "hari-guardian", "fallen-danava-rulers", "time"],
        },
        {
          id: "an-ornament-drops-ravana-to-the-floor",
          title: { en: "An old ornament drops Ravana to the floor", hi: "एक पुराना आभूषण रावण को धरती पर गिरा देता है" },
          narration: {
            en: "Bali asks Ravana to lift a shining object. Ravana can barely move it; when he finally raises it, he collapses bleeding. Bali reveals that it is only one earring once worn by Hiranyakashipu, whose protections still failed when Narasimha found a way through them.",
            hi: "बलि रावण से एक चमकता आभूषण उठाने को कहते हैं। रावण उसे मुश्किल से हिला पाता है; उठाते ही रक्त से भीगा गिर पड़ता है। बलि बताते हैं कि यह हिरण्यकशिपु का केवल एक कुण्डल है—उस शासक की सुरक्षा भी तब विफल हुई जब नरसिंह ने उसके वर की सीमाओं के बीच मार्ग निकाला।",
          },
          visualCue: "Make the single fallen earring outweigh the armed conqueror and open a memory of Narasimha behind it.",
          characterIds: ["bali", "ravana", "hiranyakashipu", "narasimha", "prahlada"],
        },
        {
          id: "hari-withdraws-ravana-misreads-the-exit",
          title: { en: "Hari withdraws; Ravana misreads the exit", hi: "हरि हट जाते हैं; रावण बाहर निकलने को जीत समझता है" },
          narration: {
            en: "Ravana recovers and reaches for confrontation again. Hari chooses not to kill him because Brahma's boon still governs the moment, then disappears. Unable to find the guardian, Ravana leaves shouting in satisfaction, although Bali's lesson and the unliftable relic have contradicted his claim of mastery.",
            hi: "रावण सँभलकर फिर टकराव चाहता है। ब्रह्मा का वर अभी प्रभावी होने के कारण हरि उसे न मारने का निर्णय लेकर अदृश्य हो जाते हैं। द्वारपाल न मिलने पर रावण प्रसन्न होकर बाहर आता है, जबकि बलि की शिक्षा और न उठ पाने वाला अवशेष उसके सर्वशक्तिमान होने के दावे को झुठला चुके हैं।",
          },
          visualCue: "Let Ravana's victory shout echo through the same chambers that have just disproved it.",
          characterIds: ["ravana", "hari-guardian", "bali", "brahma"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "the-sun-refuses-ravanas-forced-choice",
    turnId: "origins-behind-war",
    detailOrdinal: 11,
    title: { en: "The Sun refuses Ravana's forced choice", hi: "सूर्य रावण की थोपी हुई शर्त नहीं मानते" },
    synopsis: {
      en: "At the solar realm, Ravana demands either battle or surrender; the Sun leaves the response to his gatekeeper, and Ravana turns an unanswered ultimatum into a victory announcement.",
      hi: "सूर्यलोक में रावण युद्ध या समर्पण की माँग रखता है; सूर्य उत्तर अपने द्वारपाल पर छोड़ देते हैं और रावण इस अनुत्तरित धमकी को विजय-घोषणा में बदल देता है।",
    },
    sourceStart: 25,
    sourceEnd: 25,
    sourceGlobalOrdinal: 25,
    spanSha256s: ["086a11a82a9c557523c90bfbd5fa4a66afc631949d71db22bdac278ce2aef096"],
    nodeIds: [...commonNodes, "surya", "dandi", "pingala", "meru"],
    places: ["Mount Meru", "Region of the Sun", "Solar gateway"],
    moment: {
      id: "the-sun-refuses-ravanas-forced-choice",
      decisiveChange: {
        en: "No battle and no surrender occur, yet Ravana's campaign records the encounter as victory.",
        hi: "न युद्ध होता है, न समर्पण; फिर भी रावण का अभियान इस मुठभेड़ को विजय के रूप में दर्ज कर लेता है।",
      },
      beats: [
        {
          id: "pushpaka-climbs-from-meru-to-sun",
          title: { en: "Pushpaka climbs from Meru toward the Sun", hi: "पुष्पक मेरु से सूर्य की ओर चढ़ता है" },
          narration: {
            en: "After spending the night on Mount Meru, Ravana turns Pushpaka toward the radiant Sun. Even he and his messenger are overwhelmed by the intensity of the rays as they approach the solar gateway.",
            hi: "मेरु पर्वत पर रात बिताने के बाद रावण पुष्पक को तेजस्वी सूर्य की ओर मोड़ता है। सूर्य-द्वार के पास पहुँचते हुए उसकी किरणों की तीव्रता रावण और उसके दूत दोनों को दबा देती है।",
          },
          visualCue: "Let increasing radiance slow Pushpaka before the guarded threshold.",
          characterIds: ["ravana", "prahasta", "surya"],
        },
        {
          id: "prahasta-delivers-a-two-option-ultimatum",
          title: { en: "Prahasta delivers a two-option ultimatum", hi: "प्रहस्त दो विकल्पों की धमकी पहुँचाते हैं" },
          narration: {
            en: "Ravana sends Prahasta with only two permitted answers: Surya must fight or say he has been defeated. At the gate, Pingala and Dandi receive a demand built to erase every response except combat or humiliation.",
            hi: "रावण प्रहस्त को केवल दो स्वीकार्य उत्तर देकर भेजता है: सूर्य युद्ध करें या कहें कि वे हार गए। द्वार पर पिंगल और दण्डी ऐसी माँग सुनते हैं जो संघर्ष और अपमान के अलावा हर उत्तर मिटा देना चाहती है।",
          },
          visualCue: "Hold the forced two-way choice at the gate instead of carrying it automatically into the solar court.",
          characterIds: ["ravana", "prahasta", "pingala", "dandi", "surya"],
        },
        {
          id: "surya-returns-the-decision-to-dandi",
          title: { en: "Surya returns the decision to Dandi", hi: "सूर्य निर्णय दण्डी पर छोड़ देते हैं" },
          narration: {
            en: "Dandi reports the challenge. Surya does not repeat either answer Ravana demanded; he tells the gatekeeper to defeat Ravana or report defeat as Dandi judges fit. The reply refuses to let the challenger control the meaning of the encounter.",
            hi: "दण्डी चुनौती सुनाते हैं। सूर्य रावण द्वारा माँगा गया कोई उत्तर नहीं दोहराते; वे द्वारपाल से कहते हैं कि जैसा उचित समझें वैसा करें—रावण को हराएँ या हार का संदेश दें। यह उत्तर चुनौती देने वाले को मुठभेड़ का अर्थ नियंत्रित नहीं करने देता।",
          },
          visualCue: "Keep Surya at his work while the decision returns to the guardian at the threshold.",
          characterIds: ["surya", "dandi", "ravana"],
        },
        {
          id: "ravana-declares-the-victory-he-wanted",
          title: { en: "Ravana declares the victory he wanted", hi: "रावण मनचाही विजय घोषित कर देता है" },
          narration: {
            en: "Dandi conveys Surya's words, and Ravana immediately trumpets victory and departs. No duel has been won and Surya has not personally submitted. The episode shows how Ravana's reputation grows partly through the stories he tells about ambiguous encounters.",
            hi: "दण्डी सूर्य के शब्द बताते हैं और रावण तुरंत विजय घोषित करके चला जाता है। न कोई द्वंद्व जीता गया, न सूर्य ने स्वयं समर्पण किया। यह प्रसंग दिखाता है कि रावण की प्रतिष्ठा कुछ हद तक अस्पष्ट मुठभेड़ों के बारे में उसकी अपनी घोषणाओं से बढ़ती है।",
          },
          visualCue: "Send Ravana's loud proclamation away from a solar gateway that never opened for battle.",
          characterIds: ["ravana", "dandi", "surya", "prahasta"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "mandhata-meets-ravana-between-worlds",
    turnId: "origins-behind-war",
    detailOrdinal: 12,
    title: { en: "Mandhata meets Ravana between worlds", hi: "मान्धाता लोकों के बीच रावण से भिड़ते हैं" },
    synopsis: {
      en: "A sage explains the different roads by which generous rulers and fallen warriors reach blessed worlds, then directs battle-seeking Ravana to Mandhata, whose human strength brings their duel to the edge of cosmic disaster.",
      hi: "एक ऋषि बताते हैं कि दानी राजा और युद्ध में मरे वीर अलग मार्गों से पुण्यलोक पहुँचते हैं, फिर युद्ध खोजते रावण को मान्धाता की ओर भेजते हैं—जिनकी मानवीय शक्ति उनके द्वंद्व को ब्रह्मांडीय संकट की सीमा तक ले जाती है।",
    },
    sourceStart: 26,
    sourceEnd: 26,
    sourceGlobalOrdinal: 26,
    spanSha256s: ["a10a65c398a3eb6a516fe2c06aff55d16588426d6274eb1eb306626091b24e40"],
    nodeIds: [...commonNodes, "parvata", "mandhata", "pulastya", "galava", "ayodhya"],
    places: ["Road toward the lunar region", "Passage of the honoured dead", "Aerial battlefield"],
    moment: {
      id: "mandhata-meets-ravana-between-worlds",
      decisiveChange: {
        en: "Ravana's search for a worthy opponent finds a human king who can match him until two sages stop weapons capable of terrifying every world.",
        hi: "योग्य प्रतिद्वंद्वी की खोज में रावण को एक मानव राजा मिलता है जो उसका सामना कर सकता है, जब तक दो ऋषि समस्त लोकों को भयभीत करने वाले अस्त्र रुकवा नहीं देते।",
      },
      beats: [
        {
          id: "ravana-sees-travellers-to-blessed-worlds",
          title: { en: "Ravana sees travellers bound for blessed worlds", hi: "रावण पुण्यलोक जाते यात्रियों को देखता है" },
          narration: {
            en: "On the road toward the Moon, Ravana sees radiant people travelling in splendid vehicles with music and companions. Curious but contemptuous, he asks the sage Parvata who they are and why they show no fear of him.",
            hi: "चंद्रलोक की राह पर रावण तेजस्वी लोगों को संगीत, साथियों और भव्य वाहनों के साथ जाते देखता है। जिज्ञासा के साथ तिरस्कार मिलाकर वह ऋषि पर्वत से पूछता है कि ये कौन हैं और उससे भयभीत क्यों नहीं हैं।",
          },
          visualCue: "Let multiple peaceful routes cross Ravana's single battle-seeking path.",
          characterIds: ["ravana", "parvata", "travellers-to-blessed-worlds"],
        },
        {
          id: "parvata-explains-several-kinds-of-merit",
          title: { en: "Parvata explains several kinds of merit", hi: "पर्वत अनेक प्रकार के पुण्य समझाते हैं" },
          narration: {
            en: "Parvata identifies people whose destinations follow from generosity, disciplined living, loyal service, or death in battle. The passage belongs to the epic's moral world; its immediate story function is to show Ravana lives among values he cannot reduce to victory over an opponent.",
            hi: "पर्वत उन लोगों की पहचान बताते हैं जिनकी मंजिल दान, अनुशासित जीवन, निष्ठापूर्ण सेवा या युद्ध में मृत्यु से जुड़ी है। यह वर्णन महाकाव्य के नैतिक संसार का हिस्सा है; कथा में इसका काम दिखाना है कि रावण ऐसे मूल्यों के बीच है जिन्हें वह किसी प्रतिद्वंद्वी पर जीत में नहीं बदल सकता।",
          },
          visualCue: "Branch the travellers by the lives they led, not by Ravana's ranking of their fighting value.",
          characterIds: ["parvata", "ravana", "generous-rulers", "fallen-warriors"],
        },
        {
          id: "ravana-asks-only-who-will-fight",
          title: { en: "Ravana asks only who will fight", hi: "रावण केवल पूछता है—लड़ेगा कौन" },
          narration: {
            en: "Ravana ignores the larger lesson and asks which traveller will give him battle. Parvata says these people seek blessed worlds, not another fight, but names Mandhata—the celebrated ruler of seven islands and a king of Ayodhya—as someone capable of answering him.",
            hi: "रावण व्यापक अर्थ को अनदेखा करके पूछता है कि इनमें कौन उससे युद्ध करेगा। पर्वत कहते हैं कि ये लोग पुण्यलोक चाहते हैं, नई लड़ाई नहीं; फिर वे सात द्वीपों के प्रसिद्ध शासक और अयोध्या के राजा मान्धाता का नाम लेते हैं, जो उसका सामना कर सकते हैं।",
          },
          visualCue: "Close the peaceful routes and reveal Mandhata approaching on a separate royal path.",
          characterIds: ["ravana", "parvata", "mandhata"],
        },
        {
          id: "mandhata-breaks-the-demon-formation",
          title: { en: "Mandhata breaks the demon formation", hi: "मान्धाता राक्षस-व्यूह तोड़ देते हैं" },
          narration: {
            en: "Ravana dismisses Mandhata as merely human and orders his ministers forward. Mandhata cuts down their arrows, scatters the Rakshasa host, and strikes Ravana's chariot so hard that the king of Lanka loses consciousness. Ravana recovers and knocks Mandhata down in turn.",
            hi: "रावण मान्धाता को केवल मनुष्य कहकर तुच्छ समझता है और मंत्रियों को आगे करता है। मान्धाता उनके बाण काटते, राक्षस-सेना बिखेरते और रावण के रथ पर ऐसा प्रहार करते हैं कि लंका का राजा अचेत हो जाता है। सँभलकर रावण भी मान्धाता को गिरा देता है।",
          },
          visualCue: "Reverse the advantage twice so neither army can convert the first collapse into a final victory.",
          characterIds: ["mandhata", "ravana", "prahasta", "mahodara", "ravana-army"],
        },
        {
          id: "weapons-make-three-worlds-tremble",
          title: { en: "Their weapons make the three worlds tremble", hi: "उनके अस्त्र तीनों लोकों को कंपा देते हैं" },
          narration: {
            en: "The two leaders recover and exchange increasingly destructive weapons. When Ravana prepares the Pashupata weapon and Mandhata answers with weapons of his own, animals, deities, and serpents across the three worlds are terrified. Their private contest has become a danger to everyone else.",
            hi: "दोनों शासक सँभलकर लगातार अधिक विनाशकारी अस्त्र चलाते हैं। जब रावण पाशुपत अस्त्र उठाता है और मान्धाता भी प्रत्युत्तर देते हैं, तब तीनों लोकों के जीव, देवता और नाग भयभीत हो जाते हैं। उनका निजी द्वंद्व सबके लिए संकट बन जाता है।",
          },
          visualCue: "Expand the threatened field far beyond the two combatants to every community affected by their escalation.",
          characterIds: ["ravana", "mandhata", "three-worlds", "living-beings"],
        },
        {
          id: "pulastya-and-galava-stop-the-duel",
          title: { en: "Pulastya and Galava stop the duel", hi: "पुलस्त्य और गालव द्वंद्व रोकते हैं" },
          narration: {
            en: "The sages Pulastya and Galava perceive the danger and intervene. They restrain both rulers, reconcile them, and send them away by separate routes. Mandhata is neither conquered nor absorbed; human courage has forced Ravana into another unfinished encounter.",
            hi: "ऋषि पुलस्त्य और गालव संकट देखकर हस्तक्षेप करते हैं। वे दोनों शासकों को रोकते, मेल कराते और अलग मार्गों से वापस भेजते हैं। मान्धाता न पराजित होते हैं, न अधीन; मानवीय साहस रावण को एक और अनिर्णीत मुठभेड़ में रोक देता है।",
          },
          visualCue: "Separate the two weapon paths under the sages' intervention and return each ruler to his own road.",
          characterIds: ["pulastya", "galava", "ravana", "mandhata"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "the-moon-stops-the-climb-with-cold",
    turnId: "origins-behind-war",
    detailOrdinal: 13,
    title: { en: "The Moon stops the climb with cold", hi: "चंद्रमा शीत से चढ़ाई रोक देते हैं" },
    synopsis: {
      en: "Ravana climbs through layered skies to the Moon, whose cold rays break his army's advance; Brahma prevents another attack and gives Ravana a protective recitation instead.",
      hi: "रावण आकाश के अनेक स्तर पार करके चंद्रमा तक पहुँचता है, जिनकी शीत किरणें उसकी सेना की चढ़ाई तोड़ देती हैं; ब्रह्मा नया आक्रमण रोककर रावण को एक रक्षात्मक स्तुति देते हैं।",
    },
    sourceStart: 27,
    sourceEnd: 27,
    sourceGlobalOrdinal: 27,
    spanSha256s: ["53f7cfaccf12d75fca10a743f44bc0678b2de5744cfe28a161c1ac1b0200d0ea"],
    nodeIds: [...commonNodes, "moon", "brahma", "garuda", "seven-sages", "celestial-ganga"],
    places: ["Layered aerial regions", "Celestial Ganga", "Region of the Moon"],
    moment: {
      id: "the-moon-stops-the-climb-with-cold",
      decisiveChange: {
        en: "The environment defeats the army's movement, and Brahma turns Ravana away before his anger can become another cosmic attack.",
        hi: "प्रकृति स्वयं सेना की गति रोक देती है और ब्रह्मा रावण के क्रोध को नया ब्रह्मांडीय आक्रमण बनने से पहले मोड़ देते हैं।",
      },
      beats: [
        {
          id: "pushpaka-climbs-through-eight-skies",
          title: { en: "Pushpaka climbs through eight skies", hi: "पुष्पक आठ आकाश-स्तरों से चढ़ता है" },
          narration: {
            en: "After leaving Mandhata, Ravana climbs through a succession of aerial regions. The account places birds, clouds, Siddhas, spirits, the elephants associated with rain, Garuda, the seven sages, and the celestial Ganga on different levels of this immense vertical world.",
            hi: "मान्धाता से अलग होने के बाद रावण आकाश के क्रमिक स्तरों में चढ़ता है। कथा पक्षियों, मेघों, सिद्धों, आत्मिक प्राणियों, वर्षा से जुड़े हाथियों, गरुड़, सप्तऋषियों और आकाशगंगा को इस विशाल ऊर्ध्व संसार के अलग-अलग स्तरों पर रखती है।",
          },
          visualCue: "Make the ascent a sequence of inhabited worlds rather than empty distance.",
          characterIds: ["ravana", "garuda", "seven-sages", "celestial-beings"],
        },
        {
          id: "the-moon-lights-and-sustains-the-worlds",
          title: { en: "The Moon lights and sustains the worlds", hi: "चंद्रमा लोकों को प्रकाश और शीतलता देते हैं" },
          narration: {
            en: "At the summit Ravana finds the Moon surrounded by stars and planets, sending countless rays across the worlds. This is not an empty military height: the Moon's presence lights and comforts living beings before Ravana turns it into another target.",
            hi: "शिखर पर रावण तारों और ग्रहों से घिरे चंद्रमा को देखता है, जिनकी असंख्य किरणें लोकों में फैलती हैं। यह खाली सैन्य ऊँचाई नहीं है—रावण के इसे लक्ष्य बनाने से पहले चंद्रमा की उपस्थिति जीवों को प्रकाश और शीतलता देती है।",
          },
          visualCue: "Hold the Moon's sustaining connections to many worlds before Ravana's route enters the frame.",
          characterIds: ["moon", "ravana", "stars", "living-beings"],
        },
        {
          id: "cold-rays-break-the-rakshasa-advance",
          title: { en: "Cold rays break the Rakshasa advance", hi: "शीत किरणें राक्षसों की चढ़ाई तोड़ देती हैं" },
          narration: {
            en: "The Moon's rays become unbearable cold for Ravana's followers. Prahasta warns that the army is being destroyed and must withdraw. Ravana responds by raising his bow and shooting upward rather than accepting the physical limit his own people have reached.",
            hi: "चंद्रमा की किरणें रावण के साथियों के लिए असह्य शीत बन जाती हैं। प्रहस्त चेताते हैं कि सेना नष्ट हो रही है और लौटना चाहिए। अपने लोगों की सीमा स्वीकार करने के बजाय रावण धनुष उठाकर ऊपर बाण चलाने लगता है।",
          },
          visualCue: "Show the army folding under cold while Ravana alone tries to turn weather into an opponent.",
          characterIds: ["moon", "ravana", "prahasta", "ravana-army"],
        },
        {
          id: "brahma-protects-the-moon",
          title: { en: "Brahma protects the Moon", hi: "ब्रह्मा चंद्रमा की रक्षा करते हैं" },
          narration: {
            en: "Brahma arrives and tells Ravana not to oppress the Moon, whose welfare supports all. The intervention again prevents Ravana's protected body and a cosmic power from being pushed into a contradiction through combat.",
            hi: "ब्रह्मा आकर रावण से कहते हैं कि वह चंद्रमा को पीड़ित न करे, जिनका कल्याण सबके हित से जुड़ा है। यह हस्तक्षेप फिर रावण के वर-सुरक्षित शरीर और एक ब्रह्मांडीय शक्ति को युद्ध के विरोधाभास में फँसने से रोकता है।",
          },
          visualCue: "Place Brahma between the upward arrows and the Moon's life-giving rays.",
          characterIds: ["brahma", "ravana", "moon"],
        },
        {
          id: "a-protective-recitation-replaces-the-battle",
          title: { en: "A protective recitation replaces the battle", hi: "युद्ध की जगह रक्षात्मक स्तुति दी जाती है" },
          narration: {
            en: "Instead of permitting battle, Brahma gives Ravana a long recitation of divine names to remember in mortal danger. The source preserves that prayer in detail. In this consumer story its role is the turning point: Ravana receives another protection and leaves, while the Moon remains unconquered.",
            hi: "युद्ध की अनुमति देने के बजाय ब्रह्मा रावण को संकट के समय स्मरण करने के लिए दिव्य नामों की लंबी स्तुति देते हैं। स्रोत उस प्रार्थना को विस्तार से सुरक्षित रखता है। इस उपभोक्ता कथा में उसका काम मोड़ दिखाना है—रावण को एक और रक्षा मिलती है और वह चला जाता है, जबकि चंद्रमा पर विजय नहीं होती।",
          },
          visualCue: "Close the attack route with a remembered recitation, keeping its full textual apparatus behind the source boundary.",
          characterIds: ["brahma", "ravana", "moon", "shiva"],
        },
      ],
    } satisfies StoryMoment,
  },
  {
    id: "the-western-island-reveals-a-cosmic-being",
    turnId: "origins-behind-war",
    detailOrdinal: 14,
    title: { en: "The western island reveals a cosmic being", hi: "पश्चिमी द्वीप पर विराट सत्ता प्रकट होती है" },
    synopsis: {
      en: "On a western-ocean island Ravana attacks a being who contains the worlds, follows him below ground, reaches toward Lakshmi, collapses under divine force, and still tries to make the encounter serve his legend.",
      hi: "पश्चिमी समुद्र के एक द्वीप पर रावण ऐसी सत्ता पर आक्रमण करता है जिसमें सारे लोक समाए हैं, उसके पीछे पाताल तक जाता है, लक्ष्मी को पकड़ना चाहता है, दैवी तेज से गिरता है और फिर भी मुठभेड़ को अपनी कीर्ति में बदलने की कोशिश करता है।",
    },
    sourceStart: 28,
    sourceEnd: 28,
    sourceGlobalOrdinal: 28,
    spanSha256s: ["298fd5333a407eb50597094bd8462703d580c5ee36fe14e677299a24924cc6e1"],
    nodeIds: [...commonNodes, "kapila", "lakshmi", "agastya", "rama", "cosmic-being"],
    places: ["Western Ocean", "Mahajambunada island", "Subterranean divine hall"],
    moment: {
      id: "the-western-island-reveals-a-cosmic-being",
      decisiveChange: {
        en: "Ravana sees that the worlds exist within a being he cannot defeat, but protection from immediate death still lets him leave without surrendering his pride.",
        hi: "रावण देखता है कि सारे लोक ऐसी सत्ता में स्थित हैं जिसे वह हरा नहीं सकता, पर तत्काल मृत्यु से सुरक्षा उसे अपना घमंड छोड़े बिना लौटने देती है।",
      },
      beats: [
        {
          id: "ravana-challenges-the-man-on-the-island",
          title: { en: "Ravana challenges the man on the island", hi: "रावण द्वीप के पुरुष को ललकारता है" },
          narration: {
            en: "Days after receiving Brahma's protection, Ravana reaches an island in the western ocean and finds a solitary, fire-bright being. He demands battle and attacks with his councillors. The stranger remains unmoved and says he will remove Ravana's hunger for combat.",
            hi: "ब्रह्मा से सुरक्षा पाने के कुछ दिन बाद रावण पश्चिमी समुद्र के एक द्वीप पर अग्नि-जैसी तेजस्वी, अकेली सत्ता देखता है। वह युद्ध माँगता है और मंत्रियों के साथ आक्रमण करता है। वह पुरुष अचल रहता है और कहता है कि वह रावण की लड़ाई की भूख मिटा देगा।",
          },
          visualCue: "Keep the solitary figure still while every weapon and roar fails to shift him.",
          characterIds: ["ravana", "kapila", "ravana-councillors"],
        },
        {
          id: "one-blow-drops-the-conqueror",
          title: { en: "One blow drops the conqueror", hi: "एक प्रहार विजेता को गिरा देता है" },
          narration: {
            en: "The narration describes the stranger's body as holding gods, oceans, mountains, seasons, knowledge, and time itself. He strikes Ravana once, and the king who has demanded surrender across many realms falls unconscious. The being then disappears beneath the earth.",
            hi: "कथा उस पुरुष के शरीर में देवताओं, समुद्रों, पर्वतों, ऋतुओं, ज्ञान और स्वयं काल को स्थित बताती है। वह एक बार प्रहार करता है और अनेक लोकों से समर्पण माँगने वाला राजा अचेत होकर गिर पड़ता है। फिर वह सत्ता धरती के नीचे चली जाती है।",
          },
          visualCue: "Let the cosmic correspondences expand from the stranger before a single blow ends the duel.",
          characterIds: ["kapila", "ravana", "cosmic-being", "three-worlds"],
        },
        {
          id: "ravana-follows-into-a-city-of-same-forms",
          title: { en: "Ravana follows into a city of matching forms", hi: "रावण समान रूपों की नगरी में पीछे जाता है" },
          narration: {
            en: "When he revives, Ravana follows through a cavern. Below ground he finds millions of radiant four-armed beings sharing the stranger's form and celebrating without fear. Even with Brahma's boon, the sight makes his hair rise and forces him back from their assembly.",
            hi: "होश आने पर रावण एक गुफा से नीचे उस सत्ता के पीछे जाता है। वहाँ उसे उसी रूप वाली असंख्य तेजस्वी, चार-भुजाओं वाली सत्ताएँ निर्भय उत्सव करती मिलती हैं। ब्रह्मा का वर होते हुए भी यह दृश्य उसे कंपा देता है और वह उनकी सभा से पीछे हटता है।",
          },
          visualCue: "Multiply the form beyond Ravana's ability to isolate a single opponent or throne.",
          characterIds: ["ravana", "four-armed-beings", "kapila"],
        },
        {
          id: "desire-crosses-another-boundary-near-lakshmi",
          title: { en: "Desire crosses another boundary near Lakshmi", hi: "लक्ष्मी के पास इच्छा फिर सीमा लाँघती है" },
          narration: {
            en: "Ravana enters another hall and sees a vast sleeping deity with Lakshmi seated nearby. He desires her and moves to seize her hand without consent. The sleeping being laughs; his energy burns Ravana and drops him to the ground before the violation can be completed.",
            hi: "रावण दूसरे कक्ष में एक विराट निद्रित देव और पास बैठी लक्ष्मी को देखता है। वह उनकी इच्छा या सहमति के बिना हाथ पकड़ने बढ़ता है। निद्रित सत्ता हँसती है; उसका तेज सीमा-उल्लंघन पूरा होने से पहले ही रावण को जलाकर धरती पर गिरा देता है।",
          },
          visualCue: "Stop Ravana's reaching hand before Lakshmi and make the violated boundary—not desire—control the scene.",
          characterIds: ["ravana", "lakshmi", "cosmic-being"],
        },
        {
          id: "the-boon-delays-death-not-defeat",
          title: { en: "The boon delays death, not defeat", hi: "वर मृत्यु टालता है, पराजय नहीं" },
          narration: {
            en: "The deity tells Ravana to rise: Brahma's boon protects him from dying now, not from being overpowered. Ravana first admits fear, then retreats into the claim that no one can defeat him. He says death from this being alone would be glorious, converting another collapse into self-made legend.",
            hi: "देव रावण से उठने को कहते हैं: ब्रह्मा का वर उसे अभी मरने से बचाता है, पर परास्त होने से नहीं। रावण पहले भय स्वीकार करता है, फिर इसी दावे में लौटता है कि कोई उसे हरा नहीं सकता। वह कहता है कि केवल इसी सत्ता के हाथों मृत्यु गौरवपूर्ण होगी—एक और पतन को अपनी बनाई कीर्ति में बदलते हुए।",
          },
          visualCue: "Keep the physical defeat visible while Ravana rebuilds his invincibility story in words.",
          characterIds: ["cosmic-being", "ravana", "brahma"],
        },
        {
          id: "ravana-sees-the-worlds-within",
          title: { en: "Ravana sees the worlds within", hi: "रावण भीतर समाए लोक देखता है" },
          narration: {
            en: "Within the being, Ravana sees deities, ancestors, mountains, rivers, planets, knowledge, ascetics, serpents, Yakshas, Danavas, and Rakshasas. Back in the frame of Rama listening to Agastya, the sage identifies the island figure as Kapila and explains that Ravana survived because Kapila did not turn an angry gaze upon him.",
            hi: "उस सत्ता के भीतर रावण देवताओं, पितरों, पर्वतों, नदियों, ग्रहों, ज्ञान, तपस्वियों, नागों, यक्षों, दानवों और राक्षसों को देखता है। राम और अगस्त्य के वर्तमान संवाद में ऋषि द्वीप की सत्ता को कपिल बताते हैं और समझाते हैं कि रावण इसलिए बचा क्योंकि कपिल ने उस पर क्रोधपूर्ण दृष्टि नहीं डाली।",
          },
          visualCue: "Open the whole remembered cosmos inside the being, then return to Rama and Agastya naming what Ravana saw.",
          characterIds: ["ravana", "kapila", "agastya", "rama", "three-worlds"],
        },
      ],
    } satisfies StoryMoment,
  },
];
