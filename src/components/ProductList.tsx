"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useProductContext } from "@/lib/context/ProductContext";

interface StaticProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  sold?: number;
}

const staticProducts: StaticProduct[] = [
  {
    id: "1",
    name: "Bộ trang sức Kim cương Vàng 14K PNJ 00001-00001",
    image:
      "https://cdn.pnj.io/images/thumbnails/485/485/detailed/269/sp-gndd00w006244-nhan-kim-cuong-vang-trang-14k-pnj-my-first-diamond-1.png",
    price: 2290574000,
    sold: 2,
  },
  {
    id: "2",
    name: "Lắc tay Kim cương Vàng 14K PNJ Masterpiece DDMXH000001",
    image:
      "https://cdn.pnj.io/images/thumbnails/485/485/detailed/269/sp-gndd00w006244-nhan-kim-cuong-vang-trang-14k-pnj-my-first-diamond-1.png",
    price: 661657000,
    sold: 2,
  },
  {
    id: "3",
    name: "Bông tai Kim cương Vàng 14K PNJ Masterpiece DDMXH000001",
    image:
      "https://cdn.pnj.io/images/thumbnails/485/485/detailed/269/sp-gndd00w006244-nhan-kim-cuong-vang-trang-14k-pnj-my-first-diamond-1.png",
    price: 135400000,
    sold: 1,
  },
  {
    id: "4",
    name: "Dây cổ Kim cương Vàng 14K PNJ Masterpiece DDMXH000001",
    image:
      "https://cdn.pnj.io/images/thumbnails/485/485/detailed/269/sp-gndd00w006244-nhan-kim-cuong-vang-trang-14k-pnj-my-first-diamond-1.png",
    price: 1151742000,
    sold: 1,
  },
];

export default function ProductList() {
  const {
    suggestedProducts,
    isLoading,
    showChatbot,
    isAIMode,
    aiProducts,
    setAIMode,
  } = useProductContext();
  const [api, setApi] = useState<CarouselApi>();
  const [hasTriggeredChatbot, setHasTriggeredChatbot] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use AI products if in AI mode, otherwise suggested products, otherwise static products
  const displayProducts = isAIMode
    ? aiProducts
    : suggestedProducts.length > 0
    ? suggestedProducts
    : staticProducts;
  const isSuggestedMode = suggestedProducts.length > 0;
  const handleRevert = () => {
    setAIMode(false);
  };

  const handleImageClick = (productId: string) => {
    const index = displayProducts.findIndex((p) => p.id === productId);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      if (!api.canScrollNext() && !hasTriggeredChatbot) {
        setTimeout(() => {
          showChatbot();
          setHasTriggeredChatbot(true);
        }, 3500); // Delay 3.5s to match original behavior
      }
    };

    api.on("select", onSelect);
  }, [api, showChatbot, hasTriggeredChatbot]);

  // Reset chatbot trigger when products change
  useEffect(() => {
    setHasTriggeredChatbot(false);
  }, [suggestedProducts.length]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">
        {isAIMode
          ? "Mẫu sản phẩm do AI tạo"
          : isSuggestedMode
          ? "Sản phẩm được gợi ý"
          : "Sản phẩm xem gần đây"}
      </h2>
      {isAIMode && (
        <div className="mb-4">
          <Button onClick={handleRevert} variant="outline">
            Quay lại sản phẩm có sẵn
          </Button>
        </div>
      )}
      {!isAIMode && aiProducts.length > 0 && (
        <div className="mb-4">
          <Button
            onClick={() => setAIMode(true)}
            variant="outline"
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Xem lại sản phẩm AI tạo
          </Button>
        </div>
      )}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tìm sản phẩm phù hợp...</p>
        </div>
      )}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {displayProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                {"isAIGenerated" in product && product.isAIGenerated ? (
                  // AI Generated Product Card
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/5 backdrop-blur-sm border border-purple-400/30 rounded-2xl shadow flex flex-col items-center px-6 py-8 min-w-[240px] max-w-[300px] flex-1 transition hover:shadow-lg relative">
                    <div className="absolute top-2 right-2 z-10">
                      <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full font-medium">
                        AI Generated
                      </span>
                    </div>
                    <div
                      className="relative w-40 h-40 mb-4 flex items-center justify-center cursor-pointer"
                      onClick={() => handleImageClick(product.id)}
                    >
                      <Image
                        src={(product as any).imageUrl || product.image}
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
                      <p className="text-sm text-gray-600 mb-2">
                        Mẫu thiết kế theo ý tưởng của bạn
                      </p>
                      <div className="space-y-2">
                        <Button
                          onClick={() =>
                            (window.location.href = `/customize/${product.id}`)
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Tùy chỉnh
                        </Button>
                        <p className="text-xs text-gray-500">
                          Thay đổi chất liệu, đá, màu sắc
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular Product Card
                  <div className="bg-[#fafafa] rounded-2xl shadow border flex flex-col items-center px-6 py-8 min-w-[240px] max-w-[300px] flex-1 transition hover:shadow-lg">
                    <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
                      <Image
                        src={product.image}
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
                      <h3 className="font-medium text-base mb-2 text-gray-800 leading-tight">
                        {product.name}
                      </h3>
                      <div className="text-xl font-bold text-[#b97a2b] mb-1">
                        {(product as any).price?.toLocaleString("vi-VN")} đ
                      </div>
                      {"sold" in product && (product as any).sold && (
                        <div className="text-sm text-gray-500">
                          {(product as any).sold} đã bán
                        </div>
                      )}
                      <Button className="mt-4">Thêm vào giỏ hàng</Button>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">
            AI Generated Jewelry Design
          </DialogTitle>
          <div className="relative">
            <Image
              src={
                (displayProducts[currentImageIndex] as any).imageUrl ||
                displayProducts[currentImageIndex].image
              }
              alt="AI Generated Design"
              width={800}
              height={600}
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            {displayProducts.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (currentImageIndex - 1 + displayProducts.length) %
                        displayProducts.length
                    )
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (currentImageIndex + 1) % displayProducts.length
                    )
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
