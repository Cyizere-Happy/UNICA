import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unica House Hotel | Premium Stay & Apartments",
  description: "Experience luxury and comfort at Unica House Hotel. 11 premium bedrooms and 3 fully furnished apartments await you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jost.variable} font-jost antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
