import PedirClient from './PedirClient';
import { Navbar } from '@/components/Navbar';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function PedirPage() {
  let items = [];
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const res = await fetch(`${protocol}://${host}/api/produtos`, { cache: 'no-store' });
    if (res.ok) items = await res.json();
  } catch (error) {
    console.error('Erro ao carregar produtos no servidor:', error);
  }

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF8F5] pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#141210] mb-4">
            Fazer Pedido
          </h1>
          <p className="text-[#8F2E25] font-serif italic text-lg">
            Escolha os itens e envie o pedido para a mesa.
          </p>
        </div>
        <PedirClient initialItems={items} />
      </main>
    </>
  );
}
