import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ success: false, error: 'PIN é obrigatório.' }, { status: 400 });
    }

    const sheetId = process.env.GOOGLE_SHEET_ID_PEDIDOS?.replace(/["']/g, '').trim();
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.replace(/["']/g, '').trim();
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim();

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({ success: false, error: 'Credenciais de API em falta' }, { status: 500 });
    }

    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    let pinSheet = doc.sheetsByTitle['PINs'];
    if (!pinSheet) {
      pinSheet = await doc.addSheet({
        title: 'PINs',
        headerValues: ['Mesa', 'PIN'],
      });
    }

    const pinRows = await pinSheet.getRows();
    const pinNormalizado = String(pin).trim();
    let mesaFound: string | null = null;

    for (const row of pinRows) {
      const pinArmazenado = String(row.get('PIN') || '').trim();
      if (pinArmazenado === pinNormalizado) {
        mesaFound = String(row.get('Mesa') || '').trim();
        break;
      }
    }

    if (!mesaFound) {
      return NextResponse.json({ success: false, error: 'PIN de acesso inválido.' }, { status: 401 });
    }

    const mesa = mesaFound.startsWith('Mesa ') ? mesaFound : `Mesa ${mesaFound}`;
    return NextResponse.json({ success: true, mesa });
  } catch (error: any) {
    console.error('❌ Erro a validar PIN:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao validar PIN' }, { status: 500 });
  }
}
