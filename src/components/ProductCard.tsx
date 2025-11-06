import { Product } from "@/lib/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      className="w-64 h-80 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden"
      onClick={onClick}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
          <Image
            src={product.image}
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
                      <div class="text-2xl mb-1">💎</div>
                      ${product.category}
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

          <p className="text-xs text-white/70 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/20 text-white border border-white/30 rounded px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <p className="text-lg font-bold text-yellow-300">
              ${product.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
