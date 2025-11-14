"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  Product,
  AIGeneratedProduct,
  CustomizationOptions,
  CustomizationSelection,
} from "../types/product";

import { aiProducts as aiProductsExample } from "../data/aiProducts";

interface ChatbotState {
  isVisible: boolean;
  isCollapsed: boolean;
  message: string;
  language: "vi" | "en";
}

interface ProductContextType {
  suggestedProducts: Product[];
  setSuggestedProducts: (products: Product[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  chatbot: ChatbotState;
  showChatbot: () => void;
  hideChatbot: () => void;
  collapseChatbot: () => void;
  expandChatbot: () => void;
  isAIMode: boolean;
  setAIMode: (mode: boolean) => void;
  aiProducts: AIGeneratedProduct[];
  setAIProducts: (products: AIGeneratedProduct[]) => void;
  customizationOptions: CustomizationOptions | null;
  setCustomizationOptions: (options: CustomizationOptions | null) => void;
  selectedCustomization: CustomizationSelection | null;
  setSelectedCustomization: (selection: CustomizationSelection | null) => void;
  customizedImages: Map<string, string>;
  setCustomizedImage: (productId: string, imageUrl: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIMode, setAIMode] = useState(false);
  const [aiProducts, setAIProducts] =
    useState<AIGeneratedProduct[]>(aiProductsExample);
  const [customizationOptions, setCustomizationOptions] =
    useState<CustomizationOptions | null>(null);
  const [selectedCustomization, setSelectedCustomization] =
    useState<CustomizationSelection | null>(null);
  const [customizedImages, setCustomizedImages] = useState<Map<string, string>>(
    new Map()
  );

  const setCustomizedImage = useCallback(
    (productId: string, imageUrl: string) => {
      setCustomizedImages((prev) => new Map(prev.set(productId, imageUrl)));
    },
    []
  );
  const [chatbot, setChatbot] = useState<ChatbotState>({
    isVisible: false,
    isCollapsed: false,
    message:
      "Nếu chưa tìm thấy sản phẩm phù hợp, bạn có thể để Gen AI tạo mẫu riêng cho bạn!",
    language: "vi",
  });

  const showChatbot = () => {
    setChatbot((prev) => ({ ...prev, isVisible: true, isCollapsed: false }));
  };

  const hideChatbot = () => {
    setChatbot((prev) => ({ ...prev, isVisible: false, isCollapsed: false }));
  };

  const collapseChatbot = () => {
    setChatbot((prev) => ({ ...prev, isCollapsed: true }));
  };

  const expandChatbot = () => {
    setChatbot((prev) => ({ ...prev, isCollapsed: false }));
  };

  return (
    <ProductContext.Provider
      value={{
        suggestedProducts,
        setSuggestedProducts,
        isLoading,
        setIsLoading,
        chatbot,
        showChatbot,
        hideChatbot,
        collapseChatbot,
        expandChatbot,
        isAIMode,
        setAIMode,
        aiProducts,
        setAIProducts,
        customizationOptions,
        setCustomizationOptions,
        selectedCustomization,
        setSelectedCustomization,
        customizedImages,
        setCustomizedImage,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}
