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

  // Return different images based on selected stone
  let mockImageUrl: string;

  if (selection.stone === "ruby") {
    mockImageUrl = "/Gemini_Generated_Image_r6p3hcr6p3hcr6p3.png";
  } else if (selection.stone === "diamond-6ly3") {
    mockImageUrl = "/Gemini_Generated_Image_7uj7ao7uj7ao7uj7.png";
  } else {
    // Default fallback
    mockImageUrl = `https://cdn.pnj.io/images/detailed/244/sp-gnddddx000401-nhan-kim-cuong-vang-14k-disney-pnj-beauty-the-beast-1.png`;
  }

  return {
    success: true,
    imageUrl: mockImageUrl,
  };
}
