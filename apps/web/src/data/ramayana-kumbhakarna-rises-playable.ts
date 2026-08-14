import type { StoryBeat } from "@/lib/domain/story-world";
import type { RamayanaBeginningPlayableScene } from "./ramayana-beginnings-playable";

const beat = (
  id: string,
  title: { en: string; hi: string },
  narration: { en: string; hi: string },
  visualCue: string,
  characterIds: string[],
): StoryBeat => ({ id, title, narration, visualCue, characterIds });

const scene = (
  id: string,
  nodeIds: string[],
  decisiveChange: { en: string; hi: string },
  beats: StoryBeat[],
): RamayanaBeginningPlayableScene => ({ id, nodeIds, moment: { id, decisiveChange, beats } });

export const RAMAYANA_KUMBHAKARNA_RISES_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  scene(
    "the-unseen-attack-finishes",
    ["rama", "lakshmana", "indrajit", "hanuman", "sugriva", "vibhishana", "allied-fighters", "night-battlefield", "serpent-arrows", "search-parties"],
    { en: "The hidden assault defeats every attempt at immediate rescue and leaves both brothers unable to continue.", hi: "छिपा आक्रमण तत्काल बचाव के हर प्रयास को विफल करके दोनों भाइयों को आगे लड़ने में असमर्थ कर देता है।" },
    [
      beat("ten-searchers-enter-the-dark", { en: "Ten searchers enter the dark", hi: "दस खोजी अँधेरे में उतरते हैं" }, {
        en: "Rama can hear arrows crossing the darkness but cannot locate the archer. He sends ten powerful leaders outward in different directions to find Indrajit, turning the surrounding field into a moving search. Their strength does not solve the central problem: every path begins from uncertain sound and ends in night, dust, and rapidly shifting positions.",
        hi: "राम अँधेरे में बाणों की आवाज़ सुन सकते हैं, पर धनुर्धर का स्थान नहीं जान पाते। वे दस शक्तिशाली सेनानायकों को अलग दिशाओं में इंद्रजीत की खोज में भेजते हैं और पूरा मैदान चलती हुई तलाश बन जाता है। उनकी शक्ति मूल कठिनाई नहीं मिटाती—हर राह अनिश्चित ध्वनि से शुरू होकर रात, धूल और बदलती स्थितियों में खो जाती है।",
      }, "Send ten moving search lights away from the brothers, each fading into dust and darkness while arrow paths appear from no stable origin.", ["rama", "indrajit", "search-parties", "allied-fighters"]),
      beat("arrows-arrive-without-a-target", { en: "Arrows arrive without a target", hi: "लक्ष्य दिखे बिना बाण आते हैं" }, {
        en: "Indrajit continues from concealment, striking the searchers and the guarded centre without offering a fixed point for return fire. Rama and Lakshmana try to answer the pressure, but each response is aimed at possibility rather than knowledge. The unequal visibility matters more than any claim that one side simply lacks courage or power.",
        hi: "इंद्रजीत छिपकर खोजियों और सुरक्षित केंद्र दोनों पर प्रहार करता रहता है, पर प्रत्युत्तर के लिए कोई स्थिर स्थान नहीं देता। राम और लक्ष्मण दबाव का उत्तर देने की कोशिश करते हैं, किंतु हर प्रहार जानकारी के बजाय संभावना पर लक्षित है। यह असमान दृश्यता किसी पक्ष में साहस या शक्ति की कमी कहने से अधिक महत्वपूर्ण है।",
      }, "Keep the attacker absent and let every defensive arrow travel into several plausible empty origins, making uncertainty spatially legible.", ["indrajit", "rama", "lakshmana", "search-parties"]),
      beat("lakshmana-weeps-beside-rama", { en: "Lakshmana weeps beside Rama", hi: "लक्ष्मण राम के पास रोते हैं" }, {
        en: "Wounds accumulate until Rama's body is almost hidden beneath the missiles. Lakshmana remains beside him, crying as his own strength fails. The tears are not a lapse in heroism; they mark a brother who can neither remove the danger nor leave. Around them, companions must protect two people whose usual ability to protect others has disappeared.",
        hi: "घाव बढ़ते-बढ़ते राम का शरीर बाणों के नीचे लगभग छिप जाता है। लक्ष्मण उनके पास रहते हैं और अपनी शक्ति चूकते हुए रोते हैं। आँसू वीरता की कमी नहीं, उस भाई की स्थिति हैं जो न संकट हटा सकता है, न साथ छोड़ सकता है। चारों ओर साथियों को अब उन दो लोगों की रक्षा करनी है जो सामान्यतः दूसरों की रक्षा करते थे।",
      }, "Lower both central figures into the ground plane while surrounding allies form an incomplete protective ring instead of a heroic tableau.", ["lakshmana", "rama", "hanuman", "sugriva", "allied-fighters"]),
      beat("the-centre-goes-still", { en: "The centre goes still", hi: "केंद्र निश्चल हो जाता है" }, {
        en: "At last both brothers lie unable to move, covered by serpent-like bonds and severe wounds. No one nearby can yet know whether stillness means death, unconsciousness, or a condition that can be reversed. The distinction must remain open, because command, rescue, grief, and the choices made in the next moments all depend on resisting a premature conclusion.",
        hi: "अंततः दोनों भाई सर्प-जैसे बंधनों और गंभीर घावों से ढके निश्चल पड़े हैं। पास खड़ा कोई व्यक्ति अभी नहीं जान सकता कि यह मृत्यु है, अचेतना है या पलटी जा सकने वाली दशा। यह अंतर खुला रहना चाहिए, क्योंकि कमान, बचाव, शोक और अगले निर्णय समय से पहले निष्कर्ष न मानने पर निर्भर हैं।",
      }, "Hold the scene on uncertain breathing, guarded space, and unanswered rescue paths; do not display a death marker or victory flourish.", ["rama", "lakshmana", "indrajit", "sugriva", "vibhishana", "allied-fighters"]),
    ],
  ),
  scene(
    "vibhishana-holds-the-circle",
    ["vibhishana", "sugriva", "rama", "lakshmana", "indrajit", "hanuman", "jambavan", "allied-fighters", "guard-circle", "lanka"],
    { en: "Vibhishana turns a presumed defeat into a duty of protection, recognition, and composure.", hi: "विभीषण मानी जा रही हार को सुरक्षा, पहचान और संयम के कर्तव्य में बदल देते हैं।" },
    [
      beat("guards-close-around-the-brothers", { en: "The guards close around the brothers", hi: "रक्षक भाइयों के चारों ओर घेरा कसते हैं" }, {
        en: "Hanuman, Sugriva, Jambavan, Angada, Nila, and other leaders gather around Rama and Lakshmana while missiles still arrive from an unseen direction. Vibhishana can perceive more of the hidden movement than the others, but perception alone cannot end it. The immediate achievement is smaller and vital: preventing panic from opening a path to the fallen pair.",
        hi: "हनुमान, सुग्रीव, जाम्बवान, अंगद, नील और अन्य सेनानायक राम-लक्ष्मण के चारों ओर जुटते हैं, जबकि अदृश्य दिशा से बाण आते रहते हैं। विभीषण छिपी गति को दूसरों से अधिक समझते हैं, पर केवल देख पाना उसे रोक नहीं सकता। तत्काल उपलब्धि छोटी पर जरूरी है—घबराहट को गिरे भाइयों तक रास्ता न देने देना।",
      }, "Build a layered guard circle whose gaps visibly close as each named leader arrives, while hidden impacts continue beyond its edge.", ["vibhishana", "hanuman", "sugriva", "jambavan", "rama", "lakshmana"]),
      beat("indrajit-wounds-the-ring", { en: "Indrajit wounds the ring", hi: "इंद्रजीत रक्षक घेरे को घायल करता है" }, {
        en: "Indrajit attacks the leaders one after another, hurting those who have taken over the work of defence. He then returns to Lanka and declares Rama and Lakshmana dead. The announcement creates celebration inside the city, but it records what he believes or wants accepted; it does not transform incomplete battlefield knowledge into certainty.",
        hi: "इंद्रजीत एक-एक करके उन सेनानायकों को घायल करता है जिन्होंने रक्षा का भार लिया है। फिर वह लंका लौटकर राम और लक्ष्मण की मृत्यु घोषित करता है। नगर में उत्सव शुरू होता है, पर घोषणा वही दर्ज करती है जो वह मानता है या मनवाना चाहता है; वह अधूरी युद्धभूमि-जानकारी को निश्चित सत्य नहीं बनाती।",
      }, "Split the view between a damaged guard ring and distant celebration in Lanka, keeping the unsupported certainty on the city side visibly separate.", ["indrajit", "vibhishana", "sugriva", "allied-leaders", "lanka"]),
      beat("sugriva-cannot-hide-his-fear", { en: "Sugriva cannot hide his fear", hi: "सुग्रीव अपना भय छिपा नहीं पाते" }, {
        en: "Sugriva looks at the motionless brothers and the injured companions, and fear shows openly in his face and body. Vibhishana does not shame him or demand a performance of confidence. He washes the king's eyes, speaks steadily, and reminds him that the responsible task is to protect life until the condition of the wounded becomes clear.",
        hi: "सुग्रीव निश्चल भाइयों और घायल साथियों को देखते हैं और उनके चेहरे तथा शरीर में भय साफ दिखाई देता है। विभीषण उन्हें लज्जित नहीं करते और झूठे आत्मविश्वास का प्रदर्शन नहीं माँगते। वे राजा की आँखें धोते, स्थिर स्वर में बोलते और याद दिलाते हैं कि घायलों की दशा स्पष्ट होने तक जीवन की रक्षा करना ही जिम्मेदार काम है।",
      }, "Use close, quiet gestures inside the battle noise: Vibhishana cleaning Sugriva's eyes and redirecting his gaze toward the people needing care.", ["sugriva", "vibhishana", "rama", "lakshmana", "allied-leaders"]),
      beat("despair-becomes-an-assignment", { en: "Despair becomes an assignment", hi: "निराशा जिम्मेदारी में बदलती है" }, {
        en: "Vibhishana tells the gathered leaders to compose the ranks, keep the brothers guarded, and refuse the enemy's conclusion until they possess their own evidence. Grief remains present; it is not erased by an order. What changes is its direction. People who felt the whole cause had ended now receive specific work that can preserve the possibility of recovery.",
        hi: "विभीषण जुटे सेनानायकों से दलों को संभालने, भाइयों की रक्षा करने और अपनी पुष्टि मिलने तक शत्रु का निष्कर्ष न मानने को कहते हैं। शोक बना रहता है; आदेश उसे मिटाता नहीं। उसकी दिशा बदलती है। जिन्हें लगा था कि पूरा प्रयत्न समाप्त हो गया, उन्हें अब ऐसे ठोस काम मिलते हैं जो स्वस्थ होने की संभावना बचा सकते हैं।",
      }, "Transform scattered fear paths into clear guard, aid, and communication routes without brightening the wounded centre prematurely.", ["vibhishana", "sugriva", "hanuman", "jambavan", "allied-fighters", "rama", "lakshmana"]),
    ],
  ),
  scene(
    "sita-is-forced-to-look",
    ["sita", "trijata", "ravana", "rama", "lakshmana", "pushpaka", "ashoka-grove", "battlefield", "guard-circle", "lanka"],
    { en: "A coerced spectacle of apparent death is answered by Trijata's grounded reading of signs that Ravana's display omits.", hi: "दिखाई गई मृत्यु के जबरन तमाशे का उत्तर त्रिजटा उन वास्तविक संकेतों को पढ़कर देती हैं जिन्हें रावण का प्रदर्शन छिपाता है।" },
    [
      beat("grief-is-made-into-a-weapon", { en: "Grief is made into a weapon", hi: "शोक को हथियार बनाया जाता है" }, {
        en: "Ravana orders Sita taken in the Pushpaka above the field so that the sight of Rama and Lakshmana will break her refusal. She is not travelling by choice, and the view is arranged for a purpose: isolate two motionless bodies from every uncertainty and present the most painful interpretation as settled fact.",
        hi: "रावण सीता को पुष्पक में युद्धभूमि के ऊपर ले जाने का आदेश देता है ताकि राम और लक्ष्मण का दृश्य उनका प्रतिरोध तोड़ दे। यह यात्रा उनकी इच्छा से नहीं है और दृश्य एक उद्देश्य से सजाया गया है—दो निश्चल शरीरों को हर अनिश्चितता से अलग करके सबसे पीड़ादायक अर्थ को तय तथ्य की तरह दिखाना।",
      }, "Frame the aerial path as confinement, with Sita's movement controlled and the battlefield view narrowed deliberately toward two bodies.", ["ravana", "sita", "trijata", "pushpaka", "rama", "lakshmana"]),
      beat("sita-sees-a-future-collapse", { en: "Sita sees a future collapse", hi: "सीता भविष्य को टूटते देखती हैं" }, {
        en: "From above, Sita sees the brothers pierced and still, the surrounding fighters subdued, and the expected rescue absent. She grieves not only Rama but Lakshmana, Kausalya, the waiting family, and every promise attached to return. Her remembered assurances about fortune and bodily signs now feel false, showing how catastrophe can shatter inherited confidence without proving a body ever deserved judgment.",
        hi: "ऊपर से सीता दोनों भाइयों को घायल और निश्चल, आसपास के योद्धाओं को दबा हुआ और अपेक्षित बचाव को अनुपस्थित देखती हैं। वे केवल राम के लिए नहीं, लक्ष्मण, कौसल्या, प्रतीक्षारत परिवार और लौटने से जुड़े हर वचन के लिए शोक करती हैं। भाग्य और शारीरिक चिह्नों की पुरानी आश्वस्तियाँ अब झूठी लगती हैं; विपत्ति विरासत में मिले विश्वास तोड़ सकती है, पर किसी शरीर को मूल्यांकन का विषय नहीं बनाती।",
      }, "Let family and home connections dim around Sita as she grieves, while fortune symbols dissolve rather than attach value to her body.", ["sita", "rama", "lakshmana", "kausalya", "ayodhya", "battlefield"]),
      beat("trijata-reads-what-is-still-moving", { en: "Trijata reads what is still moving", hi: "त्रिजटा अभी जीवित संकेतों को पढ़ती हैं" }, {
        en: "Trijata does not ask Sita to stop feeling or simply insist that everything will be well. She points to observable details: the surrounding army has not dispersed as it would after final loss, guards remain intent on protection, faces do not carry settled defeat, and the vehicle itself has not behaved as expected under the claimed condition.",
        hi: "त्रिजटा सीता से भावनाएँ रोकने को नहीं कहतीं और न केवल यह दोहराती हैं कि सब ठीक होगा। वे दिखाई देने वाली बातों की ओर ध्यान दिलाती हैं—सेना अंतिम हानि के बाद जैसी बिखरती, वैसी नहीं बिखरी; रक्षक सुरक्षा में लगे हैं; चेहरों पर निश्चित पराजय नहीं और वाहन भी दावे की गई स्थिति के अनुरूप व्यवहार नहीं कर रहा।",
      }, "Restore the wider field one living signal at a time: guarding hands, intact formations, watchful faces, and the responsive vehicle.", ["trijata", "sita", "guard-circle", "allied-fighters", "pushpaka"]),
      beat("hope-does-not-erase-uncertainty", { en: "Hope does not erase uncertainty", hi: "आशा अनिश्चितता नहीं मिटाती" }, {
        en: "Sita accepts Trijata's reasoning enough to breathe and pray, but she does not receive direct confirmation from the ground. The Pushpaka carries her back to the Ashoka grove with both grief and a credible opening for hope. The coercive attempt has failed to create surrender, yet its emotional injury does not vanish when the misleading conclusion weakens.",
        hi: "सीता त्रिजटा के तर्क को इतना स्वीकार करती हैं कि साँस ले सकें और प्रार्थना कर सकें, पर उन्हें नीचे से प्रत्यक्ष पुष्टि नहीं मिलती। पुष्पक उन्हें शोक और विश्वसनीय आशा—दोनों के साथ अशोक-वाटिका लौटाता है। दबाव का प्रयास समर्पण नहीं करा सका, फिर भी भ्रामक निष्कर्ष कमजोर होते ही भावनात्मक चोट गायब नहीं होती।",
      }, "Return to the grove along two parallel light paths—grief and cautious hope—without converting either into a definitive status marker.", ["sita", "trijata", "pushpaka", "ashoka-grove", "rama", "lakshmana"]),
    ],
  ),
  scene(
    "rama-wakes-into-grief",
    ["rama", "lakshmana", "vibhishana", "sugriva", "hanuman", "jambavan", "allied-fighters", "guard-circle", "ayodhya-family", "battlefield"],
    { en: "Rama regains consciousness, but grief and panic temporarily make relationship and identity harder to recognise.", hi: "राम को होश आता है, पर शोक और घबराहट संबंध तथा पहचान को कुछ समय के लिए समझना कठिन बना देते हैं।" },
    [
      beat("rama-finds-lakshmana-still", { en: "Rama finds Lakshmana still", hi: "राम लक्ष्मण को निश्चल पाते हैं" }, {
        en: "Rama opens his eyes before Lakshmana does. Seeing his brother unmoving and covered in wounds, he assumes the worst before anyone can examine the condition fully. His first awareness therefore brings no relief: survival places him beside a person he believes has died for him, inside a field he can neither command nor leave.",
        hi: "राम की आँखें लक्ष्मण से पहले खुलती हैं। भाई को निश्चल और घावों से ढका देखकर वे पूरी जाँच से पहले सबसे बुरा निष्कर्ष मान लेते हैं। इसलिए होश लौटना राहत नहीं लाता—वे ऐसे व्यक्ति के पास जीवित हैं जिसे अपने लिए मरा मानते हैं, और ऐसी भूमि में हैं जिसे न संभाल सकते हैं, न छोड़ सकते हैं।",
      }, "Raise Rama's awareness slowly while Lakshmana remains still, keeping medical uncertainty and the surrounding protective hands visible.", ["rama", "lakshmana", "hanuman", "sugriva", "guard-circle"]),
      beat("grief-speaks-in-absolutes", { en: "Grief speaks in absolutes", hi: "शोक अंतिम निष्कर्षों में बोलता है" }, {
        en: "Rama says that victory, Sita, kingdom, and even his own life have lost meaning without Lakshmana. He releases allies from obligation and speaks of dying rather than returning to face their mothers. These words reveal acute distress and self-blame, not a balanced judgment about Sita's worth, the alliance's duty, or what the living should do next.",
        hi: "राम कहते हैं कि लक्ष्मण के बिना विजय, सीता, राज्य और उनका अपना जीवन अर्थहीन हैं। वे साथियों को दायित्व से मुक्त करते और माताओं का सामना करने के बजाय मरने की बात कहते हैं। ये शब्द तीव्र संकट और आत्म-दोष दिखाते हैं, सीता के मूल्य, मित्र-दल के कर्तव्य या जीवित लोगों के अगले कदम पर संतुलित निर्णय नहीं।",
      }, "Let spoken absolutes race outward as unstable dark waves, while enduring relationship lines remain present beneath them instead of disappearing.", ["rama", "lakshmana", "sita", "ayodhya-family", "allied-fighters"]),
      beat("companions-hold-what-rama-cannot", { en: "Companions hold what Rama cannot", hi: "साथी वह संभालते हैं जो राम अभी नहीं संभाल सकते" }, {
        en: "The surrounding leaders do not treat Rama's despair as a command to abandon the field. They continue guarding Lakshmana, watching Rama, and maintaining the circle. Agency has shifted temporarily to people usually described as followers. Their care keeps one person's crisis from becoming an irreversible decision for everyone connected to him.",
        hi: "आसपास के सेनानायक राम की निराशा को मैदान छोड़ने का आदेश नहीं मानते। वे लक्ष्मण की रक्षा, राम की देखभाल और घेरे को बनाए रखते हैं। क्षमता कुछ समय के लिए उन लोगों के पास चली गई है जिन्हें सामान्यतः अनुयायी कहा जाता है। उनकी देखभाल एक व्यक्ति के संकट को उससे जुड़े सभी लोगों का अपरिवर्तनीय निर्णय बनने से रोकती है।",
      }, "Shift control paths from Rama to the surrounding companions, showing care, watch, and defence continuing without a single heroic centre.", ["hanuman", "sugriva", "jambavan", "allied-fighters", "rama", "lakshmana"]),
      beat("fear-misnames-vibhishana", { en: "Fear misnames Vibhishana", hi: "भय विभीषण को गलत नाम देता है" }, {
        en: "When Vibhishana approaches carrying his mace, already frightened fighters mistake him for Indrajit and begin to flee. Familiarity, alliance, and previous service vanish under a silhouette associated with the recent attack. The error is corrected only when people deliberately name who is coming, showing that recognition can require shared verification after trauma.",
        hi: "जब विभीषण गदा लिए पास आते हैं, पहले से डरे योद्धा उन्हें इंद्रजीत समझकर भागने लगते हैं। हाल के आक्रमण से जुड़ी आकृति के सामने परिचय, मित्रता और पिछली सेवा मिट जाती है। भूल तभी सुधरती है जब लोग जानबूझकर आने वाले का नाम बताते हैं; आघात के बाद पहचान के लिए साझा पुष्टि जरूरी हो सकती है।",
      }, "Present one ambiguous silhouette, then restore Vibhishana's known connections only as several companions identify him together.", ["vibhishana", "indrajit", "sugriva", "jambavan", "allied-fighters"]),
    ],
  ),
  scene(
    "garuda-breaks-the-bonds",
    ["garuda", "rama", "lakshmana", "sugriva", "vibhishana", "sushena", "hanuman", "serpent-arrows", "medicine-route", "lanka-gates"],
    { en: "Care, medicine planning, and Garuda's arrival reopen the campaign without making fear for Lanka's civilians acceptable.", hi: "देखभाल, औषधि-योजना और गरुड़ का आगमन अभियान फिर खोलते हैं, पर लंका के नागरिकों के लिए भय को स्वीकार्य नहीं बनाते।" },
    [
      beat("names-stop-the-flight", { en: "Names stop the flight", hi: "नाम पुकारने से भगदड़ रुकती है" }, {
        en: "Jambavan and other leaders call out that the approaching figure is Vibhishana, not Indrajit. The fleeing ranks slow as recognition is rebuilt through several trusted voices. Sugriva can then meet Vibhishana as an ally carrying grief of his own, rather than as the feared shape onto which the army projected its recent wounds.",
        hi: "जाम्बवान और अन्य सेनानायक पुकारते हैं कि आने वाली आकृति इंद्रजीत नहीं, विभीषण हैं। कई विश्वसनीय आवाज़ों से पहचान दोबारा बनती है और भागते दल धीमे पड़ते हैं। तब सुग्रीव विभीषण को अपने शोक वाले साथी की तरह मिल सकते हैं, उस भयभीत छाया की तरह नहीं जिस पर सेना ने हाल के घाव डाल दिए थे।",
      }, "Reconnect Vibhishana's name to known ally nodes through several converging voice pulses until the retreat paths stop expanding.", ["jambavan", "vibhishana", "sugriva", "allied-fighters"]),
      beat("two-leaders-share-uncertainty", { en: "Two leaders share uncertainty", hi: "दो नेता अनिश्चितता साझा करते हैं" }, {
        en: "Vibhishana weeps over the brothers and fears that every hope attached to his departure from Lanka has ended. Sugriva, who needed reassurance moments earlier, now offers it. Their positions are not fixed as strong helper and weak recipient; care moves between them as each person becomes able to carry what the other cannot hold alone.",
        hi: "विभीषण भाइयों पर रोते हैं और डरते हैं कि लंका छोड़ने से जुड़ी उनकी हर आशा समाप्त हो गई। कुछ क्षण पहले जिन्हें आश्वासन चाहिए था, वही सुग्रीव अब उन्हें सहारा देते हैं। उनकी भूमिकाएँ स्थायी मजबूत सहायक और कमजोर प्राप्तकर्ता की नहीं हैं; देखभाल उनके बीच चलती है, जब जो सक्षम हो वह दूसरे का अकेले न संभलने वाला भार उठाता है।",
      }, "Show reassurance reversing direction between Sugriva and Vibhishana, with neither person permanently elevated above the other.", ["vibhishana", "sugriva", "rama", "lakshmana"]),
      beat("sushena-makes-a-medicine-plan", { en: "Sushena makes a medicine plan", hi: "सुषेण औषधि की योजना बनाते हैं" }, {
        en: "Sushena proposes sending swift companions toward known mountains for medicines associated with restoring the wounded. The plan gives the alliance an actionable route before any miraculous help appears. It matters that practical care begins under uncertainty: the people present do not wait passively for rescue they cannot predict.",
        hi: "सुषेण तेज साथियों को उन परिचित पर्वतों की ओर भेजने का सुझाव देते हैं जहाँ घायलों को स्वस्थ करने वाली औषधियाँ मानी जाती हैं। किसी अद्भुत सहायता से पहले ही योजना मित्र-दल को काम करने योग्य राह देती है। अनिश्चितता में व्यावहारिक देखभाल शुरू होना महत्वपूर्ण है—उपस्थित लोग ऐसी सहायता की निष्क्रिय प्रतीक्षा नहीं करते जिसकी भविष्यवाणी नहीं कर सकते।",
      }, "Open a concrete medicine route from the guarded field toward distant mountains before any supernatural light enters the scene.", ["sushena", "sugriva", "hanuman", "rama", "lakshmana", "medicine-route"]),
      beat("garuda-releases-without-condemning-a-city", { en: "Garuda releases the bonds", hi: "गरुड़ बंधन खोलते हैं" }, {
        en: "Garuda arrives through violent wind, and the serpent-like bonds flee as he touches the brothers. Strength, colour, and awareness return, allowing the army to rejoice. His warning that Lanka's warriors use deception belongs to urgent battlefield counsel; it cannot make every inhabitant deceitful or turn children, elders, and other civilians into acceptable consequences of war.",
        hi: "गरुड़ प्रचंड हवा के साथ आते हैं और उनके स्पर्श पर सर्प-जैसे बंधन भागते हैं। भाइयों में शक्ति, रंग और चेतना लौटती है और सेना आनंद मनाती है। लंका के योद्धाओं के छल की उनकी चेतावनी तत्काल युद्ध-परामर्श है; वह हर निवासी को छलपूर्ण नहीं बनाती और बच्चों, बुजुर्गों तथा अन्य नागरिकों को युद्ध का स्वीकार्य परिणाम नहीं ठहरा सकती।",
      }, "Release the bonds in a bright wind, then keep civilian lights inside Lanka distinct from military positions instead of sweeping the whole city into one enemy mass.", ["garuda", "rama", "lakshmana", "serpent-arrows", "lanka-civilians", "lanka-defenders"]),
    ],
  ),
  scene(
    "dhumraksha-takes-the-west-road",
    ["ravana", "dhumraksha", "hanuman", "allied-fighters", "lanka-defenders", "west-gate", "chariot", "battlefield-animals", "broken-vehicles", "lanka"],
    { en: "The first renewed sortie is stopped, but its path is measured through fear, damage, and exhausted survivors rather than a clean win.", hi: "नया पहला अभियान रोक दिया जाता है, पर उसकी राह साफ जीत से नहीं, भय, नुकसान और थके जीवित लोगों से मापी जाती है।" },
    [
      beat("recovery-reaches-ravana", { en: "Recovery reaches Ravana", hi: "स्वस्थ होने का समाचार रावण तक पहुँचता है" }, {
        en: "The sound of renewed allied confidence reaches Lanka, and scouts confirm that Rama and Lakshmana are standing again. Ravana's earlier certainty collapses into alarm. Instead of reconsidering the refusal that produced the siege, he sends Dhumraksha through the western gate to restore control by another concentrated attack.",
        hi: "मित्र-दल के लौटे आत्मविश्वास की ध्वनि लंका पहुँचती है और गुप्तचर पुष्टि करते हैं कि राम-लक्ष्मण फिर खड़े हैं। रावण की पिछली निश्चितता भय में टूट जाती है। घेराबंदी पैदा करने वाले इनकार पर फिर विचार करने के बजाय वह धूम्राक्ष को पश्चिमी द्वार से एक और केंद्रित आक्रमण में भेजता है।",
      }, "Carry celebration across the walls as sound, then show Ravana redirecting his collapsing certainty into a westward attack route.", ["ravana", "dhumraksha", "rama", "lakshmana", "west-gate"]),
      beat("omens-are-read-before-the-gate", { en: "Omens are read before the gate", hi: "द्वार से पहले संकेत पढ़े जाते हैं" }, {
        en: "Animals cry, the chariot behaves strangely, and unsettling sights surround the departure. The fighters interpret these events as warnings of defeat, which affects confidence before weapons meet. The signs belong to how people inside the account understand danger; they do not remove choice or mechanically guarantee the outcome that follows.",
        hi: "पशु पुकारते हैं, रथ असामान्य व्यवहार करता है और प्रस्थान के चारों ओर बेचैन करने वाले दृश्य दिखते हैं। योद्धा इन्हें हार की चेतावनी मानते हैं, जिससे शस्त्र मिलने से पहले ही आत्मविश्वास प्रभावित होता है। ये संकेत उस समय लोगों द्वारा संकट समझने का तरीका हैं; वे चुनाव नहीं मिटाते और आगे का परिणाम यांत्रिक रूप से तय नहीं करते।",
      }, "Place interpreted warning symbols around the departing formation but leave tactical paths and choices visibly open rather than locking fate.", ["dhumraksha", "lanka-defenders", "battlefield-animals", "chariot"]),
      beat("the-western-field-breaks-apart", { en: "The western field breaks apart", hi: "पश्चिमी मैदान टूटने लगता है" }, {
        en: "Dhumraksha's arrows meet trees and rocks carried by the defenders of the gate. Vehicles splinter, animals fall, formations break, and fighters on both sides are wounded or killed. The wide view must retain debris, fear, and people trying to withdraw, so rapid action never becomes a score detached from what the clash consumes.",
        hi: "धूम्राक्ष के बाण द्वार की रक्षा कर रहे योद्धाओं के वृक्षों और शिलाओं से टकराते हैं। वाहन टूटते, पशु गिरते, दल बिखरते और दोनों पक्षों के लोग घायल या मारे जाते हैं। विस्तृत दृश्य में मलबा, भय और पीछे हटने की कोशिश करते लोग बने रहने चाहिए, ताकि तेज कार्रवाई उस कीमत से कटी हुई गिनती न बन जाए जिसे संघर्ष निगलता है।",
      }, "Keep retreat lanes, fallen animals, shattered vehicles, and exhausted groups visible behind the moving front instead of clearing the field after each impact.", ["dhumraksha", "allied-fighters", "lanka-defenders", "battlefield-animals", "broken-vehicles"]),
      beat("hanuman-stops-the-sortie", { en: "Hanuman stops the sortie", hi: "हनुमान अभियान रोकते हैं" }, {
        en: "Hanuman withstands Dhumraksha's attack, lifts a mountain mass, and finally strikes him down after the first weapon breaks the vehicle rather than the commander. The remaining Lanka formation retreats through the gate. Hanuman's success protects the western line, but the people and animals already lost do not return when the immediate threat ends.",
        hi: "हनुमान धूम्राक्ष का आक्रमण सहते, पर्वत-खंड उठाते और पहले प्रहार से सेनानायक के बजाय वाहन टूटने के बाद अंततः उसे रोकते हैं। बचा लंका-दल द्वार से लौट जाता है। हनुमान की सफलता पश्चिमी पंक्ति बचाती है, पर तत्काल खतरा मिटने पर पहले खोए लोग और पशु वापस नहीं आते।",
      }, "End the advancing route at Hanuman while damage remains persistent across the field and the surviving defenders withdraw through the gate.", ["hanuman", "dhumraksha", "allied-fighters", "lanka-defenders", "west-gate"]),
    ],
  ),
  scene(
    "angada-meets-vajradanshtra",
    ["angada", "vajradanshtra", "ravana", "allied-fighters", "lanka-defenders", "south-gate", "chariot", "battlefield-animals", "broken-weapons", "lanka"],
    { en: "Angada survives a prolonged southern contest whose changing weapons and accumulated losses resist a simple triumphal reading.", hi: "अंगद दक्षिणी लंबे संघर्ष से बचते हैं, जहाँ बदलते शस्त्र और जुड़ता नुकसान किसी सरल विजय-पाठ को रोकते हैं।" },
    [
      beat("another-commander-is-sent", { en: "Another commander is sent", hi: "एक और सेनानायक भेजा जाता है" }, {
        en: "After Dhumraksha's death, Ravana sends Vajradanshtra toward the southern gate with another large formation. The decision repeats the same structure: a commander is made responsible for reversing a crisis created by the ruler's continuing refusal. Each new departure consumes more of the city's military strength without changing the cause of the siege.",
        hi: "धूम्राक्ष की मृत्यु के बाद रावण वज्रदंष्ट्र को बड़े दल के साथ दक्षिणी द्वार भेजता है। निर्णय वही ढाँचा दोहराता है—शासक के जारी इनकार से बने संकट को पलटने की जिम्मेदारी नए सेनानायक पर डाल दी जाती है। हर नया प्रस्थान नगर की और सैन्य शक्ति खर्च करता है, पर घेराबंदी का कारण नहीं बदलता।",
      }, "Draw a repeated route from Ravana's court to a different gate, with the city's remaining defence visibly thinning after each departure.", ["ravana", "vajradanshtra", "lanka-defenders", "south-gate"]),
      beat("confidence-and-warning-travel-together", { en: "Confidence and warning travel together", hi: "आत्मविश्वास और चेतावनी साथ चलते हैं" }, {
        en: "Vajradanshtra leaves with ceremonial confidence while unsettling signs are noticed around the chariot and road. Participants carry both interpretations into battle: the promise of force and the fear that the expedition is already compromised. Neither feeling determines the result, but both shape attention, hesitation, and the way danger is perceived.",
        hi: "वज्रदंष्ट्र औपचारिक आत्मविश्वास के साथ निकलता है, जबकि रथ और मार्ग के आसपास बेचैन संकेत देखे जाते हैं। योद्धा दोनों अर्थ युद्ध में साथ ले जाते हैं—शक्ति का भरोसा और अभियान के पहले ही बिगड़ने का डर। कोई भावना परिणाम तय नहीं करती, पर दोनों ध्यान, झिझक और संकट को देखने का ढंग बदलती हैं।",
      }, "Layer confident drums with uneasy animal movement and unstable chariot details, leaving the future route responsive rather than predetermined.", ["vajradanshtra", "lanka-defenders", "chariot", "battlefield-animals"]),
      beat("mass-battle-narrows-to-two", { en: "Mass battle narrows to two", hi: "व्यापक युद्ध दो योद्धाओं में सिमटता है" }, {
        en: "The southern field fills with arrows, rocks, trees, broken vehicles, and wounded groups before Angada and Vajradanshtra reach one another. Their contest changes through missiles, a tree, a crag, a mace, bare hands, and swords. Fatigue and injury travel across every change of weapon; neither figure begins each exchange newly restored.",
        hi: "अंगद और वज्रदंष्ट्र के आमने-सामने आने से पहले दक्षिणी मैदान बाणों, शिलाओं, वृक्षों, टूटे वाहनों और घायल दलों से भर जाता है। उनका द्वंद्व प्रक्षेपास्त्र, वृक्ष, शिला, गदा, हाथ और तलवार के बीच बदलता है। थकान और चोट हर शस्त्र-परिवर्तन के साथ चलती हैं; कोई भी हर चरण में नया और पूर्ण नहीं हो जाता।",
      }, "Narrow from the damaged field to the duel while persistent wounds, fatigue, and discarded weapons remain attached to both moving figures.", ["angada", "vajradanshtra", "allied-fighters", "lanka-defenders", "broken-weapons"]),
      beat("angada-remains-standing", { en: "Angada remains standing", hi: "अंगद अंत तक खड़े रहते हैं" }, {
        en: "Angada survives the sword exchange and kills Vajradanshtra, causing the remaining sortie to retreat. The outcome matters tactically, but a restrained view stays with breath, unstable footing, scattered equipment, and injured survivors before it follows celebration. Endurance here is not invulnerability; Angada remains standing after a contest that has visibly altered him and everyone nearby.",
        hi: "अंगद तलवार के संघर्ष से बचकर वज्रदंष्ट्र को मारते हैं और बचा अभियान पीछे हटता है। परिणाम सैन्य दृष्टि से महत्वपूर्ण है, पर संयत दृश्य उत्सव से पहले साँस, डगमगाते कदम, बिखरे साधन और घायल जीवित लोगों पर ठहरता है। यहाँ सहनशक्ति अजेयता नहीं; अंगद ऐसे संघर्ष के बाद खड़े हैं जिसने उन्हें और आसपास सभी को बदल दिया है।",
      }, "Hold on Angada's exhausted balance and the field's persistent damage before allowing the southern line to register that the attack has ended.", ["angada", "vajradanshtra", "allied-fighters", "lanka-defenders", "south-gate"]),
    ],
  ),
  scene(
    "dust-erases-the-two-sides",
    ["akampana", "hanuman", "ravana", "allied-fighters", "lanka-defenders", "dust-cloud", "battlefield", "trees", "broken-chariot", "retreat-lines"],
    { en: "A dust cloud makes both armies harm their own, before Hanuman restores a visible centre and stops Akampana.", hi: "धूल का बादल दोनों सेनाओं से अपने ही लोगों को हानि पहुँचवाता है; फिर हनुमान दृश्य केंद्र लौटाकर अकंपन को रोकते हैं।" },
    [
      beat("akampana-enters-the-gap", { en: "Akampana enters the gap", hi: "अकंपन बनी हुई दरार में उतरता है" }, {
        en: "Ravana answers another failed sortie by sending Akampana, who advances with a fresh formation into a field already altered by earlier fighting. He is not entering an empty arena. Broken ground, abandoned equipment, frightened animals, and tired defenders shape the route before the first new exchange begins.",
        hi: "रावण एक और विफल अभियान का उत्तर अकंपन को भेजकर देता है, जो पहले के युद्ध से बदले मैदान में नया दल लेकर बढ़ता है। वह खाली अखाड़े में नहीं उतर रहा। टूटी भूमि, छोड़े साधन, डरे पशु और थके रक्षक नए संघर्ष से पहले ही राह को आकार देते हैं।",
      }, "Route the new formation through persistent debris and tired groups from earlier clashes, refusing to reset the battlefield between commanders.", ["ravana", "akampana", "lanka-defenders", "battlefield", "broken-chariot"]),
      beat("dust-removes-recognition", { en: "Dust removes recognition", hi: "धूल पहचान मिटा देती है" }, {
        en: "Movement raises a cloud so dense that colour, face, insignia, and direction disappear. Fighters can no longer tell companion from opponent and begin striking members of their own groups. The harm is not explained by treachery or moral failure; it emerges from force applied when perception and communication have collapsed.",
        hi: "चलते दल इतनी घनी धूल उठाते हैं कि रंग, चेहरा, चिह्न और दिशा गायब हो जाते हैं। योद्धा साथी और विरोधी में अंतर नहीं कर पाते और अपने ही दलों पर प्रहार करने लगते हैं। यह हानि विश्वासघात या नैतिक कमी से नहीं समझाई जाती; वह तब पैदा होती है जब दृष्टि और संवाद टूटने पर भी बल लगाया जाता है।",
      }, "Erase labels and colour coding inside the dust while keeping impact uncertainty visible, so no hidden system silently prevents friendly fire.", ["allied-fighters", "lanka-defenders", "dust-cloud"]),
      beat("hanuman-becomes-a-visible-anchor", { en: "Hanuman becomes a visible anchor", hi: "हनुमान दृश्य आधार बनते हैं" }, {
        en: "As the air clears, Hanuman's position gives scattered allies a point around which to reform. Akampana concentrates arrows on him, and Hanuman answers with rocks and trees while nearby groups pull away from the central danger. The contest becomes readable again, but the injuries caused under the dust remain part of the field.",
        hi: "हवा साफ होने पर हनुमान की स्थिति बिखरे साथियों को फिर जुटने का केंद्र देती है। अकंपन उन पर बाण केंद्रित करता है और हनुमान शिला तथा वृक्ष से उत्तर देते हैं, जबकि पास के दल मुख्य खतरे से हटते हैं। संघर्ष फिर समझ में आता है, पर धूल में लगी चोटें मैदान का हिस्सा बनी रहती हैं।",
      }, "Reveal Hanuman gradually as an orientation anchor, reconnecting allies while injured figures from the obscured interval remain where they fell.", ["hanuman", "akampana", "allied-fighters", "lanka-defenders", "dust-cloud"]),
      beat("the-tree-ends-the-advance", { en: "The tree ends the advance", hi: "वृक्ष आगे बढ़ना रोक देता है" }, {
        en: "Akampana's arrows wound Hanuman, but they do not stop his approach. Hanuman uproots a tree and uses it to kill the commander, after which the remaining Lanka fighters withdraw. The immediate route closes with a decisive act, yet its clearest lesson is environmental: power without reliable perception had already injured both sides before either leader settled the contest.",
        hi: "अकंपन के बाण हनुमान को घायल करते हैं, पर उनका आगे बढ़ना नहीं रोकते। हनुमान वृक्ष उखाड़कर सेनानायक को मारते हैं और बचा लंका-दल लौट जाता है। तत्काल राह निर्णायक प्रहार से बंद होती है, फिर भी सबसे स्पष्ट सीख वातावरण की है—विश्वसनीय दृष्टि के बिना शक्ति ने दोनों पक्षों को पहले ही घायल कर दिया था।",
      }, "Close Akampana's route at the uprooted tree, then pull back to the mixed casualties created before visibility returned.", ["hanuman", "akampana", "allied-fighters", "lanka-defenders", "trees"]),
    ],
  ),
  scene(
    "prahasta-chooses-the-war-he-warned-against",
    ["prahasta", "ravana", "nila", "vibhishana", "allied-fighters", "lanka-defenders", "east-gate", "council-chamber", "chariot", "battlefield"],
    { en: "Prahasta knowingly serves the course he once opposed, and the contradiction ends with his death at the eastern gate.", hi: "प्रहस्त जानबूझकर उसी राह की सेवा करता है जिसका उसने कभी विरोध किया था, और यह विरोधाभास पूर्वी द्वार पर उसकी मृत्यु में समाप्त होता है।" },
    [
      beat("prahasta-remembers-his-own-counsel", { en: "Prahasta remembers his own counsel", hi: "प्रहस्त अपनी ही सलाह याद करता है" }, {
        en: "When Ravana asks what remains after repeated losses, Prahasta says he had already urged Sita's return and understood that refusal would bring war. He has not been deceived about the cause. His knowledge makes the next choice more difficult, because he cannot present participation as obedience without awareness.",
        hi: "बार-बार हानि के बाद रावण पूछता है कि अब क्या बचा है, तो प्रहस्त कहता है कि उसने पहले ही सीता-वापसी की सलाह दी थी और जानता था कि इनकार युद्ध लाएगा। वह कारण से भ्रमित नहीं है। यह ज्ञान अगला चुनाव कठिन बनाता है, क्योंकि वह भागीदारी को अनजान आज्ञापालन नहीं बता सकता।",
      }, "Place Prahasta's earlier return path beside the current east-gate route, both visible as he speaks before choosing between them.", ["prahasta", "ravana", "sita", "council-chamber"]),
      beat("loyalty-overrides-judgment", { en: "Loyalty overrides judgment", hi: "निष्ठा निर्णय पर भारी पड़ती है" }, {
        en: "Prahasta recalls Ravana's honours and gifts, then offers his life and leads the eastern sortie. Gratitude and office are real bonds, but they do not make the chosen course right or erase the people it will endanger. Loyalty here is a tragic mechanism that carries clear judgment into conduct that contradicts it.",
        hi: "प्रहस्त रावण के सम्मान और उपहार याद करता है, फिर अपना जीवन अर्पित करके पूर्वी अभियान का नेतृत्व करता है। कृतज्ञता और पद वास्तविक बंधन हैं, पर वे चुनी राह को सही नहीं बनाते और उससे संकट में पड़ने वाले लोगों को नहीं मिटाते। यहाँ निष्ठा दुखद तंत्र है जो स्पष्ट निर्णय को उसके विपरीत आचरण में ले जाती है।",
      }, "Let gift and office connections pull Prahasta toward the gate while his earlier counsel line remains intact and visibly opposed.", ["prahasta", "ravana", "lanka-defenders", "east-gate"]),
      beat("vibhishana-identifies-the-advance", { en: "Vibhishana identifies the advance", hi: "विभीषण बढ़ते दल की पहचान कराते हैं" }, {
        en: "From the allied side, Vibhishana names Prahasta, his office, vehicle, and importance, allowing the eastern defenders to understand what is approaching. The battle first removes several close counsellors around the commander. Their loss changes coordination and leaves Prahasta increasingly isolated before Nila reaches him.",
        hi: "मित्र-पक्ष से विभीषण प्रहस्त का नाम, पद, वाहन और महत्व बताते हैं, जिससे पूर्वी रक्षक समझ पाते हैं कि क्या पास आ रहा है। युद्ध पहले सेनानायक के आसपास के कई निकट सलाहकारों को हटा देता है। उनकी हानि समन्वय बदलती और नील के पहुँचने से पहले प्रहस्त को लगातार अकेला करती है।",
      }, "Reveal the advancing command cluster through Vibhishana's identification, then show its coordination lines breaking as counsellors fall.", ["vibhishana", "prahasta", "nila", "allied-fighters", "lanka-defenders"]),
      beat("nila-stops-prahasta", { en: "Nila stops Prahasta", hi: "नील प्रहस्त को रोकते हैं" }, {
        en: "Prahasta and Nila exchange arrows, rocks, trees, and close blows until Nila kills him with a heavy crag. The eastern sortie loses its centre and retreats. Prahasta's end cannot be reduced to brave loyalty rewarded by honour; it is also the consequence of placing remembered obligation above advice he knew could have prevented the war.",
        hi: "प्रहस्त और नील बाण, शिला, वृक्ष और निकट प्रहारों का आदान-प्रदान करते हैं, फिर नील भारी चट्टान से उसे मारते हैं। पूर्वी अभियान अपना केंद्र खोकर लौटता है। प्रहस्त का अंत सम्मान से पुरस्कृत साहसी निष्ठा भर नहीं; वह उस सलाह से ऊपर पुराने दायित्व रखने का परिणाम भी है जिसे वह युद्ध रोकने योग्य जानता था।",
      }, "End the command cluster at Nila's crag while keeping Prahasta's rejected counsel path visible as the surviving formation withdraws.", ["nila", "prahasta", "allied-fighters", "lanka-defenders", "east-gate"]),
    ],
  ),
  scene(
    "ravana-enters-and-is-sent-back",
    ["ravana", "rama", "lakshmana", "hanuman", "sugriva", "nila", "vibhishana", "lanka-commanders", "chariot", "lanka-gate", "battlefield"],
    { en: "Ravana enters personally, wounds several leaders, and is finally disarmed but deliberately allowed to leave alive.", hi: "रावण स्वयं उतरकर कई सेनानायकों को घायल करता है और अंततः निःशस्त्र होने पर भी जानबूझकर जीवित लौटने दिया जाता है।" },
    [
      beat("the-ruler-takes-the-field", { en: "The ruler takes the field", hi: "शासक स्वयं मैदान में उतरता है" }, {
        en: "Prahasta's death brings Ravana out in person. Before leaving, he sends others back to guard a city whose defences are thinning, showing that the battlefield and the people behind its walls remain connected. Vibhishana identifies the commanders around the royal vehicle so the alliance can meet distinct threats rather than attack an undifferentiated population.",
        hi: "प्रहस्त की मृत्यु रावण को स्वयं मैदान में लाती है। निकलने से पहले वह कुछ लोगों को पतली होती नगर-रक्षा संभालने लौटाता है, जिससे युद्धभूमि और दीवारों के पीछे के लोग जुड़े दिखते हैं। विभीषण राजकीय वाहन के आसपास के सेनानायकों की पहचान कराते हैं ताकि मित्र-दल बेपहचान आबादी पर नहीं, अलग खतरों पर उत्तर दे सके।",
      }, "Separate named military nodes around Ravana's vehicle from civilian lights behind the walls, preserving the city's internal distinction.", ["ravana", "vibhishana", "lanka-commanders", "lanka-civilians", "chariot"]),
      beat("admiration-does-not-remove-danger", { en: "Admiration does not remove danger", hi: "प्रभाव खतरा नहीं मिटाता" }, {
        en: "Rama sees Ravana's splendour, bearing, and command, and acknowledges how formidable he appears. Recognition of ability does not excuse abduction or the war maintained to preserve it. The same figure can be impressive in presence and responsible for destructive choices; refusing either fact would flatten the encounter.",
        hi: "राम रावण का वैभव, व्यक्तित्व और कमान देखकर मानते हैं कि वह कितना प्रबल दिखाई देता है। क्षमता की पहचान अपहरण या उसे बनाए रखने वाले युद्ध को उचित नहीं करती। वही व्यक्ति उपस्थिति में प्रभावशाली और विनाशकारी निर्णयों का जिम्मेदार हो सकता है; किसी एक तथ्य को नकारना संघर्ष को सपाट कर देगा।",
      }, "Let Ravana's visual scale and command network impress without bright moral elevation, while the abduction and siege consequence lines remain attached.", ["rama", "ravana", "sita", "battlefield", "lanka"]),
      beat("the-fight-passes-through-many-bodies", { en: "The fight passes through many bodies", hi: "संघर्ष कई शरीरों से होकर गुजरता है" }, {
        en: "Ravana wounds Sugriva, exchanges force with Hanuman, incapacitates Nila, and meets Lakshmana's arrows before a powerful missile brings Lakshmana down. Ravana cannot carry him away, and Hanuman removes the wounded prince. The sequence depends on rescue, interruption, and shifting capacity rather than isolated duels sealed from one another.",
        hi: "रावण सुग्रीव को घायल करता, हनुमान से बल आजमाता, नील को अक्षम करता और लक्ष्मण के बाण झेलता है; फिर एक शक्तिशाली अस्त्र लक्ष्मण को गिरा देता है। रावण उन्हें उठा नहीं पाता और हनुमान घायल राजकुमार को हटा ले जाते हैं। क्रम एक-दूसरे से कटे द्वंद्वों पर नहीं, बचाव, हस्तक्षेप और बदलती क्षमता पर निर्भर है।",
      }, "Carry damage and rescue paths continuously from Sugriva through Nila and Lakshmana, with Hanuman visibly reconnecting the wounded to safety.", ["ravana", "sugriva", "hanuman", "nila", "lakshmana"]),
      beat("rama-refuses-the-easy-ending", { en: "Rama refuses the easy ending", hi: "राम आसान अंत से इनकार करते हैं" }, {
        en: "Rama fights from Hanuman's back, destroys Ravana's vehicle and weapons, and knocks away the crown that marked command. Ravana stands exhausted and exposed. Rama tells him to return, rest, arm himself, and come back. The restraint does not forgive what caused the war; it refuses to make helpless exhaustion the final measure of the opponent.",
        hi: "राम हनुमान की पीठ से युद्ध करते, रावण का वाहन और शस्त्र नष्ट करते तथा कमान का मुकुट गिरा देते हैं। रावण थका और खुला खड़ा है। राम उसे लौटकर विश्राम करने, शस्त्र लेने और फिर आने को कहते हैं। यह संयम युद्ध का कारण क्षमा नहीं करता; वह असहाय थकान को विरोधी का अंतिम माप बनाने से इनकार करता है।",
      }, "Remove vehicle, weapons, and crown one layer at a time, then open a clear retreat corridor instead of triggering an execution finish.", ["rama", "hanuman", "ravana", "chariot", "lanka-gate"]),
    ],
  ),
  scene(
    "lanka-wakes-kumbhakarna",
    ["kumbhakarna", "ravana", "rama", "vibhishana", "lanka-attendants", "allied-fighters", "sleeping-chamber", "lanka-streets", "allied-line", "battlefield"],
    { en: "Lanka wakes its sleeping defender, and Vibhishana must turn an overwhelming silhouette back into a recognisable opponent.", hi: "लंका अपने सोए रक्षक को जगाती है और विभीषण को विशाल छाया को फिर पहचान योग्य विरोधी में बदलना पड़ता है।" },
    [
      beat("humiliation-returns-to-the-palace", { en: "Humiliation returns to the palace", hi: "अपमान महल लौटता है" }, {
        en: "Ravana enters Lanka without vehicle, weapons, or crown and remembers warnings that a human could pierce the protections he trusted. He also recalls curses linked to assaults against women. The memories bring fear, but not yet accountability sufficient to return Sita; he turns instead toward the immense power of his sleeping brother.",
        hi: "रावण बिना वाहन, शस्त्र और मुकुट के लंका लौटता है तथा याद करता है कि जिस सुरक्षा पर उसे भरोसा था उसे मनुष्य भेद सकता है। उसे स्त्रियों के विरुद्ध आक्रमणों से जुड़े शाप भी याद आते हैं। स्मृतियाँ भय लाती हैं, पर सीता लौटाने योग्य उत्तरदायित्व नहीं; वह अपने सोए भाई की विशाल शक्ति की ओर मुड़ता है।",
      }, "Follow the stripped command symbols into the palace, then connect Ravana's fear to the sealed sleeping chamber rather than to restitution.", ["ravana", "sita", "kumbhakarna", "sleeping-chamber"]),
      beat("a-city-tries-to-wake-one-body", { en: "A city tries to wake one body", hi: "एक नगर एक शरीर को जगाने लगता है" }, {
        en: "Large groups carry food, make noise, strike instruments, push, pull, and finally drive elephants across the sleeping Kumbhakarna. The scale can become comic or grotesque, but the essential movement is civic and military desperation concentrated on one body. Lanka has reached a point where ordinary command seems unable to protect it without waking a force even its own people fear.",
        hi: "बड़े दल भोजन लाते, शोर करते, वाद्य बजाते, धक्का देते, खींचते और अंत में सोए कुंभकर्ण पर हाथी चलाते हैं। विशालता हास्य या विकृति बन सकती है, पर मूल गति एक शरीर पर केंद्रित नागरिक और सैन्य निराशा है। लंका उस बिंदु पर है जहाँ सामान्य कमान अपने लोगों के डर वाले बल को जगाए बिना रक्षा करने में असमर्थ लगती है।",
      }, "Show many small coordinated labour paths around the sleeper, emphasising collective desperation and avoiding humiliating body spectacle.", ["kumbhakarna", "lanka-attendants", "battlefield-animals", "sleeping-chamber"]),
      beat("hunger-wakes-before-information", { en: "Hunger wakes before information", hi: "जानकारी से पहले भूख जागती है" }, {
        en: "Kumbhakarna rises, eats the prepared food, and asks why he has been awakened outside the expected time. Before hearing Ravana directly, he receives a compressed account of mortal danger and immediately promises destruction. His first response is therefore shaped by urgency, appetite, and incomplete briefing rather than deliberation about how the crisis began.",
        hi: "कुंभकर्ण उठकर रखा भोजन खाता और पूछता है कि उसे तय समय से पहले क्यों जगाया गया। रावण से सीधे सुनने से पहले उसे मृत्यु-संकट का संक्षिप्त वृत्तांत मिलता है और वह तुरंत विनाश का वचन देता है। उसका पहला उत्तर संकट की शुरुआत पर विचार से नहीं, तात्कालिकता, भूख और अधूरी जानकारी से बनता है।",
      }, "Let the emergency briefing arrive as a narrow partial path while the missing cause and Sita connections remain outside Kumbhakarna's first view.", ["kumbhakarna", "lanka-attendants", "ravana", "sita"]),
      beat("vibhishana-gives-fear-a-name", { en: "Vibhishana gives fear a name", hi: "विभीषण भय को नाम देते हैं" }, {
        en: "When the enormous figure appears, allied fighters scatter before any close engagement. Vibhishana explains who Kumbhakarna is, distinguishes inherited claims about origin and appetite from the immediate tactical problem, and suggests calling him a constructed engine to reduce panic. The label is a calming device, not permission to deny his personhood or choices.",
        hi: "विशाल आकृति दिखते ही निकट संघर्ष से पहले मित्र-योद्धा बिखरते हैं। विभीषण बताते हैं कि कुंभकर्ण कौन है, उत्पत्ति और भूख के पुराने दावों को तत्काल सैन्य समस्या से अलग करते और भय घटाने के लिए उसे निर्मित यंत्र कहने का सुझाव देते हैं। यह नाम शांत करने का उपाय है, उसकी मनुष्यता या चुनाव नकारने की अनुमति नहीं।",
      }, "Replace one overwhelming silhouette with named scale, route, reach, and vulnerable approach information while retaining Kumbhakarna's agency.", ["vibhishana", "kumbhakarna", "rama", "allied-fighters", "allied-line"]),
    ],
  ),
  scene(
    "kumbhakarna-names-the-failure",
    ["kumbhakarna", "ravana", "mahodara", "sita", "vibhishana", "council-chamber", "ashoka-grove", "lanka", "treasury", "battlefield"],
    { en: "Kumbhakarna diagnoses Ravana's failure accurately, then chooses a loyalty that will sustain it while Mahodara offers coercive deception.", hi: "कुंभकर्ण रावण की विफलता सही पहचानता है, फिर उसे बनाए रखने वाली निष्ठा चुनता है और महोदर दबावपूर्ण छल सुझाता है।" },
    [
      beat("ravana-admits-what-lanka-has-lost", { en: "Ravana admits what Lanka has lost", hi: "रावण लंका की हानि स्वीकार करता है" }, {
        en: "Ravana tells Kumbhakarna that leading commanders are dead, the treasury is depleted, and much of the city now consists of young and old people rather than ready fighters. The admission makes the civilian condition visible. His request for rescue is not only about royal honour; a whole city has been made vulnerable by choices its residents did not control.",
        hi: "रावण कुंभकर्ण को बताता है कि प्रमुख सेनानायक मारे गए, कोष घट गया और नगर का बड़ा हिस्सा अब तैयार योद्धाओं के बजाय बच्चों और बुजुर्गों का है। यह स्वीकारोक्ति नागरिक दशा को दृश्य बनाती है। बचाव की माँग केवल राजकीय सम्मान की नहीं; पूरा नगर उन निर्णयों से असुरक्षित हुआ जिन्हें निवासियों ने नियंत्रित नहीं किया।",
      }, "Reveal depleted command, treasury, and defence layers while young and elderly civilian lights remain protected from combat targeting.", ["ravana", "kumbhakarna", "lanka-civilians", "treasury", "lanka"]),
      beat("kumbhakarna-reconstructs-the-mistake", { en: "Kumbhakarna reconstructs the mistake", hi: "कुंभकर्ण गलती का क्रम फिर बनाता है" }, {
        en: "Kumbhakarna says action should follow deliberation, timing, and sound counsel, but Ravana reversed the order and insulted people who warned him. He specifically confirms that Vibhishana's advice was beneficial. The diagnosis is powerful because it identifies process, pride, and rejected correction rather than blaming fate for a disaster produced by decisions.",
        hi: "कुंभकर्ण कहता है कि काम विचार, समय और सही सलाह के बाद होना चाहिए, पर रावण ने क्रम उलट दिया और चेताने वालों का अपमान किया। वह स्पष्ट मानता है कि विभीषण की सलाह हितकारी थी। उसका विश्लेषण प्रभावी है, क्योंकि वह निर्णयों से बने संकट के लिए भाग्य को दोष देने के बजाय प्रक्रिया, गर्व और ठुकराए सुधार को पहचानता है।",
      }, "Rebuild the failed decision chain in visible order—act, conceal, reject counsel, escalate—then place the safer sequence beside it.", ["kumbhakarna", "ravana", "vibhishana", "sita"]),
      beat("friendship-is-asked-to-carry-the-wrong", { en: "Friendship is asked to carry the wrong", hi: "मित्रता से गलत निर्णय उठाने को कहा जाता है" }, {
        en: "Ravana refuses further discussion of what has already happened and says a true friend helps someone who has fallen into difficulty. Kumbhakarna accepts the appeal and promises to kill Rama, though his own reasoning has shown why the war should not exist. Affection and loyalty become morally dangerous when they protect a loved person from the consequences of continuing harm.",
        hi: "रावण बीती गलती पर और चर्चा से इनकार करके कहता है कि सच्चा मित्र संकट में पड़े व्यक्ति की सहायता करता है। कुंभकर्ण यह अपील स्वीकार कर राम को मारने का वचन देता है, जबकि उसका अपना तर्क दिखा चुका है कि युद्ध होना ही नहीं चाहिए था। प्रेम और निष्ठा तब नैतिक रूप से खतरनाक बनते हैं जब वे प्रिय व्यक्ति को जारी हानि के परिणामों से बचाते हैं।",
      }, "Show the affection bond bending Kumbhakarna away from his own corrective path and toward the battlefield without erasing either connection.", ["kumbhakarna", "ravana", "rama", "sita", "battlefield"]),
      beat("mahodara-proposes-another-false-death", { en: "Mahodara proposes another false death", hi: "महोदर फिर झूठी मृत्यु का प्रस्ताव देता है" }, {
        en: "Mahodara suggests that several commanders return bloodied, announce that Rama and Lakshmana have been eaten, stage public celebration, and use Sita's grief to pressure her into submission. The plan is coercive deception built on a contemptuous claim about women's judgment. Kumbhakarna rejects it; the proposal must not be admired as clever court strategy.",
        hi: "महोदर सुझाता है कि कई सेनानायक रक्त से सने लौटें, राम-लक्ष्मण के खाए जाने की घोषणा करें, सार्वजनिक उत्सव रचें और सीता के शोक से उन्हें समर्पण के लिए दबाएँ। योजना स्त्रियों के निर्णय पर तिरस्कारपूर्ण धारणा से बना दबावपूर्ण छल है। कुंभकर्ण इसे ठुकराता है; इसे चतुर दरबारी नीति की तरह नहीं सराहा जा सकता।",
      }, "Expose the proposed false announcement, staged celebration, and coercion links as a manipulation map, then sever them at Kumbhakarna's refusal.", ["mahodara", "kumbhakarna", "ravana", "sita", "ashoka-grove"]),
    ],
  ),
  scene(
    "the-army-flees-and-returns",
    ["kumbhakarna", "mahodara", "ravana", "angada", "hanuman", "sugriva", "allied-fighters", "lanka-defenders", "lanka-gate", "battlefield", "retreat-lines"],
    { en: "Kumbhakarna goes out despite recognising misplaced blame, and the allied ranks rebuild courage after an initial flight.", hi: "गलत दोष पहचानने के बावजूद कुंभकर्ण निकलता है और प्रारंभिक भगदड़ के बाद मित्र-दल साहस फिर बनाता है।" },
    [
      beat("kumbhakarna-rejects-the-flatterers", { en: "Kumbhakarna rejects the flatterers", hi: "कुंभकर्ण चापलूसों को ठुकराता है" }, {
        en: "Kumbhakarna calls Mahodara and similar counsellors flattering cowards whose advice helped ruin Lanka. He chooses open combat over deception, but that contrast does not make his choice harmless. He is still using honest courage to defend Ravana's refusal and to extend a war he has correctly diagnosed.",
        hi: "कुंभकर्ण महोदर और ऐसे सलाहकारों को चापलूस कायर कहता है जिनकी सलाह ने लंका को बिगाड़ा। वह छल के बजाय खुले युद्ध को चुनता है, पर यह अंतर उसके चुनाव को अहानिकर नहीं बनाता। वह अब भी ईमानदार साहस से रावण के इनकार की रक्षा और सही पहचाने युद्ध को लंबा कर रहा है।",
      }, "Close the deception route but keep the battlefield route connected to the same unresolved abduction and rejected restitution.", ["kumbhakarna", "mahodara", "ravana", "sita"]),
      beat("he-knows-who-did-not-wrong-lanka", { en: "He knows who did not wrong Lanka", hi: "वह जानता है कि किसने लंका का अपकार नहीं किया" }, {
        en: "Before going out, Kumbhakarna says the allied fighters themselves did not injure Lanka and identifies Rama and Lakshmana as the people he intends to reach. The distinction reveals moral awareness, yet his movement soon places the wider army in danger anyway. Knowing who bears responsibility does not excuse force that ignores the boundary.",
        hi: "निकलने से पहले कुंभकर्ण कहता है कि मित्र-योद्धाओं ने स्वयं लंका का अपकार नहीं किया और राम-लक्ष्मण को अपना लक्ष्य बताता है। यह अंतर नैतिक समझ दिखाता है, फिर भी उसकी बढ़त शीघ्र पूरी सेना को संकट में डालती है। जिम्मेदारी किसकी है जानना उस बल को उचित नहीं करता जो सीमा भूल जाए।",
      }, "Highlight Rama and Lakshmana as his declared route while thousands of unrelated fighters remain visibly exposed between him and that destination.", ["kumbhakarna", "rama", "lakshmana", "allied-fighters", "lanka-gate"]),
      beat("the-line-breaks-before-contact", { en: "The line breaks before contact", hi: "संपर्क से पहले ही पंक्ति टूटती है" }, {
        en: "Kumbhakarna's scale, sound, and remembered reputation make fighters flee before he reaches them. The retreat is an intelligible survival response, not proof of defective character. People are trying to preserve life against a danger they cannot yet measure, while commanders must create enough shared orientation for any collective response to become possible.",
        hi: "कुंभकर्ण का आकार, ध्वनि और पुरानी ख्याति उसके पहुँचने से पहले योद्धाओं को भागने पर मजबूर करती है। पीछे हटना जीवन बचाने की समझने योग्य प्रतिक्रिया है, चरित्र-दोष का प्रमाण नहीं। लोग ऐसे खतरे से जीवन बचा रहे हैं जिसे अभी माप नहीं सकते, जबकि सेनानायकों को सामूहिक उत्तर के लिए पर्याप्त साझा दिशा बनानी है।",
      }, "Open many legitimate survival routes away from the advancing scale, avoiding ridicule and showing commanders searching for a stable rally point.", ["kumbhakarna", "allied-fighters", "angada", "hanuman", "sugriva"]),
      beat("angada-changes-the-rally", { en: "Angada changes the rally", hi: "अंगद की पुकार बदलती है" }, {
        en: "Angada first tries to stop the flight with shame, fear of ridicule at home, and promises of honour in death. Those appeals risk treating people as expendable and their loved ones as instruments of pressure. As the ranks return, courage is better sustained through shared position, numbers, leadership, and the possibility that coordinated action can protect one another.",
        hi: "अंगद पहले लज्जा, घर में उपहास के डर और मृत्यु में सम्मान के वादे से भगदड़ रोकने की कोशिश करते हैं। ये अपील लोगों को खर्च योग्य और प्रियजनों को दबाव का साधन बना सकती हैं। दल लौटते हैं तो साहस साझा स्थिति, संख्या, नेतृत्व और इस संभावना से बेहतर टिकता है कि समन्वित कार्रवाई एक-दूसरे की रक्षा कर सकती है।",
      }, "Let shame-based pulses fade and replace them with visible mutual-protection links, stable formations, and reversible fallback routes.", ["angada", "allied-fighters", "hanuman", "sugriva", "kumbhakarna"]),
    ],
  ),
  scene(
    "kumbhakarna-falls",
    ["kumbhakarna", "sugriva", "hanuman", "angada", "lakshmana", "rama", "allied-fighters", "lanka-defenders", "lanka-streets", "lanka-gate", "sea"],
    { en: "Kumbhakarna's overwhelming advance ends only after capture, escape, failed containment, and a final confrontation with Rama.", hi: "कुंभकर्ण की प्रचंड बढ़त पकड़, पलायन, विफल रोकथाम और राम के अंतिम सामना के बाद ही समाप्त होती है।" },
    [
      beat("formation-after-formation-breaks", { en: "Formation after formation breaks", hi: "एक के बाद एक गठन टूटता है" }, {
        en: "Dwivida, Hanuman, Nila, Rishabha, Sarabha, Gavaksha, Gandhamadana, Angada, and many unnamed fighters attack in succession or together. Some wound Kumbhakarna; many are thrown down or disabled. The repeated efforts are not disposable attempts before a final hero arrives. Each buys time, changes his condition, and carries a cost borne by a connected army.",
        hi: "द्विविद, हनुमान, नील, ऋषभ, शरभ, गवाक्ष, गंधमादन, अंगद और अनेक अनाम योद्धा क्रम से या साथ आक्रमण करते हैं। कुछ कुंभकर्ण को घायल करते हैं; कई गिराए या अक्षम किए जाते हैं। ये अंतिम नायक से पहले खर्च होने वाले प्रयास नहीं। हर कोशिश समय खरीदती, उसकी दशा बदलती और जुड़े हुए दल द्वारा उठाई कीमत छोड़ती है।",
      }, "Keep every fallen formation and the time it purchased visible as later groups enter, preventing earlier efforts from disappearing.", ["kumbhakarna", "hanuman", "angada", "allied-fighters", "lanka-defenders"]),
      beat("sugriva-is-carried-into-lanka", { en: "Sugriva is carried into Lanka", hi: "सुग्रीव को लंका के भीतर ले जाया जाता है" }, {
        en: "Kumbhakarna knocks Sugriva unconscious, lifts him, and carries him through the gate as a living prize. Hanuman considers an immediate rescue, then waits because Sugriva may recover and act for himself; meanwhile he steadies the leaderless ranks. The choice balances urgent care with another person's agency instead of assuming rescue must always replace it.",
        hi: "कुंभकर्ण सुग्रीव को अचेत करके उठाता और जीवित विजय-चिह्न की तरह द्वार के भीतर ले जाता है। हनुमान तत्काल बचाव सोचते हैं, फिर रुकते हैं क्योंकि सुग्रीव होश पाकर स्वयं कार्य कर सकते हैं; इस बीच वे नेता-विहीन दल संभालते हैं। चुनाव तत्काल देखभाल और दूसरे की क्षमता में संतुलन रखता है, यह नहीं मानता कि बचाव हमेशा उसे बदल दे।",
      }, "Track Sugriva through the gate while Hanuman holds both a possible rescue path and the collapsing army network without closing either too soon.", ["sugriva", "kumbhakarna", "hanuman", "allied-fighters", "lanka-gate"]),
      beat("sugriva-creates-his-own-escape", { en: "Sugriva creates his own escape", hi: "सुग्रीव अपना पलायन स्वयं बनाते हैं" }, {
        en: "Cold air and city noise revive Sugriva. He injures Kumbhakarna's face and sides, breaks free, and leaps back across the gate to Rama. Kumbhakarna returns enraged and increasingly unable to distinguish allied fighter from Lanka defender, consuming and crushing people from both groups. His power has begun to destroy the very side he chose to protect.",
        hi: "ठंडी हवा और नगर की ध्वनि सुग्रीव को होश देती है। वे कुंभकर्ण के चेहरे और बगल घायल करके छूटते और द्वार लाँघकर राम के पास लौटते हैं। क्रोधित कुंभकर्ण वापस आता है और मित्र-योद्धा तथा लंका-रक्षक में अंतर खोकर दोनों पक्षों के लोगों को कुचलने लगता है। उसकी शक्ति उसी पक्ष को नष्ट करने लगी है जिसकी रक्षा उसने चुनी थी।",
      }, "Give Sugriva control of the escape path, then scramble Kumbhakarna's friend-and-opponent recognition as harm spreads across both formations.", ["sugriva", "kumbhakarna", "rama", "allied-fighters", "lanka-defenders", "lanka-streets"]),
      beat("rama-stops-what-can-no-longer-stop-itself", { en: "Rama stops what can no longer stop itself", hi: "राम उस गति को रोकते हैं जो स्वयं नहीं रुक सकती" }, {
        en: "Lakshmana meets Kumbhakarna first and receives his acknowledgement before directing him toward Rama. Rama removes weapon and limbs as the advance continues, then uses a final missile to end it. The falling body damages Lanka's gate and the sea below. Relief follows, but it shares the field with crushed allies, defenders, animals, buildings, and a brother whose clear warning could not govern his loyalty.",
        hi: "लक्ष्मण पहले कुंभकर्ण का सामना करते और उसकी स्वीकृति पाते हैं, फिर उसे राम की ओर भेजते हैं। बढ़त जारी रहने पर राम शस्त्र और अंग रोकते हुए अंत में निर्णायक अस्त्र चलाते हैं। गिरता शरीर लंका के द्वार और नीचे समुद्र को नुकसान पहुँचाता है। राहत आती है, पर वह कुचले साथियों, रक्षकों, पशुओं, भवनों और उस भाई के साथ मैदान बाँटती है जिसकी स्पष्ट चेतावनी उसकी निष्ठा को नियंत्रित न कर सकी।",
      }, "End the advance through staged loss of reach and movement, then preserve damage on both sides and inside Lanka instead of a clean boss-defeat arena.", ["lakshmana", "rama", "kumbhakarna", "allied-fighters", "lanka-defenders", "lanka-gate", "sea"]),
    ],
  ),
  scene(
    "grief-sends-the-next-generation-out",
    ["ravana", "kumbhakarna", "vibhishana", "trishira", "atikaya", "narantaka", "devantaka", "mahodara", "angada", "hanuman", "nila", "rishabha", "lanka-court", "battlefield"],
    { en: "Ravana recognises part of his responsibility in grief, yet the court converts bereavement into another sortie and more family loss.", hi: "रावण शोक में अपनी कुछ जिम्मेदारी पहचानता है, फिर भी सभा वियोग को अगले अभियान और अधिक पारिवारिक हानि में बदल देती है।" },
    [
      beat("ravana-loses-his-right-arm", { en: "Ravana loses his right arm", hi: "रावण अपना दाहिना हाथ खो देता है" }, {
        en: "The report of Kumbhakarna's death makes Ravana collapse. He calls his brother his right arm and says empire and even Sita no longer seem useful without him. The grief is sincere, not a trick, and it reveals relationship beneath command. Sincerity, however, does not cancel the coercion and refusal that placed Kumbhakarna on the field.",
        hi: "कुंभकर्ण की मृत्यु का समाचार रावण को गिरा देता है। वह भाई को अपना दाहिना हाथ कहता और बोलता है कि उसके बिना राज्य तथा सीता भी उपयोगी नहीं लगते। शोक सच्चा है, छल नहीं, और कमान के नीचे संबंध खोलता है। फिर भी सच्चाई उस दबाव और इनकार को नहीं मिटाती जिसने कुंभकर्ण को युद्ध में उतारा।",
      }, "Collapse Ravana's command network into a private brother connection while keeping the causal path from abduction to battle intact.", ["ravana", "kumbhakarna", "sita", "lanka-court"]),
      beat("rejected-counsel-returns-too-late", { en: "Rejected counsel returns too late", hi: "ठुकराई सलाह बहुत देर से लौटती है" }, {
        en: "In grief, Ravana says Vibhishana's advice was beneficial and that his own conduct has brought disaster. This recognition matters because it names causation rather than fate. Yet insight after irreversible loss cannot restore the dead, and it will remain incomplete unless it changes the next decision about Sita, the city, and continued war.",
        hi: "शोक में रावण कहता है कि विभीषण की सलाह हितकारी थी और उसके अपने आचरण ने विनाश लाया। यह पहचान महत्वपूर्ण है, क्योंकि वह भाग्य के बजाय कारण का नाम लेती है। फिर भी अपरिवर्तनीय हानि के बाद समझ मृतकों को लौटा नहीं सकती और सीता, नगर तथा जारी युद्ध पर अगला निर्णय बदले बिना अधूरी रहती है।",
      }, "Reconnect Vibhishana's rejected advice to Ravana only after the loss, then leave the restitution route visibly open and unchosen.", ["ravana", "vibhishana", "kumbhakarna", "sita", "lanka"]),
      beat("trishira-turns-grief-outward", { en: "Trishira turns grief outward", hi: "त्रिशिरा शोक को बाहर की ओर मोड़ता है" }, {
        en: "Trishira tells Ravana that a ruler of great power should not remain overcome and offers to lead a new attack with brothers and senior companions. The intervention restores court movement, but it channels bereavement directly into retaliation. Younger relatives inherit not only weapons and names, but an unresolved decision that the grieving ruler has momentarily understood and still does not reverse.",
        hi: "त्रिशिरा रावण से कहता है कि महान शक्ति वाला शासक टूटकर न रहे और भाइयों तथा वरिष्ठ साथियों के साथ नया आक्रमण करने को आगे आता है। हस्तक्षेप सभा को गति देता है, पर वियोग को सीधे प्रतिशोध में मोड़ देता है। युवा संबंधी केवल शस्त्र और नाम नहीं, वह अनसुलझा निर्णय भी पाते हैं जिसे शोकग्रस्त शासक क्षण भर समझकर भी नहीं पलटता।",
      }, "Send grief from the collapsed ruler into branching routes toward younger relatives, showing inheritance of an unresolved decision rather than destiny.", ["trishira", "ravana", "atikaya", "narantaka", "devantaka", "mahodara"]),
      beat("another-family-line-is-cut", { en: "Another family line is cut", hi: "एक और पारिवारिक पंक्ति कटती है" }, {
        en: "Narantaka charges through many fighters before Angada stops him. Devantaka, Mahodara, Trishira, and another close companion then enter successive clashes with Angada, Hanuman, Nila, and Rishabha and are killed. The inherited wording is not always consistent about every name, so the essential outcome is kept without false precision: grief has sent another connected family group into a field that returns more grief.",
        hi: "नरांतक अनेक योद्धाओं के बीच बढ़ता है और अंगद उसे रोकते हैं। फिर देवांतक, महोदर, त्रिशिरा और एक निकट साथी अंगद, हनुमान, नील तथा ऋषभ से क्रमिक संघर्ष में उतरकर मारे जाते हैं। पुराने वर्णन में हर नाम हमेशा एक जैसा नहीं मिलता, इसलिए झूठी सटीकता के बिना मूल परिणाम रखा जाता है—शोक ने एक और जुड़े परिवार-दल को ऐसे मैदान में भेजा जो और शोक लौटाता है।",
      }, "Map the successive clashes as a family network contracting on one side and an accumulating casualty field on both, with uncertain naming marked quietly.", ["narantaka", "devantaka", "mahodara", "trishira", "angada", "hanuman", "nila", "rishabha"]),
    ],
  ),
];
