// Deterministic, build-time question classification.
// signals in the stem/options plus the blueprint's Bloom profile per topic.
import { BLOOM_WEIGHT, type Difficulty, type QuestionType } from "./constants";
import { clamp, slugify } from "./utils";

export interface RawQuestion {
  courseNo: number;
  qnum: number;
  stem: string;
  options: Record<string, string>;
  answer: string;
}

export interface TopicLite {
  name: string;
  slug: string;
  items: number;
  bloom: Record<string, number>;
}

const COMPUTE_RE =
  /\b(output|complexity|big-?o|o\(|worst[- ]case|time complexity|running time|trace|value of|result of|evaluate the|compute|calculate|how many|what does .* return|big o)\b/i;
const NEGATION_RE = /\b(NOT|EXCEPT|LEAST|incorrect|false|never|cannot)\b/;
const SUPERLATIVE_RE = /\b(best|most|primary|main advantage|chiefly)\b/i;
const SCENARIO_RE =
  /\b(suppose|imagine|consider|a developer|a programmer|a team|you are|your application|in a project|a user|when designing|scenario)\b/i;
const CASE_RE =
  /\b(case study|an organization|enterprise|a company|a startup|a bank|a hospital|a university|the following situation|a system that)\b/i;

// Domain keyword lexicon → used both for concept counting and topic matching.
const DOMAIN_KEYWORDS = [
  "array", "loop", "recursion", "pointer", "function", "variable", "compiler", "stack",
  "queue", "tree", "graph", "hash", "sort", "search", "complexity", "algorithm", "linked list",
  "class", "object", "inheritance", "polymorphism", "encapsulation", "exception", "interface",
  "html", "css", "javascript", "http", "ajax", "rest", "api", "session", "cookie", "dom",
  "android", "activity", "intent", "mobile", "sql", "join", "normalization", "transaction",
  "index", "key", "schema", "deadlock", "thread", "process", "scheduling", "memory", "paging",
  "semaphore", "mutex", "kernel", "requirement", "uml", "agile", "scrum", "waterfall", "testing",
  "risk", "wbs", "gantt", "tcp", "ip", "osi", "router", "subnet", "firewall", "encryption",
  "cipher", "hash", "authentication", "malware", "vulnerability", "cryptography", "heuristic",
  "search", "bfs", "dfs", "bayes", "probability", "neural", "regression", "classification",
  "training", "overfitting", "gradient", "cluster", "feature",
];

export function countConcepts(text: string): number {
  const lower = text.toLowerCase();
  const hits = new Set<string>();
  for (const k of DOMAIN_KEYWORDS) if (lower.includes(k)) hits.add(k);
  return Math.max(1, hits.size);
}

export function classifyType(stem: string): QuestionType {
  if (CASE_RE.test(stem)) return "Case Study";
  if (SCENARIO_RE.test(stem) && stem.length > 90) return "Scenario";
  if (COMPUTE_RE.test(stem)) return "Problem Solving";
  return "MCQ";
}

// Weighted average Bloom position for a topic, 0..1.
export function topicBloomScore(bloom: Record<string, number>): number {
  let total = 0;
  let weighted = 0;
  for (const [level, count] of Object.entries(bloom)) {
    total += count;
    weighted += (BLOOM_WEIGHT[level] ?? 0.5) * count;
  }
  return total ? weighted / total : 0.5;
}

export function computeDifficulty(
  stem: string,
  options: Record<string, string>,
  bloomScore: number,
): { difficulty: Difficulty; base: number; concepts: number } {
  const full = stem + " " + Object.values(options).join(" ");
  const concepts = countConcepts(full);

  let signal = 0.32;
  if (COMPUTE_RE.test(stem)) signal += 0.18;
  if (NEGATION_RE.test(stem)) signal += 0.1;
  if (SUPERLATIVE_RE.test(stem)) signal += 0.05;
  if (stem.length > 110) signal += 0.08;
  if (stem.length > 180) signal += 0.06;
  signal += Math.min(0.15, (concepts - 1) * 0.04);
  signal = clamp(signal);

  // Blend structural signal with the blueprint Bloom expectation for the topic.
  const base = clamp(0.6 * signal + 0.4 * bloomScore);

  let difficulty: Difficulty;
  if (base < 0.36) difficulty = "Easy";
  else if (base < 0.49) difficulty = "Medium";
  else if (base < 0.62) difficulty = "Hard";
  else difficulty = "Very Hard";

  return { difficulty, base, concepts };
}

// Assign each question to the best-matching learning-outcome topic.
// Keyword overlap first; balancing fallback keeps every topic populated
// proportionally to its blueprint item target.
export function buildTopicAssigner(topics: TopicLite[]) {
  const tokenSets = topics.map((t) => {
    const toks = new Set<string>();
    for (const w of t.name.toLowerCase().split(/[^a-z0-9]+/)) {
      if (w.length > 3 && !STOP.has(w)) toks.add(w);
    }
    for (const k of DOMAIN_KEYWORDS) if (t.name.toLowerCase().includes(k)) toks.add(k);
    return toks;
  });
  const assignedCount = new Array(topics.length).fill(0);
  const totalItems = topics.reduce((s, t) => s + t.items, 0) || topics.length;

  return function assign(stem: string, options: Record<string, string>): number {
    const text = (stem + " " + Object.values(options).join(" ")).toLowerCase();
    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < topics.length; i++) {
      let score = 0;
      for (const tok of tokenSets[i]) if (text.includes(tok)) score++;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    if (bestIdx === -1 || bestScore === 0) {
      // Balancing fallback: pick the most under-filled topic vs. its target share.
      let pick = 0;
      let worstDeficit = -Infinity;
      const total = assignedCount.reduce((s, n) => s + n, 0) + 1;
      for (let i = 0; i < topics.length; i++) {
        const target = topics[i].items / totalItems;
        const actual = assignedCount[i] / total;
        const deficit = target - actual;
        if (deficit > worstDeficit) {
          worstDeficit = deficit;
          pick = i;
        }
      }
      bestIdx = pick;
    }
    assignedCount[bestIdx]++;
    return bestIdx;
  };
}

const STOP = new Set([
  "with", "the", "and", "for", "from", "using", "into", "their", "that", "this",
  "design", "basic", "various", "fundamentals", "concepts", "real", "life",
]);

export function makeExplanation(
  answerLetter: string,
  options: Record<string, string>,
  courseName: string,
  topicName: string,
): string {
  const correct = options[answerLetter] ?? "";
  return (
    `Correct answer: ${answerLetter}) ${correct}. ` +
    `This item assesses the learning outcome "${topicName}" within ${courseName}. ` +
    `Open the linked notes to review the underlying concept and why the other options do not apply.`
  );
}

export { slugify };
