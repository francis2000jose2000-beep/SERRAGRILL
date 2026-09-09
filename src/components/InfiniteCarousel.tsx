'use client';

import Image from 'next/image';

const banners = [
  { title: 'Sugestão do Chef', src: '/galeria/foto1.jpg' },
  { title: 'Vinhos Selecionados', src: '/galeria/foto2.jpg' },
  { title: 'Sobremesas', src: '/galeria/foto3.jpg' },
  { title: 'Mariscada', src: '/galeria/foto4.jpg' },
  { title: 'Carnes Maturadas', src: '/galeria/foto5.jpg' },
  { title: 'Entradas Tradicionais', src: '/galeria/foto6.jpg' },
  { title: 'Cocktails', src: '/galeria/foto7.jpg' },
];

export function InfiniteCarousel() {
  return (
    <div className="w-full overflow-hidden bg-[#141210] py-10 relative">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...banners, ...banners].map((item, index) => (
          <div
            key={index}
            className="relative w-64 h-64 md:w-80 md:h-80 mx-4 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-900"
          >
            <Image
              alt={item.title}
              className="object-cover"
              fill
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              sizes="(max-width: 768px) 256px, 320px"
              src={item.src}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-serif font-bold text-xl md:text-2xl leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}