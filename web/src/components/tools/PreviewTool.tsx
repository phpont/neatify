"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false }) as any;

export default function PreviewTool() {
  const [code, setCode] = useState<string>(`<html>\n  <head><style>body{font-family:system-ui;margin:16px}</style></head>\n  <body>\n    <h1>Hello from Neatify</h1>\n    <p>This runs in a sandboxed iframe.</p>\n  </body>\n</html>`);
  const [allowScripts, setAllowScripts] = useState(false);

  const buildDoc = (raw: string) => {
    const hasHtml = /<\s*html[\s>]/i.test(raw);
    if (hasHtml) return raw;
    return `<!doctype html>\n<html>\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<meta name=\"color-scheme\" content=\"light dark\">\n<style>html,body{height:100%;margin:0}*{box-sizing:border-box}body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0b0b0b;color:#e5e7eb;padding:16px}a{color:#60a5fa}</style>\n</head>\n<body>\n${raw}\n</body>\n</html>`;
  };

  const doc = buildDoc(code);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="relative h-[62vh] rounded-2xl overflow-hidden">
        <div className="gradient-border p-[1.5px] rounded-2xl">
          <div className="rounded-2xl border bg-card glass">
            <Editor
              height="62vh"
              defaultLanguage="html"
              theme="vs-dark"
              value={code}
              onChange={(v: string) => setCode(v || "")}
              options={{ minimap: { enabled: false }, wordWrap: "on", fontSize: 14 }}
            />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border glass p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">Live Preview</div>
          <label className="text-xs flex items-center gap-2">
            <input type="checkbox" className="ui-checkbox" checked={allowScripts} onChange={(e) => setAllowScripts(e.target.checked)} />
            Allow scripts
          </label>
        </div>
        <iframe
          className="w-full h-[54vh] rounded-xl border"
          sandbox={allowScripts ? "allow-scripts" : ""}
          srcDoc={doc}
          title="HTML preview"
        />
      </div>
    </div>
  );
}
