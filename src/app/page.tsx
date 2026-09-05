export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { WeeklyMenuSection } from '@/components/WeeklyMenuSection';
import { BookingSection } from '@/components/BookingSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <HeroSection />
      <WeeklyMenuSection />
      <BookingSection />
      <Footer />
    </main>
  );
}
