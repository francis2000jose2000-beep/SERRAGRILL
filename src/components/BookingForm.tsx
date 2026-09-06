'use client';

import { useState } from 'react';

export const BookingForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 focus:border-[#B33A2F] focus:ring-1 focus:ring-[#B33A2F] outline-none transition-all placeholder:text-zinc-600"
          placeholder="Nome completo"
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
          Telemóvel
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 focus:border-[#B33A2F] focus:ring-1 focus:ring-[#B33A2F] outline-none transition-all placeholder:text-zinc-600"
          placeholder="+351 912 345 678"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5 block">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 focus:border-[#B33A2F] focus:ring-1 focus:ring-[#B33A2F] outline-none transition-all placeholder:text-zinc-600"
          placeholder="email@exemplo.com"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#D14437] to-[#B33A2F] text-zinc-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-[#B33A2F]/10"
      >
        Fazer Reserva
      </button>
    </form>
  );
};