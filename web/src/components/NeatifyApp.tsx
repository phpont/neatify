"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Scissors,
  GitCompare,
  Copy as CopyIcon,
  Download as DownloadIcon,
  Settings2,
  FolderPlus,
  Trash2,
} from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false }) as any;
import { Tooltip } from "@/components/ui/Tooltip";

type Preset = {
  id: string;
  name: string;
  prettier: {
    printWidth: number;
    tabWidth: number;
    useTabs: boolean;
    singleAttributePerLine: boolean;
    htmlWhitespaceSensitivity: "css" | "strict" | "ignore";
  };
  minify: {
    removeComments: boolean;
    collapseWhitespace: boolean;
  };
};

const DEFAULT_PRESET: Preset = {
  id: "default",
  name: "Default",
  prettier: {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: "css",
  },
  minify: {
    removeComments: true,
    collapseWhitespace: true,
  },
};

type WorkerMessage = {
  id: string;
  ok: boolean;
  result?: string;
  error?: string;
};

function useFormatterWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const w = new Worker(
      new URL("../workers/formatter.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = w;
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  return useCallback(async function run(
    type: "format" | "minify",
    code: string,
    options: Record<string, any>
  ): Promise<string> {
    const worker = workerRef.current;
    if (!worker) throw new Error("Worker not ready");
    const id = Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
      const onMessage = (evt: MessageEvent<WorkerMessage>) => {
        if (evt.data.id !== id) return;
        worker.removeEventListener("message", onMessage);
        if (evt.data.ok) resolve(evt.data.result || "");
        else reject(new Error(evt.data.error || "Formatting failed"));
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage({ id, type, code, options });
    });
  }, []);
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

export function NeatifyApp() {
  const formatWorker = useFormatterWorker();

  const [input, setInput] = useState<string>("<!-- Paste messy HTML here -->\n<div><span> Hello <b>world</b>!</span></div>");
  const [output, setOutput] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [presets, setPresets] = useLocalStorage<Preset[]>(
    "neatify.presets.v1",
    [DEFAULT_PRESET]
  );
  const [activePresetId, setActivePresetId] = useLocalStorage<string>(
    "neatify.activePreset.v1",
    DEFAULT_PRESET.id
  );

  const activePreset = useMemo(() => {
    return presets.find((p) => p.id === activePresetId) || DEFAULT_PRESET;
  }, [presets, activePresetId]);

  const runFormat = useCallback(async () => {
    setBusy(true);
    try {
      const res = await formatWorker("format", input, activePreset.prettier);
      setOutput(res);
    } catch (e: any) {
      setOutput(`/* Error: ${e?.message || e} */\n` + input);
    } finally {
      setBusy(false);
    }
  }, [formatWorker, input, activePreset]);

  const runMinify = useCallback(async () => {
    setBusy(true);
    try {
      const res = await formatWorker("minify", input, activePreset.minify);
      setOutput(res);
    } catch (e: any) {
      setOutput(`/* Error: ${e?.message || e} */\n` + input);
    } finally {
      setBusy(false);
    }
  }, [formatWorker, input, activePreset]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neatify.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [output]);

  const savePreset = useCallback(() => {
    const name = prompt("Preset name");
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
    const preset: Preset = {
      id,
      name,
      prettier: { ...activePreset.prettier },
      minify: { ...activePreset.minify },
    };
    setPresets((prev) => [...prev, preset]);
    setActivePresetId(id);
  }, [activePreset, setPresets, setActivePresetId]);

  const deletePreset = useCallback(
    (id: string) => {
      if (!confirm("Delete this preset?")) return;
      setPresets((prev) => prev.filter((p) => p.id !== id));
      if (activePresetId === id) setActivePresetId(DEFAULT_PRESET.id);
    },
    [activePresetId, setPresets, setActivePresetId]
  );

  // Auto-format on first load to show output
  useEffect(() => {
    runFormat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 bg-radial" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.4] bg-grid" />

      <div className="relative mx-auto max-w-[1400px] px-4 pt-8 pb-10 sm:pt-10">
        {/* Hero */}
        <header className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-start justify-between gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground bg-background/70 backdrop-blur">
                <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
                Instant client-side formatting. No servers.
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-amber-300">Neatify</span>
                <span className="text-foreground"> — make your HTML shine</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-[65ch]">
                Paste messy HTML, click Neatify, see instant results. Beautiful formatting, quick minification, and a friendly diff — all in your browser.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <select
                  value={activePresetId}
                  onChange={(e) => setActivePresetId(e.target.value)}
                  className="rounded-xl border bg-background px-3 py-2 text-sm pr-8"
                  title="Select preset"
                >
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={savePreset}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-accent transition-colors"
                title="Save preset"
              >
                <FolderPlus className="size-4" /> Save
              </button>
              {activePresetId !== DEFAULT_PRESET.id && (
                <button
                  onClick={() => deletePreset(activePresetId)}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-red-500/10 hover:text-red-600 transition-colors"
                  title="Delete preset"
                >
                  <Trash2 className="size-4" /> Delete
                </button>
              )}
            </div>
          </motion.div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Toolbar spanning both columns for alignment */}
          <div className="lg:col-span-2">
            <Toolbar
              onFormat={runFormat}
              onMinify={runMinify}
              onDiff={() => setShowDiff((v) => !v)}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onOptions={() => setShowOptions(true)}
              diffActive={showDiff}
              busy={busy}
            />
          </div>
          {/* Left: input editor */}
          <div className="flex flex-col gap-3">

            <div className="relative h-[62vh] rounded-2xl overflow-hidden">
              <div className="gradient-border p-[1.5px] rounded-2xl">
                <div className="rounded-2xl border bg-card glass">
                  <Editor
                    height="62vh"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={input}
                    onChange={(v: string) => setInput(v || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      smoothScrolling: true,
                    }}
                  />
                </div>
              </div>
          </div>
          </div>

          {/* Right: output/diff only for perfect vertical alignment */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {showDiff ? (
                <motion.div
                  key="diff"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                className="relative h-[62vh] rounded-2xl overflow-hidden"
                >
                  <div className="gradient-border p-[1.5px] rounded-2xl">
                    <div className="rounded-2xl border bg-card glass">
                      <Editor.DiffEditor
                        original={input}
                        modified={output}
                        language="html"
                        theme="vs-dark"
                        options={{
                          renderSideBySide: true,
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                className="relative h-[62vh] rounded-2xl overflow-hidden"
                >
                  <div className="gradient-border p-[1.5px] rounded-2xl">
                    <div className="rounded-2xl border bg-card glass">
                      <Editor
                        height="62vh"
                        defaultLanguage="html"
                        theme="vs-dark"
                        value={output}
                        onChange={() => {}}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: "on",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        {/* mobile controls removed for now */}
      </div>

      {/* Options Modal */}
      <OptionsModal
        open={showOptions}
        onClose={() => setShowOptions(false)}
        preset={activePreset}
        onSave={(p) => {
          setPresets((prev) => prev.map((it) => (it.id === activePreset.id ? p : it)));
          setShowOptions(false);
        }}
      />

      {/* Copy toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 rounded-xl border bg-background px-3 py-2 text-sm shadow-md"
          >
            Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toolbar({
  onFormat,
  onMinify,
  onDiff,
  onCopy,
  onDownload,
  onOptions,
  diffActive,
  busy,
}: {
  onFormat: () => void;
  onMinify: () => void;
  onDiff: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onOptions: () => void;
  diffActive: boolean;
  busy: boolean;
}) {
  const Btn = ({
    onClick,
    children,
    title,
    variant = "default",
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    variant?: "default" | "ghost" | "outline" | "primary";
  }) => (
    <Tooltip content={title}>
      <button
        onClick={onClick}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all btn-elevate",
          variant === "primary"
            ? "text-white border-transparent bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-amber-500 hover:brightness-110"
            : variant === "outline"
            ? "bg-background border-foreground/15 hover:bg-accent"
            : variant === "ghost"
            ? "border-transparent hover:bg-accent"
            : "bg-background border-foreground/15 hover:bg-accent",
        ].join(" ")}
      >
        {children}
      </button>
    </Tooltip>
  );

  return (
    <div className="sticky top-0 z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      <Btn onClick={onFormat} title="Format (Prettier)" variant="primary">
        <Sparkles className="size-4" /> Format
      </Btn>
      <Btn onClick={onMinify} title="Minify (Terser)">
        <Scissors className="size-4" /> Minify
      </Btn>
      <Btn onClick={onDiff} title="Toggle Diff" variant={diffActive ? "outline" : "ghost"}>
        <GitCompare className="size-4" /> {diffActive ? "Hide Diff" : "Diff"}
      </Btn>
      <Btn onClick={onCopy} title="Copy Output" variant="ghost">
        <CopyIcon className="size-4" /> Copy
      </Btn>
      <Btn onClick={onDownload} title="Download Output" variant="ghost">
        <DownloadIcon className="size-4" /> Download
      </Btn>
      <Btn onClick={onOptions} title="Options" variant="outline">
        <Settings2 className="size-4" /> Options
      </Btn>

      {busy && (
        <div className="col-span-full text-xs text-muted-foreground mt-1">
          Working…
        </div>
      )}
    </div>
  );
}

function OptionsPanel({
  preset,
  onChange,
  bare = false,
}: {
  preset: Preset;
  onChange: (p: Preset) => void;
  bare?: boolean;
}) {
  const update = (path: string, value: any) => {
    const copy = structuredClone(preset);
    const [root, key] = path.split(".");
    // @ts-expect-error - dynamic path assign for options editing
    copy[root][key] = value;
    onChange(copy);
  };

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );

  const Fields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div>
          <div className="text-xs font-medium text-foreground/70 mb-1">Prettier</div>
          <Row label="Print width">
            <input
              type="number"
              className="ui-input w-24 rounded-lg px-2 py-1 text-sm"
              value={preset.prettier.printWidth}
              min={40}
              max={200}
              onChange={(e) => update("prettier.printWidth", Number(e.target.value))}
            />
          </Row>
          <Row label="Tab width">
            <input
              type="number"
              className="ui-input w-24 rounded-lg px-2 py-1 text-sm"
              value={preset.prettier.tabWidth}
              min={1}
              max={8}
              onChange={(e) => update("prettier.tabWidth", Number(e.target.value))}
            />
          </Row>
          <Row label="Use tabs">
            <input
              type="checkbox"
              className="size-4 ui-checkbox"
              checked={preset.prettier.useTabs}
              onChange={(e) => update("prettier.useTabs", e.target.checked)}
            />
          </Row>
          <Row label="One attr per line">
            <input
              type="checkbox"
              className="size-4 ui-checkbox"
              checked={preset.prettier.singleAttributePerLine}
              onChange={(e) => update("prettier.singleAttributePerLine", e.target.checked)}
            />
          </Row>
          <Row label="Whitespace sensitivity">
            <select
              className="ui-select rounded-lg px-2 py-1 text-sm"
              value={preset.prettier.htmlWhitespaceSensitivity}
              onChange={(e) =>
                update(
                  "prettier.htmlWhitespaceSensitivity",
                  e.target.value as Preset["prettier"]["htmlWhitespaceSensitivity"]
                )
              }
            >
              <option value="css">css</option>
              <option value="strict">strict</option>
              <option value="ignore">ignore</option>
            </select>
          </Row>
        </div>
        <div>
          <div className="text-xs font-medium text-foreground/70 mb-1">Minify</div>
          <Row label="Remove comments">
            <input
              type="checkbox"
              className="size-4 ui-checkbox"
              checked={preset.minify.removeComments}
              onChange={(e) => update("minify.removeComments", e.target.checked)}
            />
          </Row>
          <Row label="Collapse whitespace">
            <input
              type="checkbox"
              className="size-4 ui-checkbox"
              checked={preset.minify.collapseWhitespace}
              onChange={(e) => update("minify.collapseWhitespace", e.target.checked)}
            />
          </Row>
        </div>
    </div>
  );

  if (bare) return Fields;

  return (
    <div className="rounded-2xl border p-3 glass">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="size-4" />
        <h2 className="text-sm font-semibold">Options</h2>
      </div>
      {Fields}
    </div>
  );
}

function OptionsModal({
  open,
  onClose,
  preset,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  preset: Preset;
  onSave: (p: Preset) => void;
}) {
  const [temp, setTemp] = useState<Preset>(preset);

  useEffect(() => {
    if (open) setTemp(structuredClone(preset));
  }, [open, preset]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.98, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl"
          >
            <div className="rounded-2xl border modal-surface shadow-xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Settings2 className="size-4" />
                    <h3 className="text-sm font-semibold">Options</h3>
                  </div>
                  <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onClose}>Close</button>
                </div>
                <OptionsPanel bare preset={temp} onChange={setTemp} />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    className="rounded-xl border px-3 py-2 text-sm hover:bg-accent"
                    onClick={onClose}
                  >
                      Cancel
                    </button>
                    <button
                      className="rounded-xl px-3 py-2 text-sm text-white bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-amber-500"
                      onClick={() => onSave(temp)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
