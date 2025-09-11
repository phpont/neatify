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

      {/* Top Nav */}
      <nav className="relative z-10 mx-auto max-w-[1200px] px-4 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400" />
          <span className="text-sm font-semibold tracking-tight">Neatify</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/toolkit" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-accent">Open Toolkit</Link>
          <a href="https://github.com/phpont/neatify" target="_blank" rel="noreferrer" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-accent">GitHub</a>
        </div>
      </nav>

      <section className="relative mx-auto max-w-[1200px] px-4 pt-12 pb-12">
        <div className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/70 backdrop-blur">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
            Fast, client‑side developer tools — no servers
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-amber-300">Neatify</span>
            <span className="text-foreground"> — make your code shine</span>
          </h1>

          <p className="max-w-[70ch] text-base text-muted-foreground">
            A slick, modern toolkit for web developers: beautiful formatting, powerful diffing,
            handy playgrounds, and polished UX — all running entirely in your browser.
          </p>

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
      </section>

      {/* Value props */}
      <section className="relative mx-auto max-w-[1200px] px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ValueCard icon={<Wand2 className="size-5" />} title="Beautiful by default" desc="Tasteful defaults, glass surfaces, and smooth motion." />
          <ValueCard icon={<Cpu className="size-5" />} title="Instant results" desc="Pre‑warmed Web Workers keep interactions snappy." />
          <ValueCard icon={<ShieldCheck className="size-5" />} title="Private & local" desc="Everything runs in your browser. No servers." />
        </div>
      </section>

      <section className="relative mx-auto max-w-[1200px] px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard icon={<Code className="size-5" />} title="HTML Formatter & Diff" desc="Prettier‑powered formatting with a crisp side‑by‑side diff." />
          <FeatureCard icon={<Braces className="size-5" />} title="JSON/YAML Beautifier" desc="Format & validate configs with inline errors and quick fixes." />
          <FeatureCard icon={<Regex className="size-5" />} title="Regex Playground" desc="Real‑time matches, counters, and friendly error toasts." />
          <FeatureCard icon={<SplitSquareHorizontal className="size-5" />} title="Tailwind Sorter" desc="Reorganize utility classes logically and preview diffs." />
          <FeatureCard icon={<Palette className="size-5" />} title="Color Visualizer" desc="Convert HEX/RGB/HSL and check WCAG AA/AAA contrast." />
          <FeatureCard icon={<Sparkles className="size-5" />} title="HTML Preview" desc="Safe sandbox with an optional scripts toggle." />
        </div>

        <div className="mt-10 rounded-2xl border glass p-6 text-sm text-muted-foreground">
          Tip: Neatify uses <span className="font-mono">prettier/standalone</span> in a worker pool. No data leaves your device.
        </div>
      </section>

      {/* Use cases */}
      <section className="relative mx-auto max-w-[1200px] px-4 pb-16">
        <h2 className="text-lg font-semibold mb-3">Use cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UseCase title="Clean up snippets" points={["Beautify pasted HTML from StackOverflow", "Minify for copy‑paste into CMS fields", "Preview snippets safely in a sandbox"]} />
          <UseCase title="Tame configuration" points={["Validate JSON/YAML before committing", "Human‑readable diffs in PRs", "One‑click reformat with consistent style"]} />
          <UseCase title="Style with confidence" points={["Sort Tailwind classes for readability", "Check color contrast for accessibility", "Convert formats (HEX/RGB/HSL) instantly"]} />
          <UseCase title="Debug quicker" points={["Test regex patterns live", "Count matches across large samples", "See errors early with friendly toasts"]} />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto max-w-[1200px] px-4 pb-10 text-xs text-muted-foreground">
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2"><Layers className="size-4" /> Neatify — client‑side developer toolkit</div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Lock className="size-3.5" /> Privacy‑friendly</span>
            <span className="inline-flex items-center gap-1"><Gauge className="size-3.5" /> Fast</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border glass p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-8 rounded-lg border inline-grid place-items-center">{icon}</div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border glass p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="size-8 rounded-lg border inline-grid place-items-center">{icon}</div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function UseCase({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="rounded-2xl border glass p-4">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
