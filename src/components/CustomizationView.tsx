"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AIGeneratedProduct,
  CustomizationSelection,
} from "@/lib/types/product";
import { MaterialSelector } from "@/components/MaterialSelector";
import { StoneSelector } from "@/components/StoneSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { customizeProduct } from "@/lib/services/customizationService";
import { useProductContext } from "@/lib/context/ProductContext";

interface CustomizationViewProps {
  product: AIGeneratedProduct;
  onBack: () => void;
  onCustomize?: (selection: CustomizationSelection) => void;
}

const mockOptions = {
  materials: [
    { id: "gold-10k", name: "Vàng 10K", karat: 10 },
    { id: "gold-14k", name: "Vàng 14K", karat: 14 },
    { id: "gold-18k", name: "Vàng 18K", karat: 18 },
    { id: "gold-22k", name: "Vàng 22K", karat: 22 },
  ],
  stones: [
    { id: "diamond-6ly3", name: "Kim cương 6 ly 3", type: "diamond" },
    { id: "sapphire", name: "Sapphire", type: "sapphire" },
    { id: "ruby", name: "Ruby", type: "ruby" },
  ],
  colors: [
    { id: "white-gold", name: "Vàng trắng" },
    { id: "rose-gold", name: "Vàng hồng" },
    { id: "yellow-gold", name: "Vàng vàng" },
  ],
};

export function CustomizationView({
  product,
  onBack,
  onCustomize,
}: CustomizationViewProps) {
  const { selectedCustomization, setSelectedCustomization } =
    useProductContext();
  const [currentImage, setCurrentImage] = useState<string>(
    product.regeneratedImage || product.imageUrl
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async () => {
    if (!selectedCustomization) return;

    setIsRegenerating(true);
    setError(null);
    try {
      const response = await customizeProduct(
        product.id,
        selectedCustomization
      );
      if (response.success) {
        setCurrentImage(response.imageUrl);
        // Call onCustomize callback if provided
        onCustomize?.(selectedCustomization);
      }
    } catch (error) {
      console.error("Customization failed:", error);
      setError("Không thể tạo ảnh mới. Vui lòng thử lại.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const updateSelection = (
    key: keyof CustomizationSelection,
    value: string
  ) => {
    if (selectedCustomization) {
      setSelectedCustomization({ ...selectedCustomization, [key]: value });
    } else {
      // Initialize with default values if not set
      setSelectedCustomization({
        material: key === "material" ? value : mockOptions.materials[0].id,
        stone: key === "stone" ? value : mockOptions.stones[0].id,
        color: key === "color" ? value : mockOptions.colors[0].id,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Tùy chỉnh sản phẩm
        </h2>
        <Button onClick={onBack} variant="outline">
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-white border">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h3>
            <p className="text-gray-600">{product.aiDescription}</p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          <MaterialSelector
            options={mockOptions.materials}
            selected={
              selectedCustomization?.material || mockOptions.materials[0].id
            }
            onChange={(id) => updateSelection("material", id)}
          />

          <StoneSelector
            options={mockOptions.stones}
            selected={selectedCustomization?.stone || mockOptions.stones[0].id}
            onChange={(id) => updateSelection("stone", id)}
          />

          <ColorSelector
            options={mockOptions.colors}
            selected={selectedCustomization?.color || mockOptions.colors[0].id}
            onChange={(id) => updateSelection("color", id)}
          />

          <div className="space-y-3">
            <Button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegenerating ? "Đang tạo..." : "Tạo lại ảnh"}
            </Button>

            <Button
              onClick={() => (window.location.href = `/preorder/${product.id}`)}
              variant="outline"
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 py-3 px-4 rounded-lg font-medium"
            >
              Đặt trước sản phẩm
            </Button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
