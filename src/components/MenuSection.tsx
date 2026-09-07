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

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const currentDay = new Date().getDay();

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.menu) {
          setMenuItems(data.menu);
        } else {
          setApiError(data.error || 'Erro ao carregar ementa.');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setApiError('Falha de ligação à API do servidor.');
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="ementa-semanal" className="py-24 px-6 bg-[#FAF8F5] text-[#141210]">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho exato recuperado do original */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#141210]">
            Ementa Semanal
          </h2>
          <p className="text-[#8F2E25] font-serif italic text-lg">
            As sugestões do nosso Chef para cada dia da semana.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-[#8F2E25] font-serif py-6 animate-pulse">
            A carregar ementa do Google Sheets...
          </div>
        ) : apiError ? (
          <div className="text-center text-red-600 py-6">
            ⚠️ {apiError}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center text-neutral-500 py-6">
            Ainda não existem pratos registados.
          </div>
        ) : (
          <div className="flex flex-col space-y-8">
            {menuItems.map((item, index) => {
              const dayNum = getDayNumber(item.dia);
              const isPastDay = currentDay !== 0 && currentDay > dayNum;
              const isToday = currentDay === dayNum;

              return (
                <div 
                  key={index} 
                  className={`group relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all pb-8 border-b border-[#E6E0D5] last:border-0 ${
                    isPastDay ? "opacity-50" : ""
                  } ${isToday ? "bg-white p-6 -mx-6 rounded-lg shadow-sm border-l-4 border-l-[#8F2E25]" : ""}`}
                >
                  <div className="space-y-2 flex-1">
                    <span className={`text-xs font-bold tracking-[0.2em] uppercase block ${
                      isToday ? "text-[#8F2E25]" : "text-neutral-500"
                    }`}>
                      {item.dia} {isToday && "— (Hoje)"}
                    </span>
                    
                    {/* O NOME DO PRATO FICA VERMELHO AO PASSAR O RATO */}
                    <h3 className={`text-2xl font-serif font-medium transition-colors duration-300 cursor-pointer ${
                      isPastDay 
                        ? "line-through text-neutral-400" 
                        : "text-[#141210] group-hover:text-[#8F2E25]"
                    }`}>
                      {item.prato}
                    </h3>

                    {item.comentario && (
                      <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                        {item.comentario}
                      </p>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className={`text-2xl font-serif font-bold ${isPastDay ? "text-neutral-400" : "text-[#141210]"}`}>
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
