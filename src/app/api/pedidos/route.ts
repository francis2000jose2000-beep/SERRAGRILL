import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mesa, pedido, total } = body;

    if (!mesa || !pedido) {
      return NextResponse.json({ success: false, error: 'Mesa e pedido são obrigatórios' }, { status: 400 });
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
    
    // Procura pela aba "Pedidos"
    const sheet = doc.sheetsByTitle['Pedidos'] || doc.sheetsByIndex[0];
    
    // Adiciona os cabeçalhos se a folha estiver vazia
    try {
      await sheet.loadHeaderRow();
    } catch (e) {
      await sheet.setHeaderRow(['Data/Hora', 'Mesa', 'Pedido', 'Total', 'Estado']);
    }

    // Grava a nova linha no Excel
    const dataAtual = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
    await sheet.addRow({
      'Data/Hora': dataAtual,
      'Mesa': `Mesa ${mesa}`,
      'Pedido': pedido,
      'Total': total || 'N/A',
      'Estado': 'Pendente'
    });

    return NextResponse.json({ success: true, message: 'Pedido enviado com sucesso!' });
  } catch (error: any) {
    console.error('❌ Erro a gravar pedido:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao processar pedido' }, { status: 500 });
  }
}
