export function journeyProgressKey(slug: string) {
  return `devam-journey-progress:${slug}`;
}

export function shouldApplyRestoredJourneyPosition(userHasNavigated: boolean, nextIndex: number) {
  return !userHasNavigated && nextIndex >= 0;
}
