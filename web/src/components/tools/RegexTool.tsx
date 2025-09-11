"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false }) as any;

export default function RegexTool() {
  const [pattern, setPattern] = useState("\\b[a-z]+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Type some text here with words and more WORDS.");
  const [count, setCount] = useState(0);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const applyHighlights = () => {
    if (!editorRef.current) return;
    let regex: RegExp | null = null;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      setCount(0);
      editorRef.current.deltaDecorations(decorationsRef.current, []);
      return;
    }
    const model = editorRef.current.getModel();
    if (!model) return;
    const matches = model.findMatches(regex.source, true, true, regex, true, 10000);
    setCount(matches.length);
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      matches.map((m: any) => ({
        range: m.range,
        options: { inlineClassName: "regex-highlight" },
      }))
    );
  };

  useEffect(() => {
    applyHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags, text]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          className="ui-input rounded-lg px-3 py-2 text-sm w-60"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="RegExp"
        />
        <input
          className="ui-input rounded-lg px-3 py-2 text-sm w-24"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="flags"
        />
        <div className="text-xs text-muted-foreground">Matches: {count}</div>
      </div>

      <div className="relative h-[62vh] rounded-2xl overflow-hidden">
        <div className="gradient-border p-[1.5px] rounded-2xl">
          <div className="rounded-2xl border bg-card glass">
            <Editor
              height="62vh"
              defaultLanguage="plaintext"
              theme="vs-dark"
              value={text}
              onChange={(v: string) => setText(v || "")}
              onMount={(editor: any) => (editorRef.current = editor)}
              options={{ minimap: { enabled: false }, wordWrap: "on", fontSize: 14 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

