export type RamayanaBeatMotif = "gather" | "rise" | "memory" | "waiting" | "abundance" | "message" | "reveal" | "procession" | "coronation";

export type RamayanaBeatStage = {
  focusX: number;
  focusY: number;
  zoom: number;
  motif: RamayanaBeatMotif;
  color: string;
};

const stages: Record<string, RamayanaBeatStage> = {
  "dasharatha-names-heir": { focusX: 43, focusY: 48, zoom: 1.14, motif: "reveal", color: "245,190,99" },
  "city-prepares-coronation": { focusX: 61, focusY: 42, zoom: 1.12, motif: "procession", color: "255,198,104" },
  "rama-sita-keep-vigil": { focusX: 67, focusY: 55, zoom: 1.2, motif: "waiting", color: "220,176,108" },
  "city-waits-for-dawn": { focusX: 51, focusY: 34, zoom: 1.1, motif: "waiting", color: "150,167,205" },
  "manthara-sees-rooftops": { focusX: 35, focusY: 45, zoom: 1.18, motif: "reveal", color: "248,178,88" },
  "news-reaches-manthara": { focusX: 35, focusY: 47, zoom: 1.22, motif: "message", color: "230,147,83" },
  "kaikeyi-first-rejoices": { focusX: 68, focusY: 52, zoom: 1.2, motif: "gather", color: "246,192,111" },
  "gift-is-thrown-aside": { focusX: 57, focusY: 61, zoom: 1.23, motif: "reveal", color: "187,129,106" },
  "manthara-reframes-future": { focusX: 67, focusY: 48, zoom: 1.22, motif: "memory", color: "193,123,105" },
  "kaikeyi-enters-anger-room": { focusX: 72, focusY: 57, zoom: 1.24, motif: "waiting", color: "162,104,116" },
  "dasharatha-renews-promise": { focusX: 54, focusY: 55, zoom: 1.21, motif: "gather", color: "216,151,100" },
  "first-demand-bharata": { focusX: 69, focusY: 48, zoom: 1.23, motif: "message", color: "226,154,89" },
  "second-demand-fourteen-years": { focusX: 38, focusY: 44, zoom: 1.16, motif: "reveal", color: "119,162,139" },
  "dasharatha-collapses": { focusX: 58, focusY: 60, zoom: 1.24, motif: "waiting", color: "171,112,100" },
  "king-pleads-through-night": { focusX: 62, focusY: 54, zoom: 1.22, motif: "waiting", color: "140,126,158" },
  "kaikeyi-invokes-truth": { focusX: 70, focusY: 48, zoom: 1.22, motif: "message", color: "209,142,92" },
  "morning-waits-outside": { focusX: 35, focusY: 37, zoom: 1.12, motif: "reveal", color: "248,195,110" },
  "vasishta-finds-delay": { focusX: 42, focusY: 51, zoom: 1.17, motif: "waiting", color: "222,175,95" },
  "sumantra-summons-rama": { focusX: 60, focusY: 43, zoom: 1.15, motif: "message", color: "240,175,86" },
  "rama-crosses-festival-city": { focusX: 57, focusY: 48, zoom: 1.18, motif: "procession", color: "252,183,82" },
  "kaikeyi-speaks-demand": { focusX: 66, focusY: 51, zoom: 1.23, motif: "message", color: "190,131,99" },
  "rama-says-he-will-go": { focusX: 56, focusY: 49, zoom: 1.22, motif: "reveal", color: "228,165,100" },
  "rama-goes-to-kausalya": { focusX: 61, focusY: 47, zoom: 1.2, motif: "message", color: "229,173,102" },
  "kausalya-grief-and-choice": { focusX: 65, focusY: 58, zoom: 1.24, motif: "waiting", color: "190,132,116" },
  "lakshmana-urges-resistance": { focusX: 40, focusY: 50, zoom: 1.23, motif: "rise", color: "225,143,79" },
  "rama-turns-anger-to-preparation": { focusX: 62, focusY: 55, zoom: 1.18, motif: "gather", color: "192,162,111" },
  "sita-sees-changed-face": { focusX: 45, focusY: 49, zoom: 1.2, motif: "reveal", color: "231,174,105" },
  "rama-asks-sita-stay": { focusX: 39, focusY: 51, zoom: 1.2, motif: "message", color: "219,160,102" },
  "sita-claims-shared-fortune": { focusX: 58, focusY: 51, zoom: 1.24, motif: "rise", color: "241,181,105" },
  "forest-fears-are-named": { focusX: 72, focusY: 41, zoom: 1.16, motif: "memory", color: "121,171,132" },
  "rama-accepts-sita-choice": { focusX: 55, focusY: 54, zoom: 1.21, motif: "gather", color: "235,181,111" },
  "lakshmana-asks-to-come": { focusX: 45, focusY: 50, zoom: 1.22, motif: "gather", color: "229,168,91" },
  "weapons-and-gifts-prepared": { focusX: 66, focusY: 56, zoom: 1.18, motif: "gather", color: "198,161,104" },
  "bark-garments-arrive": { focusX: 55, focusY: 58, zoom: 1.22, motif: "reveal", color: "177,139,101" },
  "farewell-to-mothers": { focusX: 58, focusY: 52, zoom: 1.2, motif: "gather", color: "222,160,107" },
  "three-turn-toward-gate": { focusX: 51, focusY: 38, zoom: 1.12, motif: "procession", color: "246,188,99" },
  "honour-the-allies": { focusX: 72, focusY: 55, zoom: 1.17, motif: "gather", color: "238,180,92" },
  "friends-ask-to-come": { focusX: 76, focusY: 58, zoom: 1.2, motif: "gather", color: "244,191,112" },
  "sita-and-lakshmana-board": { focusX: 70, focusY: 51, zoom: 1.23, motif: "gather", color: "245,205,137" },
  "pushpaka-rises": { focusX: 58, focusY: 35, zoom: 1.12, motif: "rise", color: "255,210,123" },
  "battlefield-and-bridge": { focusX: 41, focusY: 51, zoom: 1.18, motif: "memory", color: "222,137,91" },
  "kishkindha-companions": { focusX: 69, focusY: 56, zoom: 1.19, motif: "gather", color: "222,179,99" },
  "places-become-memories": { focusX: 47, focusY: 47, zoom: 1.14, motif: "memory", color: "133,184,182" },
  "ayodhya-in-sight": { focusX: 58, focusY: 31, zoom: 1.1, motif: "reveal", color: "255,216,139" },
  "fourteen-years-complete": { focusX: 72, focusY: 61, zoom: 1.19, motif: "waiting", color: "159,202,153" },
  "bharata-waits": { focusX: 78, focusY: 39, zoom: 1.23, motif: "memory", color: "233,181,102" },
  "the-journey-is-known": { focusX: 58, focusY: 48, zoom: 1.14, motif: "memory", color: "138,190,178" },
  "road-of-fruit": { focusX: 61, focusY: 56, zoom: 1.16, motif: "abundance", color: "183,216,111" },
  "read-bharatas-heart": { focusX: 67, focusY: 48, zoom: 1.2, motif: "message", color: "246,185,92" },
  "news-for-guha": { focusX: 43, focusY: 55, zoom: 1.16, motif: "message", color: "120,184,192" },
  "nandigrama-waiting": { focusX: 73, focusY: 54, zoom: 1.24, motif: "waiting", color: "226,165,88" },
  "the-message-lands": { focusX: 74, focusY: 51, zoom: 1.25, motif: "reveal", color: "255,205,116" },
  "tell-me-how": { focusX: 70, focusY: 54, zoom: 1.24, motif: "waiting", color: "214,159,92" },
  "forest-turns": { focusX: 47, focusY: 51, zoom: 1.17, motif: "memory", color: "132,159,143" },
  "alliance-and-search": { focusX: 58, focusY: 45, zoom: 1.15, motif: "memory", color: "121,179,188" },
  "bridge-battle-return": { focusX: 68, focusY: 39, zoom: 1.18, motif: "reveal", color: "246,183,96" },
  "city-awakens": { focusX: 67, focusY: 43, zoom: 1.15, motif: "procession", color: "250,192,92" },
  "prepare-the-road": { focusX: 51, focusY: 55, zoom: 1.17, motif: "procession", color: "233,174,85" },
  "sandals-lead-procession": { focusX: 60, focusY: 52, zoom: 1.2, motif: "procession", color: "255,207,113" },
  "brothers-meet": { focusX: 75, focusY: 52, zoom: 1.25, motif: "reveal", color: "255,214,139" },
  "bharata-returns-burden": { focusX: 71, focusY: 51, zoom: 1.24, motif: "waiting", color: "219,157,84" },
  "exile-clothes-fall-away": { focusX: 73, focusY: 51, zoom: 1.2, motif: "reveal", color: "238,183,102" },
  "city-entry": { focusX: 67, focusY: 44, zoom: 1.16, motif: "procession", color: "255,183,78" },
  "coronation-and-gifts": { focusX: 75, focusY: 49, zoom: 1.25, motif: "coronation", color: "255,213,123" },
  "rule-begins": { focusX: 57, focusY: 39, zoom: 1.11, motif: "rise", color: "234,183,104" },
};

export function getRamayanaBeatStage(beatId?: string) {
  return beatId ? stages[beatId] : undefined;
}

export const RAMAYANA_BEAT_STAGE_COUNT = Object.keys(stages).length;
