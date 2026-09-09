'use client';

import { useMemo } from 'react';

const IMAGES = [
  { src: '/galeria/foto1.jpg', alt: 'Foto 1' },
  { src: '/galeria/foto2.jpg', alt: 'Foto 2' },
  { src: '/galeria/foto3.jpg', alt: 'Foto 3' },
  { src: '/galeria/foto4.jpg', alt: 'Foto 4' },
  { src: '/galeria/foto5.jpg', alt: 'Foto 5' },
  { src: '/galeria/foto6.jpg', alt: 'Foto 6' },
  { src: '/galeria/foto7.jpg', alt: 'Foto 7' },
];

export function GalleryMarquee() {
  // Duplica as imagens para garantir loop contínuo sem saltos
  const slides = useMemo(() => [...IMAGES, ...IMAGES], []);

  return (
    <div className="w-full overflow-hidden bg-[#141210] py-10 border-y border-[#3a3530]">
      <div className="animate-marquee flex gap-6 w-max">
        {slides.map((img, idx) => (
          <div
            key={idx}
            className="relative w-72 h-48 md:w-96 md:h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border border-[#8F2E25]/30"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}