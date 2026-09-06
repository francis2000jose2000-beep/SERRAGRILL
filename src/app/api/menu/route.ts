import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID_EMENTA || process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({ success: false, error: 'Credenciais ou GOOGLE_SHEET_ID_EMENTA em falta no .env.local' }, { status: 500 });
    }

    const auth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n').replace(/"/g, ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Ementa'] || doc.sheetsByIndex[0];
    if (!sheet) {
      return NextResponse.json({ success: false, error: 'Aba da ementa não encontrada no documento configurado.' }, { status: 404 });
    }

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows({ limit: 50 });
    
    const menu = rows.map((row) => {
      return {
        dia: String(row.get('Dia') || row.get('dia') || '').trim(),
        prato: String(row.get('Prato') || row.get('prato') || '').trim(),
        preco: String(row.get('Preco') || row.get('preço') || row.get('preco') || '').trim(),
        comentario: String(row.get('Comentario') || row.get('comentário') || row.get('comentario') || '').trim()
      };
    }).filter(item => item.prato !== '');

    console.log(`📊 Ementa lida com sucesso da folha dedicada (${menu.length} pratos):`, menu);

    return NextResponse.json(
      { success: true, menu },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('❌ Erro crítico ao buscar menu:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno' }, { status: 500 });
  }
}
