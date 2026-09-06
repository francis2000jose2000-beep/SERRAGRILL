import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    // Tenta ler o body de forma segura (suporta JSON ou Form-Data)
    let body: Record<string, any> = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      // Se vier em urlencoded ou texto plano
      try {
        body = JSON.parse(text);
      } catch {
        const params = new URLSearchParams(text);
        body = Object.fromEntries(params.entries());
      }
    }

    const senderPhone = body.from || body.sender || body.phone || '';
    const messageText = body.text || body.message || body.Body || '';

    // 1. SEGURANÇA: Verificação de Whitelist (se configurada)
    const allowedOwnerPhone = process.env.OWNER_WHATSAPP_PHONE;
    
    if (allowedOwnerPhone && senderPhone && senderPhone !== allowedOwnerPhone) {
      console.warn(`⚠️ Tentativa de acesso não autorizada do número: ${senderPhone}`);
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 403 });
    }

    if (!messageText) {
      return NextResponse.json({ success: false, error: 'Mensagem vazia' }, { status: 400 });
    }

    // 2. INTELIGÊNCIA ARTIFICIAL (Groq ou OpenAI) para extrair o prato e o preço
    let parsedMenuData = { prato: String(messageText), preco: "Preço sob consulta" };

    const apiKeyAI = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    const apiUrlAI = process.env.GROQ_API_KEY 
      ? 'https://api.groq.com/openai/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';
    const modelAI = process.env.GROQ_API_KEY ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';

    try {
      if (apiKeyAI) {
        const aiResponse = await fetch(apiUrlAI, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyAI}`,
          },
          body: JSON.stringify({
            model: modelAI,
            messages: [
              {
                role: 'system',
                content: 'És um assistente que extrai o nome do prato e o preço de mensagens de texto enviadas por um restaurateur. Devolve estritamente um JSON válido com as chaves "prato" e "preco".'
              },
              { role: 'user', content: String(messageText) }
            ],
            response_format: { type: "json_object" }
          }),
        });

        const aiData = await aiResponse.json();
        if (aiData.choices?.[0]?.message?.content) {
          parsedMenuData = JSON.parse(aiData.choices[0].message.content);
        }
      }
    } catch (aiError) {
      console.error('⚠️ Falha ao processar com IA, a usar texto bruto:', aiError);
    }

    // 3. GOOGLE SHEETS: Atualizar a folha de cálculo
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
      
      const sheet = doc.sheetsByTitle['Menu'] || doc.sheetsByIndex[0];
      
      await sheet.addRow({
        Prato: parsedMenuData.prato,
        Preco: parsedMenuData.preco,
        AtualizadoEm: new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
      });
    }

    // 4. NEXT.JS: Forçar atualização imediata da página no site
    revalidatePath('/');
    revalidatePath('/menu');

    return NextResponse.json({ 
      success: true, 
      message: 'Menu atualizado com sucesso!', 
      data: parsedMenuData 
    });

  } catch (error: any) {
    console.error('❌ Erro no webhook do WhatsApp:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno' }, { status: 500 });
  }
}
