import { useEffect, useState } from "react";

export type Tier = "free" | "standard" | "pro";

export type User = {
  email: string | null;
  tier: Tier;
};

const KEY = "trinko-user";
const EVENT = "trinko-user-change";

const guest: User = { email: null, tier: "free" };

function read(): User {
  if (typeof window === "undefined") return guest;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return guest;
    const parsed = JSON.parse(raw) as User;
    if (!parsed || typeof parsed.email !== "string") return guest;
    return parsed;
  } catch {
    return guest;
  }
}

function write(u: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function signIn(email: string, tier: Exclude<Tier, "free">) {
  write({ email, tier });
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useUser(): User {
  const [user, setUser] = useState<User>(guest);
  useEffect(() => {
    setUser(read());
    const sync = () => setUser(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}