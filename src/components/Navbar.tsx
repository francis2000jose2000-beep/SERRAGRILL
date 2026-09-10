'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#141210] relative border-b border-[#2A2825] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logótipo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif font-bold tracking-wide text-[#F8F5F0] hover:text-[#B33A2F] transition-colors">
              Serra&amp;Grill
            </Link>
          </div>

          {/* Links de Navegação (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/menu" className="text-sm font-medium tracking-widest uppercase text-[#EAE6DF] hover:text-[#B33A2F] transition-colors">
              Menu
            </Link>
            <Link href="/pedir" className="px-4 py-2 border border-[#8F2E25] text-[#8F2E25] text-sm font-semibold tracking-widest uppercase hover:bg-[#8F2E25] hover:text-white transition-colors duration-300">
              Pedir à Mesa
            </Link>
          </div>

          {/* Botão de Reserva (Desktop) */}
          <div className="hidden md:block">
            <Link href="#reservas" className="px-6 py-2 border border-[#B33A2F] text-[#B33A2F] text-sm font-semibold tracking-widest uppercase hover:bg-[#B33A2F] hover:text-[#141210] transition-colors duration-300">
              Reservar Mesa
            </Link>
          </div>

          {/* Botão Hamburger (Mobile) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-[#EAE6DF] hover:text-white hover:bg-[#2A2825] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Abrir menu</span>
            {isMobileMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`absolute top-full left-0 w-full bg-[#141210] shadow-xl z-50 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col p-4 space-y-4 border-t border-[#2A2825]">
          <Link
            href="/menu"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-md text-base font-medium text-[#EAE6DF] hover:bg-[#2A2825] hover:text-white transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/pedir"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-md text-base font-medium text-[#8F2E25] hover:bg-[#8F2E25] hover:text-white transition-colors"
          >
            Pedir à Mesa
          </Link>
          <Link
            href="#reservas"
            onClick={closeMobileMenu}
            className="block px-4 py-3 rounded-md text-base font-medium text-[#B33A2F] hover:bg-[#B33A2F] hover:text-[#141210] transition-colors"
          >
            Reservar Mesa
          </Link>
        </div>
      </div>
    </nav>
  );
}
