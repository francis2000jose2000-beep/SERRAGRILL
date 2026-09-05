import { fetchVendusProducts, type VendusProduct } from '../../../lib/services/vendusService';

export async function GET() {
  try {
    const products = await fetchVendusProducts();

    type MenuProduct = {
      id: string;
      name: string;
      price: string;
      category: string;
      description?: string;
      image?: string;
      image_url?: string;
      is_active?: boolean;
    };

    const parsePrice = (item: any) => {
      let rawPrice: any = 0;
      
      if (item.gross_price) {
        rawPrice = item.gross_price;
      } else if (item.price) {
        rawPrice = item.price;
      } else if (item.prices && Array.isArray(item.prices) && item.prices.length > 0) {
        rawPrice = item.prices[0].value || item.prices[0].gross_price || 0;
      }

      // Envolvemos em String() para garantir que o TypeScript aceita o argumento
      const num = parseFloat(String(rawPrice));
      return isNaN(num) || num === 0 ? '0.00 €' : `${num.toFixed(2)} €`;
    };

    // Group products by category
    const categories: Record<string, MenuProduct[]> = {};

    products.forEach((product: VendusProduct) => {
      const category = product.category || 'Outros';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        id: product.id,
        name: product.name,
        price: parsePrice(product),
        category: product.category,
        description: product.description,
        image: product.image_url,
        image_url: product.image_url,
        is_active: product.is_active,
      });
    });

    return new Response(
      JSON.stringify({
        success: true,
        categories,
        totalProducts: products.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching menu:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro ao carregar menu',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}