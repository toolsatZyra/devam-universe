export type LaunchRegionalAcceptanceProfile = {
  id: string;
  hero: "ganesha" | "durga" | "ramayana" | "diwali";
  city: string;
  civilDate: string;
  latitude: number;
  longitude: number;
  timezone: "Asia/Kolkata";
  regionCode: string;
  traditionCode: string;
  practiceObservanceSlug: string;
  calendar:
    | { kind: "observance_rule"; observanceSlug: string }
    | { kind: "hero_campaign"; commonName: string };
};

// This is a bounded launch-acceptance matrix, not a claim of all-India or
// civilizational coverage. Each row is an exact context that the current
// deterministic calendar and ritual layers are expected to serve together.
export const LAUNCH_REGIONAL_ACCEPTANCE_PROFILES = [
  { id: "ganesha-mumbai", hero: "ganesha", city: "Mumbai", civilDate: "2026-09-14", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata", regionCode: "west-india", traditionCode: "smarta-west-india", practiceObservanceSlug: "ganesh-chaturthi", calendar: { kind: "observance_rule", observanceSlug: "ganesh-chaturthi" } },
  { id: "navaratri-delhi", hero: "durga", city: "Delhi", civilDate: "2026-10-11", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", regionCode: "north-india", traditionCode: "smarta-north-india", practiceObservanceSlug: "shardiya-navaratri-begins", calendar: { kind: "observance_rule", observanceSlug: "shardiya-navaratri-begins" } },
  { id: "navaratri-mumbai", hero: "durga", city: "Mumbai", civilDate: "2026-10-11", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata", regionCode: "west-india", traditionCode: "smarta-west-india", practiceObservanceSlug: "shardiya-navaratri-begins", calendar: { kind: "observance_rule", observanceSlug: "shardiya-navaratri-begins" } },
  { id: "mahashtami-kolkata", hero: "durga", city: "Kolkata", civilDate: "2026-10-19", latitude: 22.5726, longitude: 88.3639, timezone: "Asia/Kolkata", regionCode: "bengal", traditionCode: "shakta-bengal", practiceObservanceSlug: "bengal-mahashtami-community-participant-2026", calendar: { kind: "hero_campaign", commonName: "Maha Ashtami" } },
  { id: "ayudha-puja-bengaluru", hero: "durga", city: "Bengaluru", civilDate: "2026-10-20", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", regionCode: "south-india", traditionCode: "smarta-south-india", practiceObservanceSlug: "karnataka-saraswati-ayudha-puja", calendar: { kind: "observance_rule", observanceSlug: "karnataka-saraswati-ayudha-puja" } },
  { id: "dhantrayodashi-delhi", hero: "diwali", city: "Delhi", civilDate: "2026-11-06", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", regionCode: "north-india", traditionCode: "smarta-north-india", practiceObservanceSlug: "dhantrayodashi", calendar: { kind: "observance_rule", observanceSlug: "dhantrayodashi" } },
  { id: "dhantrayodashi-mumbai", hero: "diwali", city: "Mumbai", civilDate: "2026-11-06", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata", regionCode: "west-india", traditionCode: "smarta-west-india", practiceObservanceSlug: "dhantrayodashi", calendar: { kind: "observance_rule", observanceSlug: "dhantrayodashi" } },
  { id: "naraka-chaturdashi-mumbai", hero: "diwali", city: "Mumbai", civilDate: "2026-11-08", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata", regionCode: "west-india", traditionCode: "smarta-west-india", practiceObservanceSlug: "naraka-chaturdashi", calendar: { kind: "observance_rule", observanceSlug: "naraka-chaturdashi" } },
  { id: "deepavali-chennai", hero: "diwali", city: "Chennai", civilDate: "2026-11-08", latitude: 13.0827, longitude: 80.2707, timezone: "Asia/Kolkata", regionCode: "south-india", traditionCode: "smarta-south-india", practiceObservanceSlug: "tamil-deepavali-naraka-chaturdashi", calendar: { kind: "observance_rule", observanceSlug: "tamil-deepavali-naraka-chaturdashi" } },
  { id: "kali-puja-kolkata", hero: "diwali", city: "Kolkata", civilDate: "2026-11-08", latitude: 22.5726, longitude: 88.3639, timezone: "Asia/Kolkata", regionCode: "bengal", traditionCode: "shakta-bengal", practiceObservanceSlug: "bengal-kali-puja", calendar: { kind: "observance_rule", observanceSlug: "bengal-kali-puja" } },
  { id: "gujarati-new-year-ahmedabad", hero: "diwali", city: "Ahmedabad", civilDate: "2026-11-10", latitude: 23.0225, longitude: 72.5714, timezone: "Asia/Kolkata", regionCode: "baps-gujarat", traditionCode: "swaminarayan-baps", practiceObservanceSlug: "gujarati-new-year-baps", calendar: { kind: "observance_rule", observanceSlug: "gujarati-new-year-baps" } },
  { id: "balipadyami-bengaluru", hero: "diwali", city: "Bengaluru", civilDate: "2026-11-10", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", regionCode: "south-india", traditionCode: "smarta-south-india", practiceObservanceSlug: "karnataka-balipadyami", calendar: { kind: "observance_rule", observanceSlug: "karnataka-balipadyami" } },
  { id: "bandi-chhor-amritsar", hero: "diwali", city: "Amritsar", civilDate: "2026-11-08", latitude: 31.634, longitude: 74.8723, timezone: "Asia/Kolkata", regionCode: "sikh-punjab", traditionCode: "sikh-sgpc", practiceObservanceSlug: "bandi-chhor-divas-sgpc", calendar: { kind: "observance_rule", observanceSlug: "bandi-chhor-divas-sgpc" } },
  { id: "jain-diwali-delhi", hero: "diwali", city: "Delhi", civilDate: "2026-11-08", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", regionCode: "jain-india", traditionCode: "jain-umbrella", practiceObservanceSlug: "jain-diwali-umbrella", calendar: { kind: "observance_rule", observanceSlug: "jain-diwali-umbrella" } },
  { id: "govardhan-delhi-iskcon", hero: "diwali", city: "Delhi", civilDate: "2026-11-10", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", regionCode: "iskcon-india", traditionCode: "vaishnava-iskcon", practiceObservanceSlug: "govardhan-puja", calendar: { kind: "observance_rule", observanceSlug: "govardhan-puja" } },
  { id: "chhath-patna", hero: "diwali", city: "Patna", civilDate: "2026-11-15", latitude: 25.5941, longitude: 85.1376, timezone: "Asia/Kolkata", regionCode: "bihar-purvanchal", traditionCode: "surya-chhath-bihar-purvanchal", practiceObservanceSlug: "chhath-puja-sandhya-arghya", calendar: { kind: "observance_rule", observanceSlug: "chhath-puja-sandhya-arghya" } },
  { id: "chhath-delhi", hero: "diwali", city: "Delhi", civilDate: "2026-11-15", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", regionCode: "bihar-purvanchal", traditionCode: "surya-chhath-bihar-purvanchal", practiceObservanceSlug: "chhath-puja-sandhya-arghya", calendar: { kind: "observance_rule", observanceSlug: "chhath-puja-sandhya-arghya" } },
  { id: "vivaha-panchami-delhi", hero: "ramayana", city: "Delhi", civilDate: "2026-12-14", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", regionCode: "north-india", traditionCode: "smarta-north-india", practiceObservanceSlug: "vivaha-panchami", calendar: { kind: "observance_rule", observanceSlug: "vivaha-panchami" } },
] as const satisfies readonly LaunchRegionalAcceptanceProfile[];
