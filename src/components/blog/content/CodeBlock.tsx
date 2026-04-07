import { codeToHtml } from "shiki";
import type { CodeBlock as CodeBlockType } from "@/lib/data/types";

/** Map Notion language names → Shiki-recognized aliases */
function normalizeLanguage(lang: string): string {
  const normalized = lang.toLowerCase().replace(/\s+/g, "");
  const aliases: Record<string, string> = {
    "plaintext": "text",
    "plain": "text",
    "txt": "text",
    "shell": "bash",
    "sh": "bash",
    "zsh": "bash",
  };
  return aliases[normalized] ?? normalized;
}

export async function CodeBlock({ block }: { block: CodeBlockType }) {
  let html: string;
  try {
    html = await codeToHtml(block.code, {
      lang: normalizeLanguage(block.language || "text"),
      theme: "github-dark",
    });
  } catch {
    // Unknown language — fall back to plain text
    html = await codeToHtml(block.code, { lang: "text", theme: "github-dark" });
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-[var(--border)]">
      {block.language && (
        <div className="px-4 py-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] border-b border-[var(--border)]">
          {block.language}
        </div>
      )}
      <div
        className="overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:m-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
