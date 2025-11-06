"use client";

import { CustomizationOptions } from "@/lib/types/product";

interface MaterialSelectorProps {
  options: CustomizationOptions["materials"];
  selected: string;
  onChange: (id: string) => void;
}

export function MaterialSelector({
  options,
  selected,
  onChange,
}: MaterialSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Chất liệu nhẫn</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((material) => (
          <button
            key={material.id}
            onClick={() => onChange(material.id)}
            className={`p-3 border rounded-lg text-sm transition-colors ${
              selected === material.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {material.name}
            {material.karat && ` (${material.karat}K)`}
          </button>
        ))}
      </div>
    </div>
  );
}
