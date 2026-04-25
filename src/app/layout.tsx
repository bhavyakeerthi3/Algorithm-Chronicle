import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A2Z DSA Journey — Your Coding Mastery Path",
  description:
    "A beautiful, persistent tracker for your A2Z DSA journey — 400+ topics across 17 chapters from basics to advanced. One topic at a time.",
  keywords: ["A2Z DSA", "DSA tracker", "data structures", "algorithms", "coding interview prep"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
