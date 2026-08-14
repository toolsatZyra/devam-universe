import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

/** Complete consumer scenes for Balakanda 31-48 in the selected Dutt expression. */
export const RAMAYANA_MITHILA_ROAD_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "road-leaves-siddhashrama",
    nodeIds: ["rama", "lakshmana", "vishvamitra", "siddhashrama", "mithila", "sona-river", "shiva-bow"],
    moment: {
      id: "road-leaves-siddhashrama",
      decisiveChange: {
        en: "With the protected rite complete, the journey gains a new destination: Janaka's sacrifice at Mithila and a bow no ordinary person can move.",
        hi: "अनुष्ठान की रक्षा पूरी होने पर यात्रा को नया लक्ष्य मिलता है—मिथिला में जनक का यज्ञ और ऐसा धनुष जिसे साधारण मनुष्य हिला भी नहीं सकता।",
      },
      beats: [
        {
          id: "service-complete-next-command",
          title: { en: "The brothers return for their next command", hi: "दोनों भाई अगले आदेश के लिए फिर उपस्थित होते हैं" },
          narration: {
            en: "After resting at Siddhashrama, Rama and Lakshmana greet Vishvamitra and ask what service comes next. The protected sacrifice is finished, but apprenticeship does not end with one victory. Their readiness opens another road rather than a reward chamber.",
            hi: "सिद्धाश्रम में विश्राम के बाद राम और लक्ष्मण विश्वामित्र के सामने उपस्थित होकर अगला कार्य पूछते हैं। अनुष्ठान की रक्षा पूरी हो चुकी है, पर शिक्षुता एक विजय पर समाप्त नहीं होती। उनकी तत्परता पुरस्कार-कक्ष नहीं, एक नई राह खोलती है।",
          },
          visualCue: "The completed fire dims behind the brothers while a fresh route grows northeast across rivers and unfamiliar kingdoms.",
          characterIds: ["rama", "lakshmana", "vishvamitra"],
        },
        {
          id: "mithila-sacrifice-and-bow",
          title: { en: "Mithila offers a sacrifice and a legendary bow", hi: "मिथिला में यज्ञ और एक अद्भुत धनुष प्रतीक्षा कर रहे हैं" },
          narration: {
            en: "The ascetics announce that King Janaka is holding a major sacrifice and invite the princes to accompany them. Vishvamitra adds a second reason: Janaka's house guards Shiva's immense bow, honoured for generations and beyond the strength of visiting kings.",
            hi: "तपस्वी बताते हैं कि राजा जनक एक बड़ा यज्ञ कर रहे हैं और राजकुमारों को साथ चलने के लिए कहते हैं। विश्वामित्र दूसरा कारण जोड़ते हैं—जनक के घर में पीढ़ियों से पूजित शिव का विशाल धनुष है, जिसे आए हुए राजा भी उठा नहीं सके।",
          },
          visualCue: "Mithila's ritual lights appear in the distance while the silhouette of a vast sealed bow rests beneath the city like a dormant challenge.",
          characterIds: ["vishvamitra", "rama", "lakshmana", "janaka"],
        },
        {
          id: "whole-hermitage-takes-road",
          title: { en: "The journey becomes a moving community", hi: "यात्रा एक चलते हुए समुदाय में बदलती है" },
          narration: {
            en: "Vishvamitra, the princes, and many ascetics leave Siddhashrama with carts and provisions. Forest animals follow for a time before being turned back. The scale changes from three travellers to a moving community carrying practice, memory, and practical needs across the land.",
            hi: "विश्वामित्र, दोनों राजकुमार और अनेक तपस्वी गाड़ियों तथा सामग्री के साथ सिद्धाश्रम से निकलते हैं। वन के पशु कुछ दूर तक पीछे आते हैं और फिर लौटाए जाते हैं। यात्रा तीन व्यक्तियों से बढ़कर साधना, स्मृति और दैनिक आवश्यकताएँ साथ लिए चलते समुदाय में बदल जाती है।",
          },
          visualCue: "A long caravan threads out of the hermitage as animals, carts, ascetics, and the princes briefly share one flowing forest path.",
          characterIds: ["vishvamitra", "rama", "lakshmana", "siddhashrama-ascetics"],
        },
        {
          id: "sona-camp-opens-lineage",
          title: { en: "At the Sona, Rama asks about the land", hi: "सोन तट पर राम भूमि की कथा पूछते हैं" },
          narration: {
            en: "At sunset the company camps beside the Sona. Rama notices the fertile country and asks who once ruled it. Vishvamitra begins with King Kusha and his descendants, turning the overnight halt into an entrance to his own family history and the cities shaped by it.",
            hi: "सूर्यास्त पर दल सोन नदी के किनारे रुकता है। राम समृद्ध भूमि देखकर पूछते हैं कि यहाँ किसका शासन था। विश्वामित्र राजा कुश और उनके वंश से कथा आरंभ करते हैं; रात का पड़ाव उनके अपने परिवार और उससे बने नगरों के इतिहास का द्वार बन जाता है।",
          },
          visualCue: "The campfire illuminates the Sona while old cities and family branches rise as navigable layers from Vishvamitra's answer.",
          characterIds: ["rama", "vishvamitra", "lakshmana", "kusha"],
        },
      ],
    },
  },
  {
    id: "kusanabha-daughters-choose-agency",
    nodeIds: ["kushanabha", "hundred-daughters", "vayu", "brahmadatta", "gadhi", "vishvamitra", "kaushiki-river"],
    moment: {
      id: "kusanabha-daughters-choose-agency",
      decisiveChange: {
        en: "A story of coercion, collective refusal, injury, and restoration becomes the doorway to Vishvamitra's own lineage.",
        hi: "दबाव, सामूहिक अस्वीकार, हिंसा और पुनर्स्थापन की कथा विश्वामित्र के अपने वंश का द्वार बनती है।",
      },
      beats: [
        {
          id: "vayu-demands-without-consent",
          title: { en: "Vayu demands the hundred daughters choose him", hi: "वायु सौ पुत्रियों से उन्हें चुनने की माँग करते हैं" },
          narration: {
            en: "Kushanabha's hundred daughters are moving together in a garden when Vayu desires them and demands that they accept him. They answer collectively that he must approach their father according to the social order they recognise. Whatever one thinks of that patriarchal structure, their immediate refusal is explicit.",
            hi: "कुशनाभ की सौ पुत्रियाँ उद्यान में साथ घूम रही होती हैं जब वायु उन्हें चाहकर स्वयं को स्वीकार करने की माँग करते हैं। वे एक स्वर में कहती हैं कि जिस सामाजिक व्यवस्था को वे मानती हैं उसके अनुसार वे पिता से बात करें। उस पितृसत्तात्मक व्यवस्था पर आधुनिक मत कुछ भी हो, उनका तत्काल अस्वीकार स्पष्ट है।",
          },
          visualCue: "The sisters' shared formation holds firm while an unseen wind presses from every direction, making collective refusal visible.",
          characterIds: ["hundred-daughters", "vayu"],
        },
        {
          id: "refusal-is-punished",
          title: { en: "Vayu answers refusal by injuring them", hi: "वायु अस्वीकार का उत्तर हिंसा से देते हैं" },
          narration: {
            en: "Vayu ignores their answer, enters their bodies in the source's supernatural account, and leaves their limbs bent and painful. They do not retaliate with inherited power, fearing destruction and choosing to return together to their father. The episode preserves coercion as harm, not romance.",
            hi: "स्रोत की अलौकिक कथा में वायु उनका उत्तर अनसुना करके उनके शरीर में प्रवेश करते हैं और अंगों को टेढ़ा तथा पीड़ित कर देते हैं। वे विनाशकारी प्रतिकार नहीं करतीं और साथ पिता के पास लौटती हैं। यह प्रसंग दबाव को प्रेमकथा नहीं, हिंसा के रूप में रखता है।",
          },
          visualCue: "The wind breaks the sisters' upright silhouettes, but their group remains connected as they support one another home.",
          characterIds: ["hundred-daughters", "vayu", "kushanabha"],
        },
        {
          id: "father-hears-and-restoration-follows",
          title: { en: "Their account is heard before a future is arranged", hi: "भविष्य तय होने से पहले उनकी बात सुनी जाती है" },
          narration: {
            en: "Kushanabha asks what happened, hears his daughters' account, and praises their restraint. He later arranges their marriage to Brahmadatta; in the source, his touch restores their bodies. Devam preserves this resolution while not treating marriage as a universal cure for injury.",
            hi: "कुशनाभ पहले पूछते और पुत्रियों का पूरा वृत्तांत सुनते हैं, फिर उनके संयम की प्रशंसा करते हैं। बाद में वे ब्रह्मदत्त से उनका विवाह कराते हैं और स्रोत में उनके स्पर्श से पुत्रियों के शरीर पुनः स्वस्थ होते हैं। देवम इस समाधान को सुरक्षित रखता है, पर विवाह को हर चोट का सार्वभौमिक उपचार नहीं मानता।",
          },
          visualCue: "The palace first becomes a listening space; only afterward does the wedding route appear, ending in restored movement rather than a silent before-and-after.",
          characterIds: ["kushanabha", "hundred-daughters", "brahmadatta"],
        },
        {
          id: "lineage-reaches-vishvamitra-and-kaushiki",
          title: { en: "The family story reaches Vishvamitra and a river", hi: "वंश-कथा विश्वामित्र और एक नदी तक पहुँचती है" },
          narration: {
            en: "Kushanabha later receives a son, Gadhi. Vishvamitra reveals that Gadhi is his father and that his elder sister Satyavati became the river Kaushiki after her marriage and ascent. A story begun with daughters denied control ends by locating the narrator inside the same complex family line.",
            hi: "बाद में कुशनाभ को गाधि नामक पुत्र मिलता है। विश्वामित्र बताते हैं कि गाधि उनके पिता हैं और उनकी बड़ी बहन सत्यवती विवाह तथा दिव्य आरोहण के बाद कौशिकी नदी बनीं। पुत्रियों की इच्छा पर आक्रमण से शुरू कथा अंत में स्वयं कथावाचक को उसी जटिल परिवार में रखती है।",
          },
          visualCue: "The lineage map flows from Kushanabha through Gadhi to Vishvamitra, while Satyavati's branch transforms into the moving Kaushiki river.",
          characterIds: ["kushanabha", "gadhi", "vishvamitra", "satyavati"],
        },
      ],
    },
  },
  {
    id: "ganga-and-kartikeya-origins",
    nodeIds: ["ganga", "uma", "himavat", "shiva", "agni", "kartikeya", "rama", "vishvamitra"],
    moment: {
      id: "ganga-and-kartikeya-origins",
      decisiveChange: {
        en: "At Ganga's bank, the river becomes a person, sister, carrier of overwhelming energy, and participant in Kartikeya's birth.",
        hi: "गंगा तट पर नदी एक व्यक्तित्व, बहन, प्रचंड ऊर्जा की वाहक और कार्तिकेय के जन्म की सहभागी बनकर खुलती है।",
      },
      beats: [
        {
          id: "himavat-has-two-daughters",
          title: { en: "Ganga and Uma begin as daughters of the mountain", hi: "गंगा और उमा पर्वतराज की पुत्रियों के रूप में आरंभ होती हैं" },
          narration: {
            en: "When the travellers reach Ganga, Vishvamitra tells Rama that Himavat and Mena had two daughters: Ganga, who came to flow through the worlds, and Uma, who pursued fierce austerity and became Shiva's partner. The river and goddess are introduced as related but distinct lives.",
            hi: "यात्री गंगा पहुँचते हैं तो विश्वामित्र बताते हैं कि हिमवान और मेना की दो पुत्रियाँ थीं—गंगा, जो लोकों में प्रवाहित हुईं, और उमा, जिन्होंने कठोर तपस्या करके शिव को पति रूप में पाया। नदी और देवी संबंधित किंतु अलग जीवनों के रूप में सामने आती हैं।",
          },
          visualCue: "The Himalayan source divides into two luminous paths: flowing Ganga descends outward while Uma's path rises inward through austerity.",
          characterIds: ["ganga", "uma", "himavat", "mena", "vishvamitra", "rama"],
        },
        {
          id: "gods-fear-unbounded-energy",
          title: { en: "The gods interrupt an energy they cannot contain", hi: "देवता उस ऊर्जा को रोकते हैं जिसे वे सँभाल नहीं सकते" },
          narration: {
            en: "The selected account describes Shiva and Uma's prolonged union and the gods' fear that its offspring would overwhelm the worlds. They ask Shiva to contain his energy. The intervention creates anger and consequence: Uma curses the gods after the hoped-for child is denied a direct birth through her.",
            hi: "चुनी हुई कथा शिव और उमा के दीर्घ मिलन तथा देवताओं के उस भय का वर्णन करती है कि उससे उत्पन्न संतान लोकों को अभिभूत कर देगी। वे शिव से ऊर्जा रोकने को कहते हैं। हस्तक्षेप का परिणाम क्रोध है—उमा अपने माध्यम से सीधे जन्म रोके जाने पर देवताओं को शाप देती हैं।",
          },
          visualCue: "A contained cosmic blaze strains against the mountain while the gods' intervention fractures the path between Uma and the expected child.",
          characterIds: ["shiva", "uma", "devas"],
        },
        {
          id: "agni-and-ganga-carry-the-seed",
          title: { en: "Agni and Ganga carry what no one can hold alone", hi: "अग्नि और गंगा उस तेज को सँभालते हैं जिसे कोई अकेला नहीं धारण कर सकता" },
          narration: {
            en: "Shiva's energy passes through Agni and into Ganga, whose waters and body cannot contain it indefinitely. It reaches the reed-filled landscape where the child takes form. The source makes birth a distributed event across divine bodies, elements, and place rather than one private chamber.",
            hi: "शिव का तेज अग्नि से होकर गंगा में आता है, पर उनका जल और शरीर भी उसे अनंत समय तक नहीं सँभाल सकते। वह सरकंडों वाले भू-दृश्य तक पहुँचकर बालक का रूप लेता है। स्रोत जन्म को एक निजी कक्ष नहीं, दिव्य शरीरों, तत्वों और स्थान में बाँटी घटना बनाता है।",
          },
          visualCue: "Fire enters the river, the river carries light into reeds, and the landscape itself becomes the final cradle.",
          characterIds: ["shiva", "agni", "ganga", "kartikeya"],
        },
        {
          id: "kartikeya-becomes-general",
          title: { en: "The child becomes the gods' commander", hi: "बालक देवताओं का सेनापति बनता है" },
          narration: {
            en: "The Krittikas nurture the child, giving Kartikeya another name and a many-sided maternal story. He grows with extraordinary speed, defeats the hostile forces named in the account, and is installed as the gods' commander. The riverbank story ends by explaining a warrior-god through care as well as combat.",
            hi: "कृत्तिकाएँ बालक का पालन करती हैं और कार्तिकेय को दूसरा नाम तथा अनेक मातृ-संबंध देती हैं। वे असाधारण गति से बढ़कर कथा में बताए शत्रुओं को परास्त करते हैं और देवताओं के सेनापति बनाए जाते हैं। नदी-तट की कथा युद्ध-देव को केवल रण से नहीं, पालन से भी समझाती है।",
          },
          visualCue: "Six nurturing presences surround the child before the scene expands into training, victory, and a formal commander's installation.",
          characterIds: ["kartikeya", "krittikas", "agni", "ganga", "devas"],
        },
      ],
    },
  },
  {
    id: "sagara-line-brings-ganga-down",
    nodeIds: ["sagara", "asamanja", "anshuman", "dilipa", "bhagiratha", "kapila", "ganga", "shiva", "jahnu"],
    moment: {
      id: "sagara-line-brings-ganga-down",
      decisiveChange: {
        en: "A disaster created by one generation takes several generations of persistence before Bhagiratha can bring Ganga to the ashes.",
        hi: "एक पीढ़ी की विनाशकारी भूल को सुधारने में कई पीढ़ियाँ लगती हैं और अंततः भगीरथ गंगा को राख तक लाते हैं।",
      },
      beats: [
        {
          id: "sagara-family-divides-into-two-futures",
          title: { en: "Sagara receives one heir and sixty thousand sons", hi: "सगर को एक उत्तराधिकारी और साठ हज़ार पुत्र मिलते हैं" },
          narration: {
            en: "King Sagara's two wives receive different promised futures: one line through a single son and another through sixty thousand sons. The single line includes Asamanja, whose cruelty toward children leads Sagara to banish him, and Anshuman, who remains trusted and compassionate.",
            hi: "राजा सगर की दो रानियों को अलग भविष्य मिलते हैं—एक से एक पुत्र का वंश और दूसरी से साठ हज़ार पुत्र। एकल वंश में असमंज आते हैं, जिनकी बच्चों के प्रति क्रूरता के कारण सगर उन्हें निकाल देते हैं, और अंशुमान, जो विश्वसनीय तथा करुणाशील रहते हैं।",
          },
          visualCue: "Two family branches expand unevenly, then the smaller branch darkens at Asamanja before continuing clearly through Anshuman.",
          characterIds: ["sagara", "asamanja", "anshuman", "keshini", "sumati"],
        },
        {
          id: "missing-horse-turns-into-excavation",
          title: { en: "A stolen horse unleashes indiscriminate digging", hi: "चोरी हुआ अश्व अंधाधुंध खुदाई का कारण बनता है" },
          narration: {
            en: "During Sagara's sacrifice, Indra steals the horse. The sixty thousand sons search by cutting into the earth, killing creatures and destroying habitats while accusing whatever they meet. Even the gods protest the damage. A legitimate search has become collective devastation through certainty without evidence.",
            hi: "सगर के यज्ञ में इंद्र अश्व चुरा लेते हैं। साठ हज़ार पुत्र पृथ्वी को काटते हुए खोजते हैं, जीवों और आवासों को नष्ट करते हैं और सामने आने वाले पर आरोप लगाते हैं। देवता भी इस विनाश पर आपत्ति करते हैं। प्रमाण-विहीन निश्चितता ने उचित खोज को सामूहिक तबाही में बदल दिया है।",
          },
          visualCue: "The search grid tears through underground ecosystems as accusation markers multiply faster than verified clues.",
          characterIds: ["sagara-sons", "indra", "sagara"],
        },
        {
          id: "kapila-fire-and-anshuman-restraint",
          title: { en: "Attack meets Kapila's fire; restraint finds the truth", hi: "आक्रमण कपिल के तेज से टकराता है, संयम सत्य तक पहुँचता है" },
          narration: {
            en: "The sons find the horse beside Kapila and rush at him as the thief; his anger reduces them to ashes. Anshuman later follows their path, honours the beings he meets, approaches Kapila without attack, and recovers the horse. Garuda tells him only Ganga's waters can release the dead.",
            hi: "पुत्र कपिल के पास अश्व देखकर उन्हें चोर मानकर आक्रमण करते हैं और उनके तेज से राख हो जाते हैं। बाद में अंशुमान उसी राह पर चलते हुए मिले प्राणियों का सम्मान करते हैं, कपिल के पास बिना आक्रमण जाते हैं और अश्व वापस पाते हैं। गरुड़ बताते हैं कि मृतकों की मुक्ति केवल गंगा-जल से होगी।",
          },
          visualCue: "The same underground route plays twice: first as violent charge and ash, then as Anshuman's careful greetings, questions, and recovery.",
          characterIds: ["kapila", "sagara-sons", "anshuman", "garuda"],
        },
        {
          id: "three-generations-carry-unfinished-task",
          title: { en: "Sagara, Anshuman, and Dilipa cannot finish the descent", hi: "सगर, अंशुमान और दिलीप गंगा-अवतरण पूरा नहीं कर पाते" },
          narration: {
            en: "Sagara completes the sacrifice but cannot bring Ganga down. Anshuman rules and practises austerity without completing the task; his son Dilipa carries the same concern and also dies before solving it. The account makes inherited responsibility visible without pretending every sincere effort succeeds within one lifetime.",
            hi: "सगर यज्ञ पूरा करते हैं, पर गंगा नहीं ला पाते। अंशुमान शासन और तपस्या करते हुए भी कार्य पूरा नहीं कर पाते; उनके पुत्र दिलीप भी वही चिंता सँभालते हैं और समाधान से पहले चले जाते हैं। कथा विरासत में मिले उत्तरदायित्व को दिखाती है, पर यह नहीं कहती कि हर सच्चा प्रयास एक जीवन में सफल होता है।",
          },
          visualCue: "One unfinished river-route passes from Sagara to Anshuman to Dilipa, each advancing it slightly before handing it forward.",
          characterIds: ["sagara", "anshuman", "dilipa", "bhagiratha"],
        },
        {
          id: "bhagiratha-guides-ganga-to-ashes",
          title: { en: "Bhagiratha wins help, survives the descent, and reaches the ashes", hi: "भगीरथ सहायता प्राप्त कर अवतरण सँभालते हैं और गंगा को राख तक पहुँचाते हैं" },
          narration: {
            en: "Bhagiratha's austerity gains Ganga's consent, then Shiva's help to absorb her otherwise destructive fall. Ganga follows Bhagiratha, is briefly swallowed and released by Jahnu after flooding his rite, reaches the ocean and underground ashes, and releases Sagara's sons. Success requires negotiation with every force along the route.",
            hi: "भगीरथ की तपस्या से गंगा की सहमति और फिर उनके प्रचंड अवतरण को सँभालने के लिए शिव की सहायता मिलती है। गंगा भगीरथ के पीछे चलती हैं, जह्नु के यज्ञ को बहाने पर उनके द्वारा पीकर फिर छोड़ी जाती हैं, समुद्र और भूमिगत राख तक पहुँचकर सगर-पुत्रों को मुक्त करती हैं। सफलता मार्ग की हर शक्ति से संवाद माँगती है।",
          },
          visualCue: "Ganga descends into Shiva's hair, follows Bhagiratha's moving chariot, disappears into Jahnu, returns, and finally touches the waiting ashes.",
          characterIds: ["bhagiratha", "ganga", "shiva", "jahnu", "sagara-sons"],
        },
      ],
    },
  },
  {
    id: "ocean-churning-and-maruts",
    nodeIds: ["devas", "asuras", "vishnu", "shiva", "dhanvantari", "diti", "indra", "maruts", "vishala"],
    moment: {
      id: "ocean-churning-and-maruts",
      decisiveChange: {
        en: "Vishala's landscape holds two stories about power after conflict: the churning for amrita and Diti's grief becoming the Maruts.",
        hi: "विशाला का भू-दृश्य संघर्ष के बाद शक्ति की दो कथाएँ सँभालता है—अमृत के लिए समुद्र-मंथन और दिति के शोक से मरुतों का जन्म।",
      },
      beats: [
        {
          id: "devas-asuras-churn-together",
          title: { en: "Rivals cooperate to churn the ocean", hi: "प्रतिद्वंद्वी समुद्र-मंथन के लिए साथ काम करते हैं" },
          narration: {
            en: "Vishvamitra recounts how devas and asuras, both seeking freedom from decay, use a mountain and serpent to churn the ocean together. Their cooperation is instrumental rather than trusting; the same project that requires both sides will later become a struggle over who controls its result.",
            hi: "विश्वामित्र बताते हैं कि जरा-मृत्यु से मुक्ति चाहने वाले देव और असुर पर्वत तथा नाग के सहारे मिलकर समुद्र मथते हैं। उनका सहयोग विश्वास पर नहीं, आवश्यकता पर आधारित है; जिस कार्य के लिए दोनों पक्ष चाहिए, उसके फल पर बाद में संघर्ष होगा।",
          },
          visualCue: "Mountain, serpent, devas, and asuras form a massive reciprocal mechanism whose rhythm depends on opposed groups pulling together.",
          characterIds: ["devas", "asuras", "vasuki"],
        },
        {
          id: "poison-and-treasures-emerge",
          title: { en: "The first result is danger, not immortality", hi: "पहला परिणाम अमृत नहीं, विष है" },
          narration: {
            en: "The churning releases lethal poison before its treasures. Shiva contains the poison, preventing the undertaking from destroying the worlds. Other beings and gifts emerge, including Dhanvantari with the vessel of amrita. Creation here produces risk, care, beauty, and contested value together.",
            hi: "मंथन से रत्नों से पहले घातक विष निकलता है। शिव विष को धारण करके लोकों को विनाश से बचाते हैं। बाद में अन्य प्राणी और रत्न आते हैं, जिनमें अमृत-कलश लिए धन्वंतरि भी हैं। सृजन यहाँ जोखिम, संरक्षण, सौंदर्य और विवादित मूल्य सब साथ उत्पन्न करता है।",
          },
          visualCue: "Black poison floods the mechanism before Shiva contains it; only then do layered treasures and Dhanvantari rise from the water.",
          characterIds: ["shiva", "dhanvantari", "devas", "asuras"],
        },
        {
          id: "amrita-restarts-conflict",
          title: { en: "The shared labour does not create shared ownership", hi: "साझा श्रम साझा अधिकार नहीं बनाता" },
          narration: {
            en: "When amrita appears, cooperation breaks. Vishnu's intervention helps the devas obtain it, and battle follows between the children of Aditi and Diti. The devas prevail. The story moves directly from a common undertaking to unequal distribution and renewed violence.",
            hi: "अमृत प्रकट होते ही सहयोग टूट जाता है। विष्णु के हस्तक्षेप से देवता अमृत प्राप्त करते हैं और अदिति तथा दिति के पुत्रों में युद्ध होता है। देवता विजयी होते हैं। कथा साझा प्रयास से असमान वितरण और फिर हिंसा तक सीधे जाती है।",
          },
          visualCue: "The balanced churning formation fractures around the amrita vessel, turning the circular mechanism into opposing battle lines.",
          characterIds: ["vishnu", "devas", "asuras", "diti"],
        },
        {
          id: "diti-grief-and-indra-infiltration",
          title: { en: "Diti's grief becomes a vow Indra fears", hi: "दिति का शोक ऐसा संकल्प बनता है जिससे इंद्र डरते हैं" },
          narration: {
            en: "After her sons are killed, Diti undertakes a long discipline to bear a son capable of defeating Indra. Indra serves her while watching for a breach, then enters and divides the embryo when she sleeps in a ritually impure posture. The source has Diti accept blame, but the covert violence remains visible.",
            hi: "पुत्रों की मृत्यु के बाद दिति ऐसा पुत्र पाने के लिए दीर्घ तपस्या करती हैं जो इंद्र को परास्त कर सके। इंद्र उनकी सेवा करते हुए चूक की प्रतीक्षा करते हैं और एक अनुष्ठानिक अशुद्ध मुद्रा में सोने पर गर्भ में प्रवेश करके भ्रूण विभाजित कर देते हैं। स्रोत दिति से दोष स्वीकार कराता है, पर गुप्त हिंसा फिर भी स्पष्ट रहती है।",
          },
          visualCue: "A long care routine carries a hidden surveillance layer; when Diti sleeps, the protected interior becomes the site of Indra's feared intervention.",
          characterIds: ["diti", "indra", "kashyapa"],
        },
        {
          id: "seven-parts-become-maruts",
          title: { en: "The broken future is renamed and given a place", hi: "टूटा हुआ भविष्य नया नाम और स्थान पाता है" },
          narration: {
            en: "Diti asks that the seven divided parts become the Maruts rather than remain a destroyed pregnancy, and Indra agrees to their honoured roles. The resolution does not undo the act, but converts the feared rival into a group with names, domains, and relationship. Vishala's lineage grows from that uneasy reconciliation.",
            hi: "दिति माँगती हैं कि विभाजित सात अंश नष्ट गर्भ न रहकर मरुत बनें और इंद्र उन्हें सम्मानित स्थान देने पर सहमत होते हैं। समाधान घटना मिटाता नहीं, पर भयभीत प्रतिद्वंद्वी को नाम, क्षेत्र और संबंध वाले समूह में बदलता है। उसी असहज मेल से विशाला की वंश-कथा आगे बढ़ती है।",
          },
          visualCue: "Seven fragments become seven moving wind regions, reconnecting around Diti and Indra without erasing the scar between them.",
          characterIds: ["diti", "indra", "maruts"],
        },
      ],
    },
  },
  {
    id: "ahalya-hermitage-awakens",
    nodeIds: ["ahalya", "gautama", "indra", "rama", "lakshmana", "vishvamitra", "ahalya-hermitage"],
    moment: {
      id: "ahalya-hermitage-awakens",
      decisiveChange: {
        en: "A silent hermitage opens a difficult story of disguise, recognised desire, punishment, long isolation, hospitality, and restoration.",
        hi: "मौन आश्रम वेश-छल, पहचानी हुई इच्छा, दंड, लंबे एकांत, आतिथ्य और पुनर्स्थापन की कठिन कथा खोलता है।",
      },
      beats: [
        {
          id: "indra-enters-in-gautama-form",
          title: { en: "Indra uses Gautama's appearance to enter", hi: "इंद्र गौतम का रूप लेकर प्रवेश करते हैं" },
          narration: {
            en: "Vishvamitra tells how Indra watched for Gautama to leave and entered the hermitage in the ascetic's form. In this selected Dutt rendering, Ahalya recognises Indra and agrees to the encounter; other Ramayana traditions describe her knowledge and consent differently. The disguise and power imbalance remain material facts.",
            hi: "विश्वामित्र बताते हैं कि इंद्र गौतम के बाहर जाने की प्रतीक्षा करके उन्हीं का रूप लेकर आश्रम में आए। चुने हुए दत्त रूपांतरण में अहल्या इंद्र को पहचानकर भेंट स्वीकार करती हैं; अन्य रामायण परंपराएँ उनके ज्ञान और सहमति को अलग तरह बताती हैं। वेश-छल और शक्ति-असमानता फिर भी महत्त्वपूर्ण तथ्य हैं।",
          },
          visualCue: "Gautama's familiar silhouette enters with a subtle incompatible celestial shadow, while Ahalya's recognition is shown without pretending the disguise is irrelevant.",
          characterIds: ["indra", "ahalya", "gautama"],
        },
        {
          id: "gautama-curses-both",
          title: { en: "Gautama returns and punishes both participants", hi: "गौतम लौटकर दोनों को दंड देते हैं" },
          narration: {
            en: "Gautama discovers Indra leaving in his form and curses him, then condemns Ahalya to long isolation, unseen, fasting, and living amid ash. The punishment is severe and unequal in duration. The source also embeds a future condition: Rama's arrival and Ahalya's hospitality will end the sentence.",
            hi: "गौतम अपने रूप में निकलते इंद्र को देखकर उन्हें शाप देते हैं और अहल्या को लंबे एकांत, अदृश्यता, उपवास तथा राख के बीच जीवन का दंड देते हैं। दंड कठोर है और अवधि में असमान भी। स्रोत भविष्य की शर्त जोड़ता है—राम का आगमन और अहल्या का आतिथ्य इस दंड को समाप्त करेंगे।",
          },
          visualCue: "The hermitage empties around Ahalya as years of ash and changing seasons accumulate, while one distant arrival-path remains faintly lit.",
          characterIds: ["gautama", "indra", "ahalya", "rama"],
        },
        {
          id: "rama-enters-silent-hermitage",
          title: { en: "The travellers perceive the person hidden from the world", hi: "यात्री उस व्यक्ति को अनुभव करते हैं जो संसार से छिपी है" },
          narration: {
            en: "Rama and Lakshmana enter the apparently abandoned hermitage with Vishvamitra. The source describes Ahalya as present yet inaccessible to ordinary sight. Rama's arrival does not begin with accusation or interrogation; the brothers recognise her, and she offers the hospitality named in the old condition.",
            hi: "राम, लक्ष्मण और विश्वामित्र बाहर से सूने दिखते आश्रम में प्रवेश करते हैं। स्रोत अहल्या को उपस्थित किंतु सामान्य दृष्टि से परे बताता है। राम का आगमन आरोप या पूछताछ से शुरू नहीं होता; दोनों भाई उन्हें पहचानते हैं और वे पुरानी शर्त में कहा आतिथ्य देती हैं।",
          },
          visualCue: "Dust and light reveal Ahalya gradually as the visitors cross the threshold and accept water and welcome rather than staging a courtroom.",
          characterIds: ["rama", "lakshmana", "vishvamitra", "ahalya"],
        },
        {
          id: "visibility-and-relationship-return",
          title: { en: "Ahalya returns to visibility; Gautama returns to the hermitage", hi: "अहल्या फिर दिखाई देती हैं और गौतम आश्रम लौटते हैं" },
          narration: {
            en: "The curse ends, celestial witnesses celebrate Ahalya's purification in the selected account, and Gautama reunites with her before honouring Rama. Devam presents this as this source's resolution, not a universal verdict on blame, consent, punishment, or what restoration should require.",
            hi: "चुनी हुई कथा में शाप समाप्त होता है, दिव्य साक्षी अहल्या की शुद्धि का उत्सव मनाते हैं और गौतम उनसे पुनर्मिलन करके राम का सम्मान करते हैं। देवम इसे इसी स्रोत का समाधान मानता है, दोष, सहमति, दंड या पुनर्स्थापन पर सार्वभौमिक निर्णय नहीं।",
          },
          visualCue: "The hermitage regains colour, sound, and human presence as Ahalya and Gautama share the frame without hiding the long absence that preceded it.",
          characterIds: ["ahalya", "gautama", "rama", "lakshmana"],
        },
      ],
    },
  },
  {
    id: "mithila-appears-beyond-sacrifice",
    nodeIds: ["mithila", "janaka", "shatananda", "vishvamitra", "rama", "lakshmana", "shiva-bow"],
    moment: {
      id: "mithila-appears-beyond-sacrifice",
      decisiveChange: {
        en: "The travellers finally enter Mithila, where Janaka receives them and every road-story becomes their introduction.",
        hi: "यात्री अंततः मिथिला पहुँचते हैं, जहाँ जनक उनका स्वागत करते हैं और राह की हर कथा उनका परिचय बन जाती है।",
      },
      beats: [
        {
          id: "sacrifice-city-fills-horizon",
          title: { en: "Mithila first appears as a vast gathering", hi: "मिथिला पहले एक विशाल सभा के रूप में दिखाई देती है" },
          narration: {
            en: "Approaching northeast, the company sees Janaka's sacrificial ground crowded with learned visitors, ascetics, carts, shelters, water points, and activity. Rama asks Vishvamitra to choose a calm, well-watered place for their camp rather than forcing the group into the ceremonial centre.",
            hi: "उत्तर-पूर्व बढ़ते हुए दल को जनक का यज्ञ-स्थल विद्वानों, तपस्वियों, गाड़ियों, आश्रयों, जल-स्थलों और गतिविधि से भरा दिखता है। राम विश्वामित्र से कहते हैं कि समूह के लिए भीड़ से अलग शांत और जलयुक्त स्थान चुना जाए, न कि सबको अनुष्ठान के केंद्र में ठूँस दिया जाए।",
          },
          visualCue: "Mithila expands from distant towers into a functioning festival-city, then the route branches deliberately toward a quieter riverside camp.",
          characterIds: ["rama", "lakshmana", "vishvamitra"],
        },
        {
          id: "janaka-comes-out-to-welcome",
          title: { en: "Janaka brings the welcome beyond his court", hi: "जनक स्वागत के लिए स्वयं बाहर आते हैं" },
          narration: {
            en: "Hearing that Vishvamitra has arrived, Janaka comes with Shatananda, priests, and the formal welcome offering. He honours the ascetic, reports that the sacrifice is nearing completion, and asks about the two armed young travellers on foot. Curiosity begins with hospitality rather than suspicion.",
            hi: "विश्वामित्र के आगमन का समाचार पाकर जनक शतानंद, पुरोहितों और स्वागत-सामग्री के साथ स्वयं बाहर आते हैं। वे ऋषि का सम्मान करके यज्ञ की प्रगति बताते हैं और पैदल आए दो युवा धनुर्धरों के बारे में पूछते हैं। जिज्ञासा संदेह नहीं, आतिथ्य से शुरू होती है।",
          },
          visualCue: "Janaka's formal procession leaves the ritual centre and meets the travellers at ground level, closing the distance before questions begin.",
          characterIds: ["janaka", "shatananda", "vishvamitra", "rama", "lakshmana"],
        },
        {
          id: "road-becomes-introduction",
          title: { en: "Vishvamitra answers with what the brothers have done", hi: "विश्वामित्र भाइयों का परिचय उनकी यात्रा से देते हैं" },
          narration: {
            en: "Vishvamitra identifies Rama and Lakshmana through their route: departure from Ayodhya, protection of Siddhashrama, the difficult forest passage, and Ahalya's hermitage. Their identity is not reduced to Dasharatha's sons; experience and conduct now accompany lineage.",
            hi: "विश्वामित्र राम और लक्ष्मण का परिचय उनकी राह से देते हैं—अयोध्या से प्रस्थान, सिद्धाश्रम की रक्षा, कठिन वन-यात्रा और अहल्या का आश्रम। उनकी पहचान केवल दशरथ के पुत्रों तक सीमित नहीं; अब वंश के साथ अनुभव और आचरण भी जुड़ते हैं।",
          },
          visualCue: "Each named road moment briefly lights on the world map behind the brothers, assembling a playable history rather than a list of titles.",
          characterIds: ["vishvamitra", "rama", "lakshmana", "janaka"],
        },
        {
          id: "bow-question-opens-next-world",
          title: { en: "Their curiosity about the bow becomes the next doorway", hi: "धनुष के प्रति जिज्ञासा अगला द्वार खोलती है" },
          narration: {
            en: "Vishvamitra explains that the princes have also come to see the mighty bow preserved by Janaka's house. The nested road stories now converge on a physical object in Mithila. The journey pauses, ready to shift from remembered worlds to Sita's vow and the bow challenge.",
            hi: "विश्वामित्र बताते हैं कि राजकुमार जनक-गृह में सुरक्षित महान धनुष देखने भी आए हैं। राह की सभी अंतःकथाएँ अब मिथिला की एक वास्तविक वस्तु पर आकर मिलती हैं। यात्रा रुकती है और अगला संसार सीता की प्रतिज्ञा तथा धनुष-परीक्षा की ओर खुलने को तैयार है।",
          },
          visualCue: "The route map contracts into the sealed bow chamber as a second, still-unseen path toward Sita begins glowing beyond it.",
          characterIds: ["vishvamitra", "rama", "lakshmana", "janaka", "sita"],
        },
      ],
    },
  },
];
