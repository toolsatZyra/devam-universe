import type { Metadata } from "next";
import { TodayExperience } from "@/components/today/today-experience";

export const metadata: Metadata = {
  title: "Today in Devam",
  description: "A location-aware, deterministic Panchang for your day.",
};

export default function TodayPage() {
  const initialDate = new Date().toISOString().slice(0, 10);
  return <TodayExperience initialDate={initialDate} />;
}
