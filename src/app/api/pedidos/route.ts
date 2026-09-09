import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, pedido, total } = body;

    if (!pin || !pedido) {
      return NextResponse.json({ success: false, error: 'PIN e pedido são obrigatórios' }, { status: 400 });
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

    // =========================================================================
    // Autenticação por PIN: acede à aba "PINs"
    // =========================================================================
    let pinSheet = doc.sheetsByTitle['PINs'];
    if (!pinSheet) {
      pinSheet = await doc.addSheet({
        title: 'PINs',
        headerValues: ['Mesa', 'PIN'],
      });
    }

    // Lê todas as linhas da aba "PINs" para encontrar a Mesa associada ao PIN
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

    // Normaliza o nome da mesa (ex: "Mesa 1")
    const mesa = mesaFound.startsWith('Mesa ') ? mesaFound : `Mesa ${mesaFound}`;

    // =========================================================================

    // Procura pela aba "Pedidos"
    const sheet = doc.sheetsByTitle['Pedidos'] || doc.sheetsByIndex[0];
    
    // Adiciona os cabeçalhos se a folha estiver vazia
    try {
      await sheet.loadHeaderRow();
    } catch (e) {
      await sheet.setHeaderRow(['Data/Hora', 'Mesa', 'Pedido', 'Valor', 'Estado']);
    }

    const dataAtual = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });

    // =========================================================================
    // LÓGICA DE INSERÇÃO NO TOPO (Empurra tudo para baixo)
    // =========================================================================
    
    // 1. Abre um espaço em branco na Linha 2
    await sheet.insertDimension('ROWS', { startIndex: 1, endIndex: 2 });

    // 2. Carrega as células dessa nova linha 2 (A2 a E2)
    await sheet.loadCells('A2:E2');

    // 3. Preenche cada célula da linha 2
    sheet.getCell(1, 0).value = dataAtual;           // Coluna A (Data/Hora)
    sheet.getCell(1, 1).value = mesa;                 // Coluna B (Mesa)
    sheet.getCell(1, 2).value = pedido;               // Coluna C (Pedido)
    sheet.getCell(1, 3).value = total || 'N/A';       // Coluna D (Valor)
    sheet.getCell(1, 4).value = 'Pendente';           // Coluna E (Estado inicial)

    // 4. Guarda as alterações no Google Sheets
    await sheet.saveUpdatedCells();

    // =========================================================================

    return NextResponse.json({ success: true, message: 'Pedido enviado com sucesso e inserido no topo!' });
  } catch (error: any) {
    console.error('❌ Erro a gravar pedido:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao processar pedido' }, { status: 500 });
  }
}
