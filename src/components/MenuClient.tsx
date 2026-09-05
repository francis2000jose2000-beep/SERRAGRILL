'use client';

import { useState } from 'react';
import { VendusProduct } from '@/lib/vendus';

function getCategoryName(product: any): string {
  return (
    product.category_title ||
    product.category?.title ||
    product.family?.title ||
    product.category ||
    'Outros'
  );
}

function groupProductsByCategory(products: any[]): Record<string, any[]> {
  return products.reduce((acc, product) => {
    const categoryName = getCategoryName(product);
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, any[]>);
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

  const num = parseFloat(rawPrice);
  return isNaN(num) || num === 0 ? '0.00 €' : `${num.toFixed(2)} €`;
}

export function MenuClient({
  categories,
  initialItems
}: {
  categories: string[];
  initialItems: VendusProduct[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = initialItems.filter((item: any) => {
    const categoryName = getCategoryName(item);
    const matchesCategory = selectedCategory === 'Todas' || categoryName === selectedCategory;
    const matchesSearch = (item.name || item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const groupedProducts = groupProductsByCategory(filteredItems);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Pesquisar no menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border border-[#3a3530] text-[#f4f1ec] text-sm rounded-none px-4 py-3 pl-10 focus:border-[#d4a053] outline-none transition placeholder:text-[#8a8279]"
          />
          <span className="absolute left-3.5 top-3.5 text-[#8a8279] text-sm">🔍</span>
        </div>

        <div className="w-full flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`px-5 py-2 rounded-none text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all border ${
              selectedCategory === 'Todas'
                ? 'bg-[#d4a053] text-[#141210] border-[#d4a053]'
                : 'bg-transparent border-[#3a3530] text-[#8a8279] hover:text-[#f4f1ec] hover:border-[#d4a053]'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-none text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#d4a053] text-[#141210] border-[#d4a053]'
                  : 'bg-transparent border-[#3a3530] text-[#8a8279] hover:text-[#f4f1ec] hover:border-[#d4a053]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="space-y-16">
          {Object.entries(groupedProducts).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-8">
              <div className="border-b border-[#333] pb-4">
                <h2 className="text-3xl font-serif font-bold text-[#F8F5F0]">
                  {categoryName}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-end border-b border-[#2A2825] pb-3 group">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-serif font-medium text-[#EAE6DF] group-hover:text-[#C5A059] transition-colors">
                        {item.title || item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-[#888] mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="text-[#C5A059] font-bold whitespace-nowrap">
                        {parsePrice(item)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-[#3a3530]/60 rounded-none">
          <p className="text-[#8a8279] text-sm font-['Playfair_Display'] italic">Nenhum prato encontrado com esses critérios.</p>
        </div>
      )}
    </div>
  );
}
