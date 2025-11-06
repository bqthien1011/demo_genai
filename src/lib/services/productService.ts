import { Product, UserPreferences } from "../types/product";
import { mockProducts, searchProducts } from "../data/products";

export interface ProductSearchRequest {
  query?: string;
  preferences: UserPreferences;
  limit?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export class ProductService {
  private static instance: ProductService;
  private isMockMode = true; // Toggle this when real API is ready

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async searchProducts(
    request: ProductSearchRequest
  ): Promise<ProductSearchResponse> {
    if (this.isMockMode) {
      return this.mockSearchProducts(request);
    }
    // TODO: Implement real API call
    // return this.realSearchProducts(request);
    return this.mockSearchProducts(request);
  }

  private mockSearchProducts(
    request: ProductSearchRequest
  ): ProductSearchResponse {
    let filteredProducts = [...mockProducts];

    // Filter by query if provided
    if (request.query) {
      filteredProducts = searchProducts(request.query);
    }

    // Filter by preferences
    const { preferences } = request;
    if (preferences.material) {
      filteredProducts = filteredProducts.filter((p) =>
        p.material?.toLowerCase().includes(preferences.material!.toLowerCase())
      );
    }

    if (preferences.category) {
      filteredProducts = filteredProducts.filter((p) =>
        p.category?.toLowerCase().includes(preferences.category!.toLowerCase())
      );
    }

    if (preferences.style) {
      filteredProducts = filteredProducts.filter((p) =>
        p.style?.toLowerCase().includes(preferences.style!.toLowerCase())
      );
    }

    if (preferences.occasion) {
      filteredProducts = filteredProducts.filter((p) =>
        p.occasion?.toLowerCase().includes(preferences.occasion!.toLowerCase())
      );
    }

    if (preferences.gemstones && preferences.gemstones.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
        p.gemstones?.some((gem) =>
          preferences.gemstones!.some((prefGem) =>
            gem.toLowerCase().includes(prefGem.toLowerCase())
          )
        )
      );
    }

    if (preferences.budget) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= preferences.budget!
      );
    }

    // Apply limit
    const limit = request.limit || 10;
    const limitedProducts = filteredProducts.slice(0, limit);

    return {
      products: limitedProducts,
      total: filteredProducts.length,
      hasMore: filteredProducts.length > limit,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    if (this.isMockMode) {
      return mockProducts;
    }
    // TODO: Implement real API call
    return mockProducts;
  }

  async getProductById(id: string): Promise<Product | null> {
    if (this.isMockMode) {
      return mockProducts.find((p) => p.id === id) || null;
    }
    // TODO: Implement real API call
    return mockProducts.find((p) => p.id === id) || null;
  }

  // Method to switch to real API when ready
  setMockMode(enabled: boolean) {
    this.isMockMode = enabled;
  }
}

// Export singleton instance
export const productService = ProductService.getInstance();
