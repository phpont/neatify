import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ui = Inter({ variable: "--font-ui", subsets: ["latin"] });
const code = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neatify — HTML Formatter & Minifier",
  description:
    "A slick, modern HTML formatter and minifier. Paste, Neatify, done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ui.variable} ${code.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
