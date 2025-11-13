import { CustomizationSelection } from "../types/product";

export interface CustomizationResponse {
  success: boolean;
  imageUrl: string;
}

export async function customizeProduct(
  productId: string,
  selection: CustomizationSelection
): Promise<CustomizationResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response - in real implementation, this would call AI API
  const mockImageUrl = `https://cdn.pnj.io/images/detailed/244/sp-gnddddx000401-nhan-kim-cuong-vang-14k-disney-pnj-beauty-the-beast-1.png`;

  return {
    success: true,
    imageUrl: mockImageUrl,
  };
}
