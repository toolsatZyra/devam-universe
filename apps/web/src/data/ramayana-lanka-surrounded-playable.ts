import type { StoryBeat } from "@/lib/domain/story-world";
import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

const beat = (
  id: string,
  title: { en: string; hi: string },
  narration: { en: string; hi: string },
  visualCue: string,
  characterIds: string[],
): StoryBeat => ({ id, title, narration, visualCue, characterIds });

export const RAMAYANA_LANKA_SURROUNDED_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "spies-return-alive",
    nodeIds: ["rama", "vibhishana", "suka", "sarana", "sugriva", "ravana", "sita", "allied-camp", "lanka", "suvela", "envoy-law"],
    moment: {
      id: "spies-return-alive",
      decisiveChange: { en: "A hidden reconnaissance mission becomes an open exchange in which truth can travel back across the battle line.", hi: "छिपा हुआ सैन्य निरीक्षण खुली बातचीत में बदलता है, जिससे सत्य युद्ध-रेखा पार वापस जा सकता है।" },
      beats: [
        beat("two-shapes-enter-the-crowd", { en: "Two borrowed shapes enter the crowd", hi: "दो बदले रूप भीड़ में उतरते हैं" }, {
          en: "Ravana sends Suka and Sarana across the new causeway in forms meant to disappear among the allies. They are ordered to count forces, identify commanders, learn how the sea was crossed, and discover the alliance's purpose and weapons. Around them, the camp is so vast and mobile that calculation quickly becomes guesswork.",
          hi: "रावण शुक और सारण को बदले हुए रूपों में नए सेतु के पार भेजता है ताकि वे मित्र-सेना में खो जाएँ। उन्हें सैनिकों की संख्या, सेनानायकों की पहचान, समुद्र पार करने की विधि, उद्देश्य और शस्त्र जानने हैं। चारों ओर फैला और निरंतर चलता शिविर इतना विशाल है कि गणना शीघ्र ही अनुमान बन जाती है।",
        }, "Let two faintly unstable silhouettes move through layered camps while commander constellations and the causeway remain visible around them.", ["suka", "sarana", "ravana", "rama", "sugriva", "allied-army"]),
        beat("vibhishana-sees-through-the-disguise", { en: "Vibhishana sees what the disguise hides", hi: "विभीषण वेश के पीछे की पहचान देख लेते हैं" }, {
          en: "Vibhishana recognises the visitors and brings them before Rama instead of letting frightened fighters decide their fate. The two agents admit who sent them and why. Their capture exposes a real security breach, but confession also gives the commanders a chance to choose a response deliberately rather than treat fear as permission for immediate killing.",
          hi: "विभीषण आगंतुकों को पहचानकर उन्हें राम के सामने लाते हैं, ताकि भयभीत सैनिक उनके भाग्य का निर्णय न करें। दोनों स्वीकार करते हैं कि उन्हें किसने और क्यों भेजा। उनकी घुसपैठ वास्तविक सुरक्षा-भंग है, फिर भी स्वीकारोक्ति सेनानायकों को सोच-समझकर उत्तर चुनने का अवसर देती है; भय तत्काल हत्या की अनुमति नहीं बनता।",
        }, "Freeze the restless camp into a guarded circle, with Vibhishana between the exposed agents and raised allied weapons.", ["vibhishana", "suka", "sarana", "rama", "sugriva", "allied-fighters"]),
        beat("rama-allows-the-looking-to-finish", { en: "Rama lets the looking finish", hi: "राम निरीक्षण पूरा करने देते हैं" }, {
          en: "Rama asks whether the agents have seen everything they came to see and offers to show anything they missed. He rejects killing them even though they entered in disguise to measure and divide his force. The choice is not careless trust: their identities are known, the camp is alert, and their safe return can carry an unmistakable warning to Lanka.",
          hi: "राम पूछते हैं कि क्या गुप्तचर वह सब देख चुके हैं जिसके लिए आए थे, और जो छूट गया हो उसे भी दिखाने की बात कहते हैं। वे वेश बदलकर सेना को मापने और बाँटने आए थे, फिर भी राम उनके वध को अस्वीकार करते हैं। यह लापरवाह विश्वास नहीं है—पहचान खुल चुकी है, शिविर सतर्क है और उनकी सुरक्षित वापसी लंका तक स्पष्ट चेतावनी ले जा सकती है।",
        }, "Open the guarded circle into a panoramic reveal of the alliance, turning surveillance into a controlled demonstration rather than a secret victory.", ["rama", "suka", "sarana", "vibhishana", "sugriva", "allied-army"]),
        beat("the-warning-crosses-back", { en: "The warning crosses back", hi: "चेतावनी वापस लंका पहुँचती है" }, {
          en: "The released agents carry Rama's demand that Ravana face the consequence of refusing to return Sita. Back in Lanka, they do not soften what they witnessed: the causeway is complete, the host cannot be counted, and battle is near. They recommend restitution, making their report both military intelligence and counsel their ruler still has time to accept.",
          hi: "मुक्त गुप्तचर राम की माँग लेकर लौटते हैं कि सीता को न लौटाने के परिणाम का सामना रावण स्वयं करे। लंका पहुँचकर वे देखी बातों को नरम नहीं करते—सेतु पूरा है, सेना की गिनती संभव नहीं और युद्ध निकट है। वे सीता-वापसी की सलाह देते हैं; उनकी रिपोर्ट सैन्य जानकारी भी है और वह समझाइश भी जिसे शासक अभी स्वीकार कर सकता है।",
        }, "Track the pair back over the luminous causeway as the allied camp contracts behind them and Lanka's tower grows ahead.", ["suka", "sarana", "rama", "ravana", "sita", "lanka"]),
      ],
    },
  },
  {
    id: "ravana-surveys-the-host",
    nodeIds: ["ravana", "suka", "sarana", "rama", "lakshmana", "hanuman", "sugriva", "angada", "jambavan", "nala", "nila", "vibhishana", "lanka-watchtower", "allied-host"],
    moment: {
      id: "ravana-surveys-the-host",
      decisiveChange: { en: "The army below stops being an anonymous mass and becomes a web of leaders, homelands, skills, and commitments.", hi: "नीचे की सेना अनजान भीड़ न रहकर नेताओं, जन्मभूमियों, क्षमताओं और प्रतिबद्धताओं का जाल बन जाती है।" },
      beats: [
        beat("the-tower-becomes-a-map", { en: "The tower becomes a map", hi: "मीनार मानचित्र बन जाती है" }, {
          en: "Ravana climbs high above Lanka with Suka and Sarana and demands names for the moving formations below. From that distance, the army first resembles a landscape of bodies. The agents begin separating it into commanders, regions, kinships, and specialties, giving the ruler a view of the coalition he had reduced to a boastfully dismissed crowd.",
          hi: "रावण शुक और सारण के साथ लंका की ऊँची मीनार पर चढ़कर नीचे चलती टुकड़ियों के नाम पूछता है। दूरी से सेना पहले शरीरों का भू-दृश्य लगती है। गुप्तचर उसे सेनानायकों, क्षेत्रों, संबंधों और विशेष क्षमताओं में बाँटते हैं, जिससे शासक उस गठबंधन को पहली बार देखता है जिसे वह अब तक डींग में केवल भीड़ कहकर टालता रहा था।",
        }, "Tilt from the palace tower into a layered tactical vista where each named formation gains a distinct colour, terrain memory, and route line.", ["ravana", "suka", "sarana", "allied-army", "lanka"]),
        beat("commanders-carry-their-homelands", { en: "Commanders carry their homelands with them", hi: "सेनानायक अपनी जन्मभूमियाँ साथ लाते हैं" }, {
          en: "Nila, Angada, Nala, Kumuda, Sarabha, Gavaya, and many others are identified through the places and communities behind them. Jambavan's bears add another lineage of experience. Instead of a catalogue of names, the view can open routes back to mountains, forests, rivers, and earlier alliances that explain why different groups now stand before Lanka together.",
          hi: "नील, अंगद, नल, कुमुद, शरभ, गवय और अनेक अन्य अपने पीछे खड़े स्थानों और समुदायों से पहचाने जाते हैं। जाम्बवान के भालू अनुभव की दूसरी परंपरा जोड़ते हैं। नामों की सूची के बजाय यह दृश्य पर्वतों, वनों, नदियों और पुरानी मित्रताओं तक रास्ते खोलता है, जो बताते हैं कि अलग-अलग समूह आज लंका के सामने साथ क्यों खड़े हैं।",
        }, "Let every commander node unfold a short spatial ribbon to a homeland rather than filling the screen with a static roll call.", ["nila", "angada", "nala", "jambavan", "kumuda", "sarabha", "gavaya"]),
        beat("hanuman-connects-the-two-shores", { en: "Hanuman connects both shores", hi: "हनुमान दोनों तटों को जोड़ते हैं" }, {
          en: "When Suka points out Hanuman, the tower view reconnects the present siege to his earlier leap, his childhood attempt to reach the sun, his meeting with Sita, and the burning raid Ravana's city has already endured. His importance lies not in a fabulous number of followers but in the chain of actions that made this coalition's arrival possible.",
          hi: "शुक जब हनुमान की ओर संकेत करता है, मीनार का दृश्य वर्तमान घेराबंदी को उनकी समुद्र-छलाँग, बाल्यकाल में सूर्य तक पहुँचने के प्रयास, सीता से भेंट और लंका पर हो चुके अग्नि-आक्रमण से जोड़ देता है। उनका महत्त्व अनुयायियों की अद्भुत संख्या में नहीं, बल्कि उन कार्यों की श्रृंखला में है जिनसे यह गठबंधन यहाँ पहुँच सका।",
        }, "Draw Hanuman's route as a bright arc linking mountain, ocean, grove, burning city, return camp, and the army now assembled below.", ["hanuman", "sita", "rama", "ravana", "lanka", "southern-ocean"]),
        beat("rama-lakshmana-and-vibhishana-appear", { en: "The central commitments come into view", hi: "केंद्र की प्रतिबद्धताएँ दिखाई देती हैं" }, {
          en: "The agents identify Rama and Lakshmana beside Vibhishana, whose presence proves that Ravana's own household has fractured over Sita's captivity. Sugriva stands as an allied ruler rather than an accessory to Rama. The formation shows separate people joined by promises and decisions, not a single hero surrounded by disposable support.",
          hi: "गुप्तचर राम और लक्ष्मण के पास विभीषण को दिखाते हैं, जिनकी उपस्थिति बताती है कि सीता की कैद पर रावण का अपना घर टूट चुका है। सुग्रीव राम के सहायक मात्र नहीं, मित्र-राजा के रूप में खड़े हैं। यह विन्यास अलग-अलग व्यक्तियों को उनके वचनों और निर्णयों से जुड़ा दिखाता है, किसी एक नायक के चारों ओर खर्च हो जाने वाली भीड़ नहीं।",
        }, "Hold Rama, Lakshmana, Vibhishana, and Sugriva as distinct luminous nodes with visible bonds, never collapsing the formation into one avatar.", ["rama", "lakshmana", "vibhishana", "sugriva", "ravana", "sita"]),
      ],
    },
  },
  {
    id: "truth-tellers-are-punished",
    nodeIds: ["ravana", "suka", "sarana", "sardula", "rama", "vibhishana", "sugriva", "hanuman", "lanka-court", "allied-camp", "reconnaissance"],
    moment: {
      id: "truth-tellers-are-punished",
      decisiveChange: { en: "Repeated reconnaissance succeeds, but Lanka's ruler converts usable warning into an occasion to punish the people who bring it.", hi: "बार-बार किया गया निरीक्षण सफल होता है, पर लंका का शासक उपयोगी चेतावनी को उसे लाने वालों को दंड देने का अवसर बना देता है।" },
      beats: [
        beat("warning-is-called-disloyalty", { en: "Warning is called disloyalty", hi: "चेतावनी को विश्वासघात कहा जाता है" }, {
          en: "Ravana hears Suka and Sarana describe the alliance's strength and recommend returning Sita. Instead of testing their facts, he accuses them of praising an enemy after being frightened and beaten. Years of service save their lives, but they are dismissed. The court learns that accurate bad news may cost a messenger his place.",
          hi: "रावण शुक और सारण से मित्र-सेना की शक्ति और सीता को लौटाने की सलाह सुनता है। तथ्यों की जाँच करने के बजाय वह आरोप लगाता है कि वे डर और मार के कारण शत्रु की प्रशंसा कर रहे हैं। वर्षों की सेवा उनके प्राण बचाती है, पर उन्हें हटा दिया जाता है। सभा सीखती है कि अप्रिय सत्य लाने वाले को अपना स्थान खोना पड़ सकता है।",
        }, "Dim the truthful map beside the throne while the two agents' access tokens extinguish, making the governance failure spatially legible.", ["ravana", "suka", "sarana", "lanka-court", "sita"]),
        beat("a-second-team-repeats-the-risk", { en: "A second team repeats the risk", hi: "दूसरी टोली वही जोखिम दोहराती है" }, {
          en: "Rather than revise his judgment, Ravana sends Sardula and other agents to collect the same kind of information again. The mission crosses a now-alert siege line, where disguise can no longer guarantee safety. The repeated order reveals a ruler who wants intelligence without accepting the conclusions that reliable intelligence has already produced.",
          hi: "अपना निर्णय बदलने के बजाय रावण शार्दूल और अन्य गुप्तचरों को लगभग वही जानकारी फिर लाने भेजता है। अब उन्हें सतर्क घेराबंदी-रेखा पार करनी है, जहाँ वेश सुरक्षा की गारंटी नहीं देता। दोहराया आदेश ऐसे शासक को दिखाता है जो जानकारी चाहता है, पर विश्वसनीय जानकारी से निकले निष्कर्ष को स्वीकार नहीं करना चाहता।",
        }, "Send a second set of faint tracks across the same guarded ground while the first completed report remains ignored behind Ravana.", ["ravana", "sardula", "allied-fighters", "vibhishana", "rama"]),
        beat("capture-turns-violent", { en: "Capture turns violent", hi: "गिरफ्तारी हिंसा में बदलती है" }, {
          en: "The new agents are discovered and beaten before command restraint takes hold. Their covert purpose does not make the assault invisible or automatically justified. Rama intervenes and releases them, repeating a boundary his own side has struggled to obey: an enemy messenger can be detained and questioned without being treated as a body available for revenge.",
          hi: "नई टोली पकड़ी जाती है और सेनानायकों का संयम लागू होने से पहले पीटी जाती है। उनका गुप्त उद्देश्य इस हिंसा को अदृश्य या अपने-आप उचित नहीं बनाता। राम हस्तक्षेप कर उन्हें मुक्त करते हैं और वह सीमा दोहराते हैं जिसे अपनी सेना ने भी कठिनाई से निभाया—शत्रु-दूत को रोका और पूछा जा सकता है, पर बदले के लिए उपलब्ध शरीर नहीं माना जा सकता।",
        }, "Interrupt the melee with a clear command pulse from Rama, leaving injuries visible without lingering on bodily damage.", ["sardula", "allied-fighters", "rama", "vibhishana", "sugriva"]),
        beat("facts-arrive-again", { en: "The same facts arrive again", hi: "वही तथ्य फिर पहुँचते हैं" }, {
          en: "Sardula returns hurt but alive and reports that Rama rescued him. He names the opposing leaders, confirms the siege, and again recommends restitution or preparation for battle. Lanka has not been deprived of information; the failure lies in a decision system that repeatedly obtains evidence, rejects its implications, and exposes more people to recover it.",
          hi: "शार्दूल घायल पर जीवित लौटता है और बताता है कि राम ने उसे बचाया। वह विरोधी नेताओं की पहचान, घेराबंदी की पुष्टि और फिर सीता-वापसी या युद्ध-तैयारी की सलाह देता है। लंका जानकारी से वंचित नहीं है; विफलता उस निर्णय-व्यवस्था में है जो बार-बार प्रमाण जुटाती, उसके अर्थ को ठुकराती और वही बात फिर लाने के लिए अधिक लोगों को खतरे में भेजती है।",
        }, "Layer the two matching reports over Lanka's command table so repetition reads as ignored evidence rather than fresh uncertainty.", ["sardula", "ravana", "rama", "vibhishana", "lanka-court"]),
      ],
    },
  },
  {
    id: "a-false-head-enters-the-grove",
    nodeIds: ["sita", "ravana", "vidyujjibha", "rama", "lakshmana", "sugriva", "hanuman", "ashoka-grove", "false-head", "coercive-deception", "allied-camp"],
    moment: {
      id: "a-false-head-enters-the-grove",
      decisiveChange: { en: "Military deception is redirected toward one captive woman as psychological torture designed to destroy her remaining hope and refusal.", hi: "सैन्य छल को एक बंदी स्त्री पर मनोवैज्ञानिक यातना की तरह मोड़ा जाता है, ताकि उसकी बची आशा और असहमति टूट जाए।" },
      beats: [
        beat("vidyujjibha-builds-an-illusion", { en: "Vidyujjibha builds an illusion", hi: "विद्युत्जिह्व एक भ्रम रचता है" }, {
          en: "Ravana summons Vidyujjibha to manufacture the appearance of Rama's severed head and familiar bow. The object is not created to mislead an army or gain ground; it is prepared for Sita, whose captivity gives her no independent way to verify distant events. Deception is being weaponised against isolation itself.",
          hi: "रावण विद्युत्जिह्व को राम के कटे सिर और पहचाने हुए धनुष जैसा भ्रम बनाने बुलाता है। यह वस्तु सेना को भ्रमित करने या भूमि जीतने के लिए नहीं, सीता के लिए तैयार होती है, जिनकी कैद उन्हें दूर घटती घटनाओं की स्वतंत्र जाँच से रोकती है। यहाँ छल उनके अकेलेपन को ही हथियार बना लेता है।",
        }, "Show the illusion assembling from unstable fragments while Sita's blocked routes to the outside world remain dark around the grove.", ["vidyujjibha", "ravana", "sita", "rama", "ashoka-grove"]),
        beat("ravana-invents-a-night-massacre", { en: "Ravana invents a night massacre", hi: "रावण रात के संहार की झूठी कथा गढ़ता है" }, {
          en: "Ravana tells Sita that the allied camp was destroyed while its fighters slept, that Rama was killed without warning, and that the people who crossed the ocean for her have been scattered or slain. The account is calculated disinformation, not a report. Its graphic details are selected to make resistance feel futile and consent obtainable through despair.",
          hi: "रावण सीता से कहता है कि सोते हुए मित्र-शिविर का विनाश कर दिया गया, राम बिना चेतावनी मारे गए और उनके लिए समुद्र पार करने वाले लोग बिखर या मर चुके हैं। यह सूचना नहीं, सोचा-समझा झूठ है। उसके भयावह विवरण प्रतिरोध को निरर्थक और निराशा से मिली सहमति को संभव दिखाने के लिए चुने गए हैं।",
        }, "Keep Ravana's spoken claims as flickering, contradictory shadows rather than replaying graphic violence as confirmed action.", ["ravana", "sita", "rama", "lakshmana", "sugriva", "allied-army"]),
        beat("sita-falls-into-trauma", { en: "Sita falls into trauma, not truth", hi: "सीता सत्य में नहीं, आघात में गिरती हैं" }, {
          en: "Presented with the false head, Sita collapses and grieves as though Rama has died. She blames herself, recalls the choices that brought them here, and asks to be killed beside him. These words arise under captivity and engineered shock; self-blame and a wish to die are signs of acute distress, not a moral verdict on her or an ideal response to loss.",
          hi: "झूठा सिर सामने देखकर सीता गिर पड़ती हैं और राम को मृत मानकर विलाप करती हैं। वे स्वयं को दोष देती, यहाँ तक लाने वाले निर्णय याद करती और उनके साथ मारे जाने की बात कहती हैं। ये शब्द कैद और रचे हुए आघात में निकलते हैं; आत्म-दोष और मृत्यु की इच्छा उनके चरित्र का निर्णय या शोक का आदर्श नहीं, तीव्र मानसिक संकट के संकेत हैं।",
        }, "Let the grove lose depth and colour around Sita while supportive memory fragments remain present but unreachable, avoiding spectacle around her distress.", ["sita", "rama", "ravana", "ashoka-grove"]),
        beat("the-object-vanishes-but-harm-remains", { en: "The object vanishes; the harm remains", hi: "वस्तु मिटती है, आघात रह जाता है" }, {
          en: "A summons pulls Ravana away, and the false head and bow disappear when the deception is no longer sustained. Their vanishing proves the image unreal but does not instantly undo what Sita has endured. Beyond the grove, Ravana mobilises forces without explaining the truth, extending a regime in which information is controlled differently for captive, court, soldier, and citizen.",
          hi: "सभा का बुलावा रावण को दूर ले जाता है और छल का सहारा हटते ही झूठा सिर और धनुष मिट जाते हैं। वस्तु का गायब होना उसके असत्य को साबित करता है, पर सीता पर हुआ आघात तुरंत समाप्त नहीं होता। बाहर रावण बिना सत्य बताए सेना जुटाता है; बंदी, दरबार, सैनिक और नागरिक—हर किसी के लिए जानकारी अलग ढंग से नियंत्रित होती है।",
        }, "Dissolve the false object but leave a visible fracture in the grove's atmosphere as military lights begin moving beyond its walls.", ["sita", "ravana", "vidyujjibha", "lanka-army", "lanka"]),
      ],
    },
  },
  {
    id: "sarama-restores-reality",
    nodeIds: ["sita", "sarama", "rama", "ravana", "hanuman", "ravana-mother", "lanka-elders", "ashoka-grove", "lanka-council", "allied-shore", "intelligence-choice"],
    moment: {
      id: "sarama-restores-reality",
      decisiveChange: { en: "Companionship restores verifiable reality, and Sita turns from coerced grief toward a deliberate request for the information she needs most.", hi: "साथ सत्य की जाँच फिर संभव बनाता है, और सीता थोपी गई निराशा से निकलकर उस जानकारी को माँगती हैं जिसकी उन्हें सबसे अधिक आवश्यकता है।" },
      beats: [
        beat("sarama-names-the-deception", { en: "Sarama names the deception", hi: "सरमा छल को उसका नाम देती हैं" }, {
          en: "Sarama reaches Sita after the illusion vanishes and says plainly that what Ravana displayed was fabricated. She has watched the movements outside Lanka and knows that Rama could not have been surprised and destroyed as claimed. Comfort begins with correcting the false account, not with asking Sita to stop feeling what the deception caused.",
          hi: "भ्रम मिटने के बाद सरमा सीता के पास पहुँचकर स्पष्ट कहती हैं कि रावण ने जो दिखाया वह बनाया हुआ था। उन्होंने लंका के बाहर की गतिविधियाँ देखी हैं और जानती हैं कि राम को बताई तरह अचानक नष्ट नहीं किया गया। सांत्वना की शुरुआत झूठ सुधारने से होती है, सीता से यह कहने से नहीं कि छल के कारण उठी भावना तुरंत बंद कर दें।",
        }, "Restore horizon lines and colour to the grove as Sarama reconnects Sita to observable movement beyond the prison boundary.", ["sarama", "sita", "ravana", "rama", "ashoka-grove"]),
        beat("the-crossing-is-confirmed", { en: "The crossing is confirmed", hi: "समुद्र-पार की पुष्टि होती है" }, {
          en: "Sarama confirms that Rama, Lakshmana, and the alliance have crossed the ocean and stand near Lanka. Drums, wheels, voices, and defensive movement outside the grove support what she says. Her confidence in victory remains her reassurance and expectation; the immediately checkable fact is that the rescuing force lives and has reached the city.",
          hi: "सरमा पुष्टि करती हैं कि राम, लक्ष्मण और मित्र-सेना समुद्र पार करके लंका के निकट खड़ी है। वाटिका के बाहर ढोल, पहिए, आवाज़ें और रक्षात्मक हलचल उनकी बात का समर्थन करती हैं। विजय में उनका विश्वास उनकी आशा और सांत्वना है; तत्काल जाँचा जा सकने वाला तथ्य यह है कि उद्धार के लिए आई सेना जीवित है और नगर तक पहुँच चुकी है।",
        }, "Let distant siege sounds produce visible ripples through the grove, distinguishing confirmed presence from hoped-for outcome.", ["sarama", "sita", "rama", "lakshmana", "allied-army", "lanka"]),
        beat("sita-chooses-intelligence", { en: "Sita chooses intelligence over a symbolic message", hi: "सीता प्रतीकात्मक संदेश के बजाय जानकारी चुनती हैं" }, {
          en: "Sarama offers to cross the lines and carry Sita's words to Rama. Sita values the offer but asks for something more immediately useful: find out what Ravana and his advisers have decided now that the army is here. The choice makes her an active reader of the crisis, directing a trusted companion toward the decision point that governs her danger.",
          hi: "सरमा युद्ध-रेखा पार कर सीता का संदेश राम तक पहुँचाने की पेशकश करती हैं। सीता उस प्रस्ताव का मूल्य समझती हैं, पर अधिक उपयोगी बात पूछती हैं—अब जबकि सेना आ गई है, रावण और उसके सलाहकारों ने क्या निर्णय लिया है। यह चुनाव उन्हें संकट की सक्रिय समझ रखने वाली बनाता है; वे विश्वस्त साथी को उसी निर्णय-केंद्र की ओर भेजती हैं जो उनके खतरे को तय करता है।",
        }, "Offer two luminous routes from the grove—one toward Rama and one toward the council—then follow the route Sita deliberately selects.", ["sita", "sarama", "rama", "ravana", "lanka-council"]),
        beat("elders-urge-return", { en: "The elders urge return", hi: "बुज़ुर्ग सीता को लौटाने की सलाह देते हैं" }, {
          en: "Sarama listens as Ravana's mother and senior counsellors point to Hanuman's raid, the completed crossing, and earlier defeats. They urge him to return Sita before the city pays further cost. Ravana refuses. When Sarama reports back, Sita gains a sharper truth than reassurance alone: alternatives remain visible inside Lanka, but the ruler is deliberately closing them.",
          hi: "सरमा सुनती हैं कि रावण की माता और वरिष्ठ सलाहकार हनुमान के आक्रमण, पूरे हुए सेतु और पिछली हारों की ओर संकेत करते हैं। वे नगर की अधिक कीमत चुकने से पहले सीता को लौटाने की सलाह देते हैं। रावण मना कर देता है। लौटकर सरमा सीता को केवल सांत्वना नहीं, अधिक स्पष्ट सत्य देती हैं—लंका के भीतर विकल्प दिख रहे हैं, पर शासक उन्हें जानबूझकर बंद कर रहा है।",
        }, "Reveal dissenting elder lights inside the council and show Ravana extinguishing each proposed route before Sarama carries the pattern back.", ["sarama", "sita", "ravana", "ravana-mother", "lanka-elders", "hanuman"]),
      ],
    },
  },
  {
    id: "malyavan-gives-the-last-counsel",
    nodeIds: ["malyavan", "ravana", "sita", "rama", "prahasta", "indrajit", "mahaparshva", "mahodara", "virupaksha", "suka", "sarana", "lanka-council", "lanka-gates"],
    moment: {
      id: "malyavan-gives-the-last-counsel",
      decisiveChange: { en: "A final argument for adaptation is rejected, and Ravana turns from refusing counsel to hardening Lanka into fixed defensive sectors.", hi: "स्थिति के अनुसार बदलने की अंतिम सलाह ठुकरा दी जाती है, और रावण समझाइश अस्वीकार करने से आगे बढ़कर लंका को कठोर रक्षात्मक क्षेत्रों में बाँट देता है।" },
      beats: [
        beat("malyavan-measures-the-balance", { en: "Malyavan measures the balance", hi: "माल्यवान शक्ति-संतुलन मापते हैं" }, {
          en: "Malyavan begins with a practical rule: a ruler should seek peace when the opponent is equal or stronger and fight only from real advantage. The ocean has been crossed, trusted commanders have failed, and a broad coalition now surrounds Lanka. Past power does not cancel present evidence, so returning Sita is the least destructive available course.",
          hi: "माल्यवान व्यावहारिक नियम से आरंभ करते हैं—प्रतिद्वंद्वी बराबर या अधिक शक्तिशाली हो तो शांति खोजनी चाहिए, और वास्तविक बढ़त हो तभी युद्ध चुनना चाहिए। समुद्र पार हो चुका है, विश्वस्त सेनानायक असफल हुए हैं और व्यापक गठबंधन लंका को घेर रहा है। पुरानी शक्ति वर्तमान प्रमाण को मिटाती नहीं; इसलिए सीता-वापसी सबसे कम विनाशकारी रास्ता है।",
        }, "Balance Lanka and the alliance on a living scale whose weights update with the bridge, losses, commanders, and civilian exposure.", ["malyavan", "ravana", "rama", "sita", "allied-army", "lanka"]),
        beat("past-harm-has-built-a-coalition", { en: "Past harm has built the coalition", hi: "पुराने अत्याचारों ने गठबंधन बनाया है" }, {
          en: "The elder connects Ravana's older attacks on ascetics, communities, and rivals to the support now gathering around Rama. Some of his language divides whole beings into moral camps and interprets omens as certainty; those frames belong to the council's world. The durable warning is simpler: repeated harm creates relationships among people who once stood apart.",
          hi: "बुज़ुर्ग रावण द्वारा तपस्वियों, समुदायों और प्रतिद्वंद्वियों पर किए पुराने आक्रमणों को राम के चारों ओर जुटे समर्थन से जोड़ते हैं। उनकी कुछ भाषा पूरे समुदायों को नैतिक वर्गों में बाँटती और अपशकुन को निश्चित भविष्य मानती है; वे उस सभा की धारणाएँ हैं। टिकाऊ चेतावनी सरल है—बार-बार किया अत्याचार अलग खड़े लोगों के बीच संबंध बना देता है।",
        }, "Connect earlier harmed places into converging lines around Lanka while keeping omen imagery translucent and explicitly uncertain.", ["malyavan", "ravana", "rama", "ascetics", "allied-communities", "lanka"]),
        beat("ravana-attacks-the-counsellor", { en: "Ravana attacks the counsellor instead of the argument", hi: "रावण तर्क के बजाय सलाहकार पर प्रहार करता है" }, {
          en: "Ravana calls Rama weak, displaced, and merely human, then accuses Malyavan of jealousy and hidden sympathy. He says bending is contrary to his nature, as though a repeated choice were an unchangeable law. By turning assessment into personal insult, he avoids answering the bridge, the coalition, Sita's captivity, or the danger faced by Lanka's inhabitants.",
          hi: "रावण राम को दुर्बल, निर्वासित और केवल मनुष्य कहता है, फिर माल्यवान पर ईर्ष्या और छिपी सहानुभूति का आरोप लगाता है। वह झुकने को अपने स्वभाव के विरुद्ध बताता है, मानो बार-बार किया चुनाव अपरिवर्तनीय नियम हो। आकलन को निजी अपमान बनाकर वह सेतु, गठबंधन, सीता की कैद और लंका के निवासियों के खतरे का उत्तर देने से बचता है।",
        }, "Collapse Ravana's response into attacking beams aimed at Malyavan while the unanswered facts remain steady around the room.", ["ravana", "malyavan", "rama", "sita", "lanka-inhabitants"]),
        beat("the-city-is-divided-into-sectors", { en: "The city is divided into sectors", hi: "नगर रक्षात्मक क्षेत्रों में बाँटा जाता है" }, {
          en: "Ravana assigns Prahasta to the east, Mahaparshva and Mahodara to the south, Indrajit to the west, and keeps the north under his own eye with Suka and Sarana. Virupaksha holds the centre. The plan gives every gate a commander, yet it also fixes the whole city's people and resources inside a war made avoidable by restitution.",
          hi: "रावण पूर्व में प्रहस्त, दक्षिण में महापार्श्व और महोदर, पश्चिम में इंद्रजित को नियुक्त करता है और उत्तर को शुक-सारण के साथ स्वयं देखता है। विरूपाक्ष मध्य संभालता है। योजना हर द्वार को सेनानायक देती है, पर नगर के लोगों और संसाधनों को ऐसे युद्ध के भीतर बाँध देती है जिसे सीता-वापसी से अभी भी टाला जा सकता था।",
        }, "Transform the council floor into four coloured gate sectors and a central reserve, with homes and civic routes visibly trapped beneath the overlay.", ["ravana", "prahasta", "mahaparshva", "mahodara", "indrajit", "virupaksha", "suka", "sarana"]),
      ],
    },
  },
  {
    id: "two-war-rooms-face-each-other",
    nodeIds: ["rama", "lakshmana", "vibhishana", "sugriva", "nila", "angada", "hanuman", "jambavan", "ravana", "prahasta", "indrajit", "four-gates", "allied-council"],
    moment: {
      id: "two-war-rooms-face-each-other",
      decisiveChange: { en: "The allies translate hidden deployment into a matching spatial plan, with responsibilities and recognition rules visible before contact.", hi: "मित्र-सेना छिपी तैनाती को समानांतर स्थानिक योजना में बदलती है, जिसमें टकराव से पहले जिम्मेदारियाँ और पहचान के नियम स्पष्ट हैं।" },
      beats: [
        beat("four-scouts-return-as-birds", { en: "Four scouts return as birds", hi: "चार गुप्तचर पक्षी-रूप में लौटते हैं" }, {
          en: "Vibhishana's four agents move through Lanka in bird forms and return with the gate assignments, central reserve, and principal commanders. Their report closes a dangerous information gap without pretending to know every movement. Unlike Ravana's dismissed agents, these scouts enter a council prepared to let accurate observation change its plan.",
          hi: "विभीषण के चार गुप्तचर पक्षी-रूप में लंका घूमकर द्वारों की तैनाती, केंद्रीय बल और प्रमुख सेनानायकों की जानकारी लाते हैं। उनकी रिपोर्ट हर गतिविधि जानने का दावा किए बिना खतरनाक सूचना-अंतर कम करती है। रावण द्वारा ठुकराए गुप्तचरों के विपरीत, वे ऐसी सभा में लौटते हैं जो सटीक निरीक्षण के आधार पर योजना बदलने को तैयार है।",
        }, "Let four small aerial paths stitch the hidden gate sectors into the allied command table, retaining gaps where knowledge remains incomplete.", ["vibhishana", "vibhishana-scouts", "rama", "lanka", "allied-council"]),
        beat("vibhishana-separates-warning-from-panic", { en: "Vibhishana separates warning from panic", hi: "विभीषण चेतावनी को घबराहट से अलग रखते हैं" }, {
          en: "Vibhishana adds estimates and earlier military experience to help the alliance prepare, then states that he is not trying to frighten anyone. Large numbers and remembered feats remain situated reports, not measurements the company can independently prove. The useful effect is readiness: no gate should be approached as though its defenders were unknown.",
          hi: "विभीषण तैयारी के लिए अनुमान और पुराने सैन्य अनुभव जोड़ते हैं, फिर स्पष्ट करते हैं कि उनका उद्देश्य किसी को डराना नहीं है। विशाल संख्याएँ और पुराने पराक्रम परिस्थितिगत रिपोर्ट हैं, ऐसी माप नहीं जिन्हें दल स्वतंत्र रूप से सिद्ध कर सके। उपयोगी परिणाम तैयारी है—किसी द्वार की ओर ऐसे नहीं बढ़ना चाहिए मानो वहाँ के रक्षक अज्ञात हों।",
        }, "Display estimates as soft ranges around firm commander positions, visually separating known deployment from uncertain scale.", ["vibhishana", "rama", "sugriva", "lanka-defenders", "allied-army"]),
        beat("each-gate-receives-an-answer", { en: "Each gate receives an answer", hi: "हर द्वार के सामने एक उत्तर रखा जाता है" }, {
          en: "Rama sends Nila east, Angada south, Hanuman west, and stands with Lakshmana at the northern approach facing Ravana. Sugriva, Jambavan, and Vibhishana hold the centre. The assignments do not guarantee success; they make leadership, support routes, and the cost of failure traceable across a city too large for one commander to see at once.",
          hi: "राम नील को पूर्व, अंगद को दक्षिण, हनुमान को पश्चिम भेजते हैं और लक्ष्मण के साथ उत्तर में रावण के सामने खड़े होते हैं। सुग्रीव, जाम्बवान और विभीषण मध्य संभालते हैं। यह तैनाती सफलता की गारंटी नहीं देती; वह नेतृत्व, सहायता-मार्ग और असफलता की कीमत को ऐसे नगर में स्पष्ट बनाती है जिसे एक सेनानायक एक साथ नहीं देख सकता।",
        }, "Mirror each red defensive sector with a distinct allied constellation and keep support links pulsing toward the centre.", ["rama", "lakshmana", "nila", "angada", "hanuman", "sugriva", "jambavan", "vibhishana"]),
        beat("recognition-is-part-of-survival", { en: "Recognition is part of survival", hi: "पहचान भी जीवित रहने की योजना है" }, {
          en: "The allies agree on visible forms as a friend-or-foe signal, while only a small named group retains human appearance. In a mixed force approaching walls and gates from four directions, identification is as important as courage. The rule should be read as battlefield coordination, not as a judgment that one kind of body is more worthy than another.",
          hi: "मित्र-सेना दृश्य रूपों को मित्र-शत्रु पहचान का संकेत बनाती है, जबकि केवल कुछ नामित लोग मानव रूप रखते हैं। चार दिशाओं से दीवारों और द्वारों की ओर बढ़ती मिली-जुली सेना में पहचान साहस जितनी आवश्यक है। इस नियम को युद्ध-समन्वय की तरह समझना चाहिए, किसी शरीर को दूसरे से अधिक मूल्यवान बताने की तरह नहीं।",
        }, "Overlay simple recognition halos on diverse bodies and formations, prioritising quick legibility without ranking forms or species.", ["rama", "lakshmana", "vibhishana", "allied-fighters", "lanka-defenders"]),
      ],
    },
  },
  {
    id: "suvela-reveals-a-living-city",
    nodeIds: ["rama", "lakshmana", "sugriva", "vibhishana", "hanuman", "angada", "jambavan", "ravana", "lanka-inhabitants", "suvela", "trikuta", "lanka-gardens"],
    moment: {
      id: "suvela-reveals-a-living-city",
      decisiveChange: { en: "A fortified objective becomes a living, beautiful, inhabited place whose ecological and civilian exposure cannot be separated from the coming siege.", hi: "किलेबंद लक्ष्य एक सुंदर, जीवित और आबाद स्थान बनकर सामने आता है, जिसकी प्राकृतिक और नागरिक कीमत आने वाली घेराबंदी से अलग नहीं की जा सकती।" },
      beats: [
        beat("leaders-climb-suvela", { en: "The leaders climb Suvela", hi: "नेता सुवेल पर चढ़ते हैं" }, {
          en: "Rama, Lakshmana, Sugriva, Vibhishana, and the principal commanders climb Suvela to gain height over the northern plain. The ascent is both tactical and experiential: routes, walls, slopes, and the distant palace align into one navigable view. They camp there overnight rather than rushing into ground they have only just begun to understand.",
          hi: "राम, लक्ष्मण, सुग्रीव, विभीषण और प्रमुख सेनानायक उत्तरी मैदान के ऊपर दृष्टि पाने के लिए सुवेल पर चढ़ते हैं। यह चढ़ाई रणनीतिक भी है और अनुभवात्मक भी—मार्ग, दीवारें, ढलान और दूर का महल एक ही चलने योग्य दृश्य में जुड़ते हैं। वे तुरंत अनजान भूमि में नहीं उतरते, बल्कि रात वहीं रुककर उसे समझते हैं।",
        }, "Use a continuous climb from shoreline scale to an elevated 2.5D panorama where every earlier map layer clicks into physical depth.", ["rama", "lakshmana", "sugriva", "vibhishana", "hanuman", "angada", "jambavan", "suvela"]),
        beat("lanka-is-more-than-its-walls", { en: "Lanka is more than its walls", hi: "लंका केवल दीवारें नहीं है" }, {
          en: "Morning reveals forests, flowering groves, birds, animals, bright buildings, roads, defensive works, and Ravana's palace on Trikuta. The city that had appeared as gates and troop counts now holds habitats, homes, movement, and memory. Seeing beauty does not erase Sita's captivity; it expands who and what may be harmed by the ruler's refusal.",
          hi: "सुबह वन, फूलों से भरे उपवन, पक्षी, पशु, चमकती इमारतें, सड़कें, रक्षा-व्यवस्था और त्रिकूट पर रावण का महल दिखाई देते हैं। जो नगर पहले द्वार और सैनिक-संख्या था, अब आवास, घर, आवाजाही और स्मृति का स्थान बनता है। सौंदर्य देखना सीता की कैद को नहीं मिटाता; वह बताता है कि शासक के इनकार से और कौन-कौन प्रभावित होगा।",
        }, "Populate the panorama gradually with habitats, homes, markets, birds, and gardens before reintroducing the military overlay.", ["rama", "sita", "ravana", "lanka-inhabitants", "lanka-animals", "lanka", "trikuta"]),
        beat("the-advance-disturbs-the-land", { en: "The advance disturbs the land", hi: "सेना की बढ़त भूमि को विचलित करती है" }, {
          en: "As the host moves through the woods below, animals flee, branches break, and dust veils the view. Friendly purpose does not automatically make every footprint harmless. The same collective force needed to confront abduction also consumes space, startles living creatures, and presses against a city where not every inhabitant chose Ravana's decision.",
          hi: "नीचे सेना वनों से बढ़ती है तो पशु भागते, डालियाँ टूटती और धूल दृश्य ढकती है। न्यायपूर्ण उद्देश्य हर कदम को अपने-आप अहानिकर नहीं बनाता। हरण का सामना करने के लिए आवश्यक सामूहिक शक्ति भी स्थान घेरती, जीवों को डराती और ऐसे नगर पर दबाव डालती है जहाँ हर निवासी ने रावण का निर्णय नहीं चुना।",
        }, "Let displaced animals and dust currents move across the same paths as the formations, making ecological cost visible without stopping navigation.", ["allied-army", "lanka-animals", "rama", "sugriva", "lanka-inhabitants", "lanka-gardens"]),
        beat("the-view-becomes-a-responsibility", { en: "The view becomes a responsibility", hi: "दृश्य जिम्मेदारी बन जाता है" }, {
          en: "From Suvela, the alliance can choose gates, support routes, and lines of retreat, but it can also see the inhabited districts between those lines. A complete tactical view therefore creates obligations as well as advantage: keep the purpose focused, distinguish defenders from civilians, and remember that capturing terrain is not the same as caring for the life upon it.",
          hi: "सुवेल से मित्र-सेना द्वार, सहायता-मार्ग और पीछे हटने की दिशाएँ चुन सकती है, पर उन रेखाओं के बीच बसे मोहल्ले भी देख सकती है। इसलिए पूरा रणनीतिक दृश्य बढ़त के साथ जिम्मेदारी भी देता है—उद्देश्य सीमित रखना, रक्षकों और नागरिकों में अंतर करना, और याद रखना कि भूमि लेना उस पर बसे जीवन की देखभाल के समान नहीं है।",
        }, "Keep civilian districts visible beneath every proposed route so tactical selection always carries a readable responsibility layer.", ["rama", "lakshmana", "sugriva", "vibhishana", "lanka-inhabitants", "lanka"]),
      ],
    },
  },
  {
    id: "sugriva-leaps-without-a-plan",
    nodeIds: ["sugriva", "ravana", "rama", "lakshmana", "vibhishana", "hanuman", "lanka-defenders", "suvela", "north-gate", "palace-roof", "unauthorised-risk"],
    moment: {
      id: "sugriva-leaps-without-a-plan",
      decisiveChange: { en: "A sudden act wins a symbolic humiliation but exposes how quickly personal anger can endanger an alliance's shared plan.", hi: "अचानक किया कार्य प्रतीकात्मक अपमान तो दिलाता है, पर दिखाता है कि निजी क्रोध साझा योजना को कितनी जल्दी खतरे में डाल सकता है।" },
      beats: [
        beat("sugriva-sees-ravana", { en: "Sugriva sees Ravana", hi: "सुग्रीव रावण को देखते हैं" }, {
          en: "From Suvela, Sugriva spots Ravana above a gate wearing the signs of kingship while Sita remains captive inside. Anger compresses distance and deliberation into one impulse. Before Rama or the other commanders can coordinate support, Sugriva launches himself toward the palace, leaving the formation to watch a leader disappear into hostile space.",
          hi: "सुवेल से सुग्रीव रावण को द्वार के ऊपर राजचिह्नों के साथ देखते हैं, जबकि सीता भीतर बंदी हैं। क्रोध दूरी और विचार को एक आवेग में समेट देता है। राम या अन्य सेनानायक सहायता व्यवस्थित कर पाते उससे पहले सुग्रीव महल की ओर छलाँग लगा देते हैं और पूरी तैनाती को अपने नेता को शत्रु-क्षेत्र में जाते देखते छोड़ते हैं।",
        }, "Snap focus from Ravana's crown to Sugriva's launch while planned support lines lag behind as visibly disconnected paths.", ["sugriva", "ravana", "rama", "lakshmana", "vibhishana", "suvela"]),
        beat("the-crown-falls", { en: "The crown falls", hi: "मुकुट गिरता है" }, {
          en: "Sugriva lands, declares his allegiance to Rama, and knocks Ravana's crown away before the two grapple across the roof. The fallen crown turns an apparently untouchable ruler into a body that can be reached and resisted. Yet symbolic victory arrives inside an encounter no ally can safely support and no evacuation route has been prepared to secure.",
          hi: "सुग्रीव उतरकर राम से अपनी मित्रता घोषित करते हैं, रावण का मुकुट गिराते हैं और दोनों छत पर मल्लयुद्ध करते हैं। गिरा मुकुट अछूत दिखते शासक को ऐसे शरीर में बदल देता है जिसे पहुँचा और रोका जा सकता है। फिर भी यह प्रतीकात्मक विजय ऐसे संघर्ष में आती है जहाँ कोई मित्र सुरक्षित सहायता नहीं दे सकता और वापसी का मार्ग तैयार नहीं है।",
        }, "Send the crown spinning across the roof as a bright political symbol while the unsupported duel remains isolated above the city.", ["sugriva", "ravana", "rama", "lanka-defenders", "palace-roof"]),
        beat("illusion-changes-the-fight", { en: "Illusion changes the fight", hi: "मायाजाल युद्ध की प्रकृति बदल देता है" }, {
          en: "The struggle tests strength until Sugriva senses Ravana turning toward deceptive powers that could trap him beyond the reach of his companions. He does not stay merely to preserve an image of fearlessness. Breaking contact and leaping back is a survival judgment, recognising that courage includes leaving an encounter whose rules have changed.",
          hi: "संघर्ष शारीरिक शक्ति की परीक्षा करता है, फिर सुग्रीव समझते हैं कि रावण ऐसे मायावी उपाय की ओर बढ़ रहा है जो उन्हें साथियों की पहुँच से बाहर फँसा सकता है। वे केवल निर्भय दिखने के लिए नहीं रुकते। अलग होकर लौटना जीवित रहने का निर्णय है—साहस में उस लड़ाई से निकलना भी शामिल है जिसके नियम बदल चुके हों।",
        }, "Warp the roof geometry as illusion begins, then preserve a clear return vector that Sugriva chooses before the trap closes.", ["sugriva", "ravana", "rama", "hanuman", "vibhishana"]),
        beat("humiliation-and-risk-return-together", { en: "Humiliation and risk return together", hi: "अपमान और जोखिम साथ लौटते हैं" }, {
          en: "Sugriva returns with proof that Ravana can be physically challenged and publicly embarrassed. He also returns from a gamble that could have removed an allied ruler on the eve of siege. The moment should reward daring without teaching that leadership means abandoning consultation whenever righteous anger feels urgent.",
          hi: "सुग्रीव इस प्रमाण के साथ लौटते हैं कि रावण को शारीरिक चुनौती दी और सार्वजनिक रूप से अपमानित किया जा सकता है। वे ऐसे दाँव से भी लौटते हैं जो घेराबंदी की पूर्वसंध्या पर एक मित्र-राजा को समाप्त कर सकता था। यह क्षण साहस का मूल्य दिखाए, पर यह शिक्षा न दे कि उचित क्रोध आते ही नेतृत्व को सलाह छोड़ देनी चाहिए।",
        }, "Reconnect Sugriva to the allied formation with one bright success marker and several flashing broken-command links still awaiting repair.", ["sugriva", "rama", "lakshmana", "vibhishana", "hanuman", "ravana"]),
      ],
    },
  },
  {
    id: "one-last-embassy",
    nodeIds: ["rama", "sugriva", "angada", "ravana", "lakshmana", "vibhishana", "hanuman", "sita", "lanka-court", "palace-roof", "envoy-law", "siege-lines"],
    moment: {
      id: "one-last-embassy",
      decisiveChange: { en: "The alliance repairs its command boundary and offers one final return-or-war choice before Ravana violates the protection owed to an envoy.", hi: "मित्र-सेना अपनी कमान की सीमा फिर स्पष्ट करती है और अंतिम सीता-वापसी या युद्ध का विकल्प देती है, जिसके बाद रावण दूत-सुरक्षा का उल्लंघन करता है।" },
      beats: [
        beat("rama-embraces-and-rebukes", { en: "Rama embraces and rebukes", hi: "राम गले लगाकर रोकते भी हैं" }, {
          en: "Rama welcomes Sugriva back with relief, then says a ruler must not undertake such danger without consulting the people whose lives depend on him. Affection does not erase accountability. Rama's own declaration that he would answer Sugriva's death with vengeance and then die reveals the shock of imagined loss, not a sound contingency or an ideal of devotion.",
          hi: "राम सुग्रीव को राहत के साथ गले लगाते हैं, फिर कहते हैं कि राजा को उन लोगों से सलाह लिए बिना ऐसा खतरा नहीं उठाना चाहिए जिनका जीवन उस पर निर्भर है। स्नेह जवाबदेही को मिटाता नहीं। सुग्रीव की मृत्यु की कल्पना पर बदला लेकर स्वयं मरने की राम की बात आघात की तीव्रता दिखाती है, कोई विवेकपूर्ण योजना या निष्ठा का आदर्श नहीं।",
        }, "Hold the embrace and command correction in the same frame, with the alliance's interrupted dependency lines visible behind them.", ["rama", "sugriva", "lakshmana", "vibhishana", "hanuman"]),
        beat("diplomacy-precedes-assault", { en: "Diplomacy precedes assault", hi: "आक्रमण से पहले संवाद आता है" }, {
          en: "With the siege positions nearly complete, Rama still chooses to send a final demand before attacking. The message is severe: return Sita and preserve those who can be spared, or face the force assembled outside. It also makes Vibhishana's possible succession explicit, showing Ravana that the city has a political future beyond his refusal.",
          hi: "घेराबंदी लगभग पूरी होने पर भी राम आक्रमण से पहले अंतिम माँग भेजते हैं। संदेश कठोर है—सीता को लौटाकर उन लोगों को बचाओ जिन्हें बचाया जा सकता है, अन्यथा बाहर खड़ी शक्ति का सामना करो। इसमें विभीषण के संभावित उत्तराधिकार को भी स्पष्ट किया जाता है, जिससे रावण देख सके कि उसके इनकार के बाद भी नगर का राजनीतिक भविष्य है।",
        }, "Open a narrow diplomatic corridor through the tightening siege and place restitution, civilian survival, battle, and succession as visible consequences.", ["rama", "angada", "ravana", "sita", "vibhishana", "lanka-inhabitants"]),
        beat("angada-stands-in-the-court", { en: "Angada stands in the court", hi: "अंगद सभा में खड़े होते हैं" }, {
          en: "Angada crosses into Lanka and delivers the demand before Ravana and his counsellors without disguising its threat. As Vali's son and Sugriva's heir, he also carries the history of a family reshaped by Rama's alliance. His presence makes diplomacy personal and political, not a disembodied proclamation shouted from beyond the walls.",
          hi: "अंगद लंका में प्रवेश कर रावण और उसके सलाहकारों के सामने बिना धमकी छिपाए माँग रखते हैं। वाली के पुत्र और सुग्रीव के उत्तराधिकारी होने के कारण वे उस परिवार का इतिहास भी साथ लाते हैं जिसे राम की मित्रता ने बदल दिया। उनकी उपस्थिति संवाद को दीवार के बाहर से चिल्लाई घोषणा नहीं, निजी और राजनीतिक मुलाकात बनाती है।",
        }, "Let Angada's lineage and current alliance appear as two parallel trails behind him while he occupies the centre of Ravana's hall.", ["angada", "ravana", "vali", "sugriva", "rama", "lanka-court"]),
        beat("ravana-orders-an-envoy-killed", { en: "Ravana orders an envoy killed", hi: "रावण दूत-वध का आदेश देता है" }, {
          en: "Ravana answers the unwanted message by ordering Angada seized and killed. Four fighters close around the envoy, violating the protection that keeps communication possible even between enemies. Angada allows them to take hold, then leaps with them and throws them down without remaining for execution, turning their attempted control into his escape.",
          hi: "रावण अप्रिय संदेश का उत्तर अंगद को पकड़कर मारने के आदेश से देता है। चार योद्धा दूत को घेरते हैं और उस सुरक्षा को तोड़ते हैं जो शत्रुओं के बीच भी संवाद संभव रखती है। अंगद उन्हें पकड़ने देते हैं, फिर सबको साथ लेकर छलाँग लगाते और नीचे गिराकर वध के लिए रुके बिना निकल जाते हैं; नियंत्रण का प्रयास उनके पलायन का साधन बनता है।",
        }, "Tighten four capture lines around Angada, then invert them into the upward force of his escape without dwelling on impact injuries.", ["ravana", "angada", "lanka-fighters", "rama", "envoy-law"]),
        beat("the-roof-breaks-and-the-lines-close", { en: "The roof breaks and the lines close", hi: "छत टूटती है और घेरा कसता है" }, {
          en: "Before returning, Angada breaks part of the palace roof, leaving a visible answer to the failed attempt on his life. Back outside, the alliance completes its positions while fear and anticipation spread through Lanka. The diplomatic route has not failed because no alternative existed; it closes because Ravana rejects restitution and attacks the person carrying it.",
          hi: "लौटने से पहले अंगद महल की छत का हिस्सा तोड़ते हैं, जिससे उनके प्राण लेने के प्रयास का दृश्य उत्तर रह जाता है। बाहर मित्र-सेना अपनी तैनाती पूरी करती है और लंका में भय तथा प्रतीक्षा फैलती है। संवाद इसलिए विफल नहीं हुआ कि कोई विकल्प नहीं था; वह इसलिए बंद हुआ क्योंकि रावण ने वापसी ठुकराई और उसे लाने वाले व्यक्ति पर हमला किया।",
        }, "Follow the roof fracture outward until it aligns with the now-complete siege ring, linking the court decision to the citywide consequence.", ["angada", "ravana", "rama", "sugriva", "lanka-inhabitants", "allied-army"]),
      ],
    },
  },
  {
    id: "the-walls-are-assaulted",
    nodeIds: ["rama", "lakshmana", "sugriva", "vibhishana", "nila", "angada", "hanuman", "ravana", "allied-fighters", "lanka-defenders", "lanka-moat", "lanka-walls", "lanka-inhabitants"],
    moment: {
      id: "the-walls-are-assaulted",
      decisiveChange: { en: "The carefully mapped perimeter becomes a place of mass physical contact, and every engineering advantage immediately carries bodily and civic cost.", hi: "सावधानी से समझी गई परिधि सामूहिक शारीरिक टकराव का स्थान बनती है, और हर निर्माणात्मक बढ़त तुरंत शरीरों तथा नगर की कीमत लेकर आती है।" },
      beats: [
        beat("the-moat-begins-to-fill", { en: "The moat begins to fill", hi: "खाई भरनी शुरू होती है" }, {
          en: "At the order to advance, allied fighters carry earth, stone, timber, and whatever the landscape can yield toward the moat. A defensive void becomes crossable only by consuming material and exposing bodies under fire. The action recalls the causeway on a harsher scale: access is constructed through collective labour, but here defenders actively contest every load.",
          hi: "आगे बढ़ने के आदेश पर मित्र-योद्धा मिट्टी, पत्थर, लकड़ी और आसपास से मिल सकने वाली सामग्री खाई की ओर ले जाते हैं। रक्षात्मक खाली स्थान तभी पार होने योग्य बनता है जब सामग्री खर्च हो और शरीर प्रहार के सामने आएँ। यह सेतु-निर्माण की स्मृति को अधिक कठोर रूप में दोहराता है—रास्ता सामूहिक श्रम से बनता है, पर यहाँ हर बोझ का प्रतिरोध हो रहा है।",
        }, "Animate the moat as a changing volume filled by many small contributions while defensive fire continually disrupts the work.", ["allied-fighters", "lanka-defenders", "nila", "hanuman", "lanka-moat"]),
        beat("gates-walls-and-bodies-meet", { en: "Gates, walls, and bodies meet", hi: "द्वार, दीवारें और शरीर टकराते हैं" }, {
          en: "Fighters strike gates, pull at barriers, scale walls, and answer missiles from above with rocks and trees. The fortifications no longer sit as clean geometry on a command map; they concentrate impact at narrow points where many people cannot move freely. Progress is measured in access gained, but each gain leaves injured bodies and broken structures behind.",
          hi: "योद्धा द्वारों पर प्रहार करते, अवरोध खींचते, दीवारों पर चढ़ते और ऊपर से आते शस्त्रों का उत्तर पत्थर तथा वृक्षों से देते हैं। किलेबंदी अब मानचित्र की साफ रेखा नहीं रहती; वह संकरे स्थानों पर प्रहार को केंद्रित करती है जहाँ बहुत से लोग स्वतंत्र नहीं चल सकते। बढ़त प्रवेश से मापी जाती है, पर हर कदम घायल शरीर और टूटी संरचना छोड़ता है।",
        }, "Bring the camera close enough to feel compression at breach points while avoiding slow, celebratory treatment of wounds.", ["allied-fighters", "lanka-defenders", "angada", "hanuman", "lanka-walls", "lanka-gates"]),
        beat("defenders-pour-out", { en: "Defenders pour out", hi: "रक्षक बाहर उमड़ते हैं" }, {
          en: "Lanka's forces open passages and surge into the attackers rather than waiting behind every wall. The battlefield spreads from fixed gates into roads and open ground, breaking the neat four-sector plan into many local collisions. Commanders can still orient the whole, but each group now acts with incomplete sight amid dust, noise, and rapidly changing pressure.",
          hi: "लंका की सेना हर दीवार के पीछे प्रतीक्षा नहीं करती; मार्ग खोलकर आक्रमणकारियों पर बाहर उमड़ती है। युद्ध स्थिर द्वारों से सड़कों और खुले मैदान तक फैलता है, जिससे साफ चार-क्षेत्रीय योजना अनेक स्थानीय टक्करों में टूट जाती है। सेनानायक दिशा दे सकते हैं, पर हर समूह धूल, शोर और बदलते दबाव में अधूरी दृष्टि के साथ कार्य करता है।",
        }, "Fracture the four clean sectors into dozens of moving encounter pockets while preserving orientation lines back to each commander.", ["lanka-defenders", "allied-fighters", "ravana", "rama", "sugriva", "vibhishana"]),
        beat("an-inhabited-city-becomes-contested-ground", { en: "An inhabited city becomes contested ground", hi: "आबाद नगर युद्धभूमि बनता है" }, {
          en: "The assault reaches a city whose gardens, animals, homes, and inhabitants were visible from Suvela only hours earlier. Combat cannot be presented as points accumulating over an empty arena. Restitution was refused by Ravana, yet the resulting danger travels through soldiers, labourers, animals, structures, and people with no control over the court's choice.",
          hi: "आक्रमण ऐसे नगर तक पहुँचता है जिसके उद्यान, पशु, घर और निवासी कुछ घंटे पहले सुवेल से दिखे थे। युद्ध को खाली मैदान में अंक जुटाने जैसा नहीं दिखाया जा सकता। सीता-वापसी रावण ने ठुकराई, पर उसके परिणाम का खतरा सैनिकों, श्रमिकों, पशुओं, इमारतों और उन लोगों तक जाता है जिनका दरबार के निर्णय पर कोई नियंत्रण नहीं था।",
        }, "Keep inhabited layers ghosted beneath the battle paths so every territorial change remains connected to noncombatant life and material loss.", ["lanka-inhabitants", "lanka-animals", "lanka-defenders", "allied-fighters", "ravana", "sita"]),
      ],
    },
  },
  {
    id: "the-first-duels-carry-a-cost",
    nodeIds: ["rama", "lakshmana", "angada", "hanuman", "nila", "sugriva", "indrajit", "jambumali", "nikumbha", "praghasa", "virupaksha", "vibhishana", "battlefield", "broken-vehicles"],
    moment: {
      id: "the-first-duels-carry-a-cost",
      decisiveChange: { en: "The mass assault separates into recognisable encounters without losing the debris, injury, animals, and uncertainty that bind them into one costly battlefield.", hi: "सामूहिक आक्रमण पहचाने जा सकने वाले द्वंद्वों में बँटता है, पर उन्हें एक महँगी युद्धभूमि में जोड़ने वाले मलबे, चोट, पशु और अनिश्चितता गायब नहीं होते।" },
      beats: [
        beat("angada-meets-indrajit", { en: "Angada meets Indrajit", hi: "अंगद इंद्रजित का सामना करते हैं" }, {
          en: "At one part of the perimeter, Angada confronts Indrajit, linking the envoy who just escaped Ravana's court with Lanka's most formidable young commander. Their encounter is not isolated from the siege: nearby formations depend on its outcome, and each lost vehicle or broken weapon changes movement for everyone fighting around them.",
          hi: "परिधि के एक हिस्से में अंगद इंद्रजित से भिड़ते हैं—रावण की सभा से अभी बचकर लौटे दूत का सामना लंका के सबसे प्रबल युवा सेनानायक से होता है। उनका युद्ध घेराबंदी से अलग नहीं है; आसपास की टुकड़ियाँ उसके परिणाम पर निर्भर हैं, और हर टूटा रथ या शस्त्र पास लड़ रहे सब लोगों की गति बदल देता है।",
        }, "Focus on the two young commanders while keeping adjacent formations and shared terrain responsive to every impact.", ["angada", "indrajit", "allied-fighters", "lanka-defenders", "battlefield"]),
        beat("many-pairs-form-at-once", { en: "Many pairs form at once", hi: "अनेक द्वंद्व एक साथ बनते हैं" }, {
          en: "Hanuman meets Jambumali, Nila meets Nikumbha, Sugriva meets Praghasa, Lakshmana meets Virupaksha, and other named opponents find one another across the broken line. One defender called Satrughna is not Rama's brother of the same name. Clear identity matters when repeated names and simultaneous action could otherwise collapse distinct lives.",
          hi: "हनुमान जम्बुमाली, नील निकुंभ, सुग्रीव प्रघस और लक्ष्मण विरूपाक्ष से भिड़ते हैं; टूटी युद्ध-रेखा पर अन्य नामित प्रतिद्वंद्वी भी एक-दूसरे को पाते हैं। यहाँ शत्रु-पक्ष का शत्रुघ्न राम के उसी नाम वाले भाई नहीं हैं। दोहराए नाम और एक साथ घटती घटनाएँ अलग जीवनों को मिला न दें, इसलिए सटीक पहचान आवश्यक है।",
        }, "Build a selectable encounter constellation with explicit identity markers, especially distinguishing the two people named Satrughna.", ["hanuman", "jambumali", "nila", "nikumbha", "sugriva", "praghasa", "lakshmana", "virupaksha", "satrughna-rakshasa"]),
        beat("rama-faces-four-attackers", { en: "Rama faces four attackers", hi: "राम चार आक्रमणकारियों का सामना करते हैं" }, {
          en: "Four defenders press Rama together, and he answers with rapid archery while the wider field shifts around him. The action demonstrates control under pressure without making every death a collectible achievement. Each defeated opponent had a position, companions, and effects on nearby formations; their removal alters the battle rather than merely decorating a hero's reputation.",
          hi: "चार रक्षक एक साथ राम पर दबाव डालते हैं, और वे बदलती युद्धभूमि के बीच तेज धनुर्विद्या से उत्तर देते हैं। यह कार्य दबाव में नियंत्रण दिखाता है, पर हर मृत्यु को संग्रह करने योग्य उपलब्धि नहीं बनाता। हर प्रतिद्वंद्वी की तैनाती, साथी और आसपास की सेना पर प्रभाव था; उनका हटना युद्ध बदलता है, केवल नायक की प्रतिष्ठा नहीं सजाता।",
        }, "Use rapid directional lines around Rama, then show the structural gaps left in the opposing formation instead of celebratory defeat counters.", ["rama", "lanka-commanders", "allied-fighters", "lanka-defenders"]),
        beat("victory-images-share-the-frame-with-loss", { en: "Victory images share the frame with loss", hi: "पराक्रम के साथ हानि भी दिखाई देती है" }, {
          en: "Some encounters end in crushing, tearing, or other severe violence described graphically in the inherited account. The essential outcome can remain without dwelling on bodily spectacle. Broken chariots, fallen animals, blood, abandoned weapons, and exhausted survivors keep every feat inside the accumulating cost of a battle no participant can experience as a clean sequence of triumphs.",
          hi: "कुछ द्वंद्व कुचलने, चीरने या अन्य अत्यंत हिंसक परिणामों पर समाप्त होते हैं, जिन्हें पुराना विवरण बहुत विस्तार से बताता है। आवश्यक परिणाम शरीर की यातना पर रुके बिना रखा जा सकता है। टूटे रथ, गिरे पशु, रक्त, छोड़े शस्त्र और थके जीवित लोग हर पराक्रम को उस बढ़ती कीमत में रखते हैं जिसे कोई प्रतिभागी साफ विजय-श्रृंखला की तरह अनुभव नहीं कर सकता।",
        }, "Survey debris, injured survivors, and fallen animals between encounters, using restraint and distance rather than graphic close-ups.", ["allied-fighters", "lanka-defenders", "battlefield-animals", "broken-vehicles", "rama", "lakshmana"]),
      ],
    },
  },
  {
    id: "night-erases-friend-and-foe",
    nodeIds: ["rama", "lakshmana", "angada", "indrajit", "hanuman", "sugriva", "vibhishana", "allied-fighters", "lanka-defenders", "night-battlefield", "serpent-arrows", "broken-chariot"],
    moment: {
      id: "night-erases-friend-and-foe",
      decisiveChange: { en: "Darkness destroys reliable recognition, and Indrajit's unseen return ends the first assault with Rama and Lakshmana bound and unable to continue.", hi: "अँधेरा विश्वसनीय पहचान मिटा देता है, और इंद्रजित की अदृश्य वापसी प्रारंभिक आक्रमण को राम-लक्ष्मण के बँधे और अक्षम पड़े रहने पर रोक देती है।" },
      beats: [
        beat("darkness-breaks-identification", { en: "Darkness breaks identification", hi: "अँधेरा पहचान तोड़ देता है" }, {
          en: "Night settles over dust, damaged streets, and mixed formations until fighters must challenge shapes before knowing whether they face a companion or opponent. The earlier recognition plan weakens when colour, distance, and familiar form disappear. Confusion is not cowardice; it is an environmental condition that makes every movement and missile more dangerous.",
          hi: "रात धूल, टूटी सड़कों और मिली-जुली टुकड़ियों पर उतरती है, और योद्धाओं को हर आकृति से पूछना पड़ता है कि वह साथी है या शत्रु। रंग, दूरी और परिचित रूप मिटते ही पहले बनाई पहचान-योजना कमजोर हो जाती है। भ्रम कायरता नहीं, ऐसी परिस्थिति है जो हर कदम और हर शस्त्र को अधिक खतरनाक बनाती है।",
        }, "Reduce visibility to short moving cones and uncertain silhouettes while preserving reliable retreat anchors at the edge of the field.", ["allied-fighters", "lanka-defenders", "rama", "lakshmana", "night-battlefield"]),
        beat("voices-and-weapons-replace-sight", { en: "Voices and weapons replace sight", hi: "दृष्टि की जगह आवाज़ और शस्त्र लेते हैं" }, {
          en: "Calls, impact sounds, bowstrings, and brief flashes become the only orientation available. Rama and Lakshmana shoot at visible and unseen pressure while local groups try to remain connected. The same darkness can conceal an escape, an ambush, or a friend, so confident moral labels cannot substitute for knowing what actually occurred in each obscured encounter.",
          hi: "पुकार, टकराव की आवाज़, धनुष की टंकार और क्षणिक चमक ही दिशा देती हैं। राम और लक्ष्मण दिखाई तथा अनदेखे दबाव का उत्तर देते हैं, जबकि छोटे दल संपर्क बचाने की कोशिश करते हैं। यही अँधेरा पलायन, घात या मित्र—किसी को भी छिपा सकता है; इसलिए दृढ़ नैतिक विशेषण हर धुँधली घटना की वास्तविक जानकारी का स्थान नहीं ले सकते।",
        }, "Make sound pulses and brief weapon flashes carry navigation, with uncertainty remaining visible instead of auto-identifying every target.", ["rama", "lakshmana", "allied-fighters", "lanka-defenders", "night-battlefield"]),
        beat("angada-breaks-indrajits-chariot", { en: "Angada breaks Indrajit's chariot", hi: "अंगद इंद्रजित का रथ तोड़ते हैं" }, {
          en: "Angada reaches Indrajit's vehicle, kills its animals and driver, and destroys the platform that made the commander visible and mobile. The immediate contest appears won, but Indrajit responds by abandoning the form Angada can track. A successful blow against equipment therefore changes the conflict without removing the opponent behind it.",
          hi: "अंगद इंद्रजित के रथ तक पहुँचकर उसके पशुओं और सारथी को मारते तथा उस मंच को नष्ट करते हैं जो सेनानायक को दृश्य और गतिशील बनाता था। तत्काल द्वंद्व जीता हुआ लगता है, पर इंद्रजित उस रूप को छोड़ देता है जिसे अंगद पहचान सकते हैं। साधन पर सफल प्रहार संघर्ष बदलता है, पर उसके पीछे के प्रतिद्वंद्वी को समाप्त नहीं करता।",
        }, "Shatter the chariot's bright mobility node, then let Indrajit's presence detach from it and fade into the surrounding dark.", ["angada", "indrajit", "chariot-animals", "charioteer", "broken-chariot"]),
        beat("the-unseen-attack-returns", { en: "The unseen attack returns", hi: "अदृश्य आक्रमण लौटता है" }, {
          en: "Hidden from ordinary sight, Indrajit circles back and launches serpent-like arrows at Rama and Lakshmana. His tactic is asymmetric and devastating; it need not be described as proof of an innately corrupt nature. The brothers cannot answer an attacker they cannot locate, and wounds accumulate before the alliance understands where the attack originates.",
          hi: "साधारण दृष्टि से छिपा इंद्रजित लौटकर राम और लक्ष्मण पर सर्प-जैसे बाण चलाता है। उसकी रणनीति असमान और विनाशकारी है; उसे जन्मजात दुष्ट स्वभाव का प्रमाण कहने की आवश्यकता नहीं। दोनों भाई ऐसे आक्रमणकारी को उत्तर नहीं दे सकते जिसका स्थान दिखाई नहीं देता, और सेना दिशा समझे उससे पहले घाव बढ़ते जाते हैं।",
        }, "Trace arrows from shifting empty origins, refusing to reveal a fixed attacker position that the people on the ground cannot know.", ["indrajit", "rama", "lakshmana", "allied-fighters", "serpent-arrows"]),
        beat("the-brothers-fall-bound", { en: "The brothers fall bound", hi: "दोनों भाई बँधकर गिरते हैं" }, {
          en: "The serpent-like missiles tighten around Rama and Lakshmana until both fall unable to continue. The opening assault ends not with a resolved victory but with the alliance's central figures incapacitated inside hostile darkness. Every surrounding relationship changes at once: protection, command, morale, rescue, and the next decision must now be carried by others.",
          hi: "सर्प-जैसे बाण राम और लक्ष्मण के चारों ओर कसते हैं, जब तक दोनों लड़ने में असमर्थ होकर गिर नहीं जाते। प्रारंभिक आक्रमण किसी पूर्ण विजय पर नहीं, बल्कि शत्रुतापूर्ण अँधेरे में मित्र-सेना के केंद्रीय व्यक्तियों के अक्षम होने पर रुकता है। सुरक्षा, कमान, मनोबल, बचाव और अगला निर्णय—हर संबंध अब तुरंत दूसरों के कंधों पर आ जाता है।",
        }, "Drop the two central lights without ending the world; surrounding ally nodes should surge into new rescue and command responsibilities.", ["rama", "lakshmana", "indrajit", "hanuman", "sugriva", "vibhishana", "allied-fighters"]),
      ],
    },
  },
];
