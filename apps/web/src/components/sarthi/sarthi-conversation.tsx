"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { canGuestAskSarthi } from "@/lib/account/guest-preview";
import { trackProductEvent } from "@/lib/analytics/client";
import type { EvidenceCitation, GroundedSarthiAnswer, SarthiUnavailable } from "@/lib/sarthi/contracts";
import styles from "./sarthi-conversation.module.css";

type ConversationState = {
  status: "guest_ephemeral" | "consent_required" | "saved" | "save_failed";
  conversationId: string | null;
};

type ApiReply = (GroundedSarthiAnswer | SarthiUnavailable) & { conversation?: ConversationState };
type TranscriptMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: ApiReply;
};

function citationLabel(citation: EvidenceCitation) {
  const entries = Object.entries(citation.locator)
    .filter(([, value]) => typeof value === "string" || typeof value === "number")
    .slice(0, 3)
    .map(([key, value]) => `${key.replaceAll("_", " ")} ${value}`);
  return entries.length ? entries.join(" · ") : `source unit ${citation.sourceOrdinal}`;
}

function Evidence({ reply }: { reply: GroundedSarthiAnswer }) {
  if (!reply.citations.length && !reply.practiceGuide) {
    return <details className={styles.evidence}><summary>Why Sarthi paused here</summary><p>{reply.sourceBoundary}</p></details>;
  }
  return (
    <details className={styles.evidence}>
      <summary>{reply.practiceGuide ? "Open guidance and sources" : `Open ${reply.citations.length} source${reply.citations.length === 1 ? "" : "s"}`}</summary>
      {reply.practiceGuide ? (
        <div className={styles.guide}>
          <strong>{reply.practiceGuide.title}</strong>
          <p>{reply.practiceGuide.summary}</p>
          {reply.practiceGuide.tiers.map((tier) => (
            <details key={tier.tier}>
              <summary>{tier.label} · about {tier.estimatedMinutes} min</summary>
              <ol>{tier.steps.map((step) => <li key={step.ordinal}>{step.instruction}</li>)}</ol>
            </details>
          ))}
          {reply.practiceGuide.userCompleteContext ? (
            <details>
              <summary>Variants and boundaries</summary>
              <ul>
                {reply.practiceGuide.userCompleteContext.variants.map((variant) => (
                  <li key={variant.variantId}><strong>{variant.dimension}</strong><br />{variant.description}</li>
                ))}
                {reply.practiceGuide.userCompleteContext.safetyAndBoundaries.map((boundary) => (
                  <li key={boundary}>{boundary}</li>
                ))}
              </ul>
            </details>
          ) : null}
          <details>
            <summary>Guide sources</summary>
            {reply.practiceGuide.evidence.sources.map((source) => (
              <p key={source.sourceId}><strong>{source.title}</strong><br /><small>{source.publisher} · {source.sourceClass}</small></p>
            ))}
          </details>
          <small>{reply.practiceGuide.familyPracticeNote}</small>
        </div>
      ) : null}
      {reply.citations.map((citation) => (
        <article className={styles.citation} key={citation.passageId}>
          <strong>{citation.workTitle}</strong>
          <span>{citation.editionTitle} · {citationLabel(citation)}</span>
          {citation.quotation ? <blockquote>{citation.quotation}</blockquote> : <small>Source identity and coordinate only</small>}
        </article>
      ))}
      <p className={styles.boundary}>{reply.sourceBoundary}</p>
    </details>
  );
}

export function SarthiConversation({
  account,
  initialPrompt,
  atlasNodeSlug,
}: {
  account: { signedIn: boolean; label: string };
  initialPrompt: string;
  atlasNodeSlug?: string;
}) {
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [guestExchangeCount, setGuestExchangeCount] = useState(0);
  const [accountPrompt, setAccountPrompt] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account.signedIn) return;
    const sync = window.setTimeout(() => {
      try {
        const value = Number(window.localStorage.getItem("devam-guest-sarthi-exchanges") ?? "0");
        setGuestExchangeCount(Number.isSafeInteger(value) && value > 0 ? value : 0);
      } catch {
        setGuestExchangeCount(0);
      }
    }, 0);
    return () => window.clearTimeout(sync);
  }, [account.signedIn]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function send(message: string) {
    const normalized = message.trim();
    if (normalized.length < 2 || busy) return;
    if (!canGuestAskSarthi(guestExchangeCount, account.signedIn)) {
      setAccountPrompt(true);
      return;
    }
    const userMessage: TranscriptMessage = { id: crypto.randomUUID(), role: "user", text: normalized };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setBusy(true);
    trackProductEvent("sarthi_question_submitted", "standalone");
    try {
      const response = await fetch("/api/sarthi", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: normalized,
          context: {
            ...(atlasNodeSlug ? { atlasNodeSlug } : {}),
            ...(conversationId ? { conversationId } : {}),
          },
        }),
      });
      const reply = await response.json() as ApiReply;
      const text = reply.ok ? reply.answer : reply.message;
      trackProductEvent("sarthi_answer_rendered", reply.ok ? (reply.followUpQuestion ? "clarification" : "answer") : "unavailable");
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text, reply }]);
      if (reply.conversation?.status === "saved" && reply.conversation.conversationId) {
        setConversationId(reply.conversation.conversationId);
      }
      if (response.ok && !account.signedIn) {
        const next = guestExchangeCount + 1;
        setGuestExchangeCount(next);
        try { window.localStorage.setItem("devam-guest-sarthi-exchanges", String(next)); } catch { /* Session state still gates this view. */ }
      }
    } catch {
      trackProductEvent("sarthi_answer_rendered", "unavailable");
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I could not reach Devam's evidence service. Your question was not answered; please try again.",
      }]);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  return (
    <main className={styles.shell}>
      <div className={styles.cosmos} aria-hidden="true"><span /><span /><span /></div>
      <header className={styles.header}>
        <Link className={styles.brand} href="/"><Image src="/brand/devam-mark.png" alt="" width={42} height={42} priority /><span>Devam</span></Link>
        <nav aria-label="Sarthi navigation"><Link href="/">Atlas</Link><Link href="/today">Today</Link><Link href="/search">Library</Link><Link href="/account">{account.label}</Link></nav>
      </header>

      <section className={styles.stage}>
        <aside className={styles.intro}>
          <p>Sārthi · सारथी</p>
          <h1>Talk to someone who can <em>follow the thread.</em></h1>
          <span>Ask about a source, a festival, what to do today, or something happening in your life. Sarthi asks when context can change the answer.</span>
          <div className={styles.prompts}>
            {["What should I do for the next festival where I live?", "Help me think through a difficult decision.", "Show me how a Ramayana story connects to this place."].map((prompt) => (
              <button type="button" key={prompt} onClick={() => setInput(prompt)}>{prompt}</button>
            ))}
          </div>
          <small>Source-grounded companion · not a guru, priest, doctor, or emergency service</small>
        </aside>

        <section className={styles.chat} aria-label="Conversation with Sarthi">
          <div className={styles.chatHeader}>
            <span className={styles.orb}>✦</span>
            <div><strong>Sarthi</strong><small>{conversationId ? "Private conversation saved with your consent" : account.signedIn ? "Your account context is available when consented" : "One guest exchange before sign-in"}</small></div>
          </div>
          <div className={styles.transcript} aria-live="polite">
            <div className={styles.assistantMessage}>
              <p>Namaste. Tell me what is on your mind—or ask me to help you explore Devam.</p>
            </div>
            {messages.map((message) => (
              <div className={message.role === "user" ? styles.userMessage : styles.assistantMessage} key={message.id}>
                <p>{message.text}</p>
                {message.role === "assistant" && message.reply?.ok ? <Evidence reply={message.reply} /> : null}
              </div>
            ))}
            {busy ? <div className={styles.assistantMessage}><p>Looking through the available evidence…</p></div> : null}
            <div ref={endRef} />
          </div>
          {accountPrompt ? (
            <div className={styles.accountPrompt}>
              <strong>Continue your conversation</strong>
              <p>You have seen the guest Sarthi exchange. Create or open your account to keep going and control what Sarthi remembers.</p>
              <Link href="/account">Continue with an account</Link>
            </div>
          ) : null}
          <form className={styles.composer} onSubmit={submit}>
            <label className="srOnly" htmlFor="sarthi-message">Message Sarthi</label>
            <textarea id="sarthi-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Sarthi…" rows={2} maxLength={8000} />
            <button type="submit" disabled={busy || input.trim().length < 2}>Send</button>
          </form>
        </section>
      </section>
    </main>
  );
}
