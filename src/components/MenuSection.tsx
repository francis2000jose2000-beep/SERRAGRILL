'use client';

import { useMemo } from 'react';

const WEEKDAYS = [
  { id: 1, label: 'Segunda', jsDay: 1 },
  { id: 2, label: 'Terça', jsDay: 2 },
  { id: 3, label: 'Quarta', jsDay: 3 },
  { id: 4, label: 'Quinta', jsDay: 4 },
  { id: 5, label: 'Sexta', jsDay: 5 },
  { id: 6, label: 'Sábado', jsDay: 6 },
];

const menuByDay: Record<number, { categories: { name: string; items: string[] }[] }> = {
  1: {
    categories: [
      { name: 'Entradas', items: ['Caldo Verde', 'Pão Regional'] },
      { name: 'Pratos Principais', items: ['Arroz de Pato', 'Bacalhau com Natas'] },
      { name: 'Sobremesas', items: ['Arroz Doce', 'Leite Creme'] },
    ],
  },
  2: {
    categories: [
      { name: 'Entradas', items: ['Presunto Ibérico', 'Azeitonas Temperadas'] },
      { name: 'Pratos Principais', items: ['Posta Mirandesa', 'Feijoada de Bitoque'] },
      { name: 'Sobremesas', items: ['Pudim de Ovos', 'Toucinho do Céu'] },
    ],
  },
  3: {
    categories: [
      { name: 'Entradas', items: ['Sopa de Pedra', 'Queijo Curado'] },
      { name: 'Pratos Principais', items: ['Bacalhau à Brás', 'Linguado Grelhado'] },
      { name: 'Sobremesas', items: ['Mousse de Chocolate', 'Pastel de Nata'] },
    ],
  },
  4: {
    categories: [
      { name: 'Entradas', items: ['Salada de Polvo', 'Croquetes de Presunto'] },
      { name: 'Pratos Principais', items: ['Cozido à Portuguesa', 'Carne de Porco à Alentejana'] },
      { name: 'Sobremesas', items: ['Bolo de Bolacha', 'Folar'] },
    ],
  },
  5: {
    categories: [
      { name: 'Entradas', items: ['Tábuas Mistas', 'Chouriço Assado'] },
      { name: 'Pratos Principais', items: ['Salmão Grelhado', 'Picanha na Brasa'] },
      { name: 'Sobremesas', items: ['Cheesecake de Frutos Vermelhos', 'Petit Gâteau'] },
    ],
  },
  6: {
    categories: [
      { name: 'Entradas', items: ['Mariscada', 'Empadão de Bacalhau'] },
      { name: 'Pratos Principais', items: ['Lagosta Grelhada', 'Cabrito no Forno'] },
      { name: 'Sobremesas', items: ['Doce de Santa Teresa', 'Bolo de Amêndoa'] },
    ],
  },
};

export const MenuSection: React.FC = () => {
  const today = useMemo(() => new Date().getDay(), []);

  return (
    <section id="menu" className="py-24 px-6 bg-[#141210] text-[#F8F5F0]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Ementa</h2>
          <p className="text-[#C5A059] font-serif italic text-lg">
            Descubra os nossos pratos, atualizados ao longo da semana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEEKDAYS.map((day) => {
            const isToday = today === day.jsDay;
            const isPast = today > day.jsDay;

            return (
              <div
                key={day.id}
                className={[
                  'bg-[#1A1816] border rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group',
                  isToday
                    ? 'border-[#C5A059] shadow-[0_0_0_1px_rgba(197,160,89,0.25)]'
                    : 'border-[#2A2825] hover:border-[#C5A059]/40',
                  isPast ? 'opacity-40' : 'opacity-100',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={[
                      'font-bold text-base transition-colors',
                      isToday ? 'text-[#C5A059]' : 'text-[#F8F5F0] group-hover:text-amber-400',
                      isPast ? 'line-through text-neutral-400' : '',
                    ].join(' ')}
                  >
                    {day.label}
                  </h3>
                  {isToday && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/25 px-2 py-1 rounded-lg">
                      Destaque do Dia
                    </span>
                  )}
                </div>
                <ul className="space-y-2 flex-1">
                  {(menuByDay[day.jsDay]?.categories || []).map((cat) => (
                    <li key={cat.name} className="text-sm">
                      <span className="text-[#A88849] font-semibold">{cat.name}</span>
                      <ul className="mt-1 space-y-1">
                        {cat.items.map((item) => (
                          <li key={item} className="text-[#F8F5F0] text-sm flex items-center justify-between gap-3">
                            <span className={isPast ? 'line-through text-neutral-400' : ''}>{item}</span>
                            <span className="shrink-0">
                              <span className="bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-lg border border-amber-500/20 text-xs">
                                €8,00
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};