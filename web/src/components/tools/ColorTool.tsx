"use client";
import { useMemo, useState } from "react";

function parseColor(input: string) {
  const s = input.trim();
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  }
  const rgb = s.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i);
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] };
  const hsl = s.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/i);
  if (hsl) {
    const h = (+hsl[1]) / 360, s1 = (+hsl[2]) / 100, l = (+hsl[3]) / 100;
    const q = l < 0.5 ? l * (1 + s1) : l + s1 - l * s1;
    const p = 2 * l - q;
    const hk = (n: number) => (n + h + 1) % 1;
    const hue = (t: number) => {
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return { r: Math.round(hue(hk(1 / 3)) * 255), g: Math.round(hue(hk(0)) * 255), b: Math.round(hue(hk(-1 / 3)) * 255) };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60; if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function contrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }) {
  const lum = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const L1 = 0.2126 * lum(rgb1.r) + 0.7152 * lum(rgb1.g) + 0.0722 * lum(rgb1.b);
  const L2 = 0.2126 * lum(rgb2.r) + 0.7152 * lum(rgb2.g) + 0.0722 * lum(rgb2.b);
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

export default function ColorTool() {
  const [value, setValue] = useState("#7c3aed");
  const rgb = useMemo(() => parseColor(value) || { r: 124, g: 58, b: 237 }, [value]);
  const hex = useMemo(() => rgbToHex(rgb.r, rgb.g, rgb.b), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const black = { r: 0, g: 0, b: 0 }; const white = { r: 255, g: 255, b: 255 };
  const cBlack = contrastRatio(rgb, black); const cWhite = contrastRatio(rgb, white);

  const badgeClass = (ratio: number) => ratio >= 7 ? "text-emerald-400" : ratio >= 4.5 ? "text-amber-400" : "text-red-400";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl border p-4 glass">
        <div className="flex items-center gap-2 mb-3">
          <input value={value} onChange={(e) => setValue(e.target.value)} className="ui-input rounded-lg px-3 py-2 text-sm w-56" />
          <div className="size-8 rounded-md border" style={{ background: hex }} />
        </div>
        <div className="text-sm space-y-1">
          <div>HEX: <span className="font-mono">{hex}</span></div>
          <div>RGB: <span className="font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</span></div>
          <div>HSL: <span className="font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span></div>
        </div>
      </div>
      <div className="rounded-2xl border p-4 glass">
        <div className="text-sm mb-2">Contrast</div>
        <div className="flex items-center gap-3">
          <div className="rounded-md border p-4 w-40 text-center" style={{ background: hex, color: "#000" }}>Text</div>
          <div className={`rounded-full border px-2 py-0.5 text-xs ${badgeClass(cBlack)}`}>{cBlack}× {cBlack >= 7 ? "AAA" : cBlack >= 4.5 ? "AA" : "Fail"}</div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="rounded-md border p-4 w-40 text-center" style={{ background: hex, color: "#fff" }}>Text</div>
          <div className={`rounded-full border px-2 py-0.5 text-xs ${badgeClass(cWhite)}`}>{cWhite}× {cWhite >= 7 ? "AAA" : cWhite >= 4.5 ? "AA" : "Fail"}</div>
        </div>
      </div>
    </div>
  );
}

