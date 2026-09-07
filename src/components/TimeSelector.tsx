"use client";

import { useState, useMemo } from "react";

const isTimePassed = (timeStr: string, selectedDate: string | null) => {
  if (!selectedDate) return false;

  const now = new Date();
  const [year, month, day] = selectedDate.split("-").map(Number);
  const isToday =
    day === now.getDate() &&
    month - 1 === now.getMonth() &&
    year === now.getFullYear();

  if (!isToday) return false;

  const [hours, minutes] = timeStr.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);

  return slotTime <= now;
};

export default function TimeSelector({
  selectedDate,
  onTimeSelect,
}: {
  selectedDate: string | null;
  onTimeSelect: (time: string) => void;
}) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = useMemo(() => {
    const slots = [];
    for (let h = 12; h <= 22; h++) {
      slots.push(`${h}:00`);
      if (h !== 22) {
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
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {times.map((time) => {
          const isSelected = selectedTime === time;
          const isPassed = isTimePassed(time, selectedDate);

          return (
            <button
              key={time}
              type="button"
              disabled={isPassed}
              onClick={() => handleSelect(time)}
              className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all duration-200 ${
                isPassed
                  ? "opacity-50 line-through text-red-600 bg-red-50 cursor-not-allowed border-red-200 hover:bg-red-50 hover:border-red-200"
                  : isSelected
                  ? "bg-[#8F2E25] text-white border-[#8F2E25]"
                  : "text-[#141210] border-neutral-300 hover:border-[#8F2E25]"
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
