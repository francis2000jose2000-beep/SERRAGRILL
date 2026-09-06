'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-[#141210] border-b border-[#2A2825] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logótipo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif font-bold tracking-wide text-[#F8F5F0] hover:text-[#B33A2F] transition-colors">
              Serra&amp;Grill
            </Link>
          </div>

          {/* Links de Navegação (Desktop) */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/menu" className="text-sm font-medium tracking-widest uppercase text-[#EAE6DF] hover:text-[#B33A2F] transition-colors">
              Menu
            </Link>
            <Link href="#reservas" className="text-sm font-medium tracking-widest uppercase text-[#EAE6DF] hover:text-[#B33A2F] transition-colors">
              Reservas
            </Link>
          </div>

          {/* Botão de Reserva */}
          <div className="hidden md:block">
            <Link href="#reservas" className="px-6 py-2 border border-[#B33A2F] text-[#B33A2F] text-sm font-semibold tracking-widest uppercase hover:bg-[#B33A2F] hover:text-[#141210] transition-colors duration-300">
              Reservar Mesa
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
