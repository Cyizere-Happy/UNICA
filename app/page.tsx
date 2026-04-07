import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";

import { Testimonials } from "@/components/Testimonials";
import { RoomsGrid } from "@/components/RoomsGrid";
import { Facilities } from "@/components/Facilities";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />
      <Hero />
      <CategoryGrid />

      <Testimonials />
      <RoomsGrid />
      <Facilities />
      <Footer />
    </main>
  );
}
