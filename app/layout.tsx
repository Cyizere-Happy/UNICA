import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unica House Hotel | Premium Stay & Apartments",
  description: "Experience luxury and comfort at Unica House Hotel. 11 premium bedrooms and 3 fully furnished apartments await you.",
};

import { CartProvider } from "@/context/CartContext";
import { GuestAuthProvider } from "@/context/GuestAuthContext";
import CartDrawer from "@/components/CartDrawer";
import GuestEntryModal from "@/components/GuestEntryModal";

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
            {children}
            <CartDrawer />
            <GuestEntryModal />
          </CartProvider>
        </GuestAuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
