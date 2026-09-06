"use client";

import { useState, useMemo } from "react";

export default function TimeSelector({ 
  onTimeSelect 
}: { 
  onTimeSelect: (time: string) => void 
}) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Gera as horas das 12:00 às 22:00 (intervalos de 30 minutos)
  const times = useMemo(() => {
    const slots = [];
    for (let h = 12; h <= 22; h++) {
      slots.push(`${h}:00`);
      if (h !== 22) { // Não queremos 22:30 se o limite é 22:00
        slots.push(`${h}:30`);
      }
    }
    return slots;
  }, []);

  const handleSelect = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  return (
    <div className="w-full mt-6">
      <label className="block text-sm font-medium text-neutral-300 mb-3">
        Hora da Reserva
      </label>
      {/* grid-cols-4 no mobile para caberem bem e ficarem organizados */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {times.map((time) => {
          const isSelected = selectedTime === time;
          
          return (
            <button
              key={time}
              type="button"
              onClick={() => handleSelect(time)}
              className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all duration-200 ${
                isSelected 
                  ? "bg-[#B33A2F] border-[#D14437] text-white shadow-md shadow-[#B33A2F]/20" 
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-[#B33A2F]/50 hover:text-[#D14437]"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
