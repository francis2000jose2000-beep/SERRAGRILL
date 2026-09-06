'use client';
import { useEffect, useState } from 'react';

interface MenuItem {
  dia: string;
  prato: string;
  preco: string;
  comentario: string;
}

const getDayNumber = (diaStr: string) => {
  const d = diaStr.toLowerCase();
  if (d.includes('segunda')) return 1;
  if (d.includes('terça') || d.includes('terca')) return 2;
  if (d.includes('quarta')) return 3;
  if (d.includes('quinta')) return 4;
  if (d.includes('sexta')) return 5;
  if (d.includes('sábado') || d.includes('sabado')) return 6;
  return 7;
};

export function WeeklyMenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDay = new Date().getDay();

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.menu) {
          setMenuItems(data.menu);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <section id="ementa-semanal" className="py-24 px-6 bg-[#FAF8F5] text-[#141210]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#141210]">
            Ementa Semanal
          </h2>
          <p className="text-[#8F2E25] font-serif italic text-lg">
            As sugestões do nosso Chef para cada dia da semana.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-[#8F2E25] animate-pulse font-serif py-8">A carregar ementa...</div>
        ) : menuItems.length === 0 ? (
          <div className="text-center text-neutral-500 py-6">Ainda não existem pratos registados.</div>
        ) : (
          <div className="space-y-8">
            {menuItems.map((item, idx) => {
              const dayNum = getDayNumber(item.dia);
              const isPastDay = currentDay !== 0 && currentDay > dayNum;
              const isToday = currentDay === dayNum;

              return (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAE6DF] pb-4 group">
                  <div className="flex-1">
                    <span className="text-sm uppercase tracking-widest text-[#8F2E25] font-bold block mb-1">
                      {item.dia} {isToday && "— (Hoje)"}
                    </span>
                    <h3 className={`text-xl font-serif font-bold transition-colors ${isPastDay ? 'line-through opacity-40 text-neutral-400' : 'group-hover:text-[#8F2E25]'}`}>
                      {item.prato}
                    </h3>
                    {item.comentario && (
                      <p className={`text-sm mt-1 ${isPastDay ? 'opacity-30 text-neutral-500' : 'text-[#5A554C]'}`}>
                        {item.comentario}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 md:mt-0 pl-0 md:pl-4">
                    <span className={`text-lg font-bold whitespace-nowrap ${isPastDay ? 'opacity-40 text-neutral-400' : 'text-[#141210]'}`}>
                      {item.preco}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
