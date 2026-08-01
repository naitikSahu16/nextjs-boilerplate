import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokenTrim — Cut Your OpenAI Bills by 50%",
  description: "The Edge-Deployed Semantic Cache for AI Agents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#030712] font-sans text-white antialiased">{children}</body>
    </html>
  );
}
