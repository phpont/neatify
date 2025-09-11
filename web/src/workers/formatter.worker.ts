/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";

// We lazy-load html-minifier-terser only when needed via dynamic import

type MessageIn = {
  id: string;
  type: "format" | "minify" | "ping";
  code: string;
  options?: Record<string, any>;
};

type MessageOut = {
  id: string;
  ok: boolean;
  result?: string;
  error?: string;
};

self.addEventListener("message", async (evt: MessageEvent<MessageIn>) => {
  const { id, type, code, options } = evt.data;
  try {
    if (type === "ping") {
      postMessage({ id, ok: true, result: "pong" } as MessageOut);
      return;
    }
    if (type === "format") {
      const formatted = await prettier.format(code, {
        parser: "html",
        plugins: [parserHtml],
        ...(options || {}),
      });
      postMessage({ id, ok: true, result: formatted } as MessageOut);
      return;
    }

    if (type === "minify") {
      // Basic, safe-ish minifier for HTML as an MVP.
      // - Strip HTML comments (not conditional comments)
      // - Collapse consecutive whitespace to single space
      // - Trim spaces between tags
      let out = code;
      const opts = (options || {}) as { removeComments?: boolean; collapseWhitespace?: boolean };
      if (opts.removeComments !== false) {
        out = out.replace(/<!--(?!\s*\[if)([\s\S]*?)-->/g, "");
      }
      if (opts.collapseWhitespace !== false) {
        out = out
          .replace(/>\s+</g, "><")
          .replace(/\s{2,}/g, " ")
          .trim();
      }
      postMessage({ id, ok: true, result: out } as MessageOut);
      return;
    }

    postMessage({ id, ok: false, error: "Unknown operation" } as MessageOut);
  } catch (err: any) {
    postMessage({ id, ok: false, error: String(err?.message || err) } as MessageOut);
  }
});
