import { AIGeneratedProduct } from "@/lib/types/product";
import Image from "next/image";

interface AIGeneratedProductCardProps {
  product: AIGeneratedProduct;
  onClick?: () => void;
}

export function AIGeneratedProductCard({
  product,
  onClick,
}: AIGeneratedProductCardProps) {
  const imageSrc = product.imageUrl || product.image;

  return (
    <div
      className="w-64 h-80 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-purple-500/10 to-blue-500/5 backdrop-blur-sm border border-purple-400/30 rounded-lg overflow-hidden relative"
      onClick={onClick}
    >
      {/* AI Generated Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full font-medium">
          AI Generated
        </span>
      </div>

      <div className="p-4 h-full flex flex-col">
        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400/20 to-blue-600/20 flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback for missing images - hide the image and show text
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full text-white/70 text-sm font-medium">
                    <div class="text-center">
                      <div class="text-2xl mb-1">🤖</div>
                      AI Design
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-sm text-white mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-white/70 mb-2 line-clamp-2">
            {product.aiDescription}
          </p>

          <p className="text-xs text-white/70 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <p className="text-sm text-purple-300 font-medium">Custom Design</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/customize/${product.id}`;
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3 rounded transition-colors"
            >
              Tùy chỉnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
