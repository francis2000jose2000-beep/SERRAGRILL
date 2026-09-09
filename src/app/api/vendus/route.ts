import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const apiKey = process.env.VENDUS_API_KEY;

  if (!apiKey) {
    console.error('❌ VENDUS_API_KEY não configurada nas variáveis de ambiente.');
    return NextResponse.json(
      { success: false, error: 'VENDUS_API_KEY em falta' },
      { status: 500 }
    );
  }

  try {
    // A Vendus aceita frequentemente a chave de API diretamente como parâmetro no URL
    const url = `https://www.vendus.pt/ws/v1.1/products/?api_key=${apiKey.trim()}&limit=500`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SerraGrill-App/1.0',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const textBody = await response.text();
      console.error('❌ A API da Vendus devolveu HTML em vez de JSON:', textBody.substring(0, 200));
      return NextResponse.json(
        { success: false, error: 'Resposta inválida da Vendus' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Erro HTTP da Vendus: ${response.status} - ${errorBody}`);
      return NextResponse.json(
        { success: false, error: `Erro HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawItems = Array.isArray(data) ? data : (data.items || data.products || []);

    const items = rawItems.map((item: any) => ({
      id: item.id || item.codigo || item.code || Math.random(),
      nome: item.nome || item.name || item.titulo || item.title || 'Produto sem nome',
      preco: Number(item.preco || item.price || item.valor || item.gross_price || 0),
      categoria: item.categoria || item.category || item.category_name || 'Geral',
    }));

    console.log(`✅ Vendus: ${items.length} produtos recebidos e normalizados com sucesso.`);

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('❌ Erro crítico ao contactar a API da Vendus:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}