export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  tags: string[]; // e.g., ['gold', 'necklace', 'wedding']
  category: string;
  material?: string;
  style?: string;
  occasion?: string;
  gemstones?: string[];
  isAIGenerated?: boolean;
  aiDescription?: string; // user's idea description
  imageUrl?: string; // for AI images, use static paths
}

export interface CustomizationOptions {
  materials: { id: string; name: string; karat?: number }[]; // e.g., { id: 'gold-14k', name: 'Vàng 14K', karat: 14 }
  stones: { id: string; name: string; type: string }[]; // e.g., { id: 'diamond-6ly3', name: 'Kim cương 6 ly 3', type: 'diamond' }
  colors: { id: string; name: string }[]; // e.g., { id: 'white-gold', name: 'Vàng trắng' }
}

export interface CustomizationSelection {
  material: string; // id
  stone: string; // id
  color: string; // id
}

export interface AIGeneratedProduct extends Product {
  isAIGenerated: true;
  aiDescription: string;
  imageUrl: string;
  customizationOptions?: CustomizationOptions;
  selectedCustomization?: CustomizationSelection;
  regeneratedImage?: string; // URL after customization
}

export interface UserPreferences {
  style?: string;
  material?: string;
  budget?: number;
  occasion?: string;
  gemstones?: string[];
  size?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[]; // For AI responses with product suggestions
}
