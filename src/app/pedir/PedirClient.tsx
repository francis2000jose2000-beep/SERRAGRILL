'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface VendusItem {
  id: string | number;
  nome: string;
  preco: number;
  categoria: string;
}

const ITEMS_PER_PAGE = 15;

function OrderFormContent({ initialItems }: { initialItems: VendusItem[] }) {
  const searchParams = useSearchParams();
  const mesaURL = searchParams.get('mesa');
  
  const [mesa, setMesa] = useState(mesaURL || '');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<{nome: string, qtd: number, preco: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1. Extração de Categorias
  const categories = useMemo(() => {
    if (!initialItems || initialItems.length === 0) return ['Todas'];
    const cats = new Set(initialItems.map(item => item.categoria || 'Geral'));
    return ['Todas', ...Array.from(cats)];
  }, [initialItems]);

  // 2. Filtragem cruzada
  const filteredItems = useMemo(() => {
    if (!initialItems) return [];
    return initialItems.filter(item => {
      const matchesSearch = item.nome.toLowerCase().includes(search.toLowerCase());
      const itemCat = item.categoria || 'Geral';
      const matchesCategory = selectedCategory === 'Todas' || itemCat === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialItems, search, selectedCategory]);

  // 3. Paginação
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleCategory = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); };

  const addToCart = (item: VendusItem) => {
    setCart(prev => {
      const exists = prev.find(cartItem => cartItem.nome === item.nome);
      if (exists) return prev.map(cartItem => cartItem.nome === item.nome ? { ...cartItem, qtd: cartItem.qtd + 1 } : cartItem);
      return [...prev, { nome: item.nome, qtd: 1, preco: Number(item.preco) || 0 }];
    });
  };

  const removeFromCart = (nome: string) => {
    setCart(prev => prev.map(item => item.nome === nome ? { ...item, qtd: item.qtd - 1 } : item).filter(item => item.qtd > 0));
  };

  // Cálculo do Total
  const cartTotal = cart.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

  const submitOrder = async () => {
    if (!mesa || cart.length === 0) return alert('Selecione uma mesa e adicione itens ao pedido.');
    setIsSubmitting(true);
    
    const pedidoFormatado = cart.map(item => `${item.qtd}x ${item.nome}`).join('\n');

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mesa, 
          pedido: pedidoFormatado,
          total: `${cartTotal.toFixed(2)}€`
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        setCart([]);
      } else {
        alert('Erro ao enviar pedido. Chame um funcionário.');
      }
    } catch (err) {
      alert('Falha de ligação ao enviar pedido.');
    }
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h2 className="text-3xl font-serif text-[#141210] mb-4">Pedido Enviado!</h2>
        <p className="text-neutral-500 mb-8">A nossa equipa já está a preparar o seu pedido para a Mesa {mesa}.</p>
        <button onClick={() => setSuccess(false)} className="text-[#8F2E25] font-bold underline hover:text-[#141210]">Fazer novo pedido</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-40">
      {/* SELEÇÃO DE MESA */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E6E0D5]">
        <label className="block text-sm font-bold text-[#141210] uppercase tracking-wider mb-3">A sua Mesa</label>
        {mesaURL ? (
          <div className="text-2xl font-serif text-[#8F2E25] font-bold">Mesa {mesaURL}</div>
        ) : (
          <select value={mesa} onChange={(e) => setMesa(e.target.value)} className="w-full md:w-1/2 p-3 border border-neutral-300 rounded bg-white text-[#141210] font-medium focus:border-[#8F2E25] focus:ring-1 focus:ring-[#8F2E25] outline-none">
            <option value="" className="text-neutral-400">Selecione o número da mesa...</option>
            {Array.from({length: 15}, (_, i) => i + 1).map(num => (
              <option key={num} value={num} className="text-[#141210]">Mesa {num}</option>
            ))}
          </select>
        )}
      </div>

      {/* FILTROS E PESQUISA */}
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Pesquisar pedido (ex: Água, Bitoque)..." 
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-4 border border-neutral-300 rounded-md focus:border-[#8F2E25] focus:ring-1 focus:ring-[#8F2E25] outline-none text-[#141210]"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat} onClick={() => handleCategory(cat)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                selectedCategory === cat ? 'bg-[#8F2E25] border-[#8F2E25] text-white' : 'bg-transparent border-neutral-300 text-neutral-600 hover:border-[#8F2E25]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE ITENS */}
      <div className="flex flex-col space-y-0 bg-white p-4 rounded-md shadow-sm border border-[#E6E0D5]">
        {paginatedItems.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">Nenhum item encontrado.</div>
        ) : (
          paginatedItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 border-b border-[#E6E0D5] last:border-0">
              <span className="font-medium text-[#141210]">{item.nome}</span>
              <button 
                onClick={() => addToCart(item)}
                className="w-8 h-8 flex items-center justify-center bg-[#8F2E25] text-white rounded-full font-bold hover:bg-[#6c231c]"
              >
                +
              </button>
            </div>
          ))
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-neutral-500 hover:text-[#8F2E25] disabled:opacity-30">Anterior</button>
          <span className="text-neutral-600">Página <b>{currentPage}</b> de {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="text-neutral-500 hover:text-[#8F2E25] disabled:opacity-30">Próxima</button>
        </div>
      )}

      {/* CARRINHO NO FUNDO */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#141210] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Itens do Carrinho */}
            <div className="w-full md:w-1/2 max-h-32 overflow-y-auto space-y-2 pr-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[#F8F5F0]">
                  <span>{item.qtd}x {item.nome}</span>
                  <button onClick={() => removeFromCart(item.nome)} className="text-neutral-400 hover:text-red-400 text-sm border border-neutral-600 px-2 py-1 rounded">- Remover</button>
                </div>
              ))}
            </div>
            
            {/* Total e Botão Enviar */}
            <div className="w-full md:w-1/2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
              <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span className="text-neutral-400 text-sm">Total do Pedido:</span>
                <span className="text-white text-2xl font-bold">{cartTotal.toFixed(2)}€</span>
              </div>
              <button 
                onClick={submitOrder} 
                disabled={isSubmitting || !mesa}
                className="w-full sm:w-auto bg-[#8F2E25] text-white px-6 py-3 rounded font-bold uppercase tracking-wider hover:bg-[#6c231c] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? 'A enviar...' : 'Enviar Pedido'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper com fallback de fetch no cliente caso o servidor mande vazio
export default function PedirClient({ initialItems }: { initialItems: VendusItem[] }) {
  const [items, setItems] = useState<VendusItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems || initialItems.length === 0);

  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      fetch('/api/produtos')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Erro ao buscar produtos no cliente:', err);
          setLoading(false);
        });
    }
  }, [initialItems]);

  if (loading) {
    return (
      <div className="text-center py-20 text-neutral-500 animate-pulse">
        A carregar produtos...
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="text-center py-20 text-neutral-500 animate-pulse">A carregar interface...</div>}>
      <OrderFormContent initialItems={items} />
    </Suspense>
  );
}
