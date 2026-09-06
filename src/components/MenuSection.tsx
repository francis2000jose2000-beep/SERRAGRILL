'use client';
import { useEffect, useState } from 'react';

interface MenuItem {
  dia: string;
  prato: string;
  preco: string;
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

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDay = new Date().getDay();

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMenuItems(data.menu);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <section id="menu" className="py-24 px-6 bg-[#141210] text-[#F8F5F0]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Ementa</h2>
          <p className="text-[#B33A2F] font-serif italic text-lg">
            Descubra os nossos pratos, atualizados ao longo da semana.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-neutral-500 animate-pulse">A carregar ementa fresca...</div>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item, index) => {
              const dayNum = getDayNumber(item.dia);
              const isPastDay = currentDay !== 0 && currentDay > dayNum;
              const isToday = currentDay === dayNum;

              return (
                <div
                  key={index}
                  className={`p-5 border transition-all flex justify-between items-center ${
                    isToday ? "border-[#B33A2F] bg-[#1A1816] shadow-lg shadow-[#B33A2F]/10" : "border-[#2A2825] bg-[#141210]"
                  }`}
                >
                  <div>
                    <span className={`text-xs font-semibold tracking-widest uppercase block mb-1 ${
                      isToday ? "text-[#B33A2F]" : "text-neutral-500"
                    }`}>
                      {item.dia} {isToday && "— (Hoje)"}
                    </span>
                    <p className={`text-lg font-medium transition-all ${
                      isPastDay ? "line-through opacity-40 text-neutral-400" : "text-white"
                    }`}>
                      {item.prato} <span className="text-sm text-[#D14437] ml-2">{item.preco}</span>
                    </p>
                  </div>
                  {isToday && (
                    <span className="bg-[#B33A2F] text-white text-xs px-3 py-1 uppercase tracking-wider font-bold rounded">
                      Destaque do Dia
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
