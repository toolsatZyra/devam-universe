import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

/** Complete consumer scenes for Balakanda 18-30 in the selected Dutt expression. */
export const RAMAYANA_PRINCES_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "four-princes-grow-together",
    nodeIds: ["rama", "bharata", "lakshmana", "shatrughna", "dasharatha", "ayodhya"],
    moment: {
      id: "four-princes-grow-together",
      decisiveChange: {
        en: "Four long-awaited sons enter one household, then grow into two especially close brother-pairs with distinct loyalties.",
        hi: "लंबे समय से प्रतीक्षित चार पुत्र एक परिवार में जन्म लेते हैं और बड़े होकर दो विशेष रूप से निकट भाई-युगलों में बँधते हैं।",
      },
      beats: [
        {
          id: "seasons-end-in-four-births",
          title: { en: "The waiting ends across three chambers", hi: "तीन कक्षों में लंबी प्रतीक्षा समाप्त होती है" },
          narration: {
            en: "After the rite, six seasons pass before the births. Kausalya gives birth to Rama, Kaikeyi to Bharata, and Sumitra to Lakshmana and Shatrughna. The selected source surrounds the moment with auspicious celestial timing, but the emotional centre is a household finally receiving four children.",
            hi: "अनुष्ठान के बाद छह ऋतुएँ बीतती हैं। कौसल्या राम को, कैकेयी भरत को और सुमित्रा लक्ष्मण तथा शत्रुघ्न को जन्म देती हैं। चुना हुआ स्रोत इस क्षण को शुभ आकाशीय समय से घेरता है, पर भावनात्मक केंद्र वह परिवार है जिसे अंततः चार बच्चे मिलते हैं।",
          },
          visualCue: "Four pulses of light answer one another across three palace chambers while Ayodhya's streets awaken into celebration.",
          characterIds: ["kausalya", "kaikeyi", "sumitra", "rama", "bharata", "lakshmana", "shatrughna"],
        },
        {
          id: "ayodhya-celebrates-and-names",
          title: { en: "The city celebrates before the children are named", hi: "नामकरण से पहले पूरा नगर उत्सव मनाता है" },
          narration: {
            en: "Music, gifts, food, and public joy spread through Ayodhya. On the appointed day Vasishta names Rama, Bharata, Lakshmana, and Shatrughna. The names distinguish the four boys, while the shared celebration presents their arrival as a civic event as well as a family one.",
            hi: "संगीत, दान, भोजन और सार्वजनिक आनंद अयोध्या में फैलते हैं। नियत दिन वसिष्ठ राम, भरत, लक्ष्मण और शत्रुघ्न का नामकरण करते हैं। नाम चारों बालकों को अलग पहचान देते हैं, जबकि साझा उत्सव उनके आगमन को पारिवारिक ही नहीं, नागरिक घटना भी बनाता है।",
          },
          visualCue: "Festive streets flow into a quieter naming circle where each spoken name lights a separate path from the same family centre.",
          characterIds: ["vasishta", "dasharatha", "rama", "bharata", "lakshmana", "shatrughna"],
        },
        {
          id: "princes-learn-many-disciplines",
          title: { en: "Childhood becomes disciplined preparation", hi: "बाल्यकाल अनुशासित तैयारी में बदलता है" },
          narration: {
            en: "The princes grow through study, physical training, weapons practice, riding, public conduct, and attention to elders. Rama becomes especially admired, but the source keeps all four inside the same education. Their abilities develop through repeated work rather than arriving complete at birth.",
            hi: "राजकुमार अध्ययन, शारीरिक प्रशिक्षण, अस्त्र-अभ्यास, सवारी, सार्वजनिक आचरण और बड़ों के प्रति ध्यान के साथ बड़े होते हैं। राम विशेष रूप से प्रिय बनते हैं, पर स्रोत चारों को एक ही शिक्षा-व्यवस्था में रखता है। उनकी क्षमताएँ जन्म से पूर्ण नहीं, निरंतर अभ्यास से विकसित होती हैं।",
          },
          visualCue: "A seamless training ground cycles through books, bows, horses, debate, service, and play as the four children visibly grow.",
          characterIds: ["rama", "bharata", "lakshmana", "shatrughna", "vasishta"],
        },
        {
          id: "two-brother-pairs-form",
          title: { en: "Lakshmana follows Rama; Shatrughna follows Bharata", hi: "लक्ष्मण राम से और शत्रुघ्न भरत से गहराई से जुड़ते हैं" },
          narration: {
            en: "Lakshmana becomes so attached to Rama that food and rest feel incomplete without him; Shatrughna forms a similar bond with Bharata. These are not interchangeable companions. The two pairings create emotional routes that will later pull the family across exile, absence, governance, and war.",
            hi: "लक्ष्मण राम से इतने जुड़े रहते हैं कि उनके बिना भोजन और विश्राम भी अधूरा लगता है; शत्रुघ्न का ऐसा ही संबंध भरत से बनता है। ये साथी एक-दूसरे के स्थान पर रखे जा सकने वाले नहीं हैं। दोनों भाई-युगल आगे वनवास, दूरी, शासन और युद्ध में परिवार की भावनात्मक राह तय करेंगे।",
          },
          visualCue: "The four training paths resolve into two close-moving pairs, then reconnect at the centre of Dasharatha's household.",
          characterIds: ["rama", "lakshmana", "bharata", "shatrughna", "dasharatha"],
        },
      ],
    },
  },
  {
    id: "vishvamitra-asks-for-rama",
    nodeIds: ["vishvamitra", "dasharatha", "rama", "maricha", "subahu", "ayodhya"],
    moment: {
      id: "vishvamitra-asks-for-rama",
      decisiveChange: {
        en: "A celebrated visitor turns courtly hospitality into a demand that Dasharatha entrust young Rama to real danger.",
        hi: "सम्मानित अतिथि का आगमन राजकीय आतिथ्य को ऐसी माँग में बदल देता है जिसमें दशरथ को युवा राम को वास्तविक संकट के लिए सौंपना है।",
      },
      beats: [
        {
          id: "vishvamitra-enters-court",
          title: { en: "Ayodhya receives a formidable ascetic", hi: "अयोध्या एक प्रबल तपस्वी का स्वागत करती है" },
          narration: {
            en: "Vishvamitra arrives at Dasharatha's court and is welcomed with ritual respect, questions of wellbeing, and an open promise of assistance. Dasharatha speaks generously before knowing the request, placing his reputation for truth and hospitality inside the decision that follows.",
            hi: "विश्वामित्र दशरथ के दरबार में आते हैं और उनका विधिपूर्वक सम्मान, कुशल-प्रश्न तथा सहायता के खुले आश्वासन से स्वागत होता है। दशरथ माँग जानने से पहले उदार वचन देते हैं; आगे का निर्णय अब उनकी सत्यनिष्ठा और आतिथ्य की प्रतिष्ठा से जुड़ जाता है।",
          },
          visualCue: "The court's warm ceremonial geometry tightens around Vishvamitra as Dasharatha's broad promise becomes visibly consequential.",
          characterIds: ["vishvamitra", "dasharatha", "vasishta"],
        },
        {
          id: "sacrifice-is-under-attack",
          title: { en: "Maricha and Subahu repeatedly break the rite", hi: "मारीच और सुबाहु बार-बार अनुष्ठान भंग करते हैं" },
          narration: {
            en: "Vishvamitra explains that Maricha and Subahu can change form and shower blood and flesh onto the altar just as his sacrifice nears completion. Bound by his own discipline during the rite, he will not answer their violence with anger or a curse. He needs protection that can act while he remains committed to the vow.",
            hi: "विश्वामित्र बताते हैं कि मारीच और सुबाहु रूप बदलकर अनुष्ठान पूर्ण होने के समय वेदी पर रक्त और मांस बरसाते हैं। यज्ञ-व्रत के दौरान वे स्वयं क्रोध या शाप से उत्तर नहीं देंगे। उन्हें ऐसी रक्षा चाहिए जो उनके संकल्प में स्थिर रहते हुए बाहर से कार्य कर सके।",
          },
          visualCue: "A nearly completed altar is repeatedly overwhelmed by a dark aerial assault while Vishvamitra remains motionless inside the ritual boundary.",
          characterIds: ["vishvamitra", "maricha", "subahu"],
        },
        {
          id: "request-names-rama-alone",
          title: { en: "The requested protector is not Dasharatha's army", hi: "माँग दशरथ की सेना नहीं, राम की है" },
          narration: {
            en: "Vishvamitra asks for Rama for ten nights, insisting that the prince can defeat the attackers under his guidance. The precision shocks the court: an army, senior champion, or royal escort would leave the family hierarchy intact, but the request specifically removes the treasured young heir from palace protection.",
            hi: "विश्वामित्र दस रातों के लिए राम को माँगते हैं और कहते हैं कि उनके मार्गदर्शन में राजकुमार आक्रमणकारियों को परास्त कर सकता है। माँग की स्पष्टता दरबार को स्तब्ध करती है—सेना या वरिष्ठ योद्धा भेजने से परिवार की व्यवस्था बनी रहती, पर यहाँ प्रिय युवा उत्तराधिकारी को ही महल की सुरक्षा से बाहर ले जाना है।",
          },
          visualCue: "The vast army behind Dasharatha fades from focus as a single path lights between Vishvamitra and the absent young Rama.",
          characterIds: ["vishvamitra", "dasharatha", "rama"],
        },
        {
          id: "dasharatha-collapses-under-request",
          title: { en: "A public promise collides with a father's fear", hi: "सार्वजनिक वचन पिता के भय से टकराता है" },
          narration: {
            en: "Dasharatha trembles and loses composure when he understands the request. The scene does not mock his attachment: the long-awaited child has barely entered youth, and the named enemies are experienced in deception. Courtly confidence gives way to a father's immediate terror of loss.",
            hi: "माँग का अर्थ समझते ही दशरथ काँप उठते हैं और उनका संतुलन टूट जाता है। दृश्य उनके स्नेह का उपहास नहीं करता—लंबे समय से प्रतीक्षित पुत्र अभी किशोर है और सामने बताए गए शत्रु छल-युद्ध में अनुभवी हैं। राजकीय आत्मविश्वास एक पिता के तत्काल वियोग-भय में बदल जाता है।",
          },
          visualCue: "The court sound falls away as Dasharatha's viewpoint narrows from throne, army, and promise to the imagined loss of one child.",
          characterIds: ["dasharatha", "rama", "vishvamitra"],
        },
      ],
    },
  },
  {
    id: "dasharatha-cannot-release-his-son",
    nodeIds: ["dasharatha", "vishvamitra", "rama", "ravana", "maricha", "subahu"],
    moment: {
      id: "dasharatha-cannot-release-his-son",
      decisiveChange: {
        en: "Dasharatha tries every substitution—army, self, and refusal—because he cannot yet imagine protection that includes letting Rama go.",
        hi: "दशरथ सेना, स्वयं और अंततः अस्वीकार—हर विकल्प सामने रखते हैं, क्योंकि वे अभी ऐसी सुरक्षा की कल्पना नहीं कर पाते जिसमें राम को जाने देना शामिल हो।",
      },
      beats: [
        {
          id: "rama-is-not-yet-sixteen",
          title: { en: "Dasharatha names Rama's youth", hi: "दशरथ राम की कम आयु सामने रखते हैं" },
          narration: {
            en: "Recovering from shock, Dasharatha says Rama is not yet sixteen and lacks experience against shape-changing attackers. The objection is concrete rather than cowardly: training inside Ayodhya is not the same as reading an unpredictable battlefield where opponents use terror and deception.",
            hi: "आघात से सँभलकर दशरथ कहते हैं कि राम अभी सोलह वर्ष के भी नहीं हैं और रूप बदलने वाले आक्रमणकारियों से लड़ने का अनुभव नहीं रखते। आपत्ति ठोस है—अयोध्या का प्रशिक्षण उस अनिश्चित युद्धभूमि के समान नहीं जहाँ शत्रु भय और छल का उपयोग करते हैं।",
          },
          visualCue: "Training-yard images of Rama are overlaid with unfamiliar night attacks, making the gap between skill and experience visible.",
          characterIds: ["dasharatha", "rama", "vishvamitra"],
        },
        {
          id: "king-offers-himself-and-army",
          title: { en: "Take my army; let me stand in front", hi: "मेरी सेना ले जाइए, मैं स्वयं आगे खड़ा रहूँगा" },
          narration: {
            en: "Dasharatha offers his full army and his own bow, promising to guard the sacrifice as long as he lives. He is not refusing the public duty; he is attempting to absorb its danger himself. Yet every substitute changes the request Vishvamitra deliberately made.",
            hi: "दशरथ अपनी पूरी सेना और स्वयं अपना धनुष देने का प्रस्ताव रखते हैं; वे जीवन रहते अनुष्ठान की रक्षा का वचन देते हैं। वे सार्वजनिक कर्तव्य से भाग नहीं रहे, बल्कि संकट को अपने ऊपर लेना चाहते हैं। फिर भी हर विकल्प विश्वामित्र की सोच-समझकर की गई माँग को बदल देता है।",
          },
          visualCue: "Dasharatha places himself before ranks of soldiers, but Vishvamitra's path continues to point beyond them toward Rama.",
          characterIds: ["dasharatha", "vishvamitra", "ayodhya-army"],
        },
        {
          id: "ravana-name-deepens-fear",
          title: { en: "The shadow behind the attackers is Ravana", hi: "आक्रमणकारियों के पीछे रावण की छाया है" },
          narration: {
            en: "When Dasharatha learns that Maricha and Subahu operate under Ravana's wider power, his fear intensifies. He describes Ravana as beyond his own capacity and concludes that neither he nor Rama can face such a threat. Information meant to clarify the mission instead enlarges the imagined catastrophe.",
            hi: "जब दशरथ जानते हैं कि मारीच और सुबाहु के पीछे रावण की व्यापक शक्ति है, उनका भय और बढ़ता है। वे रावण को अपनी क्षमता से भी परे बताते हैं और मान लेते हैं कि न वे, न राम ऐसा संकट झेल सकते हैं। मिशन स्पष्ट करने वाली सूचना उनके मन में विनाश की छवि और बड़ी कर देती है।",
          },
          visualCue: "The two attackers' silhouettes stretch backward into Ravana's immense distant shadow, overwhelming Dasharatha's proposed formation.",
          characterIds: ["dasharatha", "ravana", "maricha", "subahu", "rama"],
        },
        {
          id: "fear-hardens-into-refusal",
          title: { en: "Dasharatha withdraws the promise", hi: "दशरथ अपना वचन वापस लेने लगते हैं" },
          narration: {
            en: "Dasharatha finally says he will not part with Rama and asks Vishvamitra to abandon the request. The earlier open promise is now in danger of becoming false. Vishvamitra's anger rises because the king sought the honour of generosity without accepting the cost of the specific help requested.",
            hi: "अंततः दशरथ कहते हैं कि वे राम से अलग नहीं होंगे और विश्वामित्र से माँग छोड़ने की विनती करते हैं। पहले दिया खुला वचन अब असत्य होने की ओर बढ़ता है। विश्वामित्र का क्रोध इसलिए उठता है कि राजा ने उदारता का सम्मान तो चाहा, पर माँगी गई विशेष सहायता की कीमत स्वीकार नहीं की।",
          },
          visualCue: "The luminous promise spoken at Vishvamitra's arrival fractures across the court as the ascetic's restrained anger shakes the space.",
          characterIds: ["dasharatha", "vishvamitra", "rama"],
        },
      ],
    },
  },
  {
    id: "vasishta-makes-promise-actionable",
    nodeIds: ["vasishta", "dasharatha", "vishvamitra", "rama", "royal-council"],
    moment: {
      id: "vasishta-makes-promise-actionable",
      decisiveChange: {
        en: "Vasishta does not dismiss Dasharatha's fear; he supplies the missing evidence that makes keeping the promise responsible.",
        hi: "वसिष्ठ दशरथ के भय को तुच्छ नहीं कहते; वे वह जानकारी देते हैं जिससे वचन निभाना जिम्मेदार निर्णय बन सके।",
      },
      beats: [
        {
          id: "anger-shakes-the-court",
          title: { en: "Vishvamitra names the broken promise", hi: "विश्वामित्र टूटते वचन को स्पष्ट नाम देते हैं" },
          narration: {
            en: "Vishvamitra tells Dasharatha that offering help and then retracting it is unworthy of the Raghu line. His anger unsettles the court and even the earth in the source's heightened telling. The conflict can no longer be softened into a misunderstanding about logistics.",
            hi: "विश्वामित्र दशरथ से कहते हैं कि सहायता का वचन देकर पीछे हटना रघुवंश के योग्य नहीं है। स्रोत की तीव्र कथा में उनका क्रोध दरबार और पृथ्वी तक को विचलित करता है। अब विवाद को केवल व्यवस्था की गलतफहमी कहकर हल्का नहीं किया जा सकता।",
          },
          visualCue: "The court architecture trembles around the broken promise while Vasishta remains the only still point between king and ascetic.",
          characterIds: ["vishvamitra", "dasharatha", "vasishta"],
        },
        {
          id: "vasishta-restates-the-duty",
          title: { en: "A ruler's word must survive private fear", hi: "राजा का वचन निजी भय से बड़ा होना चाहिए" },
          narration: {
            en: "Vasishta reminds Dasharatha that truthfulness is not an ornament for easy moments. As king, he cannot let affection erase a promise made before the court. But Vasishta does not stop at moral pressure; he turns immediately to whether Rama will actually be safe.",
            hi: "वसिष्ठ दशरथ को याद दिलाते हैं कि सत्यनिष्ठा केवल आसान समय की सजावट नहीं है। राजा होकर वे स्नेह के कारण दरबार में दिए वचन को मिटा नहीं सकते। पर वसिष्ठ केवल नैतिक दबाव पर नहीं रुकते; वे तुरंत इस प्रश्न पर आते हैं कि राम वास्तव में सुरक्षित रहेंगे या नहीं।",
          },
          visualCue: "The fractured promise steadies into a clear line of duty, then branches into a practical risk assessment around Rama's journey.",
          characterIds: ["vasishta", "dasharatha", "rama"],
        },
        {
          id: "vishvamitra-is-the-protection",
          title: { en: "The guide asking for Rama is also his strongest protection", hi: "राम को माँगने वाले मार्गदर्शक ही उनकी सबसे बड़ी रक्षा हैं" },
          narration: {
            en: "Vasishta describes Vishvamitra's command of weapons, knowledge, discipline, and powers inherited or mastered through austerity. He insists the ascetic could defeat the attackers himself and seeks Rama for the prince's welfare and growth. The mission is supervised apprenticeship, not abandonment.",
            hi: "वसिष्ठ विश्वामित्र के अस्त्र-ज्ञान, अनुशासन और तप से अर्जित शक्तियों का वर्णन करते हैं। वे कहते हैं कि ऋषि स्वयं आक्रमणकारियों को परास्त कर सकते हैं और राम को उनके हित तथा विकास के लिए माँग रहे हैं। यह त्याग नहीं, संरक्षित शिक्षुता है।",
          },
          visualCue: "Vishvamitra's unseen knowledge forms a protective constellation around the road, replacing Dasharatha's image of Rama walking alone.",
          characterIds: ["vasishta", "vishvamitra", "rama", "dasharatha"],
        },
        {
          id: "dasharatha-consents-with-knowledge",
          title: { en: "Consent follows evidence, not exhaustion", hi: "सहमति थकान से नहीं, जानकारी से आती है" },
          narration: {
            en: "Dasharatha's decision changes after Vasishta supplies a credible protection model. He can now keep his word without pretending the danger is small. The king begins preparing to entrust Rama to Vishvamitra, and fear becomes a careful farewell rather than a permanent veto.",
            hi: "वसिष्ठ द्वारा विश्वसनीय सुरक्षा-व्यवस्था समझाने के बाद दशरथ का निर्णय बदलता है। अब वे संकट को छोटा बताए बिना अपना वचन निभा सकते हैं। राजा राम को विश्वामित्र के साथ भेजने की तैयारी करते हैं और भय स्थायी रोक के बजाय सावधान विदाई बन जाता है।",
          },
          visualCue: "The court settles as Dasharatha's closed grip opens; the road remains dangerous but now carries visible guidance, boundaries, and trust.",
          characterIds: ["dasharatha", "vasishta", "vishvamitra", "rama"],
        },
      ],
    },
  },
  {
    id: "rama-lakshmana-leave-palace",
    nodeIds: ["rama", "lakshmana", "vishvamitra", "dasharatha", "sarayu", "ayodhya"],
    moment: {
      id: "rama-lakshmana-leave-palace",
      decisiveChange: {
        en: "Rama and Lakshmana cross from protected palace life into apprenticeship, receiving their first disciplines beside the Sarayu.",
        hi: "राम और लक्ष्मण सुरक्षित राजमहल से शिक्षुता की यात्रा में प्रवेश करते हैं और सरयू तट पर पहली विशेष विद्याएँ ग्रहण करते हैं।",
      },
      beats: [
        {
          id: "farewell-becomes-formal-trust",
          title: { en: "The family performs the farewell it feared", hi: "परिवार वही विदाई निभाता है जिससे वह डरता था" },
          narration: {
            en: "Dasharatha summons Rama and Lakshmana. Parents and Vasishta perform blessings and protective rites; Dasharatha embraces and formally entrusts Rama to Vishvamitra. The goodbye does not erase grief, but gives it a shape the family can act through.",
            hi: "दशरथ राम और लक्ष्मण को बुलाते हैं। माता-पिता और वसिष्ठ आशीर्वाद तथा रक्षा-विधि करते हैं; दशरथ राम को गले लगाकर औपचारिक रूप से विश्वामित्र को सौंपते हैं। विदाई दुःख मिटाती नहीं, पर उसे ऐसा रूप देती है जिसके भीतर परिवार कार्य कर सके।",
          },
          visualCue: "Protective gestures pass from parents and priest to the two princes before the palace doors open onto the untested road.",
          characterIds: ["dasharatha", "rama", "lakshmana", "vishvamitra", "vasishta"],
        },
        {
          id: "three-figures-take-the-road",
          title: { en: "Vishvamitra leads; the brothers follow", hi: "विश्वामित्र आगे चलते हैं और दोनों भाई पीछे" },
          narration: {
            en: "Vishvamitra walks first, Rama follows with bow and quiver, and Lakshmana follows Rama. The compact formation makes their relationships visible: guide, principal learner, and brother-companion. Celestial celebration in the source contrasts with the very human distance opening behind them.",
            hi: "विश्वामित्र सबसे आगे, धनुष-तरकश के साथ राम उनके पीछे और लक्ष्मण राम के पीछे चलते हैं। यह छोटा क्रम संबंध स्पष्ट करता है—मार्गदर्शक, मुख्य शिक्षार्थी और भाई-सहचर। स्रोत का दिव्य उत्सव पीछे बढ़ती मानवीय दूरी के साथ विरोध रचता है।",
          },
          visualCue: "Three silhouettes leave Ayodhya in a strict moving line while the city recedes and the open river landscape grows around them.",
          characterIds: ["vishvamitra", "rama", "lakshmana"],
        },
        {
          id: "bala-atibala-received",
          title: { en: "The first weapons are disciplines of endurance", hi: "पहली विद्याएँ सहनशक्ति और सजगता की हैं" },
          narration: {
            en: "Beside the Sarayu, Vishvamitra teaches Rama Bala and Atibala, disciplines the source says protect against fatigue, hunger, surprise, and loss of mental clarity. Before giving destructive weapons, the teacher strengthens attention and endurance—the capacities needed to decide well under pressure.",
            hi: "सरयू के किनारे विश्वामित्र राम को बला और अतिबला सिखाते हैं, जिन्हें स्रोत थकान, भूख, अचानक आक्रमण और मानसिक भ्रम से रक्षा करने वाली विद्याएँ बताता है। विनाशकारी अस्त्रों से पहले गुरु ध्यान और सहनशक्ति मजबूत करते हैं—दबाव में सही निर्णय के लिए आवश्यक क्षमताएँ।",
          },
          visualCue: "The river's pulse synchronises with Rama's breath as the lesson appears through posture, attention, and sustained movement rather than magical spectacle alone.",
          characterIds: ["vishvamitra", "rama", "lakshmana"],
        },
        {
          id: "first-night-on-grass",
          title: { en: "The palace bed becomes riverbank grass", hi: "महल की शय्या सरयू तट की घास बन जाती है" },
          narration: {
            en: "The brothers perform their duties toward Vishvamitra and spend the night on a bed of grass. Conversation with the guide makes the unfamiliar camp bearable. The first day ends without battle: leaving comfort, learning to listen, and sleeping outside are already part of the transformation.",
            hi: "दोनों भाई विश्वामित्र के प्रति शिष्य-कर्तव्य निभाकर घास की शय्या पर रात बिताते हैं। गुरु का संवाद अपरिचित शिविर को सहज बनाता है। पहला दिन बिना युद्ध समाप्त होता है—सुविधा छोड़ना, सुनना सीखना और खुले में सोना स्वयं परिवर्तन का हिस्सा हैं।",
          },
          visualCue: "A low riverbank fire replaces palace lamps while the three travellers' conversation continues under an immense unfamiliar sky.",
          characterIds: ["rama", "lakshmana", "vishvamitra"],
        },
      ],
    },
  },
  {
    id: "rivers-open-remembered-worlds",
    nodeIds: ["rama", "lakshmana", "vishvamitra", "sarayu", "ganga", "kama-hermitage", "tataka-forest"],
    moment: {
      id: "rivers-open-remembered-worlds",
      decisiveChange: {
        en: "The journey becomes a practice of reading landscapes: every confluence, hermitage, and ruined country carries a remembered story.",
        hi: "यात्रा भू-दृश्य पढ़ने की साधना बनती है—हर संगम, आश्रम और उजड़ा प्रदेश अपने भीतर एक पुरानी कथा रखता है।",
      },
      beats: [
        {
          id: "morning-discipline-starts-road",
          title: { en: "The road begins with daily practice", hi: "रोज़ की साधना से यात्रा फिर शुरू होती है" },
          narration: {
            en: "Vishvamitra wakes the brothers before dawn. They bathe, complete morning observances, greet their guide, and resume walking. Heroic travel is paced by repeated care of body, attention, and relationship; the story does not jump directly from palace to combat.",
            hi: "विश्वामित्र भोर से पहले दोनों भाइयों को जगाते हैं। वे स्नान, प्रातः-उपासना और गुरु-अभिवादन के बाद फिर चल पड़ते हैं। वीर यात्रा शरीर, ध्यान और संबंध की दोहराई जाने वाली देखभाल से चलती है; कथा महल से सीधे युद्ध पर नहीं कूदती।",
          },
          visualCue: "Dawn practice becomes the movement tutorial: water, breath, greeting, equipment check, and the first steps align before the map opens.",
          characterIds: ["vishvamitra", "rama", "lakshmana"],
        },
        {
          id: "confluence-remembers-kama",
          title: { en: "A peaceful hermitage remembers desire burned away", hi: "शांत आश्रम काम-दहन की स्मृति रखता है" },
          narration: {
            en: "At the Sarayu-Ganga region, Rama asks about an old hermitage. Vishvamitra connects it with Shiva's austerity and the burning of Kama, explaining why the place carries the memory of the bodiless god of desire. The landscape becomes more than scenery because curiosity unlocks its layered past.",
            hi: "सरयू-गंगा क्षेत्र में राम एक पुराने आश्रम के बारे में पूछते हैं। विश्वामित्र उसे शिव की तपस्या और काम-दहन से जोड़ते हैं और बताते हैं कि यह स्थान देह-विहीन कामदेव की स्मृति क्यों रखता है। जिज्ञासा भू-दृश्य की परतें खोलती है और स्थान केवल दृश्य नहीं रहता।",
          },
          visualCue: "The quiet hermitage briefly reveals an older layer of meditation, interruption, flame, and absence without trapping the player in a text panel.",
          characterIds: ["rama", "vishvamitra", "shiva", "kama"],
        },
        {
          id: "ganga-crossing-explains-sound",
          title: { en: "The river itself asks a question", hi: "नदी की ध्वनि स्वयं एक प्रश्न बनती है" },
          narration: {
            en: "While crossing the Ganga, the brothers hear a powerful sound where waters meet. Rama asks rather than pretending to know, and Vishvamitra explains the joining currents. Travel repeatedly rewards attention: sound, current, and direction become portals into knowledge of place.",
            hi: "गंगा पार करते समय दोनों भाई जलधाराओं के मिलने की प्रबल ध्वनि सुनते हैं। राम जानने का दिखावा नहीं करते, प्रश्न पूछते हैं और विश्वामित्र संगम की धाराएँ समझाते हैं। यात्रा में ध्यान का पुरस्कार मिलता है—ध्वनि, प्रवाह और दिशा स्थान-ज्ञान के द्वार बनते हैं।",
          },
          visualCue: "The boat enters colliding currents; visible sound rings guide the player's gaze to the confluence as Vishvamitra's explanation overlays the water itself.",
          characterIds: ["rama", "lakshmana", "vishvamitra"],
        },
        {
          id: "prosperous-lands-become-tataka-forest",
          title: { en: "Remembered prosperity gives way to an emptied forest", hi: "पुरानी समृद्धि उजड़े ताटकावन में बदलती है" },
          narration: {
            en: "Vishvamitra recounts how the once-prosperous lands of Malada and Karusha became depopulated under Tataka's violence. The travellers enter a forest defined by absence—broken routes, abandoned settlement, and fear. The next choice will concern not an abstract monster but a damaged inhabited world.",
            hi: "विश्वामित्र बताते हैं कि कभी समृद्ध मालद और करूष प्रदेश ताटका की हिंसा से कैसे जनशून्य हुए। यात्री ऐसे वन में प्रवेश करते हैं जिसकी पहचान अनुपस्थिति है—टूटी राहें, छोड़ी बस्तियाँ और भय। अगला निर्णय किसी अमूर्त राक्षसी का नहीं, क्षतिग्रस्त मानवीय संसार का प्रश्न होगा।",
          },
          visualCue: "Green river country darkens into blocked roads and abandoned foundations, with the forest's missing human activity becoming the strongest visual signal.",
          characterIds: ["vishvamitra", "rama", "lakshmana", "tataka"],
        },
      ],
    },
  },
  {
    id: "tataka-forest-forces-choice",
    nodeIds: ["tataka", "rama", "lakshmana", "vishvamitra", "maricha", "tataka-forest"],
    moment: {
      id: "tataka-forest-forces-choice",
      decisiveChange: {
        en: "Rama's first lethal mission forces him to weigh a damaged person's history against the continuing danger she now poses.",
        hi: "राम का पहला घातक अभियान उन्हें एक पीड़ित इतिहास और उससे उत्पन्न वर्तमान खतरे के बीच कठिन निर्णय के सामने खड़ा करता है।",
      },
      beats: [
        {
          id: "tataka-has-a-history-before-monsterhood",
          title: { en: "Tataka was not born as a forest terror", hi: "ताटका जन्म से वन का आतंक नहीं थी" },
          narration: {
            en: "When Rama questions Tataka's extraordinary strength, Vishvamitra tells her history: she was the daughter of the yaksha Suketu, granted immense power, married to Sunda, and mother of Maricha. After Sunda's death and a retaliatory attack on Agastya, curse and violence transformed the family.",
            hi: "राम ताटका के असाधारण बल पर प्रश्न करते हैं तो विश्वामित्र उसका इतिहास बताते हैं—वह यक्ष सुकेतु की पुत्री, महान शक्ति से संपन्न, सुंद की पत्नी और मारीच की माता थी। सुंद की मृत्यु और अगस्त्य पर प्रतिशोधी आक्रमण के बाद शाप तथा हिंसा ने पूरे परिवार को बदल दिया।",
          },
          visualCue: "The feared silhouette separates into earlier layers of daughter, wife, mother, grief, retaliation, curse, and present devastation.",
          characterIds: ["tataka", "suketu", "sunda", "maricha", "agastya", "vishvamitra", "rama"],
        },
        {
          id: "command-carries-gendered-argument",
          title: { en: "Vishvamitra commands lethal action", hi: "विश्वामित्र प्राणघातक कार्रवाई का आदेश देते हैं" },
          narration: {
            en: "Vishvamitra argues that a ruler must protect the population and tells Rama to kill Tataka despite his hesitation about killing a woman. The selected source uses gendered precedents to press the command. Devam preserves that reasoning as source content, not as a timeless rule requiring modern agreement.",
            hi: "विश्वामित्र कहते हैं कि शासक को प्रजा की रक्षा करनी चाहिए और स्त्री-वध पर राम की झिझक के बावजूद ताटका को मारने का आदेश देते हैं। चुना हुआ स्रोत इस आदेश के समर्थन में लैंगिक उदाहरण देता है। देवम इस तर्क को स्रोत की सामग्री के रूप में रखता है, आधुनिक सहमति माँगने वाले शाश्वत नियम की तरह नहीं।",
          },
          visualCue: "The command appears as contested paths around Rama—public safety, obedience, restraint, and the source's gendered precedent remain simultaneously visible.",
          characterIds: ["vishvamitra", "rama", "tataka"],
        },
        {
          id: "battle-erases-easy-restraint",
          title: { en: "Rama first seeks restraint; the battle escalates", hi: "राम पहले सीमित रोक चाहते हैं, पर युद्ध तीव्र हो जाता है" },
          narration: {
            en: "Rama initially speaks of disabling Tataka rather than killing her. His bow-call draws her out; dust, stones, concealment, and rapid attack overwhelm the forest. Lakshmana joins the defence, and Vishvamitra warns that darkness will increase her advantage. The space for a limited solution closes under continuing assault.",
            hi: "राम आरंभ में ताटका को मारने के बजाय उसकी क्षमता सीमित करने की बात करते हैं। धनुष की टंकार उसे बाहर लाती है; धूल, पत्थर, अदृश्य गति और तीव्र आक्रमण वन को भर देते हैं। लक्ष्मण रक्षा में जुड़ते हैं और विश्वामित्र चेताते हैं कि अँधेरा उसका लाभ बढ़ाएगा। लगातार हमले में सीमित समाधान की गुंजाइश घटती जाती है।",
          },
          visualCue: "Visibility collapses under dust and stone; nonlethal targeting routes disappear one by one as the attack intensifies toward dusk.",
          characterIds: ["rama", "lakshmana", "tataka", "vishvamitra"],
        },
        {
          id: "tataka-falls-forest-reopens",
          title: { en: "Tataka falls and the forest changes", hi: "ताटका गिरती है और वन बदल जाता है" },
          narration: {
            en: "Rama finally strikes Tataka lethally. The source celebrates the act through celestial praise and shows the forest becoming peaceful again. The consumer telling retains both outcomes: an immediate danger ends and routes reopen, while the preceding history prevents the victory from becoming emotionally simple.",
            hi: "अंततः राम ताटका पर प्राणघातक प्रहार करते हैं। स्रोत दिव्य प्रशंसा से इस कार्य का उत्सव मनाता है और वन को फिर शांत दिखाता है। उपभोक्ता कथा दोनों परिणाम सुरक्षित रखती है—तत्काल खतरा समाप्त होकर रास्ते खुलते हैं, पर पिछला इतिहास विजय को भावनात्मक रूप से सरल नहीं बनने देता।",
          },
          visualCue: "Dust settles over Tataka's fallen form as abandoned paths regain light; the restored forest and the cost of restoration share the final frame.",
          characterIds: ["rama", "tataka", "lakshmana", "vishvamitra"],
        },
      ],
    },
  },
  {
    id: "weapons-arrive-with-restraint",
    nodeIds: ["rama", "vishvamitra", "lakshmana", "celestial-weapons", "siddhashrama"],
    moment: {
      id: "weapons-arrive-with-restraint",
      decisiveChange: {
        en: "Rama receives immense destructive capacity, then immediately asks how to withdraw and restrain it before moving on.",
        hi: "राम अपार विनाशकारी क्षमता प्राप्त करते हैं और आगे बढ़ने से पहले तुरंत उसे वापस लेने तथा नियंत्रित करने का ज्ञान माँगते हैं।",
      },
      beats: [
        {
          id: "vishvamitra-rewards-readiness",
          title: { en: "Vishvamitra offers a dangerous inheritance", hi: "विश्वामित्र एक खतरनाक विरासत सौंपते हैं" },
          narration: {
            en: "Pleased after Tataka's defeat, Vishvamitra offers Rama a vast body of celestial weapons associated with different powers, elements, restraints, and forms of destruction. The long source catalogue communicates scale: the prince is being trusted with capabilities far beyond ordinary archery.",
            hi: "ताटका-वध के बाद प्रसन्न विश्वामित्र राम को अलग-अलग शक्तियों, तत्वों, बंधनों और विनाश-रूपों से जुड़े अनेक दिव्य अस्त्र देते हैं। स्रोत की लंबी सूची विस्तार का अनुभव कराती है—राजकुमार को साधारण धनुर्विद्या से बहुत आगे की क्षमता सौंपी जा रही है।",
          },
          visualCue: "Dozens of distinct weapon-presences form an orbit around teacher and student, each carrying a different motion, sound, and hazard signature.",
          characterIds: ["vishvamitra", "rama", "celestial-weapons"],
        },
        {
          id: "weapons-answer-as-persons",
          title: { en: "The weapons present themselves as servants", hi: "अस्त्र स्वयं को सेवक के रूप में प्रस्तुत करते हैं" },
          narration: {
            en: "In the selected telling, the weapons take perceptible forms, approach Rama, and promise to appear when remembered. Rama accepts them through disciplined attention rather than testing them on the landscape. Power enters a relationship of command before it enters combat.",
            hi: "चुनी हुई कथा में अस्त्र दृश्य रूप लेकर राम के पास आते हैं और स्मरण करने पर उपस्थित होने का वचन देते हैं। राम उन्हें भू-दृश्य पर आज़माने के बजाय अनुशासित ध्यान से स्वीकार करते हैं। शक्ति युद्ध में उतरने से पहले आदेश और उत्तरदायित्व के संबंध में प्रवेश करती है।",
          },
          visualCue: "Each weapon-form bows and condenses into a remembered constellation inside Rama's reach without firing or damaging the restored forest.",
          characterIds: ["rama", "vishvamitra", "celestial-weapons"],
        },
        {
          id: "rama-asks-how-to-withdraw",
          title: { en: "The first question is how to stop them", hi: "राम का पहला प्रश्न है—इन्हें रोका कैसे जाए" },
          narration: {
            en: "As they walk, Rama asks Vishvamitra for the knowledge required to withdraw, counter, and quiet the weapons. The request is crucial: possession without recall would make every use irreversible. The teacher responds with the complementary disciplines of restraint.",
            hi: "चलते हुए राम विश्वामित्र से अस्त्रों को वापस लेने, रोकने और शांत करने की विधि माँगते हैं। यह प्रश्न निर्णायक है—वापसी का ज्ञान न हो तो हर प्रयोग अपरिवर्तनीय बन सकता है। गुरु उन्हें नियंत्रण और प्रतिहार की पूरक विद्याएँ देते हैं।",
          },
          visualCue: "The weapon orbit reverses cleanly into containment patterns as Rama practises recall, cancellation, and non-release under supervision.",
          characterIds: ["rama", "vishvamitra", "celestial-weapons"],
        },
        {
          id: "power-returns-to-curiosity",
          title: { en: "After weapons, Rama asks about the next place", hi: "अस्त्रों के बाद राम अगले स्थान के बारे में पूछते हैं" },
          narration: {
            en: "Once the weapons are accepted and restrained, Rama notices a pleasant hermitage beyond the terrifying wilderness and asks whose place it is and where the threatened sacrifice will occur. Curiosity, not fascination with force, moves the journey forward toward Siddhashrama.",
            hi: "अस्त्र ग्रहण और नियंत्रित करने के बाद राम भयानक वन के पार एक सुंदर आश्रम देखते हैं और पूछते हैं कि यह किसका स्थान है तथा संकटग्रस्त अनुष्ठान कहाँ होगा। शक्ति का आकर्षण नहीं, जिज्ञासा यात्रा को सिद्धाश्रम की ओर आगे बढ़ाती है।",
          },
          visualCue: "The contained weapon constellations dim behind Rama as the camera follows his gaze toward a bright hermitage emerging beyond the forest.",
          characterIds: ["rama", "vishvamitra", "lakshmana"],
        },
      ],
    },
  },
  {
    id: "siddhashrama-remembers-vishnu",
    nodeIds: ["siddhashrama", "vishvamitra", "rama", "lakshmana", "vishnu", "vamana", "bali"],
    moment: {
      id: "siddhashrama-remembers-vishnu",
      decisiveChange: {
        en: "The threatened hermitage reveals an older story of Vishnu, Vamana, and Bali, placing the coming defence inside a place already shaped by vows.",
        hi: "संकटग्रस्त आश्रम विष्णु, वामन और बलि की पुरानी कथा खोलता है और आने वाली रक्षा को पहले से संकल्पों से बने स्थान के भीतर रखता है।",
      },
      beats: [
        {
          id: "hermitage-holds-vishnu-austerity",
          title: { en: "Siddhashrama remembers Vishnu's long practice", hi: "सिद्धाश्रम विष्णु की दीर्घ तपस्या को याद रखता है" },
          narration: {
            en: "Vishvamitra tells Rama that Vishnu once practised austerity here for immense spans of time and attained fulfilment, giving Siddhashrama its name. The current ritual ground is therefore not an arbitrary campsite; its identity comes from sustained discipline across generations of story.",
            hi: "विश्वामित्र राम को बताते हैं कि विष्णु ने यहाँ लंबे काल तक तपस्या करके सिद्धि प्राप्त की, इसलिए स्थान का नाम सिद्धाश्रम पड़ा। वर्तमान अनुष्ठान-स्थल कोई आकस्मिक शिविर नहीं; उसकी पहचान पीढ़ियों से चली आ रही साधना और कथा से बनती है।",
          },
          visualCue: "The present hermitage becomes translucent, revealing an older Vishnu-shaped stillness embedded in the same trees, paths, and ground.",
          characterIds: ["vishvamitra", "rama", "vishnu"],
        },
        {
          id: "bali-gives-within-his-vow",
          title: { en: "Bali's generosity creates a difficult opening", hi: "बलि की उदारता एक कठिन मार्ग खोलती है" },
          narration: {
            en: "The story recalls King Bali, whose victories displaced the gods and whose sacrifice made him bound to give what a petitioner properly requested. The source holds power and generosity together: Bali is an opponent of the gods, yet his commitment to giving is what makes the next encounter possible.",
            hi: "कथा राजा बलि को याद करती है, जिनकी विजय से देवता विस्थापित हुए और जिनका यज्ञ उन्हें उचित याचना स्वीकार करने के वचन से बाँधता है। स्रोत शक्ति और उदारता को साथ रखता है—बलि देवताओं के प्रतिद्वंद्वी हैं, पर देने का उनका संकल्प ही अगली भेंट संभव बनाता है।",
          },
          visualCue: "Bali's vast three-world dominion folds into a sacrificial court where an open giving-hand becomes both virtue and vulnerability.",
          characterIds: ["bali", "devas"],
        },
        {
          id: "vamana-asks-for-three-steps",
          title: { en: "Vamana asks only for the ground he can cross", hi: "वामन केवल तीन पग भूमि माँगते हैं" },
          narration: {
            en: "Vishnu appears as the small brahmana Vamana and asks Bali for three steps of land. Once the gift is granted, Vamana expands and measures the worlds, restoring the gods' position. Devam presents this as the selected source's sacred place-memory, while later traditions may interpret Bali and the encounter differently.",
            hi: "विष्णु छोटे ब्राह्मण वामन के रूप में आकर बलि से तीन पग भूमि माँगते हैं। दान स्वीकार होते ही वामन विराट होकर लोक नापते हैं और देवताओं की स्थिति पुनः स्थापित करते हैं। देवम इसे चुने स्रोत की पवित्र स्थान-स्मृति मानता है; बाद की परंपराएँ बलि और इस भेंट को अलग ढंग से समझ सकती हैं।",
          },
          visualCue: "The small petitioner's three measured steps expand across layered worlds, then settle back into the footprint of Siddhashrama.",
          characterIds: ["vamana", "vishnu", "bali"],
        },
        {
          id: "present-vow-begins",
          title: { en: "Vishvamitra enters silence; the brothers take watch", hi: "विश्वामित्र मौन-व्रत में जाते हैं और दोनों भाई पहरा लेते हैं" },
          narration: {
            en: "Vishvamitra identifies Siddhashrama as his own hermitage too and begins initiation into the sacrifice. Rama and Lakshmana complete their morning duties, honour the fire and their guide, and prepare to guard a vow whose performer must now remain silent.",
            hi: "विश्वामित्र सिद्धाश्रम को अपना आश्रम भी बताते हैं और यज्ञ की दीक्षा लेते हैं। राम और लक्ष्मण प्रातः-कर्म करके अग्नि तथा गुरु का सम्मान करते हैं और ऐसे संकल्प की रक्षा के लिए तैयार होते हैं जिसके अनुष्ठाता को अब मौन रहना है।",
          },
          visualCue: "The Vamana place-memory recedes as Vishvamitra crosses into a silent ritual boundary and the brothers take positions outside it.",
          characterIds: ["vishvamitra", "rama", "lakshmana"],
        },
      ],
    },
  },
  {
    id: "six-nights-end-in-battle",
    nodeIds: ["rama", "lakshmana", "vishvamitra", "maricha", "subahu", "siddhashrama"],
    moment: {
      id: "six-nights-end-in-battle",
      decisiveChange: {
        en: "Six sleepless nights culminate in a controlled defence: one attacker is expelled, another killed, and the sacrifice is completed.",
        hi: "छह जागी रातें नियंत्रित रक्षा में पूरी होती हैं—एक आक्रमणकारी दूर फेंका जाता है, दूसरा मारा जाता है और अनुष्ठान संपन्न होता है।",
      },
      beats: [
        {
          id: "brothers-ask-for-the-clock",
          title: { en: "Tell us when the danger will come", hi: "हमें बताइए संकट किस समय आएगा" },
          narration: {
            en: "Because Vishvamitra must keep ritual silence, Rama and Lakshmana ask the other ascetics for the likely attack window. They learn that six nights of protection are required. The defence begins with timing and communication, not with random displays of readiness.",
            hi: "विश्वामित्र को अनुष्ठानिक मौन रखना है, इसलिए राम और लक्ष्मण अन्य तपस्वियों से आक्रमण का संभावित समय पूछते हैं। उन्हें छह रात रक्षा करनी है। पहरा अंधाधुंध वीरता से नहीं, समय और संवाद की स्पष्टता से शुरू होता है।",
          },
          visualCue: "A six-night watch cycle appears around the silent ritual fire, with positions, handoffs, and threat directions mapped into the environment.",
          characterIds: ["rama", "lakshmana", "vishvamitra", "siddhashrama-ascetics"],
        },
        {
          id: "vigil-holds-through-five-nights",
          title: { en: "Readiness is mostly waiting", hi: "सजगता का अधिकांश भाग प्रतीक्षा है" },
          narration: {
            en: "The brothers renounce sleep and guard the hermitage through day and night. Nothing attacks immediately. Fatigue, uncertainty, and the temptation to relax become part of the challenge, showing why the earlier disciplines of endurance mattered before any weapon was drawn.",
            hi: "दोनों भाई नींद छोड़कर दिन-रात आश्रम की रक्षा करते हैं। हमला तुरंत नहीं आता। थकान, अनिश्चितता और ढीला पड़ने का आकर्षण स्वयं चुनौती बनते हैं; इससे समझ आता है कि अस्त्र उठाने से पहले सहनशक्ति की विद्याएँ क्यों दी गई थीं।",
          },
          visualCue: "Five cycles of light, weather, ritual rhythm, and changing guard posture pass while the player maintains attention without manufactured combat.",
          characterIds: ["rama", "lakshmana"],
        },
        {
          id: "sixth-day-sky-breaks",
          title: { en: "On the sixth day the sky fills with attack", hi: "छठे दिन आकाश आक्रमण से भर जाता है" },
          narration: {
            en: "Rama warns Lakshmana to be especially alert. Fire flares at the altar, a terrible sound rises, and Maricha and Subahu appear with their followers, covering the sky and raining defilement toward the rite. The long wait condenses into seconds of decision.",
            hi: "राम लक्ष्मण को विशेष सावधान रहने को कहते हैं। वेदी की अग्नि तेज होती है, भयानक ध्वनि उठती है और मारीच-सुबाहु अपने साथियों सहित आकाश ढककर अनुष्ठान पर अपवित्र सामग्री बरसाने आते हैं। लंबी प्रतीक्षा कुछ क्षणों के निर्णय में सिमट जाती है।",
          },
          visualCue: "The carefully learned watch map collapses upward as the sky darkens and falling hazards race toward the protected ritual boundary.",
          characterIds: ["rama", "lakshmana", "maricha", "subahu"],
        },
        {
          id: "maricha-expelled-subahu-killed",
          title: { en: "Rama distinguishes between two outcomes", hi: "राम दो आक्रमणकारियों के लिए अलग परिणाम चुनते हैं" },
          narration: {
            en: "Rama uses the Manava weapon to hurl Maricha far into the sea without killing him, then kills Subahu and scatters the remaining attackers. The sacrifice reaches completion. Vishvamitra praises the brothers not for spectacle, but because the protected task was actually finished.",
            hi: "राम मानवास्त्र से मारीच को मारे बिना बहुत दूर समुद्र में फेंकते हैं, फिर सुबाहु को मारकर शेष आक्रमणकारियों को तितर-बितर करते हैं। अनुष्ठान पूरा होता है। विश्वामित्र भाइयों की प्रशंसा प्रदर्शन के लिए नहीं, बल्कि इसलिए करते हैं कि जिस कार्य की रक्षा करनी थी वह सचमुच संपन्न हुआ।",
          },
          visualCue: "Two deliberate trajectories split from Rama's bow—Maricha carried beyond the horizon, Subahu stopped—before the camera returns to the intact fire.",
          characterIds: ["rama", "lakshmana", "maricha", "subahu", "vishvamitra"],
        },
      ],
    },
  },
];
