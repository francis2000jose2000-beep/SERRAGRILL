'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { VendusProduct } from '@/lib/vendus';

interface CartItem {
  name: string;
  quantity: number;
}

function OrderFormInner({ initialItems }: { initialItems: VendusProduct[] }) {
  const searchParams = useSearchParams();
  const mesaParam = searchParams.get('mesa');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [mesa, setMesa] = useState<string>(mesaParam || '');

  const addToCart = (name: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { name, quantity: 1 }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((item) => item.name !== name);
      }
      return prev.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const pedidoTexto = cart.map((item) => `${item.quantity}x ${item.name}`).join(', ');

  const handleSubmit = async () => {
    if (!mesa) {
      setSubmitMessage('Selecione uma mesa antes de enviar.');
      return;
    }
    if (cart.length === 0) {
      setSubmitMessage('Adicione pelo menos um item ao pedido.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesa, pedido: pedidoTexto, total: 'N/A' }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage('Pedido enviado com sucesso!');
        setCart([]);
      } else {
        setSubmitMessage(data.error || 'Erro ao enviar pedido.');
      }
    } catch {
      setSubmitMessage('Erro de ligação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#141210]">
          Pedir à Mesa
        </h1>
        <p className="text-[#8F2E25] font-serif italic text-lg">
          Faça o seu pedido diretamente para a cozinha.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E6E0D5] rounded-lg p-6">
            <h2 className="text-2xl font-serif font-bold text-[#141210] mb-4">Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {initialItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-[#E6E0D5] rounded-md p-3 hover:border-[#8F2E25] transition-colors"
                >
                  <span className="text-[#141210] font-medium">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(item.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8F2E25] text-white hover:bg-[#6f231c] transition-colors"
                    aria-label={`Adicionar ${item.name}`}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E6E0D5] rounded-lg p-6">
            <h2 className="text-2xl font-serif font-bold text-[#141210] mb-4">O seu Pedido</h2>

            <div className="space-y-3 mb-4">
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-500">Ainda não adicionou itens.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-[#141210] text-sm">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.name)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-[#2A2825] text-[#141210] hover:border-[#8F2E25] transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[#141210] text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(item.name)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-[#2A2825] text-[#141210] hover:border-[#8F2E25] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold tracking-widest text-[#8F2E25] uppercase">Mesa</label>
              <select
                value={mesa}
                onChange={(e) => setMesa(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#2A2825] text-[#141210] px-4 py-3 focus:outline-none focus:border-[#8F2E25] transition-colors"
              >
                <option value="">Selecione a mesa</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>{n}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#8F2E25] hover:bg-[#6f231c] text-white font-bold tracking-widest uppercase py-4 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'A enviar...' : 'Enviar Pedido'}
              </button>

              {submitMessage && (
                <p className="text-sm text-center mt-2 text-[#8F2E25]">{submitMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderForm({ initialItems }: { initialItems: VendusProduct[] }) {
  return (
    <Suspense fallback={<div className="text-center text-[#8F2E25] font-serif py-6">A carregar...</div>}>
      <OrderFormInner initialItems={initialItems} />
    </Suspense>
  );
}
