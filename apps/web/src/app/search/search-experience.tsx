"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { LIBRARY_COVERAGE_SNAPSHOT, formatLibraryBytes } from "@/data/library-coverage";
import styles from "./search.module.css";

type Citation = {
  passageId: string;
  sourceOrdinal: number;
  workTitle: string;
  editionTitle: string;
  quotation?: string;
};

type SearchResult = {
  id: string;
  title: string;
  statement: string;
  languageCode: string;
  claimKind: string;
  citations: Citation[];
  sourceBoundary: string;
};

type SearchResponse = {
  ok: boolean;
  results?: SearchResult[];
  total?: number;
  coverage?: string;
  retrievalStatus?: "connected" | "not_configured" | "temporarily_unavailable";
  sourceCatalogMatches?: Array<{ sha256: string; title: string; bytes: number; suffixes: string[]; roles: string[]; provenanceCount: number }>;
  sourceCatalogTotal?: number;
  sourceCatalogBoundary?: string;
  message?: string;
};

const suggestions = ["Ganesha and obstacles", "seven books of the Ramayana", "Devimahatmya chapter 82", "Diwali festival path"];

function isEvidenceBoundedSynthesis(result: SearchResult) {
  return result.claimKind === "evidence_bounded_synthesis";
}

export function SearchExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const normalizedInitialQuery = initialQuery.trim();
  const [query, setQuery] = useState(normalizedInitialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(normalizedInitialQuery);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [busy, setBusy] = useState(normalizedInitialQuery.length >= 2);

  useEffect(() => {
    if (normalizedInitialQuery.length < 2) return;
    let active = true;
    fetch(`/api/search?query=${encodeURIComponent(normalizedInitialQuery)}`)
      .then((result) => result.json() as Promise<SearchResponse>)
      .then((result) => { if (active) setResponse(result); })
      .catch(() => { if (active) setResponse({ ok: false, message: "The library search could not be reached. Please try again." }); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [normalizedInitialQuery]);

  async function search(value: string) {
    const normalized = value.trim();
    if (normalized.length < 2 || busy) return;
    setBusy(true);
    setSubmittedQuery(normalized);
    try {
      const result = await fetch(`/api/search?query=${encodeURIComponent(normalized)}`);
      setResponse(await result.json() as SearchResponse);
    } catch {
      setResponse({ ok: false, message: "The library search could not be reached. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void search(query);
  }

  return (
    <main className={styles.shell}>
      <div className={styles.stars} aria-hidden="true" />
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Return to the Living Atlas">
          <Image src="/brand/devam-mark.png" alt="" width={42} height={42} priority />
          <span>Devam</span>
        </Link>
        <div className={styles.headerActions}><Link className={styles.atlasLink} href="/sarthi">Ask Sarthi</Link><Link className={styles.atlasLink} href="/">Back to the Atlas</Link></div>
      </header>

      <section className={styles.hero}>
        <p>The library</p>
        <h1>Find the source.<br /><em>Follow the meaning.</em></h1>
        <form className={styles.searchForm} onSubmit={submit} role="search">
          <label className="srOnly" htmlFor="library-query">Search Devam</label>
          <input
            id="library-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a deity, ritual, story, place, or passage"
            autoComplete="off"
          />
          <button type="submit" disabled={busy || query.trim().length < 2}>{busy ? "Searching…" : "Search"}</button>
        </form>
        <div className={styles.suggestions} aria-label="Suggested searches">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" disabled={busy} onClick={() => { setQuery(suggestion); void search(suggestion); }}>{suggestion}</button>
          ))}
        </div>
      </section>

      <section className={styles.results} aria-live="polite">
        {response?.ok && ((response.results?.length ?? 0) > 0 || (response.sourceCatalogMatches?.length ?? 0) > 0) ? (
          <>
            <div className={styles.resultHeader}>
              <p>{response.total ?? 0} grounded · {response.sourceCatalogTotal ?? 0} preserved source match{response.sourceCatalogTotal === 1 ? "" : "es"}</p>
              <span>{submittedQuery}</span>
            </div>
            {response.retrievalStatus === "temporarily_unavailable" && <p className={styles.boundary}>{response.coverage}</p>}
            {(response.results?.length ?? 0) > 0 && <div className={styles.resultGrid}>
              {response.results?.map((result) => (
                <article className={styles.resultCard} key={result.id}>
                  <div className={styles.resultMeta}>
                    <span>{isEvidenceBoundedSynthesis(result) ? "Evidence-bounded synthesis" : "Source-bounded claim"}</span>
                    <small>{result.languageCode.toUpperCase()}</small>
                  </div>
                  <h2>{result.title}</h2>
                  <p>{result.statement}</p>
                  <details>
                    <summary>
                      {isEvidenceBoundedSynthesis(result)
                        ? `Open ${result.citations.length} evidence coordinate${result.citations.length === 1 ? "" : "s"}`
                        : `Open ${result.citations.length} exact passage${result.citations.length === 1 ? "" : "s"}`}
                    </summary>
                    {result.citations.map((citation) => (
                      <div className={styles.passage} key={citation.passageId}>
                        <strong>{citation.workTitle} · source unit {citation.sourceOrdinal}</strong>
                        {citation.quotation && <blockquote>{citation.quotation}</blockquote>}
                        <small>{citation.editionTitle}</small>
                      </div>
                    ))}
                    <p className={styles.boundary}>{result.sourceBoundary}</p>
                  </details>
                </article>
              ))}
            </div>}
            {(response.sourceCatalogMatches?.length ?? 0) > 0 && (
              <section className={styles.catalogSection}>
                <div className={styles.catalogHeader}>
                  <div><p>Preserved source objects</p><h2>Found in the wider vault</h2></div>
                  <span>Metadata only · not yet a verified passage</span>
                </div>
                <div className={styles.catalogGrid}>
                  {response.sourceCatalogMatches?.map((source) => (
                    <article className={styles.catalogCard} key={source.sha256}>
                      <div><span>{source.suffixes.join(" · ").toUpperCase() || "SOURCE"}</span><small>{source.bytes.toLocaleString("en-IN")} bytes</small></div>
                      <h3>{source.title}</h3>
                      <p>SHA-256 {source.sha256}</p>
                      <small>{source.provenanceCount} retained provenance record{source.provenanceCount === 1 ? "" : "s"}</small>
                    </article>
                  ))}
                </div>
                <p className={styles.catalogBoundary}>{response.sourceCatalogBoundary}</p>
              </section>
            )}
          </>
        ) : response?.ok ? (
          <div className={styles.emptyState}>
            <span>Coverage is still growing</span>
            <h2>No supported result yet for “{submittedQuery}”.</h2>
            <p>{response.coverage}</p>
          </div>
        ) : response ? (
          <div className={styles.emptyState}><h2>Search paused</h2><p>{response.message}</p></div>
        ) : (
          <div className={styles.coverageDashboard}>
            <div className={styles.coverageHeading}>
              <div><p>Library coverage · {LIBRARY_COVERAGE_SNAPSHOT.asOf}</p><h2>One roof. Three honest layers.</h2></div>
              <span>Preserved sources, reviewed knowledge, and product-ready guidance remain distinct.</span>
            </div>
            <div className={styles.coverageMetrics}>
              <article><strong>{LIBRARY_COVERAGE_SNAPSHOT.sourceLibrary.uniqueObjects.toLocaleString("en-IN")}</strong><span>unique source objects preserved</span><small>{formatLibraryBytes(LIBRARY_COVERAGE_SNAPSHOT.sourceLibrary.objectBytes)} · one copy per hash</small></article>
              <article><strong>{LIBRARY_COVERAGE_SNAPSHOT.launchLayer.deterministicDates}/{LIBRARY_COVERAGE_SNAPSHOT.launchLayer.deterministicDateTotal}</strong><span>launch-calendar days calculated</span><small>Location-aware astronomy · Sep–Dec 2026</small></article>
              <article><strong>{LIBRARY_COVERAGE_SNAPSHOT.launchLayer.userCompleteScopedLanes}</strong><span>reviewed ritual lanes</span><small>Hindi + English · each scope named</small></article>
            </div>
            <p className={styles.coverageBoundary}>{LIBRARY_COVERAGE_SNAPSHOT.sourceLibrary.boundary} {LIBRARY_COVERAGE_SNAPSHOT.launchLayer.boundary}</p>
            <div className={styles.heroCoverage}>
              {LIBRARY_COVERAGE_SNAPSHOT.heroes.map((hero) => (
                <article key={hero.slug}>
                  <header><h3>{hero.name}</h3><span>{hero.devanagari}</span></header>
                  <p><strong>Connected now</strong>{hero.connected}</p>
                  <p><strong>Still expanding</strong>{hero.open}</p>
                </article>
              ))}
            </div>
            <div className={styles.libraryPromise}>
              <div><strong>Exact sources</strong><span>Edition, language, and passage identity stay intact.</span></div>
              <div><strong>Honest synthesis</strong><span>Devam’s interpretation never replaces the source.</span></div>
              <div><strong>Expanding universe</strong><span>{LIBRARY_COVERAGE_SNAPSHOT.sourceLibrary.discoveryLeads.toLocaleString("en-IN")} discovery leads remain a queue—not inflated holdings.</span></div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
