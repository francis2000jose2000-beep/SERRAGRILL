import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export interface Produto {
  id: string | number;
  nome: string;
  categoria: string;
  preco: number;
}

export async function getProdutos(): Promise<Produto[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID_PRODUTOS || process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    console.warn('⚠️ GOOGLE_SHEET_ID Produtos não configurado.');
    return [];
  }

  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Produtos'] || doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const items: Produto[] = rows
      .map((row: any, index: number) => {
        const raw = row._rawData || [];
        const nome = raw[0]?.trim();
        const categoria = raw[1]?.trim() || 'Geral';
        const precoStr = String(raw[2] || '0').replace(',', '.');
        const preco = parseFloat(precoStr) || 0;

        return { id: index + 1, nome, categoria, preco };
      })
      .filter((item: any) => item.nome && item.nome !== '');

    console.log(`✅ Google Sheets: ${items.length} produtos carregados.`);
    return items;
  } catch (error: any) {
    console.error('❌ Erro ao ler produtos do Sheets:', error);
    return [];
  }
}