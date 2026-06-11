// Tiny cross-route handoff store. Used for "Convert action items → Planner"
// and "Share research → Email" buttons. SessionStorage so it survives the
// navigation but doesn't outlive the tab.

const KEY = "trinko-handoff";

type Handoff = {
  plannerSeed?: string;
  emailSeed?: { topic: string; recipient?: string };
};

function load(): Handoff {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function save(h: Handoff) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(h));
}

export function setPlannerSeed(text: string) {
  const h = load();
  h.plannerSeed = text;
  save(h);
}
export function takePlannerSeed(): string | undefined {
  const h = load();
  const v = h.plannerSeed;
  if (v) {
    delete h.plannerSeed;
    save(h);
  }
  return v;
}

export function setEmailSeed(topic: string, recipient?: string) {
  const h = load();
  h.emailSeed = { topic, recipient };
  save(h);
}
export function takeEmailSeed() {
  const h = load();
  const v = h.emailSeed;
  if (v) {
    delete h.emailSeed;
    save(h);
  }
  return v;
}

// ----------------------------------------------------------------------------
// Draft cache — keeps user inputs alive across tab switches within a session.
// Stored as plain JSON in sessionStorage under a separate key so it never
// interferes with the one-shot handoff seeds above.
// ----------------------------------------------------------------------------

const DRAFTS_KEY = "trinko-drafts";

type Drafts = Record<string, unknown>;

function loadDrafts(): Drafts {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(DRAFTS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveDrafts(d: Drafts) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DRAFTS_KEY, JSON.stringify(d));
}

export function getDraft<T>(key: string, fallback: T): T {
  const d = loadDrafts();
  return key in d ? (d[key] as T) : fallback;
}

export function setDraft<T>(key: string, value: T) {
  const d = loadDrafts();
  d[key] = value;
  saveDrafts(d);
}