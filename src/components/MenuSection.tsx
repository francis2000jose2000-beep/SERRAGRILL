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
  return 7; // Domingo
};

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const currentDay = new Date().getDay();

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.menu) {
          setMenuItems(data.menu);
        } else {
          setErrorMessage(data.error || 'Erro ao carregar ementa');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Falha de rede ao ligar ao servidor');
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-6 bg-[#141210] text-[#F8F5F0]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-10 text-brand-500">
          Ementa da Semana
        </h2>

        {isLoading ? (
          <div className="text-center text-brand-400 animate-pulse font-serif py-8">A consultar a ementa no Google Sheets...</div>
        ) : errorMessage ? (
          <div className="text-center text-red-400 py-6 border border-red-500/20 bg-red-500/10 rounded">
            ⚠️ Não foi possível carregar a ementa: {errorMessage}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center text-neutral-400 py-6">Ainda não existem pratos registados na folha "Ementa".</div>
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
                    isToday ? "border-brand-500 bg-[#1A1816] shadow-lg shadow-brand-500/10" : "border-[#2A2825] bg-[#141210]"
                  }`}
                >
                  <div>
                    <span className={`text-xs font-semibold tracking-widest uppercase block mb-1 ${
                      isToday ? "text-brand-500" : "text-neutral-500"
                    }`}>
                      {item.dia} {isToday && "— (Hoje)"}
                    </span>
                    <p className={`text-lg font-medium transition-all ${
                      isPastDay ? "line-through opacity-40 text-neutral-400" : "text-white"
                    }`}>
                      {item.prato} <span className="text-sm text-brand-400 ml-2">{item.preco}</span>
                    </p>
                  </div>
                  {isToday && (
                    <span className="bg-brand-500 text-white text-xs px-3 py-1 uppercase tracking-wider font-bold rounded">
                      Destaque de Hoje
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
