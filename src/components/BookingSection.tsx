'use client';

import { useState, FormEvent } from 'react';

export function BookingSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30"
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const prefix = formData.get('prefix');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const date = formData.get('date');
    const time = formData.get('time');
    const guests = formData.get('guests');
    const dishes = formData.get('dishes');
    const comments = formData.get('comments');
    const marketing = formData.get('marketing') === 'on' ? 'Sim' : 'Não';

    const fullPhone = `${prefix} ${phone}`;

    const message = `${name}
Data da reserva: ${date}
Horas: ${time}
Nº de pessoas: ${guests}
Contacto: ${fullPhone}
Comentário: ${comments || 'Nenhum'}
Ementa: ${dishes || 'Nenhuma preferência prévia'}`;

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email, marketing, name, phone: fullPhone, date, time, guests }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Reserva confirmada! O restaurante foi notificado.' });
        form.reset();
      } else {
        throw new Error(data.error || 'Falha ao enviar notificação');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: 'Erro ao enviar a reserva. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  return (
    <section id="reservas" className="py-24 px-6 bg-[#141210] text-[#F8F5F0]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Reserva de Mesa</h2>
          <p className="text-[#C5A059] font-serif italic text-lg">
            Garanta o seu lugar e escolha os seus pratos antecipadamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1A1816] p-8 md:p-10 border border-[#2A2825]">
          {statusMessage && (
            <div className={`p-4 text-center text-sm border ${statusMessage.type === 'success' ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200' : 'bg-red-950/50 border-red-500 text-red-200'}`}>
              {statusMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Nome</label>
              <input required type="text" name="name" className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="O seu nome" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Telemóvel</label>
              <div className="flex gap-2">
                <select name="prefix" className="bg-[#141210] border border-[#333] text-white px-3 py-3 focus:outline-none focus:border-[#C5A059] transition-colors">
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+1">🇺🇸/🇨🇦 +1</option>
                </select>
                <input required type="tel" name="phone" className="flex-1 bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="912 345 678" />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Email (Opcional)</label>
              <input type="email" name="email" className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="o.seu@email.com" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Data</label>
              <input 
                required 
                type="date" 
                name="date" 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  if (selectedDate.getDay() === 0) {
                    e.target.setCustomValidity('O restaurante encontra-se encerrado aos domingos. Por favor, selecione outro dia.');
                    e.target.reportValidity();
                    e.target.value = '';
                  } else {
                    e.target.setCustomValidity('');
                  }
                }}
                className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Hora</label>
              <select 
                required 
                name="time" 
                className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors"
                defaultValue=""
              >
                <option value="" disabled>Selecione a hora</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Nº de Pessoas</label>
            <input required type="number" name="guests" min="1" max="20" className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="Ex: 4" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Comentários / Observações</label>
            <input type="text" name="comments" className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors" placeholder="Ex: Cadeira de bebé, alergias..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Ementa / Pré-reserva de Pratos</label>
            <textarea name="dishes" rows={3} className="w-full bg-[#141210] border border-[#333] text-white px-4 py-3 focus:outline-none focus:border-[#C5A059] transition-colors resize-none" placeholder="Ex: 2x Bacalhau com Broa, 1x Posta Mirandesa"></textarea>
          </div>

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" name="marketing" id="marketing" className="mt-1 w-4 h-4 accent-[#C5A059] bg-[#141210] border-[#333] cursor-pointer" />
            <label htmlFor="marketing" className="text-sm text-[#A88849] cursor-pointer select-none">
              Aceito receber promoções, novidades e ofertas exclusivas por e-mail e mensagem.
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#C5A059] hover:bg-[#A88849] text-white font-bold tracking-widest uppercase py-4 transition-colors disabled:opacity-50">
            {isSubmitting ? 'A enviar reserva...' : 'Confirmar Reserva'}
          </button>
        </form>
      </div>
    </section>
  );
}
