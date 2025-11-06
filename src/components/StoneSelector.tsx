"use client";

import { CustomizationOptions } from "@/lib/types/product";

interface StoneSelectorProps {
  options: CustomizationOptions["stones"];
  selected: string;
  onChange: (id: string) => void;
}

export function StoneSelector({
  options,
  selected,
  onChange,
}: StoneSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Đá chính</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((stone) => (
          <button
            key={stone.id}
            onClick={() => onChange(stone.id)}
            className={`p-3 border rounded-lg text-sm transition-colors ${
              selected === stone.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {stone.name}
          </button>
        ))}
      </div>
    </div>
  );
}
