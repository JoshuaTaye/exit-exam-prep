// Client-side draft persistence for in-progress quiz sessions.
// Answers live in localStorage keyed by exam id so that leaving a session
// (Exit, browser back, refresh, tab close) never loses progress — returning
// to /session/<id> restores exactly where you left off.

export interface QuizDraft {
  examId: number;
  title: string;
  mode: string;
  total: number;
  answers: Record<number, string>;
  flags: Record<number, boolean>;
  times: Record<number, number>;
  idx: number;
  elapsedMs: number;
  remaining: number;
  timed: boolean;
  updatedAt: number;
}

const PREFIX = "quiz-draft-";
const keyFor = (examId: number) => `${PREFIX}${examId}`;

export function saveDraft(d: QuizDraft): void {
  try {
    localStorage.setItem(keyFor(d.examId), JSON.stringify(d));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function loadDraft(examId: number): QuizDraft | null {
  try {
    const s = localStorage.getItem(keyFor(examId));
    return s ? (JSON.parse(s) as QuizDraft) : null;
  } catch {
    return null;
  }
}

export function clearDraft(examId: number): void {
  try {
    localStorage.removeItem(keyFor(examId));
  } catch {
    /* ignore */
  }
}

export function draftAnswered(examId: number): number {
  const d = loadDraft(examId);
  return d ? Object.keys(d.answers).length : 0;
}

export function listDrafts(): QuizDraft[] {
  const out: QuizDraft[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const s = localStorage.getItem(k);
      if (!s) continue;
      try {
        const d = JSON.parse(s) as QuizDraft;
        if (d && d.examId && Object.keys(d.answers ?? {}).length > 0) out.push(d);
      } catch {
        /* skip malformed */
      }
    }
  } catch {
    /* ignore */
  }
  return out.sort((a, b) => b.updatedAt - a.updatedAt);
}
