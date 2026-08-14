import type { StoryMoment } from "@/lib/domain/story-world";

export type RamayanaBeginningPlayableScene = {
  id: string;
  nodeIds: string[];
  moment: StoryMoment;
};

/**
 * Source-aligned consumer scenes for the opening frame of the selected Dutt
 * expression. These scenes retell the narrative; they do not reproduce the
 * source wording or claim to represent every Ramayana tradition.
 */
export const RAMAYANA_BEGINNINGS_PLAYABLE_SCENES: RamayanaBeginningPlayableScene[] = [
  {
    id: "valmiki-asks-for-complete-human",
    nodeIds: ["valmiki", "narada", "rama", "ayodhya", "sita", "hanuman", "lanka"],
    moment: {
      id: "valmiki-asks-for-complete-human",
      decisiveChange: {
        en: "A question about the best possible human life opens the entire Ramayana.",
        hi: "एक आदर्श मनुष्य की खोज का प्रश्न पूरी रामायण का द्वार खोल देता है।",
      },
      beats: [
        {
          id: "valmiki-sets-impossible-question",
          title: { en: "Can all these qualities live in one person?", hi: "क्या ये सभी गुण एक मनुष्य में मिल सकते हैं?" },
          narration: {
            en: "Valmiki asks Narada for someone living in the world who joins courage with compassion, truth with self-control, learning with practical judgment, and power with concern for others. He is not asking for a flawless statue, but for a life whose choices can be followed.",
            hi: "वाल्मीकि नारद से ऐसे जीवित मनुष्य के बारे में पूछते हैं जिसमें साहस के साथ करुणा, सत्य के साथ संयम, ज्ञान के साथ व्यवहार-बुद्धि और शक्ति के साथ सबके हित की चिंता हो। वे किसी निर्जीव आदर्श की नहीं, ऐसे जीवन की खोज कर रहे हैं जिसके निर्णयों का अनुसरण किया जा सके।",
          },
          visualCue: "Inside a quiet forest hermitage, each named quality appears as a moving constellation between Valmiki and Narada.",
          characterIds: ["valmiki", "narada"],
        },
        {
          id: "narada-names-rama",
          title: { en: "Narada answers with one name", hi: "नारद एक नाम लेते हैं" },
          narration: {
            en: "Narada considers the demanding list and names Rama of the Ikshvaku line. He describes a prince disciplined in speech and anger, formidable in danger, attentive to duty, and able to make people feel protected rather than merely ruled.",
            hi: "नारद उस कठिन सूची पर विचार करके इक्ष्वाकु वंश के राम का नाम लेते हैं। वे ऐसे राजकुमार का परिचय देते हैं जो वाणी और क्रोध पर संयम रखता है, संकट में प्रबल है, कर्तव्य के प्रति सजग है और लोगों को केवल शासित नहीं बल्कि सुरक्षित अनुभव कराता है।",
          },
          visualCue: "The constellation resolves into Rama while the distant geometry of Ayodhya rises beyond the trees.",
          characterIds: ["narada", "rama"],
        },
        {
          id: "a-crown-turns-into-exile",
          title: { en: "A promised crown becomes a forest road", hi: "राज्याभिषेक की सुबह वन की राह बन जाती है" },
          narration: {
            en: "Narada races ahead: Dasharatha prepares to install Rama, Kaikeyi claims her old boons, and Rama accepts fourteen years of exile. Sita and Lakshmana choose to go with him, turning a political rupture into a shared journey away from Ayodhya.",
            hi: "नारद कथा को तेजी से आगे ले जाते हैं—दशरथ राम के राज्याभिषेक की तैयारी करते हैं, कैकेयी पुराने वरदान माँगती हैं और राम चौदह वर्ष का वनवास स्वीकार कर लेते हैं। सीता और लक्ष्मण साथ चलने का निर्णय लेते हैं; राजमहल का संकट अयोध्या से दूर एक साझा यात्रा बन जाता है।",
          },
          visualCue: "A ceremonial crown dissolves into three figures walking from a luminous city toward a deepening forest.",
          characterIds: ["rama", "sita", "lakshmana", "dasharatha", "kaikeyi"],
        },
        {
          id: "loss-creates-an-alliance",
          title: { en: "Sita is taken, and strangers become allies", hi: "सीता का हरण होता है और अजनबी साथी बनते हैं" },
          narration: {
            en: "The forest story breaks when Ravana abducts Sita and Jatayu falls trying to stop him. Rama and Lakshmana's search reaches Sugriva and Hanuman; grief becomes alliance, and scattered clues begin pointing across the ocean toward Lanka.",
            hi: "वन की कथा तब टूटती है जब रावण सीता का हरण करता है और उसे रोकते हुए जटायु गिर पड़ते हैं। राम और लक्ष्मण की खोज सुग्रीव और हनुमान तक पहुँचती है; शोक मित्रता में बदलता है और बिखरे संकेत समुद्र पार लंका की ओर इशारा करने लगते हैं।",
          },
          visualCue: "An empty forest clearing widens into branching search paths that converge on Hanuman and the southern sea.",
          characterIds: ["rama", "sita", "lakshmana", "ravana", "jatayu", "sugriva", "hanuman"],
        },
        {
          id: "narada-reaches-the-return",
          title: { en: "The whole life flashes to its return", hi: "पूरे जीवन की झलक वापसी तक पहुँचती है" },
          narration: {
            en: "Narada's preview crosses Hanuman's leap, the bridge, the war, Ravana's fall, Sita's recovery, and the return to Ayodhya. It ends with the selected source's sacred vision of Rama's reign, giving Valmiki the scale of the life he is about to tell rather than replacing the journey itself.",
            hi: "नारद की झलक हनुमान की छलाँग, सेतु, युद्ध, रावण के पतन, सीता की पुनर्प्राप्ति और अयोध्या वापसी से होकर गुजरती है। वह चुने हुए स्रोत में राम-राज्य की पवित्र कल्पना पर ठहरती है—यह आने वाली यात्रा का स्थान नहीं लेती, बल्कि वाल्मीकि को उस जीवन का विस्तार दिखाती है जिसे वे कथा बनाएँगे।",
          },
          visualCue: "Ocean, bridge, Lanka, Pushpaka, and Ayodhya sweep past as one continuous ribbon before returning to Valmiki's listening face.",
          characterIds: ["narada", "valmiki", "rama", "sita", "hanuman", "ravana"],
        },
      ],
    },
  },
  {
    id: "grief-becomes-first-verse",
    nodeIds: ["valmiki", "bharadwaja", "tamasa", "krauncha-pair", "hunter", "brahma"],
    moment: {
      id: "grief-becomes-first-verse",
      decisiveChange: {
        en: "Witnessed suffering changes ordinary speech into the form that will carry the epic.",
        hi: "आँखों के सामने हुआ दुःख साधारण वाणी को उस छंद में बदल देता है जो महाकाव्य को आगे ले जाएगा।",
      },
      beats: [
        {
          id: "tamasa-seems-clear",
          title: { en: "A river as clear as a good mind", hi: "सज्जन मन की तरह निर्मल नदी" },
          narration: {
            en: "After Narada leaves, Valmiki walks with his disciple Bharadwaja to the Tamasa. The clear water and mudless bank promise a calm place for bathing; the scene begins in careful attention to an ordinary, peaceful landscape.",
            hi: "नारद के जाने के बाद वाल्मीकि अपने शिष्य भरद्वाज के साथ तमसा नदी तक जाते हैं। निर्मल जल और कीचड़-रहित तट स्नान के लिए शांत स्थान का आभास देते हैं; दृश्य एक साधारण, शांत भू-दृश्य को ध्यान से देखने के साथ आरंभ होता है।",
          },
          visualCue: "The camera glides behind teacher and disciple toward a glass-clear river held in soft forest light.",
          characterIds: ["valmiki", "bharadwaja"],
        },
        {
          id: "krauncha-pair-in-peace",
          title: { en: "Two birds move without fear", hi: "दो पक्षी निश्चिंत होकर विचरते हैं" },
          narration: {
            en: "Near the water, Valmiki notices a pair of krauncha birds calling to one another and moving in complete ease. Their unguarded companionship gives the next instant its force: nothing in the scene has prepared them for violence.",
            hi: "जल के पास वाल्मीकि क्रौंच पक्षियों के एक जोड़े को एक-दूसरे को पुकारते और निश्चिंत होकर विचरते देखते हैं। उनका सहज साथ अगले क्षण को और तीखा बना देता है—दृश्य में ऐसा कुछ नहीं था जो उन्हें हिंसा के लिए तैयार करता।",
          },
          visualCue: "Two copper-crested birds cross the water together while their calls ripple through the still trees.",
          characterIds: ["valmiki", "krauncha-pair"],
        },
        {
          id: "arrow-breaks-the-pair",
          title: { en: "An arrow tears the scene in two", hi: "एक बाण दृश्य को दो भागों में तोड़ देता है" },
          narration: {
            en: "A hunter shoots the male bird without any quarrel or threat. He falls bleeding before Valmiki, and the surviving bird's cry turns the death from a distant act into a felt separation witnessed at close range.",
            hi: "एक शिकारी बिना किसी झगड़े या खतरे के नर पक्षी को मार देता है। वह वाल्मीकि के सामने रक्त से भीगा गिरता है और जीवित पक्षी का विलाप उस मृत्यु को दूर की घटना नहीं रहने देता; बिछोह सबके सामने अनुभव होने लगता है।",
          },
          visualCue: "The forest sound drops away at the arrow's flight, leaving one bird on the ground and one circling above it.",
          characterIds: ["hunter", "krauncha-pair", "valmiki"],
        },
        {
          id: "grief-finds-meter",
          title: { en: "Grief speaks in a rhythm of its own", hi: "शोक अपनी लय में बोल उठता है" },
          narration: {
            en: "Compassion and anger rise together in Valmiki. His rebuke to the hunter comes out in equal measured parts; only after speaking does he notice that grief has shaped itself into a repeatable verse, shoka becoming shloka in the story's own explanation.",
            hi: "वाल्मीकि के भीतर करुणा और आक्रोश एक साथ उठते हैं। शिकारी के लिए निकली उनकी वाणी समान लयबद्ध भागों में ढल जाती है; बोलने के बाद उन्हें समझ आता है कि शोक ने स्वयं को दोहराए जा सकने वाले श्लोक का रूप दे दिया है।",
          },
          visualCue: "The spoken words pulse outward in four balanced waves, turning raw shock into visible rhythm without showing written Sanskrit.",
          characterIds: ["valmiki", "hunter"],
        },
        {
          id: "brahma-gives-the-verse-a-road",
          title: { en: "Brahma turns one verse into a commission", hi: "ब्रह्मा एक श्लोक को पूरी कथा का दायित्व देते हैं" },
          narration: {
            en: "Back at the hermitage, Valmiki cannot stop thinking about the needless killing. Brahma appears and tells him the metre did not arise in vain: he must use it to tell Rama's whole story truthfully, including what he has not yet seen, so that the poem can travel through the world.",
            hi: "आश्रम लौटकर भी वाल्मीकि उस निरर्थक हत्या को भूल नहीं पाते। ब्रह्मा प्रकट होकर कहते हैं कि वह छंद व्यर्थ नहीं आया—उसी में राम की पूरी कथा सत्यपूर्वक कही जाए, यहाँ तक कि वह भी जो अभी वाल्मीकि ने नहीं देखा, ताकि यह कथा संसार में यात्रा कर सके।",
          },
          visualCue: "The small hermitage opens into a vast horizon as Brahma's instruction connects the single verse to an unwritten world of story.",
          characterIds: ["valmiki", "brahma", "bharadwaja"],
        },
      ],
    },
  },
  {
    id: "valmiki-sees-the-whole-life",
    nodeIds: ["valmiki", "rama", "sita", "lakshmana", "ayodhya", "forest-exile", "lanka"],
    moment: {
      id: "valmiki-sees-the-whole-life",
      decisiveChange: {
        en: "The rapid outline becomes a lived world that Valmiki can see from beginning to end.",
        hi: "तेज़ी से सुनाई गई रूपरेखा एक ऐसे जीवित संसार में बदल जाती है जिसे वाल्मीकि आरंभ से अंत तक देख सकते हैं।",
      },
      beats: [
        {
          id: "valmiki-enters-contemplation",
          title: { en: "The storyteller becomes a witness", hi: "कथाकार साक्षी बनता है" },
          narration: {
            en: "Valmiki sits facing east, steadies himself, and turns from Narada's summary toward sustained contemplation. The story presents this as a change in access: he is no longer arranging hearsay but watching people speak, move, choose, and endure as if they were before him.",
            hi: "वाल्मीकि पूर्व की ओर बैठकर स्वयं को स्थिर करते हैं और नारद की संक्षिप्त रूपरेखा से गहरे ध्यान की ओर बढ़ते हैं। कथा इसे दृष्टि के परिवर्तन की तरह दिखाती है—अब वे सुनी-सुनाई बातों को नहीं जोड़ रहे, बल्कि लोगों को अपने सामने बोलते, चलते, चुनते और सहते देख रहे हैं।",
          },
          visualCue: "The hermitage falls into darkness while a living Ayodhya slowly forms around the seated poet.",
          characterIds: ["valmiki"],
        },
        {
          id: "household-appears-in-motion",
          title: { en: "A family appears before it breaks", hi: "टूटने से पहले पूरा परिवार दिखाई देता है" },
          narration: {
            en: "He sees Rama, Sita, Lakshmana, Dasharatha, and the queens not as names in a list but laughing, speaking, and acting inside their household. That ordinary movement matters because exile will soon separate the same people and transform every familiar room.",
            hi: "वे राम, सीता, लक्ष्मण, दशरथ और रानियों को नामों की सूची की तरह नहीं, बल्कि परिवार में हँसते, बोलते और काम करते देखते हैं। यह सामान्य जीवन इसलिए महत्त्वपूर्ण है क्योंकि वनवास शीघ्र ही इन्हीं लोगों को अलग करेगा और हर परिचित कक्ष का अर्थ बदल देगा।",
          },
          visualCue: "Warm palace rooms overlap in motion before a dark forest road begins cutting through them.",
          characterIds: ["rama", "sita", "lakshmana", "dasharatha"],
        },
        {
          id: "the-road-opens-in-every-direction",
          title: { en: "The whole journey becomes visible", hi: "पूरी यात्रा एक साथ दिखाई देने लगती है" },
          narration: {
            en: "Birth, marriage, the broken bow, the lost coronation, exile, forest encounters, Sita's abduction, the alliance with Sugriva, Hanuman's search, and the war in Lanka unfold as connected consequences. Valmiki sees not only milestones but the conversations and grief that move people between them.",
            hi: "जन्म, विवाह, धनुष-भंग, रुका हुआ राज्याभिषेक, वनवास, वन के प्रसंग, सीता-हरण, सुग्रीव से मित्रता, हनुमान की खोज और लंका का युद्ध जुड़े हुए परिणामों की तरह खुलते हैं। वाल्मीकि केवल पड़ाव नहीं, उन संवादों और दुःखों को भी देखते हैं जो लोगों को एक पड़ाव से दूसरे तक ले जाते हैं।",
          },
          visualCue: "Multiple roads, rivers, forests, and the ocean assemble into one continuous navigable world rather than a montage of isolated icons.",
          characterIds: ["valmiki", "rama", "sita", "lakshmana", "sugriva", "hanuman", "ravana"],
        },
        {
          id: "future-enters-the-composition",
          title: { en: "The ending is not hidden from the poet", hi: "कवि से आगे का अंत भी छिपा नहीं रहता" },
          narration: {
            en: "The vision reaches the return, installation, and events the selected telling places later, including Sita's eventual separation. Holding past and future together, Valmiki begins composing a story large enough for triumph, doubt, tenderness, violence, and unresolved pain.",
            hi: "दृष्टि वापसी, राज्याभिषेक और चुनी हुई कथा में आगे आने वाली घटनाओं तक पहुँचती है, जिनमें सीता का बाद का वियोग भी शामिल है। अतीत और भविष्य को साथ रखकर वाल्मीकि ऐसी कथा रचना आरंभ करते हैं जिसमें विजय, संदेह, स्नेह, हिंसा और अधूरा दुःख सबके लिए स्थान हो।",
          },
          visualCue: "The returning procession fades into a lone figure beyond the city, while Valmiki begins shaping the full arc without a false happy-stop.",
          characterIds: ["valmiki", "rama", "sita"],
        },
      ],
    },
  },
  {
    id: "lava-kusha-carry-the-story",
    nodeIds: ["valmiki", "lava", "kusha", "rama", "ayodhya"],
    moment: {
      id: "lava-kusha-carry-the-story",
      decisiveChange: {
        en: "A composed epic becomes a living performance and returns, through two young singers, to Rama himself.",
        hi: "रचा हुआ महाकाव्य दो युवा गायकों के माध्यम से जीवित प्रस्तुति बनकर स्वयं राम के सामने लौटता है।",
      },
      beats: [
        {
          id: "valmiki-needs-voices",
          title: { en: "A story is unfinished until someone can carry it", hi: "कथा तब तक अधूरी है जब तक कोई उसे आगे न ले जाए" },
          narration: {
            en: "After composing the Ramayana, Valmiki asks a practical question: who can bring so vast a work before real audiences? Lava and Kusha arrive at the hermitage with strong memories, musical ability, disciplined study, and the patience to learn meaning rather than merely recite sound.",
            hi: "रामायण की रचना के बाद वाल्मीकि एक व्यावहारिक प्रश्न पूछते हैं—इतनी विशाल कथा को वास्तविक श्रोताओं तक कौन ले जाएगा? लव और कुश आश्रम में ऐसी स्मृति, संगीत-कौशल, अनुशासन और धैर्य के साथ आते हैं जो उन्हें केवल ध्वनि नहीं, अर्थ सीखने योग्य बनाता है।",
          },
          visualCue: "A mountain of composed leaves narrows into two attentive young faces as Valmiki tests rhythm, memory, and understanding.",
          characterIds: ["valmiki", "lava", "kusha"],
        },
        {
          id: "story-learns-music-and-feeling",
          title: { en: "The epic learns how to move an audience", hi: "महाकाव्य श्रोताओं के मन तक पहुँचना सीखता है" },
          narration: {
            en: "The brothers learn melody, measure, expression, movement, and the changing emotional colours of love, grief, humour, anger, fear, and courage. Performance is not decoration here; it is the technology that makes thousands of connected events graspable and memorable.",
            hi: "दोनों भाई स्वर, ताल, अभिव्यक्ति, गति और प्रेम, शोक, हास्य, क्रोध, भय तथा वीरता के बदलते भाव सीखते हैं। यहाँ प्रस्तुति सजावट नहीं है; वही साधन है जो हजारों जुड़ी घटनाओं को समझने और याद रखने योग्य बनाता है।",
          },
          visualCue: "Musical phrases transform into scenes and emotions around the singers, showing performance as a portal into the story world.",
          characterIds: ["lava", "kusha", "valmiki"],
        },
        {
          id: "hermitages-become-first-audiences",
          title: { en: "The first listeners know they have heard something vast", hi: "पहले श्रोता समझते हैं कि उन्होंने कुछ विशाल सुना है" },
          narration: {
            en: "Lava and Kusha sing before gatherings of sages. Listeners are moved, praise the clarity and beauty of the telling, and offer the young performers the simple possessions available in hermitage life. The gifts show a story already travelling through relationship, not through royal command.",
            hi: "लव और कुश ऋषियों की सभाओं में गाते हैं। श्रोता कथा की स्पष्टता और सौंदर्य से प्रभावित होकर उनकी प्रशंसा करते हैं और आश्रम-जीवन में उपलब्ध साधारण वस्तुएँ भेंट देते हैं। ये उपहार दिखाते हैं कि कथा राजाज्ञा से नहीं, मानवीय संबंधों के सहारे यात्रा करने लगी है।",
          },
          visualCue: "A circle of listeners expands from one hermitage to many as humble gifts collect beside the two singers.",
          characterIds: ["lava", "kusha"],
        },
        {
          id: "rama-hears-his-own-life",
          title: { en: "The song reaches the person inside it", hi: "गीत उस व्यक्ति तक पहुँचता है जिसकी यह कथा है" },
          narration: {
            en: "In Ayodhya, Rama notices the two ascetic-looking singers and brings them before his brothers and counsellors. As they begin, the court is captivated and Rama recognises signs of royalty in them; the epic's frame closes on a startling encounter between a life, its retelling, and the people who do not yet understand every bond joining them.",
            hi: "अयोध्या में राम इन तपस्वी-वेशधारी गायकों को देखते हैं और उन्हें भाइयों तथा मंत्रियों की सभा में बुलाते हैं। गीत आरंभ होते ही दरबार मंत्रमुग्ध हो जाता है और राम उनमें राजवंश के संकेत पहचानते हैं; कथा का आरंभ एक विचित्र मिलन पर ठहरता है—जीवन, उसकी पुनर्कथा और वे लोग, जो अभी उन्हें जोड़ने वाले सभी संबंध नहीं जानते।",
          },
          visualCue: "The singers stand in a royal hall while their story-world surrounds Rama, who listens from inside the very life being sung.",
          characterIds: ["lava", "kusha", "rama", "lakshmana", "bharata", "shatrughna"],
        },
      ],
    },
  },
];
