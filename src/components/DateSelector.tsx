"use client";

import { useState, useEffect } from "react";

interface DayOption {
  fullDate: string;  // Ex: 2026-05-24 (para enviar para a API)
  dayName: string;   // Ex: Segunda
  shortDate: string; // Ex: 24/5
}

export default function DateSelector({ 
  onDateSelect 
}: { 
  onDateSelect: (date: string) => void 
}) {
  const [days, setDays] = useState<DayOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const next6Days: DayOption[] = [];
    const currentDate = new Date();
    
    const dayNames = ["Dom", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    while (next6Days.length < 6) {
      // 0 é Domingo. Se NÃO for Domingo, adiciona à lista
      if (currentDate.getDay() !== 0) {
        next6Days.push({
          fullDate: currentDate.toISOString().split('T')[0],
          dayName: dayNames[currentDate.getDay()],
          shortDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`
        });
      }
      // Avança um dia no calendário
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setDays(next6Days);
  }, []);

  const handleSelect = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date); // Envia o valor escolhido para o formulário principal
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-300 mb-3">
        Data da Reserva
      </label>
      {/* O grid-cols-3 cria exatamente as 2 linhas de 3 botões */}
      <div className="grid grid-cols-3 gap-3">
        {days.map((day) => {
          const isSelected = selectedDate === day.fullDate;
          
          return (
            <button
              key={day.fullDate}
              type="button" // Essencial para não fazer submit acidental do form
              onClick={() => handleSelect(day.fullDate)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 ${
                isSelected 
                  ? "bg-[#B33A2F] border-[#D14437] text-white shadow-lg shadow-[#B33A2F]/20" 
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-[#B33A2F]/50 hover:text-[#D14437]"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider mb-1">
                {day.dayName}
              </span>
              <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-neutral-200"}`}>
                {day.shortDate}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
