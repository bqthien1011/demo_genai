"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AIGeneratedProduct } from "@/lib/types/product";

interface TryOnSectionProps {
  product: AIGeneratedProduct;
  currentImage: string;
}

interface TryOnResult {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export function TryOnSection({ product, currentImage }: TryOnSectionProps) {
  const [handImage, setHandImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const convertImageUrlToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error("Error converting image URL to base64:", error);
      throw error;
    }
  };

  const callTryOnAPI = useCallback(
    async (handBase64: string, productImage: string): Promise<TryOnResult> => {
      try {
        // Convert product image to base64 if it's a URL
        let productBase64 = productImage;
        if (productImage.startsWith("http") || productImage.startsWith("/")) {
          productBase64 = await convertImageUrlToBase64(productImage);
        }

        const payload = {
          modelBase64: handBase64.split(",")[1], // Ảnh bàn tay người dùng upload (model)
          modelMime: "image/png",
          clothingBase64: productBase64.split(",")[1], // Ảnh sản phẩm tùy chỉnh (clothing)
          clothingMime: "image/png",
          dropPosition: {
            x: 250,
            y: 180,
          },
          skinTonePrompt: "sáng màu",
          cropSize: 512,
          model: "gemini-2.5-flash-image",
        };

        const response = await fetch(
          `${
            process.env.TRY_ON_API_BASE_URL || "http://localhost:3001"
          }/api/gemini/virtual-try-on`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.dataUrl) {
          return {
            imageUrl: data.dataUrl,
            success: true,
          };
        } else {
          return {
            imageUrl: "",
            success: false,
            error: "API did not return image data",
          };
        }
      } catch (error) {
        console.error("Try on API error:", error);
        return {
          imageUrl: "",
          success: false,
          error: error instanceof Error ? error.message : "Network error",
        };
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File ảnh không được vượt quá 5MB");
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setHandImage(base64);
        setTryOnResult(null); // Reset previous result
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Có lỗi khi xử lý ảnh. Vui lòng thử lại.");
      }
    },
    []
  );

  const handleTryOn = useCallback(async () => {
    if (!handImage || !currentImage) return;

    setIsProcessing(true);
    setTryOnResult(null);

    try {
      const result = await callTryOnAPI(handImage, currentImage);
      setTryOnResult(result);
    } catch (error) {
      console.error("Try on processing error:", error);
      setTryOnResult({
        imageUrl: "",
        success: false,
        error: "Có lỗi khi xử lý. Vui lòng thử lại.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [handImage, currentImage, callTryOnAPI]);

  // Reset try on result when product image changes
  useEffect(() => {
    setTryOnResult(null);
  }, [currentImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setHandImage(null);
    setTryOnResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🤏</span>
        Thử sản phẩm trên tay
      </h3>

      <div className="space-y-4">
        {/* Upload Hand Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh bàn tay của bạn
          </label>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleUploadClick}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Chọn ảnh bàn tay</span>
            </Button>
            {handImage && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Xóa
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">
            Chọn ảnh bàn tay rõ ràng, nền đơn giản để kết quả tốt nhất
          </p>
        </div>

        {/* Hand Image Preview */}
        {handImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh bàn tay đã chọn
            </label>
            <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={handImage}
                alt="Hand preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Try On Button */}
        {handImage && (
          <div className="flex justify-center">
            <Button
              onClick={handleTryOn}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Thử sản phẩm"
              )}
            </Button>
          </div>
        )}

        {/* Try On Result */}
        {tryOnResult && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kết quả thử sản phẩm
            </label>
            {tryOnResult.success ? (
              <div className="relative w-full max-w-sm mx-auto h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={tryOnResult.imageUrl}
                  alt="Try on result"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {tryOnResult.error || "Có lỗi xảy ra. Vui lòng thử lại."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
