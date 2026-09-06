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
    <section className="py-20 px-6 bg-[#141210] text-[#F8F5F0]">
      <div className="max-w-3xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F8F5F0] tracking-wide mb-3">
            Ementa Semanal
          </h2>
          <p className="text-sm font-serif italic text-brand-400">
            As sugestões do nosso Chef para cada dia da semana.
          </p>
          <div className="w-12 h-[2px] bg-brand-500 mx-auto mt-4" />
        </div>

        {isLoading ? (
          <div className="text-center text-brand-400 font-serif py-12 animate-pulse tracking-wider">
            A carregar ementa do Google Sheets...
          </div>
        ) : apiError ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded text-center text-sm">
            ⚠️ {apiError}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center text-neutral-400 py-12 font-serif italic">
            Ainda não existem pratos registados na folha do Google Sheets.
          </div>
        ) : (
          <div className="divide-y divide-[#2A2825]">
            {menuItems.map((item, index) => {
              const dayNum = getDayNumber(item.dia);
              const isPastDay = currentDay !== 0 && currentDay > dayNum;
              const isToday = currentDay === dayNum;

              return (
                <div 
                  key={index} 
                  className={`py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    isPastDay ? "opacity-40" : ""
                  } ${isToday ? "bg-[#1A1816] -mx-4 px-4 rounded border-l-2 border-brand-500" : ""}`}
                >
                  {/* Dia, Prato e Comentário */}
                  <div className="space-y-1.5 flex-1">
                    <span className={`text-[11px] font-bold tracking-[0.2em] uppercase block ${
                      isToday ? "text-brand-500" : "text-neutral-400"
                    }`}>
                      {item.dia} {isToday && "— (Hoje)"}
                    </span>
                    
                    <h3 className={`text-xl font-serif font-medium ${isPastDay ? "line-through text-neutral-500" : "text-white"}`}>
                      {item.prato}
                    </h3>

                    {item.comentario && (
                      <p className="text-sm text-neutral-400 font-sans leading-relaxed">
                        {item.comentario}
                      </p>
                    )}
                  </div>

                  {/* Preço */}
                  <div className="text-left sm:text-right shrink-0">
                    <span className={`text-xl font-serif font-bold ${isPastDay ? "opacity-50 text-neutral-400" : "text-brand-400"}`}>
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
