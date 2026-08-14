import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

/** Complete consumer scenes for Balakanda 66-75 in the selected Dutt expression. */
export const RAMAYANA_WEDDINGS_CHALLENGE_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "mithila-envoys-reach-ayodhya",
    nodeIds: ["mithila-envoys", "dasharatha", "rama", "sita", "ayodhya", "mithila"],
    moment: {
      id: "mithila-envoys-reach-ayodhya",
      decisiveChange: {
        en: "News carries Rama's private journey back into his family, turning the bow feat into a marriage proposal that still requires deliberation and presence.",
        hi: "समाचार राम की स्वतंत्र यात्रा को फिर परिवार से जोड़ता है और धनुष-भंग को ऐसे विवाह-प्रस्ताव में बदलता है जिसे अभी विचार और उपस्थिति चाहिए।",
      },
      beats: [
        {
          id: "envoys-carry-more-than-victory",
          title: { en: "Three days of travel carry a changed future", hi: "तीन दिन की यात्रा एक बदला हुआ भविष्य लेकर आती है" },
          narration: {
            en: "Janaka's messengers leave Mithila immediately and reach Ayodhya after three demanding days. They carry more than news that Rama broke an impossible bow: Janaka has linked the feat to his vow concerning Sita, and the next decision belongs before Dasharatha, his priests, and the royal household.",
            hi: "जनक के दूत तुरंत मिथिला से निकलते हैं और कठिन तीन दिन की यात्रा के बाद अयोध्या पहुँचते हैं। वे केवल असंभव धनुष टूटने का समाचार नहीं लाते—जनक ने उस घटना को सीता के विषय में अपनी प्रतिज्ञा से जोड़ दिया है और अगला निर्णय दशरथ, पुरोहितों तथा राजपरिवार के सामने होना है।",
          },
          visualCue: "A bright message-route crosses the distance from Mithila to Ayodhya while the broken bow and Sita's future travel as separate but linked images.",
          characterIds: ["mithila-envoys", "janaka", "rama", "sita"],
        },
        {
          id: "welfare-comes-before-the-feat",
          title: { en: "The message begins with the sons' safety", hi: "संदेश पहले पुत्रों की कुशल बताता है" },
          narration: {
            en: "Before describing the feat, the envoys exchange formal wishes for everyone's wellbeing and report that Rama and Lakshmana are safe under Vishvamitra's care. For a father who released two young sons into danger, that order matters. Astonishment can begin only after the household knows the travellers are alive and unharmed.",
            hi: "पराक्रम बताने से पहले दूत सबकी कुशल पूछते हैं और बताते हैं कि राम तथा लक्ष्मण विश्वामित्र की रक्षा में सुरक्षित हैं। जिस पिता ने दो युवा पुत्रों को संकट की राह पर भेजा था, उसके लिए यह क्रम महत्त्वपूर्ण है। आश्चर्य तभी शुरू हो सकता है जब परिवार जान ले कि यात्री जीवित और सकुशल हैं।",
          },
          visualCue: "Dasharatha's tense court softens first at the image of both sons standing safely in Mithila, before the shattered bow appears behind them.",
          characterIds: ["dasharatha", "rama", "lakshmana", "vishvamitra", "mithila-envoys"],
        },
        {
          id: "janaka-asks-not-assumes",
          title: { en: "Janaka invites Dasharatha instead of declaring a wedding", hi: "जनक विवाह घोषित नहीं करते, दशरथ को आमंत्रित करते हैं" },
          narration: {
            en: "The envoys repeat Janaka's promise to give Sita to the person who could string the bow and confirm that Rama has met it. Yet the king asks Dasharatha to come if the alliance is agreeable. The language leaves room for the other household; prowess has opened the proposal, not completed every family decision.",
            hi: "दूत जनक की उस प्रतिज्ञा को दोहराते हैं जिसमें सीता का विवाह धनुष चढ़ाने वाले से होना था और बताते हैं कि राम ने शर्त पूरी की। फिर भी राजा कहते हैं कि यदि संबंध स्वीकार्य हो तो दशरथ आएँ। शब्द दूसरे परिवार के लिए स्थान रखते हैं—पराक्रम ने प्रस्ताव खोला है, हर पारिवारिक निर्णय पूरा नहीं किया।",
          },
          visualCue: "The line from Rama to Sita stops at an open threshold rather than locking shut, while an invitation extends respectfully toward Dasharatha's court.",
          characterIds: ["janaka", "dasharatha", "rama", "sita", "mithila-envoys"],
        },
        {
          id: "dasharatha-consults-and-accepts",
          title: { en: "The court answers together", hi: "सभा मिलकर उत्तर देती है" },
          narration: {
            en: "Dasharatha shares the message with Vasishta, Vamadeva, ministers, and advisers rather than answering from excitement alone. They approve the alliance, and he orders departure for the next morning. The scene turns a spectacular individual achievement into a collective commitment with witnesses and practical obligations.",
            hi: "दशरथ उत्साह में अकेले उत्तर देने के बजाय संदेश वसिष्ठ, वामदेव, मंत्रियों और सलाहकारों के साथ बाँटते हैं। सब संबंध स्वीकार करते हैं और वे अगली सुबह प्रस्थान का आदेश देते हैं। यह दृश्य व्यक्तिगत चमत्कार को साक्षियों तथा वास्तविक उत्तरदायित्वों वाली सामूहिक प्रतिबद्धता में बदल देता है।",
          },
          visualCue: "The message is placed at the centre of a council circle; agreement then radiates into maps, prepared vehicles, and a city readying before dawn.",
          characterIds: ["dasharatha", "vasishta", "vamadeva", "mithila-envoys"],
        },
      ],
    },
  },
  {
    id: "dasharatha-travels-to-mithila",
    nodeIds: ["dasharatha", "vasishta", "bharata", "shatrughna", "janaka", "ayodhya", "mithila"],
    moment: {
      id: "dasharatha-travels-to-mithila",
      decisiveChange: {
        en: "Dasharatha brings family, counsel, and the material structures of marriage to Mithila, shifting the story from a travelling prince to two houses meeting in person.",
        hi: "दशरथ परिवार, सलाह और विवाह की वास्तविक व्यवस्था लेकर मिथिला आते हैं; कथा अब अकेले यात्री राजकुमार से दो घरानों की प्रत्यक्ष भेंट की ओर बढ़ती है।",
      },
      beats: [
        {
          id: "ayodhya-prepares-a-household-journey",
          title: { en: "A royal wedding requires more than a fast chariot", hi: "राजविवाह के लिए केवल तेज़ रथ पर्याप्त नहीं" },
          narration: {
            en: "Dasharatha sends treasury officers, gifts, protected wealth, vehicles, and the fourfold forces ahead. Vasishta and other trusted priests accompany him, as do Bharata and Shatrughna. The travelling group is not an invasion or victory parade; it carries the people and resources required to negotiate and establish new kinship.",
            hi: "दशरथ कोषाध्यक्षों, उपहारों, सुरक्षित धन, वाहनों और चतुरंगिणी सेना को आगे भेजते हैं। वसिष्ठ तथा अन्य विश्वस्त पुरोहित और भरत-शत्रुघ्न भी साथ चलते हैं। यह दल आक्रमण या विजय-यात्रा नहीं; वह नए संबंध पर विचार और उसे स्थापित करने के लिए आवश्यक लोग तथा साधन लेकर चलता है।",
          },
          visualCue: "Ayodhya's departure assembles in layers—family, elders, gifts, guards, and vehicles—each visibly serving the same careful household journey.",
          characterIds: ["dasharatha", "vasishta", "bharata", "shatrughna"],
        },
        {
          id: "four-days-reconnect-the-brothers",
          title: { en: "The road closes the distance opened at Ayodhya", hi: "राह अयोध्या से खुली दूरी को फिर बंद करती है" },
          narration: {
            en: "After four days the procession reaches Videha. Rama and Lakshmana's earlier journey with Vishvamitra had stripped away palace support; now the family follows their path because the brothers acted well beyond it. Bharata and Shatrughna enter the Mithila world that until now belonged only to the travelling pair.",
            hi: "चार दिन बाद यात्रा विदेह पहुँचती है। विश्वामित्र के साथ राम-लक्ष्मण की पहली राह ने महल का सहारा पीछे छोड़ दिया था; अब परिवार उसी राह पर आता है क्योंकि दोनों भाइयों ने बाहर जाकर उत्तरदायित्व निभाया। भरत और शत्रुघ्न उस मिथिला-संसार में प्रवेश करते हैं जो अब तक केवल यात्री जोड़ी का था।",
          },
          visualCue: "Two previously separate routes—Rama and Lakshmana's thin trail and Ayodhya's broad procession—meet at Mithila's gates without erasing either journey.",
          characterIds: ["rama", "lakshmana", "bharata", "shatrughna", "dasharatha"],
        },
        {
          id: "janaka-welcomes-rama-father",
          title: { en: "Janaka receives the father behind the traveller", hi: "जनक यात्री के पीछे खड़े पिता का स्वागत करते हैं" },
          narration: {
            en: "Janaka goes out to honour Dasharatha and speaks openly of the joy Rama has brought to Mithila. Dasharatha answers that a giver's invitation should guide the receiver and places the next steps with Janaka. Mutual courtesy prevents either king from treating the marriage as a conquest by his own house.",
            hi: "जनक दशरथ का सम्मान करने बाहर आते हैं और उस आनंद की बात कहते हैं जो राम ने मिथिला को दिया। दशरथ उत्तर देते हैं कि देने वाले का निमंत्रण पाने वाले का मार्ग तय करता है और आगे की प्रक्रिया जनक पर छोड़ते हैं। परस्पर सम्मान किसी भी राजा को विवाह को अपने घर की विजय मानने से रोकता है।",
          },
          visualCue: "The two kings meet at ground level between their entourages, each stepping forward and leaving the visual centre open rather than claiming it.",
          characterIds: ["janaka", "dasharatha", "rama", "sita"],
        },
        {
          id: "sacrifice-makes-room-for-wedding",
          title: { en: "Janaka completes one duty before beginning another", hi: "जनक नया कर्तव्य शुरू करने से पहले पहला पूरा करते हैं" },
          narration: {
            en: "Janaka explains that his sacrifice must reach its proper conclusion before the marriage rites begin. He completes the remaining observances and prepares what his daughters' weddings require. Celebration therefore grows from ordered responsibilities rather than allowing the dramatic bow moment to sweep every existing commitment aside.",
            hi: "जनक बताते हैं कि विवाह-विधि शुरू होने से पहले यज्ञ को उचित रूप से पूरा करना होगा। वे शेष अनुष्ठान पूर्ण करते हैं और पुत्रियों के विवाह की तैयारी करते हैं। इस तरह उत्सव व्यवस्थित उत्तरदायित्वों से निकलता है; धनुष का नाटकीय क्षण पहले से चल रहे हर कर्तव्य को बहा नहीं ले जाता।",
          },
          visualCue: "The sacrificial ground completes its final cycle, then pathways and materials reorganise into a wedding pavilion instead of appearing through a sudden cut.",
          characterIds: ["janaka", "shatananda", "dasharatha", "sita"],
        },
      ],
    },
  },
  {
    id: "two-houses-recite-their-lineages",
    nodeIds: ["janaka", "kushadhvaja", "vasishta", "dasharatha", "vishvamitra", "mithila-court"],
    moment: {
      id: "two-houses-recite-their-lineages",
      decisiveChange: {
        en: "Genealogy becomes a public accountability ritual: both houses disclose the histories and obligations the new couples will inherit before extending the alliance to all four brothers.",
        hi: "वंश-कथा सार्वजनिक उत्तरदायित्व की विधि बनती है—दोनों घराने उन इतिहासों और दायित्वों को सामने रखते हैं जिन्हें नए दंपति पाएँगे, फिर संबंध चारों भाइयों तक बढ़ता है।",
      },
      beats: [
        {
          id: "janaka-calls-his-brother",
          title: { en: "Kushadhvaja must share the family's decision", hi: "कुशध्वज को परिवार के निर्णय में शामिल होना है" },
          narration: {
            en: "Janaka first summons his brother Kushadhvaja from Sankashya. He does not treat Sita and Urmila's marriages as an isolated royal command, because Kushadhvaja governs beside this household and has daughters of his own. The alliance enters a wider family network before anyone settles all four pairings.",
            hi: "जनक पहले अपने भाई कुशध्वज को सांकाश्य से बुलाते हैं। वे सीता और उर्मिला के विवाह को अकेली राजाज्ञा नहीं मानते, क्योंकि कुशध्वज इस परिवार के साथ शासन करते हैं और उनकी अपनी पुत्रियाँ भी हैं। चारों संबंध तय होने से पहले प्रस्ताव व्यापक पारिवारिक जाल में प्रवेश करता है।",
          },
          visualCue: "A route opens from Mithila to Sankashya and returns with Kushadhvaja, expanding the decision circle before the marriage paths are drawn.",
          characterIds: ["janaka", "kushadhvaja", "sita", "urmila"],
        },
        {
          id: "vasishta-turns-names-into-history",
          title: { en: "Vasishta tells what the Ikshvaku house carries", hi: "वसिष्ठ बताते हैं कि इक्ष्वाकु घराना क्या साथ लाता है" },
          narration: {
            en: "Vasishta recounts the Ayodhya line from ancient beginnings through famous rulers to Dasharatha and his four sons. The experience need not force users to memorise a column of names: the important movement is continuity—public duty, hard-won reputation, failures, and promises accumulating behind the young men now asking to join another family.",
            hi: "वसिष्ठ अयोध्या के वंश को प्राचीन आरंभ से प्रसिद्ध राजाओं, दशरथ और उनके चार पुत्रों तक सुनाते हैं। उपयोगकर्ता को नामों का लंबा स्तंभ याद करना आवश्यक नहीं; महत्त्वपूर्ण गति है निरंतरता—सार्वजनिक कर्तव्य, कमाई प्रतिष्ठा, असफलताएँ और वचन उन युवाओं के पीछे जमा हैं जो अब दूसरे परिवार से जुड़ेंगे।",
          },
          visualCue: "A few luminous ancestral milestones flow into Dasharatha and the four brothers, while dense names remain explorable side paths instead of blocking the main story.",
          characterIds: ["vasishta", "dasharatha", "rama", "lakshmana", "bharata", "shatrughna"],
        },
        {
          id: "janaka-answers-with-videha-line",
          title: { en: "Janaka answers with the history of Videha", hi: "जनक विदेह के इतिहास से उत्तर देते हैं" },
          narration: {
            en: "Janaka responds with the Videha line from Nimi and Mithi through the successive Janakas to himself and Kushadhvaja. He includes the conflict that placed the brothers in their present kingdoms. Disclosure is reciprocal: Sita and the other women are not entering an examined house from an invisible one; both families state who they are.",
            hi: "जनक निमि और मिथि से आरंभ होकर अनेक जनकों, स्वयं और कुशध्वज तक विदेह वंश बताते हैं। वे उस संघर्ष को भी शामिल करते हैं जिसने दोनों भाइयों को वर्तमान राज्यों में रखा। परिचय परस्पर है—सीता और अन्य युवतियाँ किसी अदृश्य घर से जाँचे गए घर में नहीं जा रहीं; दोनों परिवार अपना इतिहास सामने रखते हैं।",
          },
          visualCue: "Videha's lineage rises opposite Ayodhya's with equal visual weight, and both histories meet at the same open centre reserved for the couples.",
          characterIds: ["janaka", "kushadhvaja", "vasishta", "dasharatha"],
        },
        {
          id: "alliance-expands-to-four-couples",
          title: { en: "One proposal becomes four distinct partnerships", hi: "एक प्रस्ताव चार अलग साझेदारियों में बढ़ता है" },
          narration: {
            en: "Janaka offers Sita to Rama and Urmila to Lakshmana. Vishvamitra and Vasishta then propose Kushadhvaja's daughters Mandavi and Shrutakirti for Bharata and Shatrughna. The expansion is not four interchangeable royal matches; it creates four named relationships whose lives will later follow different emotional and political roads.",
            hi: "जनक सीता का विवाह राम से और उर्मिला का लक्ष्मण से प्रस्तावित करते हैं। विश्वामित्र तथा वसिष्ठ फिर कुशध्वज की पुत्रियों मांडवी और श्रुतकीर्ति का संबंध भरत तथा शत्रुघ्न से रखते हैं। यह चार समान राजकीय जोड़ियाँ नहीं; चार नामित रिश्ते हैं जिनके जीवन आगे अलग भावनात्मक और राजनीतिक राहों पर चलेंगे।",
          },
          visualCue: "Four separate paths form—Rama and Sita, Lakshmana and Urmila, Bharata and Mandavi, Shatrughna and Shrutakirti—then join without merging identities.",
          characterIds: ["rama", "sita", "lakshmana", "urmila", "bharata", "mandavi", "shatrughna", "shrutakirti"],
        },
        {
          id: "time-gifts-and-ancestors-prepare",
          title: { en: "Agreement becomes preparation", hi: "सहमति वास्तविक तैयारी में बदलती है" },
          narration: {
            en: "The households choose an auspicious time, perform ancestral remembrance, and distribute cattle and wealth before the weddings. These actions connect future couples to people beyond the hall—ancestors, dependants, priests, and communities. The family alliance is made materially visible before vows are spoken around the fire.",
            hi: "दोनों परिवार शुभ समय चुनते हैं, पूर्वजों का स्मरण करते हैं और विवाह से पहले गायें तथा धन बाँटते हैं। ये कार्य नए दंपतियों को सभा से बाहर के लोगों—पूर्वजों, आश्रितों, पुरोहितों और समुदाय—से जोड़ते हैं। अग्नि के सामने वचन से पहले ही पारिवारिक संबंध वास्तविक रूप में दिखाई देने लगता है।",
          },
          visualCue: "The four couple-paths connect outward to ancestor lamps, distributed cattle, workers, and gathered communities, making preparation part of the living world.",
          characterIds: ["dasharatha", "janaka", "vasishta", "kushadhvaja"],
        },
      ],
    },
  },
  {
    id: "four-brothers-four-marriages",
    nodeIds: ["rama", "sita", "lakshmana", "urmila", "bharata", "mandavi", "shatrughna", "shrutakirti", "wedding-fire"],
    moment: {
      id: "four-brothers-four-marriages",
      decisiveChange: {
        en: "Four named couples cross the wedding fire in one shared celebration, joining the houses without reducing the women or younger brothers to background figures.",
        hi: "चार नामित दंपति एक साझा उत्सव में विवाह-अग्नि की परिक्रमा करते हैं; घराने जुड़ते हैं, पर स्त्रियाँ और छोटे भाई पृष्ठभूमि नहीं बनते।",
      },
      beats: [
        {
          id: "pavilion-gathers-both-houses",
          title: { en: "The prepared world gathers around one fire", hi: "तैयार संसार एक अग्नि के चारों ओर जुटता है" },
          narration: {
            en: "The wedding pavilion is arranged with altar, vessels, flowers, grain, elders, visiting kin, musicians, and witnesses. Vasishta establishes the sacred fire and completes the shared rites. The setting makes the marriage public and relational: the couples do not disappear into a private cut-scene detached from the world they will inhabit.",
            hi: "विवाह-मंडप में वेदी, पात्र, फूल, अन्न, बड़े-बुज़ुर्ग, आए हुए संबंधी, संगीत और साक्षी व्यवस्थित हैं। वसिष्ठ अग्नि स्थापित कर साझा विधि पूरी करते हैं। विवाह सार्वजनिक और संबंधपूर्ण बनता है—दंपति उस संसार से कटी निजी झलक में गायब नहीं होते जिसमें उन्हें आगे जीना है।",
          },
          visualCue: "The pavilion assembles interactively around a central fire, with every family member and material connected to a readable purpose rather than decorative clutter.",
          characterIds: ["vasishta", "dasharatha", "janaka", "kushadhvaja"],
        },
        {
          id: "janaka-places-sita-beside-rama",
          title: { en: "Janaka gives Sita's hand and asks for partnership", hi: "जनक सीता का हाथ देकर साझेदारी का आग्रह करते हैं" },
          narration: {
            en: "Janaka brings Sita beside Rama, pours the ceremonial water, and asks him to receive her as a partner in shared duty. The bow feat recedes; the scene now concerns a person leaving one household and entering another. Sita stands at the centre of the transition rather than appearing as the prize attached to a broken object.",
            hi: "जनक सीता को राम के पास लाते हैं, विधि का जल अर्पित करते हैं और उन्हें साझा धर्म की सहचरी के रूप में स्वीकार करने को कहते हैं। धनुष-भंग पीछे चला जाता है; अब दृश्य एक व्यक्ति के एक घर से दूसरे घर में प्रवेश का है। सीता टूटे अस्त्र से जुड़ा पुरस्कार नहीं, परिवर्तन के केंद्र में खड़ी हैं।",
          },
          visualCue: "The broken bow motif dims outside the pavilion as Sita and Rama meet eye-to-eye beside the fire, with Janaka's release visible but not possessive.",
          characterIds: ["janaka", "sita", "rama"],
        },
        {
          id: "three-more-couples-step-forward",
          title: { en: "Urmila, Mandavi, and Shrutakirti enter their own vows", hi: "उर्मिला, मांडवी और श्रुतकीर्ति अपने वचनों में प्रवेश करती हैं" },
          narration: {
            en: "Urmila joins Lakshmana, Mandavi joins Bharata, and Shrutakirti joins Shatrughna. Each pairing receives a separate movement and name rather than being compressed into 'the brothers also married.' The shared ceremony binds the family, while distinct staging preserves four beginnings that will not have identical futures.",
            hi: "उर्मिला लक्ष्मण, मांडवी भरत और श्रुतकीर्ति शत्रुघ्न के साथ आगे आती हैं। हर जोड़ी को अलग गति और नाम मिलता है; उन्हें ‘बाकी भाइयों का भी विवाह हुआ’ में नहीं समेटा जाता। साझा विधि परिवार जोड़ती है, जबकि अलग प्रस्तुति चार ऐसे आरंभ बचाती है जिनका भविष्य एक जैसा नहीं होगा।",
          },
          visualCue: "Three additional couple-paths illuminate one after another around the same fire, each with its own colour, spacing, and return route into the larger family.",
          characterIds: ["lakshmana", "urmila", "bharata", "mandavi", "shatrughna", "shrutakirti"],
        },
        {
          id: "four-circles-around-the-fire",
          title: { en: "The couples complete the shared movement", hi: "चारों दंपति साझा परिक्रमा पूरी करते हैं" },
          narration: {
            en: "Hands joined, the couples circle the fire while blessings, music, and celebration fill the pavilion. The movement closes the formal transition but opens four new story routes. Users can follow any person from this hub—back to Mithila, forward to Ayodhya, or later into exile, governance, waiting, and family separation.",
            hi: "हाथ जोड़कर चारों दंपति अग्नि की परिक्रमा करते हैं और मंडप आशीर्वाद, संगीत तथा उत्सव से भर जाता है। यह गति औपचारिक परिवर्तन पूरा करती है, पर चार नई कथा-राहें खोलती है। उपयोगकर्ता यहाँ से किसी भी व्यक्ति के साथ चल सकता है—पीछे मिथिला, आगे अयोध्या या बाद में वनवास, शासन, प्रतीक्षा और पारिवारिक वियोग तक।",
          },
          visualCue: "Four orbiting paths complete around the fire, then extend outward as selectable story routes instead of ending on a frozen wedding portrait.",
          characterIds: ["rama", "sita", "lakshmana", "urmila", "bharata", "mandavi", "shatrughna", "shrutakirti"],
        },
        {
          id: "celebration-becomes-a-new-party",
          title: { en: "Two households become one travelling group", hi: "दो घराने एक यात्रा-दल में बदलते हैं" },
          narration: {
            en: "After the rites, the couples return to Dasharatha's encampment amid public celebration. The Ayodhya party is no longer the group that arrived: four women, their attendants, relationships, memories, and responsibilities now reshape it. The next road home must carry this expanded household rather than merely escort four victorious princes.",
            hi: "विधि के बाद सार्वजनिक उत्सव के बीच दंपति दशरथ के शिविर लौटते हैं। अयोध्या का दल अब वह नहीं रहा जो आया था—चार स्त्रियाँ, उनके परिचारक, संबंध, स्मृतियाँ और उत्तरदायित्व उसे नया रूप देते हैं। घर की अगली राह केवल चार विजयी राजकुमारों की वापसी नहीं, विस्तृत परिवार की यात्रा होगी।",
          },
          visualCue: "The outgoing party map redraws itself around four new centres of gravity, visibly changing every carriage, companion cluster, and future route.",
          characterIds: ["dasharatha", "rama", "sita", "lakshmana", "urmila", "bharata", "mandavi", "shatrughna", "shrutakirti"],
        },
      ],
    },
  },
  {
    id: "families-begin-homeward-road",
    nodeIds: ["vishvamitra", "janaka", "dasharatha", "rama", "sita", "mithila", "homeward-road"],
    moment: {
      id: "families-begin-homeward-road",
      decisiveChange: {
        en: "The wedding world disperses into separate roads, and a joyful homecoming is interrupted before the expanded household can reach Ayodhya.",
        hi: "विवाह का संसार अलग राहों में बिखरता है और विस्तृत परिवार अयोध्या पहुँचे, उससे पहले आनंदमय वापसी रुक जाती है।",
      },
      beats: [
        {
          id: "vishvamitra-leaves-the-story-road",
          title: { en: "The guide departs toward the northern mountains", hi: "मार्गदर्शक उत्तर पर्वतों की ओर चले जाते हैं" },
          narration: {
            en: "With the marriages complete, Vishvamitra greets the kings and leaves alone for the northern mountains. His departure closes the journey that began when he asked Dasharatha for Rama. The prince who left Ayodhya under a teacher's protection now returns married, tested, and able to meet the next threat without that guide beside him.",
            hi: "विवाह पूर्ण होने पर विश्वामित्र राजाओं को प्रणाम कर अकेले उत्तर पर्वतों की ओर चले जाते हैं। उनका जाना उस यात्रा को पूरा करता है जो दशरथ से राम को माँगने पर शुरू हुई थी। गुरु की रक्षा में अयोध्या छोड़ने वाला राजकुमार अब विवाहित, परीक्षित और अगले संकट से उनके बिना मिलने योग्य होकर लौट रहा है।",
          },
          visualCue: "Vishvamitra's path separates cleanly toward distant mountains while Rama's route bends homeward, preserving gratitude without keeping the mentor permanently attached.",
          characterIds: ["vishvamitra", "rama", "dasharatha"],
        },
        {
          id: "janaka-sends-daughters-forward",
          title: { en: "Janaka's farewell carries people, goods, and memory", hi: "जनक की विदाई लोगों, वस्तुओं और स्मृतियों को साथ भेजती है" },
          narration: {
            en: "Janaka gives cattle, cloth, vehicles, wealth, and attendants as his daughters leave. A modern journey view should neither romanticise every transfer nor reduce it to a loot counter. The visible truth is scale: moving four women into another royal household also moves support networks, labour, material security, and ties back to Mithila.",
            hi: "पुत्रियों की विदाई में जनक गायें, वस्त्र, वाहन, धन और परिचारक देते हैं। आधुनिक यात्रा-दृश्य को न हर लेन-देन का महिमामंडन करना चाहिए, न उसे खेल के लूट-अंक में बदलना। वास्तविक बात पैमाना है—चार स्त्रियों का दूसरे राजघराने में जाना सहायता-जाल, श्रम, भौतिक सुरक्षा और मिथिला से संबंध भी साथ ले जाता है।",
          },
          visualCue: "Farewell routes connect each departing woman to attendants, supplies, and luminous threads back to Mithila, making continuity visible through the movement.",
          characterIds: ["janaka", "sita", "urmila", "mandavi", "shrutakirti"],
        },
        {
          id: "omens-break-the-celebration",
          title: { en: "Bird cries and restless animals change the road", hi: "पक्षियों की पुकार और बेचैन पशु राह का भाव बदल देते हैं" },
          narration: {
            en: "As Dasharatha's party travels, harsh bird cries, frightened animals, wind, dust, and darkness unsettle the procession. Vasishta reads the signs as danger followed by possible relief, but nobody yet knows the form it will take. Wedding music drains away while the group instinctively tightens around the new couples.",
            hi: "दशरथ का दल आगे बढ़ता है तो तीखी पक्षी-पुकार, घबराए पशु, हवा, धूल और अँधेरा यात्रा को अस्थिर कर देते हैं। वसिष्ठ संकेतों में संकट और उसके बाद संभावित राहत देखते हैं, पर किसी को उसका रूप ज्ञात नहीं। विवाह-संगीत धीमा पड़ता है और दल सहज ही नए दंपतियों के चारों ओर सिमटता है।",
          },
          visualCue: "Colour and music fall from the road as dust erases the horizon, animals turn against the route, and the travelling formation closes defensively.",
          characterIds: ["dasharatha", "vasishta", "rama", "sita"],
        },
        {
          id: "parashurama-blocks-the-road",
          title: { en: "Another Rama appears with another bow", hi: "एक और राम, एक और धनुष लेकर राह रोकते हैं" },
          narration: {
            en: "Parashurama emerges from the storm carrying an axe and a second great bow. His history of violent vengeance against warrior kings makes the elders fear that an old campaign has returned. The newly joined household cannot simply travel around him; he addresses Rama directly and turns the road into an arena before Ayodhya is even visible.",
            hi: "तूफ़ान से परशुराम कुल्हाड़ी और दूसरा महान धनुष लेकर प्रकट होते हैं। क्षत्रिय राजाओं के विरुद्ध उनके हिंसक प्रतिशोध का इतिहास बड़ों को डराता है कि पुराना अभियान लौट आया है। नया जुड़ा परिवार उन्हें घेरकर आगे नहीं निकल सकता; वे सीधे राम को संबोधित करते हैं और अयोध्या दिखने से पहले राह को परीक्षा-स्थल बना देते हैं।",
          },
          visualCue: "Dust clears around Parashurama's solitary silhouette as his bow cuts across the entire road network, forcing every homeward route to stop.",
          characterIds: ["parashurama", "rama", "dasharatha", "sita", "vasishta"],
        },
      ],
    },
  },
  {
    id: "parashurama-tests-rama",
    nodeIds: ["parashurama", "rama", "dasharatha", "vasishta", "sita", "vishnu-bow", "homeward-road"],
    moment: {
      id: "parashurama-tests-rama",
      decisiveChange: {
        en: "Rama accepts a second bow test without surrendering dignity or killing the challenger, and Parashurama yields the road after recognising a transfer he can no longer resist.",
        hi: "राम सम्मान छोड़े या चुनौती देने वाले की हत्या किए बिना दूसरी धनुष-परीक्षा स्वीकारते हैं; परिवर्तन पहचानकर परशुराम राह छोड़ देते हैं।",
      },
      beats: [
        {
          id: "broken-bow-is-not-enough",
          title: { en: "Parashurama dismisses the first feat", hi: "परशुराम पहली उपलब्धि को पर्याप्त नहीं मानते" },
          narration: {
            en: "Parashurama says he has heard of Shiva's bow breaking but offers Vishnu's bow as the real measure. If Rama can string it, they will fight. The challenge changes celebration into hierarchy: the older warrior refuses to let a younger man's reputation stand until it has passed through his own standard.",
            hi: "परशुराम कहते हैं कि शिव-धनुष टूटने का समाचार सुना है, पर वास्तविक माप के लिए विष्णु का धनुष सामने रखते हैं। राम उसे चढ़ा सकें तो युद्ध होगा। चुनौती उत्सव को पदक्रम में बदल देती है—पुराना योद्धा युवा की प्रतिष्ठा को तब तक नहीं मानता जब तक वह उसके बनाए माप से न गुज़रे।",
          },
          visualCue: "The memory of the broken bow is pushed aside as Vishnu's intact bow enters between the two Ramas like a new and deliberately harsher gate.",
          characterIds: ["parashurama", "rama", "vishnu-bow"],
        },
        {
          id: "dasharatha-pleads-for-his-sons",
          title: { en: "Dasharatha's old fear returns on the wedding road", hi: "विवाह की राह पर दशरथ का पुराना भय लौटता है" },
          narration: {
            en: "Dasharatha folds his hands and reminds Parashurama that he had laid down his campaign against warrior kings. He begs him not to destroy his young sons and says the whole family would die with Rama. The father who once resisted Vishvamitra's request is again watching danger choose one child in front of him.",
            hi: "दशरथ हाथ जोड़कर याद दिलाते हैं कि परशुराम क्षत्रिय राजाओं के विरुद्ध अभियान छोड़ चुके थे। वे युवा पुत्रों को नष्ट न करने की विनती करते हैं और कहते हैं कि राम के साथ पूरा परिवार मर जाएगा। जो पिता कभी विश्वामित्र की माँग से डरे थे, वे फिर सामने संकट को एक पुत्र चुनते देख रहे हैं।",
          },
          visualCue: "The homeward family formation collapses inward around Dasharatha as the earlier Ayodhya farewell fear returns in a sharper, public form.",
          characterIds: ["dasharatha", "parashurama", "rama", "sita"],
        },
        {
          id: "two-bows-carry-an-old-rivalry",
          title: { en: "Parashurama explains the weapons behind the test", hi: "परशुराम परीक्षा के पीछे दोनों धनुषों का इतिहास बताते हैं" },
          narration: {
            en: "Parashurama tells how the two great bows were associated with Shiva and Vishnu and how rivalry once tested their strength. The bow he carries came through his own family; his identity and accumulated power are invested in it. Rama is therefore not handling neutral equipment but the challenger's inheritance, grievance, and claim to supremacy.",
            hi: "परशुराम बताते हैं कि दो महान धनुष शिव और विष्णु से कैसे जुड़े और पुरानी प्रतिद्वंद्विता ने उनकी शक्ति की परीक्षा कैसे ली। उनके हाथ का धनुष परिवार से मिला है; उनकी पहचान और संचित शक्ति उसमें लगी है। इसलिए राम कोई निष्पक्ष उपकरण नहीं, चुनौती देने वाले की विरासत, पीड़ा और श्रेष्ठता का दावा हाथ में लेते हैं।",
          },
          visualCue: "The two bows open into a layered mythic history, then collapse back into the inherited weapon Parashurama is physically placing in Rama's hands.",
          characterIds: ["parashurama", "rama", "shiva", "vishnu"],
        },
        {
          id: "rama-answers-the-insult",
          title: { en: "Respect does not require Rama to accept humiliation", hi: "सम्मान का अर्थ अपमान स्वीकार करना नहीं" },
          narration: {
            en: "Rama acknowledges Parashurama's history and standing but says the challenge treats him as weak and unworthy of his warrior duty. In deference to his father he has remained controlled; he will not remain passive. His answer draws a boundary without insulting Dasharatha, abandoning courtesy, or beginning with lethal force.",
            hi: "राम परशुराम के इतिहास और स्थान को स्वीकार करते हैं, पर कहते हैं कि चुनौती उन्हें दुर्बल और क्षत्रिय-कर्तव्य के अयोग्य मानती है। पिता की उपस्थिति में वे संयमित रहे हैं; अब निष्क्रिय नहीं रहेंगे। उनका उत्तर दशरथ का अपमान, शिष्टता का त्याग या घातक आक्रमण किए बिना सीमा खींचता है।",
          },
          visualCue: "Rama steps out from Dasharatha's protective line but keeps his weapon lowered, creating visible firmness without transforming restraint into submission.",
          characterIds: ["rama", "parashurama", "dasharatha"],
        },
        {
          id: "arrow-must-have-a-destination",
          title: { en: "The bow yields, and the drawn arrow cannot be wasted", hi: "धनुष झुकता है और चढ़ा बाण व्यर्थ नहीं जा सकता" },
          narration: {
            en: "Rama takes, strings, and draws Vishnu's bow with the offered arrow. He refuses to kill Parashurama because of his ascetic standing and connection to Vishvamitra, but explains that the charged arrow needs a target. He offers a choice: lose the power of swift movement or the heavenly regions earned through austerity.",
            hi: "राम विष्णु का धनुष लेकर उस पर दिया बाण चढ़ाकर खींचते हैं। परशुराम की तपस्वी स्थिति और विश्वामित्र से संबंध के कारण वे उनकी हत्या से इंकार करते हैं, पर बताते हैं कि संधान किया बाण लक्ष्य माँगता है। वे विकल्प देते हैं—तीव्र गति की शक्ति जाए या तपस्या से कमाए दिव्य लोक।",
          },
          visualCue: "The drawn arrow lights two possible destinations beside Parashurama—his road through the world and his accumulated celestial realm—while his life remains unmarked.",
          characterIds: ["rama", "parashurama", "vishnu-bow", "vishvamitra"],
        },
        {
          id: "parashurama-yields-the-road",
          title: { en: "Recognition ends the challenge and reopens the way home", hi: "पहचान चुनौती समाप्त करती है और घर की राह खोलती है" },
          narration: {
            en: "Parashurama recognises Vishnu's power in Rama, asks to keep the movement needed to return to Mahendra, and yields the spiritual regions he had earned. Rama releases the arrow accordingly. The challenger circles him in respect and departs; Dasharatha embraces his son, the darkness clears, and the expanded family finally reaches Ayodhya.",
            hi: "परशुराम राम में विष्णु की शक्ति पहचानते हैं, महेंद्र लौटने योग्य गति बचाने को कहते हैं और तपस्या से कमाए लोक छोड़ते हैं। राम उसी अनुसार बाण छोड़ते हैं। चुनौती देने वाले सम्मान से परिक्रमा कर चले जाते हैं; दशरथ पुत्र को गले लगाते हैं, अँधेरा हटता है और विस्तृत परिवार अंततः अयोध्या पहुँचता है।",
          },
          visualCue: "The arrow clears the blocked road without striking a body; Parashurama's path turns toward Mahendra while Ayodhya's lights reappear ahead of the family.",
          characterIds: ["parashurama", "rama", "dasharatha", "sita"],
        },
      ],
    },
  },
];
