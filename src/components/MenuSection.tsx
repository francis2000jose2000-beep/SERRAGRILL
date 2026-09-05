'use client';

export const MenuSection: React.FC = () => {
  const categories = [
    { id: 1, name: 'Entradas', items: ['Prego à Mirandesa', 'Queijo da Serra'] },
    { id: 2, name: 'Pratos Principais', items: ['Bacalhau à Brás', 'Linguado Grelhado'] },
    { id: 3, name: 'Sobremesas', items: ['Pastel de Nata', 'Mousse de Chocolate'] },
  ];

  return (
    <section className="py-20 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Barra de categorias com scroll horizontal */}
        <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-2 px-4 py-2 rounded-full border border-zinc-800/50 hover:border-zinc-800/80 transition-all"
            >
              <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{cat.name}</span>
              <span className="text-amber-400 text-xs font-bold">{cat.items.length} itens</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 hover:border-amber-500/40 transition-all duration-200 group flex flex-col justify-between"
            >
<h3 className="text-zinc-100 font-bold text-base group-hover:text-amber-400 transition-colors mb-4">
                  {cat.name}
              </h3>
              <ul className="space-y-2 flex-1">
                {cat.items.map((item) => (
                  <li key={item} className="text-zinc-300 text-sm">
                    <span className="font-medium">{item}</span>
                    <span className="ml-auto">
                      <span className="bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-lg border border-amber-500/20 text-xs">
                        €8,00
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};