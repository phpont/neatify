"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import dynamic from "next/dynamic";

const DiffEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.DiffEditor),
  { ssr: false }
) as any;

function sortTailwindClasses(html: string) {
  return html.replace(/\bclass(Name)?="([^"]*)"/g, (_m, _g1, classes: string) => {
    const sorted = classes
      .split(/\s+/)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join(" ");
    return `class="${sorted}"`;
  });
}

export default function TailwindSorterTool() {
  const [input, setInput] = useState<string>(
    '<div class="text-white p-2 bg-indigo-600 md:p-4 rounded-lg">Hello</div>'
  );
  const [output, setOutput] = useState<string>("");

  const run = () => setOutput(sortTailwindClasses(input));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button className="rounded-xl border px-3 py-2 text-sm hover:bg-accent" onClick={run}>
          Sort classes
        </button>
      </div>
      <div className="relative h-[62vh] rounded-2xl overflow-hidden">
        <div className="gradient-border p-[1.5px] rounded-2xl">
          <div className="rounded-2xl border bg-card glass">
            <DiffEditor
              height="62vh"
              original={input}
              modified={output || input}
              language="html"
              theme="vs-dark"
              options={{ renderSideBySide: true, readOnly: false, minimap: { enabled: false } }}
              onChange={(v: string) => setInput(v || "")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

