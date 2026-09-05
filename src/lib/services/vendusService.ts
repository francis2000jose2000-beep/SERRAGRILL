const VENDUS_API_BASE = 'https://api.vendus.pt/v1.1/products';
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
  let rawPrice = 0;
  
  if (item.gross_price) {
    rawPrice = item.gross_price;
  } else if (item.price) {
    rawPrice = item.price;
  } else if (item.prices && Array.isArray(item.prices) && item.prices.length > 0) {
    rawPrice = item.prices[0].value || item.prices[0].gross_price || 0;
  }

  const num = parseFloat(rawPrice);
  return isNaN(num) || num === 0 ? 0 : num;
};

export async function fetchVendusProducts(): Promise<VendusProduct[]> {
  try {
    const response = await fetch(`${VENDUS_API_BASE}?api_key=${VENDUS_API_KEY}&per_page=200&status=on`);
    if (!response.ok) {
      throw new Error('Failed to fetch products from Vendus API');
    }
    const data = await response.json();
    console.log("ESTRUTURA DO PRODUTO VENDUS:", JSON.stringify(data[0] || data.data?.[0], null, 2));

    const rawProducts = data.products || [];

    return rawProducts.map((item: any) => ({
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
    console.error('Error fetching Vendus products:', error);
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
