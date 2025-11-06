"use client";

import { CustomizationOptions } from "@/lib/types/product";

interface ColorSelectorProps {
  options: CustomizationOptions["colors"];
  selected: string;
  onChange: (id: string) => void;
}

export function ColorSelector({
  options,
  selected,
  onChange,
}: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Màu chất liệu</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((color) => (
          <button
            key={color.id}
            onClick={() => onChange(color.id)}
            className={`p-3 border rounded-lg text-sm transition-colors ${
              selected === color.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
