'use client';

import { useState, useEffect } from 'react';

interface Reservation {
  id: string;
  code: string;
  date: string | Date;
  time: string;
  partySize: number;
  status: string;
  customer?: {
    name: string;
  };
}

export function LiveDashboard({ reservations = [] }: { reservations?: Reservation[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-12 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto text-zinc-300">
          <h3 className="text-xl font-bold text-[#D14437] mb-4">Dashboard ao Vivo - Reservas</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-500">
            A carregar reservas...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto text-zinc-300">
        <h3 className="text-xl font-bold text-[#D14437] mb-4">Dashboard ao Vivo - Reservas</h3>
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm">
          {reservations.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="p-2">Código</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Data</th>
                  <th className="p-2">Hora</th>
                  <th className="p-2">Pessoas</th>
                  <th className="p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-800/50">
                    <td className="p-2 font-mono text-[#B33A2F]">{r.code}</td>
                    <td className="p-2">{r.customer?.name || 'N/A'}</td>
                    <td className="p-2" suppressHydrationWarning>
                      {new Date(r.date).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="p-2">{r.time}</td>
                    <td className="p-2">{r.partySize}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#B33A2F]/10 text-[#B33A2F] border border-[#B33A2F]/20">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-zinc-500">Sem reservas registadas para hoje.</p>
          )}
        </div>
      </div>
    </section>
  );
}