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
  turnId: "exile-accepted",
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

export const RAMAYANA_SITA_CHOOSES_ROAD_LIBRARY_SCENES: RamayanaLibraryScene[] = [
  s(
    "sita-discovers-the-coronation-has-become-exile",
    8,
    26,
    101,
    "eaf038b216d55a4b9ae07c60f988cdbfaf56a37b4f74ac30772deeb4072f0b02",
    { en: "Sita discovers the coronation has become exile", hi: "सीता जानती हैं कि राज्याभिषेक वनवास बन गया है" },
    {
      en: "Sita waits for Rama's coronation, reads the loss in his face and missing royal signs, then hears that Bharata will rule while Rama expects her to remain in Ayodhya under a careful court routine.",
      hi: "सीता राम के राज्याभिषेक की प्रतीक्षा करती हैं, उनके चेहरे और अनुपस्थित राजचिह्नों में हानि पढ़ती हैं, फिर सुनती हैं कि भरत शासन करेंगे और राम उनसे अयोध्या में सावधान राजकीय दिनचर्या के भीतर रहने की अपेक्षा करते हैं।",
    },
    ["Sita's chamber", "Ayodhya palace", "Imagined coronation road", "Forest road"],
    ["sita", "rama", "bharata", "dasharatha", "kaikeyi", "kausalya", "coronation-reversal", "court-survival-advice"],
    [
      b("sita-waits-inside-the-coronation-that-no-longer-exists", "Sita waits inside the coronation that no longer exists", "सीता उस राज्याभिषेक की प्रतीक्षा करती हैं जो अब नहीं होगा", "Unaware of the crisis elsewhere in the palace, Sita completes her devotions and waits with gratitude for Rama to arrive as the announced heir. He enters with lowered head, pale face, and visible grief. She rises trembling because the private signs before her contradict the celebration that still structures her expectations.", "महल के दूसरे भाग में आए संकट से अनजान सीता पूजा पूरी कर घोषित युवराज के रूप में राम के आने की कृतज्ञ प्रतीक्षा करती हैं। वे झुके सिर, पीले चेहरे और स्पष्ट शोक के साथ भीतर आते हैं। सीता काँपते हुए उठती हैं, क्योंकि सामने दिखाई देते निजी संकेत अभी तक उनकी अपेक्षाओं को आकार देने वाले उत्सव से बिल्कुल उलट हैं।", "Keep the chamber prepared for coronation while Rama enters carrying the visual weight of a road no one has yet named to Sita.", ["sita", "rama", "coronation-reversal"]),
      b("sita-asks-where-every-royal-sign-has-gone", "Sita asks where every royal sign has gone", "सीता पूछती हैं कि सारे राजचिह्न कहाँ चले गए", "Sita asks why the auspicious day has brought no umbrella, ceremonial fans, singers, priests, citizens, chariot, elephant, or royal seat, and why Rama's face carries no joy. Her questions are not ornamental detail: she reconstructs the missing public event from each absence before Rama can explain how the promised future was taken away.", "सीता पूछती हैं कि शुभ दिन पर छत्र, चँवर, गायक, पुरोहित, नागरिक, रथ, हाथी और राजासन क्यों नहीं हैं तथा राम के चेहरे पर प्रसन्नता क्यों नहीं है। उनके प्रश्न केवल सजावटी विवरण नहीं; राम के समझाने से पहले ही वे हर अनुपस्थिति से उस लुप्त सार्वजनिक घटना को जोड़ती हैं और समझती हैं कि घोषित भविष्य छिन गया है।", "Let each absent object leave a dark position in the coronation procession until Sita's questions assemble the scale of the reversal.", ["sita", "rama", "royal-signs", "inference"]),
      b("rama-tells-sita-about-the-boons-and-the-fourteen-year-road", "Rama tells Sita about the boons and the fourteen-year road", "राम सीता को वरदानों और चौदह वर्ष की राह के बारे में बताते हैं", "Rama says Dasharatha granted Kaikeyi two boons, that she claimed Bharata's installation and his own fourteen-year exile just as the coronation was ready, and that he has come to see Sita before leaving that day. The explanation turns a changed face into a concrete transfer of crown, home, time, and future.", "राम बताते हैं कि दशरथ ने कैकेयी को दो वर दिए थे, राज्याभिषेक तैयार होते ही उन्होंने भरत का अभिषेक और राम का चौदह वर्ष का वनवास माँगा, और वे उसी दिन जाने से पहले सीता से मिलने आए हैं। यह व्याख्या बदले चेहरे को मुकुट, घर, समय और भविष्य के ठोस हस्तांतरण में बदल देती है।", "Replace the imagined coronation route with two diverging lines: Bharata toward the throne and Rama toward Dandaka for fourteen years.", ["rama", "sita", "dasharatha", "kaikeyi", "bharata", "forest-exile"]),
      b("rama-designs-a-life-for-sita-inside-ayodhya", "Rama designs a life for Sita inside Ayodhya", "राम सीता के लिए अयोध्या के भीतर जीवन तय करते हैं", "Rama asks Sita to stay, keep daily observances, honour Dasharatha and the royal mothers, regard Bharata and Shatrughna with care, and avoid praising Rama where the new king might resent it. This is Rama's period-bound advice for surviving a changed court; it is not a universal rule that spouses must separate, flatter power, or silence affection.", "राम सीता से अयोध्या में रहने, दैनिक पूजा करने, दशरथ और राजमाताओं का सम्मान करने, भरत तथा शत्रुघ्न का ध्यान रखने और नए राजा को अप्रिय लग सकने वाली जगह पर राम की प्रशंसा से बचने को कहते हैं। यह बदली राजसभा में रहने की राम की काल-विशेष सलाह है; पति-पत्नी के अलग होने, सत्ता को प्रसन्न रखने या स्नेह दबाने का सार्वभौमिक नियम नहीं।", "Build Rama's proposed palace routine as a complete path, then leave Sita poised to accept or refuse it in her own words.", ["rama", "sita", "bharata", "shatrughna", "dasharatha", "royal-mothers", "period-bound-advice"]),
    ],
  ),
  s(
    "sita-refuses-the-palace-as-her-only-future",
    9,
    27,
    102,
    "d000cf4b739d7136d80c58353687e3a5cefdc90749d6bcc16ecc9587ab798f5e",
    { en: "Sita refuses the palace as her only future", hi: "सीता महल को अपना एकमात्र भविष्य मानने से इनकार करती हैं" },
    {
      en: "Sita rejects Rama's plan, invokes the marital ideas she was taught, claims the forest journey as her own decision, and imagines a shared life there rather than passive safety without him.",
      hi: "सीता राम की योजना अस्वीकार करती हैं, सीखे हुए वैवाहिक विचारों का सहारा लेकर वन-यात्रा को अपना निर्णय बनाती हैं और राम के बिना निष्क्रिय सुरक्षा के बजाय वहाँ साझा जीवन की कल्पना करती हैं।",
    },
    ["Sita's chamber", "Palace threshold", "Imagined Dandaka forest", "Imagined forest lakes"],
    ["sita", "rama", "forest-exile", "explicit-choice", "period-marital-norm", "shared-fortune", "distress"],
    [
      b("sita-rejects-the-assumption-that-she-will-stay", "Sita rejects the assumption that she will stay", "सीता इस धारणा को अस्वीकार करती हैं कि वे रुकेंगी", "Sita answers with affection and offence, asking how Rama could speak as though she were too small-minded to share the changed life. She does not accept the palace routine he has designed. Before any list of dangers is offered, her first response makes clear that remaining in Ayodhya is not a decision he can quietly make on her behalf.", "सीता स्नेह और आहत असहमति के साथ पूछती हैं कि राम उन्हें इतना संकीर्ण समझकर कैसे बोल सकते हैं कि वे बदला हुआ जीवन साझा न करें। वे उनके द्वारा तय महल की दिनचर्या स्वीकार नहीं करतीं। किसी खतरे की सूची आने से पहले ही उनका पहला उत्तर स्पष्ट कर देता है कि अयोध्या में रहना ऐसा निर्णय नहीं जिसे राम उनकी ओर से चुपचाप कर दें।", "Move Sita out of the palace path Rama drew and place her voice directly across the proposed separation line.", ["sita", "rama", "refusal", "agency"]),
      b("sita-uses-the-marital-world-she-was-taught", "Sita uses the marital world she was taught", "सीता सीखे हुए वैवाहिक संसार का सहारा लेती हैं", "Sita says a wife shares her husband's fortune and recalls being taught to follow him through changed conditions. These statements belong to her ancient social and religious world and help her argue against exclusion. They preserve her expressed reasoning here; they are not converted into present-day advice that every spouse must follow another person regardless of safety or consent.", "सीता कहती हैं कि पत्नी पति के भाग्य में सहभागी होती है और उन्हें बदलती परिस्थितियों में साथ चलना सिखाया गया था। ये कथन उनके प्राचीन सामाजिक और धार्मिक संसार के हैं तथा उन्हें बाहर रखने के विरुद्ध तर्क देते हैं। वे यहाँ सीता की व्यक्त सोच को बचाते हैं; उन्हें आज की ऐसी सलाह नहीं बनाया जाता कि हर जीवनसाथी सुरक्षा या सहमति की परवाह किए बिना दूसरे के पीछे जाए।", "Keep inherited marital teaching behind Sita as one resource she chooses to use, not as chains extending toward every modern relationship.", ["sita", "rama", "period-marital-norm", "attributed-reasoning"]),
      b("sita-imagines-the-forest-as-a-shared-daily-world", "Sita imagines the forest as a shared daily world", "सीता वन को साझा दैनिक संसार के रूप में देखती हैं", "Sita says she will walk ahead over thorns, live on roots and fruits, share disciplined routines, see mountains, streams, lakes, birds, and animals, and treat the forest as a home because they are together. Her image is hopeful rather than ignorant: it is a deliberately chosen counter-vision to the isolated palace life Rama has proposed.", "सीता कहती हैं कि वे काँटों पर आगे चलेंगी, फल-मूल पर रहेंगी, अनुशासित दिनचर्या साझा करेंगी, पर्वत, धाराएँ, सरोवर, पक्षी और पशु देखेंगी तथा साथ होने के कारण वन को घर मानेंगी। उनकी छवि अज्ञान नहीं, आशा है; वह राम द्वारा प्रस्तावित अकेले महल-जीवन के सामने जानबूझकर चुना गया दूसरा भविष्य है।", "Open Sita's imagined forest as a lived route of water, food, movement, and companionship rather than a decorative background.", ["sita", "rama", "dandaka", "shared-daily-life", "hope"]),
      b("her-clear-choice-also-carries-fear-of-being-left", "Her clear choice also carries fear of being left", "उनके स्पष्ट चुनाव में छोड़े जाने का भय भी है", "Sita insists that Rama cannot dissuade her and says separation would be unbearable. Her choice to travel is repeated and explicit, while her language also reveals acute fear of abandonment and dependence shaped by her world. The distress is neither a romantic test nor a method anyone should imitate; it is part of the unequal emotional pressure inside the exchange.", "सीता बार-बार कहती हैं कि राम उन्हें रोक नहीं सकते और अलगाव असहनीय होगा। साथ चलने का उनका निर्णय स्पष्ट तथा दोहराया हुआ है, पर उनकी भाषा उनके संसार से बने परित्याग-भय और निर्भरता को भी दिखाती है। यह दुख न प्रेम की परीक्षा है, न किसी के अनुकरण की विधि; यह संवाद के भीतर असमान भावनात्मक दबाव का हिस्सा है।", "Hold explicit choice and acute abandonment fear in parallel, allowing neither to erase the other.", ["sita", "rama", "explicit-choice", "abandonment-fear", "acute-distress"]),
    ],
  ),
  s(
    "rama-names-the-forest-risks-in-full",
    10,
    28,
    103,
    "5828869aa26e84baa69dac9f4b2827f43dc2f100a33a05fb078d53286c92ebd4",
    { en: "Rama names the forest risks in full", hi: "राम वन के जोखिम पूरे विस्तार से बताते हैं" },
    {
      en: "Still reluctant, Rama describes animals, rivers, rough ground, hunger, weather, austere routines, and daily labour so Sita hears what he fears before repeating her decision.",
      hi: "अब भी अनिच्छुक राम पशुओं, नदियों, कठिन भूमि, भूख, मौसम, तपस्वी दिनचर्या और रोज के श्रम का विस्तार बताते हैं, ताकि सीता अपना निर्णय दोहराने से पहले उनके भय सुन सकें।",
    },
    ["Sita's chamber", "Imagined mountain caves", "Imagined forest rivers", "Imagined ascetic camp"],
    ["rama", "sita", "forest-risks", "informed-choice", "animals", "rivers", "ascetic-routine", "period-gender-language"],
    [
      b("rama-refuses-again-and-frames-the-warning-as-care", "Rama refuses again and frames the warning as care", "राम फिर मना कर चेतावनी को देखभाल बताते हैं", "Rama remains resolved not to take Sita and says his counsel is meant for her welfare. He also speaks through a period hierarchy of gender; that hierarchy does not establish anyone's capability. His concern may be sincere, yet the decision is still being withheld while he defines which risks she should be allowed to accept.", "राम अब भी सीता को साथ न ले जाने पर अड़े हैं और कहते हैं कि उनकी सलाह सीता के कल्याण के लिए है। वे अपने समय की लैंगिक श्रेणी की भाषा भी बोलते हैं; वह श्रेणी किसी की क्षमता तय नहीं करती। उनकी चिंता सच्ची हो सकती है, फिर भी निर्णय रोका जा रहा है जबकि वे तय कर रहे हैं कि सीता किन जोखिमों को स्वीकार कर सकती हैं।", "Show care and control as overlapping but distinguishable forces in Rama's refusal, with Sita listening rather than disappearing.", ["rama", "sita", "care", "control", "period-gender-language"]),
      b("animals-rivers-and-terrain-fill-the-warning", "Animals, rivers, and terrain fill the warning", "चेतावनी में पशु, नदियाँ और कठिन भूभाग भर जाते हैं", "Rama describes roaring lions, approaching wild animals, crocodiles and other creatures in muddy rivers, elephants, thorn-covered paths, scarce drinking water, reptiles, insects, and noisy birds. The catalogue gives the forest physical scale and explains his fear; it is epic-world risk narration, not a current wildlife or route-safety advisory.", "राम गर्जते सिंहों, पास आते वन्य पशुओं, कीचड़ भरी नदियों के मगर और अन्य जीवों, हाथियों, काँटों वाले रास्तों, दुर्लभ पेयजल, सरीसृपों, कीड़ों और शोर करते पक्षियों का वर्णन करते हैं। यह सूची वन को भौतिक विस्तार देती और राम का भय समझाती है; यह महाकाव्य-संसार का जोखिम-वर्णन है, आज की वन्यजीव या मार्ग-सुरक्षा सलाह नहीं।", "Let the imagined forest grow layer by layer around the chamber while keeping the warnings visibly inside Rama's speech.", ["rama", "sita", "forest-animals", "forest-rivers", "terrain", "epic-risk"]),
      b("hunger-weather-and-rough-sleep-make-risk-daily", "Hunger, weather, and rough sleep make risk daily", "भूख, मौसम और कठिन शयन जोखिम को रोजमर्रा बनाते हैं", "The warning moves from dramatic animals to daily strain: sleeping on fallen leaves after exhausting travel, eating what the forest yields, enduring wind, darkness, hunger, thorns, and bodily discomfort. Rama is not describing one adventurous encounter but a fourteen-year pattern in which ordinary fatigue may matter as much as a visible threat.", "चेतावनी नाटकीय पशुओं से रोज के कष्ट पर आती है: थकाऊ यात्रा के बाद गिरे पत्तों पर सोना, वन से मिले भोजन पर रहना, हवा, अँधेरा, भूख, काँटे और शारीरिक असुविधा सहना। राम किसी एक रोमांचक घटना का नहीं, चौदह वर्ष की ऐसी दिनचर्या का वर्णन करते हैं जिसमें सामान्य थकान भी दिखाई देने वाले खतरे जितनी महत्वपूर्ण हो सकती है।", "Shift from isolated danger images into a repeating day-and-night survival loop so the duration of exile becomes tangible.", ["rama", "sita", "hunger", "weather", "fatigue", "fourteen-years"]),
      b("the-forest-routine-is-described-but-not-prescribed", "The forest routine is described but not prescribed", "वन की दिनचर्या का वर्णन है, निर्देश नहीं", "Rama adds fasting, bark and matted hair, repeated bathing, offerings, hospitality, gathered flowers, controlled food, restrained anger, and ascetic attention. These practices describe the disciplined forest life he anticipates in this telling; they are not a modern ritual checklist. Sita hears the full material and devotional burden and still prepares an answer instead of accepting exclusion.", "राम उपवास, वल्कल और जटा, बार-बार स्नान, अर्पण, अतिथि-सत्कार, स्वयं जुटाए फूल, सीमित भोजन, क्रोध-संयम और तपस्वी ध्यान भी जोड़ते हैं। ये अभ्यास इस कथा में उनके अनुमानित अनुशासित वन-जीवन का वर्णन हैं, आधुनिक अनुष्ठान-सूची नहीं। सीता पूरा भौतिक और धार्मिक भार सुनती हैं, फिर भी बाहर रखे जाने को मानने के बजाय उत्तर तैयार करती हैं।", "Arrange the ascetic practices as Rama's anticipated routine, then return the scene decisively to Sita's still-open choice.", ["rama", "sita", "ascetic-routine", "not-ritual-instruction", "informed-choice"]),
    ],
  ),
  s(
    "sita-renews-her-choice-after-hearing-the-risks",
    11,
    29,
    104,
    "ebd6babf7a1f9b56d3c521e97076a4226ada19c28d6c6cfbe331a71624c6caf7",
    { en: "Sita renews her choice after hearing the risks", hi: "जोखिम सुनकर सीता अपना निर्णय फिर स्पष्ट करती हैं" },
    {
      en: "Sita answers the risks rather than denying them, recalls earlier predictions and requests, invokes her religious world, and repeats her choice while distress escalates under Rama's continued refusal.",
      hi: "सीता जोखिमों को नकारने के बजाय उनका उत्तर देती हैं, पुरानी भविष्यवाणियाँ और आग्रह याद करती हैं, अपने धार्मिक संसार का सहारा लेती हैं और राम के लगातार इनकार के बीच बढ़ते दुख के साथ अपना निर्णय दोहराती हैं।",
    },
    ["Sita's chamber", "Remembered Mithila", "Imagined forest world", "Palace threshold"],
    ["sita", "rama", "mithila", "forest-prediction", "prior-request", "period-religious-claim", "self-harm-distress"],
    [
      b("sita-does-not-deny-the-risks-she-revalues-them", "Sita does not deny the risks; she revalues them", "सीता जोखिमों को नकारती नहीं, उनका अर्थ बदलती हैं", "Sita says the difficulties Rama listed appear different to her because affection and companionship change what she is willing to endure. She imagines animals keeping their distance and disciplined people bearing hardship better, but does not claim the forest is objectively safe. Her answer is about her chosen threshold of risk, not proof that danger has vanished.", "सीता कहती हैं कि राम द्वारा गिनाई कठिनाइयों का अर्थ उनके लिए अलग है, क्योंकि स्नेह और साथ यह बदल देते हैं कि वे क्या सहने को तैयार हैं। वे पशुओं के दूर रहने और अनुशासित लोगों द्वारा कठिनाई बेहतर झेलने की कल्पना करती हैं, पर वन को वस्तुतः सुरक्षित घोषित नहीं करतीं। उनका उत्तर अपने चुने जोखिम-स्तर का है, खतरा मिट जाने का प्रमाण नहीं।", "Keep Rama's risk map visible while Sita redraws her willingness across it without erasing any hazard marker.", ["sita", "rama", "risk-acceptance", "companionship", "not-safety-proof"]),
      b("earlier-predictions-and-promises-return-to-the-room", "Earlier predictions and promises return to the room", "पुरानी भविष्यवाणियाँ और वचन कक्ष में लौटते हैं", "Sita recalls Brahmins and an ascetic woman in Mithila predicting forest residence and says she had previously asked Rama to take her there, receiving his agreement. Those memories strengthen her sense that the moment has arrived. They are remembered claims and prior conversation, not forces that eliminate present choice or prove every predicted event inevitable.", "सीता याद करती हैं कि मिथिला में ब्राह्मणों और एक तपस्विनी ने वनवास की भविष्यवाणी की थी और वे पहले भी राम से उन्हें वन ले जाने का आग्रह कर उनकी सहमति पा चुकी थीं। ये स्मृतियाँ उन्हें विश्वास देती हैं कि समय आ गया है। वे स्मृत दावे और पूर्व संवाद हैं, वर्तमान चुनाव मिटाने या हर भविष्यवाणी को अनिवार्य सिद्ध करने वाली शक्ति नहीं।", "Bring remembered Mithila voices and an earlier promise into the chamber as supporting threads, not as rails controlling the future.", ["sita", "rama", "mithila", "forest-prediction", "prior-request", "choice-not-destiny"]),
      b("sita-speaks-through-period-devotional-and-marital-claims", "Sita speaks through period devotional and marital claims", "सीता काल-विशेष भक्तिपरक और वैवाहिक धारणाओं में बोलती हैं", "Sita describes following her husband as religious merit, invokes the marriage rite, and says she shares Rama's joy and sorrow. These claims reveal how she understands duty and belonging in her world. Her reasoning remains part of the scene without turning ancient marital hierarchy into a universal command or implying that devotion cancels a person's continuing consent.", "सीता पति के साथ चलने को धार्मिक पुण्य बताती हैं, विवाह-संस्कार का उल्लेख करती हैं और कहती हैं कि वे राम के सुख-दुख की सहभागी हैं। ये दावे दिखाते हैं कि वे अपने संसार में कर्तव्य और संबंध को कैसे समझती हैं। उनका तर्क इस दृश्य का हिस्सा रहता है, लेकिन प्राचीन वैवाहिक श्रेणी को सार्वभौमिक आदेश नहीं बनाता और न यह मानता है कि भक्ति व्यक्ति की निरंतर सहमति मिटा देती है।", "Place period religious claims inside Sita's own voice with a clear boundary against automatic application to other lives.", ["sita", "rama", "period-religious-claim", "marriage-rite", "continuing-consent"]),
      b("continued-refusal-pushes-sita-into-acute-distress", "Continued refusal pushes Sita into acute distress", "लगातार इनकार सीता को तीव्र संकट में धकेलता है", "When Rama still does not agree, Sita says she cannot live after being left and speaks of destroying herself, then falls into anxious thought and tears. The moment records acute distress under threatened separation. It does not romanticise self-harm, repeat actionable methods, or suggest that a person should have to threaten death before a clear decision is respected.", "राम के अब भी सहमत न होने पर सीता कहती हैं कि छोड़े जाने के बाद वे जीवित नहीं रह पाएँगी और अपने जीवन को नष्ट करने की बात करती हैं; फिर चिंता और आँसुओं में डूब जाती हैं। यह क्षण संभावित अलगाव के नीचे तीव्र संकट दर्ज करता है। वह आत्महानि को प्रेममय नहीं बनाता, करने योग्य विधियाँ नहीं दोहराता और न यह सुझाता है कि स्पष्ट निर्णय का सम्मान पाने के लिए किसी को मृत्यु की धमकी देनी चाहिए।", "Let the debate collapse into a visibly serious distress state, with no romantic glow and no procedural imagery.", ["sita", "rama", "acute-distress", "self-harm-distress", "safety-boundary"]),
    ],
  ),
  s(
    "rama-accepts-sitas-place-on-the-road",
    12,
    30,
    105,
    "367c8be53b451548b55611a09d1c54287edaefe87ef2d26d6b19e1a86072f396",
    { en: "Rama accepts Sita's place on the road", hi: "राम वन-मार्ग पर सीता का स्थान स्वीकारते हैं" },
    {
      en: "Sita challenges the fear behind exclusion, describes what shared hardship means to her, breaks down under the threatened separation, and finally hears Rama accept her decision and begin joint preparation.",
      hi: "सीता बाहर रखने के पीछे के भय को चुनौती देती हैं, साझा कठिनाई का अपना अर्थ बताती हैं, संभावित अलगाव में टूटती हैं और अंततः राम को उनका निर्णय स्वीकार कर संयुक्त तैयारी शुरू करते सुनती हैं।",
    },
    ["Sita's chamber", "Palace threshold", "Imagined forest camp", "Distribution court"],
    ["sita", "rama", "janaka", "savitri", "explicit-choice", "gendered-insult-boundary", "distress", "gift-distribution"],
    [
      b("sita-challenges-the-fear-behind-exclusion", "Sita challenges the fear behind exclusion", "सीता बाहर रखने के पीछे के भय को चुनौती देती हैं", "Sita challenges Rama's courage and asks what Janaka would think of a son-in-law who leaves his wife behind. Her challenge uses femininity as an insult inherited from her social world. The confrontation remains visible without endorsing the premise that being a woman signifies cowardice, inferiority, or failed manhood.", "सीता राम के साहस को चुनौती देकर पूछती हैं कि अपनी पत्नी को पीछे छोड़ने वाले दामाद के बारे में जनक क्या सोचेंगे। उनकी चुनौती अपने सामाजिक संसार से मिली भाषा में स्त्रीत्व को अपमान की तरह इस्तेमाल करती है। टकराव सामने रहता है, पर इस धारणा को स्वीकार नहीं करता कि स्त्री होना कायरता, हीनता या असफल पुरुषत्व का संकेत है।", "Show the force of Sita's confrontation while separating the inherited gendered insult from the moral point she presses.", ["sita", "rama", "janaka", "gendered-insult-boundary", "confrontation"]),
      b("sita-makes-shared-hardship-concrete", "Sita makes shared hardship concrete", "सीता साझा कठिनाई को ठोस रूप देती हैं", "Sita invokes Savitri, insists she has chosen no second household, and describes thorns as bearable, dust as sandal, grass as bedding, and whatever roots or fruits Rama gives as sufficient. The imagery does not prove hardship pleasant; it shows the meaning she gives it when arguing that companionship matters more to her than palace comfort.", "सीता सावित्री का स्मरण करती हैं, कहती हैं कि उन्होंने कोई दूसरा घर नहीं चुना, और काँटों को सहने योग्य, धूल को चंदन, घास को बिछावन तथा राम से मिले फल-मूल को पर्याप्त बताती हैं। यह चित्रण कठिनाई को सचमुच सुखद सिद्ध नहीं करता; वह दिखाता है कि महल के आराम से अधिक साथ को महत्व देते हुए सीता उसे क्या अर्थ देती हैं।", "Transform palace comforts and forest materials into paired images whose value changes through Sita's stated priorities.", ["sita", "rama", "savitri", "shared-hardship", "stated-priority"]),
      b("threatened-separation-overwhelms-sita", "Threatened separation overwhelms Sita", "संभावित अलगाव सीता को अभिभूत कर देता है", "Sita repeats that she cannot endure fourteen years apart, speaks again from a self-destructive crisis, embraces Rama, cries aloud, and becomes nearly insensible. Her breakdown is a consequence of the threatened separation and prolonged refusal, not a spectacle that proves devotion. Her already repeated decision should stand without requiring this suffering as its price.", "सीता दोहराती हैं कि चौदह वर्ष का अलगाव सह नहीं पाएँगी, फिर आत्मविनाश के संकट से बोलती हैं, राम को गले लगाकर जोर से रोती और लगभग चेतना खो देती हैं। उनका टूटना संभावित अलगाव और लंबे इनकार का परिणाम है, भक्ति सिद्ध करने वाला दृश्य नहीं। उनका बार-बार कहा निर्णय इस पीड़ा को कीमत बनाए बिना ही मान्य होना चाहिए।", "Keep the emotional collapse grave and grounded, with Sita's earlier clear words remaining visible rather than being replaced by suffering.", ["sita", "rama", "acute-distress", "self-harm-distress", "decision-already-clear"]),
      b("rama-accepts-the-choice-and-preparation-begins", "Rama accepts the choice and preparation begins", "राम निर्णय स्वीकारते हैं और तैयारी शुरू होती है", "Rama consoles Sita, says he had not understood the full strength of her intention, and declares that he cannot leave her when she is determined to go. He permits the journey and asks her to distribute ornaments, clothing, household goods, food, and remaining possessions among Brahmins, people seeking aid, and servants. The debate ends in joint preparation, though its painful path remains visible.", "राम सीता को सँभालकर कहते हैं कि वे उनके संकल्प की पूरी शक्ति नहीं समझ पाए थे और अब दृढ़ निर्णय के बाद उन्हें छोड़ नहीं सकते। वे यात्रा स्वीकारते और आभूषण, वस्त्र, गृह-सामग्री, भोजन तथा बची संपत्ति ब्राह्मणों, सहायता चाहने वालों और सेवकों में बाँटने को कहते हैं। संवाद संयुक्त तैयारी पर समाप्त होता है, पर वहाँ तक पहुँची पीड़ादायक राह दिखाई देती रहती है।", "Open two travel bundles and many outward gift paths, while preserving the long debate behind the accepted shared road.", ["rama", "sita", "explicit-choice", "gift-distribution", "shared-road"]),
    ],
  ),
];
