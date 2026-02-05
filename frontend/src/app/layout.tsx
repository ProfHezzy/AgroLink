import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgroLink Market | Connecting Farms to the Future",
  description: "The enterprise-grade agricultural ecosystem for farmers, buyers, and researchers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}
