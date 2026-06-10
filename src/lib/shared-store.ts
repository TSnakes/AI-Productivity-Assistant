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