export const RESPONSES_URL = "https://api.openai.com/v1/responses";

export function parsePricing(environment) {
  const names = [
    "DEVAM_BASELINE_INPUT_USD_PER_MILLION",
    "DEVAM_BASELINE_CACHED_INPUT_USD_PER_MILLION",
    "DEVAM_BASELINE_OUTPUT_USD_PER_MILLION",
  ];
  const values = Object.fromEntries(names.map((name) => [name, Number(environment[name])]));
  for (const name of names) {
    if (environment[name] === undefined || environment[name] === "" || !Number.isFinite(values[name]) || values[name] < 0) {
      throw new Error(`${name} must be an explicit non-negative pricing snapshot.`);
    }
  }
  const sourceUrl = environment.DEVAM_BASELINE_PRICING_SOURCE_URL;
  const accessedAt = environment.DEVAM_BASELINE_PRICING_ACCESSED_AT;
  if (typeof sourceUrl !== "string" || !/^https:\/\/(?:platform\.)?openai\.com\//u.test(sourceUrl)) throw new Error("DEVAM_BASELINE_PRICING_SOURCE_URL must be an official OpenAI HTTPS URL.");
  if (typeof accessedAt !== "string" || Number.isNaN(Date.parse(accessedAt))) throw new Error("DEVAM_BASELINE_PRICING_ACCESSED_AT must be an ISO timestamp.");
  return {
    currency: "USD",
    source_url: sourceUrl,
    accessed_at: new Date(accessedAt).toISOString(),
    per_million_tokens: {
      input: values.DEVAM_BASELINE_INPUT_USD_PER_MILLION,
      cached_input: values.DEVAM_BASELINE_CACHED_INPUT_USD_PER_MILLION,
      output: values.DEVAM_BASELINE_OUTPUT_USD_PER_MILLION,
    },
  };
}

export function responseOutputText(payload) {
  for (const item of payload?.output ?? []) {
    for (const part of item?.content ?? []) {
      if (part?.type === "output_text" && typeof part.text === "string") return part.text;
    }
  }
  throw new Error("OpenAI Responses output contained no output_text.");
}

export function parseAnswer(payload) {
  const parsed = JSON.parse(responseOutputText(payload));
  if (typeof parsed.answer !== "string" || parsed.answer.trim().length === 0 || parsed.answer.length > 1200) throw new Error("Baseline answer failed its output boundary.");
  if (parsed.materialCaveat !== null && typeof parsed.materialCaveat !== "string") throw new Error("Baseline caveat failed its output boundary.");
  return { answer: parsed.answer.trim(), material_caveat: typeof parsed.materialCaveat === "string" ? parsed.materialCaveat.trim() : null };
}

export function usageAndCost(payload, pricing) {
  const inputTokens = Number(payload?.usage?.input_tokens ?? 0);
  const outputTokens = Number(payload?.usage?.output_tokens ?? 0);
  const cachedTokens = Number(payload?.usage?.input_tokens_details?.cached_tokens ?? 0);
  if (![inputTokens, outputTokens, cachedTokens].every((value) => Number.isInteger(value) && value >= 0) || cachedTokens > inputTokens) throw new Error("OpenAI usage payload is invalid.");
  const uncachedTokens = inputTokens - cachedTokens;
  const estimatedCost = (
    uncachedTokens * pricing.per_million_tokens.input
    + cachedTokens * pricing.per_million_tokens.cached_input
    + outputTokens * pricing.per_million_tokens.output
  ) / 1_000_000;
  return {
    input_tokens: inputTokens,
    cached_input_tokens: cachedTokens,
    uncached_input_tokens: uncachedTokens,
    output_tokens: outputTokens,
    total_tokens: inputTokens + outputTokens,
    estimated_cost_usd: Number(estimatedCost.toFixed(8)),
  };
}

export function requestBody(envelope, runtime) {
  return {
    model: runtime.model,
    store: false,
    reasoning: { effort: runtime.reasoning_effort },
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "sarthi_phase1_baseline_answer",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            answer: { type: "string", minLength: 1, maxLength: runtime.answer_length_max_chars },
            materialCaveat: { type: ["string", "null"], maxLength: 400 },
          },
          required: ["answer", "materialCaveat"],
        },
      },
    },
    max_output_tokens: runtime.max_output_tokens,
    instructions: [
      "You are Sarthi, Devam's concise culturally scoped companion, not a guru, divine authority, ritual authority, clinician, lawyer, or financial adviser.",
      "Answer only from the supplied reviewed evidence material. Do not invent a source, date, translation, ritual step, historical claim, consensus, promise, diagnosis, or certainty.",
      "Keep source fact, attributed interpretation, Devam synthesis, and contested reception distinct. Preserve materially different traditions and explicit scope limits.",
      "Use the requested language. Lead with the useful answer, identify the decisive distinction, and include only the evidence needed. Preserve user agency in practical reflection.",
      "Do not reveal hidden reasoning. Return only the required JSON object; verified citations and evidence disclosure are attached outside generation.",
    ].join("\n"),
    input: JSON.stringify({
      language: envelope.language,
      question: envelope.question,
      required_evidence_roles: envelope.required_roles,
      declared_scope: envelope.scope,
      reviewed_evidence_material: envelope.evidence_material,
    }),
  };
}
