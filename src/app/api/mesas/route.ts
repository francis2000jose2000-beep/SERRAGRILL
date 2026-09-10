import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

async function getSheet() {
  const sheetId = process.env.GOOGLE_SHEET_ID_PEDIDOS?.replace(/["']/g, '').trim();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.replace(/["']/g, '').trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '').trim();

  if (!sheetId || !clientEmail || !privateKey) {
    throw new Error('Credenciais de API em falta');
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
      headerValues: ['Mesa', 'PIN', 'Sessões/IDs', 'Conectados'],
    });
  }

  return pinSheet;
}

export async function GET() {
  try {
    const pinSheet = await getSheet();
    const pinRows = await pinSheet.getRows();

    const mesas = pinRows
      .map(row => {
        const mesa = String(row.get('Mesa') || '').trim();
        const pin = String(row.get('PIN') || '').trim();
        const conectadosRaw = String(row.get('Conectados') || '').trim();
        const conectados = conectadosRaw === '' ? 0 : Number(conectadosRaw);
        return { mesa: mesa || 'Sem nome', ocupada: pin !== '', conectados: Number.isNaN(conectados) ? 0 : conectados };
      })
      .filter(m => m.mesa && m.mesa !== 'Sem nome');

    return NextResponse.json(mesas);
  } catch (error: any) {
    console.error('❌ Erro ao ler mesas:', error);
    return NextResponse.json({ error: 'Erro interno ao ler mesas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, mesa, pin, deviceId } = body;

    if (!action || !mesa) {
      return NextResponse.json({ success: false, error: 'Action e mesa são obrigatórios' }, { status: 400 });
    }

    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'deviceId é obrigatório.' }, { status: 400 });
    }

    if (action === 'bloquear') {
      if (!pin || !/^\d{4}$/.test(String(pin))) {
        return NextResponse.json({ success: false, error: 'PIN deve ter exatamente 4 dígitos.' }, { status: 400 });
      }
    }

    if ((action === 'validar' || action === 'libertar') && !pin) {
      return NextResponse.json({ success: false, error: 'PIN é obrigatório.' }, { status: 400 });
    }

    const pinSheet = await getSheet();
    const pinRows = await pinSheet.getRows();
    const mesaNormalizada = String(mesa).trim();

    const mesaRow = pinRows.find(row => String(row.get('Mesa') || '').trim() === mesaNormalizada);

    if (action === 'bloquear') {
      let targetRow = pinRows.find(row => String(row.get('Mesa') || '').trim() === mesaNormalizada);

      if (!targetRow) {
        targetRow = await pinSheet.addRow({ Mesa: mesaNormalizada, PIN: '', 'Sessões/IDs': '', Conectados: 0 });
      }

      const pinAtual = String(targetRow.get('PIN') || '').trim();
      if (pinAtual !== '') {
        return NextResponse.json({ success: false, error: 'Mesa já ocupada' }, { status: 400 });
      }

      targetRow.set('PIN', String(pin).trim());
      targetRow.set('Sessões/IDs', String(deviceId));
      targetRow.set('Conectados', 1);
      await targetRow.save();

      const mesa = mesaNormalizada.startsWith('Mesa ') ? mesaNormalizada : `Mesa ${mesaNormalizada}`;
      return NextResponse.json({ success: true, mesa, conectados: 1 });
    }

    if (action === 'validar') {
      if (!mesaRow) {
        return NextResponse.json({ success: false, error: 'Mesa não encontrada' }, { status: 404 });
      }
      const pinArmazenado = String(mesaRow.get('PIN') || '').trim();
      if (pinArmazenado !== String(pin).trim()) {
        return NextResponse.json({ success: false, error: 'PIN incorreto' }, { status: 401 });
      }

      const sessoesRaw = String(mesaRow.get('Sessões/IDs') || '').trim();
      const ids = sessoesRaw === '' ? [] : sessoesRaw.split(',').map(s => s.trim()).filter(Boolean);

      if (ids.includes(String(deviceId))) {
        const conectadosRaw = String(mesaRow.get('Conectados') || '').trim();
        const conectados = conectadosRaw === '' ? 0 : Number(conectadosRaw);
        const mesa = mesaNormalizada.startsWith('Mesa ') ? mesaNormalizada : `Mesa ${mesaNormalizada}`;
        return NextResponse.json({ success: true, mesa, conectados: Number.isNaN(conectados) ? 0 : conectados });
      }

      ids.push(String(deviceId));
      const novaString = ids.join(',');
      const novoTotal = ids.length;

      mesaRow.set('Sessões/IDs', novaString);
      mesaRow.set('Conectados', novoTotal);
      await mesaRow.save();

      const mesa = mesaNormalizada.startsWith('Mesa ') ? mesaNormalizada : `Mesa ${mesaNormalizada}`;
      return NextResponse.json({ success: true, mesa, conectados: novoTotal });
    }

    if (action === 'libertar') {
      if (!mesaRow) {
        return NextResponse.json({ success: false, error: 'Mesa não encontrada' }, { status: 404 });
      }
      const pinArmazenado = String(mesaRow.get('PIN') || '').trim();
      if (pinArmazenado !== String(pin).trim()) {
        return NextResponse.json({ success: false, error: 'PIN incorreto' }, { status: 401 });
      }

      mesaRow.set('PIN', '');
      mesaRow.set('Sessões/IDs', '');
      mesaRow.set('Conectados', 0);
      await mesaRow.save();

      const mesa = mesaNormalizada.startsWith('Mesa ') ? mesaNormalizada : `Mesa ${mesaNormalizada}`;
      return NextResponse.json({ success: true, mesa, conectados: 0 });
    }

    if (action === 'desconectar') {
      const mesa = mesaNormalizada.startsWith('Mesa ') ? mesaNormalizada : `Mesa ${mesaNormalizada}`;
      if (!mesaRow) {
        return NextResponse.json({ success: true, mesa, conectados: 0 });
      }

      const sessoesRaw = String(mesaRow.get('Sessões/IDs') || '').trim();
      const ids = sessoesRaw === '' ? [] : sessoesRaw.split(',').map(s => s.trim()).filter(Boolean);
      const filteredIds = ids.filter(id => id !== String(deviceId));

      if (filteredIds.length !== ids.length) {
        mesaRow.set('Sessões/IDs', filteredIds.join(','));
        mesaRow.set('Conectados', filteredIds.length);
        await mesaRow.save();
      }

      return NextResponse.json({ success: true, mesa, conectados: filteredIds.length });
    }

    return NextResponse.json({ success: false, error: 'Ação inválida' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Erro na ação da mesa:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao processar ação' }, { status: 500 });
  }
}
