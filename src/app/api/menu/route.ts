import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({ success: false, error: 'Credenciais em falta nas variáveis de ambiente' }, { status: 500 });
    }

    const auth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n').replace(/"/g, ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Ementa'];
    if (!sheet) {
      return NextResponse.json({ success: false, error: 'Aba chamada "Ementa" não foi encontrada no documento!' }, { status: 404 });
    }

    const rows = await sheet.getRows();
    
    // Mapeamento tolerável a maiúsculas/minúsculas e acentos
    const menu = rows.map(row => {
      const rowData = row.toObject() as Record<string, any>;
      const findKey = (keys: string[]) => {
        const found = Object.keys(rowData).find(k => keys.some(alt => k.toLowerCase().includes(alt.toLowerCase())));
        return found ? rowData[found] : '';
      };

      return {
        dia: findKey(['dia', 'day']) || '',
        prato: findKey(['prato', 'dish', 'ementa', 'nome']) || '',
        preco: findKey(['preco', 'preço', 'price', 'valor']) || ''
      };
    });

    console.log('📊 Dados lidos do Sheets:', menu);

    return NextResponse.json({ success: true, menu });
  } catch (error: any) {
    console.error('❌ Erro crítico ao buscar menu:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno' }, { status: 500 });
  }
}
