import Link from "next/link";
import {
  Sparkles,
  Code,
  Braces,
  Regex,
  Palette,
  SplitSquareHorizontal,
  Rocket,
  Wand2,
  ShieldCheck,
  Gauge,
  Cpu,
  Layers,
  Lock,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-radial" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.4] bg-grid" />

      {/* 1) Banner (Hero + Nav) */}
      <section className="relative z-10 min-h-[100svh] flex flex-col">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2" aria-label="Neatify home">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400" />
            <span className="text-sm font-semibold tracking-tight">Neatify</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/toolkit" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-accent">Open Toolkit</Link>
            <a href="https://github.com/phpont/neatify" target="_blank" rel="noreferrer" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-accent">GitHub</a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1200px] px-4 flex-1 flex items-center">
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/70 backdrop-blur">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
              Fast, client-side developer tools — no servers
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-amber-300">Neatify</span>
              <span className="text-foreground"> — make your code shine</span>
            </h1>

            <p className="max-w-[75ch] text-base text-muted-foreground leading-relaxed">
              A modern, lightweight toolkit for the everyday web developer. Beautiful formatting,
              clear diffs, handy playgrounds, and a polished UX — all local, private, and fast.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2"><Gauge className="size-4" /> Fast by default</li>
              <li className="inline-flex items-center gap-2"><ShieldCheck className="size-4" /> Private & local</li>
              <li className="inline-flex items-center gap-2"><Wand2 className="size-4" /> Polished UI</li>
            </ul>

            <div className="flex items-center gap-3">
              <Link
                href="/toolkit"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-amber-500 border-transparent btn-elevate"
              >
                <Sparkles className="size-4" /> Open Toolkit
              </Link>
              <a
                href="https://github.com/phpont/neatify"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-accent"
              >
                <Rocket className="size-4" /> Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Functionalities */}
      <section className="relative z-10 min-h-[100svh] flex items-center border-t">
        <div className="mx-auto w-full max-w-[1200px] px-4">
        <h2 className="text-lg font-semibold mb-2">Functionalities</h2>
        <p className="max-w-[75ch] text-sm text-muted-foreground mb-8 leading-relaxed">
          Everything you need for quick, everyday editing: format, diff, sort, test and preview.
          Designed for clarity and speed — no clutter, no logins, no data sent anywhere.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Code className="size-5 mt-0.5" />
            <div>
              <p className="font-medium">HTML Formatter & Diff</p>
              <p className="text-muted-foreground text-sm">Prettier-powered formatting with a crisp side-by-side diff.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Braces className="size-5 mt-0.5" />
            <div>
              <p className="font-medium">JSON/YAML Beautifier</p>
              <p className="text-muted-foreground text-sm">Validate and reformat configs with inline feedback.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Regex className="size-5 mt-0.5" />
            <div>
              <p className="font-medium">Regex Playground</p>
              <p className="text-muted-foreground text-sm">Live matches, counts, and helpful error messages.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <SplitSquareHorizontal className="size-5 mt-0.5" />
            <div>
              <p className="font-medium">Tailwind Sorter</p>
              <p className="text-muted-foreground text-sm">Reorder utility classes logically and preview diffs.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Palette className="size-5 mt-0.5" />
            <div>
              <p className="font-medium">Color Visualizer</p>
              <p className="text-muted-foreground text-sm">Convert HEX/RGB/HSL and check WCAG AA/AAA contrast.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="size-5 mt-0.5" />
            <div>
              <p className="font-medium">HTML Preview</p>
              <p className="text-muted-foreground text-sm">Safe sandbox with an optional scripts toggle.</p>
            </div>
          </div>
        </div>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-2"><Code className="size-4" /> Keyboard shortcuts for common actions</li>
          <li className="inline-flex items-center gap-2"><Palette className="size-4" /> Accessible color contrast checks</li>
          <li className="inline-flex items-center gap-2"><SplitSquareHorizontal className="size-4" /> Clean diffs optimized for reading</li>
        </ul>
        <div className="mt-6">
          <Link href="/toolkit" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-accent"><Sparkles className="size-4" /> Try the toolkit</Link>
        </div>
        </div>
      </section>

      {/* 3) Why Neatify */}
      <section className="relative z-10 min-h-[100svh] flex items-center border-t">
        <div className="mx-auto w-full max-w-[1200px] px-4">
        <h2 className="text-lg font-semibold mb-2">Why Neatify</h2>
        <p className="max-w-[75ch] text-sm text-muted-foreground leading-relaxed">
          Let’s be honest: many sites in this niche are cluttered, ugly, and weird — slow pages,
          heavy frameworks, and janky interfaces. Neatify takes the opposite path: clean, fast,
          and delightful to use.
        </p>
        <p className="max-w-[75ch] text-sm text-muted-foreground mt-4 leading-relaxed">
          Neatify started as a personal project to scratch an everyday developer itch. It grew into
          a focused toolkit that favors thoughtful defaults, instant feedback, and privacy by design.
          Everything runs locally in your browser.
        </p>
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <li className="flex items-start gap-3"><Wand2 className="size-5 mt-0.5" /><span>Polished UI with tasteful motion and readable layouts.</span></li>
          <li className="flex items-start gap-3"><Cpu className="size-5 mt-0.5" /><span>Snappy performance powered by Web Workers.</span></li>
          <li className="flex items-start gap-3"><ShieldCheck className="size-5 mt-0.5" /><span>Private & local — your data never leaves the browser.</span></li>
        </ul>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
          <li className="inline-flex items-center gap-2"><Lock className="size-4" /> No accounts, no tracking, no ads</li>
          <li className="inline-flex items-center gap-2"><Gauge className="size-4" /> Minimal bundle, instant responses</li>
          <li className="inline-flex items-center gap-2"><Rocket className="size-4" /> Open-source on GitHub</li>
        </ul>
        </div>
      </section>

      {/* 4) Use Cases */}
      <section className="relative z-10 min-h-[100svh] flex items-center border-t">
        <div className="mx-auto w-full max-w-[1200px] px-4">
        <h2 className="text-lg font-semibold mb-2">Use Cases</h2>
        <p className="max-w-[75ch] text-sm text-muted-foreground mb-6 leading-relaxed">
          Quick tasks you hit every week — without spinning up an IDE or sending code anywhere.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Clean pasted HTML and minify for CMS fields.</span></li>
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Validate JSON/YAML before committing changes.</span></li>
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Generate human-readable diffs for pull requests.</span></li>
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Quick HTML preview with optional scripts.</span></li>
          </ul>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Sort Tailwind classes for better readability.</span></li>
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Check color contrast to meet WCAG AA/AAA.</span></li>
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Test regex patterns live and count matches.</span></li>
            <li className="flex items-start gap-2"><Layers className="size-4 mt-0.5" /><span>Copy/paste-safe transforms for quick edits.</span></li>
          </ul>
        </div>
        </div>
      </section>

      {/* 5) Footer */}
      <footer className="relative z-10 min-h-[100svh] flex items-center border-t text-xs text-muted-foreground">
        <div className="mx-auto w-full max-w-[1200px] px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Layers className="size-4" /> Neatify — client-side developer toolkit</div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><Lock className="size-3.5" /> Privacy-friendly</span>
              <span className="inline-flex items-center gap-1"><Gauge className="size-3.5" /> Fast</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/toolkit" className="rounded-xl border px-3 py-1.5 hover:bg-accent">Open Toolkit</Link>
            <a href="https://github.com/phpont/neatify" target="_blank" rel="noreferrer" className="rounded-xl border px-3 py-1.5 hover:bg-accent">GitHub</a>
            <span className="text-[11px] text-muted-foreground/80">© {new Date().getFullYear()} Neatify. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
