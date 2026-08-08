"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PanchangFact } from "@/lib/panchang/contracts";
import type { ObservanceResolutionResult } from "@/lib/panchang/observance-rules";
import type { PracticeGuidanceResult } from "@/lib/domain/practice";
import { resolveHeroCampaignDay } from "@/lib/campaigns/hero-calendar";
import { resolveRitualSeasonDay } from "@/lib/campaigns/ritual-season";
import { weekdayPracticeSlug } from "@/lib/practice/weekday-key";
import { trackProductEvent } from "@/lib/analytics/client";
import styles from "./today-experience.module.css";

type LocationChoice = {
  code: string;
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

const LOCATIONS: LocationChoice[] = [
  { code: "mumbai", label: "Mumbai", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata" },
  { code: "ahmedabad", label: "Ahmedabad", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata" },
  { code: "delhi", label: "Delhi", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" },
  { code: "kolkata", label: "Kolkata", latitude: 22.5726, longitude: 88.3639, timezone: "Asia/Kolkata" },
  { code: "chennai", label: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: "Asia/Kolkata" },
  { code: "bengaluru", label: "Bengaluru", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata" },
  { code: "hyderabad", label: "Hyderabad", latitude: 17.385, longitude: 78.4867, timezone: "Asia/Kolkata" },
  { code: "varanasi", label: "Varanasi", latitude: 25.3176, longitude: 82.9739, timezone: "Asia/Kolkata" },
  { code: "patna", label: "Patna", latitude: 25.5941, longitude: 85.1376, timezone: "Asia/Kolkata" },
  { code: "guwahati", label: "Guwahati", latitude: 26.1445, longitude: 91.7362, timezone: "Asia/Kolkata" },
  { code: "amritsar", label: "Amritsar", latitude: 31.634, longitude: 74.8723, timezone: "Asia/Kolkata" },
];

const TRADITIONS = [
  { code: "smarta-west-india", label: "West India · Smarta context" },
  { code: "smarta-north-india", label: "North India · Smarta context" },
  { code: "regional-bengal", label: "Bengal · regional context" },
  { code: "shakta-bengal", label: "Bengal · Shakta context" },
  { code: "vaishnava-iskcon", label: "Vaishnava · ISKCON context" },
  { code: "swaminarayan-baps", label: "Swaminarayan · BAPS context" },
  { code: "smarta-south-india", label: "South India · Smarta context" },
  { code: "surya-chhath-bihar-purvanchal", label: "Bihar/Purvanchal · Chhath family context" },
  { code: "jain-umbrella", label: "Jain · umbrella context" },
  { code: "sikh-sgpc", label: "Sikh · SGPC context" },
  { code: "regional-kashi-varanasi", label: "Kashi/Varanasi · regional context" },
];

function localDateNow() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function timeAt(iso: string, timezone: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function windowAt(window: { startUtc: string; endUtc: string }, timezone: string) {
  return `${timeAt(window.startUtc, timezone)} – ${timeAt(window.endUtc, timezone)}`;
}

function selectedDecisionWindow(rule: unknown): { kind: string; startUtc: string; endUtc: string } | null {
  if (!rule || typeof rule !== "object") return null;
  const record = rule as { selectedCivilDate?: unknown; candidateDays?: unknown };
  if (typeof record.selectedCivilDate !== "string" || !Array.isArray(record.candidateDays)) return null;
  const candidate = record.candidateDays.find((value) => {
    if (!value || typeof value !== "object") return false;
    return (value as { civilDate?: unknown }).civilDate === record.selectedCivilDate;
  }) as { decisionWindow?: unknown } | undefined;
  if (!candidate?.decisionWindow || typeof candidate.decisionWindow !== "object") return null;
  const window = candidate.decisionWindow as { kind?: unknown; startUtc?: unknown; endUtc?: unknown };
  return typeof window.kind === "string" && typeof window.startUtc === "string" && typeof window.endUtc === "string"
    ? { kind: window.kind, startUtc: window.startUtc, endUtc: window.endUtc }
    : null;
}

function ObservanceTiming({ rule, timezone }: { rule: unknown; timezone: string }) {
  const window = selectedDecisionWindow(rule);
  if (!window) return null;
  return <p><strong>{window.kind.replaceAll("_", " ")}:</strong> {windowAt(window, timezone)}</p>;
}

async function loadPracticeGuidance(input: {
  observanceSlug: string;
  languageCode: "en";
  regionCode: string;
  traditionCode: string;
}): Promise<PracticeGuidanceResult | null> {
  try {
    const response = await fetch("/api/practice-guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await response.json();
    return response.ok && result.ok === true ? result as PracticeGuidanceResult : null;
  } catch {
    return null;
  }
}

export function TodayExperience({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate);
  const [location, setLocation] = useState<LocationChoice>(LOCATIONS[0]);
  const [traditionCode, setTraditionCode] = useState(TRADITIONS[0].code);
  const [fact, setFact] = useState<PanchangFact | null>(null);
  const [observances, setObservances] = useState<ObservanceResolutionResult | null>(null);
  const [practiceGuidances, setPracticeGuidances] = useState<PracticeGuidanceResult[]>([]);
  const [weekdayGuidance, setWeekdayGuidance] = useState<PracticeGuidanceResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("");
  const campaignDay = useMemo(() => resolveHeroCampaignDay({ civilDate: date, traditionCode }), [date, traditionCode]);
  const ritualSeasonDay = useMemo(() => resolveRitualSeasonDay({ civilDate: date, traditionCode }), [date, traditionCode]);

  useEffect(() => {
    const localDate = localDateNow();
    if (localDate === initialDate) return;
    const sync = window.setTimeout(() => setDate(localDate), 0);
    return () => window.clearTimeout(sync);
  }, [initialDate]);

  const calculate = useCallback(async (nextLocation = location) => {
    setStatus("loading");
    setMessage("");
    try {
      const body = JSON.stringify({
        civilDate: date,
        latitude: nextLocation.latitude,
        longitude: nextLocation.longitude,
        timezone: nextLocation.timezone,
        traditionCode,
      });
      const init = { method: "POST", headers: { "Content-Type": "application/json" }, body };
      const [response, observanceResponse] = await Promise.all([
        fetch("/api/panchang", init),
        fetch("/api/observances", init),
      ]);
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.message ?? "The Panchang could not be calculated.");
      const observanceResult = await observanceResponse.json();
      const resolvedObservances = observanceResponse.ok && observanceResult.ok === true
        ? observanceResult as ObservanceResolutionResult
        : null;
      const calculatedFact = result as PanchangFact;
      setFact(calculatedFact);
      setObservances(resolvedObservances);
      const supportedPracticeObservances = ["ganesh-chaturthi", "shardiya-navaratri-begins", "karnataka-saraswati-ayudha-puja", "diwali-lakshmi-puja", "krishna-janmashtami-smarta", "krishna-janmashtami-iskcon", "hartalika-teej", "rishi-panchami", "radha-ashtami-iskcon", "kojagara-puja-sharad-purnima", "jain-diwali-umbrella", "bandi-chhor-divas-sgpc", "ahoi-ashtami-north-india", "karwa-chauth", "sankashti-chaturthi-2026-09", "sankashti-chaturthi-2026-10", "sankashti-chaturthi-2026-11", "sankashti-chaturthi-2026-12", "aja-ekadashi", "parsva-ekadashi", "indira-ekadashi", "papankusha-ekadashi", "rama-ekadashi", "devutthana-ekadashi", "utpanna-ekadashi", "masika-shivaratri-2026-09", "masika-shivaratri-2026-10", "masika-shivaratri-2026-11", "masika-shivaratri-2026-12", "bhadrapada-purnima", "ashwina-purnima", "kartika-purnima", "bhadrapada-amavasya", "ashwina-amavasya", "kartika-amavasya", "margashirsha-amavasya", "tulasi-vivah-dwadashi", "tulsi-vivah-baps-begins", "tulsi-vivah-baps-samapt", "dev-deepawali-varanasi", "mokshada-ekadashi", "chhath-puja-sandhya-arghya", "govatsa-dwadashi", "dhantrayodashi", "yama-deepam", "naraka-chaturdashi", "kali-chaudas-baps", "gujarati-new-year-baps", "karnataka-balipadyami", "tamil-deepavali-naraka-chaturdashi", "bengal-kali-puja", "bali-pratipada", "govardhan-puja", "bhai-dooj"];
      supportedPracticeObservances.push("vishwakarma-puja-bengal");
      supportedPracticeObservances.push("kanya-sankranti", "tula-sankranti", "vrishchika-sankranti", "dhanu-sankranti");
      supportedPracticeObservances.push("purnima-shraddha", "pratipada-shraddha", "dwitiya-shraddha", "tritiya-shraddha", "maha-bharani", "chaturthi-shraddha", "panchami-shraddha", "shashthi-shraddha", "saptami-shraddha", "ashtami-shraddha", "navami-shraddha", "dashami-shraddha", "ekadashi-shraddha", "dwadashi-shraddha", "magha-shraddha", "trayodashi-shraddha", "chaturdashi-shraddha", "sarva-pitru-amavasya");
      supportedPracticeObservances.push("ananta-chaturdashi");
      supportedPracticeObservances.push("kalabhairava-jayanti");
      supportedPracticeObservances.push("vivaha-panchami");
      supportedPracticeObservances.push("masika-durgashtami-2026-09", "masika-durgashtami-2026-10", "masika-durgashtami-2026-11", "masika-durgashtami-2026-12");
      const practiceObservances = [...new Set(resolvedObservances?.matchedRules
        .filter((rule) => rule.appliesToRequestedDate && supportedPracticeObservances.includes(rule.observanceSlug))
        .map((rule) => rule.observanceSlug) ?? [])];
      if (campaignDay?.practiceGuideObservanceSlug && !practiceObservances.includes(campaignDay.practiceGuideObservanceSlug)) practiceObservances.push(campaignDay.practiceGuideObservanceSlug);
      const regionCode = traditionCode === "smarta-north-india" ? "north-india"
        : traditionCode === "smarta-west-india" ? "west-india"
          : traditionCode === "surya-chhath-bihar-purvanchal" ? "bihar-purvanchal"
          : traditionCode === "shakta-bengal" || traditionCode === "regional-bengal" ? "bengal"
            : traditionCode === "vaishnava-iskcon" ? "iskcon-india"
              : traditionCode === "swaminarayan-baps" ? "baps-gujarat"
                : traditionCode === "jain-umbrella" ? "jain-india"
                : traditionCode === "sikh-sgpc" ? "sikh-punjab"
                  : traditionCode === "regional-kashi-varanasi" ? "kashi-varanasi"
                    : "south-india";
      const weekdaySlug = weekdayPracticeSlug(calculatedFact.vara);
      const [festivalGuides, weekdayGuide] = await Promise.all([
        Promise.all(practiceObservances.map((observanceSlug) => loadPracticeGuidance({ observanceSlug, languageCode: "en", regionCode, traditionCode }))),
        weekdaySlug
          ? loadPracticeGuidance({ observanceSlug: weekdaySlug, languageCode: "en", regionCode, traditionCode })
          : Promise.resolve(null),
      ]);
      setPracticeGuidances(festivalGuides.filter((guide): guide is PracticeGuidanceResult => guide !== null));
      setWeekdayGuidance(weekdayGuide);
      setStatus("ready");
      trackProductEvent("today_resolved", practiceObservances.length > 0 ? "observance" : "calendar_only");
    } catch (error) {
      setFact(null);
      setObservances(null);
      setPracticeGuidances([]);
      setWeekdayGuidance(null);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The Panchang could not be calculated.");
    }
  }, [campaignDay, date, location, traditionCode]);

  const requestDeviceLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Location access is not available in this browser. Choose a city instead.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          code: "device",
          label: "Your location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        setLocation(next);
      },
      () => {
        setStatus("error");
        setMessage("Location permission was not granted. Choose a city to continue.");
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 3_600_000 },
    );
  };

  const titleDate = useMemo(
    () => new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)),
    [date],
  );
  const matchedObservances = observances?.matchedRules.filter((rule) => rule.appliesToRequestedDate) ?? [];
  const unresolvedObservances = observances?.unresolvedCandidates ?? [];

  return (
    <main className={styles.shell}>
      <div className={styles.cosmos} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <Image src="/brand/devam-mark.png" alt="" width={46} height={46} priority />
          <span>Devam</span>
        </Link>
        <nav aria-label="Today navigation">
          <Link href="/">Living Atlas</Link>
          <Link href="/sarthi">Ask Sarthi</Link>
          <span>Today</span>
        </nav>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>Your day in the sacred calendar</p>
        <h1>Today, in context.</h1>
        <p className={styles.intro}>The astronomical shape of the day—calculated for where you are. Regional observances and practice guidance remain separately sourced.</p>
      </section>

      <section className={styles.controls} aria-label="Panchang context">
        <label>
          <span>Date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          <span>Place</span>
          <select
            value={location.code}
            onChange={(event) => {
              const next = LOCATIONS.find((candidate) => candidate.code === event.target.value);
              if (next) setLocation(next);
            }}
          >
            {location.code === "device" && <option value="device">Your location</option>}
            {LOCATIONS.map((candidate) => <option value={candidate.code} key={candidate.code}>{candidate.label}</option>)}
          </select>
        </label>
        <label>
          <span>Practice context</span>
          <select value={traditionCode} onChange={(event) => setTraditionCode(event.target.value)}>
            {TRADITIONS.map((tradition) => <option value={tradition.code} key={tradition.code}>{tradition.label}</option>)}
          </select>
        </label>
        <div className={styles.actions}>
          <button className={styles.locationButton} type="button" onClick={requestDeviceLocation}>Use my location</button>
          <button className={styles.calculateButton} type="button" onClick={() => void calculate()}>Show my day</button>
        </div>
      </section>

      <section className={styles.day} aria-live="polite" aria-busy={status === "loading"}>
        <div className={styles.dayHeading}>
          <div>
            <p>{location.label}</p>
            <h2>{titleDate}</h2>
          </div>
          {fact && <span className={styles.vara}>{fact.vara.name}</span>}
        </div>

        {status === "idle" && <p className={styles.state}>Choose your date and place, then open the day.</p>}
        {status === "loading" && <p className={styles.state}>Reading the sky for this place…</p>}
        {status === "error" && <p className={styles.error}>{message}</p>}

        {fact && status === "ready" && (
          <>
            <div className={styles.sunline}>
              <span><small>Sunrise</small>{timeAt(fact.sunriseUtc, fact.request.timezone)}</span>
              <i aria-hidden="true" />
              <span><small>Sunset</small>{timeAt(fact.sunsetUtc, fact.request.timezone)}</span>
            </div>
            <div className={styles.moonline}>
              <span><small>Moonrise</small>{fact.moonriseUtc ? timeAt(fact.moonriseUtc, fact.request.timezone) : "No local event"}</span>
              <span><small>Moonset</small>{fact.moonsetUtc ? timeAt(fact.moonsetUtc, fact.request.timezone) : "No local event"}</span>
            </div>

            {campaignDay ? (
              <article className={styles.campaignDay}>
                <span>{campaignDay.ordinal}</span>
                <div>
                  <small>{campaignDay.title} · day {campaignDay.ordinal} of {campaignDay.totalDays}</small>
                  <h3>{campaignDay.commonName}</h3>
                  <p>{campaignDay.displayNote}</p>
                </div>
                <Link href={`/journeys/${campaignDay.heroSlug}`}>Explore {campaignDay.heroLabel}</Link>
              </article>
            ) : null}

            {ritualSeasonDay ? (
              <article className={styles.campaignDay}>
                <span>{ritualSeasonDay.ordinal}</span>
                <div>
                  <small>{ritualSeasonDay.title} · calendar day {ritualSeasonDay.ordinal} of {ritualSeasonDay.totalDays}</small>
                  <h3>{ritualSeasonDay.labels.map((label) => label.en).join(" · ")}</h3>
                  <p>{ritualSeasonDay.displayNote}</p>
                </div>
              </article>
            ) : null}

            {matchedObservances.map((matchedObservance) => (
              <article className={styles.observance} key={matchedObservance.ruleId}>
                <div>
                  <small>Observed in this bounded context</small>
                  <h3>{matchedObservance.canonicalName}</h3>
                  {"sequenceDay" in matchedObservance ? (
                    <p><strong>Day {matchedObservance.sequenceDay.ordinal}: {matchedObservance.sequenceDay.nameEn}</strong> · {matchedObservance.profile.referenceLocation}</p>
                  ) : null}
                  <p>{matchedObservance.precedence.explanation}</p>
                  <ObservanceTiming rule={matchedObservance} timezone={fact.request.timezone} />
                  {"parana" in matchedObservance && matchedObservance.parana.status === "resolved_for_exact_iskcon_reference_profile" ? (
                    <p><strong>Next-morning pāraṇa:</strong> {windowAt({ startUtc: matchedObservance.parana.startUtc, endUtc: matchedObservance.parana.endUtc }, fact.request.timezone)}</p>
                  ) : null}
                  {"parana" in matchedObservance && matchedObservance.parana.status === "unresolved_smarta_location_specific_hari_vasara_evidence_required" ? (
                    <p><strong>Pāraṇa:</strong> not assigned yet for this Smarta context; the location-specific Hari Vāsara boundary still needs its own evidence.</p>
                  ) : null}
                </div>
                <span>{traditionCode.replaceAll("-", " ")} · bounded rule</span>
              </article>
            ))}

            {unresolvedObservances.map((candidate) => (
              <article className={styles.pendingObservance} key={candidate.observanceSlug}>
                <div>
                  <small>Date not assigned yet</small>
                  <h3>{candidate.canonicalName}</h3>
                  <p>{candidate.displayReason}</p>
                </div>
                <span>tradition adjudication open</span>
              </article>
            ))}

            {weekdayGuidance?.status === "ritual_procedure_available" && (
              <details className={styles.practice}>
                <summary>
                  <span><small>Optional weekly rhythm</small>{weekdayGuidance.guide.title}</span>
                  <strong>Open 5-minute practice</strong>
                </summary>
                <p>{weekdayGuidance.guide.summary}</p>
                {weekdayGuidance.guide.tiers.slice(0, 1).map((tier) => (
                  <div className={styles.tierList} key={tier.tier}>
                    <div className={styles.tier}>
                      <h4>{tier.label} · about {tier.estimatedMinutes} minutes</h4>
                      <ol>
                        {tier.steps.map((step) => (
                          <li key={step.ordinal}>
                            <span>{step.ordinal}</span>
                            <div><strong>{step.instruction}</strong><small>{step.why}</small></div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
                <footer>{weekdayGuidance.guide.familyPracticeNote}</footer>
                <details className={styles.sourceBasis}>
                  <summary><span><small>Evidence</small>Why this option appears</span><strong>Sources</strong></summary>
                  <ul>
                    {weekdayGuidance.guide.evidence.sources.map((source) => (
                      <li key={source.sourceId}>
                        <span>{source.sourceClass.replaceAll("_", " ")}</span>
                        <div><strong>{source.title}</strong><small>{source.publisher} · <a href={source.url ?? undefined} target="_blank" rel="noreferrer">Open source</a></small></div>
                      </li>
                    ))}
                  </ul>
                </details>
              </details>
            )}

            {practiceGuidances.filter((guidance) => guidance.status === "ritual_procedure_available").map((practiceGuidance) => practiceGuidance.status === "ritual_procedure_available" && (
              <details className={styles.practice} key={practiceGuidance.guide.guideId}>
                <summary>
                  <span><small>{practiceGuidance.guide.kind === "user_complete_observance_lane" ? "Complete for this participant context" : "Contextual home practice"}</small>{practiceGuidance.guide.title}</span>
                  <strong>Choose a form</strong>
                </summary>
                <p>{practiceGuidance.guide.summary}</p>
                {practiceGuidance.guide.userCompleteContext ? (
                  <details className={styles.sourceBasis}>
                    <summary><span><small>Understand the day</small>Meaning, stories and local practice</span><strong>Open</strong></summary>
                    <h4>Why it matters</h4>
                    <p>{practiceGuidance.guide.userCompleteContext.significance.text}</p>
                    <small>{practiceGuidance.guide.userCompleteContext.significance.scopeNote}</small>
                    <h4>Stories you may hear</h4>
                    <ul>
                      {practiceGuidance.guide.userCompleteContext.originNarratives.map((narrative) => (
                        <li key={narrative.narrativeId}>
                          <span>Story</span>
                          <div><strong>{narrative.title}</strong><small>{narrative.summary}</small><small>{narrative.traditionScope}</small></div>
                        </li>
                      ))}
                    </ul>
                    <h4>What people typically do</h4>
                    <ul>
                      {practiceGuidance.guide.userCompleteContext.typicalPractices.map((practice) => (
                        <li key={practice.practiceId}>
                          <span>Context</span>
                          <div><strong>{practice.populationScope}</strong><small>{practice.description}</small></div>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
                <div className={styles.tierList}>
                  {practiceGuidance.guide.tiers.map((tier, index) => (
                    <details className={styles.tier} key={tier.tier} open={index === 0}>
                      <summary>
                        <span><small>{tier.tier} · about {tier.estimatedMinutes} minutes</small>{tier.label}</span>
                        <strong>{index === 0 ? "Start here" : "Open"}</strong>
                      </summary>
                      <h4>What to gather</h4>
                      <ul>
                        {tier.materials.map((material) => (
                          <li key={material.item}>
                            <span>{material.optional ? "Optional" : "Needed"}</span>
                            <div><strong>{material.item}</strong>{material.substitutions.length > 0 && <small>Instead: {material.substitutions.join("; ")}</small>}</div>
                          </li>
                        ))}
                      </ul>
                      <h4>What to do</h4>
                      <ol>
                        {tier.steps.map((step) => (
                          <li key={step.ordinal}>
                            <span>{step.ordinal}</span>
                            <div><strong>{step.instruction}</strong><small>{step.why}</small></div>
                          </li>
                        ))}
                      </ol>
                    </details>
                  ))}
                </div>
                {practiceGuidance.guide.dailySequence?.length ? (
                  <details className={styles.sourceBasis}>
                    <summary><span><small>Across the festival</small>{practiceGuidance.guide.companionToObservanceSlug === "shardiya-navaratri-begins" ? "Ten-day reflection path" : "Status-labelled festival path"}</span><strong>Open</strong></summary>
                    <ol className={styles.daySequence}>
                      {practiceGuidance.guide.dailySequence.map((day) => (
                        <li key={day.ordinal}>
                          <span>{day.ordinal}</span>
                          <div><strong>{day.commonName}</strong><small>{day.reflection}</small>{day.calendarNote ? <small>{day.calendarNote}</small> : null}</div>
                        </li>
                      ))}
                    </ol>
                  </details>
                ) : null}
                <footer>{practiceGuidance.guide.familyPracticeNote}</footer>
                {practiceGuidance.guide.userCompleteContext ? (
                  <details className={styles.sourceBasis}>
                    <summary><span><small>Keep traditions separate</small>Variants and boundaries</span><strong>Open</strong></summary>
                    <ul>
                      {practiceGuidance.guide.userCompleteContext.variants.map((variant) => (
                        <li key={variant.variantId}><span>Variant</span><div><strong>{variant.dimension}</strong><small>{variant.description}</small></div></li>
                      ))}
                      {practiceGuidance.guide.userCompleteContext.safetyAndBoundaries.map((boundary) => (
                        <li key={boundary}><span>Boundary</span><div><small>{boundary}</small></div></li>
                      ))}
                    </ul>
                  </details>
                ) : null}
                <details className={styles.sourceBasis}>
                  <summary><span><small>Evidence</small>Why Devam suggests this</span><strong>Sources</strong></summary>
                  <ul>
                    {practiceGuidance.guide.evidence.sources.map((source) => (
                      <li key={source.sourceId}>
                        <span>{source.sourceClass.replaceAll("_", " ")}</span>
                        <div>
                          <strong>{source.title}</strong>
                          <small>{source.publisher}{source.url ? <> · <a href={source.url} target="_blank" rel="noreferrer">Open source</a></> : null}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              </details>
            ))}

            {practiceGuidances.filter((guidance) => guidance.status === "source_bounded_companion_available").map((practiceGuidance) => practiceGuidance.status === "source_bounded_companion_available" && (
              <details className={styles.practice} key={practiceGuidance.guide.guideId}>
                <summary>
                  <span><small>Optional grounded practice</small>{practiceGuidance.guide.title}</span>
                  <strong>Open four-step reading</strong>
                </summary>
                <p>{practiceGuidance.guide.summary}</p>
                <ol>
                  {practiceGuidance.guide.steps.map((step) => (
                    <li key={step.ordinal}>
                      <span>{step.ordinal}</span>
                      <div><strong>{step.instruction}</strong><small>{step.rationale}</small></div>
                    </li>
                  ))}
                </ol>
                <footer>{practiceGuidance.guide.familyPracticeNote}</footer>
              </details>
            ))}

            <div className={styles.limbs}>
              <article><small>Tithi at sunrise</small><strong>{fact.tithi.name}</strong><span>{fact.tithi.paksha} paksha · until {timeAt(fact.tithi.endsAtUtc, fact.request.timezone)}</span></article>
              <article><small>Nakshatra</small><strong>{fact.nakshatra.name}</strong><span>until {timeAt(fact.nakshatra.endsAtUtc, fact.request.timezone)}</span></article>
              <article><small>Yoga</small><strong>{fact.yoga.name}</strong><span>until {timeAt(fact.yoga.endsAtUtc, fact.request.timezone)}</span></article>
              <article><small>Karana</small><strong>{fact.karana.name}</strong><span>until {timeAt(fact.karana.endsAtUtc, fact.request.timezone)}</span></article>
              <article><small>Solar rashi</small><strong>{fact.solarRashi.name}</strong><span>{fact.solarRashi.nextName} begins {timeAt(fact.solarRashi.endsAtUtc, fact.request.timezone)}</span></article>
            </div>

            <div className={styles.windows}>
              <h3>Daily windows</h3>
              <dl>
                <div><dt>Brahma Muhurta</dt><dd>{windowAt(fact.windows.brahmaMuhurta, fact.request.timezone)}</dd></div>
                <div><dt>Abhijit Muhurta</dt><dd>{windowAt(fact.windows.abhijitMuhurta, fact.request.timezone)}</dd></div>
                <div><dt>Rahu Kalam</dt><dd>{windowAt(fact.windows.rahuKalam, fact.request.timezone)}</dd></div>
                <div><dt>Yamaganda</dt><dd>{windowAt(fact.windows.yamaganda, fact.request.timezone)}</dd></div>
                <div><dt>Gulika</dt><dd>{windowAt(fact.windows.gulika, fact.request.timezone)}</dd></div>
              </dl>
            </div>

            <aside className={styles.boundary}>
              <strong>{matchedObservances.length || unresolvedObservances.length || campaignDay || ritualSeasonDay ? "Bounded observance layer" : "Astronomical layer"}</strong>
              <p>{matchedObservances.length || unresolvedObservances.length || campaignDay || ritualSeasonDay
                ? campaignDay && matchedObservances.length === 0 && unresolvedObservances.length === 0
                  ? campaignDay.boundarySummary
                  : ritualSeasonDay && matchedObservances.length === 0 && unresolvedObservances.length === 0
                    ? ritualSeasonDay.boundarySummary
                  : `${matchedObservances.length} evidence-bounded rule${matchedObservances.length === 1 ? " is" : "s are"} resolved here${unresolvedObservances.length ? `; ${unresolvedObservances.length} candidate remains unassigned` : ""}. Complete day coverage, modern family-practice guidance, and ritual instructions are still being assembled.`
                : "This result does not yet assign a vrata or festival, or prescribe what your family should do. Those answers will appear only when Devam’s regional and tradition-aware evidence rules are attached."}</p>
              <small>{fact.engine.version}</small>
            </aside>
          </>
        )}
      </section>
    </main>
  );
}
