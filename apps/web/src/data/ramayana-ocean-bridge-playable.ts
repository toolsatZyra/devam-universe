import type { StoryBeat } from "@/lib/domain/story-world";
import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

const beat = (
  id: string,
  title: { en: string; hi: string },
  narration: { en: string; hi: string },
  visualCue: string,
  characterIds: string[],
): StoryBeat => ({ id, title, narration, visualCue, characterIds });

export const RAMAYANA_OCEAN_BRIDGE_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "praise-becomes-a-crossing-question",
    nodeIds: ["rama", "hanuman", "sugriva", "lakshmana", "sita", "vanara-army", "prasravana", "southern-ocean", "lanka", "crossing-question", "allied-council"],
    moment: {
      id: "praise-becomes-a-crossing-question",
      decisiveChange: { en: "Successful contact with Sita becomes a shared engineering and mobilisation problem rather than a finished rescue.", hi: "सीता से सफल संपर्क पूर्ण उद्धार नहीं माना जाता, बल्कि साझा निर्माण और सेना-संचालन की समस्या बन जाता है।" },
      beats: [
        beat("hanuman-exceeds-the-assignment", { en: "Hanuman brings more than the requested answer", hi: "हनुमान माँगे गए उत्तर से अधिक लेकर लौटते हैं" }, {
          en: "Rama distinguishes between merely completing an instruction and acting intelligently beyond it. Hanuman crossed the sea, entered a guarded city, found Sita, tested the danger around her, and returned with usable knowledge. The praise rests on initiative tied to the mission, not on strength detached from responsibility.",
          hi: "राम केवल आदेश पूरा करने और समझदारी से उससे आगे बढ़ने के बीच अंतर करते हैं। हनुमान समुद्र पार गए, सुरक्षित नगर में घुसे, सीता को खोजा, उनके चारों ओर के संकट को परखा और उपयोगी जानकारी लेकर लौटे। प्रशंसा जिम्मेदारी से जुड़ी पहल की है, उद्देश्य से अलग शक्ति की नहीं।",
        }, "Let Hanuman's completed route illuminate in stages—crossing, entry, contact, observation, and return—while each stage feeds the next decision.", ["rama", "hanuman", "sita", "lanka"]),
        beat("the-embrace-is-the-immediate-reward", { en: "Rama gives the reward available to him", hi: "राम वही पुरस्कार देते हैं जो अभी उनके पास है" }, {
          en: "Without a kingdom or treasure at hand, Rama says he cannot match the value of Hanuman's service with wealth. He draws Hanuman into an embrace instead. The moment makes gratitude physical and immediate, while refusing to pretend that affection cancels the unpaid labour, danger, or difficult work still ahead.",
          hi: "राज्य या धन हाथ में न होने पर राम कहते हैं कि वे हनुमान के कार्य के बराबर संपत्ति नहीं दे सकते। वे उन्हें आलिंगन में लेते हैं। यह क्षण कृतज्ञता को तत्काल और मानवीय बनाता है, पर ऐसा दिखावा नहीं करता कि स्नेह से श्रम, जोखिम या आगे का कठिन काम समाप्त हो गया।",
        }, "Hold the embrace at the centre while the ocean and distant Lanka remain visible behind it, keeping gratitude and unfinished danger in one frame.", ["rama", "hanuman", "sita"]),
        beat("the-ocean-replaces-uncertainty", { en: "Knowing where Sita is reveals the next barrier", hi: "सीता का स्थान जानने से अगली बाधा स्पष्ट होती है" }, {
          en: "Rama's relief quickly meets a harder fact: an army cannot follow Hanuman's solitary leap. He names possible ways across—power, a built passage, or some means not yet known—but does not mistake possibility for a plan. The rescue has moved from uncertainty about Sita to the measurable width and danger of the sea.",
          hi: "राम की राहत शीघ्र ही कठोर तथ्य से टकराती है—पूरी सेना हनुमान की अकेली छलाँग नहीं दोहरा सकती। वे शक्ति, निर्मित मार्ग या अभी अज्ञात उपाय की संभावना रखते हैं, पर संभावना को योजना नहीं मानते। अब उद्धार सीता के स्थान की अनिश्चितता से समुद्र की मापी जा सकने वाली चौड़ाई और जोखिम तक आ गया है।",
        }, "Transform the glowing return route into a wide ocean-scale view where one airborne path cannot carry the thousands gathering behind Rama.", ["rama", "hanuman", "sugriva", "vanara-army", "southern-ocean"]),
        beat("sugriva-refuses-paralysis", { en: "Sugriva pushes against paralysis, not feeling", hi: "सुग्रीव भावना नहीं, जड़ता को चुनौती देते हैं" }, {
          en: "Sugriva answers with harsh language shaped by a warrior court, yet the useful core is practical: Sita is alive, Lanka is known, and capable allies are present. Grief need not disappear before deliberation begins. What must change is the belief that sorrow leaves no room for route design, preparation, or collective action.",
          hi: "सुग्रीव योद्धा-सभा की कठोर भाषा में उत्तर देते हैं, पर उपयोगी बात व्यावहारिक है—सीता जीवित हैं, लंका का पता है और सक्षम साथी उपस्थित हैं। विचार शुरू होने से पहले शोक मिटना आवश्यक नहीं। बदलना यह विश्वास है कि दुःख के रहते मार्ग, तैयारी या सामूहिक कार्य संभव नहीं।",
        }, "Show grief remaining beside Rama while planning lights appear around it; do not animate emotion as an obstacle that must be erased before action.", ["sugriva", "rama", "lakshmana", "sita", "vanara-army"]),
        beat("a-shared-question-opens", { en: "The company inherits the crossing question", hi: "समुद्र-पार का प्रश्न पूरे दल का बनता है" }, {
          en: "Rama asks for facts about Lanka and the way to it. That request changes the company's posture from celebration to reconnaissance, logistics, and design. Hanuman's rare ability remains vital, but the next success must distribute movement and safety across an entire alliance rather than depend on one extraordinary body.",
          hi: "राम लंका और वहाँ पहुँचने के मार्ग के तथ्य माँगते हैं। यह प्रश्न दल को उत्सव से जाँच, रसद और निर्माण की मुद्रा में लाता है। हनुमान की दुर्लभ क्षमता महत्वपूर्ण रहती है, पर अगली सफलता को एक असाधारण शरीर पर निर्भर रहने के बजाय पूरी मित्र-सेना की गति और सुरक्षा बाँटनी होगी।",
        }, "Expand a single luminous leap line into a collaborative planning table of coast, route, supplies, formations, bridge ideas, and Lanka defences.", ["rama", "hanuman", "sugriva", "lakshmana", "vanara-army"]),
      ],
    },
  },
  {
    id: "hanuman-maps-lanka",
    nodeIds: ["hanuman", "rama", "sugriva", "lakshmana", "ravana", "lanka-defenders", "lanka", "lanka-gates", "lanka-walls", "lanka-moats", "pushpaka", "defence-map"],
    moment: {
      id: "hanuman-maps-lanka",
      decisiveChange: { en: "A remembered city becomes an operational map whose strengths, vulnerabilities, and prior damage can guide a collective crossing.", hi: "देखा हुआ नगर ऐसा कार्यशील मानचित्र बनता है जिसकी शक्ति, कमजोरियाँ और पिछला नुकसान सामूहिक समुद्र-पार का मार्ग दिखा सकते हैं।" },
      beats: [
        beat("rama-asks-for-usable-intelligence", { en: "Rama asks how Lanka actually works", hi: "राम पूछते हैं कि लंका वास्तव में कैसे सुरक्षित है" }, {
          en: "Rama does not ask Hanuman to repeat the most spectacular moments of his raid. He asks for the gates, defensive works, troop positions, roads, machines, and natural barriers that another force must face. The debrief changes memory into shared intelligence and separates inspiring courage from information that can keep others alive.",
          hi: "राम हनुमान से आक्रमण के सबसे चमत्कारी क्षण दोहराने को नहीं कहते। वे द्वार, रक्षा-व्यवस्था, सैनिक जमाव, मार्ग, यंत्र और प्राकृतिक बाधाएँ पूछते हैं जिनका सामना दूसरी सेना करेगी। यह वार्ता स्मृति को साझा जानकारी बनाती है और प्रेरक साहस को उस ज्ञान से अलग करती है जो दूसरों के प्राण बचा सकता है।",
        }, "Build the city from Hanuman's recollection layer by layer, with every gate and barrier appearing only as he names its practical function.", ["rama", "hanuman", "sugriva", "lakshmana"]),
        beat("the-island-is-a-defence", { en: "The sea is part of Lanka's fortification", hi: "समुद्र लंका की रक्षा का हिस्सा है" }, {
          en: "Hanuman places the city on a mountain within an island, difficult to approach before any wall is reached. Height, water, distance, and limited landing space work together. The ocean is therefore not empty scenery between heroes and a destination; it is the first defensive system that shapes every later choice.",
          hi: "हनुमान नगर को द्वीप के भीतर पर्वत पर रखते हैं, जहाँ दीवार तक पहुँचने से पहले ही निकट आना कठिन है। ऊँचाई, जल, दूरी और सीमित उतरने की जगह मिलकर रक्षा करते हैं। इसलिए समुद्र नायकों और गंतव्य के बीच खाली दृश्य नहीं, बल्कि हर आगे के निर्णय को आकार देने वाली पहली रक्षा-व्यवस्था है।",
        }, "Rotate from the camp map into a deep island profile showing sea depth, mountain elevation, shore access, walls, and the city above them.", ["hanuman", "rama", "lanka", "southern-ocean"]),
        beat("four-gates-hold-different-risks", { en: "Each gate carries a different concentration of force", hi: "हर द्वार पर अलग प्रकार का सैन्य जोखिम है" }, {
          en: "Hanuman describes four gates, walls, moats, bridges, weapons, and defenders distributed unevenly around the city. A route cannot be chosen from distance alone. The allies will need to understand where machines, deep water, massed troops, and narrow access combine before they commit thousands to one approach.",
          hi: "हनुमान चार द्वार, दीवारें, खाइयाँ, पुल, अस्त्र और नगर के चारों ओर असमान रूप से बँटे रक्षक बताते हैं। केवल दूरी देखकर मार्ग नहीं चुना जा सकता। हजारों योद्धाओं को किसी दिशा में भेजने से पहले मित्रों को समझना होगा कि यंत्र, गहरा जल, भारी सेना और संकरा प्रवेश कहाँ एक साथ आते हैं।",
        }, "Split the city ring into four living defence sectors with distinct troop density, machines, bridge access, moat depth, and possible approach lines.", ["hanuman", "lanka-defenders", "ravana", "rama", "sugriva"]),
        beat("the-raid-left-real-damage", { en: "Hanuman includes the damage he caused", hi: "हनुमान अपने किए नुकसान को भी मानचित्र में रखते हैं" }, {
          en: "He reports broken bridges, a filled moat, destroyed defenders, damaged buildings, and the fire that spread beyond controlled targets. These effects may weaken Lanka, but they also mean heightened alert, grieving households, disrupted streets, and defenders who have already seen the alliance's reach. Advantage and consequence enter the same map.",
          hi: "वे टूटे पुल, भरी गई खाई, मारे गए रक्षक, क्षतिग्रस्त भवन और नियंत्रित लक्ष्य से बाहर फैली आग बताते हैं। इससे लंका कमजोर हो सकती है, पर नगर अधिक सतर्क है, परिवार शोक में हैं, मार्ग बाधित हैं और रक्षक मित्र-सेना की पहुँच देख चुके हैं। लाभ और परिणाम एक ही मानचित्र में दर्ज होते हैं।",
        }, "Overlay damaged bridges, blocked moat sections, burned districts, civilian movement, funerary lights, and reinforced alerts without turning destruction into a score counter.", ["hanuman", "lanka-defenders", "ravana", "lanka"]),
      ],
    },
  },
  {
    id: "the-army-marches-south",
    nodeIds: ["rama", "lakshmana", "sugriva", "hanuman", "nila", "angada", "jambavan", "vanara-army", "bear-army", "sahya", "malaya", "mahendra", "southern-ocean", "march-route", "water-scouts"],
    moment: {
      id: "the-army-marches-south",
      decisiveChange: { en: "Lanka intelligence becomes a guarded southward mobilisation whose scale creates responsibilities as well as power.", hi: "लंका की जानकारी सुरक्षित दक्षिणी अभियान बनती है, जिसका विशाल आकार शक्ति के साथ जिम्मेदारियाँ भी पैदा करता है।" },
      beats: [
        beat("nila-scouts-food-and-water", { en: "The route begins with water and food", hi: "मार्ग की शुरुआत जल और भोजन से होती है" }, {
          en: "Rama appoints Nila to scout a path with drinkable water, fruit, roots, shade, and terrain an immense company can cross. He also warns that wells and provisions may be poisoned. The march begins with ordinary needs and contamination risk, not with an abstract arrow racing toward Lanka.",
          hi: "राम नील को ऐसा मार्ग खोजने भेजते हैं जहाँ पीने योग्य जल, फल, कंद, छाया और विशाल दल के योग्य भूभाग मिले। वे कुओं और भोजन में विष मिलाए जाने की चेतावनी भी देते हैं। यात्रा किसी काल्पनिक तीर की तरह नहीं, साधारण जरूरतों और दूषण के जोखिम से शुरू होती है।",
        }, "Trace the route through water checks, edible groves, shade, gradients, camp capacity, and suspected contamination before any formation begins to move.", ["rama", "nila", "vanara-army", "bear-army"]),
        beat("the-column-distributes-protection", { en: "No single hero protects the whole march", hi: "पूरी यात्रा की रक्षा किसी एक नायक पर नहीं है" }, {
          en: "Leadership is distributed through front, centre, flank, and rear assignments. Hanuman and Angada carry Rama and Lakshmana where needed, while Sugriva, Jambavan, and other commanders keep units connected. Fitness for a forced march matters, so those unable to endure it are not turned into invisible burdens on the road.",
          hi: "आगे, मध्य, किनारे और पीछे की जिम्मेदारियाँ बाँटी जाती हैं। हनुमान और अंगद आवश्यकता पर राम तथा लक्ष्मण को ले जाते हैं, जबकि सुग्रीव, जाम्बवान और अन्य नेता दलों को जुड़े रखते हैं। कठिन यात्रा की क्षमता महत्वपूर्ण है, इसलिए असमर्थ साथियों को मार्ग पर अदृश्य बोझ नहीं बनाया जाता।",
        }, "Show a flexible travelling formation with named protection zones, relay signals, rest decisions, and safe fallback positions instead of one undifferentiated crowd.", ["rama", "lakshmana", "hanuman", "angada", "sugriva", "jambavan", "vanara-army"]),
        beat("the-host-crosses-mountain-worlds", { en: "The southward road changes around the travellers", hi: "यात्रियों के साथ दक्षिणी भू-दृश्य बदलते जाते हैं" }, {
          en: "The allied host moves through Sahya and Malaya, ascends Mahendra, drinks from rivers, and passes flowering forests alive with birds and animals. Distance is felt through changing elevation, vegetation, water, sound, and fatigue. The ocean is earned as a destination after a long terrestrial movement rather than appearing after a cut.",
          hi: "मित्र-सेना सह्य और मलय से गुजरती, महेंद्र पर चढ़ती, नदियों से जल पीती और पक्षियों तथा जीवों से भरे पुष्पित वनों से निकलती है। बदलती ऊँचाई, वनस्पति, जल, ध्वनि और थकान से दूरी महसूस होती है। समुद्र अचानक दृश्य बदलने से नहीं, लंबी स्थलीय यात्रा के बाद प्राप्त गंतव्य बनता है।",
        }, "Move continuously through mountain passes, river halts, forest canopies, changing weather, and accumulated fatigue until the horizon becomes water.", ["rama", "lakshmana", "sugriva", "hanuman", "vanara-army", "bear-army"]),
        beat("the-march-damages-what-it-crosses", { en: "Celebration and scale leave damage behind", hi: "उत्साह और विशालता पीछे नुकसान छोड़ते हैं" }, {
          en: "Members of the host break branches, tear creepers, scatter fruit, and disturb animals as they surge south. Nearby settlements are described as subdued by the army's presence. These details keep mobilisation from becoming consequence-free spectacle: friendly purpose does not automatically make every footprint harmless.",
          hi: "दक्षिण बढ़ते दल के सदस्य शाखाएँ तोड़ते, लताएँ फाड़ते, फल बिखेरते और जीवों को विचलित करते हैं। पास की बस्तियाँ सेना की उपस्थिति से दब जाती हैं। ये बातें अभियान को परिणामहीन तमाशा नहीं बनने देतीं—मित्र उद्देश्य अपने आप हर पदचिह्न को निरापद नहीं बनाता।",
        }, "Leave visible broken growth, displaced animals, trampled ground, guarded village edges, and repair questions behind the otherwise exhilarating column.", ["vanara-army", "bear-army", "rama", "sugriva"]),
        beat("the-sea-stops-the-column", { en: "A moving world becomes a coastal camp", hi: "गतिमान संसार तटीय शिविर बन जाता है" }, {
          en: "From Mahendra, Rama sees the ocean extending beyond ordinary measure. He orders the host to stop, camp by units, guard against disguise and infiltration, and wait for counsel. The immense living sea—with waves, fish, serpents, and changing light—faces an equally immense land force that cannot simply continue walking.",
          hi: "महेंद्र से राम साधारण माप से परे फैला समुद्र देखते हैं। वे सेना को रोककर दलवार शिविर बनाने, रूप बदलकर घुसपैठ से सावधान रहने और विचार की प्रतीक्षा करने का आदेश देते हैं। लहरों, मछलियों, सर्पों और बदलती रोशनी वाला विशाल जीवित समुद्र उस बड़ी स्थल-सेना के सामने है जो अब सीधे चल नहीं सकती।",
        }, "End the march with the whole formation braking at a living coastline, units settling into guarded camps while the water continues moving beyond them.", ["rama", "lakshmana", "sugriva", "vanara-army", "bear-army", "southern-ocean"]),
      ],
    },
  },
  {
    id: "night-beside-the-sea",
    nodeIds: ["rama", "lakshmana", "sita", "nila", "mainda", "dvivida", "vanara-army", "ocean-camp", "northern-shore", "lanka", "moon", "evening-rites"],
    moment: {
      id: "night-beside-the-sea",
      decisiveChange: { en: "The military halt exposes the full emotional distance between Rama and Sita while companionship keeps despair from becoming disappearance.", hi: "सैन्य विराम राम और सीता के बीच की पूरी भावनात्मक दूरी खोल देता है, जबकि साथ उन्हें निराशा में खोने से बचाता है।" },
      beats: [
        beat("nila-secures-the-shore", { en: "The camp keeps watch while Rama cannot rest", hi: "शिविर पहरा देता है, पर राम विश्राम नहीं कर पाते" }, {
          en: "Nila arranges the host on the northern shore while Mainda and Dvivida patrol its edges. Thousands settle into a guarded order, but military security cannot make Sita nearer. The contrast matters: the camp can reduce an external threat even while Rama's inward distress grows through the stillness.",
          hi: "नील उत्तरी तट पर सेना व्यवस्थित करते हैं और मैन्द तथा द्विविद किनारों पर गश्त करते हैं। हजारों साथी सुरक्षित क्रम में ठहरते हैं, पर सैन्य सुरक्षा सीता को निकट नहीं ला सकती। शिविर बाहरी खतरा घटा सकता है, जबकि स्थिरता में राम की भीतर की पीड़ा बढ़ती है।",
        }, "Keep patrol lights moving around an orderly camp while Rama remains still at the waterline, making outer safety and inner unrest visibly different.", ["nila", "mainda", "dvivida", "vanara-army", "rama"]),
        beat("time-does-not-soften-the-separation", { en: "The passing days sharpen absence", hi: "बीते दिन अनुपस्थिति को और तीखा करते हैं" }, {
          en: "Rama says ordinary grief may lessen with time, yet separation from Sita is increasing because her remaining safety is limited. Knowing she is alive does not end fear; it creates a clock. The ocean wind and moon become imagined points of contact when direct touch and speech remain impossible.",
          hi: "राम कहते हैं कि सामान्य दुःख समय के साथ घट सकता है, पर सीता का वियोग बढ़ रहा है क्योंकि उनकी सुरक्षित रहने की अवधि सीमित है। उनके जीवित होने का ज्ञान भय समाप्त नहीं करता, बल्कि समय की घड़ी शुरू करता है। प्रत्यक्ष स्पर्श और संवाद असंभव होने पर समुद्री हवा और चाँद कल्पित संपर्क बनते हैं।",
        }, "Let the moonlight and wind cross the water toward Lanka while a visible time pulse tightens around Sita's distant position without claiming real communication.", ["rama", "sita", "lakshmana", "moon"]),
        beat("despair-speaks-of-the-deep", { en: "Rama imagines ending his pain in the sea", hi: "राम समुद्र में अपना दुःख समाप्त करने की कल्पना करते हैं" }, {
          en: "At the edge of exhaustion, Rama tells Lakshmana that he could enter the deep so the fire of separation no longer burns him. The thought is not treated as a noble command or a solution. It marks how close longing, helplessness, and the visible barrier have pressed together during the night.",
          hi: "थकान की सीमा पर राम लक्ष्मण से कहते हैं कि वे गहरे जल में उतर जाएँ तो वियोग की आग उन्हें न जलाए। इस विचार को महान आदेश या समाधान नहीं बनाया जाता। यह दिखाता है कि रात में लालसा, असहायता और सामने की बाधा कितनी निकट आ गई हैं।",
        }, "Darken the water into an unsafe pull while Lakshmana's steady presence and the ordered camp keep a grounded return path open behind Rama.", ["rama", "lakshmana", "sita", "southern-ocean"]),
        beat("lakshmana-stays-through-evening", { en: "Companionship carries the night", hi: "साथ रात को पार कराता है" }, {
          en: "Lakshmana consoles Rama without arguing that Sita is replaceable or that grief is weakness. The day ends, evening observance gives time a small structure, and Rama remains among companions rather than vanishing into the water. No bridge exists yet, but a human connection holds until practical counsel can resume.",
          hi: "लक्ष्मण राम को यह कहे बिना संभालते हैं कि सीता का स्थान कोई ले सकता है या दुःख कमजोरी है। दिन समाप्त होता है, संध्या-आचरण समय को छोटा ढाँचा देता है और राम जल में खोने के बजाय साथियों के बीच रहते हैं। अभी सेतु नहीं है, पर व्यावहारिक विचार लौटने तक मानवीय संबंध उन्हें थामे रखता है।",
        }, "Close on Lakshmana beside Rama through the evening rite, with camp rhythms continuing softly and the unbuilt crossing still dark ahead.", ["rama", "lakshmana", "sita", "vanara-army"]),
      ],
    },
  },
  {
    id: "lanka-mistakes-flattery-for-counsel",
    nodeIds: ["ravana", "prahasta", "durmukha", "vajradanshtra", "nikumbha", "vajrahanu", "indrajit", "lanka-councillors", "lanka", "ravana-council", "lanka-defences", "deception-plan", "hanuman"],
    moment: {
      id: "lanka-mistakes-flattery-for-counsel",
      decisiveChange: { en: "A council summoned to confront danger rewards Ravana with reassurance, escalation, and deception instead of corrective truth.", hi: "संकट का सामना करने के लिए बुलाई सभा रावण को सुधारक सत्य के बजाय आश्वासन, हिंसक बढ़त और छल देती है।" },
      beats: [
        beat("ravana-names-the-breach", { en: "Ravana admits that one messenger broke Lanka's confidence", hi: "रावण मानता है कि एक दूत ने लंका का विश्वास तोड़ दिया" }, {
          en: "Ravana opens by naming what Hanuman achieved: entry into an inaccessible city, contact with Sita, destruction inside the capital, and a safe escape. He asks what must be done before Rama arrives. For a brief moment, the court has the facts needed for honest correction and a chance to consider returning Sita.",
          hi: "रावण आरंभ में हनुमान की उपलब्धि स्पष्ट करता है—दुर्गम नगर में प्रवेश, सीता से संपर्क, राजधानी के भीतर विनाश और सुरक्षित वापसी। वह पूछता है कि राम के आने से पहले क्या किया जाए। कुछ क्षणों के लिए सभा के पास ईमानदार सुधार और सीता को लौटाने पर विचार करने के सभी तथ्य मौजूद हैं।",
        }, "Open the council with Hanuman's route and damaged districts projected plainly above the table before pride begins covering evidence with older triumphs.", ["ravana", "hanuman", "lanka-councillors", "sita"]),
        beat("consultation-is-praised-in-theory", { en: "The king explains good counsel before refusing it", hi: "राजा अच्छी सलाह समझाता है, फिर उसे स्वीकार नहीं करता" }, {
          en: "Ravana describes good deliberation as informed, collaborative, and capable of reaching a sound decision after disagreement. He contrasts it with impulsive action that starts before consequences are understood. The standard is perceptive, but the meeting will reveal whether the king can tolerate advice that threatens his desire.",
          hi: "रावण अच्छी विचार-प्रक्रिया को जानकारीपूर्ण, सामूहिक और मतभेद के बाद सही निर्णय तक पहुँचने योग्य बताता है। वह परिणाम समझे बिना शुरू होने वाले उतावले कार्य से उसका अंतर करता है। मानक समझदार है, पर सभा बताएगी कि राजा अपनी इच्छा को चुनौती देने वाली सलाह सह सकता है या नहीं।",
        }, "Place the king's three counsel paths above the chamber, then show the honest branch dim whenever a courtier watches Ravana's reaction before speaking.", ["ravana", "lanka-councillors", "prahasta"]),
        beat("old-victories-replace-present-measure", { en: "Courtiers answer with Ravana's past", hi: "दरबारी वर्तमान के बदले रावण का अतीत सुनाते हैं" }, {
          en: "The first replies catalogue former conquests over celestial, serpent, and underworld opponents, then assume Rama must be weaker. None explains why those victories prevented Hanuman's breach or how they solve the ocean-side mobilisation now underway. Flattery turns history into immunity from new evidence.",
          hi: "पहले उत्तर देव, सर्प और अधोलोक के विरोधियों पर पुरानी विजयों की सूची देते हैं और मान लेते हैं कि राम उनसे कमजोर होंगे। कोई नहीं बताता कि उन विजयों ने हनुमान का प्रवेश क्यों नहीं रोका या समुद्र तट पर हो रही तैयारी का समाधान कैसे होगा। चापलूसी इतिहास को नए प्रमाण से बचाव का कवच बना देती है।",
        }, "Let towering icons of old victories crowd out the small but current breach map, making the council's attention failure visible without validating every boast.", ["ravana", "indrajit", "lanka-councillors", "hanuman", "rama"]),
        beat("boasts-escalate-without-coordination", { en: "Every warrior claims the whole war", hi: "हर योद्धा पूरा युद्ध अकेले जीतने का दावा करता है" }, {
          en: "Prahasta, Durmukha, Nikumbha, Vajrahanu, and others each promise to destroy the enemy alone. Their speeches grow more violent as practical detail disappears. The pattern produces no command structure, supply plan, civilian protection, or response to the bridge problem—only competing performances of certainty.",
          hi: "प्रहस्त, दुर्मुख, निकुंभ, वज्रहनु और अन्य प्रत्येक शत्रु को अकेले नष्ट करने का दावा करते हैं। व्यावहारिक विवरण घटते जाते हैं और भाषण अधिक हिंसक होते हैं। इससे न नेतृत्व-रचना बनती है, न रसद, न नागरिक सुरक्षा, न सेतु-समस्या का उत्तर—केवल निश्चितता का प्रतिस्पर्धी प्रदर्शन बचता है।",
        }, "Animate each solo-war claim as an isolated attack line that collides with the others and leaves defence, supplies, civilians, and the coast unattended.", ["prahasta", "durmukha", "nikumbha", "vajrahanu", "ravana", "lanka-councillors"]),
        beat("deception-enters-the-plan", { en: "A false message is offered as strategy", hi: "झूठा संदेश रणनीति के रूप में पेश होता है" }, {
          en: "Vajradanshtra proposes that disguised fighters claim Bharata sent them, lure Rama into movement, and attack from the sky. The proposal recognises that trust can change an army's behaviour, but uses that insight to counterfeit kinship. Lanka's first concrete plan is not repair or defence; it is manufactured confidence followed by ambush.",
          hi: "वज्रदंष्ट्र प्रस्ताव देता है कि रूप बदले योद्धा कहें कि भरत ने उन्हें भेजा है, राम को चलने के लिए बहकाएँ और आकाश से हमला करें। योजना मानती है कि विश्वास सेना का व्यवहार बदल सकता है, पर इस समझ का उपयोग झूठी रिश्तेदारी बनाने में करती है। लंका की पहली ठोस योजना सुधार या रक्षा नहीं, नकली भरोसा और घात है।",
        }, "Show the counterfeit Bharata route as a visually corrupted trust line that opens into hidden aerial attack positions instead of a genuine allied path.", ["vajradanshtra", "ravana", "rama", "bharata", "lanka-councillors"]),
      ],
    },
  },
  {
    id: "vibhishana-asks-for-sitas-return",
    nodeIds: ["vibhishana", "ravana", "prahasta", "indrajit", "lanka-councillors", "sita", "rama", "ravana-council", "ravana-chamber", "lanka", "ashoka-grove", "return-sita", "warning-signs"],
    moment: {
      id: "vibhishana-asks-for-sitas-return",
      decisiveChange: { en: "Vibhishana turns scattered danger into one corrective demand—return Sita—while Ravana chooses desire over the welfare of Lanka.", hi: "विभीषण बिखरे संकट को एक सुधारक माँग में बदलते हैं—सीता को लौटाओ—जबकि रावण लंका के कल्याण के ऊपर अपनी इच्छा चुनता है।" },
      beats: [
        beat("vibhishana-stops-the-armed-rush", { en: "One voice interrupts the rush to weapons", hi: "एक आवाज हथियारों की उतावली रोकती है" }, {
          en: "As the council rises with clubs, spears, swords, and arrows, Vibhishana asks them to sit and think before using force. Rama is alert, determined, and already supported by an alliance whose reach surprised Lanka once. Violence is not a substitute for knowing the opponent or correcting the act that created the conflict.",
          hi: "जब सभा गदा, भाला, तलवार और बाण लेकर उठती है, विभीषण सबको बैठकर बल प्रयोग से पहले सोचने को कहते हैं। राम सतर्क और दृढ़ हैं तथा ऐसी मित्र-सेना के साथ हैं जिसकी पहुँच लंका को एक बार चकित कर चुकी है। हिंसा विरोधी को समझने या संघर्ष पैदा करने वाले कर्म को सुधारने का विकल्प नहीं है।",
        }, "Freeze the chamber at the instant weapons rise, then let Vibhishana reopen a narrow deliberation space between the armed ranks and Ravana.", ["vibhishana", "ravana", "prahasta", "indrajit", "lanka-councillors"]),
        beat("the-abduction-is-named-as-cause", { en: "The danger began with Sita's abduction", hi: "संकट का आरंभ सीता के हरण से हुआ" }, {
          en: "Vibhishana asks what wrong Rama had done before Sita was taken. He separates Khara's earlier conflict from the secret seizure of a person who was not part of that fight. Returning Sita is therefore not surrender to an unprovoked attacker; it is the direct way to remove the grievance Ravana created.",
          hi: "विभीषण पूछते हैं कि सीता के हरण से पहले राम ने रावण का क्या बिगाड़ा था। वे खर के पुराने संघर्ष को उस व्यक्ति के गुप्त अपहरण से अलग करते हैं जो उस युद्ध का हिस्सा नहीं थीं। इसलिए सीता को लौटाना किसी बिना कारण आए आक्रमणकारी के सामने समर्पण नहीं, रावण द्वारा पैदा किए विवाद को हटाने का सीधा उपाय है।",
        }, "Link the conflict backward from the approaching army to the abduction, clearly separating Khara's battle from Sita's non-consensual removal.", ["vibhishana", "ravana", "sita", "rama", "khara"]),
        beat("return-before-the-city-pays", { en: "Vibhishana includes Lanka's people in the decision", hi: "विभीषण निर्णय में लंका के लोगों को शामिल करते हैं" }, {
          en: "He warns that walls, elephants, horses, fighters, families, and the city itself will bear the result if Ravana refuses. His argument is not only that Rama is powerful. A ruler's private insistence is exposing many others to a war they did not choose, so the council must measure their lives against the king's desire.",
          hi: "वे चेताते हैं कि रावण के इनकार की कीमत दीवारें, हाथी, घोड़े, योद्धा, परिवार और पूरा नगर चुकाएँगे। उनका तर्क केवल राम की शक्ति नहीं है। राजा की निजी जिद अनेक लोगों को ऐसे युद्ध में डाल रही है जिसे उन्होंने नहीं चुना, इसलिए सभा को उनके जीवन और राजा की इच्छा का तुलनात्मक मूल्यांकन करना चाहिए।",
        }, "Spread the consequence map from Ravana's seat through soldiers, households, animals, roads, and fortifications, showing who carries a ruler's refusal.", ["vibhishana", "ravana", "lanka-councillors", "lanka-defenders", "sita"]),
        beat("omens-register-as-a-citys-distress", { en: "The city is described through signs of disorder", hi: "नगर की व्याकुलता अनेक संकेतों में दिखाई देती है" }, {
          en: "In private, Vibhishana reports smoky fires, spoiled stores, distressed animals, harsh bird calls, and fearful sounds around the palace. These are his culture's interpretation of warning signs, not a universal forecasting system. Within the scene, they also convey a city whose routines and confidence have broken since Sita was brought there.",
          hi: "निजी वार्ता में विभीषण धुएँ वाली अग्नि, दूषित भंडार, व्याकुल पशु, कठोर पक्षी-स्वर और महल के आसपास भयावह ध्वनियाँ बताते हैं। ये उनकी संस्कृति में चेतावनी की व्याख्या हैं, कोई सार्वभौमिक भविष्यवाणी-पद्धति नहीं। यहाँ वे ऐसे नगर को भी दिखाते हैं जिसकी दिनचर्या और विश्वास सीता के आने से टूटे हैं।",
        }, "Present the omens as Vibhishana's interpreted warning layer over concrete disorder in kitchens, stables, roofs, streets, and ritual spaces.", ["vibhishana", "ravana", "lanka", "sita"]),
        beat("ravana-dismisses-correction", { en: "Ravana hears truth as fear", hi: "रावण सत्य को भय समझकर टाल देता है" }, {
          en: "Vibhishana repeats the same remedy calmly in the chamber and before counsellors: return Sita before the alliance arrives. Ravana answers that he fears no one and that Rama cannot stand against him. The refusal does not disprove the warning; it shows that the king now treats confidence as evidence and concern for Lanka as cowardice.",
          hi: "विभीषण कक्ष और सभा दोनों में शांत स्वर से वही उपाय दोहराते हैं—मित्र-सेना के पहुँचने से पहले सीता को लौटा दो। रावण कहता है कि उसे किसी का भय नहीं और राम उसके सामने टिक नहीं सकते। यह उत्तर चेतावनी को गलत नहीं करता; यह दिखाता है कि राजा आत्मविश्वास को प्रमाण और लंका की चिंता को कायरता मानने लगा है।",
        }, "Close the correction route at Ravana's seat while the coastward army signal continues growing beyond the chamber, unaffected by his denial.", ["ravana", "vibhishana", "rama", "sita", "lanka-councillors"]),
      ],
    },
  },
  {
    id: "kumbhakarna-rebukes-then-joins",
    nodeIds: ["ravana", "kumbhakarna", "vibhishana", "prahasta", "sita", "rama", "lakshmana", "lanka-councillors", "lanka-avenues", "great-hall", "ashoka-grove", "ocean-shore", "war-pledge"],
    moment: {
      id: "kumbhakarna-rebukes-then-joins",
      decisiveChange: { en: "Kumbhakarna identifies Ravana's injustice and failed process, then sacrifices that judgment to family loyalty and promised violence.", hi: "कुंभकर्ण रावण के अन्याय और विफल निर्णय-प्रक्रिया को पहचानते हैं, फिर उस समझ को पारिवारिक निष्ठा और हिंसा की प्रतिज्ञा के आगे छोड़ देते हैं।" },
      beats: [
        beat("splendour-stages-another-council", { en: "Ravana surrounds danger with ceremony", hi: "रावण संकट को भव्य समारोह से घेर देता है" }, {
          en: "Cars, elephants, horses, weapons, perfumes, jewels, ordered seats, and formal silence fill the great hall. The display makes authority look intact even after Hanuman's breach. A magnificent room can organise rank and attention, but it cannot repair a decision or make frightened advisers speak honestly.",
          hi: "रथ, हाथी, घोड़े, अस्त्र, सुगंध, रत्न, क्रमबद्ध आसन और औपचारिक मौन विशाल सभा भर देते हैं। हनुमान के प्रवेश के बाद भी प्रदर्शन सत्ता को अटूट दिखाता है। भव्य कक्ष पद और ध्यान व्यवस्थित कर सकता है, पर निर्णय सुधार नहीं सकता और न भयभीत सलाहकारों से ईमानदार वाणी निकलवा सकता है।",
        }, "Travel through ceremonial Lanka into the hall while faint damage and distant alarms remain visible beneath the polished display of control.", ["ravana", "vibhishana", "prahasta", "lanka-councillors"]),
        beat("ravana-reveals-the-hidden-crisis", { en: "Kumbhakarna finally hears what Ravana did", hi: "कुंभकर्ण को अंततः रावण का किया कर्म बताया जाता है" }, {
          en: "Ravana explains that Sita was taken from the forest, refuses him, and awaits Rama. He describes her body as an object of desire and asks the court to preserve his control over her while killing those coming to rescue her. The framing exposes the problem the earlier boasts avoided: Sita has never consented.",
          hi: "रावण बताता है कि सीता को वन से लाया गया, वे उसे अस्वीकार करती हैं और राम की प्रतीक्षा में हैं। वह उनके शरीर को अपनी इच्छा की वस्तु बनाकर सभा से उन पर नियंत्रण बनाए रखने और उद्धार के लिए आने वालों को मारने की योजना माँगता है। इससे वह सत्य खुलता है जिसे पहले की डींग टाल रही थी—सीता ने कभी सहमति नहीं दी।",
        }, "Keep Sita spatially absent from the hall yet visibly sovereign in the Ashoka grove, while Ravana's possessive framing is marked as his claim, never hers.", ["ravana", "sita", "kumbhakarna", "rama", "lanka-councillors"]),
        beat("kumbhakarna-reverses-the-order", { en: "Kumbhakarna says counsel came too late", hi: "कुंभकर्ण कहते हैं कि सलाह बहुत देर से माँगी गई" }, {
          en: "Kumbhakarna condemns the abduction as an act begun without consultation, justice, or attention to consequence. Ravana performed the dangerous step first and asks for deliberation only after the result reaches his shore. The rebuke identifies the exact failure that Ravana himself had described when defining bad counsel.",
          hi: "कुंभकर्ण हरण को ऐसा कर्म कहते हैं जो सलाह, न्याय और परिणाम की चिंता के बिना शुरू हुआ। रावण ने पहले खतरनाक कदम उठाया और परिणाम तट तक पहुँचने पर विचार माँगा। यह धिक्कार उसी विफलता को पहचानता है जिसे रावण स्वयं खराब सलाह की परिभाषा में बता चुका था।",
        }, "Fold Ravana's earlier definition of impulsive action back over the abduction timeline, making Kumbhakarna's procedural charge unavoidable.", ["kumbhakarna", "ravana", "sita", "lanka-councillors"]),
        beat("loyalty-erases-the-correction", { en: "The rebuke ends in a promise to continue the harm", hi: "धिक्कार अंततः उसी हानि को जारी रखने की प्रतिज्ञा बन जाता है" }, {
          en: "After naming the wrong, Kumbhakarna promises to kill Rama and Lakshmana so Ravana may keep Sita. Family loyalty turns from support for a person into protection of his unjust possession. The scene does not let accurate criticism excuse the later pledge; insight without corrective action becomes another resource for escalation.",
          hi: "गलत कर्म पहचानने के बाद कुंभकर्ण राम और लक्ष्मण को मारने की प्रतिज्ञा करते हैं ताकि रावण सीता को रख सके। पारिवारिक निष्ठा व्यक्ति के सहारे से उसके अन्यायपूर्ण अधिकार की रक्षा बन जाती है। सही आलोचना बाद की प्रतिज्ञा को निर्दोष नहीं करती; सुधारक कदम के बिना समझ हिंसा बढ़ाने का एक और साधन बन जाती है।",
        }, "Show the open correction path collapsing into Kumbhakarna's war route, with Sita's return option still visible but deliberately abandoned.", ["kumbhakarna", "ravana", "rama", "lakshmana", "sita"]),
      ],
    },
  },
  {
    id: "coercion-and-denial-fill-the-court",
    nodeIds: ["mahaparshva", "ravana", "sita", "vibhishana", "prahasta", "indrajit", "kumbhakarna", "lanka-councillors", "great-hall", "ashoka-grove", "lanka", "return-sita", "court-hostility"],
    moment: {
      id: "coercion-and-denial-fill-the-court",
      decisiveChange: { en: "The court openly reveals coercion, minimises danger, and turns its hostility toward the one adviser still asking Ravana to release Sita.", hi: "सभा खुले रूप में दबाव प्रकट करती, खतरा घटाकर दिखाती और अपनी शत्रुता उस सलाहकार की ओर मोड़ती है जो अब भी सीता की मुक्ति माँग रहा है।" },
      beats: [
        beat("mahaparshva-urges-sexual-violence", { en: "A courtier urges Ravana to ignore Sita's refusal", hi: "एक दरबारी रावण को सीता का इनकार अनदेखा करने को कहता है" }, {
          en: "Mahaparshva advises Ravana to force himself on Sita and trust military power to answer whatever follows. The proposal is sexual violence, not romance, boldness, or a private pleasure. Naming it clearly prevents the chamber's metaphors and boasts from hiding whose bodily choice is being denied.",
          hi: "महापार्श्व रावण को सीता पर बल प्रयोग करने और उसके बाद की हर प्रतिक्रिया का उत्तर सैन्य शक्ति से देने को कहता है। यह यौन हिंसा का प्रस्ताव है, प्रेम, साहस या निजी आनंद का नहीं। इसे स्पष्ट नाम देने से सभा के रूपक और डींग उस व्यक्ति की शारीरिक इच्छा को नहीं छिपा सकते जिसे नकारा जा रहा है।",
        }, "Cut away from the courtier's coercive proposal to Sita's firm boundary in the grove, with no sensational reenactment and no ambiguity about consent.", ["mahaparshva", "ravana", "sita", "lanka-councillors"]),
        beat("fear-of-a-curse-is-not-respect", { en: "Ravana explains restraint without respecting Sita", hi: "रावण सीता का सम्मान किए बिना अपने रुकने का कारण बताता है" }, {
          en: "Ravana recounts earlier violence and a curse that threatens him if he again forces a woman. He avoids assault because he fears destruction, not because he accepts Sita's autonomy. The distinction matters: external restraint may prevent one act while the captive person remains threatened, isolated, and treated as a possession.",
          hi: "रावण अपनी पुरानी हिंसा और उस शाप का उल्लेख करता है जो किसी स्त्री पर फिर बल करने पर उसके विनाश की धमकी देता है। वह सीता की स्वायत्तता मानकर नहीं, अपने नाश से डरकर रुकता है। बाहरी रोक एक कर्म रोक सकती है, फिर भी बंदी व्यक्ति धमकी, एकांत और अधिकार की वस्तु बने रहने से मुक्त नहीं होता।",
        }, "Place the curse as a barrier around Ravana rather than protection owned by Sita, while her captivity and ongoing threats remain fully visible.", ["ravana", "sita", "mahaparshva"]),
        beat("vibhishana-returns-to-the-remedy", { en: "Vibhishana refuses the chamber's distraction", hi: "विभीषण सभा की भटकाव-रणनीति स्वीकार नहीं करते" }, {
          en: "Vibhishana again says that no boast by Kumbhakarna, Indrajit, Prahasta, or the court changes the central remedy. Return Sita before arrows and armies reach Lanka. His language is severe, but it keeps the council attached to cause, consequence, and an action still available to Ravana.",
          hi: "विभीषण फिर कहते हैं कि कुंभकर्ण, इंद्रजीत, प्रहस्त या सभा की कोई डींग मूल उपाय नहीं बदलती। बाण और सेना लंका पहुँचने से पहले सीता को लौटा दो। उनकी भाषा कठोर है, पर वह सभा को कारण, परिणाम और रावण के पास अब भी उपलब्ध कदम से जोड़े रखती है।",
        }, "Keep the return route stable through the chamber while every boast spins away into increasingly costly battle branches around it.", ["vibhishana", "ravana", "sita", "kumbhakarna", "indrajit", "prahasta"]),
        beat("inherited-pride-replaces-measure", { en: "Prahasta and Indrajit answer with invulnerability", hi: "प्रहस्त और इंद्रजीत अजेयता के दावे से उत्तर देते हैं" }, {
          en: "Prahasta says Lanka has never feared powerful beings, and Indrajit lists victories over celestial opponents before dismissing two human princes. Their confidence depends on inherited reputation and selected precedent, not on the current breach, the approaching host, or the possibility that a new opponent requires new judgment.",
          hi: "प्रहस्त कहता है कि लंका ने कभी शक्तिशाली जीवों से भय नहीं माना, और इंद्रजीत दो मानव राजकुमारों को तुच्छ बताने से पहले देव-विजयों की सूची देता है। उनका विश्वास वंशगत प्रतिष्ठा और चुने हुए अतीत पर टिका है, वर्तमान प्रवेश, निकट आती सेना या नए विरोधी के लिए नए विवेक की आवश्यकता पर नहीं।",
        }, "Contrast inherited victory emblems with live coastal movement and Hanuman's breach, showing exactly which present evidence the pride display excludes.", ["prahasta", "indrajit", "vibhishana", "rama", "lakshmana"]),
        beat("the-adviser-becomes-the-target", { en: "The court attacks the warning instead of the danger", hi: "सभा संकट के बजाय चेतावनी देने वाले पर हमला करती है" }, {
          en: "Indrajit calls his uncle weak and afraid; Vibhishana answers by calling his judgment immature and destructive. Their exchange becomes personal and harsh, yet the asymmetry remains: one side is defending Ravana's continued captivity of Sita, while the other still asks for her return and Lanka's survival.",
          hi: "इंद्रजीत अपने चाचा को कमजोर और भयभीत कहता है; विभीषण उसके निर्णय को अपरिपक्व और विनाशकारी बताते हैं। वार्ता निजी और कठोर हो जाती है, फिर भी अंतर स्पष्ट है—एक पक्ष रावण द्वारा सीता को बंदी रखने की रक्षा कर रहा है, दूसरा अब भी उनकी वापसी और लंका के बचाव की माँग कर रहा है।",
        }, "Tighten the chamber around Vibhishana as personal attacks replace policy, while the abandoned return path remains the only route that removes the original harm.", ["indrajit", "vibhishana", "ravana", "sita", "lanka-councillors"]),
      ],
    },
  },
  {
    id: "vibhishana-leaves-lanka",
    nodeIds: ["vibhishana", "ravana", "vibhishana-companions", "lanka-councillors", "sita", "rama", "great-hall", "lanka", "lanka-sky", "northern-shore", "family-rupture", "refuge-route"],
    moment: {
      id: "vibhishana-leaves-lanka",
      decisiveChange: { en: "Ravana makes honest dissent incompatible with remaining at court, and Vibhishana leaves home with four companions to seek another allegiance.", hi: "रावण ईमानदार असहमति को सभा में बने रहने के अयोग्य बना देता है, और विभीषण चार साथियों के साथ नया आश्रय खोजने घर छोड़ते हैं।" },
      beats: [
        beat("ravana-turns-warning-into-envy", { en: "Ravana recasts concern as family jealousy", hi: "रावण चिंता को पारिवारिक ईर्ष्या बना देता है" }, {
          en: "Ravana claims relatives secretly enjoy one another's failure and implies that Vibhishana resents his power. This explanation protects the king from examining the warning: if criticism is always jealousy, no family member can offer corrective truth. Suspicion becomes a shield around the decision that endangered everyone.",
          hi: "रावण कहता है कि रिश्तेदार भीतर ही भीतर एक-दूसरे की असफलता से प्रसन्न होते हैं और विभीषण उसकी शक्ति से ईर्ष्या करते हैं। यह व्याख्या राजा को चेतावनी जाँचने से बचाती है—यदि आलोचना हमेशा ईर्ष्या है तो कोई परिजन सुधारक सत्य नहीं कह सकता। संदेह सबको संकट में डालने वाले निर्णय का कवच बन जाता है।",
        }, "Show every family bond in the hall being relabelled as a threat until Ravana stands inside a self-made ring with no trusted correction route.", ["ravana", "vibhishana", "lanka-councillors"]),
        beat("demeaning-generalizations-serve-the-attack", { en: "Ravana widens the insult beyond Vibhishana", hi: "रावण अपमान को विभीषण से आगे फैलाता है" }, {
          en: "His speech includes degrading claims about relatives, women, social groups, and supposedly unworthy friends. These claims belong to Ravana's angry attempt to discredit dissent; they are not reliable descriptions of whole communities. The prejudice shows how power can recruit broad contempt when a specific argument cannot be answered.",
          hi: "उसके भाषण में रिश्तेदारों, स्त्रियों, सामाजिक समूहों और कथित अयोग्य मित्रों के बारे में अपमानजनक दावे आते हैं। ये रावण के क्रोध में असहमति को बदनाम करने के साधन हैं, पूरे समुदायों का विश्वसनीय वर्णन नहीं। जब किसी विशिष्ट तर्क का उत्तर नहीं मिलता, सत्ता व्यापक तिरस्कार को हथियार बना सकती है।",
        }, "Render the generalisations as dark labels thrown outward from Ravana and breaking against real, varied people rather than becoming descriptive world rules.", ["ravana", "vibhishana", "lanka-councillors"]),
        beat("vibhishana-gives-the-last-warning", { en: "Vibhishana refuses sweet agreement", hi: "विभीषण मीठी सहमति से इनकार करते हैं" }, {
          en: "Vibhishana says pleasant words are easy to find, while unwelcome words spoken for another's welfare are rare to give and rare to hear. He still addresses Ravana as an elder deserving respect, but respect no longer requires silence or continued participation in the king's course.",
          hi: "विभीषण कहते हैं कि सुखद शब्द आसानी से मिलते हैं, जबकि किसी के हित में अप्रिय सत्य कहना और सुनना दोनों दुर्लभ हैं। वे रावण को अब भी सम्मान योग्य बड़ा भाई मानते हैं, पर सम्मान का अर्थ मौन रहना या राजा के मार्ग में भाग लेते रहना नहीं है।",
        }, "Keep a final respectful bond between the brothers even as Vibhishana steps outside the court's demanded obedience, avoiding a simple good-family versus bad-family split.", ["vibhishana", "ravana", "vibhishana-companions"]),
        beat("the-departure-has-a-cost", { en: "Leaving saves integrity but breaks a home", hi: "प्रस्थान विवेक बचाता है, पर घर तोड़ता है" }, {
          en: "Vibhishana rises into the sky with four armed companions and says he is going because his counsel cannot be heard. He leaves position, wealth, household ties, and children behind. The movement toward Rama is not a weightless faction switch; it is a rupture whose moral necessity does not remove personal loss.",
          hi: "विभीषण चार सशस्त्र साथियों के साथ आकाश में उठते और कहते हैं कि उनकी सलाह सुनी नहीं जा सकती, इसलिए वे जा रहे हैं। वे पद, संपत्ति, घर के संबंध और बच्चों को पीछे छोड़ते हैं। राम की ओर जाना हल्का-फुल्का पक्ष परिवर्तन नहीं, ऐसा टूटना है जिसकी नैतिक आवश्यकता निजी हानि को मिटाती नहीं।",
        }, "Follow five figures leaving Lanka while household lights and family ties remain behind, then reveal the uncertain allied camp across the sea ahead.", ["vibhishana", "vibhishana-companions", "ravana", "rama", "lanka"]),
      ],
    },
  },
  {
    id: "refuge-arrives-under-suspicion",
    nodeIds: ["vibhishana", "vibhishana-companions", "sugriva", "rama", "lakshmana", "hanuman", "angada", "jambavan", "mainda", "sarava", "allied-camp", "northern-shore", "lanka", "refuge-debate", "counterintelligence"],
    moment: {
      id: "refuge-arrives-under-suspicion",
      decisiveChange: { en: "An apparent enemy arrival becomes a disciplined debate about security, testimony, bias, and the cost of distrusting a sincere defector.", hi: "दिखाई देने वाला शत्रु-आगमन सुरक्षा, गवाही, पूर्वाग्रह और ईमानदार पक्षत्यागी पर अविश्वास की कीमत पर अनुशासित बहस बन जाता है।" },
      beats: [
        beat("five-armed-figures-appear", { en: "The camp first sees a threat silhouette", hi: "शिविर को पहले खतरे की आकृति दिखाई देती है" }, {
          en: "Vibhishana and four companions arrive from Lanka wearing armour and carrying maces. From the ground, identity and intention are not immediately visible. Sugriva's alarm is therefore not irrational: a shape-changing enemy has reason to infiltrate command, divide allies, or attack when attention relaxes.",
          hi: "विभीषण और चार साथी लंका से कवच पहनकर तथा गदा लेकर आते हैं। धरती से उनकी पहचान और उद्देश्य तुरंत स्पष्ट नहीं। इसलिए सुग्रीव की चेतावनी निराधार नहीं—रूप बदलने वाला शत्रु नेतृत्व में घुसने, मित्रों में फूट डालने या असावधानी में हमला करने का कारण रखता है।",
        }, "Present the arrivals first as distant armed silhouettes, then gradually reveal faces and posture as speech and observation add information.", ["vibhishana", "vibhishana-companions", "sugriva", "vanara-army"]),
        beat("vibhishana-states-his-case-openly", { en: "Vibhishana names his relation, disagreement, and request", hi: "विभीषण अपना संबंध, मतभेद और माँग स्पष्ट बताते हैं" }, {
          en: "He does not hide that Ravana is his brother. He recounts Sita's captivity, his repeated demand that she be returned, Ravana's rejection, and his own departure. He asks Rama for shelter through the very guards who suspect him, placing his account where allies can challenge it rather than seeking secret access.",
          hi: "वे यह नहीं छिपाते कि रावण उनके भाई हैं। वे सीता की बंदी अवस्था, उन्हें लौटाने की बार-बार की माँग, रावण का इनकार और अपना प्रस्थान बताते हैं। वे उन्हीं रक्षकों के माध्यम से राम की शरण माँगते हैं जो उन पर संदेह करते हैं, अर्थात गुप्त प्रवेश नहीं बल्कि जाँच योग्य खुला निवेदन चुनते हैं।",
        }, "Convert each claim into an openly inspectable path—kinship, warning, rejection, departure, and shelter request—without marking any claim verified too early.", ["vibhishana", "sugriva", "rama", "sita", "ravana"]),
        beat("sugriva-models-the-worst-case", { en: "Sugriva protects the camp by imagining betrayal", hi: "सुग्रीव विश्वासघात की संभावना से शिविर बचाना चाहते हैं" }, {
          en: "Sugriva warns that a hidden agent could learn counsel, map formations, sow division, or kill leaders once trusted. He also worries that someone who left a brother in crisis may leave new allies later. The argument combines genuine counterintelligence with a moral inference that still requires examination.",
          hi: "सुग्रीव चेताते हैं कि छिपा दूत सलाह जान सकता, सैन्य रचना देख सकता, फूट डाल सकता या विश्वास मिलने पर नेताओं को मार सकता है। उन्हें यह भी चिंता है कि संकट में भाई छोड़ने वाला नए साथियों को भी छोड़ सकता है। तर्क वास्तविक सुरक्षा-जोखिम और ऐसे नैतिक अनुमान को जोड़ता है जिसकी अभी जाँच आवश्यक है।",
        }, "Branch Sugriva's warning into counsel theft, formation mapping, division, assassination, and later desertion, clearly separating observed risk from inferred character.", ["sugriva", "vibhishana", "rama", "lakshmana", "vanara-army"]),
        beat("the-council-proposes-different-tests", { en: "Allies disagree about how trust can be learned", hi: "साथी असहमत हैं कि विश्वास कैसे परखा जाए" }, {
          en: "Angada proposes evaluating virtues and risks, Sarava recommends spies, Jambavan distrusts the timing, and Mainda favours direct, courteous questioning. None has complete information. Their disagreement makes uncertainty explicit and prevents the first frightened reaction from silently becoming the final verdict.",
          hi: "अंगद गुण और जोखिम परखने का प्रस्ताव देते हैं, शरव गुप्तचर भेजने को कहते हैं, जाम्बवान समय पर संदेह करते हैं और मैन्द विनम्र प्रत्यक्ष प्रश्न पसंद करते हैं। किसी के पास पूरी जानकारी नहीं। मतभेद अनिश्चितता को खुला रखते हैं और पहली भयभीत प्रतिक्रिया को चुपचाप अंतिम निर्णय नहीं बनने देते।",
        }, "Arrange the proposed tests as competing paths with benefits, delays, and harms visible, keeping uncertainty active instead of forcing premature certainty.", ["angada", "sarava", "jambavan", "mainda", "rama", "vibhishana"]),
        beat("hanuman-examines-the-examination", { en: "Hanuman asks whether suspicion can distort the answer", hi: "हनुमान पूछते हैं कि क्या संदेह उत्तर को विकृत कर सकता है" }, {
          en: "Hanuman argues that sudden interrogation or hidden surveillance may make a sincere newcomer guarded and produce the very signs of fear the camp expects. He observes Vibhishana's open manner, coherent reason for leaving, and choice of Rama over Ravana. These are indicators, not magical proof, but they deserve weight beside worst-case imagination.",
          hi: "हनुमान कहते हैं कि अचानक पूछताछ या छिपी निगरानी ईमानदार आगंतुक को रक्षात्मक बना सकती है और वही भय पैदा कर सकती है जिसकी शिविर को आशंका है। वे विभीषण की खुली मुद्रा, जाने का संगत कारण और रावण के स्थान पर राम को चुनना देखते हैं। ये जादुई प्रमाण नहीं, पर सबसे बुरी संभावना के साथ वजन रखने वाले संकेत हैं।",
        }, "Show how each proposed test changes the newcomer being observed, then layer Hanuman's behavioural indicators beside—not above—the unresolved security risks.", ["hanuman", "vibhishana", "sugriva", "rama", "angada", "jambavan"]),
      ],
    },
  },
  {
    id: "rama-makes-shelter-a-promise",
    nodeIds: ["rama", "sugriva", "lakshmana", "vibhishana", "hanuman", "ravana", "kumbhakarna", "indrajit", "prahasta", "vanara-army", "allied-camp", "northern-shore", "lanka", "ocean", "refuge-promise", "future-lanka"],
    moment: {
      id: "rama-makes-shelter-a-promise",
      decisiveChange: { en: "Rama converts refuge from a case-by-case favour into a public commitment, then gives Vibhishana a consequential place inside the alliance.", hi: "राम शरण को परिस्थिति पर निर्भर कृपा से सार्वजनिक प्रतिज्ञा बनाते हैं और फिर विभीषण को मित्र-सेना के भीतर परिणामकारी स्थान देते हैं।" },
      beats: [
        beat("sugriva-presses-the-brother-objection", { en: "Sugriva asks what abandonment predicts", hi: "सुग्रीव पूछते हैं कि भाई को छोड़ना भविष्य के बारे में क्या बताता है" }, {
          en: "Sugriva does not drop his concern after Hanuman speaks. If Vibhishana left Ravana during danger, he asks, why would he remain loyal when Rama's side suffers? The question forces the council to distinguish deserting a person for convenience from refusing continued participation in that person's harmful decision.",
          hi: "हनुमान की बात के बाद भी सुग्रीव अपनी चिंता नहीं छोड़ते। यदि विभीषण संकट में रावण को छोड़ आए तो राम का पक्ष कठिनाई में पड़ने पर वे क्यों टिकेंगे? यह प्रश्न सुविधा के लिए व्यक्ति छोड़ने और उसके हानिकारक निर्णय में भाग लेने से इनकार करने के बीच अंतर माँगता है।",
        }, "Place Sugriva's loyalty test against the earlier council rupture, inviting comparison between opportunistic escape and principled refusal without deciding it visually.", ["sugriva", "vibhishana", "ravana", "rama"]),
        beat("rama-separates-kinship-from-conduct", { en: "A family rupture does not answer every question", hi: "पारिवारिक टूटन हर प्रश्न का उत्तर नहीं देती" }, {
          en: "Rama reflects that rulers and close relatives may fear one another when power, succession, and survival are at stake. He also recalls that not every brother behaves like Bharata and not every alliance is the same. Kinship is relevant context, but it cannot replace attention to reasons, conduct, and present choice.",
          hi: "राम विचार करते हैं कि सत्ता, उत्तराधिकार और जीवन के प्रश्न पर राजा तथा निकट संबंधी एक-दूसरे से डर सकते हैं। वे यह भी याद करते हैं कि हर भाई भरत जैसा नहीं और हर मित्रता समान नहीं। रिश्तेदारी उपयोगी संदर्भ है, पर वह कारण, आचरण और वर्तमान चुनाव पर ध्यान का स्थान नहीं ले सकती।",
        }, "Map several possible family dynamics around the same kinship line, preventing the interface from turning blood relation into an automatic trust or guilt rule.", ["rama", "sugriva", "vibhishana", "bharata", "ravana"]),
        beat("shelter-becomes-a-public-rule", { en: "Rama promises safety to one who asks for it", hi: "राम शरण माँगने वाले को सुरक्षा की प्रतिज्ञा देते हैं" }, {
          en: "Rama declares that someone who sincerely approaches, identifies himself, and asks for protection will not be killed at the gate. Even risk does not erase the obligation to receive and assess him safely. The promise limits Rama's own power before it benefits Vibhishana, making refuge a rule rather than a reward for proven usefulness.",
          hi: "राम घोषित करते हैं कि जो ईमानदारी से आए, अपनी पहचान बताए और सुरक्षा माँगे, उसे द्वार पर नहीं मारा जाएगा। जोखिम भी उसे सुरक्षित रूप से स्वीकारकर परखने की जिम्मेदारी नहीं मिटाता। यह प्रतिज्ञा विभीषण को लाभ देने से पहले राम की अपनी शक्ति को सीमित करती है, इसलिए शरण उपयोगिता का पुरस्कार नहीं बल्कि नियम बनती है।",
        }, "Illuminate a protected arrival corridor from the sky to Rama's camp, visibly preventing weapons from closing before conversation and assessment can occur.", ["rama", "vibhishana", "sugriva", "hanuman", "vanara-army"]),
        beat("vibhishana-enters-and-shares-risk", { en: "The newcomer gives information that can be tested", hi: "नवागंतुक ऐसी जानकारी देता है जिसकी जाँच हो सकती है" }, {
          en: "Vibhishana bows, places his future in Rama's hands, and describes Ravana's protections, Kumbhakarna's scale, Indrajit's invisibility in battle, Prahasta's command, and the size of Lanka's forces. The account does not make him infallible, but it creates specific claims the alliance can compare with Hanuman's observations.",
          hi: "विभीषण प्रणाम कर अपना भविष्य राम के हाथ रखते हैं और रावण की सुरक्षा, कुंभकर्ण की विशालता, युद्ध में इंद्रजीत की अदृश्यता, प्रहस्त का नेतृत्व तथा लंका की सेना का आकार बताते हैं। यह विवरण उन्हें अचूक नहीं बनाता, पर ऐसे विशिष्ट दावे देता है जिन्हें मित्र-सेना हनुमान की जानकारी से मिला सकती है।",
        }, "Join Vibhishana's internal military map to Hanuman's external city map, highlighting agreements, new claims, and items that still need confirmation.", ["vibhishana", "rama", "ravana", "kumbhakarna", "indrajit", "prahasta", "hanuman"]),
        beat("a-future-crown-is-declared", { en: "Rama promises a Lanka beyond Ravana", hi: "राम रावण के बाद की लंका की प्रतिज्ञा करते हैं" }, {
          en: "Rama vows to defeat Ravana and names Vibhishana as a future ruler; Lakshmana performs a provisional consecration with ocean water. The gesture gives the defector standing, but it also binds refuge to succession and war. The allies celebrate while the future consent and reconstruction of Lanka remain unresolved.",
          hi: "राम रावण को हराने की प्रतिज्ञा कर विभीषण को भविष्य का राजा घोषित करते हैं; लक्ष्मण समुद्र के जल से प्रारंभिक अभिषेक करते हैं। इससे पक्षत्यागी को स्थान मिलता है, पर शरण उत्तराधिकार और युद्ध से भी जुड़ जाती है। मित्र प्रसन्न होते हैं, जबकि लंका की भविष्य की सहमति और पुनर्निर्माण अभी अनसुलझे हैं।",
        }, "Stage the ocean-water consecration as a consequential wartime promise, with a question mark over Lanka's people and postwar rebuilding rather than a completed coronation.", ["rama", "lakshmana", "vibhishana", "vanara-army", "lanka"]),
        beat("vibhishana-proposes-asking-the-ocean", { en: "The first contribution is restraint", hi: "विभीषण का पहला योगदान संयम का उपाय है" }, {
          en: "Asked how the host can cross, Vibhishana advises Rama to approach the ocean and request passage before using force. Sugriva and Lakshmana support the proposal because a built road still needs the water to bear it. The new ally's first operational counsel opens negotiation rather than immediate attack.",
          hi: "सेना के पार जाने का उपाय पूछने पर विभीषण राम को बल प्रयोग से पहले समुद्र से मार्ग माँगने की सलाह देते हैं। सुग्रीव और लक्ष्मण इसका समर्थन करते हैं, क्योंकि निर्मित मार्ग को भी जल का सहारा चाहिए। नए साथी की पहली कार्यकारी सलाह तत्काल आक्रमण नहीं, संवाद खोलती है।",
        }, "Connect Vibhishana's counsel to a peaceful ocean approach, bridge design, load bearing, and the still-available option to avoid harming marine life.", ["vibhishana", "rama", "sugriva", "lakshmana", "ocean"]),
      ],
    },
  },
  {
    id: "an-envoy-crosses-the-battle-line",
    nodeIds: ["sardula", "ravana", "suka", "sugriva", "rama", "angada", "vanara-army", "jatayu", "sita", "lanka", "sky-route", "northern-shore", "allied-camp", "envoy-protection", "spy-question"],
    moment: {
      id: "an-envoy-crosses-the-battle-line",
      decisiveChange: { en: "A divisive message tests whether the alliance can protect an enemy envoy even while taking espionage risk seriously.", hi: "फूट डालने वाला संदेश परखता है कि मित्र-सेना गुप्तचरी के जोखिम को गंभीर मानते हुए भी शत्रु-दूत की रक्षा कर सकती है या नहीं।" },
      beats: [
        beat("sardula-reports-the-host", { en: "Lanka receives a truthful scale report", hi: "लंका को सेना के आकार की सच्ची सूचना मिलती है" }, {
          en: "Sardula observes the allied host spread along the shore and tells Ravana that Rama and Lakshmana have arrived to recover Sita. He recommends choosing among return, conciliation, division, and war with the actual scale in view. Once again, Ravana receives information that could support a less destructive decision.",
          hi: "शार्दूल तट पर फैली मित्र-सेना देखकर रावण को बताता है कि राम और लक्ष्मण सीता को वापस लाने पहुँचे हैं। वह वास्तविक आकार देखकर वापसी, समझौता, फूट या युद्ध में से निर्णय लेने की सलाह देता है। रावण को फिर ऐसी जानकारी मिलती है जिससे कम विनाशकारी विकल्प चुना जा सकता है।",
        }, "Carry a measured coastwide reconnaissance view back into Ravana's chamber, keeping troop scale and the return-Sita option visible together.", ["sardula", "ravana", "rama", "lakshmana", "sita", "vanara-army"]),
        beat("ravana-tries-to-isolate-sugriva", { en: "The message asks Sugriva to abandon Rama", hi: "संदेश सुग्रीव से राम को छोड़ने को कहता है" }, {
          en: "Ravana sends Suka to flatter Sugriva's lineage, deny any quarrel with him, minimise Sita's abduction as someone else's concern, and invite him home. The message tries to cut responsibility at the border of personal interest. It asks an ally to treat harm against another person as irrelevant because he was not its direct target.",
          hi: "रावण शुक को भेजकर सुग्रीव के वंश की प्रशंसा, उनसे कोई विवाद न होने का दावा, सीता के हरण को किसी और का मामला बताने और घर लौटने का निमंत्रण देता है। संदेश जिम्मेदारी को निजी हित की सीमा पर काटना चाहता है। वह साथी से कहता है कि किसी अन्य पर हुआ अन्याय उसके लिए अप्रासंगिक है क्योंकि निशाना वह स्वयं नहीं था।",
        }, "Visualize Ravana's message trying to sever the Sugriva-Rama bond and wall Sita's captivity off as a private dispute rather than a shared obligation.", ["ravana", "suka", "sugriva", "rama", "sita"]),
        beat("the-envoy-is-attacked", { en: "Anger turns the messenger into a target", hi: "क्रोध संदेशवाहक को निशाना बना देता है" }, {
          en: "Fighters leap up, drag Suka down, strike him, and threaten his wings and eyes. His message is manipulative and he may be observing the camp, but neither fact makes torture an acceptable answer. The alliance's conduct is tested most sharply when the speaker carries words it despises.",
          hi: "योद्धा उछलकर शुक को नीचे खींचते, मारते और उसके पंख तथा आँखें नष्ट करने की धमकी देते हैं। उसका संदेश छलपूर्ण है और संभव है कि वह शिविर देख भी रहा हो, पर कोई बात यातना को उचित उत्तर नहीं बनाती। मित्र-सेना का आचरण तब सबसे कठोर परखा जाता है जब वक्ता घृणित संदेश लाता है।",
        }, "Show Suka restrained and injured without celebratory hit effects, while the message, suspected observation path, and bodily protection remain separate issues.", ["suka", "vanara-army", "angada", "rama"]),
        beat("rama-protects-the-messenger", { en: "Rama stops the killing more than once", hi: "राम एक से अधिक बार दूत-वध रोकते हैं" }, {
          en: "Suka appeals to the rule against killing an envoy, and Rama orders the fighters to stop. When violence resumes after Angada calls him a spy, Rama intervenes again. Protection does not endorse the message or erase counterintelligence; it sets a boundary on what may be done to the person carrying it.",
          hi: "शुक दूत को न मारने के नियम की दुहाई देता है और राम योद्धाओं को रोकते हैं। अंगद के उसे गुप्तचर कहने पर हिंसा फिर शुरू होती है तो राम दोबारा हस्तक्षेप करते हैं। सुरक्षा संदेश का समर्थन या गुप्तचरी की चिंता समाप्त नहीं करती; वह संदेश लाने वाले व्यक्ति के साथ किए जा सकने वाले व्यवहार की सीमा तय करती है।",
        }, "Place Rama's stop command as a recurring protective boundary around Suka while interrogation, observation limits, and return timing remain available outside it.", ["rama", "suka", "angada", "vanara-army"]),
        beat("sugriva-rejects-the-division", { en: "Sugriva answers as an ally", hi: "सुग्रीव साथी के रूप में उत्तर देते हैं" }, {
          en: "Sugriva refuses Ravana's attempt to separate him from Rama and recalls Sita's seizure and Jatayu's death. His answer also contains broad threats against Ravana's family and city, revealing how loyalty can harden into collective punishment language. Solidarity is necessary; indiscriminate vengeance is not made harmless by it.",
          hi: "सुग्रीव रावण द्वारा उन्हें राम से अलग करने का प्रयास अस्वीकार करते और सीता के हरण तथा जटायु की मृत्यु याद करते हैं। उनके उत्तर में रावण के परिवार और नगर के विरुद्ध व्यापक धमकियाँ भी हैं, जो दिखाती हैं कि निष्ठा सामूहिक दंड की भाषा बन सकती है। एकजुटता आवश्यक है; उससे अंधा प्रतिशोध निरापद नहीं हो जाता।",
        }, "Keep the allied bond intact while Sugriva's retaliatory threat spreads too widely across Lanka, making solidarity and collective punishment visually distinct.", ["sugriva", "rama", "ravana", "sita", "jatayu", "lanka"]),
      ],
    },
  },
  {
    id: "patience-turns-into-threat",
    nodeIds: ["rama", "lakshmana", "ocean", "vanara-army", "ocean-creatures", "sages", "northern-shore", "ocean-surface", "ocean-depths", "allied-camp", "three-night-vigil", "drawn-bow", "intervention"],
    moment: {
      id: "patience-turns-into-threat",
      decisiveChange: { en: "Three nights of appeal collapse into an attack on the sea, and Lakshmana interrupts before Rama's anger becomes complete ecological destruction.", hi: "तीन रात की प्रार्थना समुद्र पर आक्रमण में टूटती है, और राम का क्रोध पूर्ण पारिस्थितिक विनाश बनने से पहले लक्ष्मण हस्तक्षेप करते हैं।" },
      beats: [
        beat("three-nights-of-disciplined-appeal", { en: "Rama waits before using force", hi: "राम बल प्रयोग से पहले प्रतीक्षा करते हैं" }, {
          en: "Rama lies on darbha grass facing east, limits speech, concentrates, and asks the ocean for a way across. Three nights pass without a visible answer. The vigil establishes that force was not the first move, while the growing delay remains urgent because Sita's captivity has a stated time limit.",
          hi: "राम दर्भ पर पूर्वमुखी लेटते, वाणी सीमित रखते, ध्यान करते और समुद्र से मार्ग माँगते हैं। बिना प्रत्यक्ष उत्तर के तीन रात बीतती हैं। यह साधना दिखाती है कि बल पहला कदम नहीं था, पर सीता की बंदी अवस्था की समय-सीमा के कारण बढ़ती देरी फिर भी अत्यंत गंभीर है।",
        }, "Use three complete day-night cycles, changing tides, camp routines, and the distant Lanka signal to make both restraint and costly delay tangible.", ["rama", "lakshmana", "ocean", "sita", "vanara-army"]),
        beat("silence-is-read-as-contempt", { en: "Rama decides that patience looks like weakness", hi: "राम मानते हैं कि धैर्य को कमजोरी समझा गया" }, {
          en: "When the ocean does not appear, Rama concludes that calm speech and forbearance are respected only by the good and mistaken for incapacity by the insolent. This is anger's theory inside the moment, not a rule for every conflict. It narrows many possible explanations for silence into one hostile intention.",
          hi: "समुद्र के प्रकट न होने पर राम निष्कर्ष निकालते हैं कि शांत वाणी और सहनशीलता को अच्छे लोग मानते हैं, पर उद्दंड उन्हें अक्षमता समझते हैं। यह उस क्षण के क्रोध की धारणा है, हर संघर्ष का नियम नहीं। यह मौन के अनेक संभावित कारणों को एक शत्रुतापूर्ण इरादे में सीमित कर देती है।",
        }, "Collapse several possible meanings of the ocean's silence into Rama's single red threat line, visibly marking the narrowing caused by anger.", ["rama", "lakshmana", "ocean"]),
        beat("the-sea-is-made-a-target", { en: "The proposed punishment includes living beings", hi: "प्रस्तावित दंड में जीवित प्राणी भी निशाना बनते हैं" }, {
          en: "Rama calls for his bow and declares that he will dry the sea so the host can walk across. He explicitly imagines fish, serpents, crocodiles, shells, and deep-dwelling beings destroyed with the water. The crossing problem is being transferred onto creatures that neither abducted Sita nor chose the ocean's silence.",
          hi: "राम धनुष माँगकर कहते हैं कि वे समुद्र सुखा देंगे ताकि सेना पैदल पार हो सके। वे जल के साथ मछलियों, सर्पों, मगरों, शंखों और गहराई के जीवों के विनाश की कल्पना करते हैं। समुद्र-पार की समस्या उन जीवों पर डाली जा रही है जिन्होंने न सीता का हरण किया, न समुद्र का मौन चुना।",
        }, "Reveal the inhabited depths beneath the proposed dry path, connecting every convenient footstep above to displaced or killed life below.", ["rama", "ocean", "ocean-creatures", "vanara-army"]),
        beat("arrows-enter-the-living-water", { en: "The threat becomes physical damage", hi: "धमकी वास्तविक नुकसान बन जाती है" }, {
          en: "Rama releases burning shafts into the sea. Waves rise, water darkens, winds roar, and frightened creatures scatter through the depths. The animation holds their distress in view rather than presenting the attack only as a display of divine scale. Power changes the environment before it produces an answer.",
          hi: "राम जलते बाण समुद्र में छोड़ते हैं। लहरें उठती हैं, जल अँधेरा होता है, हवा गर्जती है और भयभीत जीव गहराई में भागते हैं। दृश्य उनके संकट को सामने रखता है, आक्रमण को केवल दिव्य शक्ति का प्रदर्शन नहीं बनाता। उत्तर मिलने से पहले ही शक्ति पर्यावरण बदल देती है।",
        }, "Track arrows below the surface through shock waves, fleeing animals, churned sediment, broken habitats, and the alarm spreading toward the camp.", ["rama", "ocean", "ocean-creatures", "lakshmana"]),
        beat("lakshmana-physically-intervenes", { en: "Lakshmana takes the bow away", hi: "लक्ष्मण धनुष रोक लेते हैं" }, {
          en: "As Rama prepares a greater weapon, Lakshmana rises, says this must not continue, and takes hold of the bow. He insists that a person of Rama's stature need not be governed by rage and that another means may still achieve the crossing. Loyal support here means interrupting dangerous escalation, not merely standing beside it.",
          hi: "जब राम अधिक विनाशकारी अस्त्र तैयार करते हैं, लक्ष्मण उठकर कहते हैं कि यह आगे नहीं बढ़ना चाहिए और धनुष थाम लेते हैं। वे कहते हैं कि राम जैसे व्यक्ति को क्रोध के अधीन होने की आवश्यकता नहीं और समुद्र-पार का दूसरा उपाय अभी भी मिल सकता है। यहाँ निष्ठा का अर्थ खतरनाक बढ़त रोकना है, केवल उसके साथ खड़े रहना नहीं।",
        }, "Make Lakshmana's hand on the bow the active control point that pauses the attack and reopens negotiation, engineering, and retreat paths.", ["lakshmana", "rama", "ocean", "sages", "ocean-creatures"]),
      ],
    },
  },
  {
    id: "nala-builds-the-road-across-water",
    nodeIds: ["rama", "lakshmana", "ocean", "nala", "sugriva", "hanuman", "angada", "vibhishana", "vanara-army", "ocean-creatures", "northern-shore", "marukantara", "nala-causeway", "lanka-shore", "forest-materials", "five-day-build"],
    moment: {
      id: "nala-builds-the-road-across-water",
      decisiveChange: { en: "An armed confrontation with the ocean yields to Nala's disclosed skill and a five-day collective causeway that carries the alliance to Lanka.", hi: "समुद्र से सशस्त्र टकराव नल की प्रकट दक्षता और पाँच दिन के सामूहिक सेतु-निर्माण में बदलता है, जो मित्र-सेना को लंका पहुँचाता है।" },
      beats: [
        beat("the-ocean-explains-its-nature", { en: "The ocean answers as a force with limits", hi: "समुद्र अपनी प्रकृति और सीमाएँ बताता है" }, {
          en: "The ocean appears and says that depth, movement, and the lives within it cannot simply be abandoned from desire, fear, or anger. It offers to hold a constructed passage and restrain dangerous creatures during the crossing. The answer does not erase the earlier harm, but it converts confrontation into load-bearing cooperation.",
          hi: "समुद्र प्रकट होकर कहता है कि गहराई, गति और भीतर का जीवन इच्छा, भय या क्रोध से अचानक छोड़ा नहीं जा सकता। वह निर्मित मार्ग को सहारा देने और पार करते समय खतरनाक जीवों को रोकने का प्रस्ताव देता है। यह उत्तर पहले के नुकसान को मिटाता नहीं, पर टकराव को भार सँभालने वाले सहयोग में बदलता है।",
        }, "Raise the ocean from inhabited depths and connect its physical limits directly to a supported engineering route rather than magical disappearance of water.", ["ocean", "rama", "lakshmana", "ocean-creatures", "vanara-army"]),
        beat("the-armed-force-is-redirected", { en: "A prepared weapon still demands a target", hi: "तैयार अस्त्र अब भी लक्ष्य माँगता है" }, {
          en: "Rama says the drawn weapon must be discharged, and the ocean directs it toward Marukantara, describing people there in hostile, dehumanising terms. The strike dries water and wounds land before Rama grants abundance afterward. Redirecting violence spares the sea, but it does not make distant people or terrain expendable.",
          hi: "राम कहते हैं कि चढ़ा हुआ अस्त्र छोड़ा ही जाना है, और समुद्र उसे मरुकांतार की ओर मोड़ता है तथा वहाँ के लोगों को शत्रुतापूर्ण, अमानवीय शब्दों में बताता है। प्रहार जल सुखाता और भूमि घायल करता है, फिर राम समृद्धि का वर देते हैं। हिंसा मोड़ने से समुद्र बचता है, पर दूर के लोग या भूमि खर्च योग्य नहीं हो जाते।",
        }, "Follow the redirected force to wounded land and lost water, then show later abundance as attempted repair rather than a retroactive cancellation of harm.", ["rama", "ocean", "marukantara"]),
        beat("nala-names-the-skill-the-camp-missed", { en: "Nala reveals that he can design the crossing", hi: "नल बताते हैं कि वे समुद्र-पार का निर्माण कर सकते हैं" }, {
          en: "The ocean identifies Nala as inheriting Vishvakarma's craft, and Nala confirms that he can build the passage. He says he did not announce the ability because he had not been asked. The moment exposes a coordination failure: a vast alliance possessed the needed expertise before leaders created a way for it to surface.",
          hi: "समुद्र नल को विश्वकर्मा की शिल्प-दक्षता का उत्तराधिकारी बताता है और नल पुष्टि करते हैं कि वे मार्ग बना सकते हैं। वे कहते हैं कि पूछे न जाने के कारण पहले यह योग्यता नहीं बताई। इससे समन्वय की कमी खुलती है—विशाल मित्र-सेना में आवश्यक विशेषज्ञता थी, पर नेतृत्व ने उसे सामने लाने का तरीका नहीं बनाया।",
        }, "Reveal Nala inside the crowd with dormant design lines around him, then connect expertise discovery to better questions and shared capability mapping.", ["nala", "ocean", "rama", "vishvakarma", "vanara-army"]),
        beat("the-forest-becomes-material", { en: "Construction draws heavily from the landscape", hi: "निर्माण भू-दृश्य से भारी मात्रा में सामग्री लेता है" }, {
          en: "Thousands enter the forest, uproot and cut many kinds of trees, move trunks, carry grasses, and roll great stones with machines. The work is energetic and coordinated, yet the material does not appear from nowhere. The causeway's achievement includes extraction, disturbed habitat, and labour that the finished surface could otherwise hide.",
          hi: "हजारों साथी वन में जाकर अनेक प्रकार के वृक्ष उखाड़ते और काटते, तने लाते, घास उठाते तथा यंत्रों से बड़े पत्थर घुमाते हैं। कार्य ऊर्जावान और संगठित है, पर सामग्री शून्य से नहीं आती। सेतु की उपलब्धि में उत्खनन, विचलित आवास और ऐसा श्रम भी शामिल है जिसे तैयार सतह छिपा सकती है।",
        }, "Keep material origin trails attached to every tree, stone, grass bundle, machine, and labour team as the causeway extends into the water.", ["nala", "vanara-army", "rama", "ocean-creatures"]),
        beat("five-days-create-a-shared-rhythm", { en: "The bridge grows through measured collective work", hi: "सेतु मापे हुए सामूहिक श्रम से बढ़ता है" }, {
          en: "Teams measure straightness, carry timber, place grass, move stone, and extend the causeway over five days. Daily progress differs, so the build feels like repeated organisation rather than one effortless miracle. Nala's design matters because thousands can understand roles, sequence work, and make separate loads become one traversable structure.",
          hi: "दल सीध मापते, लकड़ी लाते, घास रखते, पत्थर चलाते और पाँच दिनों में सेतु आगे बढ़ाते हैं। हर दिन की प्रगति अलग है, इसलिए निर्माण एक सहज चमत्कार नहीं बल्कि दोहराया संगठन लगता है। नल की योजना इसलिए महत्वपूर्ण है कि हजारों लोग भूमिकाएँ समझकर क्रम से काम करें और अलग-अलग भार को एक चलने योग्य संरचना बनाएँ।",
        }, "Advance a five-day construction clock through surveying, transport, placement, compaction, inspection, repair, and the meeting of causeway with Lanka's shore.", ["nala", "vanara-army", "rama", "sugriva", "hanuman", "angada"]),
        beat("the-whole-alliance-crosses", { en: "A solitary leap becomes a public road", hi: "अकेली छलाँग सार्वजनिक मार्ग बन जाती है" }, {
          en: "Vibhishana guards the far side, Rama rides with Hanuman, Lakshmana with Angada, and the host moves by causeway, water, and air. The roar of movement overtakes the sea. Unlike Hanuman's earlier secret crossing, this route distributes access across ordinary ranks and leaves a visible connection behind them.",
          hi: "विभीषण दूसरे तट की रक्षा करते हैं, राम हनुमान के साथ, लक्ष्मण अंगद के साथ जाते हैं और सेना सेतु, जल तथा आकाश से आगे बढ़ती है। गति की ध्वनि समुद्र की गर्जना से बड़ी हो जाती है। हनुमान की पहले की गुप्त छलाँग के विपरीत यह मार्ग सामान्य दलों तक पहुँच बाँटता और पीछे दिखाई देने वाला संबंध छोड़ता है।",
        }, "Pull from individual travellers into a vast continuous crossing where every unit has a lane, protection, destination, and recoverable route back.", ["vibhishana", "rama", "hanuman", "lakshmana", "angada", "sugriva", "vanara-army", "ocean"]),
      ],
    },
  },
  {
    id: "the-army-stands-before-lanka",
    nodeIds: ["rama", "lakshmana", "sugriva", "vibhishana", "angada", "nila", "jambavan", "suka", "ravana", "vanara-army", "lanka-defenders", "sita", "lanka-shore", "suvela", "lanka-walls", "ravana-court", "ashoka-grove"],
    moment: {
      id: "the-army-stands-before-lanka",
      decisiveChange: { en: "The bridge ends uncertainty about arrival: Rama's host forms before Lanka, the envoy confirms the new reality, and Ravana deliberately refuses one last off-ramp.", hi: "सेतु आगमन की अनिश्चितता समाप्त करता है—राम की सेना लंका के सामने व्यवस्थित होती है, दूत नई वास्तविकता की पुष्टि करता है और रावण अंतिम बचाव-पथ को जानबूझकर अस्वीकार करता है।" },
      beats: [
        beat("omens-are-read-as-war-cost", { en: "Rama expects loss on every side", hi: "राम हर पक्ष में हानि की आशंका देखते हैं" }, {
          en: "Rama observes violent weather, trembling ground, distressed animals, darkened light, and other signs his culture associates with catastrophe. The interpretation is his, not a deterministic forecast. Its emotional function is clear: reaching Lanka does not make the coming battle clean, and leading allies forward may cost many lives.",
          hi: "राम उग्र मौसम, काँपती धरती, व्याकुल पशु, धुँधली रोशनी और अन्य संकेत देखते हैं जिन्हें उनकी संस्कृति महाविपत्ति से जोड़ती है। यह उनकी व्याख्या है, निश्चित भविष्यवाणी नहीं। इसका भाव स्पष्ट है—लंका पहुँचने से युद्ध स्वच्छ नहीं हो जाता और साथियों को आगे ले जाने की कीमत अनेक जीवन हो सकती है।",
        }, "Layer Rama's interpreted omen map over concrete pre-battle risks—weather, terrain, crowd stress, weapons, and casualties—without predicting a fixed fate.", ["rama", "lakshmana", "vanara-army", "lanka-defenders"]),
        beat("lanka-becomes-near-and-personal", { en: "The city is visible, but Sita is still confined within it", hi: "नगर सामने है, पर सीता अब भी उसके भीतर बंदी हैं" }, {
          en: "From the approach, Rama sees Lanka's towers, groves, standards, walls, birds, and mountain setting. Beauty and defence occupy the same city. His attention returns to Sita somewhere inside, so the objective is not simply to conquer an impressive place; it is to reach a captive person without losing sight of everyone living around her.",
          hi: "निकट पहुँचकर राम लंका की मीनारें, उपवन, ध्वज, दीवारें, पक्षी और पर्वतीय स्थिति देखते हैं। सुंदरता और रक्षा एक ही नगर में हैं। उनका ध्यान भीतर कहीं बंदी सीता पर लौटता है, इसलिए उद्देश्य केवल भव्य स्थान जीतना नहीं, बल्कि आसपास रहने वालों को भुलाए बिना एक बंदी व्यक्ति तक पहुँचना है।",
        }, "Move through Lanka's beauty and fortification toward Sita's hidden position, keeping rescue, civilians, defenders, and city life in the same navigable space.", ["rama", "sita", "lakshmana", "lanka", "lanka-defenders"]),
        beat("the-host-takes-ordered-positions", { en: "Rama divides responsibility before the walls", hi: "राम दीवारों के सामने जिम्मेदारियाँ बाँटते हैं" }, {
          en: "Angada and Nila hold the centre, Rishabha and Gandhamadana protect the sides, Rama and Lakshmana stand forward, Jambavan and other leaders guard the interior, and Sugriva protects the rear. The formation gives the massed host orientation and keeps movement reversible as battle pressure rises.",
          hi: "अंगद और नील मध्य संभालते हैं, ऋषभ और गंधमादन किनारे बचाते हैं, राम तथा लक्ष्मण आगे रहते हैं, जाम्बवान और अन्य नेता भीतर की रक्षा करते हैं तथा सुग्रीव पीछे का भाग लेते हैं। यह रचना विशाल दल को दिशा देती और युद्ध-दबाव बढ़ने पर गति को वापस मोड़ने योग्य रखती है।",
        }, "Lay the command formation onto the terrain with clear centre, flanks, interior, front, rear, fallback routes, and protected communication between them.", ["rama", "lakshmana", "angada", "nila", "jambavan", "sugriva", "vanara-army"]),
        beat("suka-is-finally-released", { en: "Protection ends in actual release", hi: "सुरक्षा अंततः वास्तविक मुक्ति बनती है" }, {
          en: "After the army is arranged, Rama tells Sugriva to let Suka go. The injured envoy flies back rather than remaining an indefinite captive under the label of spy. His safe return allows unwelcome information to cross the line in both directions and makes Rama's earlier protection more than a temporary pause in violence.",
          hi: "सेना व्यवस्थित होने के बाद राम सुग्रीव से शुक को छोड़ने कहते हैं। घायल दूत गुप्तचर के नाम पर अनिश्चितकाल बंदी रहने के बजाय लौटता है। उसकी सुरक्षित वापसी अप्रिय जानकारी को दोनों दिशाओं में सीमा पार करने देती है और राम की पिछली रक्षा को हिंसा में अस्थायी विराम से अधिक बनाती है।",
        }, "Open a protected flight corridor from the allied formation back to Lanka, preserving the envoy's injuries and the information he carries without pursuit.", ["rama", "sugriva", "suka", "vanara-army", "ravana"]),
        beat("the-envoy-reports-the-bridge", { en: "Ravana can no longer dismiss the crossing", hi: "रावण अब समुद्र-पार को असंभव नहीं कह सकता" }, {
          en: "Suka reports that the causeway exists, Rama stands before the walls, and an immense host surrounds the approach. He recommends returning Sita immediately or preparing for battle because peace without a decision is no longer available. The messenger's battered body also carries evidence of the violence already spreading through both camps.",
          hi: "शुक बताता है कि सेतु बन चुका है, राम दीवारों के सामने हैं और विशाल सेना मार्ग घेर रही है। वह तुरंत सीता लौटाने या युद्ध की तैयारी करने को कहता है, क्योंकि निर्णय टालकर शांति अब उपलब्ध नहीं। उसका घायल शरीर दोनों शिविरों में फैलती हिंसा का प्रमाण भी साथ लाता है।",
        }, "Place the real bridge, formed army, return-Sita route, battle route, and Suka's injuries before Ravana as facts that no boast can remove.", ["suka", "ravana", "rama", "sita", "vanara-army", "lanka-defenders"]),
        beat("ravana-chooses-defiance-again", { en: "One last warning closes without correction", hi: "अंतिम चेतावनी भी सुधार के बिना बंद होती है" }, {
          en: "Ravana answers that even a coalition of celestial powers would not make him return Sita. He imagines Rama's body struck by arrows and turns battle cries into music. The scene ends not because alternatives vanished, but because Ravana deliberately rejects return after the breach, counsel, defection, reconnaissance, and bridge all made the consequence visible.",
          hi: "रावण उत्तर देता है कि देव-शक्तियों का गठबंधन भी उसे सीता लौटाने पर विवश नहीं करेगा। वह राम के शरीर को बाणों से घायल और युद्ध की चीखों को संगीत के रूप में कल्पित करता है। विकल्प समाप्त नहीं हुए; दृश्य इसलिए बंद होता है कि प्रवेश, सलाह, पक्षत्याग, गुप्तचर और सेतु से परिणाम स्पष्ट होने के बाद भी रावण वापसी अस्वीकार करता है।",
        }, "Close the return route by Ravana's explicit choice—not by fate—while the next siege paths ignite around Lanka and Sita remains the unresolved centre.", ["ravana", "rama", "sita", "suka", "lanka-defenders"]),
      ],
    },
  },
];
