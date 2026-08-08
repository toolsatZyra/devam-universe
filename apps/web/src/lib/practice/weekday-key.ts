const WEEKDAY_PRACTICE_KEYS = [
  [1, "Ravivara", "weekday-ravivara"],
  [2, "Somavara", "weekday-somavara"],
  [3, "Mangalavara", "weekday-mangalavara"],
  [4, "Budhavara", "weekday-budhavara"],
  [5, "Guruvara", "weekday-guruvara"],
  [6, "Shukravara", "weekday-shukravara"],
  [7, "Shanivara", "weekday-shanivara"],
] as const;

export function weekdayPracticeSlug(vara: { index: number; name: string }): string | null {
  return WEEKDAY_PRACTICE_KEYS.find(([index, name]) => index === vara.index && name === vara.name)?.[2] ?? null;
}
