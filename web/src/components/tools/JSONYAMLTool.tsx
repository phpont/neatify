"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createWorkerPool } from "@/lib/workerPool";
import { motion } from "framer-motion";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false }) as any;

export default function JSONYAMLTool() {
  const poolRef = useRef(createWorkerPool(2));
  const [input, setInput] = useState<string>(`{\n  "name": "neatify",  "extra": [1,2,3]\n}`);
  const [output, setOutput] = useState<string>("");
  const [parser, setParser] = useState<"json" | "yaml">("json");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    poolRef.current.warmUp();
    return () => poolRef.current.dispose();
  }, []);

  const format = async () => {
    setError(null);
    try {
      const res = await poolRef.current.run("format", input, { parser });
      setOutput(res);
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  };

  const isJson = parser === "json";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <select
            className="rounded-xl border bg-background px-3 py-2 text-sm"
            value={parser}
            onChange={(e) => setParser(e.target.value as any)}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
          </select>
          <button
            className="rounded-xl border px-3 py-2 text-sm hover:bg-accent"
            onClick={format}
          >
            Format & Validate
          </button>
        </div>

        <div className="relative h-[58vh] rounded-2xl overflow-hidden">
          <div className="gradient-border p-[1.5px] rounded-2xl">
            <div className="rounded-2xl border bg-card glass">
              <Editor
                height="58vh"
                defaultLanguage={isJson ? "json" : "yaml"}
                theme="vs-dark"
                value={input}
                onChange={(v: string) => setInput(v || "")}
                options={{ minimap: { enabled: false }, wordWrap: "on", fontSize: 14 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {error && (
          <motion.div className="rounded-xl border bg-background px-3 py-2 text-sm text-red-400">
            {error}
          </motion.div>
        )}
        <div className="relative h-[58vh] rounded-2xl overflow-hidden">
          <div className="gradient-border p-[1.5px] rounded-2xl">
            <div className="rounded-2xl border bg-card glass">
              <Editor
                height="58vh"
                defaultLanguage={isJson ? "json" : "yaml"}
                theme="vs-dark"
                value={output}
                onChange={() => {}}
                options={{ readOnly: true, minimap: { enabled: false }, wordWrap: "on", fontSize: 14 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

