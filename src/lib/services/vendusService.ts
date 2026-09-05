const VENDUS_API_BASE = 'https://www.vendus.pt/ws/v1.0/products';
const VENDUS_API_KEY = process.env.VENDUS_API_KEY;

export interface VendusProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  image: string;
  is_active: boolean;
}

interface VendusCategory {
  [key: string]: string;
}

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
  return isNaN(num) || num === 0 ? 0 : num;
};

export async function fetchVendusProducts(): Promise<VendusProduct[]> {
  if (!VENDUS_API_KEY) {
    console.warn('⚠️ VENDUS_API_KEY não configurada.');
    return [];
  }

  try {
    const response = await fetch(VENDUS_API_BASE, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(VENDUS_API_KEY + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const textBody = await response.text();
      console.error('❌ Erro Vendus: A API devolveu HTML em vez de JSON. Resposta:', textBody.substring(0, 150));
      return [];
    }

    if (!response.ok) {
      console.error(`❌ Erro Vendus HTTP: ${response.status}`);
      return [];
    }

    const products = await response.json();
    const items = Array.isArray(products) ? products : [];

    console.log("ESTRUTURA DO PRODUTO VENDUS:", JSON.stringify(items[0] || items.data?.[0], null, 2));

    return items.map((item: any) => ({
      id: item.id,
      name: item.title || item.name,
      price: parsePrice(item),
      category: item.category_name || item.category?.name || 'Geral',
      description: item.description || '',
      image_url: item.image_url || '',
      image: item.image_url || '',
      is_active: item.status === 'A' || item.is_active !== false,
    }));
  } catch (error) {
    console.error('❌ Erro de rede ao contactar o Vendus:', error);
    return [];
  }
}

export async function getActiveProducts(): Promise<VendusProduct[]> {
  const allProducts = await fetchVendusProducts();
  return allProducts.filter((product) => product.is_active);
}

export function mapVendusProduct(product: VendusProduct) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    image: product.image_url,
  };
}
