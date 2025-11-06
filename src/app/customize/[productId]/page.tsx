"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useProductContext } from "@/lib/context/ProductContext";
import {
  AIGeneratedProduct,
  CustomizationSelection,
} from "@/lib/types/product";
import { MaterialSelector } from "@/components/MaterialSelector";
import { StoneSelector } from "@/components/StoneSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { customizeProduct } from "@/lib/services/customizationService";

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

export default function CustomizationPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { aiProducts, selectedCustomization, setSelectedCustomization } =
    useProductContext();
  const [product, setProduct] = useState<AIGeneratedProduct | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Available AI products:", aiProducts);
    console.log("Looking for product ID:", productId);
    const foundProduct = aiProducts.find((p) => p.id === productId);
    console.log("Found product:", foundProduct);
    if (foundProduct) {
      setProduct(foundProduct);
      setCurrentImage(foundProduct.regeneratedImage || foundProduct.imageUrl);
      // Initialize selections if not set
      if (!selectedCustomization) {
        setSelectedCustomization({
          material: mockOptions.materials[0].id,
          stone: mockOptions.stones[0].id,
          color: mockOptions.colors[0].id,
        });
      }
    }
  }, [productId, aiProducts, selectedCustomization, setSelectedCustomization]);

  const handleRegenerate = async () => {
    if (!selectedCustomization || !product) return;

    setIsRegenerating(true);
    setError(null);
    try {
      const response = await customizeProduct(
        product.id,
        selectedCustomization
      );
      if (response.success) {
        setCurrentImage(response.imageUrl);
        // Update product in context
        const updatedProduct = {
          ...product,
          regeneratedImage: response.imageUrl,
        };
        // Note: In real app, update aiProducts in context
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
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sản phẩm không tìm thấy
          </h1>
          <p className="text-gray-600 mb-4">
            Không thể tìm thấy sản phẩm với ID:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{productId}</code>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vui lòng quay lại trang chính và tạo sản phẩm AI trước khi tùy
            chỉnh.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Tùy chỉnh sản phẩm
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-white">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h2>
              <p className="text-gray-600">{product.aiDescription}</p>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            <MaterialSelector
              options={mockOptions.materials}
              selected={selectedCustomization?.material || ""}
              onChange={(id) => updateSelection("material", id)}
            />

            <StoneSelector
              options={mockOptions.stones}
              selected={selectedCustomization?.stone || ""}
              onChange={(id) => updateSelection("stone", id)}
            />

            <ColorSelector
              options={mockOptions.colors}
              selected={selectedCustomization?.color || ""}
              onChange={(id) => updateSelection("color", id)}
            />

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegenerating ? "Đang tạo..." : "Tạo lại ảnh"}
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
