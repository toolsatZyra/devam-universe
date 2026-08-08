import type { Metadata } from "next";
import { SearchExperience } from "./search-experience";

export const metadata: Metadata = {
  title: "Search the library · Devam",
  description: "Exact source-grounded retrieval across the growing Devam library.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";
  return <SearchExperience initialQuery={initialQuery} />;
}
