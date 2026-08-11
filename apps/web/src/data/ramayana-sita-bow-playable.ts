import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

/** Complete consumer scenes for Balakanda 49-65 in the selected Dutt expression. */
export const RAMAYANA_SITA_BOW_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "shatananda-greets-mothers-restorer",
    nodeIds: ["shatananda", "ahalya", "gautama", "rama", "vishvamitra", "mithila"],
    moment: {
      id: "shatananda-greets-mothers-restorer",
      decisiveChange: {
        en: "Shatananda's relief at his parents' reunion becomes a new invitation: Rama must understand the unfinished human struggle inside his formidable guide.",
        hi: "माता-पिता के पुनर्मिलन पर शतानंद की राहत एक नए निमंत्रण में बदलती है—राम को अपने प्रबल गुरु के भीतर चलती रही मानवीय लड़ाई समझनी होगी।",
      },
      beats: [
        {
          id: "shatananda-asks-about-ahalya",
          title: { en: "A son needs to know what happened at the hermitage", hi: "एक पुत्र जानना चाहता है कि आश्रम में क्या हुआ" },
          narration: {
            en: "When Shatananda hears that the travellers passed through Gautama's hermitage, public ceremony gives way to urgent family questions. Did Rama see Ahalya, hear what had happened to her, receive her welcome, and witness Gautama return? The priest of Mithila speaks first as a son who has lived with a broken household.",
            hi: "जब शतानंद सुनते हैं कि यात्री गौतम के आश्रम से आए हैं, तो सार्वजनिक औपचारिकता तत्काल पारिवारिक प्रश्नों में बदल जाती है। क्या राम ने अहल्या को देखा, उनकी कथा सुनी, उनका आतिथ्य स्वीकार किया और गौतम को लौटते देखा? मिथिला के पुरोहित पहले उस पुत्र की तरह बोलते हैं जिसने टूटे परिवार का भार सहा है।",
          },
          visualCue: "The crowded Mithila welcome falls out of focus as remembered paths reconnect Shatananda with Ahalya and Gautama's quiet hermitage.",
          characterIds: ["shatananda", "ahalya", "gautama", "rama"],
        },
        {
          id: "rama-confirms-the-reunion",
          title: { en: "Rama answers with a completed return", hi: "राम पुनर्मिलन की पूरी खबर देते हैं" },
          narration: {
            en: "Rama confirms that Ahalya received the brothers and that Gautama returned to the shared ascetic life. The answer does not erase the years of isolation or settle every moral difficulty in her story. It gives Shatananda one concrete relief: the separation he feared is no longer the family's present condition.",
            hi: "राम बताते हैं कि अहल्या ने दोनों भाइयों का स्वागत किया और गौतम लौटकर उनके साथ तपस्वी जीवन में जुड़ गए। यह उत्तर वर्षों के एकांत को मिटाता नहीं और कथा की हर नैतिक कठिनाई का सरल समाधान भी नहीं देता। पर शतानंद को एक ठोस राहत मिलती है—जिस वियोग का उन्हें भय था, वह अब परिवार की वर्तमान दशा नहीं है।",
          },
          visualCue: "Two separated lights in the remembered hermitage move together while the long shadow of the intervening years remains visible behind them.",
          characterIds: ["rama", "shatananda", "ahalya", "gautama"],
        },
        {
          id: "gratitude-turns-to-vishvamitra",
          title: { en: "Shatananda turns gratitude toward the guide", hi: "शतानंद कृतज्ञता को गुरु की ओर मोड़ते हैं" },
          narration: {
            en: "Relieved, Shatananda honours Rama and then tells him how fortunate he is to travel under Vishvamitra's protection. His praise is not a list of titles. He promises the story of how a powerful king was defeated by the limits of force, wounded others through anger, began again many times, and eventually became the teacher now beside Rama.",
            hi: "राहत मिलने पर शतानंद राम का सम्मान करते हैं और बताते हैं कि विश्वामित्र के संरक्षण में यात्रा करना कितना महत्त्वपूर्ण है। उनकी प्रशंसा उपाधियों की सूची नहीं है। वे उस शक्तिशाली राजा की कथा आरंभ करते हैं जिसे बल की सीमा ने हराया, जिसने क्रोध में दूसरों को चोट पहुँचाई, बार-बार फिर शुरू किया और अंततः राम के साथ खड़े गुरु का रूप पाया।",
          },
          visualCue: "Vishvamitra's still figure divides into layered memories of a crowned king, a defeated warrior, an angry ascetic, and a patient teacher.",
          characterIds: ["shatananda", "rama", "vishvamitra"],
        },
        {
          id: "rama-enters-his-teachers-past",
          title: { en: "The bow journey pauses for the teacher's hidden road", hi: "धनुष की यात्रा गुरु की छिपी राह के लिए रुकती है" },
          narration: {
            en: "Rama came to Mithila expecting to see a legendary bow, but the next doorway opens backward into his teacher's life. This detour changes how the listener reads everything Vishvamitra has already done: disciplined guidance in the present was earned through a past full of appetite, rivalry, compassion, humiliation, and costly repair.",
            hi: "राम मिथिला में एक प्रसिद्ध धनुष देखने आए थे, पर अगला द्वार पीछे—उनके गुरु के जीवन में—खुलता है। यह अंतर्कथा विश्वामित्र के अब तक के हर कार्य को नया अर्थ देती है। वर्तमान का संयमित मार्गदर्शन ऐसे अतीत से निकला है जिसमें लालसा, प्रतिद्वंद्विता, करुणा, अपमान और महँगा आत्म-सुधार सब शामिल थे।",
          },
          visualCue: "The sealed bow chamber recedes while an older road unfurls beneath Vishvamitra's feet, inviting Rama and the audience into its first turning point.",
          characterIds: ["rama", "vishvamitra", "shatananda", "janaka"],
        },
      ],
    },
  },
  {
    id: "king-vishvamitra-meets-vasishta",
    nodeIds: ["vishvamitra", "vasishta", "shabala", "vasishta-hermitage", "vishvamitra-army", "brahma-staff"],
    moment: {
      id: "king-vishvamitra-meets-vasishta",
      decisiveChange: {
        en: "A king who expects wealth to yield to rank meets a power that cannot be bought or seized, and defeat redirects his entire life.",
        hi: "जो राजा मानता है कि पद के सामने संपत्ति झुक जाएगी, वह ऐसी शक्ति से मिलता है जिसे न खरीदा जा सकता है, न छीना; पराजय उसके पूरे जीवन की दिशा बदल देती है।",
      },
      beats: [
        {
          id: "army-enters-a-small-hermitage",
          title: { en: "A royal army enters Vasishta's quiet world", hi: "राजकीय सेना वसिष्ठ के शांत संसार में प्रवेश करती है" },
          narration: {
            en: "In his former life, King Vishvamitra reaches Vasishta's hermitage while travelling with a vast army. Vasishta welcomes the king, asks after the people he governs, and insists on feeding the entire company. The scale seems impossible: a forest household is offering more care than a royal expedition expects it can provide.",
            hi: "अपने पूर्व जीवन में राजा विश्वामित्र विशाल सेना के साथ यात्रा करते हुए वसिष्ठ के आश्रम पहुँचते हैं। वसिष्ठ राजा का स्वागत करते हैं, उनकी प्रजा की कुशल पूछते हैं और पूरे दल को भोजन कराने पर अडिग रहते हैं। यह अनुपात असंभव लगता है—वन का छोटा आश्रम राजकीय अभियान की अपेक्षा से कहीं अधिक आतिथ्य देने वाला है।",
          },
          visualCue: "Rows of soldiers and animals fill the forest edge while Vasishta's modest clearing remains calm, open, and unexpectedly sufficient.",
          characterIds: ["vishvamitra", "vasishta", "vishvamitra-army"],
        },
        {
          id: "shabala-makes-abundance",
          title: { en: "Shabala turns hospitality into abundance", hi: "शबला आतिथ्य को समृद्धि में बदल देती है" },
          narration: {
            en: "At Vasishta's call, Shabala produces food, drink, vessels, and every required provision until the whole army is satisfied. She is not displayed as an idle treasure in a storehouse; her abundance sustains the hermitage's duties, guests, offerings, and community. Vishvamitra sees the result but interprets living relationship as transferable royal property.",
            hi: "वसिष्ठ के बुलाने पर शबला भोजन, पेय, पात्र और हर आवश्यक सामग्री प्रकट करती है, जब तक पूरी सेना तृप्त नहीं हो जाती। वह भंडार में रखी निष्क्रिय संपत्ति नहीं है; उसकी समृद्धि आश्रम के कर्तव्य, अतिथि, अर्पण और समुदाय को सँभालती है। विश्वामित्र परिणाम देखते हैं, पर जीवित संबंध को राजकीय संपत्ति समझ लेते हैं।",
          },
          visualCue: "Provision flows outward from Shabala through the hermitage like a living network, feeding thousands without turning her into a decorative prize.",
          characterIds: ["shabala", "vasishta", "vishvamitra", "vishvamitra-army"],
        },
        {
          id: "offer-becomes-command",
          title: { en: "The king's generous offer becomes coercion", hi: "राजा का उदार प्रस्ताव दबाव में बदल जाता है" },
          narration: {
            en: "Vishvamitra offers cattle, gold, elephants, horses, and finally his kingdom in exchange for Shabala. Vasishta refuses because she is inseparable from the practices and responsibilities of the hermitage. Unable to accept that refusal, the king changes the meaning of sovereignty from stewardship into entitlement and orders her taken by force.",
            hi: "विश्वामित्र शबला के बदले गायें, सोना, हाथी, घोड़े और अंततः अपना राज्य तक देने का प्रस्ताव रखते हैं। वसिष्ठ मना करते हैं क्योंकि वह आश्रम के जीवन और उत्तरदायित्वों से अलग नहीं की जा सकती। अस्वीकार स्वीकार न कर पाने पर राजा शासन को संरक्षण नहीं, अधिकार समझ लेते हैं और उसे बलपूर्वक ले जाने का आदेश देते हैं।",
          },
          visualCue: "Mounting piles of royal wealth fail to cross the bond between Shabala and the hermitage; bright offer-lines then harden into chains.",
          characterIds: ["vishvamitra", "vasishta", "shabala"],
        },
        {
          id: "shabala-refuses-abandonment",
          title: { en: "Shabala runs back and asks whether she was abandoned", hi: "शबला लौटकर पूछती है—क्या मुझे छोड़ दिया गया?" },
          narration: {
            en: "Dragged away by royal servants, Shabala breaks free, returns to Vasishta, and asks what fault made him abandon her. Vasishta says he has not abandoned her; the king's armed power simply exceeds his ordinary means. Given permission to defend their shared home, Shabala creates fighters who destroy the invading force at terrible cost.",
            hi: "राजकीय सेवकों द्वारा घसीटी जा रही शबला छूटकर वसिष्ठ के पास लौटती है और पूछती है कि किस दोष के कारण उन्हें त्याग दिया गया। वसिष्ठ कहते हैं कि उन्होंने उसे छोड़ा नहीं; राजा की सशस्त्र शक्ति उनके सामान्य साधनों से बड़ी है। साझा घर की रक्षा की अनुमति पाकर शबला योद्धा उत्पन्न करती है और भारी विनाश के साथ आक्रमणकारी सेना को रोकती है।",
          },
          visualCue: "Shabala's return changes the camera from the king's inventory view to her frightened face before the hermitage erupts into a defensive storm.",
          characterIds: ["shabala", "vasishta", "vishvamitra", "vishvamitra-army"],
        },
        {
          id: "weapons-fail-before-brahma-staff",
          title: { en: "Every celestial weapon disappears into one staff", hi: "हर दिव्य अस्त्र एक ब्रह्मदंड में शांत हो जाता है" },
          narration: {
            en: "After losing his army and sons, Vishvamitra acquires a terrifying range of celestial weapons and returns to burn the hermitage. Vasishta raises his Brahma staff. Fire, water, wind, illusion, and the final supreme weapon are absorbed or quenched, leaving the attacker exhausted and the ascetic's authority intact.",
            hi: "सेना और पुत्रों को खोने के बाद विश्वामित्र अनेक भयंकर दिव्य अस्त्र प्राप्त कर आश्रम नष्ट करने लौटते हैं। वसिष्ठ ब्रह्मदंड उठाते हैं। अग्नि, जल, वायु, भ्रम और अंतिम परम अस्त्र तक उसी में शांत या समाहित हो जाते हैं; आक्रमणकारी थककर रह जाता है और तपस्वी की शक्ति अडिग रहती है।",
          },
          visualCue: "A torrent of differently coloured weapons bends into Vasishta's single unadorned staff until the battlefield becomes abruptly silent.",
          characterIds: ["vishvamitra", "vasishta", "brahma-staff"],
        },
        {
          id: "defeat-becomes-a-new-ambition",
          title: { en: "Humiliation redirects Vishvamitra, but does not yet heal him", hi: "अपमान विश्वामित्र की दिशा बदलता है, पर उन्हें अभी स्वस्थ नहीं करता" },
          narration: {
            en: "Vishvamitra finally admits that royal and military power cannot overcome the discipline he has witnessed. He resolves to gain spiritual power through austerity. Yet his first motive still carries comparison and conquest: he wants to become what defeated him. The long road ahead must transform not only his abilities but the hunger driving them.",
            hi: "विश्वामित्र स्वीकार करते हैं कि राजकीय और सैन्य शक्ति उस साधना को नहीं हरा सकती जिसे उन्होंने देखा। वे तपस्या से आध्यात्मिक शक्ति पाने का संकल्प लेते हैं। फिर भी आरंभिक प्रेरणा में तुलना और विजय छिपी है—वे वही बनना चाहते हैं जिसने उन्हें हराया। आगे की लंबी राह को उनकी क्षमता ही नहीं, उसे चलाने वाली भूख भी बदलनी होगी।",
          },
          visualCue: "The ruined king walks away from discarded weapons toward a narrow ascetic path, while Vasishta's staff remains a distant measure he still wants to surpass.",
          characterIds: ["vishvamitra", "vasishta", "shabala"],
        },
      ],
    },
  },
  {
    id: "trishanku-suspended-between-worlds",
    nodeIds: ["vishvamitra", "trishanku", "vasishta-sons", "indra", "southern-hermitage", "trishanku-sky"],
    moment: {
      id: "trishanku-suspended-between-worlds",
      decisiveChange: {
        en: "Vishvamitra shelters a rejected king but turns rescue into a contest with heaven, creating a dazzling refuge that also records the danger of his anger.",
        hi: "विश्वामित्र एक अस्वीकृत राजा को शरण देते हैं, पर बचाव को स्वर्ग से प्रतिस्पर्धा बना देते हैं; नया आश्रय करुणा के साथ उनके क्रोध का खतरा भी दर्ज करता है।",
      },
      beats: [
        {
          id: "recognition-still-feels-too-small",
          title: { en: "A thousand years earn a title he considers insufficient", hi: "हज़ार वर्ष बाद मिली उपाधि भी उन्हें छोटी लगती है" },
          narration: {
            en: "After long austerities, Vishvamitra is recognised as a royal sage, but he hears the title as proof that he has not reached Vasishta's standing. His practice has produced real change and power, yet the old comparison still decides whether achievement feels meaningful. At this vulnerable point, Trishanku arrives carrying another refusal.",
            hi: "दीर्घ तपस्या के बाद विश्वामित्र को राजर्षि माना जाता है, पर वे इस उपाधि को इस प्रमाण की तरह सुनते हैं कि वे अभी वसिष्ठ के स्तर तक नहीं पहुँचे। साधना ने वास्तविक परिवर्तन और शक्ति दी है, फिर भी पुरानी तुलना तय करती है कि उपलब्धि पर्याप्त है या नहीं। इसी संवेदनशील समय त्रिशंकु एक और अस्वीकृति लेकर आते हैं।",
          },
          visualCue: "A title of light settles above Vishvamitra but appears dim beside his remembered image of Vasishta, leaving the achievement emotionally unfinished.",
          characterIds: ["vishvamitra", "vasishta", "trishanku"],
        },
        {
          id: "trishanku-arrives-cursed-and-alone",
          title: { en: "A king rejected by his teachers asks for refuge", hi: "गुरुओं से अस्वीकृत राजा शरण माँगता है" },
          narration: {
            en: "Trishanku wants to reach heaven in his living body. Vasishta refuses, and when the king seeks help from Vasishta's sons, the conflict ends in a curse that changes his appearance and strips away public status. Former companions flee. He reaches Vishvamitra marked as an outcast and insists he has nowhere else to go.",
            hi: "त्रिशंकु जीवित शरीर सहित स्वर्ग जाना चाहते हैं। वसिष्ठ मना करते हैं और जब राजा उनके पुत्रों से सहायता माँगते हैं, तो विवाद ऐसे शाप पर समाप्त होता है जो उनका रूप बदल देता है और सार्वजनिक प्रतिष्ठा छीन लेता है। पुराने साथी भाग जाते हैं। बहिष्कृत चिह्नों के साथ वे विश्वामित्र के पास पहुँचकर कहते हैं कि अब कोई और आश्रय नहीं है।",
          },
          visualCue: "Royal ornaments fall away from Trishanku as every familiar figure retreats, leaving one uncertain path toward Vishvamitra's firelit camp.",
          characterIds: ["trishanku", "vasishta", "vasishta-sons", "vishvamitra"],
        },
        {
          id: "refuge-mixes-with-rivalry",
          title: { en: "Vishvamitra says fear not—and revives an old contest", hi: "विश्वामित्र कहते हैं ‘डरो मत’—और पुरानी प्रतिस्पर्धा फिर जागती है" },
          narration: {
            en: "Moved by the abandoned king, Vishvamitra promises protection and gathers sages for a sacrifice. Compassion is genuine, but refusal by Vasishta's side reactivates his rage. He curses those who insult him, and other sages participate partly because they fear his anger. A rescue mission is already becoming a test of personal authority.",
            hi: "त्यागे गए राजा को देखकर विश्वामित्र रक्षा का वचन देते हैं और यज्ञ के लिए ऋषियों को बुलाते हैं। करुणा वास्तविक है, पर वसिष्ठ के पक्ष से आया अस्वीकार फिर उनका क्रोध जगा देता है। वे अपमान करने वालों को शाप देते हैं और अन्य ऋषि आंशिक रूप से उनके रोष के भय से शामिल होते हैं। बचाव का कार्य व्यक्तिगत शक्ति की परीक्षा बनने लगता है।",
          },
          visualCue: "Vishvamitra's sheltering hand casts two shadows—one protective around Trishanku, the other reaching angrily toward Vasishta's absent household.",
          characterIds: ["vishvamitra", "trishanku", "vasishta-sons"],
        },
        {
          id: "rise-fall-and-command-to-stop",
          title: { en: "Trishanku rises, falls, and is caught by one command", hi: "त्रिशंकु ऊपर उठते, गिरते और एक आदेश पर रुक जाते हैं" },
          narration: {
            en: "The rite sends Trishanku upward, but Indra refuses him entry and casts him headfirst back toward earth. As the king falls crying for rescue, Vishvamitra orders him to stop. He hangs upside down between destinations—saved from impact, still excluded from the heaven he sought, and now dependent on the sage's continuing will.",
            hi: "यज्ञ त्रिशंकु को ऊपर उठाता है, पर इंद्र प्रवेश रोककर उन्हें सिर के बल पृथ्वी की ओर गिरा देते हैं। गिरते हुए राजा सहायता पुकारते हैं और विश्वामित्र एक आदेश से उन्हें रोक देते हैं। वे दोनों गंतव्यों के बीच उलटे लटकते हैं—टकराने से बचे, इच्छित स्वर्ग से बाहर और अब ऋषि के लगातार संकल्प पर निर्भर।",
          },
          visualCue: "The camera follows Trishanku from rising flame to sudden descent, then freezes with earth below and a closed celestial gate above.",
          characterIds: ["trishanku", "vishvamitra", "indra"],
        },
        {
          id: "a-new-sky-preserves-the-compromise",
          title: { en: "A new constellation becomes both refuge and warning", hi: "नया नक्षत्र आश्रय भी बनता है और चेतावनी भी" },
          narration: {
            en: "Furious, Vishvamitra begins creating new stars and threatens a rival heaven. The gods negotiate: Trishanku may remain luminous in the southern sky, but outside their established order and still inverted. The compromise honours the promise of refuge while preserving, in the night itself, how close compassion came to cosmic retaliation.",
            hi: "क्रोधित विश्वामित्र नए तारे रचने लगते हैं और दूसरा स्वर्ग बनाने की ओर बढ़ते हैं। देवता समझौता करते हैं—त्रिशंकु दक्षिणी आकाश में प्रकाशमान रहेंगे, पर स्थापित व्यवस्था से बाहर और उलटी अवस्था में। यह समाधान शरण के वचन को निभाता है, साथ ही रात के आकाश में दर्ज करता है कि करुणा कितनी जल्दी ब्रह्मांडीय प्रतिशोध के पास पहुँच गई थी।",
          },
          visualCue: "New stars ignite around the suspended king, beautiful at first glance, while their inverted geometry retains the unresolved conflict that formed them.",
          characterIds: ["vishvamitra", "trishanku", "indra", "celestials"],
        },
      ],
    },
  },
  {
    id: "sunashepa-finds-words-to-live",
    nodeIds: ["sunahshepa", "vishvamitra", "ambarisha", "richika", "pushkara", "sacrifice-ground"],
    moment: {
      id: "sunashepa-finds-words-to-live",
      decisiveChange: {
        en: "A boy treated as a purchasable substitute finds an advocate, a voice, and a route to survival without hiding the adults' unequal choices.",
        hi: "खरीदे जा सकने वाले विकल्प की तरह देखे गए बालक को सहायक, अपनी आवाज़ और जीवित रहने की राह मिलती है—बड़ों के असमान निर्णय छिपाए बिना।",
      },
      beats: [
        {
          id: "a-lost-animal-becomes-a-human-demand",
          title: { en: "A failed sacrifice transfers its danger to a child", hi: "असफल यज्ञ का संकट एक बच्चे पर डाल दिया जाता है" },
          narration: {
            en: "When King Ambarisha's sacrificial animal disappears, his advisers demand a human substitute. After searching widely, the king offers wealth to Richika's family for one son. The father protects the eldest, the mother protects the youngest, and the middle child Sunahshepa hears himself defined as the one neither parent has reserved.",
            hi: "राजा अंबरीष का यज्ञ-पशु गायब होने पर पुरोहित मानव विकल्प की माँग करते हैं। बहुत खोज के बाद राजा ऋचीक के परिवार से एक पुत्र के बदले धन देते हैं। पिता ज्येष्ठ को बचाते हैं, माता कनिष्ठ को; बीच का पुत्र शुनःशेप सुनता है कि वही है जिसे किसी माता-पिता ने अपने लिए सुरक्षित नहीं रखा।",
          },
          visualCue: "The family forms two protective circles around the eldest and youngest, leaving Sunahshepa alone in the exposed centre beside the offered wealth.",
          characterIds: ["sunahshepa", "ambarisha", "richika", "sunahshepa-mother"],
        },
        {
          id: "sunahshepa-runs-to-his-uncle",
          title: { en: "At Pushkara, the boy chooses whom to ask", hi: "पुष्कर में बालक स्वयं तय करता है कि सहायता किससे माँगे" },
          narration: {
            en: "During a midday halt at Pushkara, exhausted and thirsty Sunahshepa sees his maternal uncle Vishvamitra and throws himself into his lap. He asks not for the king's death or the rite's ruin, but for a way in which Ambarisha may complete his purpose and he may still live. His plea restores moral imagination where the adults accepted a binary choice.",
            hi: "पुष्कर में दोपहर के विश्राम के समय थके और प्यासे शुनःशेप अपने मामा विश्वामित्र को देखकर उनकी गोद में गिर पड़ते हैं। वे राजा की मृत्यु या यज्ञ के विनाश की माँग नहीं करते; वे ऐसी राह चाहते हैं जिसमें अंबरीष का उद्देश्य पूरा हो और वे स्वयं भी जीवित रहें। उनकी विनती वहाँ नैतिक कल्पना लौटाती है जहाँ बड़े केवल दो कठोर विकल्प मान चुके थे।",
          },
          visualCue: "The caravan pauses by Pushkara as Sunahshepa breaks from its fixed route and reaches the first adult who sees both lives inside the problem.",
          characterIds: ["sunahshepa", "vishvamitra", "ambarisha"],
        },
        {
          id: "vishvamitra-sons-refuse-substitution",
          title: { en: "Vishvamitra offers his sons—and answers refusal with a curse", hi: "विश्वामित्र अपने पुत्रों को आगे रखते हैं—और अस्वीकार पर शाप देते हैं" },
          narration: {
            en: "Vishvamitra asks his own sons to take Sunahshepa's place, presenting the exchange as family duty and rescue. They refuse, protesting that saving another by sacrificing one's own child reverses the same moral problem. Vishvamitra responds with a devastating curse. His wish to protect one vulnerable boy remains entangled with coercion toward others.",
            hi: "विश्वामित्र अपने पुत्रों से शुनःशेप का स्थान लेने को कहते हैं और इसे परिवार का कर्तव्य तथा बचाव बताते हैं। वे मना करते हैं—किसी दूसरे को बचाने के लिए अपने ही बच्चे को बलि देना उसी नैतिक समस्या को उलट देता है। विश्वामित्र भयंकर शाप से उत्तर देते हैं। एक असहाय बालक की रक्षा की इच्छा अब भी दूसरों पर दबाव से उलझी है।",
          },
          visualCue: "A rescue path offered to Sunahshepa crosses a second group of unwilling sons, then fractures under Vishvamitra's flash of anger.",
          characterIds: ["vishvamitra", "sunahshepa", "vishvamitra-sons"],
        },
        {
          id: "words-create-a-third-outcome",
          title: { en: "The boy carries the prayers that keep him alive", hi: "बालक वे प्रार्थनाएँ लेकर जाता है जो उसे जीवित रखती हैं" },
          narration: {
            en: "Vishvamitra teaches Sunahshepa two prayers and tells him when to speak them at the sacrificial post. Bound, marked, and brought into the rite, the boy uses the words himself. The gods respond, grant him long life, and allow the sacrifice to conclude. Survival comes through his voiced appeal, not through pretending no danger occurred.",
            hi: "विश्वामित्र शुनःशेप को दो प्रार्थनाएँ सिखाते हैं और बताते हैं कि यज्ञ-स्तंभ पर उन्हें कब बोलना है। बाँधे, चिह्नित और अनुष्ठान में लाए गए बालक वे शब्द स्वयं कहते हैं। देवता उत्तर देते हैं, उन्हें दीर्घ जीवन मिलता है और यज्ञ भी पूर्ण होता है। बचाव उसकी अपनी कही पुकार से आता है, यह मान लेने से नहीं कि कोई संकट था ही नहीं।",
          },
          visualCue: "At the sacrificial post, Sunahshepa's own voice travels upward as two clear waves, interrupting the machinery that had reduced him to an object.",
          characterIds: ["sunahshepa", "vishvamitra", "ambarisha", "indra"],
        },
      ],
    },
  },
  {
    id: "vishvamitra-outlasts-desire-and-anger",
    nodeIds: ["vishvamitra", "menaka", "shakuntala", "rambha", "vasishta", "brahma", "pushkara"],
    moment: {
      id: "vishvamitra-outlasts-desire-and-anger",
      decisiveChange: {
        en: "Vishvamitra reaches the recognition he sought only after repeated achievement stops being enough and he learns not to turn desire, insult, hunger, or power into another person's punishment.",
        hi: "विश्वामित्र को इच्छित मान्यता तभी मिलती है जब बार-बार की उपलब्धि पर्याप्त लगना बंद होती है और वे इच्छा, अपमान, भूख या शक्ति को किसी दूसरे की सजा में बदलना छोड़ते हैं।",
      },
      beats: [
        {
          id: "success-keeps-an-old-measuring-stick",
          title: { en: "Each title reveals the comparison still ruling him", hi: "हर उपाधि दिखाती है कि पुरानी तुलना अभी भी उन्हें चला रही है" },
          narration: {
            en: "After Sunahshepa survives, Vishvamitra returns to austerity and receives greater recognition. Each time, he asks whether the final title—Brahmarshi—has been granted and whether his senses are truly mastered. The question is honest, but it also shows that an external rank and Vasishta's standing still control the meaning of his inner work.",
            hi: "शुनःशेप के बचने के बाद विश्वामित्र फिर तपस्या करते हैं और ऊँची मान्यता पाते हैं। हर बार वे देखते हैं कि क्या अंतिम ब्रह्मर्षि उपाधि मिली और क्या इंद्रियाँ सच में वश में हुईं। प्रश्न ईमानदार है, पर यह भी दिखाता है कि बाहरी पद और वसिष्ठ का स्तर अभी उनकी भीतर की साधना का अर्थ तय कर रहे हैं।",
          },
          visualCue: "Successive titles rise like milestones, but each casts the same long line back toward Vasishta, revealing the comparison that survives every promotion.",
          characterIds: ["vishvamitra", "vasishta", "brahma"],
        },
        {
          id: "menaka-and-ten-years",
          title: { en: "Desire turns one season into ten years", hi: "कामना एक ऋतु को दस वर्षों में बदल देती है" },
          narration: {
            en: "At Pushkara, Vishvamitra sees Menaka and asks her to stay. Ten years pass in companionship before he understands that the gods used desire to interrupt his practice. He sends her away without the destructive curse that will mark a later test, but shame drives him north. Their daughter Shakuntala belongs to the human consequence of these years, not to a disposable temptation montage.",
            hi: "पुष्कर में विश्वामित्र मेनका को देखकर उनसे रुकने को कहते हैं। संग-साथ में दस वर्ष बीतते हैं, तब उन्हें समझ आता है कि देवताओं ने उनकी साधना रोकने के लिए इच्छा का उपयोग किया। वे मेनका को उस विनाशकारी शाप के बिना विदा करते हैं जो आगे की परीक्षा में आएगा, पर लज्जा उन्हें उत्तर ले जाती है। उनकी पुत्री शकुंतला इन वर्षों का मानवीय परिणाम है, कोई फेंक देने योग्य बाधा नहीं।",
          },
          visualCue: "Ten full seasonal cycles grow around Vishvamitra and Menaka; as he leaves, a separate light for Shakuntala remains instead of vanishing with the memory.",
          characterIds: ["vishvamitra", "menaka", "shakuntala"],
        },
        {
          id: "rambha-bears-the-anger",
          title: { en: "He resists desire but fails the test of anger", hi: "वे इच्छा रोकते हैं, पर क्रोध की परीक्षा में हारते हैं" },
          narration: {
            en: "When frightened Rambha is sent to disturb another period of austerity, Vishvamitra recognises the trap and does not yield to attraction. Yet he curses her to become stone for thousands of years. The episode refuses a false victory: control that merely transfers impulse from desire into punishment is not self-mastery, and Rambha bears the cost of his rage.",
            hi: "जब भयभीत रंभा को दूसरी तपस्या भंग करने भेजा जाता है, विश्वामित्र जाल पहचान लेते हैं और आकर्षण में नहीं पड़ते। फिर भी वे उसे हजारों वर्षों तक पत्थर होने का शाप देते हैं। यह घटना झूठी विजय स्वीकार नहीं करती—इच्छा को रोककर उसी आवेग को सजा में बदल देना आत्म-संयम नहीं है, और उनके क्रोध की कीमत रंभा चुकाती है।",
          },
          visualCue: "The seductive spring illusion breaks, but victory darkens as Rambha turns to stone beneath the force of anger she feared before arriving.",
          characterIds: ["vishvamitra", "rambha", "indra"],
        },
        {
          id: "silence-replaces-retaliation",
          title: { en: "The next discipline is not to strike back", hi: "अगली साधना है—उत्तर में प्रहार न करना" },
          narration: {
            en: "Vishvamitra resolves not to speak in anger, to endure heat, cold, rain, hunger, and provocation, and to begin again if needed. The scale is deliberately exhausting: transformation is not a single revelation after the curse, but a long practice of reaching the same trigger without repeating the same harm.",
            hi: "विश्वामित्र संकल्प लेते हैं कि क्रोध में नहीं बोलेंगे, गर्मी, सर्दी, वर्षा, भूख और उकसावे को सहेंगे और आवश्यकता हुई तो फिर से आरंभ करेंगे। यह विस्तार जानबूझकर थकाने वाला है—परिवर्तन शाप के बाद मिली एक अचानक सीख नहीं, बल्कि उसी उकसावे तक पहुँचकर पुरानी हानि न दोहराने का लंबा अभ्यास है।",
          },
          visualCue: "Fire, monsoon, winter water, and years rotate around the unmoving ascetic while former bursts of retaliation appear and dissolve before leaving him.",
          characterIds: ["vishvamitra", "rambha", "brahma"],
        },
        {
          id: "last-meal-is-given-away",
          title: { en: "At the edge of completion, he gives away the food", hi: "पूर्णता के किनारे वे अपना भोजन भी दे देते हैं" },
          narration: {
            en: "After a vast fast, Vishvamitra prepares to eat. Indra arrives disguised as a hungry Brahmin and asks for the entire meal. Vishvamitra gives it without anger or complaint, then continues the vow for another immense span. The scene revisits his first encounter with abundance: he no longer seizes what sustains another or treats giving as a transaction for rank.",
            hi: "बहुत लंबे उपवास के बाद विश्वामित्र भोजन करने बैठते हैं। इंद्र भूखे ब्राह्मण का रूप लेकर पूरा भोजन माँगते हैं। विश्वामित्र बिना क्रोध या शिकायत के सब दे देते हैं और फिर लंबी साधना जारी रखते हैं। दृश्य शबला वाले पहले प्रसंग को उलटता है—अब वे किसी दूसरे का पोषण नहीं छीनते और दान को पद पाने का सौदा नहीं बनाते।",
          },
          visualCue: "One small bowl, earned after years of hunger, passes calmly from Vishvamitra's hands to a stranger as the old image of seized Shabala fades.",
          characterIds: ["vishvamitra", "indra", "shabala"],
        },
        {
          id: "vasishta-recognises-a-brahmarshi",
          title: { en: "The final recognition comes with reconciliation", hi: "अंतिम मान्यता मेल-मिलाप के साथ आती है" },
          narration: {
            en: "The gods finally call Vishvamitra Brahmarshi, but he asks that Vasishta recognise the change too. Vasishta does so, and the old rivals make peace. The ending matters because it is relational, not merely promotional: the man who once tried to overpower Vasishta no longer needs to defeat him in order to stand beside him.",
            hi: "देवता अंततः विश्वामित्र को ब्रह्मर्षि कहते हैं, पर वे चाहते हैं कि वसिष्ठ भी इस परिवर्तन को स्वीकार करें। वसिष्ठ स्वीकार करते हैं और पुराने प्रतिद्वंद्वी मेल कर लेते हैं। अंत इसलिए महत्त्वपूर्ण है कि यह केवल पदोन्नति नहीं, संबंध का सुधार है—जो व्यक्ति कभी वसिष्ठ को हराना चाहता था, अब उनके बराबर खड़े होने के लिए उन्हें पराजित नहीं करना चाहता।",
          },
          visualCue: "The long competitive line between two distant figures loosens into a shared horizon as Vasishta names the change and Vishvamitra finally stops climbing past him.",
          characterIds: ["vishvamitra", "vasishta", "brahma"],
        },
      ],
    },
  },
  {
    id: "janaka-names-sitas-vow",
    nodeIds: ["janaka", "sita", "shiva-bow", "mithila", "ritual-field", "rival-kings"],
    moment: {
      id: "janaka-names-sitas-vow",
      decisiveChange: {
        en: "Janaka turns a legendary object into Sita's family history, revealing that the bow vow has already shaped her life and endangered Mithila.",
        hi: "जनक एक प्रसिद्ध वस्तु को सीता के पारिवारिक इतिहास से जोड़ते हैं और बताते हैं कि धनुष-प्रतिज्ञा उनके जीवन तथा मिथिला दोनों को पहले ही बदल चुकी है।",
      },
      beats: [
        {
          id: "bow-is-a-trust-not-a-trophy",
          title: { en: "The bow entered Janaka's house as a trust", hi: "धनुष जनक के घर में धरोहर बनकर आया" },
          narration: {
            en: "Asked to show the bow, Janaka first explains why his family keeps it. Associated with Shiva's fury at Daksha's sacrifice, the weapon was entrusted to an ancestor rather than won in a tournament. Its immense force and ritual care have made it a guarded inheritance long before Rama arrives to test it.",
            hi: "धनुष दिखाने को कहे जाने पर जनक पहले बताते हैं कि उनका परिवार इसे क्यों सँभालता है। दक्ष-यज्ञ पर शिव के क्रोध से जुड़ा यह अस्त्र किसी प्रतियोगिता में जीता नहीं गया; इसे एक पूर्वज को धरोहर के रूप में सौंपा गया था। राम की परीक्षा से बहुत पहले से इसकी अपार शक्ति और पूजा ने इसे सुरक्षित विरासत बना रखा है।",
          },
          visualCue: "The sealed armoury opens through layered memories of Shiva, frightened gods, and an ancestor receiving the bow with responsibility rather than triumph.",
          characterIds: ["janaka", "shiva", "devarata"],
        },
        {
          id: "sita-rises-from-the-field",
          title: { en: "While Janaka ploughs, a daughter appears", hi: "जनक के हल चलाते समय एक पुत्री प्रकट होती है" },
          narration: {
            en: "Janaka recalls ploughing the ground for a rite when an infant emerged from the furrow. He received her as his daughter and named her Sita, tying her origin to cultivated earth and the work of preparing a sacred field. The story centres adoption and chosen parenthood: Janaka does not merely discover a marvel; he raises a child.",
            hi: "जनक स्मरण करते हैं कि अनुष्ठान के लिए भूमि जोतते समय हल की रेखा से एक शिशु मिली। उन्होंने उसे पुत्री के रूप में अपनाया और सीता नाम दिया; उसका जन्म खेती की धरती और पवित्र क्षेत्र तैयार करने के श्रम से जुड़ गया। कथा दत्तक संबंध को केंद्र में रखती है—जनक केवल चमत्कार नहीं पाते, वे एक बच्ची का पालन करते हैं।",
          },
          visualCue: "A ploughed furrow glows beneath Janaka's hands, then the miraculous discovery transitions into ordinary years of carrying, teaching, and raising Sita.",
          characterIds: ["janaka", "sita"],
        },
        {
          id: "janaka-binds-marriage-to-the-bow",
          title: { en: "A father makes prowess the condition of marriage", hi: "एक पिता विवाह को पराक्रम की शर्त से बाँध देता है" },
          narration: {
            en: "As suitors arrive, Janaka declares that Sita will marry the person able to string the bow. In his account this is his vow, not a choice Sita is given a chance to speak in the hall. That distinction remains visible: the condition seeks extraordinary strength, yet it also places her future inside a public test designed by her father.",
            hi: "वरों के आने पर जनक घोषणा करते हैं कि सीता का विवाह उसी से होगा जो धनुष पर प्रत्यंचा चढ़ा सके। चुना हुआ स्रोत इसे जनक की प्रतिज्ञा बताता है; इस दृश्य में सीता स्वयं यह चुनाव बोलती नहीं हैं। यह अंतर स्पष्ट रहता है—शर्त असाधारण पुत्री के लिए असाधारण सामर्थ्य चाहती है, पर उसके भविष्य को पिता द्वारा बनाई सार्वजनिक परीक्षा में भी रख देती है।",
          },
          visualCue: "Sita's life-path is visibly connected to the locked bow by Janaka's spoken vow, while her own quiet figure remains distinct from the crowd of suitors.",
          characterIds: ["janaka", "sita", "rival-kings"],
        },
        {
          id: "failed-suitors-besiege-mithila",
          title: { en: "Failure at the bow becomes war against the city", hi: "धनुष पर असफलता नगर के विरुद्ध युद्ध बन जाती है" },
          narration: {
            en: "The assembled kings cannot even wield the bow. Humiliated, they besiege Mithila and exhaust Janaka's resources for a year until divine aid provides forces that drive them away. The challenge is therefore not festive spectacle when Rama enters it; Sita's proposed marriage and the city's safety have already been threatened by men who treated refusal as an insult.",
            hi: "एकत्र राजा धनुष को चला तक नहीं पाते। अपमानित होकर वे मिथिला को घेर लेते हैं और एक वर्ष तक जनक के साधन समाप्त करते हैं; अंततः देव-सहायता से मिली सेना उन्हें हटाती है। इसलिए राम के प्रवेश के समय यह कोई हल्की प्रतियोगिता नहीं है—सीता के विवाह और नगर की सुरक्षा को उन पुरुषों ने पहले ही संकट में डाला जो अस्वीकार को अपमान मानते थे।",
          },
          visualCue: "A ceremonial bow trial expands into a year-long siege map around Mithila, then returns to the hall carrying the memory of breached gates and scarcity.",
          characterIds: ["janaka", "sita", "rival-kings", "mithila-defenders"],
        },
      ],
    },
  },
  {
    id: "rama-breaks-the-bow",
    nodeIds: ["rama", "sita", "janaka", "vishvamitra", "lakshmana", "shiva-bow", "mithila-bow-hall"],
    moment: {
      id: "rama-breaks-the-bow",
      decisiveChange: {
        en: "Rama's apparently effortless act fulfils Janaka's public condition, but the adults pause before marriage and reconnect the achievement to both families.",
        hi: "राम का सहज दिखने वाला कार्य जनक की सार्वजनिक शर्त पूरी करता है, पर विवाह से पहले बड़े रुककर इस उपलब्धि को दोनों परिवारों की सहमति से जोड़ते हैं।",
      },
      beats: [
        {
          id: "five-thousand-bring-the-chest",
          title: { en: "The object arrives with the weight of a world", hi: "वस्तु पूरे संसार के भार के साथ सभा में आती है" },
          narration: {
            en: "Janaka orders the bow brought from its guarded chamber. Five thousand strong attendants struggle to draw the iron chest on an eight-wheeled cart into the assembly. The labour gives the audience a physical measure before Rama touches it: this is not a glowing icon floating conveniently into a hero's hand.",
            hi: "जनक सुरक्षित कक्ष से धनुष लाने का आदेश देते हैं। पाँच हजार बलवान सेवक आठ पहियों वाली गाड़ी पर रखे लोहे के संदूक को कठिनाई से सभा तक खींचते हैं। राम के स्पर्श से पहले यह श्रम दर्शक को वास्तविक पैमाना देता है—यह कोई चमकता प्रतीक नहीं जो सहज ही नायक के हाथ में आ जाए।",
          },
          visualCue: "The camera stays low beside straining wheels and coordinated ropes as the huge iron chest crosses Mithila toward a suddenly silent hall.",
          characterIds: ["janaka", "rama", "mithila-attendants"],
        },
        {
          id: "rama-asks-before-touching",
          title: { en: "Rama waits for permission", hi: "राम स्पर्श से पहले अनुमति लेते हैं" },
          narration: {
            en: "The chest opens and Janaka repeats that generations of mighty beings and kings have failed to string the bow. Rama does not seize the famous object to prove himself. At Vishvamitra's invitation he asks to examine it and to try lifting and stringing it, keeping the feat inside the trust between guest, guide, and host.",
            hi: "संदूक खुलता है और जनक बताते हैं कि पीढ़ियों के शक्तिशाली प्राणी तथा राजा इस धनुष पर प्रत्यंचा नहीं चढ़ा सके। राम प्रसिद्ध वस्तु को स्वयं को सिद्ध करने के लिए झपटकर नहीं उठाते। विश्वामित्र के संकेत पर वे उसे देखने, उठाने और चढ़ाने की अनुमति माँगते हैं; कार्य अतिथि, गुरु और मेज़बान के विश्वास के भीतर रहता है।",
          },
          visualCue: "Rama's open hand pauses above the bow until Vishvamitra and Janaka consent, stretching a quiet beat before the expected spectacle.",
          characterIds: ["rama", "vishvamitra", "janaka", "lakshmana"],
        },
        {
          id: "bow-breaks-like-thunder",
          title: { en: "Lifting becomes stringing; stringing becomes thunder", hi: "उठाना प्रत्यंचा चढ़ाने में और प्रत्यंचा वज्र-ध्वनि में बदलती है" },
          narration: {
            en: "Rama lifts the bow before the watching multitude and begins to string and draw it. The weapon snaps in the middle with a crash compared to a mountain splitting or thunder striking nearby. Almost everyone falls stunned except Rama, Lakshmana, Vishvamitra, and Janaka; the achievement changes the hall before anyone can turn it into celebration.",
            hi: "राम सबके सामने धनुष उठाकर प्रत्यंचा चढ़ाते और उसे खींचते हैं। वह बीच से ऐसी ध्वनि के साथ टूटता है मानो पर्वत फट गया हो या पास ही वज्र गिरा हो। राम, लक्ष्मण, विश्वामित्र और जनक को छोड़ लगभग पूरी सभा स्तब्ध होकर गिर पड़ती है; उत्सव शुरू होने से पहले ही यह घटना सभा का संसार बदल देती है।",
          },
          visualCue: "The bow bends across the full width of the hall, then a white shockwave races through pillars, banners, bodies, and the city beyond without pixelated zoom.",
          characterIds: ["rama", "lakshmana", "vishvamitra", "janaka", "shiva-bow"],
        },
        {
          id: "janaka-sends-for-dasharatha",
          title: { en: "The vow is fulfilled, but the wedding is not assumed", hi: "प्रतिज्ञा पूरी हुई, पर विवाह को स्वतः पूर्ण नहीं माना गया" },
          narration: {
            en: "Janaka declares that Rama has fulfilled the bow condition and says he will give beloved Sita to him. Yet he does not stage an instant marriage around a triumphant stranger. With Vishvamitra's permission, messengers must go to Ayodhya, report the brothers' safety and the feat, and invite Dasharatha. One family vow now opens into a meeting between two households.",
            hi: "जनक कहते हैं कि राम ने धनुष की शर्त पूरी कर दी और वे प्रिय सीता का विवाह उनसे करेंगे। फिर भी वे विजयी अजनबी के साथ तत्काल विवाह नहीं कराते। विश्वामित्र की अनुमति से दूत अयोध्या जाएँगे, भाइयों की कुशल और घटना का समाचार देंगे तथा दशरथ को बुलाएँगे। एक परिवार की प्रतिज्ञा अब दो घरों के मिलन का द्वार खोलती है।",
          },
          visualCue: "The broken bow remains in the hall while swift messenger routes light from Mithila to Ayodhya, carrying celebration into a necessary family conversation.",
          characterIds: ["janaka", "sita", "rama", "vishvamitra", "dasharatha"],
        },
      ],
    },
  },
];
