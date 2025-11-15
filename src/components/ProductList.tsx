"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { CustomizationView } from "@/components/CustomizationView";
import { AIGeneratedProduct } from "@/lib/types/product";

interface StaticProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  sold?: number;
}

const staticProducts: StaticProduct[] = [
  {
    id: "GNXMXMW005914",
    name: "Nhẫn Vàng trắng 14K đính đá ECZ PNJ Audax Rosa XMXMW005914",
    image:
      "https://cdn.pnj.io/images/detailed/237/sp-gnxmxmw005914-nhan-vang-trang-14k-dinh-da-ecz-pnj-2.png",
    price: 8500000,
    sold: 5,
  },
  {
    id: "GNXMXMW005913",
    name: "Nhẫn Vàng trắng 14K đính đá ECZ PNJ Audax Rosa XMXMW005913",
    image:
      "https://cdn.pnj.io/images/detailed/238/sp-gnxmxmw005913-nhan-vang-trang-14k-dinh-da-ecz-pnj-1.png",
    price: 8200000,
    sold: 3,
  },
  {
    id: "GNXMXMW005912",
    name: "Nhẫn Vàng trắng 14K đính đá ECZ PNJ Audax Rosa XMXMW005912",
    image:
      "https://cdn.pnj.io/images/detailed/237/sp-gnxmxmw005912-nhan-vang-trang-14k-dinh-da-ecz-pnj-1.png",
    price: 7800000,
    sold: 7,
  },
  {
    id: "GNTPXMW000794",
    name: "Nhẫn Vàng trắng 10K Đính đá Topaz PNJ TPXMW000794",
    image:
      "https://cdn.pnj.io/images/detailed/255/sp-gntpxmw000794-nhan-vang-10k-dinh-da-topaz-pnj-1.png",
    price: 6500000,
    sold: 4,
  },
  // {
  //   id: "GNSPXMW000561",
  //   name: "Nhẫn Vàng trắng 10K Đính đá Sapphire PNJ SPXMW000561",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/252/sp-gnspxmw000561-nhan-vang-10k-dinh-da-sapphire-pnj-1.png",
  //   price: 7200000,
  //   sold: 6,
  // },
  // {
  //   id: "GNSPXMW000560",
  //   name: "Nhẫn Vàng trắng 10K Đính đá Sapphire PNJ SPXMW000560",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/261/sp-gnspxmw000560-nhan-vang-10k-dinh-da-sapphire-pnj-1.png",
  //   price: 6800000,
  //   sold: 2,
  // },
  // {
  //   id: "GNGN00W000007",
  //   name: "Nhẫn Vàng trắng 10K Đính đá Garnat PNJ GN00W000007",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/252/sp-gngn00w000007-nhan-vang-10k-dinh-da-ganat-pnj-1.png",
  //   price: 5500000,
  //   sold: 8,
  // },
  // {
  //   id: "GNDDDDW013993",
  //   name: "Nhẫn Kim cương Vàng trắng 14K PNJ Audax Rosa DDDDW013993",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/238/sp-gnddddw013993-nhan-kim-cuong-vang-trang-14k-pnj-1.png",
  //   price: 18500000,
  //   sold: 1,
  // },
  // {
  //   id: "GNDDDDW013992",
  //   name: "Nhẫn Kim cương Vàng trắng 14K PNJ Audax Rosa DDDDW013992",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/238/sp-gnddddw013992-nhan-kim-cuong-vang-trang-14k-pnj-1.png",
  //   price: 17200000,
  //   sold: 3,
  // },
  // {
  //   id: "GNCTXMW000108",
  //   name: "Nhẫn Vàng trắng 10K Đính đá Citrine PNJ CTXMW000108",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/261/sp-gnctxmw000108-nhan-vang-10k-dinh-da-citrine-pnj-1.png",
  //   price: 5800000,
  //   sold: 4,
  // },
  // {
  //   id: "GNATXMW000084",
  //   name: "Nhẫn Vàng trắng 10K Đính đá Amethyst PNJ ATXMW000084",
  //   image:
  //     "https://cdn.pnj.io/images/detailed/252/sp-gnatxmw000084-nhan-vang-10k-dinh-da-amethyst-pnj-1.png",
  //   price: 6200000,
  //   sold: 5,
  // },
];

export default function ProductList({
  setIsCustomizing,
  setSelectedProduct,
  setChatBoxMinimized,
}: {
  setIsCustomizing: (value: boolean) => void;
  setSelectedProduct: (product: AIGeneratedProduct | null) => void;
  setChatBoxMinimized: (value: boolean) => void;
}) {
  const {
    suggestedProducts,
    isLoading,
    showChatbot,
    isAIMode,
    aiProducts,
    setAIMode,
    selectedCustomization,
    setSelectedCustomization,
  } = useProductContext();
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>();
  const [hasTriggeredChatbot, setHasTriggeredChatbot] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [selectedProduct, setLocalSelectedProduct] =
    useState<AIGeneratedProduct | null>(null);

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

  const handleCustomize = (product: AIGeneratedProduct) => {
    setLocalSelectedProduct(product);
    setSelectedProduct(product);
    setCustomizationMode(true);
    setIsCustomizing(true);
    setChatBoxMinimized(true);
    // Initialize customization selection if not already set
    if (!selectedCustomization) {
      setSelectedCustomization({
        material: "gold-14k", // Default values
        stone: "diamond-6ly3",
        color: "white-gold",
      });
    }
  };

  const handleBackFromCustomization = () => {
    setCustomizationMode(false);
    setLocalSelectedProduct(null);
    setSelectedProduct(null);
    setIsCustomizing(false);
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
      {customizationMode && selectedProduct ? (
        <CustomizationView
          product={selectedProduct}
          onBack={handleBackFromCustomization}
        />
      ) : (
        <>
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
                                handleCustomize(product as AIGeneratedProduct)
                              }
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Tùy chỉnh
                            </Button>
                            <Button
                              onClick={() =>
                                router.push(`/preorder/${product.id}`)
                              }
                              variant="outline"
                              className="border-purple-600 text-purple-600 hover:bg-purple-50"
                            >
                              Đặt trước sản phẩm
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
        </>
      )}
    </div>
  );
}
