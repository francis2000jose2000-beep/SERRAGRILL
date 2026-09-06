import { getVendusMenu } from '@/lib/vendus';
import { MenuClient } from '@/components/MenuClient';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const revalidate = 300;

export default async function MenuPage() {
  const { categories, items } = await getVendusMenu();

  return (
    <main className="min-h-screen bg-[#070A0F] text-zinc-100 flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#f4f1ec] tracking-wide">
            A Nossa Carta
          </h1>
          <p className="text-[#8a8279] text-base font-['Playfair_Display'] italic">
            Pratos confecionados com tradição e os melhores ingredientes da serra.
          </p>
          <div className="mt-4 mx-auto w-24 h-px bg-[#B33A2F]" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden border border-[#8F2E25]/40 shadow-2xl bg-zinc-900/50">
          <img
            src="/RestaurantBanner.png"
            alt="Restaurante Serra&amp;Grill"
            className="w-full h-64 sm:h-80 md:h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/20 pointer-events-none" />
        </div>

        <MenuClient categories={categories} initialItems={items} />
      </div>

      <Footer />
    </main>
  );
}
