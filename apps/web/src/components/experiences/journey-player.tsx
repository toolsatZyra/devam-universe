"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import type { HeroJourney, JourneyStop } from "@/lib/domain/experience";
import { canGuestAskSarthi } from "@/lib/account/guest-preview";
import styles from "./journey-player.module.css";

type JourneySarthiReply = {
  ok: boolean;
  answer?: string;
  message?: string;
  sourceBoundary?: string;
  citations?: { passageId: string; workTitle: string; editionTitle: string }[];
};

export function journeyProgressKey(slug: string) {
  return `devam-journey-progress:${slug}`;
}

function readProgress(slug: string): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(journeyProgressKey(slug)) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

type SceneCopy = { title?: string; kicker: string; story: string; invitation: string };

const storyCopy: Record<string, SceneCopy> = {
  "bala-kanda": { kicker: "A prince, a bow, a beginning", story: "A young Rama leaves the palace with the sage Vishvamitra, protects a sacred rite, and meets Sita at the bow that no ordinary prince can lift.", invitation: "Follow the first light" },
  "ayodhya-kanda": { kicker: "The night the kingdom changed", story: "On the eve of Rama's coronation, an old promise sends him into exile. Sita and Lakshmana choose the forest over life without him.", invitation: "Leave Ayodhya" },
  "aranya-kanda": { kicker: "Deeper into the forest", story: "The forest becomes a place of wonder, danger, and loss. A golden deer draws Rama away—and Ravana carries Sita toward Lanka.", invitation: "Trace the broken trail" },
  "kishkindha-kanda": { kicker: "An alliance among the vanaras", story: "Rama meets Hanuman and Sugriva. A friendship is forged, a kingdom is reclaimed, and search parties set out toward every horizon.", invitation: "Join the search" },
  "sundara-kanda": { kicker: "The leap across the ocean", story: "Hanuman crosses the sea, enters Lanka alone, finds Sita in the ashoka grove, and must decide how to approach without deepening her fear.", invitation: "Leap toward Lanka" },
  "yuddha-kanda": { kicker: "The road to Lanka", story: "A bridge rises over the ocean. Armies meet, loyalties are tested, Ravana falls, and Rama and Sita begin the journey home.", invitation: "Cross the bridge" },
  "uttara-kanda": { kicker: "What came after victory", story: "The return is not the end. The later book carries questions of kingship, separation, memory, and the price of public duty.", invitation: "Enter the aftermath" },
  "the-question": { kicker: "A simple question", story: "The Goddess asks how Ganesha may be approached without elaborate austerity. The answer begins a garland of names and images.", invitation: "Listen for the answer" },
  "the-devotional-lens": { kicker: "The remover of obstacles", story: "Ganesha appears as the presence that clears the inner and outer knots standing between a devotee and a worthy beginning.", invitation: "Move closer" },
  "yajna-form": { kicker: "The sacred act itself", story: "The hymn does not place Ganesha outside the offering: he is praised as the giver, the offering, and the transforming fire of the act.", invitation: "Enter the flame" },
  "closing-prayer": { kicker: "A wish for auspiciousness", story: "The garland closes not with spectacle, but with a quiet prayer that what is genuinely sought may ripen toward well-being.", invitation: "Carry the blessing" },
  "context-opening": { kicker: "A kingdom lost", story: "A defeated king and a merchant, both unable to let go of what hurt them, arrive at a forest hermitage seeking to understand their own attachment.", invitation: "Enter the hermitage" },
  "proper-opening": { kicker: "The Goddess awakens", story: "When the gods are overwhelmed, their radiance gathers into a single immeasurable presence. The Devi takes form and the cosmos remembers its power.", invitation: "Witness her arrival" },
  "last-proper-canto": { kicker: "The final battle", story: "After the great battles, the Goddess faces the remaining force that claims she is not truly one. She gathers every emanation back into herself.", invitation: "Stand at the threshold" },
  "context-close": { kicker: "The boon and the return", story: "The tale returns to its listeners. What they ask of the Goddess reveals what each has learned—and what each still desires.", invitation: "Return to the world" },
  vasubaras: { kicker: "The first lamp", story: "The season of lights begins with gratitude for nourishment, care, and the animals whose lives have long been woven into household well-being.", invitation: "Light the first lamp" },
  dhantrayodashi: { kicker: "Health, wealth, and remembrance", story: "Homes prepare for renewal while lamps remember Yama and stories of Dhanvantari turn attention toward health—not merely buying gold.", invitation: "Follow the evening light" },
  "naraka-chaturdashi": { kicker: "Before dawn", story: "Across regions, the morning carries different stories: liberation from Naraka, ritual bathing, protection, and the fierce clearing of what must not follow us.", invitation: "Enter the blue hour" },
  "lakshmi-pujan": { kicker: "The night of radiance", story: "Lamps gather at thresholds and shrines. Some households welcome Lakshmi; in Bengal, the same night opens toward Kali. The lights do not erase their difference.", invitation: "Cross the luminous threshold" },
  "bali-govardhan": { kicker: "New worlds after the night", story: "The next day branches into stories of Bali, Govardhan, Annakut, the Gujarati new year, and Balipadyami—many worlds sharing one dawn.", invitation: "Choose a path" },
  "bhau-beej": { kicker: "A bond renewed", story: "The constellation closes around siblings and chosen kin: hospitality, blessing, memory, and the promise to remain present for one another.", invitation: "Complete the circle" },
};

const hindiStoryCopy: Record<string, SceneCopy> = {
  "bala-kanda": { title: "बालकाण्ड", kicker: "एक राजकुमार, एक धनुष, एक आरंभ", story: "युवा राम ऋषि विश्वामित्र के साथ महल से निकलते हैं, उनके यज्ञ की रक्षा करते हैं और उस धनुष के सामने सीता से मिलते हैं जिसे साधारण राजकुमार उठा नहीं सकता।", invitation: "पहली रोशनी के साथ चलें" },
  "ayodhya-kanda": { title: "अयोध्याकाण्ड", kicker: "वह रात जब राज्य बदल गया", story: "राम के राज्याभिषेक से ठीक पहले एक पुराना वचन उन्हें वनवास भेज देता है। सीता और लक्ष्मण उनके बिना महल में रहने के बजाय वन का मार्ग चुनते हैं।", invitation: "अयोध्या से आगे बढ़ें" },
  "aranya-kanda": { title: "अरण्यकाण्ड", kicker: "वन के भीतर और गहरे", story: "वन आश्चर्य, संकट और वियोग का संसार बन जाता है। स्वर्ण मृग राम को दूर ले जाता है और रावण सीता को लंका की ओर ले जाता है।", invitation: "टूटी हुई राह खोजें" },
  "kishkindha-kanda": { title: "किष्किन्धाकाण्ड", kicker: "वानरों के बीच एक मित्रता", story: "राम हनुमान और सुग्रीव से मिलते हैं। मित्रता बनती है, एक राज्य वापस मिलता है और खोज दल हर दिशा में निकलते हैं।", invitation: "खोज में शामिल हों" },
  "sundara-kanda": { title: "सुन्दरकाण्ड", kicker: "समुद्र के पार छलांग", story: "हनुमान समुद्र पार कर अकेले लंका पहुँचते हैं, अशोक वाटिका में सीता को खोजते हैं और सोचते हैं कि बिना भय बढ़ाए उनसे कैसे बात की जाए।", invitation: "लंका की ओर बढ़ें" },
  "yuddha-kanda": { title: "युद्धकाण्ड", kicker: "लंका की राह", story: "समुद्र पर सेतु बनता है। सेनाएँ आमने-सामने आती हैं, निष्ठाएँ परखी जाती हैं, रावण गिरता है और राम-सीता घर लौटने लगते हैं।", invitation: "सेतु पार करें" },
  "uttara-kanda": { title: "उत्तरकाण्ड", kicker: "विजय के बाद", story: "वापसी अंत नहीं है। बाद का यह काण्ड राजधर्म, वियोग, स्मृति और सार्वजनिक कर्तव्य की कीमत जैसे कठिन प्रश्न उठाता है।", invitation: "कथा के बाद का संसार देखें" },
  "the-question": { title: "प्रश्न", kicker: "एक सीधा प्रश्न", story: "देवी पूछती हैं कि कठिन तपस्या के बिना गणेश तक कैसे पहुँचा जाए। उत्तर नामों और रूपकों की एक माला से आरंभ होता है।", invitation: "उत्तर सुनें" },
  "the-devotional-lens": { title: "विघ्नहर्ता", kicker: "अवरोध हटाने वाली उपस्थिति", story: "गणेश उस उपस्थिति के रूप में सामने आते हैं जो शुभ आरंभ के मार्ग में खड़ी भीतरी और बाहरी गाँठों को खोलती है।", invitation: "और निकट जाएँ" },
  "yajna-form": { title: "यज्ञस्वरूप", kicker: "पवित्र कर्म का रूप", story: "स्तुति गणेश को अर्पण से बाहर नहीं रखती; उन्हें दाता, अर्पण और कर्म को बदलने वाली अग्नि के रूप में स्मरण करती है।", invitation: "अग्नि के भीतर देखें" },
  "closing-prayer": { title: "मंगल कामना", kicker: "शुभता की प्रार्थना", story: "यह यात्रा चमत्कार के प्रदर्शन से नहीं, बल्कि इस शांत कामना से समाप्त होती है कि जो सच में चाहा गया है वह कल्याण की ओर पके।", invitation: "कामना साथ लेकर चलें" },
  "context-opening": { title: "वन आश्रम की देहरी", kicker: "एक खोया हुआ राज्य", story: "एक पराजित राजा और एक व्यापारी, दोनों अपने दुख से अलग नहीं हो पाते। वे अपने मोह को समझने के लिए वन के आश्रम में पहुँचते हैं।", invitation: "आश्रम में प्रवेश करें" },
  "proper-opening": { title: "देवी का प्राकट्य", kicker: "शक्ति जागती है", story: "जब देवता असहाय होते हैं, उनका तेज एक अपार उपस्थिति में एकत्र होता है। देवी रूप लेती हैं और जगत अपनी शक्ति को फिर पहचानता है।", invitation: "उनका आगमन देखें" },
  "last-proper-canto": { title: "अंतिम संग्राम", kicker: "अंतिम सीमा", story: "महायुद्धों के बाद देवी उस शक्ति का सामना करती हैं जो उनके एकत्व को चुनौती देती है। वे अपने सभी प्रकट रूपों को फिर अपने भीतर समेट लेती हैं।", invitation: "सीमा पर खड़े हों" },
  "context-close": { title: "वरदान और वापसी", kicker: "कथा से जीवन की ओर", story: "कथा फिर अपने श्रोताओं के पास लौटती है। देवी से वे जो माँगते हैं, उसमें उनकी सीख भी दिखाई देती है और उनकी बची हुई इच्छा भी।", invitation: "जीवन में वापस लौटें" },
  "vasubaras": { title: "वसु बारस", kicker: "पहला दीप", story: "प्रकाश का मौसम पोषण, देखभाल और उन पशुओं के प्रति कृतज्ञता से आरंभ होता है जो लंबे समय से गृहस्थ जीवन का हिस्सा रहे हैं।", invitation: "पहला दीप जलाएँ" },
  "dhantrayodashi": { title: "धनत्रयोदशी", kicker: "स्वास्थ्य, समृद्धि और स्मरण", story: "घर नवआरंभ की तैयारी करते हैं। दीप यम का स्मरण कराते हैं और धन्वंतरि की कथाएँ ध्यान को स्वास्थ्य की ओर ले जाती हैं—केवल खरीदारी की ओर नहीं।", invitation: "संध्या की रोशनी के साथ चलें" },
  "naraka-chaturdashi": { title: "नरक चतुर्दशी", kicker: "भोर से पहले", story: "अलग-अलग क्षेत्रों में यह सुबह अलग कथाएँ लाती है—नरक से मुक्ति, स्नान, रक्षा और उस अंधकार को पीछे छोड़ना जिसे आगे नहीं ले जाना।", invitation: "नीली भोर में प्रवेश करें" },
  "lakshmi-pujan": { title: "लक्ष्मी पूजन", kicker: "प्रकाश की रात", story: "देहरी और पूजा-स्थल पर दीप इकट्ठे होते हैं। कुछ घर लक्ष्मी का स्वागत करते हैं; बंगाल में यही रात काली पूजा की ओर खुलती है। प्रकाश उनके अंतर को मिटाता नहीं।", invitation: "प्रकाश की देहरी पार करें" },
  "bali-govardhan": { title: "बलि और गोवर्धन", kicker: "रात के बाद अनेक संसार", story: "अगला दिन बलि, गोवर्धन, अन्नकूट, गुजराती नववर्ष और बलिपाड्यमी की अलग राहों में खुलता है—एक भोर, अनेक जीवित परंपराएँ।", invitation: "अपनी राह चुनें" },
  "bhau-beej": { title: "भाऊ बीज", kicker: "एक संबंध फिर नया", story: "यह नक्षत्र भाई-बहनों और चुने हुए आत्मीय संबंधों के साथ पूरा होता है—आतिथ्य, आशीष, स्मृति और साथ बने रहने का वचन।", invitation: "वृत्त पूरा करें" },
};

function sceneCopy(stop: JourneyStop, language: "en" | "hi") {
  if (language === "hi" && hindiStoryCopy[stop.id]) return hindiStoryCopy[stop.id];
  return storyCopy[stop.id] ?? { kicker: stop.eyebrow, story: stop.summary, invitation: "Continue the journey" };
}

function locatorLabel(locator: Record<string, unknown>) {
  if (typeof locator.book === "number" && typeof locator.sarga === "number") return `Book ${locator.book} · Sarga ${locator.sarga}`;
  if (typeof locator.source_chapter === "number") return `Chapter ${locator.source_chapter}`;
  if (typeof locator.literal_marker === "string") return `Source unit ${locator.literal_marker}`;
  return "Exact source span";
}

export function JourneyPlayer({ journey, account }: { journey: HeroJourney; account: { signedIn: boolean; label: string } }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [explored, setExplored] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [sarthiOpen, setSarthiOpen] = useState(false);
  const [sarthiInput, setSarthiInput] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [sarthiReply, setSarthiReply] = useState<JourneySarthiReply | null>(null);
  const [sarthiBusy, setSarthiBusy] = useState(false);
  const [accountPrompt, setAccountPrompt] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const guestExchanges = useRef(0);

  useEffect(() => {
    const saved = readProgress(journey.slug);
    const sync = window.setTimeout(() => {
      setExplored(saved);
      const next = journey.stops.findIndex((stop) => !saved.includes(stop.id));
      if (next >= 0) setActiveIndex(next);
    }, 0);
    const guide = window.setTimeout(() => setShowGuide(false), 4500);
    return () => { window.clearTimeout(sync); window.clearTimeout(guide); };
  }, [journey]);

  useEffect(() => {
    if (account.signedIn) return;
    try {
      const value = Number(window.localStorage.getItem("devam-guest-sarthi-exchanges") ?? "0");
      guestExchanges.current = Number.isSafeInteger(value) && value > 0 ? value : 0;
    } catch {
      guestExchanges.current = 0;
    }
  }, [account.signedIn]);

  const active = journey.stops[activeIndex];
  const copy = sceneCopy(active, language);
  const activeTitle = copy.title ?? active.title;
  const exploredSet = useMemo(() => new Set(explored), [explored]);
  const complete = explored.length === journey.stops.length;

  function travelTo(index: number) {
    setActiveIndex(index);
    setShowGuide(false);
  }

  function continueJourney() {
    const nextExplored = exploredSet.has(active.id) ? explored : [...explored, active.id];
    setExplored(nextExplored);
    window.localStorage.setItem(journeyProgressKey(journey.slug), JSON.stringify(nextExplored));
    if (activeIndex < journey.stops.length - 1) travelTo(activeIndex + 1);
  }

  async function askSarthi(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = sarthiInput.trim();
    if (question.length < 2 || sarthiBusy) return;
    if (!canGuestAskSarthi(guestExchanges.current, account.signedIn)) {
      setAccountPrompt(true);
      return;
    }
    setAskedQuestion(question);
    setSarthiReply(null);
    setSarthiBusy(true);
    setSarthiInput("");
    try {
      const response = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question, context: { atlasNodeSlug: active.id, languageCode: language } }),
      });
      const reply = await response.json() as JourneySarthiReply;
      setSarthiReply(reply);
      if (response.ok && !account.signedIn) {
        guestExchanges.current += 1;
        try { window.localStorage.setItem("devam-guest-sarthi-exchanges", String(guestExchanges.current)); } catch { /* Session state still gates the chat. */ }
      }
    } catch {
      setSarthiReply({ ok: false, message: "I could not reach Devam's evidence service. Please try again." });
    } finally {
      setSarthiBusy(false);
    }
  }

  const sceneStyle = {
    "--path-offset": `${activeIndex * -230 - 115}px`,
    "--path-width": `${journey.stops.length * 230}px`,
    "--backdrop-shift": `${journey.stops.length > 1 ? 4 - (activeIndex / (journey.stops.length - 1)) * 8 : 0}%`,
  } as CSSProperties;

  return (
    <main className={styles.shell} data-tone={journey.tone} style={sceneStyle}>
      <div className={styles.space} aria-hidden="true"><span/><span/><span/></div>
      <div className={styles.worldBackdrop} aria-hidden="true">
        <Image src={`/journeys/${journey.slug}-world-v1.webp`} alt="" fill priority sizes="100vw" />
      </div>
      <header className={styles.hud}>
        <Link className={styles.brand} href="/">
          <Image src="/brand/devam-mark.png" alt="" width={38} height={38} priority />
          <span><strong>Devam</strong><small>Return to the universe</small></span>
        </Link>
        <div className={styles.worldName}><small>{journey.hero} world</small><strong>{journey.title}</strong></div>
        <div className={styles.hudActions}>
          <div className={styles.language} role="group" aria-label="Story language">
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "hi"} onClick={() => setLanguage("hi")}>हिं</button>
          </div>
          <button className={styles.sarthi} type="button" onClick={() => { setSarthiOpen(true); setSarthiInput(language === "hi" ? `${activeTitle} की कहानी सरल भाषा में बताइए` : `Tell me the story of ${active.title}`); }}>✦ <span>Ask Sārthi</span></button>
        </div>
      </header>

      <section className={styles.viewport} aria-label={`${journey.hero} story world`}>
        <div className={styles.horizon} aria-hidden="true" />
        <div className={styles.storyPath} role="list" aria-label="Story scenes">
          {journey.stops.map((stop, index) => {
            const selected = index === activeIndex;
            const visited = exploredSet.has(stop.id);
            const localizedStop = sceneCopy(stop, language);
            const stopTitle = localizedStop.title ?? stop.title;
            return (
              <button
                type="button"
                role="listitem"
                className={`${styles.storyNode} ${selected ? styles.storyNodeActive : ""} ${visited ? styles.storyNodeVisited : ""}`}
                style={{ "--node-x": `${index * 230}px`, "--node-y": `${95 + (index % 2) * 62}px`, "--z": `${(index % 3) * 34}px` } as CSSProperties}
                onClick={() => travelTo(index)}
                aria-current={selected ? "step" : undefined}
                aria-label={`${stop.ordinal}. ${stopTitle}`}
                key={stop.id}
              >
                <span className={styles.nodeOrbit}/><span className={styles.nodeGlow}/><span className={styles.nodeCore}/>
                <span className={styles.nodeCopy}><small>{String(stop.ordinal).padStart(2, "0")}</small><strong>{stopTitle}</strong></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.storyBeat} aria-live="polite" lang={language === "hi" ? "hi" : "en"}>
        <p>{copy.kicker}</p>
        <h1>{activeTitle}</h1>
        <span>{copy.story}</span>
        <small className={styles.retellingLabel}>{language === "hi" ? "देवम की स्रोत-आधारित सरल कथा" : "Devam source-grounded story retelling"}</small>
        <div className={styles.actions}>
          <button type="button" onClick={continueJourney}>{activeIndex === journey.stops.length - 1 ? (language === "hi" ? "यह यात्रा पूरी करें" : "Complete this path") : copy.invitation}<span>→</span></button>
          {activeIndex > 0 && <button type="button" onClick={() => travelTo(activeIndex - 1)}>{language === "hi" ? "पीछे" : "Back"}</button>}
        </div>
        <details className={styles.sourceDetails}>
          <summary>{language === "hi" ? "कथा का स्रोत" : "Story source"}</summary>
          <strong>{active.citation.workTitle}</strong>
          <span>{active.citation.editionTitle} · {locatorLabel(active.citation.locator)}</span>
          <small>{journey.sourceBoundary}</small>
        </details>
      </section>

      <div className={styles.progress} aria-label={`${explored.length} of ${journey.stops.length} scenes explored`}>
        {journey.stops.map((stop, index) => <button type="button" aria-label={`Go to scene ${index + 1}`} onClick={() => travelTo(index)} className={index === activeIndex ? styles.progressActive : exploredSet.has(stop.id) ? styles.progressVisited : ""} key={stop.id} />)}
      </div>

      {showGuide && <p className={styles.guide}>Choose a light to move through the story</p>}
      {complete && <div className={styles.complete}><span>Path discovered</span><strong>The universe continues beyond this route.</strong><Link href="/">Return to the stars</Link></div>}
      {sarthiOpen && <button className={styles.scrim} type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi" />}
      <aside className={`${styles.sarthiPanel} ${sarthiOpen ? styles.sarthiPanelOpen : ""}`} aria-hidden={!sarthiOpen} aria-label="Sarthi conversation">
        <header><div><span>✦</span><p><strong>Sārthi</strong><small>Companion inside this story</small></p></div><button type="button" onClick={() => setSarthiOpen(false)} aria-label="Close Sarthi">×</button></header>
        <div className={styles.chatTranscript} aria-live="polite">
          <small>Exploring · {activeTitle}</small>
          <p className={styles.sarthiMessage}>Ask me about this moment, the people in it, or where the story moves next.</p>
          {askedQuestion && <p className={styles.userMessage}>{askedQuestion}</p>}
          {sarthiBusy && <p className={styles.sarthiMessage}>Looking through Devam&apos;s evidence…</p>}
          {sarthiReply && <div className={styles.sarthiMessage}>{sarthiReply.ok ? sarthiReply.answer : sarthiReply.message}{sarthiReply.citations?.length ? <details><summary>Sources</summary>{sarthiReply.citations.map((citation) => <p key={citation.passageId}><strong>{citation.workTitle}</strong><small>{citation.editionTitle}</small></p>)}</details> : null}</div>}
          {accountPrompt && <div className={styles.accountPrompt}><strong>Continue with your account</strong><span>Your guest Sārthi exchange is complete.</span><Link href="/account">Sign in to keep talking</Link></div>}
        </div>
        <form className={styles.chatComposer} onSubmit={askSarthi}><label className="srOnly" htmlFor="journey-sarthi-message">Message Sarthi</label><textarea id="journey-sarthi-message" value={sarthiInput} onChange={(event) => setSarthiInput(event.target.value)} placeholder={`Ask about ${active.title}…`} rows={2} /><button type="submit" disabled={sarthiBusy || sarthiInput.trim().length < 2}>Send</button></form>
      </aside>
    </main>
  );
}
