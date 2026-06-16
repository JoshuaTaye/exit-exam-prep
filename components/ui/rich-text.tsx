import { cn } from "@/lib/utils";

/**
 * Lightweight, dependency-free renderer for question text.
 * Supports a small, safe subset of Markdown:
 *   - Fenced code blocks:  ```lang\n ... \n```  -> <pre><code> (mono, scrollable)
 *   - Inline code:         `code`               -> <code> (mono)
 *   - Line breaks:         \n                   -> preserved as <br/>
 * Everything else is rendered as plain text (no HTML is interpreted), so it is
 * safe to feed arbitrary question/option strings straight from the database.
 *
 * When the text contains a fenced code block the root is forced to a block
 * <div> (a <pre> is flow content and cannot live inside <h3>/<p>/<span>).
 * For inline-only text the `as` tag is respected.
 */

const FENCE = /```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/g;
const INLINE = /`([^`\n]+)`/g;

/**
 * Flatten rich markup to a single readable line. Use for truncated previews
 * (recent-mistake lists, etc.) where code blocks must not render as blocks.
 */
export function plainText(text: string): string {
  return (text ?? "")
    .replace(/```[a-zA-Z0-9+#-]*\n?/g, "")
    .replace(/```/g, "")
    .replace(/`/g, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

function withBreaks(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split("\n");
  const out: React.ReactNode[] = [];
  parts.forEach((p, idx) => {
    if (idx > 0) out.push(<br key={`${keyPrefix}-br${idx}`} />);
    if (p) out.push(p);
  });
  return out;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) nodes.push(...withBreaks(text.slice(last, m.index), `${keyPrefix}-t${i}`));
    nodes.push(
      <code
        key={`${keyPrefix}-c${i}`}
        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] [overflow-wrap:anywhere]"
      >
        {m[1]}
      </code>,
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(...withBreaks(text.slice(last), `${keyPrefix}-t${i}`));
  return nodes;
}

export function RichText({
  children,
  className,
  as: Tag = "span",
}: {
  children: string;
  className?: string;
  as?: React.ElementType;
}) {
  const text = children ?? "";

  // Fast path: no code markup at all — respect `as`, just preserve line breaks.
  if (!text.includes("`")) {
    return <Tag className={className}>{withBreaks(text, "p")}</Tag>;
  }

  // No fenced block — inline code only, still an inline-friendly tag.
  if (!text.includes("```")) {
    return <Tag className={className}>{renderInline(text, "seg")}</Tag>;
  }

  // Fenced block present: emit a flat list of inline <span> segments and block
  // code <div>s under a block <div> root (valid HTML nesting).
  const blocks: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  FENCE.lastIndex = 0;
  while ((m = FENCE.exec(text)) !== null) {
    if (m.index > last) {
      blocks.push(<span key={`b${i}`}>{renderInline(text.slice(last, m.index), `seg${i}`)}</span>);
    }
    const lang = m[1];
    const code = m[2].replace(/\n$/, "");
    blocks.push(
      <div key={`code${i}`} className="my-2">
        {lang && (
          <div className="rounded-t-md border border-b-0 bg-muted/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {lang}
          </div>
        )}
        <pre
          className={cn(
            "overflow-x-auto bg-muted p-3 text-[0.85em] leading-relaxed",
            lang ? "rounded-b-md" : "rounded-md",
          )}
        >
          <code className="font-mono whitespace-pre">{code}</code>
        </pre>
      </div>,
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) {
    blocks.push(<span key={`b${i}`}>{renderInline(text.slice(last), `seg${i}`)}</span>);
  }

  return <div className={className}>{blocks}</div>;
}
