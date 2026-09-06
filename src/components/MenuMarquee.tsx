'use client';

const menuCards = [
  { id: 1, title: 'Prato do Dia', image: '/Photos/cards/banners/banner1.jpg' },
  { id: 2, title: 'Especialidade da Casa', image: '/Photos/cards/banners/banner2.jpg' },
  { id: 3, title: 'Sugestão do Chef', image: '/Photos/cards/banners/banner3.jpg' },
  { id: 4, title: 'Vinhos Selecionados', image: '/Photos/cards/banners/banner4.jpg' },
  { id: 5, title: 'Sobremesas', image: '/Photos/cards/banners/banner5.jpg' },
  { id: 6, title: 'Mariscada', image: '/Photos/cards/banners/banner6.jpg' },
  { id: 7, title: 'Experiência Serra', image: '/Photos/cards/banners/banner7.jpg' },
];

export const MenuMarquee: React.FC = () => {
  return (
    <section className="relative py-6 bg-[#141210] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#141210] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#141210] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap gap-6 py-4">
        {[...menuCards, ...menuCards].map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="relative w-72 h-44 rounded-xl overflow-hidden shadow-lg border border-[#2A2825]"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-4 text-white font-serif font-bold text-lg">
              {card.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
