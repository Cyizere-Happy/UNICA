import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unicavilla | Premium Stay & Apartments",
  description: "Experience luxury and comfort at Unicavilla. 11 premium bedrooms and 3 fully furnished apartments await you.",
};

import { CartProvider } from "@/context/CartContext";
import { GuestAuthProvider } from "@/context/GuestAuthContext";
import ModalRegistry from "@/components/ModalRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${jost.variable} font-jost antialiased bg-background text-foreground`}
      >
        <GuestAuthProvider>
          <CartProvider>
            <div className="relative min-h-screen flex flex-col">
              {children}
            </div>
            <ModalRegistry />
          </CartProvider>
        </GuestAuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
