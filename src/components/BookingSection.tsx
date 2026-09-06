'use client';

import { useState, FormEvent } from 'react';
import DateSelector from "@/components/DateSelector";
import TimeSelector from "@/components/TimeSelector";

export function BookingSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const phone = formData.get('phone');
    const guests = formData.get('guests');
    const date = formData.get('date');
    const time = formData.get('time');

    if (!name || !phone || !guests || !date || !time) {
      setError('Por favor, preencha todos os campos obrigatórios (nome, telemóvel, pessoas, dia e hora).');
      return;
    }

    setIsSubmitting(true);

    try {
      const prefix = formData.get('prefix');
      const email = formData.get('email');
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

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email, marketing, name, phone: fullPhone, date, time, guests }),
      });

      if (!response.ok) throw new Error('Falha no envio');

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Falha ao enviar notificação');
      }
      
      setIsSuccess(true);
    } catch (err) {
      setError('Ocorreu um erro ao enviar a reserva. Por favor, tente de novo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setError('');
    setSelectedDate('');
    setSelectedTime('');
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

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reserva Enviada!</h2>
            <p className="text-neutral-400 max-w-sm">
              Recebemos o seu pedido com sucesso. Irá receber uma confirmação no seu telemóvel em breve.
            </p>
            <button 
              onClick={resetForm}
              className="mt-8 text-amber-500 hover:text-amber-400 font-medium"
            >
              Fazer nova reserva
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#1A1816] p-8 md:p-10 border border-[#2A2825]">
            {error && (
              <div className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                ⚠️ {error}
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
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Data</label>
              <DateSelector 
                onDateSelect={(date) => setSelectedDate(date)} 
              />
              <input type="hidden" name="date" value={selectedDate} />
              {!selectedDate && (
                <p className="text-red-400 text-xs mt-1">Por favor, selecione uma data para a reserva.</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold tracking-widest text-[#A88849] uppercase">Hora</label>
              <TimeSelector 
                onTimeSelect={(time) => setSelectedTime(time)} 
              />
              <input type="hidden" name="time" value={selectedTime} />
              {!selectedTime && (
                <p className="text-red-400 text-xs mt-1">Por favor, selecione uma hora para a reserva.</p>
              )}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              isSubmitting ? 'bg-amber-800 cursor-not-allowed opacity-70' : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            {isSubmitting ? 'A processar reserva...' : 'Confirmar Reserva'}
          </button>
        </form>
        )}
      </div>
    </section>
  );
}
