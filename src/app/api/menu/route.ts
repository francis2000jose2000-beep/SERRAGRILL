import { fetchVendusProducts, type VendusProduct } from '../../../lib/services/vendusService';

export async function GET() {
  try {
    const products = await fetchVendusProducts();

    const parsePrice = (product: VendusProduct) => {
      let rawPrice = 0;
      
      if ((product as any).gross_price) {
        rawPrice = (product as any).gross_price;
      } else if (product.price) {
        rawPrice = product.price;
      } else if ((product as any).prices && Array.isArray((product as any).prices) && (product as any).prices.length > 0) {
        rawPrice = (product as any).prices[0].value || (product as any).prices[0].gross_price || 0;
      }

      const num = parseFloat(rawPrice);
      return isNaN(num) || num === 0 ? '0.00 €' : `${num.toFixed(2)} €`;
    };

    // Group products by category
    const categories: Record<string, VendusProduct[]> = {};

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