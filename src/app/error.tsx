'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro capturado em runtime:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao carregar o restaurante</h2>
      <p className="text-neutral-400 mb-6 text-center max-w-md">
        {error.message || 'Ocorreu um erro inesperado ao ligar aos dados do servidor.'}
      </p>
      <button
        onClick={() => reset()}
        className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        Tentar novamente
      </button>
    </div>
  );
}
