'use client';
import { useEffect, useState } from 'react';

interface MenuItem {
  dia: string;
  prato: string;
  preco: string;
  comentario: string;
}

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 MenuSection montou! A disparar fetch para /api/menu...');
    fetch('/api/menu', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        console.log('📥 Resposta recebida da API /api/menu:', data);
        if (data.success && data.menu) {
          setMenuItems(data.menu);
        } else {
          setApiError(data.error || 'Erro desconhecido ao carregar ementa.');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('❌ Erro crítico no fetch do menu:', err);
        setApiError('Falha de ligação à API do servidor.');
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="py-20 px-6 bg-[#141210] text-[#F8F5F0]">
      <div className="max-w-3xl mx-auto">
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
            ⚡ A carregar ementa do Google Sheets...
          </div>
        ) : apiError ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded text-center text-sm">
            ⚠️ {apiError}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center text-neutral-400 py-12 font-serif italic">
            ⚠️ O componente carregou, mas a API devolveu 0 pratos. (Verifica a consola F12).
          </div>
        ) : (
          <div className="divide-y divide-[#2A2825]">
            {menuItems.map((item, index) => (
              <div key={index} className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-500 block">
                    {item.dia}
                  </span>
                  <h3 className="text-xl font-serif font-medium text-white">
                    {item.prato}
                  </h3>
                  {item.comentario && (
                    <p className="text-sm text-neutral-400">{item.comentario}</p>
                  )}
                </div>
                <div className="text-brand-400 font-serif text-xl font-bold">
                  {item.preco}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
