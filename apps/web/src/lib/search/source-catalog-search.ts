import catalog from "../../data/generated/source-catalog-v1.json";

type CatalogRecord = (typeof catalog.records)[number];

export type PreservedSourceCatalogMatch = {
  sha256: string;
  title: string;
  bytes: number;
  suffixes: string[];
  roles: string[];
  provenanceCount: number;
};

export type PreservedSourceCatalogResponse = {
  matches: PreservedSourceCatalogMatch[];
  totalMatches: number;
  boundary: string;
};

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .toLocaleLowerCase("en")
    .trim()
    .replace(/\s+/g, " ");
}

function score(record: CatalogRecord, query: string, tokens: string[]): number {
  const title = normalize(record.title);
  const aliases = record.aliases.map(normalize);
  const haystack = normalize(record.searchText);
  if (!tokens.every((token) => haystack.includes(token))) return 0;
  let value = tokens.reduce((total, token) => total + (title.includes(token) ? 12 : 3), 0);
  if (title === query) value += 120;
  else if (title.startsWith(query)) value += 80;
  else if (title.includes(query)) value += 50;
  if (aliases.some((alias) => alias === query)) value += 90;
  else if (aliases.some((alias) => alias.includes(query))) value += 35;
  if (record.roles.includes("canonical_acquisition")) value += 8;
  return value;
}

export function searchPreservedSourceCatalog(query: string, limit = 12): PreservedSourceCatalogResponse {
  const normalized = normalize(query);
  const tokens = normalized.split(" ").filter((token) => token.length >= 2);
  if (!tokens.length) return { matches: [], totalMatches: 0, boundary: catalog.boundary };
  const scored = catalog.records
    .map((record) => ({ record, score: score(record, normalized, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.record.title.localeCompare(right.record.title) || left.record.sha256.localeCompare(right.record.sha256));
  return {
    totalMatches: scored.length,
    boundary: catalog.boundary,
    matches: scored.slice(0, Math.max(1, Math.min(24, Math.trunc(limit)))).map(({ record }) => ({
      sha256: record.sha256,
      title: record.title,
      bytes: record.bytes,
      suffixes: [...record.suffixes],
      roles: [...record.roles],
      provenanceCount: record.provenanceCount,
    })),
  };
}
