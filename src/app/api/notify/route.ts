import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const { message, email, marketing, name, phone, date, time } = await request.json();

    const ownerPhone = process.env.RESTAURANT_WHATSAPP_PHONE;
    const apiKey = process.env.CALLMEBOT_API_KEY;

    if (!ownerPhone || !apiKey) {
      console.error('ERRO: Faltam as chaves do WhatsApp no .env.local');
      return NextResponse.json({ success: false, error: 'Configuração em falta' }, { status: 500 });
    }

    const finalMessage = `${message}
Email: ${email || 'Não fornecido'}
Marketing: ${marketing}`;

    const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(ownerPhone)}&text=${encodeURIComponent(finalMessage)}&apikey=${apiKey}`;
    
    fetch(whatsappUrl).then(async (res) => {
      if (!res.ok) console.error('Erro ao notificar WhatsApp:', await res.text());
    }).catch(err => console.error('Falha de rede WhatsApp:', err));

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (sheetId && clientEmail && privateKey) {
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '');

      const serviceAccountAuth = new JWT({
        email: clientEmail,
        key: formattedPrivateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
      await doc.loadInfo(); 
      
      const sheet = doc.sheetsByIndex[0];
      
      await sheet.addRow({
        'Data da Reserva': date,
        'Hora da reserva': time,
        'Nome': name,
        'Telemóvel': `'${phone}`,
        'Email': email || 'N/A',
        'Marketing': marketing
      });
      
      console.log('✅ Cliente guardado com sucesso no Google Sheets!');
    } else {
      console.warn('⚠️ Google Sheets saltado: Credenciais não configuradas no .env.local');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ ERRO no endpoint:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}
