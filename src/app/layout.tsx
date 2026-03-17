import type { Metadata } from "next";
import "./globals.css";

// Use system monospace fonts instead of Google Fonts to avoid network dependency
const jetbrainsMono = {
  variable: "--font-mono",
  className: "font-mono",
};

export const metadata: Metadata = {
  title: "git_ref | Every command. One place.",
  description: "Developer command-reference website. All your tool commands in one minimal, fast place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${jetbrainsMono.className} antialiased bg-stone-950 text-stone-200 min-h-screen selection:bg-stone-800 selection:text-stone-100`}
      >
        {children}
      </body>
    </html>
  );
}
