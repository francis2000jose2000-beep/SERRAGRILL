"use client";

import { useEffect, useState } from "react";
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { MenuMarquee } from '@/components/MenuMarquee';
import { MenuSection } from '@/components/MenuSection';
import { WeeklyMenuSection } from '@/components/WeeklyMenuSection';
import { BookingSection } from '@/components/BookingSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-[#D14437]">
        A carregar Serra & Grill...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <HeroSection />
      <MenuMarquee />
      <MenuSection />
      <WeeklyMenuSection />
      <BookingSection />
      <Footer />
    </main>
  );
}
