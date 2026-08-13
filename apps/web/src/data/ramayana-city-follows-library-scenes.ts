import type { StoryBeat, StoryMoment } from "@/lib/domain/story-world";
import type { RamayanaLibraryScene } from "./ramayana-thin-turn-library-scenes";

const b = (id: string, en: string, hi: string, enText: string, hiText: string, visualCue: string, characterIds: string[]): StoryBeat => ({
  id,
  title: { en, hi },
  narration: { en: enText, hi: hiText },
  visualCue,
  characterIds,
});

const s = (
  id: string,
  detailOrdinal: number,
  sourceOrdinal: number,
  sourceGlobalOrdinal: number,
  spanSha256: string,
  title: { en: string; hi: string },
  synopsis: { en: string; hi: string },
  places: string[],
  nodeIds: string[],
  beats: StoryBeat[],
): RamayanaLibraryScene => ({
  id,
  turnId: "road-out-of-ayodhya",
  detailOrdinal,
  title,
  synopsis,
  sourceStart: sourceOrdinal,
  sourceEnd: sourceOrdinal,
  sourceGlobalOrdinal,
  spanSha256s: [spanSha256],
  nodeIds,
  places,
  moment: { id, decisiveChange: synopsis, beats } satisfies StoryMoment,
});

export const RAMAYANA_CITY_FOLLOWS_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  s(
    "ayodhya-feels-the-departure",
    1,
    41,
    116,
    "9307ec50b71893a72c5f700502a9bf55883b6d2f43d1d05adbae89ae504bbec1",
    { en: "Ayodhya feels the departure", hi: "अयोध्या प्रस्थान का आघात महसूस करती है" },
    {
      en: "The travellers pass beyond the city while palace women, households, streets, animals, and the epic sky all register a rupture that no longer belongs only to the royal family.",
      hi: "यात्री नगर से बाहर जाते हैं और महल की स्त्रियाँ, घर-परिवार, गलियाँ, पशु तथा महाकाव्य का आकाश भी उस टूटन को व्यक्त करते हैं जो अब केवल राजपरिवार की नहीं रही।",
    },
    ["Ayodhya palace", "Ayodhya streets", "City gate", "The departing road"],
    ["ayodhya", "rama", "sita", "lakshmana", "palace-women", "ayodhya-citizens", "city-follows-car-event"],
    [
      b("palace-women-ask-where-their-refuge-goes", "Palace women ask where their refuge goes", "महल की स्त्रियाँ पूछती हैं कि उनका सहारा कहाँ जा रहा है", "As Rama leaves, women throughout the inner apartments cry out for the person they remember as a refuge for people without power or protection. They name his restraint when falsely accused and his habit of calming anger rather than feeding it. Their lament turns an official exile into the loss of relationships built through daily conduct.", "राम के जाते ही अंतःपुर की स्त्रियाँ उस व्यक्ति के लिए पुकारती हैं जिसे वे निर्बल और असहाय लोगों का सहारा मानती रही हैं। वे झूठे आरोप पर भी उनके संयम और क्रोध को बढ़ाने के बजाय शांत करने की आदत को याद करती हैं। उनका विलाप राजकीय वनवास को रोज़मर्रा के आचरण से बने संबंधों की हानि में बदल देता है।", "Let distinct voices rise from separate balconies and corridors until the palace itself seems to speak across the departing road.", ["rama", "palace-women", "kausalya", "kaikeyi"]),
      b("the-queens-grief-reaches-dasharatha", "The queens' grief reaches Dasharatha", "रानियों का शोक दशरथ तक पहुँचता है", "The queens ask why a truthful protector has been sent away and compare their grief to cows separated from calves. Their collective cry reaches Dasharatha, already burning with sorrow for his son, and deepens the collapse inside the palace even as the travellers continue farther from its walls.", "रानियाँ पूछती हैं कि सत्यनिष्ठ रक्षक को क्यों भेज दिया गया और अपने शोक को बछड़ों से अलग की गई गायों की पीड़ा से जोड़ती हैं। उनकी सामूहिक पुकार पहले से पुत्र-वियोग में जल रहे दशरथ तक पहुँचती है और महल के भीतर टूटन को और गहरा करती है, जबकि यात्री उसकी दीवारों से दूर होते जाते हैं।", "Carry the sound from the women's quarters to the king, while the chariot becomes smaller beyond the gate.", ["palace-women", "king-dasharatha", "rama"]),
      b("ordinary-routines-stop-across-the-city", "Ordinary routines stop across the city", "नगर की सामान्य दिनचर्या रुक जाती है", "Meals, rest, trade, animal care, and household attention falter as people turn their thoughts toward Rama. Travellers show no delight and friends abandon sleep. The city-wide pause gives the departure social scale: political decisions have entered kitchens, markets, stables, roads, and private bonds.", "भोजन, विश्राम, व्यापार, पशुओं की देखभाल और घरों का ध्यान डगमगा जाता है क्योंकि लोगों के मन राम की ओर लगे हैं। राहगीरों में आनंद नहीं और मित्रों की नींद छूट जाती है। यह नगरव्यापी ठहराव प्रस्थान का सामाजिक विस्तार दिखाता है—राजकीय निर्णय रसोई, बाज़ार, अस्तबल, राह और निजी संबंधों में उतर आया है।", "Darken kitchens, stalls, courtyards, and stables one by one instead of reducing Ayodhya to a single grieving crowd.", ["ayodhya-citizens", "rama", "households", "animals"]),
      b("the-epic-sky-mirrors-ayodhya", "The epic sky mirrors Ayodhya", "महाकाव्य का आकाश अयोध्या का शोक प्रतिबिंबित करता है", "The telling surrounds Ayodhya with dim stars, troubled planets, dark directions, unsettled clouds, and a world deprived of ordinary warmth. This is the epic narrator's way of enlarging grief, not a modern astronomical report or evidence that a city's sorrow alters measurable celestial events.", "कथा अयोध्या को फीके तारों, अशांत ग्रहों, अँधेरी दिशाओं, विचलित बादलों और सामान्य ऊष्मा से वंचित संसार से घेर देती है। यह शोक को विराट बनाने वाली महाकाव्य-कथन शैली है, आधुनिक खगोलीय रिपोर्ट या इस बात का प्रमाण नहीं कि नगर का दुःख मापे जा सकने वाले आकाशीय घटनाक्रम बदल देता है।", "Layer the darkened epic sky over the shaken city while keeping it visibly within the storytelling world.", ["ayodhya", "ayodhya-citizens", "epic-sky", "rama"]),
    ],
  ),
  s(
    "dasharatha-loses-the-dust-trail",
    2,
    42,
    117,
    "299def199f61a16f5a9d5013786dbcf73537e22479434d79762bbeb03ec83240",
    { en: "Dasharatha loses the dust trail", hi: "दशरथ की आँखों से रथ की धूल ओझल होती है" },
    {
      en: "Dasharatha watches until the last dust disappears, collapses on the road, rejects Kaikeyi's touch, imagines the travellers' first hardship, and enters a palace that now feels emptied of its future.",
      hi: "दशरथ अंतिम धूल ओझल होने तक देखते हैं, राह पर गिर पड़ते हैं, कैकेयी का स्पर्श अस्वीकार करते हैं, यात्रियों की पहली कठिनाइयों की कल्पना करते हैं और ऐसे महल में लौटते हैं जिसका भविष्य रिक्त लगता है।",
    },
    ["Ayodhya gate", "Chariot track", "Kausalya's apartments", "The empty palace"],
    ["king-dasharatha", "kausalya", "kaikeyi", "rama", "sita", "lakshmana", "ayodhya"],
    [
      b("dasharatha-watches-until-even-dust-is-gone", "Dasharatha watches until even dust is gone", "दशरथ तब तक देखते हैं जब तक धूल भी ओझल नहीं हो जाती", "Dasharatha keeps his eyes fixed on the departing car, rising on his toes while Rama remains visible. When even the dust raised by its wheels vanishes, his body gives way and he falls to the ground. Kausalya takes one arm while Kaikeyi approaches the other, placing the family conflict in the same physical frame.", "दशरथ जाते रथ पर आँखें टिकाए रखते हैं और राम दिखाई देते रहने तक पंजों पर उठकर देखते हैं। पहियों की उठी धूल भी ओझल होते ही उनका शरीर जवाब दे देता है और वे धरती पर गिर पड़ते हैं। कौसल्या एक बाँह थामती हैं और कैकेयी दूसरी ओर आती हैं, जिससे पारिवारिक संघर्ष उसी शारीरिक क्षण में सामने आ जाता है।", "Hold the king's gaze on a shrinking dust line, then drop the horizon away as Kausalya and Kaikeyi reach him from opposite sides.", ["king-dasharatha", "kausalya", "kaikeyi", "rama"]),
      b("dasharatha-rejects-kaikeyis-touch", "Dasharatha rejects Kaikeyi's touch", "दशरथ कैकेयी का स्पर्श अस्वीकार करते हैं", "Dasharatha tells Kaikeyi not to touch him and renounces their marital bond in the fury of the moment. He also declares that Bharata's future funeral offerings should not reach him if Bharata accepts the kingdom. The words show grief hardening into rejection; they do not establish Bharata's knowledge, consent, or guilt.", "दशरथ कैकेयी से कहते हैं कि वे उन्हें न छुएँ और उस उग्र क्षण में अपने वैवाहिक संबंध का त्याग घोषित करते हैं। वे यह भी कहते हैं कि यदि भरत राज्य स्वीकार करें तो भविष्य में उनके द्वारा दिए गए श्राद्ध-अर्पण उन तक न पहुँचें। ये शब्द शोक को अस्वीकार में कठोर होते दिखाते हैं; वे भरत की जानकारी, सहमति या दोष सिद्ध नहीं करते।", "Keep Bharata absent from the confrontation while Dasharatha's words strike through the space between the two queens.", ["king-dasharatha", "kaikeyi", "kausalya", "bharata"]),
      b("the-king-imagines-the-first-forest-night", "The king imagines the first forest night", "राजा पहली वन-रात की कल्पना करते हैं", "Following the wheel tracks, Dasharatha imagines Rama sleeping beneath a tree instead of on a prepared bed and Sita meeting thorns, fatigue, and frightening animal calls far from familiar shelter. His imagination cannot recover the travellers, but it makes the distance concrete through the comforts and safety he believes they have lost.", "रथचिह्नों का पीछा करते हुए दशरथ राम को सजी शय्या के बजाय वृक्ष के नीचे सोते और सीता को परिचित आश्रय से दूर काँटों, थकान तथा भयावह पशु-स्वरों का सामना करते हुए कल्पना करते हैं। उनकी कल्पना यात्रियों को लौटा नहीं सकती, पर खोए हुए आराम और सुरक्षा के माध्यम से दूरी को ठोस बना देती है।", "Let the track on the road transform into brief imagined forest images shaped by Dasharatha's fear rather than objective prophecy.", ["king-dasharatha", "rama", "sita", "lakshmana"]),
      b("an-empty-palace-receives-the-king", "An empty palace receives the king", "रिक्त महल राजा को वापस लेता है", "Dasharatha returns through thinned streets and closed stalls, asks to be taken to Kausalya's room, and sees the palace as stripped of two sons and a daughter-in-law. At midnight he says his sight followed Rama and has not returned, then asks Kausalya to touch him because he can no longer see her.", "दशरथ सूनी गलियों और बंद दुकानों के बीच लौटकर कौसल्या के कक्ष में ले जाने को कहते हैं और महल को दो पुत्रों तथा बहू से वंचित देखते हैं। आधी रात वे कहते हैं कि उनकी दृष्टि राम के पीछे चली गई और लौटी नहीं; फिर कौसल्या से उन्हें छूने को कहते हैं क्योंकि वे उन्हें देख नहीं पा रहे।", "Move from the public road into a cavernous dark chamber where touch becomes the king's only remaining point of contact.", ["king-dasharatha", "kausalya", "rama", "sita", "lakshmana"]),
    ],
  ),
  s(
    "kausalya-imagines-return",
    3,
    43,
    118,
    "ad4c045fb8318f2093e365dc369c7463c9dcd0393cd7e82181d93276412d710f",
    { en: "Kausalya imagines both hardship and return", hi: "कौसल्या कठिनाई और वापसी दोनों की कल्पना करती हैं" },
    {
      en: "Beside the stunned king, Kausalya voices anger, imagines the travellers' forest hardship in detail, and keeps reaching toward a future homecoming even while saying she cannot bear the present absence.",
      hi: "स्तब्ध राजा के पास कौसल्या क्रोध व्यक्त करती हैं, यात्रियों की वन-कठिनाइयों की विस्तार से कल्पना करती हैं और वर्तमान वियोग असह्य बताते हुए भी भविष्य की घर-वापसी तक मन पहुँचाती रहती हैं।",
    },
    ["Kausalya's chamber", "Imagined forest road", "Imagined Ayodhya homecoming"],
    ["kausalya", "king-dasharatha", "kaikeyi", "rama", "sita", "lakshmana", "ayodhya"],
    [
      b("kausalya-places-responsibility-in-the-room", "Kausalya places responsibility in the room", "कौसल्या कक्ष में उत्तरदायित्व सामने रखती हैं", "Seeing Dasharatha stunned by grief, Kausalya condemns Kaikeyi's action and tells the king that even a diminished life for Rama inside Ayodhya would have been preferable to sending him away. Her accusations are spoken from injury and fear, but they also refuse to let the exile appear as an impersonal event without decision-makers.", "दशरथ को शोक से स्तब्ध देखकर कौसल्या कैकेयी के कार्य की निंदा करती हैं और राजा से कहती हैं कि अयोध्या के भीतर राम का घटा हुआ जीवन भी उन्हें बाहर भेजने से बेहतर होता। उनके आरोप चोट और भय से निकलते हैं, पर वे वनवास को निर्णय लेने वालों से रहित कोई निरपेक्ष घटना बनने से भी रोकते हैं।", "Keep Kausalya facing Dasharatha in the dark chamber, with Kaikeyi's decision present through memory rather than a new confrontation.", ["kausalya", "king-dasharatha", "kaikeyi", "rama"]),
      b("the-forest-is-imagined-through-lost-comforts", "The forest is imagined through lost comforts", "वन की कल्पना खोए हुए आराम से बनती है", "Kausalya pictures Rama, Sita, and Lakshmana exchanging fine clothing, prepared food, and sheltered youth for roots, fruits, exposure, and unfamiliar hardship. These are a mother's anxious projections from the palace, not proof that she knows each event awaiting them or that Sita and Lakshmana lacked agency in choosing the road.", "कौसल्या राम, सीता और लक्ष्मण को सुंदर वस्त्र, तैयार भोजन तथा सुरक्षित युवावस्था छोड़कर फल-मूल, खुले जीवन और अनजान कठिनाइयों में जाते देखती हैं। ये महल से उठी एक माँ की चिंतित कल्पनाएँ हैं, इस बात का प्रमाण नहीं कि वे आगे की हर घटना जानती हैं या सीता और लक्ष्मण ने राह चुनते समय अपनी इच्छा नहीं जताई।", "Build the imagined forest from absent beds, food, clothing, and shelter while keeping Kausalya visibly as the one imagining it.", ["kausalya", "rama", "sita", "lakshmana"]),
      b("kausalya-builds-a-homecoming-in-questions", "Kausalya builds a homecoming in questions", "कौसल्या प्रश्नों में घर-वापसी रचती हैं", "Her lament repeatedly asks when Ayodhya will raise standards and garlands again, when thousands will welcome the returning car, and when Rama, Sita, and Lakshmana will cross the palace threshold. Each question temporarily creates a route back through the same city that has just watched them leave.", "उनका विलाप बार-बार पूछता है कि अयोध्या फिर कब ध्वज और मालाएँ सजाएगी, हजारों लोग लौटते रथ का स्वागत कब करेंगे और राम, सीता तथा लक्ष्मण महल की देहरी कब पार करेंगे। हर प्रश्न उसी नगर में क्षणभर के लिए वापसी की राह बनाता है जिसने अभी उन्हें जाते देखा है।", "Let imagined garlands and crowds appear over the empty gate as fragile future layers rather than a guaranteed outcome.", ["kausalya", "rama", "sita", "lakshmana", "ayodhya-citizens"]),
      b("grief-turns-inward-as-guilt", "Grief turns inward as guilt", "शोक भीतर मुड़कर अपराधबोध बनता है", "Kausalya searches her own past for an offence severe enough to explain the separation and compares herself to a mother deprived of her only child. Her self-accusation reveals the mind trying to make suffering intelligible; it does not prove a hidden crime or a moral law that present loss must be punishment for an earlier deed.", "कौसल्या अपने अतीत में ऐसा अपराध खोजती हैं जो इस वियोग को समझा सके और स्वयं को एकमात्र संतान से वंचित माँ के समान देखती हैं। उनका आत्मारोप दिखाता है कि मन पीड़ा को अर्थ देने की कोशिश कर रहा है; वह किसी छिपे अपराध या इस नैतिक नियम को सिद्ध नहीं करता कि वर्तमान हानि अवश्य किसी पुराने कर्म की सज़ा है।", "Turn the imagined return inward into a circle of memory and guilt, then leave Kausalya beside the still-silent king.", ["kausalya", "king-dasharatha", "rama"]),
    ],
  ),
  s(
    "sumitra-keeps-return-possible",
    4,
    44,
    119,
    "60a8c7a3fbc6b565d28d84f9afd92225fcdd9ebb8d44f7d972787e11d99c6298",
    { en: "Sumitra keeps return possible", hi: "सुमित्रा वापसी की संभावना थामती हैं" },
    {
      en: "Sumitra answers Kausalya by naming Rama's chosen duty, Lakshmana's companionship, Sita's presence, and a richly imagined protection that gives the grieving room enough hope to endure the night.",
      hi: "सुमित्रा कौसल्या को राम के चुने कर्तव्य, लक्ष्मण के साथ, सीता की उपस्थिति और कल्पित संरक्षण का स्मरण कराती हैं, जिससे शोकाकुल कक्ष को रात सहने भर की आशा मिलती है।",
    },
    ["Kausalya's chamber", "Imagined forest shelter", "Imagined return to Ayodhya"],
    ["sumitra", "kausalya", "rama", "sita", "lakshmana", "ayodhya"],
    [
      b("sumitra-answers-with-rama-own-decision", "Sumitra answers with Rama's own decision", "सुमित्रा राम के अपने निर्णय से उत्तर देती हैं", "Sumitra asks Kausalya to see Rama not only as someone expelled but also as someone acting to keep Dasharatha's word. Her consolation comes from the moral world the family inhabits. It does not erase the coercive circumstances, the harm of the demand, or Kausalya's right to grieve what the decision costs.", "सुमित्रा कौसल्या से राम को केवल निकाले गए व्यक्ति के रूप में नहीं, बल्कि दशरथ का वचन निभाने का निर्णय लेने वाले व्यक्ति के रूप में भी देखने को कहती हैं। उनकी सांत्वना परिवार के नैतिक संसार से आती है। वह दबावपूर्ण परिस्थिति, माँग से हुए नुकसान या निर्णय की कीमत पर कौसल्या के शोक के अधिकार को नहीं मिटाती।", "Place Sumitra beside Kausalya, offering another frame for the same road without covering the room's grief.", ["sumitra", "kausalya", "rama", "king-dasharatha"]),
      b("lakshmana-and-sita-make-companionship-visible", "Lakshmana and Sita make companionship visible", "लक्ष्मण और सीता साथ को दिखाई देने योग्य बनाते हैं", "Sumitra reminds Kausalya that Lakshmana has gone to care for Rama and that Sita is present on the road. The reassurance depends on companionship rather than claiming hardship has disappeared. Sita's presence remains her repeatedly expressed choice, not merely proof of a prescribed role for every wife.", "सुमित्रा कौसल्या को याद दिलाती हैं कि लक्ष्मण राम की सेवा और साथ के लिए गए हैं तथा सीता भी राह पर उपस्थित हैं। यह आश्वासन कठिनाई मिट जाने का दावा नहीं करता, बल्कि साथ पर टिका है। सीता की उपस्थिति उनका बार-बार व्यक्त किया निर्णय रहती है, हर पत्नी के लिए तय भूमिका का प्रमाण नहीं।", "Show the three travellers as a distant moving constellation connected back to the two mothers by remembered choice and care.", ["sumitra", "kausalya", "lakshmana", "sita", "rama"]),
      b("sun-moon-and-wind-become-protective-images", "Sun, moon, and wind become protective images", "सूर्य, चंद्रमा और वायु संरक्षण के बिंब बनते हैं", "Sumitra imagines the sun softening, the forest wind serving Rama, and the moon touching him like a father while his strength keeps danger away. These are devotional and poetic assurances spoken to a grieving mother, not weather forecasts, guarantees of safety, or evidence that natural forces suspend ordinary risk.", "सुमित्रा कल्पना करती हैं कि सूर्य की धूप कोमल होगी, वन की वायु राम की सेवा करेगी और चंद्रमा पिता की तरह उन्हें छुएगा, जबकि उनका बल संकट दूर रखेगा। ये शोकाकुल माँ को दिए गए भक्तिपरक और काव्यात्मक आश्वासन हैं, मौसम की भविष्यवाणी, सुरक्षा की गारंटी या प्राकृतिक जोखिम रुक जाने का प्रमाण नहीं।", "Let sun, wind, and moon form gentle protective layers around an otherwise real and difficult forest road.", ["sumitra", "kausalya", "rama", "epic-sky"]),
      b("hope-changes-the-room-without-ending-grief", "Hope changes the room without ending grief", "आशा शोक समाप्त किए बिना कक्ष बदलती है", "Sumitra repeatedly tells Kausalya she will see Rama, Sita, and Lakshmana return and Rama bow at her feet. The promise cannot certify the future from outside the tale, but within the scene it loosens grief's hold. Kausalya becomes able to receive a small measure of hope rather than being ordered simply to stop mourning.", "सुमित्रा बार-बार कौसल्या से कहती हैं कि वे राम, सीता और लक्ष्मण को लौटते तथा राम को उनके चरणों में झुकते देखेंगी। यह कथन कथा के बाहर भविष्य की गारंटी नहीं देता, पर दृश्य के भीतर शोक की पकड़ ढीली करता है। कौसल्या को केवल रोना बंद करने का आदेश नहीं मिलता, बल्कि थोड़ी आशा ग्रहण करने की जगह मिलती है।", "Allow the dark chamber to gain a narrow dawn line while both grief and imagined return remain present.", ["sumitra", "kausalya", "rama", "sita", "lakshmana"]),
    ],
  ),
  s(
    "citizens-walk-beside-the-exiles",
    5,
    45,
    120,
    "94bf60e29814d69d013fb8e7f6660d2a48393ed1ee57c372b69e1835070de731",
    { en: "Citizens walk beside the exiles", hi: "नगरवासी वनवासियों के साथ पैदल चलते हैं" },
    {
      en: "Ayodhya's citizens refuse to turn back, Rama asks them to transfer their care to Bharata and Dasharatha, elders appeal even to the horses, and the travellers leave the car to walk with those who cannot keep pace.",
      hi: "अयोध्या के नागरिक लौटने से इनकार करते हैं, राम उनसे अपना स्नेह भरत और दशरथ की ओर मोड़ने को कहते हैं, बुज़ुर्ग घोड़ों तक से विनती करते हैं और यात्री धीमे लोगों के साथ चलने के लिए रथ से उतर जाते हैं।",
    },
    ["Road outside Ayodhya", "The slowing chariot", "Open country at dusk", "First roadside halt"],
    ["rama", "sita", "lakshmana", "sumantra", "bharata", "king-dasharatha", "ayodhya-citizens", "city-follows-car-event"],
    [
      b("the-city-refuses-to-turn-home", "The city refuses to turn home", "नगर लौटने से इनकार करता है", "Citizens continue behind Rama's car even after Dasharatha has stopped, drawn by affection and by their desire that Rama should rule them. Their movement is not a faceless wave: people of different ages and religious lives carry their own reasons, fatigue, household absences, and hopes onto the same road.", "दशरथ के रुक जाने के बाद भी नागरिक राम के रथ के पीछे चलते रहते हैं; उन्हें स्नेह और राम को अपना शासक देखने की इच्छा आगे खींचती है। उनका चलना कोई चेहराविहीन लहर नहीं—अलग आयु और धार्मिक जीवन वाले लोग अपने कारण, थकान, घर की अनुपस्थिति और आशाएँ उसी राह पर लाते हैं।", "Expand the procession into distinct elders, families, ritual fires, workers, and household groups rather than one repeated crowd texture.", ["ayodhya-citizens", "rama", "king-dasharatha", "sita", "lakshmana"]),
      b("rama-asks-love-to-reach-bharata", "Rama asks their love to reach Bharata", "राम कहते हैं कि उनका स्नेह भरत तक पहुँचे", "Rama looks back at the followers and asks them to give Bharata the same care they have shown him. He describes his younger brother as wise, gentle, and capable, and asks the citizens to support the king rather than deepen Dasharatha's grief. His trust does not mean the citizens must instantly stop feeling betrayed or abandon their own judgment.", "राम पीछे चल रहे लोगों को देखकर उनसे कहते हैं कि जो स्नेह उन्होंने राम को दिया है वही भरत को भी दें। वे छोटे भाई को बुद्धिमान, सौम्य और सक्षम बताते हैं तथा नागरिकों से राजा का साथ देने को कहते हैं ताकि दशरथ का शोक न बढ़े। उनका विश्वास यह नहीं कहता कि नागरिक तुरंत अपना आहत मन या स्वतंत्र निर्णय छोड़ दें।", "Send Rama's words backward through the moving crowd while Bharata remains a distant absent figure rather than an invented participant.", ["rama", "bharata", "ayodhya-citizens", "king-dasharatha"]),
      b("elders-appeal-to-the-horses", "Elders appeal to the horses", "बुज़ुर्ग घोड़ों से भी विनती करते हैं", "Elders who cannot match the chariot call to its horses as creatures able to hear, asking them to carry Rama back toward the city rather than farther into exile. They bring ceremonial umbrellas and remembered learning onto the dusty road, turning age, ritual life, and physical frailty into a public appeal that the departure should stop.", "जो बुज़ुर्ग रथ की गति नहीं पकड़ पाते वे सुन सकने वाले जीव मानकर घोड़ों को पुकारते हैं और उनसे राम को वनवास में दूर ले जाने के बजाय नगर की ओर लौटाने की विनती करते हैं। वे यज्ञ के छत्र और अपना संचित ज्ञान धूल भरी राह पर लाते हैं; आयु, धार्मिक जीवन और शारीरिक दुर्बलता प्रस्थान रोकने की सार्वजनिक अपील बनते हैं।", "Bring shaking white heads, raised umbrellas, and the horses' attentive ears into one slow-moving frame.", ["elders", "rama", "sumantra", "horses", "ayodhya-citizens"]),
      b("rama-leaves-the-car-to-match-their-pace", "Rama leaves the car to match their pace", "राम उनकी गति से चलने के लिए रथ से उतरते हैं", "Unable to keep riding while elders struggle on foot, Rama descends and continues beside them with Sita and Lakshmana. The gesture does not grant the return they request, but it changes how the separation proceeds: speed gives way to shared pace until darkness falls and Sumantra unharnesses, waters, and feeds the tired horses.", "बुज़ुर्गों को पैदल संघर्ष करते देख राम रथ पर बैठे नहीं रह पाते और सीता तथा लक्ष्मण के साथ उतरकर उनके पास चलते हैं। यह कदम माँगी हुई वापसी नहीं देता, पर अलगाव की गति बदल देता है—अँधेरा पड़ने तक तेज़ी साझा चाल में बदलती है और सुमंत्र थके घोड़ों को खोलकर पानी तथा चारा देते हैं।", "Lower the viewpoint from chariot height to walking level, then let dusk gather around people and resting horses at the first halt.", ["rama", "sita", "lakshmana", "sumantra", "elders", "horses"]),
    ],
  ),
];
