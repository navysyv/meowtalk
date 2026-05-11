// Lightweight session-scoped state for the Full IELTS Mock flow.
// Stored in sessionStorage so refreshes don't lose progress, but it
// resets when the tab closes — exactly what we want for an exam.

export type MockSection = "listening" | "reading" | "writing" | "speaking";

export interface MockState {
  active: boolean;
  step: number; // 1=listening, 2=reading, 3=writing, 4=speaking, 5=summary
  bands: Partial<Record<MockSection, number>>;
  startedAt: string;
}

const KEY = "ielts_mock_state_v1";

export function getMockState(): MockState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockState;
  } catch {
    return null;
  }
}

export function setMockState(s: MockState) {
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function startMock(): MockState {
  const s: MockState = { active: true, step: 1, bands: {}, startedAt: new Date().toISOString() };
  setMockState(s);
  return s;
}

export function clearMock() {
  try { sessionStorage.removeItem(KEY); } catch {}
}

export function recordBand(section: MockSection, band: number, nextStep: number) {
  const s = getMockState();
  if (!s) return;
  s.bands[section] = band;
  s.step = nextStep;
  setMockState(s);
}

export function isMockActive(): boolean {
  const s = getMockState();
  return !!s?.active;
}

/** True when the page was opened as part of the auto mock flow. */
export function isMockUrl(search: string): boolean {
  try { return new URLSearchParams(search).get("mock") === "1"; } catch { return false; }
}
