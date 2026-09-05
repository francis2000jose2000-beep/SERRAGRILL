export interface VendusProduct {
  id: string | number;
  name: string;
  price: number | string;
  category?: string;
  description?: string;
  image_url?: string;
  is_available?: boolean;
}

export async function getVendusMenu(): Promise<{ categories: string[]; items: VendusProduct[] }> {
  const apiKey = process.env.VENDUS_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ VENDUS_API_KEY não configurada.');
    return getFallbackMenu();
  }

  try {
    const response = await fetch('https://www.vendus.pt/ws/v1.0/products', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const textBody = await response.text();
      console.error('❌ Erro Vendus: A API devolveu HTML em vez de JSON. Resposta:', textBody.substring(0, 150));
      return getFallbackMenu();
    }

    if (!response.ok) {
      console.error(`❌ Erro Vendus HTTP: ${response.status}`);
      return getFallbackMenu();
    }

    const products = await response.json();
    const items = Array.isArray(products) ? products : [];

    const parsePrice = (item: any) => {
      let rawPrice: any = 0;

      if (item.gross_price) {
        rawPrice = item.gross_price;
      } else if (item.price) {
        rawPrice = item.price;
      } else if (item.prices && Array.isArray(item.prices) && item.prices.length > 0) {
        rawPrice = item.prices[0].value || item.prices[0].gross_price || 0;
      }

      const num = parseFloat(String(rawPrice));
      return isNaN(num) || num === 0 ? '0.00 €' : `${num.toFixed(2)} €`;
    };

    const mappedItems: VendusProduct[] = items.map((item: any) => ({
      id: item.id,
      name: item.title || item.name,
      price: parsePrice(item),
      category: item.category_name || item.category?.name || 'Geral',
      description: item.description || '',
      is_available: item.status === 'A' || item.is_available !== false,
    }));

    const categories = Array.from(new Set(mappedItems.map((i) => i.category || 'Geral')));

    return { categories, items: mappedItems };
  } catch (error) {
    console.error('❌ Erro de rede ao contactar o Vendus:', error);
    return getFallbackMenu();
  }
}

function getFallbackMenu() {
  return {
    categories: ['Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas'],
    items: [
      { id: '1', name: 'Prego à Mirandesa', price: '8.50 €', category: 'Entradas', description: 'Carne de vitela em pão d\'água com alho e manteiga.' },
      { id: '2', name: 'Bacalhau à Brás', price: '13.50 €', category: 'Pratos Principais', description: 'Bacalhau desfiado, batata palha fina, ovos e azeitonas.' },
      { id: '3', name: 'Posta à SerraGrill', price: '18.00 €', category: 'Pratos Principais', description: 'Posta grelhada na brasa com flor de sal e batata a murro.' },
      { id: '4', name: 'Vinho da Casa (Garrafa)', price: '9.00 €', category: 'Bebidas', description: 'Tinto Reserva da Região Demarcada.' },
      { id: '5', name: 'Pastel de Nata com Gelado', price: '4.50 €', category: 'Sobremesas', description: 'Servido quente com uma bola de gelado de baunilha.' },
    ],
  };
}
