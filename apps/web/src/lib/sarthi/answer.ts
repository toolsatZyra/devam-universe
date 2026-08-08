import type { GroundedSarthiAnswer, SarthiRequest, SarthiUnavailable } from "./contracts";
import { answerGaneshaPreview } from "./ganesha-preview";
import { answerHeroPreview } from "./hero-preview";
import { answerRamcharitmanasPreview } from "./ramcharitmanas-preview";
import { answerReviewedRamayanaReflection } from "./ramayana-reflection";
import { resolvePracticeGuidance } from "../practice/practice-guidance";

const GANESHA_RITUAL_BOUNDARY = "Internal-beta West India Smarta household synthesis; not a universal Ganesh Puja vidhi, all-regions coverage, or a substitute for an established family practice.";
const NAVARATRI_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta household synthesis; not Bengali Durga Puja, South Indian Golu, Gujarati Garba, Nepal Dashain, a fasting regimen, or a universal Navaratri procedure.";
const BENGAL_DURGA_PUJA_RITUAL_BOUNDARY = "Internal-beta Bengal Shakta participation companion across the bounded 16-21 October 2026 Kolkata campaign. It supports a source-labelled Durga remembrance, community and artistic appreciation, respect for women, service, and safe participation under family, temple, or puja-committee authority. It does not prescribe fasting, food or medicine, Bodhan, Adhivas, Navapatrika, pranapratistha, shodashopachara, anjali, bhog, Kumari Puja, Sandhi Puja timing, bali, homa, sindoor practice, immersion, water entry, priestly liturgy, live event operations, or guaranteed outcomes. Belur Math is one institutional tradition, not a universal Bengali household vidhi.";
const BENGAL_MAHASHTAMI_PARTICIPANT_BOUNDARY = "User-complete only for the named 19 October 2026 Bengal Shakta community, temple, family-puja participant or accessible remote-participant lane. It includes applicability, meaning, attributable stories, typical practice, astronomical Sandhi context, materials, substitutions, three actionable forms, variants and evidence. It does not supply priest-led liturgy, household consecration, Kumari Puja, bali, homa, one universal Bengali procedure, or a live venue schedule.";
const MASIKA_DURGASHTAMI_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Masika Durgashtami companion for four resolved September-December 2026 dates. It supports only an attributable Durga remembrance, source-labelled reading, reflection on courage and care, and a responsible act of service. It does not prescribe fasting, food or medicine, formal puja, mantra, images, offerings, aarti, Chandi recitation, homa, Kumari Puja, bali, harm, or promised outcomes. Monthly Durgashtami is not automatically Shardiya Mahashtami or Bengal Durga Puja, and every family, temple, regional, and sampradaya form remains separately attributable.";
const WEEKDAY_RITUAL_BOUNDARY = "Internal-beta West India weekday-practice synthesis. Family, kula, sampradaya, and temple custom take priority; no national-exclusive deity mapping, fast, formal mantra, astrological remedy, or planetary appeasement is prescribed.";
const DIWALI_RITUAL_BOUNDARY = "Internal-beta West India Lakshmi Puja household synthesis. It does not merge Bengali Kali Puja, South Indian Deepavali, Jain Diwali, Bandi Chhor Divas, Nepal Tihar, Dhanvantari practice, or every family sequence; it supplies neither a precise formal muhurta nor guaranteed wealth outcomes.";
const CHHATH_RITUAL_BOUNDARY = "Internal-beta Bihar/Purvanchal family-participation synthesis for the exact Patna and Delhi reference profiles. It does not prescribe fasting or nirjala practice, determine medical suitability, replace the parvaitin or family guide, or claim every Bihar, eastern Uttar Pradesh, Nepal, and diaspora variant.";
const VASU_BARAS_RITUAL_BOUNDARY = "Internal-beta Maharashtra Vasu Baras family-participation synthesis for the resolved Mumbai reference lane. Its default is no-contact gratitude: it does not instruct independent animal feeding, touching, washing, restraining, decoration, close photography, flame use near animals, purchase, sale, gifting, fasting, dairy or wheat abstention, or a guaranteed outcome. Any live-animal participation remains under the owner or trained keeper; Gujarat Wagh Baras, Bachha Baras, Guru Dwadashi, Nandini Vrat, and other regional forms remain separate.";
const NARAKA_CHATURDASHI_RITUAL_BOUNDARY = "Internal-beta Maharashtra Naraka Chaturdashi/Abhyanga Snan household synthesis for the resolved Mumbai moonrise-to-sunrise lane. It supports a safe family-led bath and Narakasura-victory remembrance, but does not require sesame oil, ubtan, karita, new clothes, purchases, food, flame, or fireworks; it supplies no medical advice or guaranteed outcome. Kali Chaudas and Tamil Deepavali remain separate.";
const KALI_CHAUDAS_BAPS_RITUAL_BOUNDARY = "Internal-beta BAPS Gujarat Kali Chaudash family- or mandir-participation synthesis for the resolved Ahmedabad lane. It supports only an already-known prayer, reading, Hanuman remembrance, quiet reflection, and seva; it does not create a formal Hanuman Puja, mantra, tantric, occult, exorcistic, chilli-lemon, smoke, harm, fast, offering, or protection rite. Maharashtra Naraka Chaturdashi, Tamil Deepavali, Bengali Kali Puja, and non-BAPS Gujarati family traditions remain separate.";
const DHANTRAYODASHI_RITUAL_BOUNDARY = "Internal-beta North/West India Dhantrayodashi household synthesis. It requires no purchase, supplies no financial or medical advice, promises no wealth or health outcome, does not calculate the provider's Sthir-Lagna muhurta, and keeps Yama Deepam separate.";
const YAMA_DEEPAM_RITUAL_BOUNDARY = "Internal-beta North/West India Yama Deepam household synthesis. It supports one safe outside-home evening light but does not require a south-facing lamp, fixed lamp count or material, formal mantra or tarpan, unattended or overnight burning, a precise provider muhurta, or any guaranteed protection or longevity outcome; Dhantrayodashi remains separate.";
const TAMIL_DEEPAVALI_RITUAL_BOUNDARY = "Internal-beta Tamil/South India Smarta household synthesis for the resolved Chennai reference lane. It supports a family-led pre-sunrise bath but does not require sesame oil for everyone, prescribe medical suitability or a hot-water/herbal formula, recommend fireworks or purchases, promise an outcome, or merge North/West Naraka Chaturdashi or Lakshmi Puja.";
const BENGAL_KALI_PUJA_RITUAL_BOUNDARY = "Internal-beta Bengali Shakta home, temple, and public-puja participation synthesis for the resolved Kolkata reference lane. It does not supply formal priestly mantras, tantric or initiatory instruction, bali instruction, a prescribed fast or all-night vigil, one fixed deity or offering list, or one universal Bengali procedure; Lakshmi Puja remains separate.";
const BALI_PRATIPADA_RITUAL_BOUNDARY = "Internal-beta Maharashtra Smarta Bali Pratipada/Diwali Padwa family-participation synthesis for the resolved Mumbai reference lane. It supports King Bali remembrance and joyful family time, but does not require a wife-to-husband or spouse rite, fixed image, flame, gift, spending, business-account ritual, fast, or promised prosperity; Govardhana/Annakut, Gujarati or BAPS New Year, and South Indian Balipadyami remain separate.";
const GUJARATI_NEW_YEAR_BAPS_RITUAL_BOUNDARY = "Internal-beta BAPS Gujarati New Year/Bestu Varash family- or mandir-participation synthesis for the resolved Ahmedabad lane. It supports familiar prayer, gratitude, greetings, seva, optional rangoli, and one simple home offering only where already established; it does not require a large Annakut, formal thal, aarti or mantra, business-account rite, purchases, gifts, sweets, new clothes, flame, or promise of prosperity. Bali Pratipada, Govardhana Puja, South Indian Balipadyami, non-BAPS Gujarati practice, and other Hindu New Years remain separate.";
const KARNATAKA_BALIPADYAMI_RITUAL_BOUNDARY = "Internal-beta Karnataka Smarta Bali Padyami family- or temple-participation synthesis for the resolved Bengaluru lane. It supports family-known Bali-Vamana remembrance, generosity, care, optional rangoli or representation, and service; it does not require clay or cow dung, lamps, abhisheka, mantra, food, fast, gift, purchase, or promise of prosperity. Maharashtra Bali Pratipada, BAPS New Year, Govardhana Puja, coastal Karnataka variants, and other South Indian traditions remain separate.";
const KARNATAKA_SARASWATI_AYUDHA_RITUAL_BOUNDARY = "User-complete only for the bounded 20 October 2026 Bengaluru/Karnataka Smarta household and established-programme participant lane. It supports Saraswati learning remembrance, gratitude for responsible skill and work, and only safe inactive familiar household items. It does not prescribe formal mantra, consecration, homa, Vahana Puja, temple or workplace procedure, machinery shutdown or restart, Gombe Habba, purchases, fasting, flame, or guaranteed learning, safety, or prosperity outcomes; every family and regional variant remains separate.";
const JAIN_DIWALI_RITUAL_BOUNDARY = "Internal-beta umbrella Jain Diwali reflection for the resolved 8 November evening lane. It supports Mahavira-liberation remembrance and reflection on ahimsa, anekantavada, restraint, non-attachment, and self-effort; it does not prescribe fasting, pratikraman, puja, mantra, scripture, Nirvan Ladoo, temple procedure, lamps, fireworks, or a guaranteed spiritual outcome. Shvetambar, Digambar, Sthanakvasi, Terapanth, Shrimad Rajchandra, sangh, temple, and family procedures remain distinct; 9 November Nirvan/Digambar and 10 November New Year calendar variants remain preserved.";
const BANDI_CHHOR_RITUAL_BOUNDARY = "Internal-beta Sikh Bandi Chhor Divas remembrance and participation synthesis for the official SGPC 8 November 2026 lane. It supports the source-grounded Guru Hargobind and 52-rulers remembrance, collective freedom, and one practical act of seva or solidarity. It does not invent paath, kirtan, ardas, Hukamnama, langar, lighting, donation, or gurdwara procedure; the established gurdwara, Sikh institution, or family directs those practices. Hindu and Jain Diwali lanes remain separate.";
const AHOI_ASHTAMI_RITUAL_BOUNDARY = "Internal-beta Delhi/North India Ahoi Ashtami family synthesis for the resolved 1 November 2026 evening. It supports Mata Ahoi remembrance, inclusive wellbeing of all children, gratitude, and one practical act of care. It does not prescribe a fast or nirjala regimen, supply medical advice, restrict the observance to mothers or sons, require one image, story, star or moon rule, or promise longevity, protection, merit, or success.";
const KARWA_CHAUTH_RITUAL_BOUNDARY = "Internal-beta Delhi/North India Karwa Chauth family synthesis for the resolved 29 October 2026 moonrise lane. It supports mutual care, gratitude, family-known prayer or story, and an optional safe moonrise close. It does not prescribe or manage fasting, supply medical advice, restrict participation by gender or marital status, require Sargi, Bayaa, thali, karwa, sieve, water offering, gifts, flame, food, clothing, or a spouse-fed close, merge Punjab and Uttar Pradesh forms, or promise health, longevity, marriage, merit, protection, or success.";
const SANKASHTI_CHATURTHI_RITUAL_BOUNDARY = "Internal-beta West India Smarta recurring Sankashti Chaturthi synthesis for the four September-December 2026 records. It supports Ganesha remembrance, an optional attributable reading, reflection on an obstacle, one responsible next action, and an optional safe location-specific moonrise close. It does not prescribe or manage fasting, reuse another city's moonrise, require moon sighting, temple attendance, offerings, a katha, mantra, arghya, flame, or food, merge Ganesh Chaturthi or Karwa Chauth, or promise obstacle removal, success, protection, merit, or another outcome.";
const MASIKA_SHIVARATRI_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Masika Shivaratri devotional companion for four resolved September-December 2026 nights. It supports family-known Shiva remembrance, attributable study, reflection, service, and temple-led participation while keeping Somnath's programme attributable. It does not prescribe fasting, food, health suitability, abhisheka ingredients, a home lingam procedure, formal mantra or aarti, night vigil, parana, or promised outcomes, and it does not turn annual Mahashivaratri practice into a monthly requirement.";
const PRADOSHA_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Pradosha remembrance for eight resolved September-December 2026 Krishna- and Shukla-paksha evenings. It preserves regional stories and institutional temple programmes as attributable contexts only. It does not prescribe fasting, food, health advice, abhisheka, lingam or Nandi procedure, mantra, offering, aarti, pradakshina, puja muhurta, parana, planetary remedies, or promised outcomes.";
const LUNAR_CALENDAR_DAY_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta companion for three resolved generic Purnima and four resolved generic Amavasya calendar days. Purnima and Amavasya remain distinct, and every coincident named festival, vrata, temple, Darsha, shraddha, tarpan, ancestor, Diwali, Kojagara, Kartika, and Dev Deepawali procedure stays separately attributable. It prescribes no fasting, food, health advice, ritual bathing, moon worship, offering, mantra, or outcome. Margashirsha Purnima remains unresolved and unsupported.";
const GOVARDHANA_PUJA_RITUAL_BOUNDARY = "Internal-beta ISKCON Vaishnava Govardhana Puja participation synthesis for the exact 2026 reference lane. It supports remembrance, prayer or kirtan, and a simple vegetarian household offering where already established; it does not require a large Annakut, formal mantra, Go Puja or cow contact, fasting, long or barefoot parikrama, or merge Bali Pratipada and BAPS New Year practice.";
const BHAI_DOOJ_RITUAL_BOUNDARY = "Internal-beta North India Smarta Bhai Dooj household synthesis for the resolved Delhi reference lane. It supports consensual family-known tika, prayer, and shared food while requiring no fixed tilak recipe, real flame, gift, spending, fast, gendered protection promise, or guaranteed outcome; Bhau Beej, Bhai Phota, Bhai Tika, and Bihar Yama Dvitiya remain separate.";
const TULASI_VIVAH_RITUAL_BOUNDARY = "Internal-beta Tulasi Vivah participation synthesis. The general November 21 Dwadashi lane and the BAPS November 21-24 sequence remain separate. It does not prescribe fasting, formal wedding liturgy, plant plucking or ingestion, purchases, gender roles, or guaranteed marriage, fertility, health, or prosperity outcomes.";
const DEV_DEEPAWALI_RITUAL_BOUNDARY = "Internal-beta Varanasi Dev Deepawali reflection and participation synthesis for the exact Kartika Purnima lane. Generic Kartika Purnima and BAPS Dev Diwali remain separate. It does not instruct ritual bathing, river entry, floating lamps or offerings, fireworks, boats, live crowd or travel operations, formal Ganga Aarti or priestly liturgy, fasting, or guaranteed purification, merit, protection, or outcomes.";
const GITA_JAYANTI_RITUAL_BOUNDARY = "Internal-beta Gita Jayanti reading and reflection synthesis on the bounded 20 December 2026 Mokshada Ekadashi date lane. It requires an attributable user-selected edition and keeps source verse, translation, commentary, and personal application separate. It does not prescribe fasting, parana, temple worship, complete recitation, one universal commentary, or a guaranteed spiritual or worldly outcome.";
const EKADASHI_RITUAL_BOUNDARY = "Internal-beta non-fasting devotional companion for seven named September-December 2026 Ekadashi observances in three exact Smarta city-region profiles and one ISKCON lane. It preserves different Smarta and Vaishnava dates, supports family-known Vishnu or Krishna remembrance, attributable study, restraint, and service, and does not prescribe food, fasting, nirjala practice, medical suitability, Smarta parana, one universal mantra or katha, or a guaranteed outcome. Mokshada Ekadashi and its Gita Jayanti reading path remain separate.";
const KRISHNA_JANMASHTAMI_RITUAL_BOUNDARY = "Internal-beta shared non-fasting devotional companion with separate Smarta North/West India and ISKCON lanes on the independently resolved 2026 calendar profiles. The matching Delhi civil date does not equate their rules. It does not prescribe fasting, food, health advice, exact muhurta, a midnight vigil, abhisheka, aarti, offerings, cradle or murti rites, footprints, Dahi Handi participation, parana, purchases, or promised outcomes; family, sampradaya, and temple authorities retain their own procedures.";
const HARTALIKA_TEEJ_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Hartalika Teej companion for the bounded September 14 Delhi lane. It supports attributable Parvati-Shiva remembrance, family-known story, song or prayer, and acts of respect and care. It does not prescribe fasting, food or health rules, formal sankalpa, katha, puja, mantra, offerings, eligibility by gender or marital status, adornment or purchases, or promised marriage, progeny, longevity, prosperity, or family outcomes. Hariyali Teej, Kajari Teej, Gowri Habba, Nepal, and other regional forms remain separate.";
const RISHI_PANCHAMI_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Rishi Panchami learning and gratitude companion for the bounded September 15 Delhi lane. It supports source-attributable Saptarishi remembrance, study, gratitude to teachers, careful inquiry, and knowledge service while acknowledging that lists and interpretations vary. It does not prescribe fasting, diet, bathing, ingestion, formal puja, mantra, offering, atonement, or outcomes; it does not describe menstruation or any person as impure, restrict participation to women, or merge Bhai Panchami and other regional or Nepal traditions.";
const RADHA_ASHTAMI_RITUAL_BOUNDARY = "Internal-beta ISKCON India Radha Ashtami remembrance and participation companion for the bounded September 19 calendar lane. It supports attributable Radharani appearance-day teaching, prayer, song or kirtan, selfless seva reflection, and participation through the user's own official ISKCON temple. It does not prescribe fasting or food, medical guidance, abhisheka, arati, homa, deity dressing, offerings, kalashas, flowers, formal puja, sponsorship, purchases, Bangalore programme times elsewhere, or promised mercy, perfection, protection, merit, or other outcomes. Other Gaudiya Vaishnava, Vaishnava, Smarta, regional, and family traditions remain separate.";
const KOJAGARA_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Kojagara / Sharad Purnima reflection for the bounded October 25 Delhi Nishita lane. It supports attributable Lakshmi, Krishna/Raas, harvest, music, prayer, moonlit-family, and community contexts only after the user's regional identity is known. It does not prescribe fasting, food or health rules, formal Lakshmi Puja, moon worship, arati, deepdaan, offerings, an all-night vigil, gambling, medicinal moonlight, unsafe food or flame, or guaranteed wealth, health, merit, or protection. Bengali Kojagari Lakshmi Puja and the October 26 sunrise-based Ashwina Purnima lane remain separate.";
const ANANTA_CHATURDASHI_RITUAL_BOUNDARY = "Internal-beta North/West India Smarta Ananta Chaturdashi remembrance for the bounded September 25 lane. It supports an attributable Ananta/Vishnu reading, reflection on continuity, and one responsible commitment. It does not prescribe fasting, food, medicine, formal puja, kalasha, serpent image, mantra, offerings, homa, a fourteen-knot thread or its handling, or guaranteed prosperity, recovery, merit, protection, or other outcomes. Ananta-vrata and Ganesh Visarjan share this civil date but remain separate ritual identities.";
const KALABHAIRAVA_RITUAL_BOUNDARY = "Internal-beta North India Smarta and Kashi regional Kalabhairava Jayanti remembrance for the bounded December 1 lane. It supports an attributable Shiva/Bhairava reading, courage, discipline, responsible guardianship, and safe temple participation. It does not prescribe fasting, food or medicine, formal puja, mantra, tantra, oil, thread, offerings, alcohol, meat, animal offerings, harm, occult or exorcistic rites, fear-based protection, night vigil, unsafe travel, or guaranteed outcomes. Kashi's guardian identity is regional context, not a universal home procedure.";
const VIVAHA_PANCHAMI_RITUAL_BOUNDARY = "Internal-beta North India Smarta Vivaha Panchami remembrance for the bounded December 14 lane. It supports a source-labelled Rama-Sita marriage reading, reflection on mutual respect and responsibility, and safe participation in an established family, temple, or public programme. It does not prescribe fasting, food or medicine, a wedding reenactment, formal puja, mantra, offerings, procession, vow, live event operations, or guaranteed marriage, spouse, fertility, progeny, prosperity, merit, or other outcomes. Janakpur, Ayodhya, and Orchha remain distinct contexts, and no one Ramayana version is universalized.";
const VISHWAKARMA_PUJA_RITUAL_BOUNDARY = "User-complete only for the bounded 17 September 2026 Bengal Vishwakarma Puja home, artisan and workplace-participation lane. It supports safe preparation, gratitude for skill and labour, and source-bounded prayer, flowers or sweets. It supplies no universal puja muhurta or formal liturgy, never authorises touching or decorating active machinery, and does not generalise Bengal Kanya Sankranti to every regional Vishwakarma observance.";
const SANKRANTI_RITUAL_BOUNDARY = "User-complete only for the bounded general personal September-December 2026 Sankranti lane. Its four Delhi/India civil dates are resolved, but exact punya kala and any fuller family, temple or regional procedure require the user's location and responsible authority. It does not prescribe fasting, food, medical advice, formal mantra, arghya, unsafe bathing, or promised outcomes, and it keeps Bengal Vishwakarma Puja and Karnataka Kaveri Sankramana separately attributable.";
const PITRU_PAKSHA_RITUAL_BOUNDARY = "User-complete only for the bounded Delhi 2026 Smarta Pitru Paksha personal-remembrance and formal-practice preparation lane. It does not decide personal ancestor applicability, death-tithi, performer eligibility, Kutup/Rohina/Aparahna timing, mantra, pinda, tarpana, food, donation or priestly procedure, and it guarantees no pitru-dosha, curse, liberation, prosperity or ancestor-satisfaction outcome. Family and responsible religious authority control the formal rite.";

const WEEKDAY_QUERIES = [
  { slug: "weekday-ravivara", needles: ["sunday", "ravivar", "ravivara", "रविवार"] },
  { slug: "weekday-somavara", needles: ["monday", "somvar", "somavara", "सोमवार"] },
  { slug: "weekday-mangalavara", needles: ["tuesday", "mangalvar", "mangalavara", "मंगलवार"] },
  { slug: "weekday-budhavara", needles: ["wednesday", "budhvar", "budhavara", "बुधवार"] },
  { slug: "weekday-guruvara", needles: ["thursday", "guruvar", "guruvara", "brihaspativar", "गुरुवार", "बृहस्पतिवार"] },
  { slug: "weekday-shukravara", needles: ["friday", "shukravar", "shukravara", "शुक्रवार"] },
  { slug: "weekday-shanivara", needles: ["saturday", "shanivar", "shanivara", "शनिवार"] },
] as const;

function includesAny(value: string, needles: readonly string[]) {
  return needles.some((needle) => value.includes(needle));
}

function isHindi(request: SarthiRequest) {
  return request.context?.languageCode?.toLowerCase().startsWith("hi") === true || /[\u0900-\u097f]/.test(request.message);
}

export function answerSarthi(request: SarthiRequest): GroundedSarthiAnswer | SarthiUnavailable {
  const query = request.message.toLocaleLowerCase("en");
  const hindi = isHindi(request);
  const ritualIntent = includesAny(query, [
    "practise", "practice", "worship", "ritual", "puja", "pooja", "what should i do", "what do i do", "fast", "fasting", "vrat", "vrata", "parana",
    "पूजा", "विधि", "क्या करूँ", "क्या करें", "कैसे करें", "उपवास", "व्रत", "पारण",
  ]);
  const contextualReference = ritualIntent || includesAny(query, [
    "this", "here", "what am i looking at", "tell me simply", "why is it relevant",
    "यह", "इसके बारे", "यहाँ", "सरल भाषा",
  ]);
  const explicitlyDurga = includesAny(query, ["durga", "navaratri", "navratri", "devi", "दुर्गा", "नवरात्रि", "देवी"]);
  const explicitlyRamayana = includesAny(query, ["ramayana", "rāmāyaṇa", "valmiki", "vālmīki", "रामायण", "वाल्मीकि"]);
  const explicitlyGanesha = includesAny(query, ["ganesh", "ganapati", "gaṇapati", "गणेश", "गणपति"]);
  const explicitlyNamesHeroSubject = explicitlyDurga || explicitlyRamayana || explicitlyGanesha;
  const usesAtlasContext = (slug: "durga" | "ramayana" | "ganesha") =>
    request.context?.atlasNodeSlug === slug && contextualReference && !explicitlyNamesHeroSubject;
  const vishwakarmaContext = includesAny(query, ["vishwakarma", "viswakarma", "bishwakarma", "biswakarma", "विश्वकर्मा", "বিশ্বকর্মা"]);
  if (vishwakarmaContext && ritualIntent) {
    const queryBengal = includesAny(query, ["bengal", "west bengal", "kolkata", "calcutta", "बंगाल", "कोलकाता", "বাংলা", "কলকাতা"]);
    const savedPair = request.context?.regionCode === "bengal" && request.context?.traditionCode === "regional-bengal";
    const queryPair = queryBengal
      && (request.context?.traditionCode === undefined || request.context.traditionCode === "regional-bengal")
      && (request.context?.regionCode === undefined || request.context.regionCode === "bengal");
    if (!savedPair && !queryPair) {
      const followUpQuestion = hindi
        ? "आप किस शहर या क्षेत्र में हैं, और क्या आपका परिवार या कार्यस्थल बंगाल की कन्या संक्रांति वाली विश्वकर्मा पूजा मानता है?"
        : "Which city or region are you in, and does your family or workplace follow Bengal's Kanya Sankranti Vishwakarma Puja?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: `${hindi ? "विश्वकर्मा पूजा की तिथि और कार्यस्थल-विधि अलग क्षेत्रों और समुदायों में बदल सकती है, इसलिए मैं बंगाल की विधि अपने-आप सब पर लागू नहीं करूँगा।" : "Vishwakarma Puja dates and workplace practices differ across regions and communities, so I will not automatically apply the Bengal form everywhere."} ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: VISHWAKARMA_PUJA_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({
      observanceSlug: "vishwakarma-puja-bengal",
      languageCode: hindi ? "hi" : "en",
      regionCode: "bengal",
      traditionCode: "regional-bengal",
    });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आप घर पर कर रहे हैं, किसी छोटी कार्यशाला में, कार्यालय में या कारखाने/सामुदायिक पूजा में—और मशीन बंद करने व दोबारा चलाने का जिम्मेदार व्यक्ति कौन है?"
        : "Are you observing at home, in a small workshop, an office, or a factory/community puja—and who is responsible for equipment shutdown and restart?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: `${result.guide.summary} ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: VISHWAKARMA_PUJA_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const sankrantiRoutes = [
    { slug: "kanya-sankranti", needles: ["kanya sankranti", "kanya sankramana", "कन्या संक्रांति"] },
    { slug: "tula-sankranti", needles: ["tula sankranti", "tula sankramana", "तुला संक्रांति"] },
    { slug: "vrishchika-sankranti", needles: ["vrishchika sankranti", "vrischika sankranti", "वृश्चिक संक्रांति"] },
    { slug: "dhanu-sankranti", needles: ["dhanu sankranti", "dhanu sankramana", "धनु संक्रांति"] },
  ] as const;
  const sankrantiRoute = sankrantiRoutes.find((route) => includesAny(query, route.needles));
  if (sankrantiRoute && ritualIntent) {
    const result = resolvePracticeGuidance({
      observanceSlug: sankrantiRoute.slug,
      languageCode: hindi ? "hi" : "en",
      regionCode: "general-india",
      traditionCode: "family-specific-hindu",
    });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आप किस शहर में हैं, और क्या आपके परिवार, मंदिर या स्थानीय पंचांग में इस संक्रांति की कोई परिचित विधि या पुण्यकाल है?"
        : "Which city are you in, and does your family, temple, or local Panchang have a familiar procedure or punya kala for this Sankranti?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: `${result.guide.summary} ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: SANKRANTI_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const pitruPakshaRoutes = [
    { slug: "sarva-pitru-amavasya", needles: ["sarva pitru amavasya", "mahalaya amavasya", "सर्वपितृ अमावस्या", "महालय अमावस्या"] },
    { slug: "maha-bharani", needles: ["maha bharani", "महा भरणी"] },
    { slug: "magha-shraddha", needles: ["magha shraddha", "मघा श्राद्ध"] },
    { slug: "purnima-shraddha", needles: ["purnima shraddha", "पूर्णिमा श्राद्ध"] },
    { slug: "pratipada-shraddha", needles: ["pratipada shraddha", "प्रतिपदा श्राद्ध"] },
    { slug: "dwitiya-shraddha", needles: ["dwitiya shraddha", "द्वितीया श्राद्ध"] },
    { slug: "tritiya-shraddha", needles: ["tritiya shraddha", "तृतीया श्राद्ध"] },
    { slug: "chaturthi-shraddha", needles: ["chaturthi shraddha", "चतुर्थी श्राद्ध"] },
    { slug: "panchami-shraddha", needles: ["panchami shraddha", "पंचमी श्राद्ध", "पञ्चमी श्राद्ध"] },
    { slug: "shashthi-shraddha", needles: ["shashthi shraddha", "षष्ठी श्राद्ध"] },
    { slug: "saptami-shraddha", needles: ["saptami shraddha", "सप्तमी श्राद्ध"] },
    { slug: "ashtami-shraddha", needles: ["ashtami shraddha", "अष्टमी श्राद्ध"] },
    { slug: "navami-shraddha", needles: ["navami shraddha", "नवमी श्राद्ध"] },
    { slug: "dashami-shraddha", needles: ["dashami shraddha", "दशमी श्राद्ध"] },
    { slug: "ekadashi-shraddha", needles: ["ekadashi shraddha", "एकादशी श्राद्ध"] },
    { slug: "dwadashi-shraddha", needles: ["dwadashi shraddha", "द्वादशी श्राद्ध"] },
    { slug: "trayodashi-shraddha", needles: ["trayodashi shraddha", "त्रयोदशी श्राद्ध"] },
    { slug: "chaturdashi-shraddha", needles: ["chaturdashi shraddha", "चतुर्दशी श्राद्ध"] },
  ] as const;
  const pitruContext = includesAny(query, ["pitru paksha", "pitra paksha", "mahalaya paksha", "shraddha", "shradh", "shraadh", "पितृ पक्ष", "श्राद्ध"]);
  if (pitruContext && ritualIntent) {
    const queryNorth = includesAny(query, ["delhi", "north india", "northern india", "दिल्ली", "उत्तर भारत"]);
    const savedPair = request.context?.regionCode === "north-india" && request.context?.traditionCode === "smarta-north-india";
    if (!savedPair && !queryNorth) {
      const followUpQuestion = hindi
        ? "आप किस शहर और पंचांग-परंपरा में हैं, और क्या आपके परिवार में मृत्यु-तिथि तथा श्राद्ध-विधि बताने वाले कोई बड़े या पुरोहित हैं?"
        : "Which city and Panchang tradition apply, and does your family have an elder or priest who can confirm the death-tithi and established Shraddha procedure?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: `${hindi ? "पितृ पक्ष की तिथि, पूर्वज की मृत्यु-तिथि, कर्ता और विधि परिवार तथा परंपरा पर निर्भर हैं; मैं दिल्ली की तिथि या एक सामान्य क्रम अपने-आप आप पर लागू नहीं करूँगा।" : "Pitru Paksha dates, the ancestor's death-tithi, performer and procedure depend on family and tradition, so I will not automatically apply the Delhi calendar or a generic formal rite to you."} ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: PITRU_PAKSHA_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const observanceSlug = pitruPakshaRoutes.find((route) => includesAny(query, route.needles))?.slug ?? "pitru-paksha-general";
    const result = resolvePracticeGuidance({ observanceSlug, languageCode: hindi ? "hi" : "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "क्या आप केवल व्यक्तिगत स्मरण चाहते हैं, परिवार की स्थापित विधि की तैयारी, या पुरोहित-निर्देशित कर्म में सहभागी होने की सहायता?"
        : "Would you like a private remembrance, help preparing for the family's established practice, or help participating in a priest-directed rite without leading it?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${result.guide.summary} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: PITRU_PAKSHA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const janmashtamiContext = includesAny(query, ["janmashtami", "janmasthami", "gokulashtami", "gokul ashtami", "krishnashtami", "krishna ashtami", "जन्माष्टमी", "गोकुलाष्टमी", "कृष्णाष्टमी"]);
  if (janmashtamiContext && ritualIntent) {
    const savedTradition = request.context?.traditionCode;
    const queryIskcon = includesAny(query, ["iskcon", "इस्कॉन"]);
    const querySmarta = includesAny(query, ["smarta", "स्मार्त"]);
    const savedIskcon = savedTradition === "vaishnava-iskcon";
    const savedSmarta = savedTradition === "smarta-north-india" || savedTradition === "smarta-west-india";
    const conflictingLane = (queryIskcon && savedSmarta) || (querySmarta && savedIskcon);
    const lane = conflictingLane ? null : (savedIskcon || queryIskcon) ? "iskcon" : (savedSmarta || querySmarta) ? "smarta" : null;
    const savedRegion = request.context?.regionCode;
    const queryWest = includesAny(query, ["west india", "western india", "maharashtra", "mumbai", "gujarat", "पश्चिम भारत", "महाराष्ट्र", "मुंबई", "गुजरात"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश"]);
    const smartaRegion = savedRegion === "west-india" || queryWest ? "west-india" : savedRegion === "north-india" || queryNorth ? "north-india" : null;
    if (!lane || (lane === "smarta" && !smartaRegion)) {
      const followUpQuestion = hindi
        ? "क्या आपका परिवार उत्तर/पश्चिम भारत की स्मार्त जन्माष्टमी परम्परा मानता है, या इस्कॉन वैष्णव परम्परा? स्मार्त होने पर अपना शहर या क्षेत्र भी बताइए।"
        : "Does your family follow a North/West India Smarta Janmashtami tradition or an ISKCON Vaishnava tradition? If Smarta, which city or region applies?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "जन्माष्टमी की तिथि और विधि परम्परा के अनुसार बदल सकती है। 2026 में एक नागरिक तिथि मिलने से स्मार्त और इस्कॉन नियम समान सिद्ध नहीं होते, इसलिए मैं कोई एक क्रम नहीं चुनूँगा।" : "Janmashtami date rules and procedures can differ by tradition. A matching 2026 civil date does not make the Smarta and ISKCON rules equivalent, so I will not choose one sequence for you."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KRISHNA_JANMASHTAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const observanceSlug = lane === "iskcon" ? "krishna-janmashtami-iskcon" : "krishna-janmashtami-smarta";
    const regionCode = lane === "iskcon" ? "iskcon-india" : smartaRegion!;
    const traditionCode = lane === "iskcon" ? "vaishnava-iskcon" : smartaRegion === "west-india" ? "smarta-west-india" : "smarta-north-india";
    const result = resolvePracticeGuidance({ observanceSlug, languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "क्या आपके परिवार या इस्कॉन मंदिर में कोई परिचित भजन, पाठ या कार्यक्रम है जिसे इस सरल रूप के साथ रखना चाहिए?"
        : "Is there a family-known bhajan, reading, or ISKCON temple programme that should guide this simple form?";
      const answer = hindi
        ? "कृष्ण-जन्म का संक्षिप्त स्मरण करें, किसी पहचाने हुए ग्रन्थ या परम्परा से छोटा अंश पढ़ें, चाहें तो परिवार-परिचित भजन या कीर्तन गाएँ, और सत्य, देखभाल या सेवा का एक काम चुनें। देवम उपवास, आहार-नियम, मुहूर्त, मध्यरात्रि-जागरण, अभिषेक, आरती, अर्पण, पालना, मूर्ति-सज्जा, पदचिह्न या पारण निर्धारित नहीं करता। दही-हांडी अलग सामुदायिक और सुरक्षा-सन्दर्भ है; इस मार्गदर्शिका के आधार पर मानव-पिरामिड न बनाएँ और न उसमें शामिल हों।"
        : "Begin with a brief remembrance of Krishna's birth, read a short passage from an identified text or tradition, sing a family-known bhajan or kirtan if helpful, and choose one act of truthfulness, care, or service. Devam does not prescribe fasting, food rules, muhurta, a midnight vigil, abhisheka, aarti, offerings, cradle rites, murti dressing, footprints, or parana. Dahi Handi is a separate community and safety context; do not build or join a human pyramid on this guide's authority.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KRISHNA_JANMASHTAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const genericTeejContext = includesAny(query, ["teej", "तीज"]);
  const hartalikaContext = includesAny(query, ["hartalika", "haritalika", "हरतालिका", "हरितालिका"]);
  if (genericTeejContext && ritualIntent) {
    if (!hartalikaContext) {
      const followUpQuestion = hindi ? "क्या आप हरतालिका तीज, हरियाली तीज, कजरी तीज, गौरी हब्बा या किसी दूसरी क्षेत्रीय तीज के बारे में पूछ रहे हैं?" : "Do you mean Hartalika Teej, Hariyali Teej, Kajari Teej, Gowri Habba, or another regional Teej?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "तीज एक ही सार्वभौमिक पर्व या विधि का नाम नहीं है, इसलिए मैं उन्हें एक क्रम में नहीं मिलाऊँगा।" : "Teej does not name one universal festival or procedure, so I will keep its regional traditions separate."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: HARTALIKA_TEEJ_RITUAL_BOUNDARY, followUpQuestion };
    }
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryWest = includesAny(query, ["west india", "western india", "maharashtra", "mumbai", "rajasthan", "पश्चिम भारत", "महाराष्ट्र", "मुंबई", "राजस्थान"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "haryana", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश", "हरियाणा"]);
    const regionCode = savedRegion === "west-india" || queryWest ? "west-india" : savedRegion === "north-india" || queryNorth ? "north-india" : null;
    const matchingTradition = (regionCode === "west-india" && savedTradition === "smarta-west-india") || (regionCode === "north-india" && savedTradition === "smarta-north-india");
    if (!regionCode || !matchingTradition) {
      const followUpQuestion = hindi ? "आप किस शहर या क्षेत्र में हैं, और क्या आपका परिवार उत्तर या पश्चिम भारत की स्मार्त हरतालिका परम्परा मानता है?" : "Which city or region are you in, and does your family follow a North or West India Smarta Hartalika tradition?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "हरतालिका की कथा, उपवास, पूजा और समापन परिवार तथा क्षेत्र के अनुसार बदलते हैं, इसलिए मैं बिना सन्दर्भ के कोई क्रम नहीं चुनूँगा।" : "Hartalika story, fasting, puja, and closing practices vary by family and region, so I will not choose a sequence without that context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: HARTALIKA_TEEJ_RITUAL_BOUNDARY, followUpQuestion };
    }
    const traditionCode = regionCode === "west-india" ? "smarta-west-india" : "smarta-north-india";
    const result = resolvePracticeGuidance({ observanceSlug: "hartalika-teej", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके परिवार में कोई परिचित तीज कथा, गीत, प्रार्थना, मंदिर या सामुदायिक कार्यक्रम है?" : "Does your family already have a familiar Teej story, song, prayer, temple, or community programme?";
      const answer = hindi
        ? "परिवार-परिचित कथा, छोटी प्रार्थना या मौन से पार्वती के दृढ़ संकल्प और शिव-पार्वती सम्बन्ध का स्मरण करें। चाहें तो परिचित तीज गीत रखें और परस्पर सम्मान, स्वायत्तता, धैर्य या देखभाल का एक काम चुनें। ऐप उपवास शुरू, जारी या समाप्त नहीं कराता; औपचारिक पूजा, श्रृंगार, झूला, उपहार, मिठाई या वैवाहिक और पारिवारिक फल भी अनिवार्य या गारंटी नहीं हैं।"
        : "Remember Parvati's resolve and the Shiva-Parvati relationship through a family-known story, short prayer, or silence. Add a familiar Teej song if it belongs to your practice, then choose one act of mutual respect, agency, patience, or care. The app does not start, continue, or break a fast; formal puja, adornment, swings, gifts, sweets, and marital or family outcomes are neither required nor guaranteed.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: HARTALIKA_TEEJ_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const rishiPanchamiContext = includesAny(query, ["rishi panchami", "rushi panchami", "ऋषि पंचमी", "ऋषिपंचमी"]);
  if (rishiPanchamiContext && ritualIntent) {
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryWest = includesAny(query, ["west india", "western india", "maharashtra", "mumbai", "rajasthan", "पश्चिम भारत", "महाराष्ट्र", "मुंबई", "राजस्थान"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "haryana", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश", "हरियाणा"]);
    const regionCode = savedRegion === "west-india" || queryWest ? "west-india" : savedRegion === "north-india" || queryNorth ? "north-india" : null;
    const matchingTradition = (regionCode === "west-india" && savedTradition === "smarta-west-india") || (regionCode === "north-india" && savedTradition === "smarta-north-india");
    if (!regionCode || !matchingTradition) {
      const followUpQuestion = hindi ? "आप किस शहर या क्षेत्र में हैं, और आपका परिवार या सम्प्रदाय कौन-सी ऋषि पंचमी तथा सप्तर्षि परम्परा मानता है?" : "Which city or region are you in, and which Rishi Panchami and Saptarishi tradition does your family or sampradaya follow?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "ऋषि पंचमी की सप्तर्षि-सूचियाँ और पारिवारिक विधियाँ अलग हो सकती हैं, इसलिए मैं बिना सन्दर्भ के एक रूप सब पर लागू नहीं करूँगा।" : "Rishi Panchami Saptarishi lists and family practices can differ, so I will not apply one form without context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: RISHI_PANCHAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const traditionCode = regionCode === "west-india" ? "smarta-west-india" : "smarta-north-india";
    const result = resolvePracticeGuidance({ observanceSlug: "rishi-panchami", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपके परिवार में कौन-सी सप्तर्षि-सूची, कथा, ग्रन्थ या गुरु-परम्परा परिचित है?" : "Which Saptarishi list, story, text, or teacher lineage is familiar in your family?";
      const answer = hindi
        ? "अपनी परम्परा की सप्तर्षि-सूची से स्मरण करें, या ज्ञान आगे लाने वाले ऋषियों और गुरुओं के प्रति कृतज्ञता रखें। किसी पहचाने हुए स्रोत से एक छोटी शिक्षा पढ़ें और अध्ययन, सत्यापित स्रोत साझा करने, शिक्षण या पुस्तकालय-सहयोग का एक काम चुनें। यह मार्गदर्शिका उपवास, स्नान, सेवन या औपचारिक पूजा निर्धारित नहीं करती और मासिक धर्म या किसी व्यक्ति को अशुद्ध नहीं कहती; भाई पंचमी अलग है।"
        : "Remember the Saptarishis through the list your tradition uses, or honour the sages and teachers who carried knowledge forward. Read one short teaching from an identified source and choose one act of study, sharing a verified source, mentoring, or supporting a library. This guide does not prescribe fasting, bathing, ingestion, or formal puja and does not describe menstruation or any person as impure; Bhai Panchami is separate.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: RISHI_PANCHAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const radhaAshtamiContext = includesAny(query, ["radha ashtami", "radhashtami", "radha-ashtami", "radhastami", "राधाष्टमी", "राधा अष्टमी"]);
  if (radhaAshtamiContext && ritualIntent) {
    const queryIskcon = includesAny(query, ["iskcon", "इस्कॉन"]);
    const savedIskcon = request.context?.traditionCode === "vaishnava-iskcon";
    if (!queryIskcon && !savedIskcon) {
      const followUpQuestion = hindi
        ? "आप किस वैष्णव सम्प्रदाय, मंदिर या पारिवारिक परम्परा में राधाष्टमी मानते हैं—क्या वह इस्कॉन है?"
        : "Which Vaishnava sampradaya, temple, or family tradition do you follow for Radha Ashtami—is it ISKCON?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "राधाष्टमी की शिक्षा, उपवास, विग्रह-सेवा, पूजा और समय अलग वैष्णव परम्पराओं में एक जैसे नहीं माने जा सकते, इसलिए मैं अपने आप इस्कॉन विधि नहीं चुनूँगा।" : "Radha Ashtami teaching, fasting, deity service, puja, and timing cannot be assumed identical across Vaishnava traditions, so I will not assign the ISKCON form automatically."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: RADHA_ASHTAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "radha-ashtami-iskcon", languageCode: hindi ? "hi" : "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "क्या आपका कोई परिचित इस्कॉन मंदिर, गुरु, ग्रन्थ, गीत या आधिकारिक कार्यक्रम है जिसे आप इस स्मरण से जोड़ना चाहते हैं?"
        : "Is there a familiar ISKCON temple, teacher, text, song, or official programme you want to connect with this remembrance?";
      const answer = hindi
        ? "श्रीमती राधारानी के प्राकट्य-दिवस का स्मरण किसी पहचानी हुई इस्कॉन शिक्षा, छोटी प्रार्थना या परिचित कीर्तन से करें। निःस्वार्थ सेवा पर विचार करें और आज दया या सेवा का एक ठोस काम चुनें। उपवास, विग्रह-पूजा, अभिषेक, आरती, अर्पण और समय अपने मंदिर या स्थापित पारिवारिक निर्देश से ही लें; इस मार्गदर्शिका में किसी फल की गारंटी नहीं है।"
        : "Remember Srimati Radharani's appearance day through an identified ISKCON teaching, a short prayer, or a familiar kirtan. Reflect on selfless seva and choose one concrete act of kindness or service today. Take fasting, deity worship, abhisheka, arati, offerings, and timing only from your temple or established family guidance; this companion guarantees no outcome.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: RADHA_ASHTAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const kojagaraContext = includesAny(query, ["kojagara", "kojagari", "kojagiri", "sharad purnima", "कोजागरा", "कोजागरी", "कोजागिरी", "शरद पूर्णिमा"]);
  if (kojagaraContext && ritualIntent) {
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryWest = includesAny(query, ["west india", "western india", "maharashtra", "mumbai", "gujarat", "पश्चिम भारत", "महाराष्ट्र", "मुंबई", "गुजरात"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "madhya pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश", "मध्य प्रदेश"]);
    const queryBengal = includesAny(query, ["bengal", "bengali", "kolkata", "बंगाल", "बंगाली", "कोलकाता"]);
    const bengalContext = savedRegion === "bengal" || savedTradition === "shakta-bengal" || queryBengal;
    const regionCode = savedRegion === "west-india" || queryWest ? "west-india" : savedRegion === "north-india" || queryNorth ? "north-india" : null;
    const matchingTradition = (regionCode === "west-india" && savedTradition === "smarta-west-india") || (regionCode === "north-india" && savedTradition === "smarta-north-india");
    if (bengalContext || !regionCode || !matchingTradition) {
      const followUpQuestion = hindi
        ? "आपका परिवार इसे शरद पूर्णिमा, कोजागिरी/कोजागरा, बंगाली कोजागरी लक्ष्मी पूजा, कृष्ण-रास, नई फसल या किसी दूसरी क्षेत्रीय परम्परा के रूप में कैसे मानता है, और आप किस क्षेत्र में हैं?"
        : "Does your family observe this as Sharad Purnima, Kojagiri/Kojagara, Bengali Kojagari Lakshmi Puja, Krishna-Raas, a harvest custom, or another regional form—and which region are you in?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "इस पूर्णिमा की लक्ष्मी, कृष्ण/रास, नई फसल, चाँदनी, मंदिर और सामुदायिक परम्पराएँ एक सार्वभौमिक विधि नहीं हैं। बंगाली कोजागरी लक्ष्मी पूजा के लिए मैं उत्तर/पश्चिम भारत का घरेलू रूप नहीं दूँगा।" : "The Lakshmi, Krishna/Raas, harvest, moonlit, temple, and community traditions on this full moon are not one universal procedure. I will not serve the North/West household form for Bengali Kojagari Lakshmi Puja."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KOJAGARA_RITUAL_BOUNDARY, followUpQuestion };
    }
    const traditionCode = regionCode === "west-india" ? "smarta-west-india" : "smarta-north-india";
    const result = resolvePracticeGuidance({ observanceSlug: "kojagara-puja-sharad-purnima", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आपके परिवार में लक्ष्मी, कृष्ण/रास, नई फसल, गीत, प्रार्थना, दूध/खीर या स्थानीय कार्यक्रम में से कौन-सा रूप परिचित है?"
        : "Which form is familiar in your family: Lakshmi, Krishna/Raas, harvest, song, prayer, milk/kheer, or a local programme?";
      const answer = hindi
        ? "अपने परिवार की क्षेत्रीय पहचान का नाम लेकर कृतज्ञता, छोटी परिचित प्रार्थना या स्रोत-स्पष्ट पाठ से आरम्भ करें। सुरक्षित हो तो रात के आकाश को कुछ समय देखें, या घर के भीतर चिन्तन करें, और बाँटने या देखभाल का एक काम चुनें। दूध या खीर केवल परिवार में परिचित हो तो सामान्य खाद्य-सुरक्षा के साथ वैकल्पिक है—वह औषधि नहीं। यह मार्गदर्शिका उपवास, पूरी रात जागरण, औपचारिक लक्ष्मी पूजा, जुआ, चाँदनी से स्वास्थ्य-लाभ या समृद्धि की गारंटी नहीं देती।"
        : "Name your family's regional identity, then begin with gratitude, a familiar short prayer, or an attributable reading. If safe, spend a little time noticing the night sky—or reflect indoors—and choose one act of sharing or household care. Milk or kheer is optional only where already familiar and should follow ordinary food safety; it is not medicine. This guide does not prescribe fasting, an all-night vigil, formal Lakshmi Puja, gambling, health benefits from moonlight, or guaranteed prosperity.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KOJAGARA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const anantaContext = includesAny(query, ["ananta chaturdashi", "anant chaturdashi", "ananta-chaturdashi", "ananta vrata", "anant vrata", "अनन्त चतुर्दशी", "अनंत चतुर्दशी", "अनन्त व्रत", "अनंत व्रत"]);
  if (anantaContext && ritualIntent) {
    const visarjanIntent = includesAny(query, ["visarjan", "immersion", "विसर्जन"]);
    const vrataIntent = includesAny(query, ["ananta vrata", "anant vrata", "vishnu", "अनन्त व्रत", "अनंत व्रत", "विष्णु", "puja", "पूजा", "observe", "मनाएँ", "मानें"]);
    if (!visarjanIntent && !vrataIntent) {
      const followUpQuestion = hindi ? "आप अनन्त-व्रत/विष्णु-स्मरण, गणेश विसर्जन या दोनों के बारे में पूछ रहे हैं?" : "Do you mean Ananta-vrata/Vishnu remembrance, Ganesh Visarjan, or both?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "अनन्त-स्मरण और गणेश विसर्जन इस तिथि पर साथ आ सकते हैं, पर वे एक ही अनुष्ठान नहीं हैं।" : "Ananta remembrance and Ganesh Visarjan can share this date, but they are not the same ritual."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: ANANTA_CHATURDASHI_RITUAL_BOUNDARY, followUpQuestion };
    }
    if (visarjanIntent && !vrataIntent) {
      const followUpQuestion = hindi ? "क्या यह गणेश प्रतिमा का विसर्जन है, और आप किस शहर तथा पारिवारिक या सामुदायिक गणेशोत्सव परम्परा में हैं?" : "Is this a Ganesha image immersion, and which city and family or community Ganeshotsav tradition applies?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "यह प्रश्न गणेश विसर्जन का है, इसलिए मैं इसे अनन्त-व्रत की विधि में नहीं मिलाऊँगा; सुरक्षा और पर्यावरण निर्देश अलग गणेश मार्गदर्शिका और स्थानीय प्राधिकरण से लेने चाहिए।" : "This is a Ganesh Visarjan question, so I will not fold it into an Ananta-vrata procedure; use the separate Ganesha guide and local safety and environmental directions."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: ANANTA_CHATURDASHI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryWest = includesAny(query, ["west india", "western india", "maharashtra", "mumbai", "पश्चिम भारत", "महाराष्ट्र", "मुंबई"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश"]);
    const regionCode = savedRegion === "west-india" || queryWest ? "west-india" : savedRegion === "north-india" || queryNorth ? "north-india" : null;
    const matchingTradition = (regionCode === "west-india" && savedTradition === "smarta-west-india") || (regionCode === "north-india" && savedTradition === "smarta-north-india");
    if (!regionCode || !matchingTradition) {
      const followUpQuestion = hindi ? "आप किस क्षेत्र में हैं और आपका परिवार, मंदिर या सम्प्रदाय कौन-सी अनन्त परम्परा मानता है?" : "Which region are you in, and which family, temple, or sampradaya Ananta tradition do you follow?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "अनन्त-कथा, व्रत, सूत्र और पूजा अलग परम्पराओं में बदलते हैं, इसलिए मैं बिना सन्दर्भ के एक रूप सब पर लागू नहीं करूँगा।" : "Ananta stories, vrata, thread practice, and puja vary across traditions, so I will not apply one form without context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: ANANTA_CHATURDASHI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const traditionCode = regionCode === "west-india" ? "smarta-west-india" : "smarta-north-india";
    const result = resolvePracticeGuidance({ observanceSlug: "ananta-chaturdashi", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपके परिवार में कौन-सी अनन्त-कथा, प्रार्थना, ग्रन्थ या गुरु-परम्परा परिचित है?" : "Which Ananta story, prayer, text, or teacher lineage is familiar in your family?";
      const answer = hindi ? "अपने परिवार या सम्प्रदाय की समझ के अनुसार अनन्त/विष्णु का स्मरण करें और किसी पहचाने स्रोत से छोटा पाठ या परिचित प्रार्थना लें। धैर्य माँगने वाले एक उचित संकल्प का नाम लें और आज का एक छोटा जिम्मेदार कदम चुनें। उपवास, सूत्र, मंत्र, प्रतिमा, कलश, अर्पण और औपचारिक पूजा केवल स्थापित पारिवारिक या मंदिर-निर्देश से लें; कोई फल गारंटी नहीं है। गणेश विसर्जन हो तो उसकी अलग मार्गदर्शिका और स्थानीय सुरक्षा निर्देश मानें।" : "Remember Ananta/Vishnu as your family or sampradaya understands the name, using a short identified reading or familiar prayer. Name one worthy commitment that needs patience and choose one small responsible action today. Take fasting, thread, mantra, image, kalasha, offerings, and formal puja only from established family or temple guidance; no outcome is guaranteed. If you also observe Ganesh Visarjan, use its separate guide and local safety directions.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: ANANTA_CHATURDASHI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const kalabhairavaContext = includesAny(query, ["kalabhairava", "kala bhairava", "kaal bhairav", "kal bhairav", "bhairava ashtami", "कालभैरव", "काल भैरव", "भैरव अष्टमी"]);
  if (kalabhairavaContext && ritualIntent) {
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryKashi = includesAny(query, ["kashi", "varanasi", "banaras", "काशी", "वाराणसी", "बनारस"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश"]);
    const kashiPair = (savedRegion === "kashi-varanasi" || queryKashi) && savedTradition === "regional-kashi-varanasi";
    const northPair = (savedRegion === "north-india" || queryNorth) && savedTradition === "smarta-north-india";
    if (!kashiPair && !northPair) {
      const followUpQuestion = hindi ? "आप किस क्षेत्र में हैं और आपका परिवार, मंदिर या सम्प्रदाय कौन-सा भैरव-रूप और रीति मानता है?" : "Which region are you in, and which Bhairava form and family, temple, or sampradaya practice do you follow?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "भैरव के रूप, कथाएँ, मंत्र, अर्पण और मंदिर-विधियाँ अलग परम्पराओं में बदलती हैं; काशी की रीति अपने आप सब पर लागू नहीं होती।" : "Bhairava forms, stories, mantras, offerings, and temple procedures vary across traditions; Kashi practice does not automatically apply everywhere."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KALABHAIRAVA_RITUAL_BOUNDARY, followUpQuestion };
    }
    const regionCode = kashiPair ? "kashi-varanasi" : "north-india";
    const traditionCode = kashiPair ? "regional-kashi-varanasi" : "smarta-north-india";
    const result = resolvePracticeGuidance({ observanceSlug: "kalabhairava-jayanti", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपके परिवार या मंदिर में कौन-सा भैरव-रूप, कथा, ग्रन्थ, प्रार्थना या गुरु-परम्परा परिचित है?" : "Which Bhairava form, story, text, prayer, or teacher lineage is familiar in your family or temple?";
      const answer = hindi ? "भैरव को शिव-रूप मानकर परिचित प्रार्थना या छोटे स्रोत-स्पष्ट पाठ से स्मरण करें। एक भय का नाम लें जिसका जिम्मेदारी से सामना करना है और साहस, अनुशासन, सुरक्षा या देखभाल का एक ठोस काम चुनें। उपवास, मंत्र, तन्त्र, तेल, सूत्र, अर्पण और औपचारिक पूजा केवल स्थापित परिवार या मंदिर से लें; हानि, नशीले पदार्थ, पशु-अर्पण, भूत-प्रेत या सुरक्षा-फल की कोई विधि न अपनाएँ। मंदिर जाएं तो वर्तमान समय, प्रवेश और भीड़ स्थानीय रूप से जाँचें।" : "Remember Bhairava as a form of Shiva through a familiar prayer or short identified reading. Name one fear you can face responsibly, then choose one concrete act of courage, discipline, safety, or care. Take fasting, mantra, tantra, oil, thread, offerings, and formal puja only from an established family or temple; adopt no harmful, intoxicant, animal-offering, occult, exorcistic, or promised-protection rite. If visiting a temple, verify current hours, access, and crowd conditions locally.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KALABHAIRAVA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const vivahaPanchamiContext = includesAny(query, ["vivaha panchami", "vivah panchami", "vivaha-panchami", "vivah-panchami", "विवाह पंचमी"]);
  if (vivahaPanchamiContext && ritualIntent) {
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "ayodhya", "mithila", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश", "अयोध्या", "मिथिला"]);
    const supportedPair = (savedRegion === "north-india" || queryNorth) && savedTradition === "smarta-north-india";
    if (!supportedPair) {
      const followUpQuestion = hindi ? "आप किस क्षेत्र, परिवार, मंदिर या सम्प्रदाय की विवाह पंचमी परम्परा मानते हैं, और कौन-सा रामायण-संस्करण या कथा परिचित है?" : "Which regional, family, temple, or sampradaya Vivaha Panchami practice do you follow, and which Ramayana version or katha is familiar?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "जनकपुर, अयोध्या और ओरछा के उत्सव तथा रामायण के विवाह-विवरण अलग सन्दर्भ रखते हैं, इसलिए मैं बिना सन्दर्भ के एक ही विधि सब पर लागू नहीं करूँगा।" : "Janakpur, Ayodhya, and Orchha celebrations and Ramayana marriage accounts carry distinct contexts, so I will not apply one procedure without context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: VIVAHA_PANCHAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "vivaha-panchami", languageCode: hindi ? "hi" : "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपके परिवार में कौन-सा रामायण-पाठ, विवाह-कथा, प्रार्थना या गीत परिचित है?" : "Which Ramayana passage, marriage katha, prayer, or song is familiar in your family?";
      const answer = hindi ? "राम-सीता विवाह का एक छोटा, पहचाना स्रोत पढ़ें या परिचित पारिवारिक प्रार्थना करें। आज सुनने, ईमानदारी, परस्पर सम्मान, पारिवारिक देखभाल या जिम्मेदारी निभाने का एक ठोस काम चुनें। उपवास, मंत्र, अर्पण, विवाह-अभिनय और औपचारिक पूजा केवल स्थापित परिवार, मंदिर या पुरोहित से लें; विवाह, सन्तान या समृद्धि के फल की कोई गारंटी नहीं है।" : "Read one short, identified account of Rama and Sita's marriage or use a familiar family prayer. Choose one concrete act of listening, honesty, mutual respect, family care, or keeping a responsibility today. Take fasting, mantra, offerings, reenactment, and formal puja only from an established family, temple, or priest; no marriage, fertility, or prosperity outcome is guaranteed.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: VIVAHA_PANCHAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const weekdayQuery = WEEKDAY_QUERIES.find((candidate) => includesAny(query, [...candidate.needles]));
  if (weekdayQuery && (ritualIntent || includesAny(query, ["day", "today", "वार", "आज", "observe", "मनाएँ", "मानें"]))) {
    const west = request.context?.regionCode === "west-india" || includesAny(query, [
      "west india", "western india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई",
    ]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-west-india";
    if (!west || !supportedTradition) {
      const followUpQuestion = hindi
        ? "आप किस क्षेत्र और पारिवारिक या सम्प्रदायिक परम्परा का पालन करते हैं? क्या आपके घर में इस वार का कोई परिचित देवता, व्रत या पाठ है?"
        : "Which region and family or sampradaya practice do you follow? Does your home already connect this weekday with a deity, vrata, or familiar reading?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `वार की उपासना परिवार और क्षेत्र के अनुसार बदलती है, इसलिए मैं एक ही क्रम सब पर लागू नहीं करूँगा। ${followUpQuestion}`
          : `Weekday practice varies by family and region, so I will not apply one sequence to everyone. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: WEEKDAY_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }

    const result = resolvePracticeGuidance({
      observanceSlug: weekdayQuery.slug,
      languageCode: hindi ? "hi" : "en",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
    });
    if (result.status === "ritual_procedure_available") {
      const minimum = result.guide.tiers[0];
      const instructions = minimum.steps.map((step) => step.instruction).join(" ");
      const followUpQuestion = hindi
        ? "क्या आपके परिवार में इस वार का कोई अलग देवता, पाठ या व्रत प्रचलित है?"
        : "Does your family keep a different deity, reading, or vrata for this weekday?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: `${instructions} ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: WEEKDAY_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const chhathContext = includesAny(query, ["chhath", "surya shashthi", "chhathi maiya", "छठ", "सूर्य षष्ठी", "छठी मैया"]);
  if (chhathContext && ritualIntent) {
    const supportedRegion = request.context?.regionCode === "bihar-purvanchal" || includesAny(query, ["bihar", "patna", "purvanchal", "eastern uttar pradesh", "बिहार", "पटना", "पूर्वांचल"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "surya-chhath-bihar-purvanchal";
    if (!supportedRegion || !supportedTradition) {
      const followUpQuestion = hindi
        ? "आप बिहार, पूर्वांचल, नेपाल या किसी प्रवासी पारिवारिक परम्परा से जुड़ते हैं—और आप स्थापित परवैतिन हैं, सहयोगी हैं या पहली बार भाग ले रहे हैं?"
        : "Do you follow a Bihar, Purvanchal, Nepal, or diaspora family tradition—and are you the established parvaitin, a helper, or joining for the first time?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `छठ का कठिन चार-दिवसीय क्रम परिवार और समुदाय की जीवित परम्परा से चलता है, इसलिए मैं पहले आपका सन्दर्भ जानना चाहूँगा। ${followUpQuestion}`
          : `Chhath's demanding four-day observance is guided by living family and community practice, so I should understand your role before suggesting a sequence. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: CHHATH_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({
      observanceSlug: "chhath-puja-sandhya-arghya",
      languageCode: hindi ? "hi" : "en",
      regionCode: "bihar-purvanchal",
      traditionCode: "surya-chhath-bihar-purvanchal",
    });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आप परवैतिन हैं, परिवार के सहयोगी हैं या पहली बार जुड़ रहे हैं—और आपके घर का क्रम कौन बताता है?"
        : "Are you the parvaitin, supporting the family, or joining for the first time—and who guides your household's sequence?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `यदि आप पहली बार जुड़ रहे हैं, तो अपने-आप कठिन या निर्जला व्रत आरम्भ न करें। परवैतिन से अपनी भूमिका पूछें, पूजा और घाट की स्वच्छ व सुरक्षित तैयारी में सहायता दें, संध्या अर्घ्य में परिवार की रीति से जुड़ें और अगली सुबह उषा अर्घ्य व प्रसाद-वितरण में साथ रहें। ${followUpQuestion}`
          : `If you are new to Chhath, do not begin a strict or nirjala fast on your own. Ask the parvaitin how you can help, support a clean and safe worship or ghat setup, join the family's Sandhya Arghya, and return for Usha Arghya and prasad the next morning. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: CHHATH_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const vasuBarasContext = includesAny(query, ["vasu baras", "vasubaras", "govatsa dwadashi", "govatsa", "वसुबारस", "गोवत्स द्वादशी", "गोवत्स"]);
  if (vasuBarasContext && ritualIntent) {
    const maharashtra = request.context?.regionCode === "west-india" || includesAny(query, ["maharashtra", "mumbai", "महाराष्ट्र", "मुंबई"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-west-india";
    if (!maharashtra || !supportedTradition) {
      const followUpQuestion = hindi
        ? "क्या आपका परिवार महाराष्ट्र की वसुबारस मानता है, या गुजरात की वाघ बारस, बछ बारस, गुरु द्वादशी, नन्दिनी व्रत अथवा कोई दूसरी क्षेत्रीय परम्परा?"
        : "Does your family follow Maharashtra Vasu Baras, Gujarat Wagh Baras, Bachha Baras, Guru Dwadashi, Nandini Vrat, or another regional tradition?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `गोवत्स से जुड़ी परम्पराएँ क्षेत्र और परिवार के अनुसार बदलती हैं, इसलिए मैं एक महाराष्ट्र क्रम को सब पर लागू नहीं करूँगा। ${followUpQuestion}`
          : `Govatsa-related observances vary by region and family, so I will not apply one Maharashtra sequence to everyone. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: VASU_BARAS_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "govatsa-dwadashi", languageCode: hindi ? "hi" : "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आपका परिवार इसे वसुबारस कहता है या गोवत्स द्वादशी, और क्या आप घर पर मानते हैं या किसी परिचित पशु-देखभालकर्ता के साथ?"
        : "Does your family call this Vasu Baras or Govatsa Dwadashi, and do you observe at home or with a known animal keeper?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `सरल रूप में गायों, बछड़ों, किसानों, पशु-देखभालकर्ताओं, पोषण और उत्तरदायी देखभाल के लिए छोटी प्रार्थना या मौन कृतज्ञता रखें और भोजन की बर्बादी घटाने जैसा एक काम चुनें। जीवित पशु आवश्यक नहीं है। खेत या गोशाला में केवल मालिक या प्रशिक्षित देखभालकर्ता के निर्देश मानें; स्वयं से पशु को न खिलाएँ, न छुएँ, न नहलाएँ, न सजाएँ और उसके पास लौ न जलाएँ। व्रत, आहार-प्रतिबन्ध, खरीद या समृद्धि का वादा इस मार्गदर्शन का भाग नहीं है। ${followUpQuestion}`
          : `Remember cows, calves, farmers, animal caregivers, nourishment, and responsible care with a short prayer or quiet gratitude, then choose one practical act such as reducing food waste. No live animal is needed. At a farm or gaushala, follow only the owner or trained keeper; do not independently feed, touch, wash, decorate, or light a flame near an animal. This guidance requires no fast, diet rule, purchase, or prosperity promise. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: VASU_BARAS_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const kaliChaudasContext = includesAny(query, ["kali chaudas", "kali chaudash", "kali chaudasa", "kalo chaudash", "काली चौदस", "काली चौदश"]);
  if (kaliChaudasContext && ritualIntent) {
    const baps = request.context?.traditionCode === "swaminarayan-baps" || includesAny(query, ["baps", "swaminarayan", "स्वामीनारायण"]);
    const gujarat = request.context?.regionCode === "baps-gujarat" || includesAny(query, ["gujarat", "ahmedabad", "गुजरात", "अहमदाबाद"]);
    const incompatibleSavedContext =
      (request.context?.traditionCode !== undefined && request.context.traditionCode !== "swaminarayan-baps") ||
      (request.context?.regionCode !== undefined && request.context.regionCode !== "baps-gujarat");
    if (!baps || !gujarat || incompatibleSavedContext) {
      const followUpQuestion = hindi
        ? "क्या आप BAPS/स्वामीनारायण गुजरात परम्परा, किसी दूसरी गुजराती पारिवारिक काली चौदस, महाराष्ट्र नरक चतुर्दशी, तमिल दीपावली या बंगाल काली पूजा की बात कर रहे हैं?"
        : "Do you mean BAPS/Swaminarayan Gujarat, another Gujarati family Kali Chaudas, Maharashtra Naraka Chaturdashi, Tamil Deepavali, or Bengal Kali Puja?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `इन पास-पास आने वाली परम्पराओं की विधियाँ एक जैसी नहीं हैं, इसलिए मैं BAPS क्रम को सब पर लागू नहीं करूँगा। ${followUpQuestion}`
          : `These adjacent traditions are not interchangeable, so I will not apply the BAPS lane to everyone. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: KALI_CHAUDAS_BAPS_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({
      observanceSlug: "kali-chaudas-baps",
      languageCode: hindi ? "hi" : "en",
      regionCode: "baps-gujarat",
      traditionCode: "swaminarayan-baps",
    });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आपके परिवार या BAPS मंदिर में कौन-सी प्रार्थना, पाठ, हनुमान-स्मरण या सेवा पहले से परिचित है?"
        : "Which prayer, reading, Hanuman remembrance, or seva is already familiar in your family or BAPS mandir?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `परिवार या BAPS मंदिर की परिचित छोटी प्रार्थना, पाठ या हनुमान-स्मरण रखें; कुछ परिचित न हो तो मौन चिंतन करें। फिर साहस, भक्ति और हानिकारक आचरण पर विजय को व्यक्त करने वाला सेवा या मेल-मिलाप का एक काम चुनें। स्वयं से मंत्र, तांत्रिक या झाड़-फूँक की क्रिया न जोड़ें और अलौकिक सुरक्षा का वादा न करें। महाराष्ट्र नरक चतुर्दशी, तमिल दीपावली और बंगाल काली पूजा अलग हैं। ${followUpQuestion}`
          : `Use a short prayer, reading, or Hanuman remembrance already known in your family or BAPS mandir; if none is known, keep a quiet reflection. Then choose one act of seva or reconciliation that expresses courage, devotion, and overcoming harmful conduct. Do not add self-directed mantra, tantric, occult, or exorcistic practices, and do not promise supernatural protection. Maharashtra Naraka Chaturdashi, Tamil Deepavali, and Bengal Kali Puja remain separate. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: KALI_CHAUDAS_BAPS_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const narakaChaturdashiContext = includesAny(query, ["naraka chaturdashi", "narak chaturdashi", "choti diwali", "abhyanga snan", "abhyang snan", "नरक चतुर्दशी", "छोटी दिवाली", "अभ्यंग स्नान"]);
  if (narakaChaturdashiContext && ritualIntent) {
    const maharashtra = request.context?.regionCode === "west-india" || includesAny(query, ["maharashtra", "mumbai", "महाराष्ट्र", "मुंबई"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-west-india";
    if (!maharashtra || !supportedTradition) {
      const followUpQuestion = hindi
        ? "क्या आप महाराष्ट्र का अभ्यंग स्नान, गुजरात की काली चौदस, तमिल दीपावली या कोई दूसरी पारिवारिक परम्परा मानते हैं?"
        : "Does your family follow Maharashtra Abhyanga Snan, Gujarat Kali Chaudas, Tamil Deepavali, or another regional tradition?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `एक ही तिथि पर क्षेत्रीय विधियाँ अलग हैं, इसलिए मैं महाराष्ट्र का स्नान-क्रम सब पर लागू नहीं करूँगा। ${followUpQuestion}` : `Regional practices on this tithi are different, so I will not apply the Maharashtra bathing sequence to everyone. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: NARAKA_CHATURDASHI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "naraka-chaturdashi", languageCode: hindi ? "hi" : "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके घर में तेल, उबटन, करीत, कथा, भोजन या बुज़ुर्ग का आशीर्वाद परिचित रीति से होता है?" : "Does your household have a familiar oil, ubtan, karita, story, food, or elder-blessing custom?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `Today की स्थानीय चन्द्रोदय-से-सूर्योदय सीमा लें। स्नान-स्थान सुरक्षित करें और सामान्य स्नान करें; परिचित व उपयुक्त हो तो थोड़ा पारिवारिक तेल या उबटन लें, अन्यथा उसे छोड़ दें। स्वच्छ वस्त्र पहनकर श्रीकृष्ण की नरकासुर-विजय का परिचित स्मरण रखें। तेल, उबटन, करीत, नए वस्त्र, खरीद और पटाखे अनिवार्य नहीं हैं; काली चौदस तथा तमिल दीपावली अलग हैं। ${followUpQuestion}` : `Use Today’s local moonrise-to-sunrise window. Make the bathing space safe and take a normal bath; use a little familiar family oil or ubtan only if customary and suitable, otherwise skip it. Put on clean clothes and keep the household’s known remembrance of Krishna’s victory over Narakasura. Oil, ubtan, karita, new clothes, purchases, and fireworks are not required; Kali Chaudas and Tamil Deepavali remain separate. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: NARAKA_CHATURDASHI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const yamaDeepamContext = includesAny(query, ["yama deepam", "yama deep", "yam deep", "yamadeep", "yama deepa dana", "yama deep daan", "यम दीपम", "यम दीप", "यमदीप", "यम दीपदान"]);
  const dhantrayodashiContext = includesAny(query, ["dhanteras", "dhantrayodashi", "dhanvantari trayodashi", "धनतेरस", "धनत्रयोदशी", "धन्वन्तरी त्रयोदशी"]);
  if (dhantrayodashiContext && !yamaDeepamContext && ritualIntent) {
    const north = request.context?.regionCode === "north-india" || includesAny(query, ["north india", "delhi", "uttar pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश"]);
    const west = request.context?.regionCode === "west-india" || includesAny(query, ["west india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई"]);
    const regionCode = north && !west ? "north-india" : west && !north ? "west-india" : null;
    const traditionCode = regionCode === "north-india" ? "smarta-north-india" : regionCode === "west-india" ? "smarta-west-india" : null;
    const mismatchedSavedTradition = request.context?.traditionCode !== undefined && request.context.traditionCode !== traditionCode;
    if (!regionCode || !traditionCode || mismatchedSavedTradition) {
      const followUpQuestion = hindi
        ? "आप उत्तर या पश्चिम भारत की किस पारिवारिक परम्परा का पालन करते हैं—और आपके घर में धन्वन्तरी, लक्ष्मी-कुबेर, बही-औजार या यम दीपम में कौन-सी अलग विधियाँ होती हैं?"
        : "Which North or West India family tradition do you follow—and does your home separately honour Dhanvantari, Lakshmi-Kubera, accounts or tools, or Yama Deepam?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `धनत्रयोदशी की पारिवारिक विधियाँ अलग होती हैं; मैं खरीदारी या एक देवता-समूह को सबके लिए अनिवार्य नहीं करूँगा। ${followUpQuestion}`
          : `Dhantrayodashi practices vary by family; I will not make shopping or one deity set mandatory for everyone. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: DHANTRAYODASHI_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "dhantrayodashi", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आपके परिवार का मुख्य ध्यान धन्वन्तरी, लक्ष्मी-कुबेर, आजीविका के औजार-बही या केवल सरल कृतज्ञता में से किस पर है?"
        : "Does your family centre Dhanvantari, Lakshmi-Kubera, livelihood tools or accounts, or simply a prayer of gratitude?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `सटीक औपचारिक मुहूर्त के लिए स्थानीय पंचांग लें। सरल रूप में स्थान स्वच्छ करें, स्वास्थ्य और आजीविका के प्रति कृतज्ञता रखें, परिवार के परिचित धन्वन्तरी या लक्ष्मी-कुबेर ध्यान को जल, फूल या पत्ता और फल अर्पित करें, फिर जिम्मेदार स्वास्थ्य-देखभाल, ईमानदार वित्त या साझेदारी का एक कर्म चुनें। कुछ खरीदना आवश्यक नहीं है; यम दीपम अलग विधि है। ${followUpQuestion}`
          : `Use a local calendar for a precise formal muhurta. For a simple form, clean the place, give thanks for health and livelihood, offer water, a flower or leaf, and fruit to the Dhanvantari or Lakshmi-Kubera focus your family knows, then choose one act of responsible health care, honest finances, or sharing. No purchase is required, and Yama Deepam remains separate. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: DHANTRAYODASHI_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  if (yamaDeepamContext && ritualIntent) {
    const north = request.context?.regionCode === "north-india" || includesAny(query, ["north india", "delhi", "uttar pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश"]);
    const west = request.context?.regionCode === "west-india" || includesAny(query, ["west india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई"]);
    const regionCode = north && !west ? "north-india" : west && !north ? "west-india" : null;
    const traditionCode = regionCode === "north-india" ? "smarta-north-india" : regionCode === "west-india" ? "smarta-west-india" : null;
    const mismatchedSavedTradition = request.context?.traditionCode !== undefined && request.context.traditionCode !== traditionCode;
    if (!regionCode || !traditionCode || mismatchedSavedTradition) {
      const followUpQuestion = hindi
        ? "आप उत्तर या पश्चिम भारत की किस पारिवारिक परम्परा का पालन करते हैं—और क्या आपके घर में यम दीप का स्थान, दिशा, संख्या या प्रार्थना पहले से तय है?"
        : "Which North or West India family tradition do you follow—and does your household already have a known Yama Deepa placement, direction, lamp count, or prayer?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `यम दीप की विस्तृत रीति घर के अनुसार बदल सकती है, इसलिए मैं दिशा, दीप-संख्या या निश्चित फल अपने-आप नहीं जोड़ूँगा। ${followUpQuestion}`
          : `Fuller Yama Deepam customs can vary by household, so I will not invent a direction, lamp count, or guaranteed result. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: YAMA_DEEPAM_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "yama-deepam", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "क्या आपके परिवार में इसके लिए कोई परिचित दिशा, दीप-संख्या या छोटी प्रार्थना है?"
        : "Does your family keep a particular placement, direction, lamp count, or short prayer for this?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `निर्धारित त्रयोदशी-संध्या में घर के बाहर सुरक्षित जगह पर एक निरंतर देखरेख वाला दीप या बिना लौ का प्रकाश रखें, यम के लिए परिचित छोटी प्रार्थना या धर्म और अपने दायित्वों पर शांत चिंतन करें, फिर लौ सुरक्षित बुझाएँ। दक्षिण दिशा या निश्चित दीप-संख्या यहाँ अनिवार्य नहीं कही गई है; दीप को अकेला या रातभर न छोड़ें और किसी निश्चित सुरक्षा या आयु की गारंटी न मानें। धनत्रयोदशी-विधि अलग है। ${followUpQuestion}`
          : `On the resolved Trayodashi evening, place one continuously supervised lamp or flame-free light at a safe spot outside the home, offer a familiar short prayer to Yama or reflect quietly on dharma and unfinished responsibilities, then extinguish the flame safely. This guide does not require a south-facing lamp or fixed count, never leaves a flame unattended or overnight, and promises no protection or longevity outcome. Dhantrayodashi remains separate. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: YAMA_DEEPAM_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const tamilDeepavaliContext = includesAny(query, ["tamil deepavali", "tamil diwali", "deepavali in tamil nadu", "deepavali in chennai", "south indian deepavali", "तमिल दीपावली", "चेन्नई दीपावली", "दक्षिण भारतीय दीपावली"]);
  if (tamilDeepavaliContext && ritualIntent) {
    const south = request.context?.regionCode === "south-india" || includesAny(query, ["tamil", "tamil nadu", "chennai", "south india", "तमिल", "तमिलनाडु", "चेन्नई", "दक्षिण भारत"]);
    const traditionCode = south ? "smarta-south-india" : null;
    const mismatched = request.context?.traditionCode !== undefined && request.context.traditionCode !== traditionCode;
    if (!south || !traditionCode || mismatched) {
      const followUpQuestion = hindi ? "क्या आप तमिल या दक्षिण भारतीय पारिवारिक परम्परा का पालन करते हैं, और क्या घर में सूर्योदय-पूर्व तेल-स्नान का क्रम ज्ञात है?" : "Do you follow a Tamil or South Indian family tradition, and does your household have a known pre-sunrise oil-bath sequence?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `तमिल दीपावली की घरेलू रीति परिवार के अनुसार बदलती है, इसलिए मैं तेल, कथा या भोजन का एक क्रम सब पर नहीं थोपूँगा। ${followUpQuestion}` : `Tamil Deepavali household practice varies by family, so I will not impose one oil, narrative, or food sequence on everyone. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: TAMIL_DEEPAVALI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "tamil-deepavali-naraka-chaturdashi", languageCode: hindi ? "hi" : "en", regionCode: "south-india", traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपके परिवार में तेल-स्नान, आशीर्वाद, प्रार्थना और पकवान का कौन-सा क्रम है?" : "What oil-bath, blessing, prayer, and food sequence does your family actually keep?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `Today में निर्धारित स्थानीय सूर्योदय-पूर्व सीमा लें। स्नान-स्थान सुरक्षित करें; प्रचलित और उपयुक्त हो तो बुज़ुर्ग थोड़ा पारिवारिक तेल आशीर्वाद के साथ लगाएँ, अन्यथा सामान्य स्नान करें। फिर स्वच्छ वस्त्र, परिचित प्रार्थना या नरकासुर-विजय का स्मरण, बुज़ुर्गों का आशीर्वाद और घर का भोजन रखें। तेल, नए वस्त्र, खरीद या पटाखे अनिवार्य नहीं हैं; उत्तर/पश्चिम की लक्ष्मी-पूजा अलग है। ${followUpQuestion}` : `Use the local pre-sunrise boundary shown by Today. Make the bathing space safe; if customary and suitable, an elder may bless and apply a small amount of the family's oil, otherwise take a normal bath. Then use clean clothes, a familiar prayer or Narakasura-victory remembrance, elders' blessings, and the household's food. Oil, new clothes, purchases, and fireworks are not requirements, and North/West Lakshmi Puja remains separate. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: TAMIL_DEEPAVALI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const kaliPujaContext = includesAny(query, ["kali puja", "shyama puja", "mahanisha puja", "bengal kali", "kolkata kali", "काली पूजा", "श्यामा पूजा", "महानिशा पूजा", "बंगाल काली"]);
  if (kaliPujaContext && ritualIntent) {
    const bengal = request.context?.regionCode === "bengal" || includesAny(query, ["bengal", "kolkata", "west bengal", "बंगाल", "कोलकाता", "पश्चिम बंगाल"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "shakta-bengal";
    if (!bengal || !supportedTradition) {
      const followUpQuestion = hindi
        ? "क्या आप स्थापित बंगाली शाक्त गृह-पूजा, मंदिर, सार्वजनिक पंडाल या निजी प्रार्थना में जुड़ रहे हैं—और पूजा का मार्गदर्शन कौन करता है?"
        : "Are you joining an established Bengali Shakta home puja, a temple, a public pandal, or praying privately—and who guides the worship?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `काली, श्यामा या महानिशा पूजा की पूरी विधि घर, मंदिर और परम्परा के अनुसार बदल सकती है; इसलिए मैं तांत्रिक, मंत्र, बलि, व्रत या जागरण का क्रम अपने-आप नहीं बनाऊँगा। ${followUpQuestion}`
          : `A full Kali, Shyama, or Mahanisha Puja can differ by household, temple, and lineage, so I will not invent tantric, mantra, bali, fasting, or vigil instructions. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: BENGAL_KALI_PUJA_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "bengal-kali-puja", languageCode: hindi ? "hi" : "en", regionCode: "bengal", traditionCode: "shakta-bengal" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आप घर, मंदिर, पंडाल या निजी प्रार्थना में हैं—और वहाँ भेंट तथा समापन कौन निर्देशित करता है?"
        : "Are you at home, a temple, a pandal, or praying privately—and who directs offerings and the close there?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `स्वच्छ और सम्मानपूर्ण स्थान रखें या स्थानीय प्रवेश व भेंट के नियम मानें। माँ काली की परिचित छोटी प्रार्थना, भक्ति-गीत या मौन स्मरण में जुड़ें और केवल वही भेंट दें जो परिवार, मंदिर या पंडाल स्वीकार करता है। तांत्रिक साधना, बलि, व्रत, जागरण या औपचारिक मंत्र अपने-आप शुरू न करें; लक्ष्मी पूजा अलग क्षेत्रीय मार्ग है। ${followUpQuestion}`
          : `Use a clean respectful place or follow the local entry and offering rules. Join a familiar short prayer to Mother Kali, devotional song, or quiet remembrance, and give only an offering accepted by the family, temple, or pandal. Do not self-start tantric practice, bali, a fast, an all-night vigil, or formal mantras; Lakshmi Puja remains a separate regional lane. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: BENGAL_KALI_PUJA_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const saraswatiAyudhaContext = includesAny(query, ["karnataka saraswati", "saraswati puja", "saraswathi pooja", "ayudha puja", "ayudha pooja", "mahanavami karnataka", "सरस्वती पूजा", "आयुध पूजा"]);
  if (saraswatiAyudhaContext && ritualIntent) {
    const karnataka = request.context?.regionCode === "south-india" || includesAny(query, ["karnataka", "bengaluru", "bangalore", "mysuru", "कर्नाटक", "बेंगलुरु", "मैसूर"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-south-india";
    if (!karnataka || !supportedTradition) {
      const followUpQuestion = hindi
        ? "आप किस शहर और पारिवारिक परंपरा में हैं—और क्या आप कर्नाटक की महानवमी सरस्वती/आयुध पूजा, किसी दूसरे दक्षिण भारतीय रूप, या बस सामान्य सरस्वती पूजा पूछ रहे हैं?"
        : "Which city and family tradition are you in—and do you mean Karnataka Mahanavami Saraswati/Ayudha Puja, another South Indian form, or Saraswati Puja more generally?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "सरस्वती और आयुध पूजा की तिथि और विधि क्षेत्र, परिवार और संस्था के अनुसार बदल सकती है, इसलिए मैं कर्नाटक का क्रम सब पर लागू नहीं करूँगा।" : "Saraswati and Ayudha Puja dates and procedures vary by region, family, and institution, so I will not apply the Karnataka lane to everyone."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KARNATAKA_SARASWATI_AYUDHA_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "karnataka-saraswati-ayudha-puja", languageCode: hindi ? "hi" : "en", regionCode: "south-india", traditionCode: "smarta-south-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "क्या आप घर पर पुस्तक/वाद्य के साथ सरल रूप चाहते हैं, परिवार की परिचित विधि, गोम्बे संदर्भ, या किसी स्कूल, मंदिर अथवा कार्यस्थल में सहभागी मार्गदर्शन?"
        : "Do you want a simple home form with books or an instrument, your family's known form, Gombe context, or guidance for joining a school, temple, or workplace programme?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${result.guide.summary} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KARNATAKA_SARASWATI_AYUDHA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const balipadyamiContext = includesAny(query, ["bali padyami", "balipadyami", "bali padya", "ಬಲಿ ಪಾಡ್ಯಮಿ", "बलि पाड्यमी", "बलिपाड्यमी"]);
  if (balipadyamiContext && ritualIntent) {
    const karnataka = request.context?.regionCode === "south-india" || includesAny(query, ["karnataka", "bengaluru", "bangalore", "mysuru", "मैसूर", "कर्नाटक", "बेंगलुरु"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-south-india";
    if (!karnataka || !supportedTradition) {
      const followUpQuestion = hindi ? "क्या आप कर्नाटक बलि पाड्यमी, महाराष्ट्र बलि प्रतिपदा/पाडवा, BAPS गुजराती नववर्ष, गोवर्धन पूजा या किसी दूसरी दक्षिण भारतीय परम्परा की बात कर रहे हैं?" : "Do you mean Karnataka Bali Padyami, Maharashtra Bali Pratipada/Padwa, BAPS Gujarati New Year, Govardhana Puja, or another South Indian tradition?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `प्रतिपदा की ये परम्पराएँ एक जैसी नहीं हैं, इसलिए मैं कर्नाटक क्रम सब पर लागू नहीं करूँगा। ${followUpQuestion}` : `These Pratipada traditions are not interchangeable, so I will not apply the Karnataka lane to everyone. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KARNATAKA_BALIPADYAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "karnataka-balipadyami", languageCode: hindi ? "hi" : "en", regionCode: "south-india", traditionCode: "smarta-south-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपका परिवार अंतर्देशीय या तटीय कर्नाटक की कौन-सी बलि-वामन कथा, प्रार्थना, रंगोली, प्रतिमा या मंदिर-रीति जानता है?" : "Which inland or coastal Karnataka Bali-Vamana story, prayer, rangoli, representation, or temple practice does your family know?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `परिवार की परिचित बलि-वामन कथा या प्रार्थना रखें और उदारता, जिम्मेदारी तथा धर्मपूर्ण आचरण पर विचार करें। फिर परिवार की देखभाल, न्याय या सेवा का एक काम चुनें। रंगोली, फूल, बलि की प्रतिमा या लौ केवल तभी रखें जब वे परिचित और सुरक्षित हों; मिट्टी या गोबर, दीप, अभिषेक, मंत्र, भोजन, व्रत, उपहार, खरीद या समृद्धि का वादा अनिवार्य नहीं है। महाराष्ट्र पाडवा, BAPS नववर्ष और गोवर्धन पूजा अलग हैं। ${followUpQuestion}` : `Use the Bali-Vamana story or prayer your family already knows and reflect on generosity, responsibility, and righteous conduct. Then choose one act of family care, fairness, or service. Rangoli, flowers, a Bali representation, or a light are optional only when familiar and safe; clay or cow dung, lamps, abhisheka, mantra, food, fasting, gifts, purchases, and prosperity promises are not required. Maharashtra Padwa, BAPS New Year, and Govardhana Puja remain separate. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KARNATAKA_BALIPADYAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const gujaratiNewYearContext = includesAny(query, ["gujarati new year", "bestu varas", "bestu varash", "nutan varsh", "nutan varshabhinandan", "गुजराती नववर्ष", "बेस्तु वर्ष", "नूतन वर्ष"]);
  if (gujaratiNewYearContext && ritualIntent) {
    const baps = request.context?.traditionCode === "swaminarayan-baps" || includesAny(query, ["baps", "swaminarayan", "स्वामीनारायण"]);
    const gujarat = request.context?.regionCode === "baps-gujarat" || includesAny(query, ["gujarat", "ahmedabad", "गुजरात", "अहमदाबाद"]);
    const incompatibleSavedContext = (request.context?.traditionCode !== undefined && request.context.traditionCode !== "swaminarayan-baps") || (request.context?.regionCode !== undefined && request.context.regionCode !== "baps-gujarat");
    if (!baps || !gujarat || incompatibleSavedContext) {
      const followUpQuestion = hindi
        ? "क्या आपका परिवार BAPS/स्वामीनारायण परम्परा मानता है, कोई दूसरी गुजराती पारिवारिक बेस्तु वर्ष रीति, या किसी दूसरे क्षेत्र का नववर्ष?"
        : "Does your family follow BAPS/Swaminarayan practice, another Gujarati family Bestu Varash tradition, or a different regional New Year?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `गुजराती नववर्ष की पारिवारिक और सम्प्रदायिक रीतियाँ एक जैसी नहीं हैं, इसलिए मैं BAPS अन्नकूट क्रम सब पर लागू नहीं करूँगा। ${followUpQuestion}` : `Gujarati New Year family and sampradaya practices are not identical, so I will not apply a BAPS Annakut sequence to everyone. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: GUJARATI_NEW_YEAR_BAPS_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "gujarati-new-year-baps", languageCode: hindi ? "hi" : "en", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आप घर पर मनाएंगे, BAPS मंदिर अन्नकूट जाएंगे या रिश्तेदारों से मिलेंगे—और कौन-सी प्रार्थना या भोग-रीति परिचित है?"
        : "Will you observe at home, visit a BAPS mandir Annakut, or greet relatives—and which prayer or offering practice is already familiar?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `परिवार या मंदिर की परिचित छोटी प्रार्थना करें, पिछले वर्ष के लिए कृतज्ञता रखें और नूतन वर्षाभिनंदन दें। घर में पहले से भोग-विधि हो तो एक साधारण शाकाहारी वस्तु अर्पित करें; अन्यथा प्रार्थना ही पर्याप्त है। बड़ा अन्नकूट, औपचारिक थाल या आरती, बही-खाता पूजा, खरीद, नए वस्त्र, मिठाई, दीप या समृद्धि का वादा अनिवार्य नहीं है। बलि प्रतिपदा, गोवर्धन पूजा और दक्षिण भारतीय बलिपाड्यमी अलग हैं। ${followUpQuestion}` : `Keep the family or mandir prayer you already know, give thanks for the past year, and offer New Year greetings. If your home already has a food-offering practice, one simple vegetarian item is enough; otherwise prayer alone is enough. A large Annakut, formal thal or aarti, business-account rite, purchase, new clothes, sweets, lamp, or prosperity promise is not required. Bali Pratipada, Govardhana Puja, and South Indian Balipadyami remain separate. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: GUJARATI_NEW_YEAR_BAPS_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const baliPratipadaContext = includesAny(query, ["bali pratipada", "balipratipada", "bali padwa", "diwali padwa", "diwali padava", "बलि प्रतिपदा", "बलिप्रतिपदा", "दिवाली पाडवा", "दिवाली पड़वा"]);
  if (baliPratipadaContext && ritualIntent) {
    const maharashtra = request.context?.regionCode === "west-india" || includesAny(query, ["maharashtra", "mumbai", "west india", "western india", "महाराष्ट्र", "मुंबई", "पश्चिम भारत"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-west-india";
    if (!maharashtra || !supportedTradition) {
      const followUpQuestion = hindi
        ? "क्या आपका परिवार महाराष्ट्र की बलि प्रतिपदा/दिवाली पाडवा रीति, गोवर्धन/अन्नकूट, गुजराती नववर्ष, BAPS नववर्ष या दक्षिण भारतीय बलिपाड्यमी में से किस मार्ग का पालन करता है?"
        : "Does your family follow Maharashtra's Bali Pratipada/Diwali Padwa, Govardhana/Annakut, Gujarati New Year, BAPS New Year, or South Indian Balipadyami?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `इन नामों और तिथियों में सम्बन्ध है, पर इनकी विधियाँ एक नहीं हैं; इसलिए मैं उन्हें एक सामान्य क्रम में नहीं मिलाऊँगा। ${followUpQuestion}`
          : `These festival names and dates are related, but their practices are not interchangeable, so I will not merge them into one generic sequence. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: BALI_PRATIPADA_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "bali-pratipada", languageCode: hindi ? "hi" : "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आपका परिवार इसे किस नाम से मानता है, और क्या कोई बुज़ुर्ग, पारिवारिक ग्रन्थ, मंदिर या सम्प्रदाय इसका क्रम तय करता है?"
        : "What does your family call the day, and does an elder, family text, temple, or sampradaya set its sequence?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `राजा बलि का परिवार-परिचित कथा, प्रार्थना या मौन से स्मरण करें और परिवार के साथ प्रसन्न, सार्थक समय बिताएँ। दीप, प्रतिमा, दाम्पत्य-रीति, उपहार, खर्च, बही-खाता पूजन, व्रत या समृद्धि का वादा अनिवार्य नहीं है। गोवर्धन/अन्नकूट, गुजराती या BAPS नववर्ष और दक्षिण भारतीय बलिपाड्यमी अलग मार्ग हैं। ${followUpQuestion}`
          : `Remember King Bali through a family-known story, prayer, or quiet reflection, and spend intentional, joyful time with family. A lamp, image, spouse rite, gift, spending, business-account ritual, fast, or promised prosperity is not required. Govardhana/Annakut, Gujarati or BAPS New Year, and South Indian Balipadyami remain separate. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: BALI_PRATIPADA_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const gitaJayantiContext = includesAny(query, ["gita jayanti", "geeta jayanti", "mokshada ekadashi", "गीता जयंती", "मोक्षदा एकादशी"]);
  const pradoshaLanes = [
    { slug: "pradosha-2026-09-krishna", needles: ["september krishna pradosha", "september krishna pradosh"] },
    { slug: "pradosha-2026-09-shukla", needles: ["september shukla pradosha", "september shukla pradosh"] },
    { slug: "pradosha-2026-10-krishna", needles: ["october krishna pradosha", "october krishna pradosh"] },
    { slug: "pradosha-2026-10-shukla", needles: ["october shukla pradosha", "october shukla pradosh"] },
    { slug: "pradosha-2026-11-krishna", needles: ["november krishna pradosha", "november krishna pradosh"] },
    { slug: "pradosha-2026-11-shukla", needles: ["november shukla pradosha", "november shukla pradosh"] },
    { slug: "pradosha-2026-12-krishna", needles: ["december krishna pradosha", "december krishna pradosh"] },
    { slug: "pradosha-2026-12-shukla", needles: ["december shukla pradosha", "december shukla pradosh"] },
  ];
  const namedPradosha = pradoshaLanes.find((candidate) => includesAny(query, candidate.needles));
  const genericPradosha = includesAny(query, ["pradosha", "pradosh vrat", "pradosham", "प्रदोष", "प्रदोष व्रत"]);
  if (genericPradosha && ritualIntent) {
    const regionCode = request.context?.regionCode;
    const traditionCode = request.context?.traditionCode;
    const exactContext = (regionCode === "north-india" && traditionCode === "smarta-north-india") || (regionCode === "west-india" && traditionCode === "smarta-west-india");
    if (!namedPradosha || !exactContext || !regionCode || !traditionCode) {
      const followUpQuestion = hindi
        ? "आप सितंबर, अक्टूबर, नवंबर या दिसंबर 2026 के किस कृष्ण या शुक्ल प्रदोष, किस शहर और किस पारिवारिक या सम्प्रदाय परम्परा के बारे में पूछ रहे हैं?"
        : "Which September, October, November, or December 2026 Krishna- or Shukla-paksha Pradosha, city, and family or sampradaya tradition do you mean?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "प्रदोष की तिथि, कथा और विधि परिवार, क्षेत्र, मंदिर और परम्परा के अनुसार अलग हो सकती है; मैं एक क्रम सब पर लागू नहीं करूँगा।" : "Pradosha date, story, and practice can differ by family, region, temple, and tradition, so I will not apply one sequence to everyone."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: PRADOSHA_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: namedPradosha.slug, languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके परिवार, मंदिर या सम्प्रदाय में कोई परिचित शिव-पार्वती प्रार्थना, कथा या क्रम है?" : "Does your family, temple, or sampradaya have a familiar Shiva-Parvati prayer, story, or sequence?";
      const answer = hindi
        ? "Today में अपने स्थान के लिए त्रयोदशी-संध्या की पुष्टि करें। परिचित शिव-पार्वती प्रार्थना, नाम, मौन या छोटा स्रोत-चिह्नित पाठ रखें; फिर संयम, देखभाल या सुधार का एक सुरक्षित काम चुनें। यह सहचर उपवास, अभिषेक, मंत्र, नंदी-विधि, पूजा-मुहूर्त, पारण, ग्रह-उपाय या निश्चित फल नहीं बताता।"
        : "Confirm the locally resolved Trayodashi twilight in Today. Use a familiar Shiva-Parvati prayer, name, silence, or short source-labelled reading, then choose one safe act of restraint, care, or repair. This companion does not prescribe fasting, abhisheka, mantra, Nandi practice, a puja muhurta, parana, planetary remedies, or a promised result.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: PRADOSHA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const lunarCalendarDays = [
    { slug: "bhadrapada-purnima", kind: "purnima", needles: ["bhadrapada purnima", "भाद्रपद पूर्णिमा"] },
    { slug: "ashwina-purnima", kind: "purnima", needles: ["ashwina purnima", "ashvin purnima", "आश्विन पूर्णिमा"] },
    { slug: "kartika-purnima", kind: "purnima", needles: ["kartika purnima", "kartik purnima", "कार्तिक पूर्णिमा"] },
    { slug: "bhadrapada-amavasya", kind: "amavasya", needles: ["bhadrapada amavasya", "भाद्रपद अमावस्या"] },
    { slug: "ashwina-amavasya", kind: "amavasya", needles: ["ashwina amavasya", "ashvin amavasya", "आश्विन अमावस्या"] },
    { slug: "kartika-amavasya", kind: "amavasya", needles: ["kartika amavasya", "kartik amavasya", "कार्तिक अमावस्या"] },
    { slug: "margashirsha-amavasya", kind: "amavasya", needles: ["margashirsha amavasya", "मार्गशीर्ष अमावस्या"] },
  ];
  const namedLunarCalendarDay = lunarCalendarDays.find((candidate) => includesAny(query, candidate.needles));
  const genericLunarCalendarDay = includesAny(query, ["purnima", "poornima", "amavasya", "पूर्णिमा", "अमावस्या"]);
  if ((namedLunarCalendarDay || genericLunarCalendarDay) && ritualIntent) {
    const regionCode = request.context?.regionCode;
    const traditionCode = request.context?.traditionCode;
    const exactContext = (regionCode === "north-india" && traditionCode === "smarta-north-india") || (regionCode === "west-india" && traditionCode === "smarta-west-india");
    if (!namedLunarCalendarDay || !exactContext || !regionCode || !traditionCode) {
      const followUpQuestion = hindi ? "आप किस नाम और महीने की पूर्णिमा या अमावस्या, किस शहर और किस पारिवारिक परम्परा के बारे में पूछ रहे हैं?" : "Which named and monthly Purnima or Amavasya, city, and family tradition do you mean?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "सामान्य पंचांग-दिवस, व्रत, पितृ-विधि और उसी दिन आने वाले पर्व एक विधि नहीं हैं, इसलिए मैं उन्हें नहीं मिलाऊँगा।" : "A generic lunar calendar day, vrata, ancestor practice, and coincident festival are not one procedure, so I will keep them separate."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: LUNAR_CALENDAR_DAY_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: namedLunarCalendarDay.slug, languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const isPurnima = namedLunarCalendarDay.kind === "purnima";
      const followUpQuestion = hindi ? "क्या उसी दिन आपके परिवार का कोई नामित पर्व, व्रत, पितृ या मंदिर-विधि अलग से लागू होती है?" : "Does a named festival, vrata, ancestor, or temple practice separately apply in your family on that day?";
      const answer = isPurnima
        ? (hindi ? "Today में नामित पूर्णिमा और साथ दिख रहे अलग पर्व देखें। परिचित प्रार्थना या मौन कृतज्ञता रखें, फिर एक पूर्ण हुई बात और आगे की एक जिम्मेदारी पहचानें। चन्द्र-दर्शन, उपवास, स्नान, अर्पण या फल इस सामान्य सहचर की आवश्यकता नहीं हैं।" : "Check Today for the named Purnima and any separate festival shown beside it. Use a familiar prayer or quiet gratitude, then name one thing that has reached completion and one responsibility to carry forward. Moon sighting, fasting, ritual bathing, offerings, and promised outcomes are not required by this generic companion.")
        : (hindi ? "Today में नामित अमावस्या और साथ दिख रही पर्व या पितृ-विधि अलग रखें। औपचारिक श्राद्ध या तर्पण शुरू किए बिना मिली देखभाल या विरासत को मौन में याद करें और एक उपेक्षित जिम्मेदारी पर छोटा सुधार करें। यह सहचर उपवास, स्नान, जल-विधि, अर्पण या फल नहीं बताता।" : "Check Today for the named Amavasya and keep any coincident festival or ancestor-practice lane separate. Without initiating shraddha or tarpan, quietly remember a source of care or inheritance and take one small repair step on a neglected responsibility. This companion does not prescribe fasting, ritual bathing, water rites, offerings, or outcomes.");
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: LUNAR_CALENDAR_DAY_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const masikaShivaratriContext = includesAny(query, ["masika shivaratri", "masik shivratri", "monthly shivaratri", "मासिक शिवरात्रि"]);
  if (masikaShivaratriContext && ritualIntent) {
    const monthSlug = includesAny(query, ["september", "सितंबर", "सितम्बर"]) ? "masika-shivaratri-2026-09"
      : includesAny(query, ["october", "अक्टूबर"]) ? "masika-shivaratri-2026-10"
        : includesAny(query, ["november", "नवंबर", "नवम्बर"]) ? "masika-shivaratri-2026-11"
          : includesAny(query, ["december", "दिसंबर", "दिसम्बर"]) ? "masika-shivaratri-2026-12" : null;
    const regionCode = request.context?.regionCode;
    const traditionCode = request.context?.traditionCode;
    const exactContext = (regionCode === "north-india" && traditionCode === "smarta-north-india") || (regionCode === "west-india" && traditionCode === "smarta-west-india");
    if (!monthSlug || !exactContext || !regionCode || !traditionCode) {
      const followUpQuestion = hindi ? "आप सितंबर, अक्टूबर, नवंबर या दिसंबर 2026 की किस मासिक शिवरात्रि और किस शहर या पारिवारिक परम्परा के बारे में पूछ रहे हैं?" : "Which September, October, November, or December 2026 Masika Shivaratri, city, and family tradition do you mean?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "मासिक शिवरात्रि की रात्रि और परिवार या मंदिर की विधि संदर्भ के अनुसार बदलती है। मैं वार्षिक महाशिवरात्रि की विधि को हर महीने लागू नहीं करूँगा।" : "The Masika Shivaratri night and family or temple practice depend on context, so I will not apply annual Mahashivaratri practice every month."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: MASIKA_SHIVARATRI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: monthSlug, languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके परिवार में मासिक शिव-स्मरण की परिचित प्रार्थना, पाठ या मंदिर-विधि है—और क्या आज सामग्री-रहित रूप बेहतर रहेगा?" : "Does your family have a familiar monthly Shiva prayer, reading, or temple practice—and would the material-free form suit you today?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${hindi ? "Today में अपने स्थान की निर्धारित रात्रि देखें। परिवार में परिचित शिव-नाम या प्रार्थना से स्मरण करें, या मौन बैठें। स्रोत-पहचान वाला छोटा पाठ पढ़ें और धैर्य, सुधार या सेवा का एक ठोस काम चुनें। यह सहचर उपवास, अभिषेक-सामग्री, मंत्र-संख्या, रात्रि-जागरण या पारण नहीं बताता और किसी फल की गारंटी नहीं देता।" : "Use Today to confirm the resolved night for your place. Remember Shiva through a family-known name or prayer, or sit quietly. Read one short source-identified teaching and choose one concrete act of patience, repair, or service. This companion does not prescribe fasting, abhisheka ingredients, mantra counts, an all-night vigil, or parana, and guarantees no outcome."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: MASIKA_SHIVARATRI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const ekadashiNames = [
    { slug: "aja-ekadashi", needles: ["aja ekadashi", "annada ekadashi", "अजा एकादशी", "अन्नदा एकादशी"] },
    { slug: "parsva-ekadashi", needles: ["parsva ekadashi", "parshva ekadashi", "parivartini ekadashi", "jal jhilani ekadashi", "पार्श्व एकादशी", "परिवर्तिनी एकादशी", "जल झिलनी एकादशी"] },
    { slug: "indira-ekadashi", needles: ["indira ekadashi", "इंदिरा एकादशी", "इन्दिरा एकादशी"] },
    { slug: "papankusha-ekadashi", needles: ["papankusha ekadashi", "pashankusha ekadashi", "पापांकुशा एकादशी", "पाशांकुशा एकादशी"] },
    { slug: "rama-ekadashi", needles: ["rama ekadashi", "रमा एकादशी"] },
    { slug: "devutthana-ekadashi", needles: ["devutthana ekadashi", "dev uthani ekadashi", "utthana ekadashi", "prabodhini ekadashi", "देवउठनी एकादशी", "देवोत्थान एकादशी", "प्रबोधिनी एकादशी"] },
    { slug: "utpanna-ekadashi", needles: ["utpanna ekadashi", "उत्पन्ना एकादशी"] },
  ];
  const namedEkadashi = ekadashiNames.find((candidate) => includesAny(query, candidate.needles));
  const genericEkadashi = !gitaJayantiContext && includesAny(query, ["ekadashi", "ekadasi", "एकादशी"]);
  if ((namedEkadashi || genericEkadashi) && ritualIntent) {
    const requestedTradition = request.context?.traditionCode;
    const regionCode = requestedTradition === "vaishnava-iskcon" ? "iskcon-india" : request.context?.regionCode;
    const supportedContext = namedEkadashi && (
      (regionCode === "north-india" && requestedTradition === "smarta-north-india")
      || (regionCode === "west-india" && requestedTradition === "smarta-west-india")
      || (regionCode === "south-india" && requestedTradition === "smarta-south-india")
      || (regionCode === "iskcon-india" && requestedTradition === "vaishnava-iskcon")
    );
    if (!supportedContext || !namedEkadashi || !regionCode || !requestedTradition) {
      const followUpQuestion = hindi
        ? "आप किस नाम की एकादशी, किस शहर और किस पारिवारिक या सम्प्रदायिक पंचांग—स्मार्त, इस्कॉन या किसी अन्य वैष्णव परम्परा—का पालन करते हैं?"
        : "Which named Ekadashi, city, and family or sampradaya calendar do you follow—Smarta, ISKCON, or another Vaishnava tradition?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "एकादशी की तिथि, व्रत और पारण स्मार्त तथा वैष्णव परम्पराओं में एक जैसे नहीं होते। मैं सामान्य तिथि या उपवास सब पर लागू नहीं करूँगा।" : "Ekadashi dates, vrata, and parana are not identical across Smarta and Vaishnava traditions, so I will not apply one generic date or fast to everyone."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: EKADASHI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: namedEkadashi.slug, languageCode: hindi ? "hi" : "en", regionCode, traditionCode: requestedTradition });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके परिवार या मंदिर में कोई परिचित विष्णु-कृष्ण प्रार्थना, पाठ, कथा या सेवा है जिसे इस सरल रूप में रखना चाहिए?" : "Does your family or temple have a familiar Vishnu-Krishna prayer, reading, story, or service practice that this simple form should preserve?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${hindi ? "पहले अपने सटीक स्थान और परम्परा की तिथि देखें। परिवार में परिचित विष्णु या कृष्ण नाम से स्मरण करें, या कुछ क्षण मौन रहें। एक छोटी स्रोत-पहचान वाली शिक्षा पढ़ें और आज संयम, सुधार या सेवा का एक ठोस काम चुनें। उपवास, आहार और पारण के लिए अपने स्थापित परिवार या सम्प्रदाय का मार्गदर्शन लें; देवम इन्हें शुरू, बदल या समाप्त नहीं कराता और किसी फल की गारंटी नहीं देता।" : "First confirm the date for your exact place and tradition. Remember Vishnu or Krishna through a family-known name or a quiet pause. Read one short source-identified teaching, then choose one concrete act of restraint, repair, or service today. Use your established family or sampradaya authority for fasting, food, and parana; Devam does not start, alter, or end those practices or guarantee an outcome."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: EKADASHI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  if (gitaJayantiContext && ritualIntent) {
    const asksForVrata = includesAny(query, ["fast", "fasting", "vrat", "vrata", "parana", "break fast", "उपवास", "व्रत", "पारण"]);
    if (asksForVrata) {
      const followUpQuestion = hindi
        ? "आप किस पारिवारिक या सम्प्रदायिक एकादशी परम्परा को मानते हैं, और उपवास तथा पारण के लिए आपका स्थापित मार्गदर्शक कौन है?"
        : "Which family or sampradaya Ekadashi tradition do you follow, and which established authority guides your fasting and parana?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "गीता जयंती का पाठ-चिंतन और मोक्षदा एकादशी का व्रत एक ही सामान्य विधि नहीं हैं। मैं यहाँ पाठ में सहायता कर सकता हूँ, लेकिन आपके स्वास्थ्य या परम्परा को जाने बिना उपवास या पारण नहीं बताऊँगा।" : "Gita Jayanti reading and the Mokshada Ekadashi vrata are not one generic procedure. I can help with the reading path, but I will not prescribe fasting or parana without your established tradition and health context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: GITA_JAYANTI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const requestedTradition = request.context?.traditionCode;
    const traditionCode = requestedTradition === "smarta-west-india" || requestedTradition === "smarta-south-india" || requestedTradition === "vaishnava-iskcon" ? requestedTradition : "smarta-north-india";
    const regionCode = traditionCode === "smarta-west-india" ? "west-india" : traditionCode === "smarta-south-india" ? "south-india" : request.context?.regionCode === "west-india" || request.context?.regionCode === "south-india" ? request.context.regionCode : "north-india";
    const result = resolvePracticeGuidance({ observanceSlug: "mokshada-ekadashi", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आप किस भाषा, अनुवाद और टीका का उपयोग करते हैं—और आज छोटा अंश पढ़ना चाहेंगे या एक पूरा अध्याय?" : "Which language, translation, and commentary do you use—and would you like a short passage or one complete chapter today?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${hindi ? "पहले अपने संस्करण, अनुवादक और टीकाकार का नाम देखें। एक छोटा पूरा अंश पढ़ें और अर्जुन के प्रश्न तथा कृष्ण के उत्तर को साथ समझें। फिर लिखें कि आपकी परिस्थिति में यह आपको किस छोटे, जिम्मेदार कर्म के लिए बुलाता है—इसे एकमात्र अर्थ न कहें।" : "First identify your edition, translator, and commentator. Read one short coherent passage, keeping Arjuna's question and Krishna's response together. Then name one small, responsible action it invites in your situation without presenting that as the passage's only meaning."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: GITA_JAYANTI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const devDeepawaliContext = includesAny(query, ["dev deepawali", "dev deepavali", "dev diwali", "देव दीपावली"]);
  if (devDeepawaliContext && ritualIntent) {
    const varanasi = request.context?.regionCode === "kashi-varanasi" || request.context?.traditionCode === "regional-kashi-varanasi" || includesAny(query, ["varanasi", "kashi", "banaras", "वाराणसी", "काशी", "बनारस"]);
    if (!varanasi) {
      const followUpQuestion = hindi ? "क्या आप वाराणसी/काशी की देव दीपावली, BAPS देव दिवाली, या किसी अन्य कार्तिक पूर्णिमा परम्परा के बारे में पूछ रहे हैं?" : "Do you mean Varanasi/Kashi Dev Deepawali, BAPS Dev Diwali, or another Kartika Purnima tradition?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "देव दीपावली नाम अलग परम्पराओं में एक ही अर्थ या विधि नहीं रखता, इसलिए मैं उन्हें नहीं मिलाऊँगा।" : "The name Dev Deepawali does not identify one universal tradition or procedure, so I will keep the lanes separate."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: DEV_DEEPAWALI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "dev-deepawali-varanasi", languageCode: hindi ? "hi" : "en", regionCode: "kashi-varanasi", traditionCode: "regional-kashi-varanasi" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आप वाराणसी में प्रत्यक्ष कार्यक्रम में जा रहे हैं, किसी मंदिर या समुदाय से जुड़ रहे हैं, या घर पर बिना लौ का सरल स्मरण चाहेंगे?" : "Are you attending in Varanasi, joining a temple or community, or would you prefer the simple flame-free remembrance at home?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${hindi ? "कार्तिक पूर्णिमा पर प्रकाशित वाराणसी के घाटों का स्मरण करें, शिव-त्रिपुरासुर कथा को एक कथा-परम्परा मानें और सत्य, सीख, मेल-मिलाप या सेवा का एक काम चुनें। बिजली का प्रकाश या मानसिक स्मरण पर्याप्त है। इस मार्गदर्शिका के कारण नदी में न उतरें, दीप न बहाएं, पटाखे न चलाएं या नाव न लें; प्रत्यक्ष कार्यक्रम में वर्तमान स्थानीय निर्देश मानें।" : "Remember Varanasi's illuminated ghats on Kartika Purnima, hold the Shiva-Tripurasura account as one story tradition, and choose one act of truthfulness, learning, reconciliation, or service. An electric light or mental remembrance is enough. Do not enter the river, release a lamp, use fireworks, or take a boat because of this guide; follow current local authorities when attending."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: DEV_DEEPAWALI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const tulasiVivahContext = includesAny(query, ["tulasi vivah", "tulsi vivah", "tulasi marriage", "tulsi marriage", "तुलसी विवाह"]);
  if (tulasiVivahContext && ritualIntent) {
    const baps = request.context?.traditionCode === "swaminarayan-baps" || includesAny(query, ["baps", "swaminarayan", "स्वामिनारायण"]);
    const north = request.context?.regionCode === "north-india";
    const west = request.context?.regionCode === "west-india";
    if (!baps && !north && !west) {
      const followUpQuestion = hindi
        ? "आप किस क्षेत्र और परिवार या सम्प्रदाय की परम्परा मानते हैं—BAPS स्वामिनारायण, किसी अन्य वैष्णव या स्मार्त परम्परा? और घर में स्वस्थ तुलसी का पौधा है या पौधे के बिना स्मरण करना है?"
        : "Which region and family or sampradaya practice do you follow—BAPS Swaminarayan, another Vaishnava tradition, or a Smarta family? Is there already a healthy Tulasi plant, or should this be plant-free?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "तुलसी विवाह की तिथि और विधि परम्परा के अनुसार बदलती है, इसलिए मैं उन्हें एक सामान्य क्रम में नहीं मिलाऊँगा।" : "Tulasi Vivah dates and practices vary by tradition, so I will not merge them into one generic sequence."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: TULASI_VIVAH_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: baps ? "tulsi-vivah-baps-begins" : "tulasi-vivah-dwadashi", languageCode: hindi ? "hi" : "en", regionCode: baps ? "baps-gujarat" : north ? "north-india" : "west-india", traditionCode: baps ? "swaminarayan-baps" : north ? "smarta-north-india" : "smarta-west-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = baps
        ? (hindi ? "आप घर पर हैं या BAPS मंदिर के कार्यक्रम में जा रहे हैं—और आपको 21 नवम्बर के आरम्भ या 24 नवम्बर के समापन की जानकारी चाहिए?" : "Are you at home or joining a BAPS mandir—and do you need the November 21 beginning or November 24 close?")
        : (hindi ? "क्या घर में स्वस्थ तुलसी का पौधा और कोई परिचित पारिवारिक प्रार्थना है, या आप पौधे के बिना सरल स्मरण रखना चाहेंगे?" : "Is there already a healthy Tulasi plant and a familiar family prayer, or would you prefer the simple plant-free remembrance?");
      const answer = baps
        ? (hindi ? `BAPS के आधिकारिक क्रम में तुलसी विवाह 21 नवम्बर से आरम्भ होकर 24 नवम्बर को समाप्त होता है। घर में परिचित प्रार्थना रखें या मंदिर के वर्तमान कार्यक्रम का पालन करें; Devam कोई अनजान विधि नहीं गढ़ता। ${followUpQuestion}` : `The official BAPS sequence begins on November 21 and closes on November 24. Use familiar prayer at home or follow the current mandir programme; Devam does not reconstruct missing liturgy. ${followUpQuestion}`)
        : (hindi ? `तुलसी और विष्णु या कृष्ण के पवित्र सम्बन्ध का स्मरण करें, परिचित प्रार्थना या मौन कृतज्ञता रखें और देखभाल का एक छोटा काम करें। पौधा न हो तो मानसिक स्मरण पर्याप्त है; पत्ते तोड़ना या खाना, उपवास, खरीदारी, या फल की गारंटी आवश्यक नहीं। ${followUpQuestion}` : `Remember the sacred relationship of Tulasi with Vishnu or Krishna, offer a familiar prayer or quiet gratitude, and choose one small act of care. A plant-free remembrance is enough; do not pluck or ingest leaves for this guide, and no fast, purchase, or promised outcome is required. ${followUpQuestion}`);
      return { ok: true, mode: "contextual_ritual_guidance", answer, citations: [], alternativesAvailable: true, sourceBoundary: TULASI_VIVAH_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const govardhanaContext = includesAny(query, ["govardhan", "govardhana", "annakut", "annakoot", "गोवर्धन", "अन्नकूट"]);
  if (govardhanaContext && ritualIntent) {
    const iskcon = request.context?.traditionCode === "vaishnava-iskcon" || includesAny(query, ["iskcon", "hare krishna", "इस्कॉन", "हरे कृष्ण"]);
    if (!iskcon) {
      const followUpQuestion = hindi
        ? "क्या आप ISKCON वैष्णव परम्परा, किसी अन्य वैष्णव सम्प्रदाय, या अपने पारिवारिक अन्नकूट का पालन करते हैं—और आप घर में हैं या मंदिर जा रहे हैं?"
        : "Do you follow the ISKCON Vaishnava practice, another Vaishnava sampradaya, or a family Annakut tradition—and are you at home or joining a temple?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `गोवर्धन पूजा और अन्नकूट की विधियाँ सम्प्रदाय और स्थान के अनुसार बदलती हैं, इसलिए मैं उन्हें एक ही सामान्य क्रम नहीं बनाऊँगा। ${followUpQuestion}` : `Govardhana Puja and Annakut practices vary by sampradaya and setting, so I will not turn them into one generic sequence. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: GOVARDHANA_PUJA_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "govardhan-puja", languageCode: hindi ? "hi" : "en", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आप घर में भोग रख रहे हैं या मंदिर कार्यक्रम में जुड़ रहे हैं—और वहाँ भोग, आरती व प्रसाद कौन निर्देशित करता है?" : "Are you making an offering at home or joining a temple programme—and who directs the offering, arati, and prasadam there?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `कृष्ण द्वारा गोवर्धन उठाकर व्रजवासियों की रक्षा का स्मरण करें और परिचित प्रार्थना या कीर्तन रखें। घर में स्थापित भोग-रीति हो तो एक सरल शाकाहारी पदार्थ उसी रीति से अर्पित कर प्रसाद बाँटें; अन्यथा प्रार्थना ही पर्याप्त है। बड़ा अन्नकूट, पशु-संपर्क, व्रत या लंबी परिक्रमा अनिवार्य नहीं है; बली प्रतिपदा अलग है। ${followUpQuestion}` : `Remember Krishna lifting Govardhana to shelter the people of Vraja and join a familiar prayer or kirtan. If your home already has a food-offering practice, offer one manageable vegetarian item through it and share prasadam; otherwise the prayer-only form is enough. A large Annakut, cow contact, fasting, or long parikrama is not required, and Bali Pratipada remains separate. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: GOVARDHANA_PUJA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const bhaiDoojContext = includesAny(query, ["bhai dooj", "bhaiya dooj", "yama dvitiya", "भाई दूज", "भैया दूज", "यम द्वितीया"]);
  if (bhaiDoojContext && ritualIntent) {
    const north = request.context?.regionCode === "north-india" || includesAny(query, ["north india", "delhi", "उत्तर भारत", "दिल्ली"]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-north-india";
    if (!north || !supportedTradition) {
      const followUpQuestion = hindi ? "आपका परिवार इसे भाई दूज, भाऊ बीज, भाई फोटा, भाई टीका या यम द्वितीया में किस नाम और क्षेत्रीय रीति से मानता है?" : "Does your family observe Bhai Dooj, Bhau Beej, Bhai Phota, Bhai Tika, or Yama Dvitiya—and which regional custom does it follow?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `भाई-बहन का केंद्र साझा है, पर क्षेत्रीय विधियाँ एक नहीं हैं; इसलिए मैं एक सामान्य क्रम सब पर नहीं लगाऊँगा। ${followUpQuestion}` : `The sibling focus is shared, but the regional rites are not identical, so I will not apply one generic sequence to all of them. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: BHAI_DOOJ_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "bhai-dooj", languageCode: hindi ? "hi" : "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आप साथ हैं या दूर—और क्या आपको बिना लौ, बिना त्वचा-चिह्न, बिना भोजन या बिना उपहार का रूप चाहिए?" : "Are you together or remote—and would a flame-free, touch-free, food-free, or gift-free form suit you better?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `भाई-बहन मिलें या बात करें और कुशलता की सच्ची कामना करें। दोनों सहज हों तो परिवार का परिचित त्वचा-सुरक्षित टीका रखें; अन्यथा बोलकर या संकेत से आशीर्वाद दें। उपयुक्त मिठाई, फल या भोजन साझा करें और परस्पर सहयोग व्यक्त करें। दीप, उपहार, व्रत, निश्चित तिलक या दीर्घायु की गारंटी अनिवार्य नहीं है। ${followUpQuestion}` : `Meet or call your sibling and offer one sincere wish for their well-being. If both are comfortable, use the family's familiar skin-safe tika; otherwise give a spoken or gesture-only blessing. Share a suitable sweet, fruit, or meal and express reciprocal support. A flame, gift, fast, fixed tilak, or guaranteed longevity is not required. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: BHAI_DOOJ_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const karwaChauthContext = includesAny(query, ["karwa chauth", "karva chauth", "karaka chaturthi", "करवा चौथ", "करक चतुर्थी"]);
  if (karwaChauthContext && ritualIntent) {
    const exactNorthContext = request.context?.regionCode === "north-india" && request.context?.traditionCode === "smarta-north-india";
    if (!exactNorthContext) {
      const followUpQuestion = hindi ? "आप किस शहर और पारिवारिक परम्परा का पालन करते हैं—और क्या आपके घर में सरगी, बाया, परिचित कथा, थाली/करवा, चन्द्र-दर्शन या कोई अलग समापन होता है?" : "Which city and family tradition do you follow—and does your home keep Sargi, Bayaa, a familiar story, thali or karwa, moon observation, or a different close?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "करवा चौथ की पंजाब, उत्तर प्रदेश और अन्य पारिवारिक रीतियाँ एक जैसी नहीं हैं, इसलिए मैं एक सामान्य उपवास या पूजा-क्रम सब पर नहीं लगाऊँगा।" : "Karwa Chauth practices differ across Punjab, Uttar Pradesh, and individual families, so I will not apply one generic fast or puja sequence to everyone."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KARWA_CHAUTH_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "karwa-chauth", languageCode: hindi ? "hi" : "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आपका परिवार कौन-सी परिचित कथा या समापन रखता है—और क्या आज बिना सामग्री, बिना लौ या बिना उपवास का रूप बेहतर रहेगा?" : "Which familiar story or close does your family keep—and would a material-free, flame-free, or non-fasting form work better today?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${hindi ? "जिस सम्बन्ध का सम्मान करना है उसके साथ कुछ क्षण रुकें, परिवार की परिचित प्रार्थना या परस्पर कुशलता के सरल शब्द कहें और देखभाल का एक व्यावहारिक काम चुनें। परिवार सुरक्षित चन्द्र-दर्शन करता हो तो उसकी जानी हुई रीति मानें; अन्यथा घर में ही समापन पर्याप्त है। ऐप के कहने पर उपवास आरम्भ, जारी या समाप्त न करें और किसी स्वास्थ्य, दीर्घायु या वैवाहिक फल की गारंटी न मानें।" : "Pause with the relationship you wish to honour, use a family-known prayer or simple words for mutual wellbeing, and choose one practical act of care. If your family safely observes the moon, use its known close; otherwise an indoor close is enough. Do not start, continue, or break a fast on the app's authority, and treat no health, longevity, or marital outcome as guaranteed."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: KARWA_CHAUTH_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const sankashtiContext = includesAny(query, ["sankashti", "sankasht chaturthi", "sankatahara chaturthi", "sankat chauth", "संकष्टी", "संकट चौथ", "संकटहर चतुर्थी"]);
  if (sankashtiContext && ritualIntent) {
    const exactWestContext = request.context?.regionCode === "west-india" && request.context?.traditionCode === "smarta-west-india";
    if (!exactWestContext) {
      const followUpQuestion = hindi ? "आप किस क्षेत्र और पारिवारिक या सम्प्रदायिक संकष्टी परम्परा का पालन करते हैं—और क्या कोई परिचित कथा, गणेश-प्रार्थना, चन्द्र-दर्शन या मंदिर उसका क्रम तय करता है?" : "Which region and family or sampradaya Sankashti tradition do you follow—and does a familiar story, Ganesha prayer, moon observation, or temple set its sequence?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "मासिक संकष्टी के नाम, कथा, उपवास और समापन क्षेत्र तथा परिवार के अनुसार बदलते हैं, इसलिए मैं एक क्रम सब पर नहीं लगाऊँगा।" : "Monthly Sankashti names, stories, fasting practices, and closing customs vary by region and family, so I will not apply one sequence to everyone."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: SANKASHTI_CHATURTHI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "sankashti-chaturthi-2026-09", languageCode: hindi ? "hi" : "en", regionCode: "west-india", traditionCode: "smarta-west-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके परिवार में कोई परिचित मासिक कथा या चन्द्र-दर्शन समापन है—और क्या आपको अपने स्थान का सटीक चन्द्रोदय चाहिए?" : "Does your family have a familiar monthly story or moon-observation close—and do you need moonrise for your exact location?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${hindi ? "परिवार में परिचित गणेश-नाम या छोटी प्रार्थना से स्मरण करें। एक वास्तविक बाधा का नाम लेकर जो आपके प्रभाव में है उसे अलग करें, फिर एक छोटा जिम्मेदार अगला काम चुनें। परिवार चन्द्र-दर्शन करता हो तो केवल अपने सटीक स्थान का पुनर्गणित चन्द्रोदय लें; अन्यथा घर में समापन पर्याप्त है। ऐप उपवास आरम्भ, जारी या समाप्त नहीं कराता और बाधा दूर होने या सफलता की गारंटी नहीं देता।" : "Remember Ganesha through a family-known name or short prayer. Name one real obstacle, separate what you can influence, and choose one small responsible next action. If your family observes the moon, use recalculated moonrise for your exact location; otherwise an indoor close is enough. The app does not start, continue, or break a fast and does not guarantee obstacle removal or success."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: SANKASHTI_CHATURTHI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const ahoiAshtamiContext = includesAny(query, ["ahoi ashtami", "ahoi aathe", "ahoi athe", "अहोई अष्टमी", "अहोई आठें"]);
  if (ahoiAshtamiContext && ritualIntent) {
    const exactNorthContext = request.context?.regionCode === "north-india" && request.context?.traditionCode === "smarta-north-india";
    if (!exactNorthContext) {
      const followUpQuestion = hindi ? "क्या आपका परिवार उत्तर भारत की अहोई अष्टमी या अहोई आठें परम्परा मानता है—और उसका परिचित चित्र, कथा तथा तारा/चन्द्र या अन्य समापन क्या है?" : "Does your family follow the North India Ahoi Ashtami or Ahoi Aathe tradition—and which image, story, and star, moon, or other close does it know?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `अहोई की पारिवारिक विधियाँ और समापन एक नहीं हैं, इसलिए मैं एक सामान्य व्रत या पूजा-क्रम नहीं थोपूँगा। ${followUpQuestion}` : `Ahoi family procedures and closing customs are not identical, so I will not impose one generic fast or puja sequence. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: AHOI_ASHTAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "ahoi-ashtami-north-india", languageCode: hindi ? "hi" : "en", regionCode: "north-india", traditionCode: "smarta-north-india" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके परिवार में कोई परिचित अहोई चित्र, कथा या तारा/चन्द्र-दर्शन समापन है—और क्या आज बिना सामग्री या बिना लौ का रूप बेहतर रहेगा?" : "Does your family have a familiar Ahoi image, story, or star- or moon-sighting close—and would a material-free or flame-free form work better today?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `परिवार की परिचित रीति से अहोई माता का स्मरण करें, या सभी बच्चों की कुशलता को मन में रखें। किसी बच्चे, देखभालकर्ता या शिक्षक के लिए कृतज्ञता की एक बात कहें और धैर्यपूर्ण देखभाल, सुनने, सुरक्षा या पढ़ाई में सहायता का एक काम चुनें। ऐप के कहने पर उपवास आरम्भ, जारी या समाप्त न करें और किसी फल की गारंटी न मानें। ${followUpQuestion}` : `Remember Mata Ahoi in the way your family knows, or simply hold the wellbeing of all children in mind. Name one thing you appreciate in a child, caregiver, or teacher, then choose one practical act of patient care, listening, safety, or learning support. Do not start, continue, or break a fast on the app's authority, and treat no outcome as guaranteed. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: AHOI_ASHTAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const bandiChhorContext = includesAny(query, ["bandi chhor", "bandi chor", "ਬੰਦੀ ਛੋੜ", "बंदी छोड़", "बंदी छोड"]);
  if (bandiChhorContext && ritualIntent) {
    const exactSikhContext = request.context?.regionCode === "sikh-punjab" && request.context?.traditionCode === "sikh-sgpc";
    if (!exactSikhContext) {
      const followUpQuestion = hindi
        ? "क्या आप किसी गुरुद्वारे के कार्यक्रम में जा रहे हैं या घर पर स्मरण करना चाहते हैं—और आपका स्थानीय गुरुद्वारा, सिख संस्था, परिवार या प्रवासी समुदाय कौन-सा कार्यक्रम रखता है?"
        : "Are you joining a gurdwara programme or remembering at home—and what programme does your local gurdwara, Sikh institution, family, or diaspora community keep?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `बंदी छोड़ दिवस का ऐतिहासिक केंद्र स्पष्ट है, लेकिन पाठ, कीर्तन, अरदास, हुकमनामा, लंगर और प्रकाश का एक सार्वभौमिक क्रम नहीं है। ${followUpQuestion}` : `Bandi Chhor Divas has a clear historical centre, but there is no single universal sequence for paath, kirtan, ardas, Hukamnama, langar, or lighting. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: BANDI_CHHOR_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "bandi-chhor-divas-sgpc", languageCode: hindi ? "hi" : "en", regionCode: "sikh-punjab", traditionCode: "sikh-sgpc" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आप घर पर हैं या गुरुद्वारा कार्यक्रम में जा रहे हैं—और क्या आप आज सेवा या साथ का एक व्यावहारिक काम चुनना चाहेंगे?" : "Are you at home or joining a gurdwara programme—and would you like to choose one practical act of seva or solidarity for today?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `गुरु हरगोबिंद साहिब का स्मरण करें जिन्होंने केवल अपनी मुक्ति के बजाय 52 बंदी राजाओं के साथ ग्वालियर किला छोड़ा। स्वतंत्रता को साहस, न्याय, गरिमा और दूसरों की जिम्मेदारी से जोड़ें, फिर सेवा या साथ का एक व्यावहारिक काम चुनें। पाठ, कीर्तन, अरदास, हुकमनामा, लंगर, प्रकाश और समय अपने स्थापित गुरुद्वारे या परिवार के अनुसार रखें। ${followUpQuestion}` : `Remember Guru Hargobind Sahib leaving Gwalior Fort with 52 detained rulers rather than accepting freedom only for himself. Connect freedom with courage, justice, dignity, and responsibility for others, then choose one practical act of seva or solidarity. Keep paath, kirtan, ardas, Hukamnama, langar, lighting, and timing under your established gurdwara or family programme. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: BANDI_CHHOR_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const jainDiwaliContext = includesAny(query, ["jain diwali", "mahavira nirvana", "mahavir nirvan", "nirvan kalyanak", "जैन दीपावली", "महावीर निर्वाण", "निर्वाण कल्याणक"]);
  if (jainDiwaliContext && ritualIntent) {
    const exactUmbrellaContext = request.context?.regionCode === "jain-india" && request.context?.traditionCode === "jain-umbrella";
    if (!exactUmbrellaContext) {
      const followUpQuestion = hindi
        ? "आप श्वेताम्बर, दिगम्बर, स्थानकवासी, तेरापंथ, श्रीमद राजचन्द्र, किसी अन्य जैन या परिवार-विशिष्ट परम्परा को मानते हैं—और आपका संघ या पंचांग दीपावली तथा महावीर निर्वाण की कौन-सी तिथि रखता है?"
        : "Do you follow a Shvetambar, Digambar, Sthanakvasi, Terapanth, Shrimad Rajchandra, another Jain, or family-specific tradition—and which sangh or calendar sets your Diwali and Mahavira Nirvan dates?";
      return { ok: true, mode: "context_clarification", answer: hindi ? `जैन समुदायों में दीपावली, निर्वाण कल्याणक और नववर्ष की तिथियाँ तथा विधियाँ एक नहीं हैं, इसलिए मैं उन्हें एक सामान्य क्रम में नहीं मिलाऊँगा। ${followUpQuestion}` : `Jain community calendars and practices do not place every Diwali, Nirvan Kalyanak, and New Year lane on one date or in one procedure, so I will not merge them. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: JAIN_DIWALI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "jain-diwali-umbrella", languageCode: hindi ? "hi" : "en", regionCode: "jain-india", traditionCode: "jain-umbrella" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "क्या आपके संघ या परिवार में 9 नवम्बर का निर्वाण कल्याणक या दिगम्बर दीपावली क्रम, 10 नवम्बर का गौतम स्वामी नववर्ष, कोई परिचित पाठ, प्रतिक्रमण या मंदिर-विधि है?" : "Does your sangh or family keep a 9 November Nirvan Kalyanak or Digambar Diwali form, the 10 November Gautam Swami New Year, or a familiar reading, pratikraman, or temple sequence?";
      return { ok: true, mode: "contextual_ritual_guidance", answer: hindi ? `महावीर के निर्वाण का स्मरण करके कुछ क्षण अंतर-प्रकाश पर शांत चिंतन करें। अपने किसी वर्तमान निर्णय को अहिंसा, अनेकांतवाद, संयम, अपरिग्रह और पुरुषार्थ की दृष्टि से देखें, फिर अहिंसा, मेल-मिलाप या सादगी का एक ठोस काम चुनें। उपवास, प्रतिक्रमण, पूजा, मंत्र, पाठ, निर्वाण लाडू, दीप या मंदिर-विधि केवल अपने स्थापित संघ या परिवार के अनुसार रखें; कोई आध्यात्मिक फल गारंटी नहीं है। 9 और 10 नवम्बर के रूप अलग रहते हैं। ${followUpQuestion}` : `Remember Mahavira's liberation and pause with the idea of inner light. Consider one current choice through ahimsa, anekantavada, restraint, non-attachment, and self-effort, then choose one concrete act of non-harm, reconciliation, or simplicity. Keep fasting, pratikraman, puja, mantra, scripture, Nirvan Ladoo, lamps, and temple procedure only through your established sangh or family; no spiritual outcome is guaranteed. The 9 and 10 November variants remain separate. ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: JAIN_DIWALI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const diwaliContext = includesAny(query, ["diwali", "deepavali", "lakshmi puja", "laxmi puja", "दीपावली", "दिवाली", "लक्ष्मी पूजा", "लक्ष्मी-पूजन"]);
  if (diwaliContext && ritualIntent) {
    const west = request.context?.regionCode === "west-india" || includesAny(query, [
      "west india", "western india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई",
    ]);
    const supportedTradition = request.context?.traditionCode === undefined || request.context.traditionCode === "smarta-west-india";
    if (!west || !supportedTradition) {
      const followUpQuestion = hindi
        ? "आप किस क्षेत्र और पारिवारिक या सम्प्रदायिक दीपावली परम्परा का पालन करते हैं—और आपके घर में केवल लक्ष्मी या लक्ष्मी-गणेश की पूजा होती है?"
        : "Which regional and family or sampradaya Diwali tradition do you follow—and does your home worship Lakshmi alone or Lakshmi with Ganesha?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `दीपावली की विधियाँ क्षेत्र और परिवार के अनुसार बहुत बदलती हैं, इसलिए मैं उन्हें एक सामान्य क्रम में नहीं मिलाऊँगा। ${followUpQuestion}`
          : `Diwali practices vary materially by region and family, so I will not merge them into one generic sequence. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: DIWALI_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }
    const result = resolvePracticeGuidance({
      observanceSlug: "diwali-lakshmi-puja",
      languageCode: hindi ? "hi" : "en",
      regionCode: "west-india",
      traditionCode: "smarta-west-india",
    });
    if (result.status === "ritual_procedure_available") {
      const minimum = result.guide.tiers[0];
      const instructions = minimum.steps.slice(1).map((step) => step.instruction).join(" ");
      const followUpQuestion = hindi
        ? "क्या आपके परिवार में चोपड़ा/बही-खाता पूजन, कोई विशेष आरती या अलग क्षेत्रीय दीपावली-क्रम है?"
        : "Does your family keep Chopda/Bahi-Khata Pujan, a particular arati, or a different regional Diwali sequence?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: `${hindi ? "सटीक मुहूर्त के लिए स्थानीय पंचांग या पारिवारिक जानकार लें।" : "Use your local calendar or family practitioner for the precise muhurta."} ${instructions} ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: DIWALI_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }
  const masikaDurgashtamiContext = includesAny(query, ["masika durgashtami", "masik durgashtami", "monthly durga ashtami", "monthly durgashtami", "मासिक दुर्गाष्टमी", "मासिक दुर्गा अष्टमी"]);
  if (masikaDurgashtamiContext && ritualIntent) {
    const savedRegion = request.context?.regionCode;
    const savedTradition = request.context?.traditionCode;
    const queryWest = includesAny(query, ["west india", "western india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई"]);
    const queryNorth = includesAny(query, ["north india", "northern india", "delhi", "uttar pradesh", "haryana", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश", "हरियाणा"]);
    const regionCode = savedRegion === "west-india" || queryWest ? "west-india" : savedRegion === "north-india" || queryNorth ? "north-india" : null;
    const traditionCode = regionCode === "west-india" ? "smarta-west-india" : regionCode === "north-india" ? "smarta-north-india" : null;
    const exactPair = traditionCode !== null && savedTradition === traditionCode;
    if (!regionCode || !exactPair) {
      const followUpQuestion = hindi
        ? "आप किस शहर या क्षेत्र में हैं, और आपका परिवार या सम्प्रदाय मासिक दुर्गाष्टमी को किस परम्परा में मानता है? क्या वह उत्तर या पश्चिम भारत की स्मार्त परम्परा है?"
        : "Which city or region are you in, and which monthly Durgashtami tradition does your family or sampradaya follow? Is it a North or West India Smarta practice?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "मासिक दुर्गाष्टमी, शारदीय महाष्टमी और बंगाल दुर्गा पूजा एक ही विधि नहीं हैं, इसलिए मैं बिना पारिवारिक या सम्प्रदायिक सन्दर्भ के कोई औपचारिक क्रम नहीं दूँगा।" : "Monthly Durgashtami, Shardiya Mahashtami, and Bengal Durga Puja are not one procedure, so I will not assign a formal sequence without family or sampradaya context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: MASIKA_DURGASHTAMI_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: "masika-durgashtami-2026-09", languageCode: hindi ? "hi" : "en", regionCode, traditionCode });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi
        ? "आपके परिवार में कौन-सा देवी-रूप, प्रार्थना, गीत, ग्रन्थ, मन्दिर या गुरु-परम्परा परिचित है?"
        : "Which Devi form, prayer, song, text, temple, or teacher lineage is familiar in your family?";
      const answer = hindi
        ? "परिचित प्रार्थना, गीत, नाम या छोटे स्रोत-स्पष्ट पाठ से दुर्गा का स्मरण करें। साहस और देखभाल माँगने वाली एक स्थिति पहचानें, फिर सुरक्षा, सुधार या सेवा का ऐसा छोटा काम चुनें जिसमें किसी को नियंत्रित या हानि न पहुँचे। उपवास, भोजन, मन्त्र, प्रतिमा, अर्पण, आरती, चण्डी-पाठ, होम, कुमारी पूजा, बलि या औपचारिक पूजा अपने स्थापित परिवार, मन्दिर या सम्प्रदाय से ही लें; यह सहचर किसी फल की गारंटी नहीं देता।"
        : "Remember Durga through a familiar prayer, song, name, or short source-labelled passage. Name one situation requiring courage and care, then choose one safe act of protection, repair, or service that does not control or harm another person. Take fasting, food, mantra, image, offering, aarti, Chandi recitation, homa, Kumari Puja, bali, or formal worship only from your established family, temple, or sampradaya; this companion guarantees no outcome.";
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${answer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: MASIKA_DURGASHTAMI_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const durgaContext = explicitlyDurga || usesAtlasContext("durga");
  const bengalDurgaPujaContext = includesAny(query, ["durga puja", "durgapuja", "दुर्गा पूजा"]);
  if (bengalDurgaPujaContext && ritualIntent) {
    const mahashtamiContext = includesAny(query, ["maha ashtami", "mahashtami", "maha astami", "mahastami"]);
    const bengal = request.context?.regionCode === "bengal" || includesAny(query, ["bengal", "west bengal", "kolkata", "बंगाल", "पश्चिम बंगाल", "कोलकाता"]);
    const supportedPair = bengal && request.context?.traditionCode === "shakta-bengal";
    if (!supportedPair) {
      const followUpQuestion = hindi ? "यह पारिवारिक पूजा, बोनेदी बाड़ी, सामुदायिक पंडाल, मंदिर, रामकृष्ण परम्परा, अन्य शाक्त परम्परा या आगन्तुक सन्दर्भ है?" : "Is this a family puja, bonedi bari, community pandal, temple, Ramakrishna, another Shakta tradition, or a visitor context?";
      return { ok: true, mode: "context_clarification", answer: `${hindi ? "बंगाल दुर्गा पूजा की पारिवारिक, मंदिर, पंडाल और सम्प्रदायिक विधियाँ एक नहीं हैं, इसलिए मैं बिना सन्दर्भ के कोई औपचारिक क्रम नहीं बनाऊँगा।" : "Bengal Durga Puja family, temple, pandal, and sampradaya practices are not one procedure, so I will not generate a formal sequence without context."} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: BENGAL_DURGA_PUJA_RITUAL_BOUNDARY, followUpQuestion };
    }
    const result = resolvePracticeGuidance({ observanceSlug: mahashtamiContext ? "bengal-mahashtami-community-participant-2026" : "bengal-durga-puja-campaign", languageCode: hindi ? "hi" : "en", regionCode: "bengal", traditionCode: "shakta-bengal" });
    if (result.status === "ritual_procedure_available") {
      const followUpQuestion = hindi ? "आज पर्व का कौन-सा दिन है, और कौन-सा परिवार, मंदिर, पूजा-समिति या ग्रन्थ मार्गदर्शन करता है?" : "Which festival day is it, and which family, temple, puja committee, or text guides your participation?";
      const answer = hindi ? "आज का बंगाल पर्व-नाम पहचानें और परिचित प्रार्थना, गीत या छोटे स्रोत-स्पष्ट पाठ से दुर्गा का स्मरण करें। साहस, स्त्रियों की गरिमा, सामुदायिक सेवा या कलाकारों और श्रमिकों के सम्मान का एक काम चुनें। बोधन, नवपत्रिका, कुमारी पूजा, सन्धि पूजा, अंजलि, भोग, बलि, होम और विसर्जन जिम्मेदार स्थानीय अधिकारी पर छोड़ें; लाइव प्रवेश, यात्रा, भीड़ और सुरक्षा स्थानीय रूप से जाँचें।" : "Confirm today's Bengal festival phase and remember Durga through a familiar prayer, song, or short identified reading. Choose one act of courage, respect for women's dignity, community service, or support for artists and workers. Leave Bodhan, Navapatrika, Kumari Puja, Sandhi Puja, anjali, bhog, bali, homa, and visarjan to the responsible local authority, and verify live access, transport, crowd, and safety conditions locally.";
      const displayedAnswer = result.guide.kind === "user_complete_observance_lane" && mahashtamiContext ? result.guide.summary : answer;
      return { ok: true, mode: "contextual_ritual_guidance", answer: `${displayedAnswer} ${followUpQuestion}`, citations: [], alternativesAvailable: true, sourceBoundary: mahashtamiContext ? BENGAL_MAHASHTAMI_PARTICIPANT_BOUNDARY : BENGAL_DURGA_PUJA_RITUAL_BOUNDARY, followUpQuestion, practiceGuide: result.guide };
    }
  }
  const navaratriContinuation = durgaContext && includesAny(query, [
    "north india", "delhi", "uttar pradesh", "west india", "maharashtra", "mumbai", "goa",
    "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश", "पश्चिम भारत", "महाराष्ट्र", "मुंबई",
    "ghata", "kalash", "kalasha", "घट", "कलश", "lamp", "flame", "दीप", "ज्योति",
  ]);

  if (durgaContext && (ritualIntent || navaratriContinuation)) {
    const north = request.context?.regionCode === "north-india" || includesAny(query, [
      "north india", "delhi", "uttar pradesh", "उत्तर भारत", "दिल्ली", "उत्तर प्रदेश",
    ]);
    const west = request.context?.regionCode === "west-india" || includesAny(query, [
      "west india", "western india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई",
    ]);
    const regionCode = north && !west ? "north-india" : west && !north ? "west-india" : null;
    const traditionCode = regionCode === "north-india" ? "smarta-north-india"
      : regionCode === "west-india" ? "smarta-west-india" : null;
    const explicitlyUnsupportedTradition = request.context?.traditionCode !== undefined
      && request.context.traditionCode !== traditionCode;

    if (!regionCode || !traditionCode || explicitlyUnsupportedTradition) {
      const followUpQuestion = hindi
        ? "आप किस स्थान और पारिवारिक या सम्प्रदायिक परम्परा का पालन करते हैं? क्या आपके घर में घटस्थापना होती है, और दीप की लगातार सुरक्षित देखभाल सम्भव है?"
        : "Which location and family or sampradaya practice do you follow? Does your home perform Ghatasthapana, and can every flame be safely supervised?";
      return {
        ok: true,
        mode: "context_clarification",
        answer: hindi
          ? `मैं नवरात्रि की गृह-साधना बता सकता हूँ, लेकिन अलग क्षेत्रों की विधियाँ एक नहीं हैं। ${followUpQuestion}`
          : `I can guide a household Navaratri practice, but regional traditions should not be merged into one sequence. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: NAVARATRI_RITUAL_BOUNDARY,
        followUpQuestion,
      };
    }

    const result = resolvePracticeGuidance({
      observanceSlug: "shardiya-navaratri-begins",
      languageCode: hindi ? "hi" : "en",
      regionCode,
      traditionCode,
    });
    if (result.status === "ritual_procedure_available") {
      const minimum = result.guide.tiers[0];
      const followUpQuestion = hindi
        ? "क्या आपके परिवार में घटस्थापना होती है, या आप बिना स्थापना के सरल दैनिक प्रार्थना रखना चाहेंगे?"
        : "Does your family perform Ghatasthapana, or would you prefer the simple daily prayer without an installation?";
      return {
        ok: true,
        mode: "contextual_ritual_guidance",
        answer: hindi
          ? `समर्थित ${regionCode === "north-india" ? "उत्तर" : "पश्चिम"} भारतीय गृह-सन्दर्भ में ${minimum.estimatedMinutes} मिनट की सरल दैनिक साधना से आरम्भ करें: स्थान और हाथ स्वच्छ करें, नौ रातों का निभ सकने वाला संकल्प लें, देवी को जल और फूल, पत्ता या फल अर्पित करें, परिचित प्रार्थना या पाठ करें और दीप हो तो जाते समय सुरक्षित बुझाएं। ${followUpQuestion}`
          : `For the supported ${regionCode === "north-india" ? "North" : "West"} India household context, begin with the ${minimum.estimatedMinutes}-minute sustainable form: clean the place and your hands, make an intention you can keep for nine nights, offer Devi water and a flower, leaf or fruit, use a familiar prayer or reading, and safely extinguish any ordinary lamp before leaving. ${followUpQuestion}`,
        citations: [],
        alternativesAvailable: true,
        sourceBoundary: NAVARATRI_RITUAL_BOUNDARY,
        followUpQuestion,
        practiceGuide: result.guide,
      };
    }
  }

  if (durgaContext) return answerHeroPreview("durga", request);

  const ramcharitmanasPreview = answerRamcharitmanasPreview(request);
  if (ramcharitmanasPreview) return ramcharitmanasPreview;

  const ramayanaContext = explicitlyRamayana || usesAtlasContext("ramayana");
  if (ramayanaContext) return answerReviewedRamayanaReflection(request) ?? answerHeroPreview("ramayana", request);

  const ganeshaContext = explicitlyGanesha || usesAtlasContext("ganesha");
  const contextualContinuation = ganeshaContext && includesAny(query, [
    "west india", "western india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई",
    "permanent image", "permanent murti", "temporary murti", "festival murti", "स्थायी विग्रह", "अस्थायी विग्रह",
  ]);

  if (!ganeshaContext || (!ritualIntent && !contextualContinuation)) return answerGaneshaPreview(request);

  const supportedRegion = request.context?.regionCode === "west-india" || includesAny(query, [
    "west india", "western india", "maharashtra", "mumbai", "goa", "पश्चिम भारत", "महाराष्ट्र", "मुंबई",
  ]);
  const explicitlyUnsupportedTradition = request.context?.traditionCode !== undefined
    && request.context.traditionCode !== "smarta-west-india";
  if (!supportedRegion || explicitlyUnsupportedTradition) {
    const followUpQuestion = hindi
      ? "आप किस स्थान और पारिवारिक या सम्प्रदायिक परम्परा का पालन करते हैं? और यह घर का स्थायी विग्रह है या उत्सव के लिए लाया गया अस्थायी विग्रह?"
      : "Which location and family or sampradaya practice do you follow—and is this your permanent home image or a temporary festival murti?";
    return {
      ok: true,
      mode: "context_clarification",
      answer: hindi
        ? `मैं विधि बता सकता हूँ, लेकिन एक ही क्रम सभी घरों पर लागू नहीं होता। ${followUpQuestion}`
        : `I can guide you, but one sequence should not be applied to every home. ${followUpQuestion}`,
      citations: [],
      alternativesAvailable: true,
      sourceBoundary: GANESHA_RITUAL_BOUNDARY,
      followUpQuestion,
    };
  }

  const result = resolvePracticeGuidance({
    observanceSlug: "ganesh-chaturthi",
    languageCode: hindi ? "hi" : "en",
    regionCode: "west-india",
    traditionCode: "smarta-west-india",
  });
  if (result.status !== "ritual_procedure_available") return answerGaneshaPreview(request);

  const minimum = result.guide.tiers[0];
  const reading = answerGaneshaPreview({
    message: hindi ? "गणेश पूजा में पाठ क्या करूँ" : "What can I practise in Ganesha worship?",
    context: { atlasNodeSlug: "ganesha", languageCode: hindi ? "hi" : "en" },
  });
  const citations = reading.ok ? reading.citations : [];
  const followUpQuestion = hindi
    ? "क्या यह घर का स्थायी विग्रह है, उत्सव का अस्थायी विग्रह है, या आपके पास विग्रह नहीं है?"
    : "Is this your permanent home image, a temporary festival murti, or are you practising without a murti?";

  return {
    ok: true,
    mode: "contextual_ritual_guidance",
    answer: hindi
      ? `पश्चिम भारत के समर्थित गृह-सन्दर्भ में ${minimum.estimatedMinutes} मिनट की सरल पूजा करें: स्थान और हाथ स्वच्छ करें, अपना संकल्प सरल शब्दों में कहें, गणेश जी का स्वागत करें, जल-पुष्प या दूर्वा और नैवेद्य अर्पित करें, फिर परिचित प्रार्थना या आरती करके प्रसाद बाँटें। ${followUpQuestion}`
      : `For the supported West India household context, try the ${minimum.estimatedMinutes}-minute simple form: clean the place and your hands, state your intention in your own words, welcome Ganesha, offer water, a flower or durva and food, then close with a familiar prayer or arati and share the prasad. ${followUpQuestion}`,
    citations,
    alternativesAvailable: true,
    sourceBoundary: GANESHA_RITUAL_BOUNDARY,
    followUpQuestion,
    practiceGuide: result.guide,
  };
}
