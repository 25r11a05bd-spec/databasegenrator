import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "DB-Generator — AI-Powered PostgreSQL Schema Builder",
  description: "Design databases visually, deploy instantly. Generate production-ready PostgreSQL schemas with natural language.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
