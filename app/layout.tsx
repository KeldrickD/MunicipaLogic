import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MunicipaLogic™ - AI-Powered Municipal Intelligence Platform",
  description:
    "MunicipaLogic is the AI intelligence platform for modern municipalities, helping cities analyze budgets, uncover insights, and make smarter decisions with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

