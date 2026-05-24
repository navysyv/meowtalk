// Generic localStorage-backed "fresh pick" helper.
// Avoids re-serving items the user has recently seen so the IELTS content
// engine feels varied across sessions even with a finite pool.

const KEY_PREFIX = "talkie:pool:";

function loadHistory(key: string): string[] {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(key: string, history: string[]) {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(history));
  } catch {
    // ignore quota/privacy errors – fall back to plain randomness
  }
}

/**
 * Pick `count` items from `items`, preferring entries that are NOT in the
 * recent-history window for `key`. The chosen ids are appended to the
 * history (capped at `historySize`) so subsequent calls pick fresh items.
 */
export function pickFreshN<T extends { id: string }>(
  items: T[],
  count: number,
  key: string,
  historySize = 12,
): T[] {
  if (items.length === 0 || count <= 0) return [];
  const history = new Set(loadHistory(key));

  const fresh = items.filter((it) => !history.has(it.id));
  const stale = items.filter((it) => history.has(it.id));
  const pool = [...shuffle(fresh), ...shuffle(stale)];

  const picked = pool.slice(0, Math.min(count, items.length));
  const next = [...loadHistory(key), ...picked.map((p) => p.id)].slice(-historySize);
  saveHistory(key, next);
  return picked;
}

export function pickFreshOne<T extends { id: string }>(items: T[], key: string, historySize = 12): T | undefined {
  return pickFreshN(items, 1, key, historySize)[0];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}