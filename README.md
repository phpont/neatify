<div align="center">
  
  <h1>✨ Neatify — make your HTML shine</h1>
  
  <p>Paste messy HTML, click <b>Neatify</b>, see instant results. A slick, modern HTML formatter & minifier that runs fully client‑side.</p>

  <sub>
    Built with <a href="https://nextjs.org">Next.js</a>, <a href="https://tailwindcss.com">Tailwind</a>, <a href="https://www.framer.com/motion/">Framer Motion</a>, and <a href="https://microsoft.github.io/monaco-editor/">Monaco</a>.
  </sub>
  
  <br/>
  <br/>
</div>

---

**Highlights**

- Beautiful, responsive UI with subtle motion and glassy surfaces.
- Monaco editor for input and a read‑only result or side‑by‑side diff.
- Client‑only formatting in a Web Worker using Prettier standalone (HTML plugin).
- Fast, safe MVP minifier in the worker for quick size reduction.
- Presets stored in `localStorage`, with Save/Select/Delete.
- Lightweight tooltips and polished controls, including custom checkboxes and scrollbars.
- Vercel‑ready: no server code or Node APIs required.

---

## Quick Start

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

Deploy on Vercel:

- Project root: this `web/` folder
- Build command: `npm run build`
- Output: handled by Next.js (no special config)

---

## Product Tour

- Format: Prettier HTML with configurable options (print width, tabs, whitespace sensitivity…).
- Minify: whitespace/comment reductions for quick wins without breaking layouts.
- Diff: Monaco Diff editor shows before/after differences at a glance.
- Presets: name and save your favorite settings; switch instantly.
- Options Modal: clean, dark, distraction‑free surface that appears only when needed.

---

## Architecture

- `src/components/NeatifyApp.tsx` — main client component (layout, toolbar, editors, presets, modal).
- `src/workers/formatter.worker.ts` — Web Worker for formatting/minifying.
- `src/app/page.tsx` — page entry rendering `NeatifyApp`.
- `src/app/globals.css` — Tailwind v4 + design tokens (background, foreground, card, border…).

Design principles:
- Run everything in the browser (no server round‑trips).
- Keep UI delightful: focus, contrast, spacing, and purposeful animation.
- Ship minimal dependencies and avoid heavy server packages.

---

## Configuration

Formatting (Prettier):
- `printWidth`, `tabWidth`, `useTabs`, `singleAttributePerLine`, `htmlWhitespaceSensitivity`.

Minify (MVP):
- `removeComments`, `collapseWhitespace`.

Presets persist under:
- `localStorage` keys: `neatify.presets.v1` and `neatify.activePreset.v1`.

---

## Roadmap

- Resizable split between editors (drag handle).
- Full shadcn/ui integration (Button, Select, Tooltip, Dialog).
- Advanced minification (safe HTML/CSS/JS strategies without Node‑only deps).
- Theme toggle (Light/Dark/System) + refined token system.
- Keyboard shortcuts (F = Format, M = Minify, D = Diff, O = Options, ⌘/Ctrl+C = Copy).
- Import/Export presets (JSON file and URL share links).
- Persist last input/output; “Restore session” prompt.
- PWA (offline cache and installable app).
- A11y polish (focus rings, labels, ARIA for diff/editor controls).
- E2E smoke tests (Playwright) and basic unit tests.

If you have feature ideas, open an issue or PR!

---

## Contributing

1. Fork and branch from `main`.
2. `npm install && npm run dev`
3. Keep PRs focused and small; include before/after screenshots for UI changes.

Coding style:
- Minimal dependencies; prefer browser‑friendly libraries.
- Keep components small and cohesive.
- Avoid server runtimes or API routes for this MVP.

---

## Acknowledgements

- [Next.js](https://nextjs.org/) & [Vercel](https://vercel.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Prettier](https://prettier.io/)
- [Framer Motion](https://www.framer.com/motion/)

---

<sub>
Status: Active MVP. Breaking changes may occur while we iterate on the UX and architecture.
</sub>
