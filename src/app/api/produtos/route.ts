import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheetId = process.env.GOOGLE_SHEET_ID_PRODUTOS || process.env.GOOGLE_SHEET_ID;
    
    if (!sheetId) return NextResponse.json({ error: 'ID do Google Sheets em falta.' }, { status: 500 });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Produtos'] || doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const items = rows
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

    return NextResponse.json(items, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    console.error('❌ Erro ao ler produtos do Sheets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}