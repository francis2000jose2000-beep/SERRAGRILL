'use client';

import { useState, useMemo } from 'react';
import { VendusProduct } from '@/lib/vendus';

const ITEMS_PER_PAGE = 20;

function getCategoryName(product: any): string {
  return (
    product.category_title ||
    product.category?.title ||
    product.family?.title ||
    product.category ||
    'Geral'
  );
}

function parsePrice(item: any): string {
  let rawPrice = 0;

  if (item.gross_price) {
    rawPrice = item.gross_price;
  } else if (item.price) {
    rawPrice = item.price;
  } else if (item.prices && Array.isArray(item.prices) && item.prices.length > 0) {
    rawPrice = item.prices[0].value || item.prices[0].gross_price || 0;
  }

  const num = parseFloat(String(rawPrice));
  return isNaN(num) || num === 0 ? '0.00 €' : `${num.toFixed(2)} €`;
}

export function MenuClient({
  initialItems
}: {
  categories?: string[];
  initialItems: VendusProduct[];
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(initialItems.map((item) => getCategoryName(item)));
    return ['Todas', ...Array.from(cats)];
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item: any) => {
      const categoryName = getCategoryName(item);
      const matchesCategory = selectedCategory === 'Todas' || categoryName === selectedCategory;
      const matchesSearch = (item.name || item.title || '').toLowerCase().includes(search.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [initialItems, search, selectedCategory]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleCategory = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Pesquisar no menu..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent border border-[#3a3530] text-[#f4f1ec] text-sm rounded-none px-4 py-3 pl-10 focus:border-[#8F2E25] outline-none transition placeholder:text-[#8a8279]"
          />
          <span className="absolute left-3.5 top-3.5 text-[#8a8279] text-sm">🔍</span>
        </div>

        <div className="w-full flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-5 py-2 rounded-none text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#8F2E25] text-white border-[#8F2E25]'
                  : 'bg-transparent border-[#3a3530] text-[#8a8279] hover:text-[#f4f1ec] hover:border-[#8F2E25]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {paginatedItems.length > 0 ? (
        <div className="mt-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {paginatedItems.map((item: any) => (
              <div key={item.id} className="flex justify-between items-end border-b border-[#2A2825] pb-3 group">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-serif font-medium text-[#EAE6DF] group-hover:text-[#8F2E25] transition-colors">
                    {item.title || item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-[#888] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-[#8F2E25] font-bold whitespace-nowrap">
                    {parsePrice(item)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-[#2A2825] pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                &larr; Anterior
              </button>

              <span className="text-neutral-500 font-serif text-sm">
                Página <span className="text-white">{currentPage}</span> de {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                Próxima &rarr;
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 border border-[#3a3530]/60">
          <p className="text-[#8a8279] text-sm font-['Playfair_Display'] italic">Nenhum prato encontrado com esses critérios.</p>
        </div>
      )}
    </div>
  );
}
