import { Product, AIGeneratedProduct } from "@/lib/types/product";
import { ProductCard } from "./ProductCard";
import { AIGeneratedProductCard } from "./AIGeneratedProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useProductContext } from "@/lib/context/ProductContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductSuggestionCarouselProps {
  products: Product[];
  onProductClick?: (product: Product | AIGeneratedProduct) => void;
}

export function ProductSuggestionCarousel({
  products,
  onProductClick,
}: ProductSuggestionCarouselProps) {
  const { showChatbot, isAIMode, aiProducts, setAIMode } = useProductContext();
  const [api, setApi] = useState<CarouselApi>();
  const [hasTriggeredChatbot, setHasTriggeredChatbot] = useState(false);

  const displayProducts = isAIMode ? aiProducts : products;
  const isAI = isAIMode;

  useEffect(() => {
    if (!api) return;

    const onScroll = () => {
      if (hasTriggeredChatbot) return;

      const currentIndex = api.selectedScrollSnap();
      const totalSlides = api.slideNodes().length;

      // Check if we're at the last slide (end of carousel)
      if (currentIndex >= totalSlides - 1) {
        showChatbot();
        setHasTriggeredChatbot(true);
      }
    };

    api.on("select", onScroll);

    return () => {
      api.off("select", onScroll);
    };
  }, [api, showChatbot, hasTriggeredChatbot]);

  // Reset chatbot trigger when products change
  useEffect(() => {
    setHasTriggeredChatbot(false);
  }, [displayProducts.length]); // Only reset when products array length changes

  const handleRevert = () => {
    setAIMode(false);
  };

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        {isAI
          ? "No AI-generated samples available."
          : "No products found matching your preferences."}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {isAI ? "AI Generated Samples" : "Suggested Products"} (
            {displayProducts.length})
          </h3>
          <p className="text-sm text-white/70">
            {isAI
              ? "Custom designs created based on your description"
              : "Based on your preferences, here are some recommendations"}
          </p>
        </div>
        {isAI && (
          <Button
            onClick={handleRevert}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Back to Regular Suggestions
          </Button>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {displayProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              {isAI ? (
                <AIGeneratedProductCard
                  product={product as AIGeneratedProduct}
                  onClick={() => onProductClick?.(product)}
                />
              ) : (
                <ProductCard
                  product={product}
                  onClick={() => onProductClick?.(product)}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  );
}
