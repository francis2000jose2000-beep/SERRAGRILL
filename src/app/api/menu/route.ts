import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Desativa cache estática

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({ success: false, error: 'Credenciais em falta' }, { status: 500 });
    }

    const auth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n').replace(/"/g, ''),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Ementa'];
    if (!sheet) return NextResponse.json({ success: false, error: 'Aba Ementa não encontrada' }, { status: 404 });

    const rows = await sheet.getRows();
    const menu = rows.map(row => ({
      dia: row.get('Dia') || '',
      prato: row.get('Prato') || '',
      preco: row.get('Preco') || ''
    }));

    return NextResponse.json({ success: true, menu });
  } catch (error) {
    console.error('Erro ao buscar menu:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
