'use client';

export function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/RestaurantBanner.png"
          alt="Interior do Serra&amp;Grill"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#141210]/60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        <p className="text-[#B33A2F] uppercase tracking-[0.3em] text-sm font-semibold">
          Gastronomia de Excelência
        </p>

        <h1 className="text-5xl md:text-7xl font-serif text-[#F8F5F0] tracking-wide">
          Serra&amp;Grill
        </h1>

        <p className="text-xl text-[#EAE6DF] font-light font-serif italic max-w-2xl mx-auto">
          Sabores da serra, confecionados com tradição e os melhores ingredientes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10">
          <a
            href="#menu"
            className="bg-[#B33A2F] hover:bg-[#8F2E25] text-white px-8 py-3.5 text-sm uppercase tracking-widest transition-colors duration-300"
          >
            Ver a Carta
          </a>
          <a
            href="#reservas"
            className="border border-[#B33A2F] text-[#B33A2F] hover:bg-[#B33A2F] hover:text-white px-8 py-3.5 text-sm uppercase tracking-widest transition-colors duration-300"
          >
            Reservar Mesa
          </a>
        </div>
      </div>
    </section>
  );
}
