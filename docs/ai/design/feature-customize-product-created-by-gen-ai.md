---
title: "Feature Design Template"
feature: "customize-product-created-by-gen-ai"
status: "implemented"
---

# System Architecture

The customization feature will be implemented as a new page/route in the Next.js app, accessible via a button or link from AI-generated product cards. It will use the existing ProductContext to manage customization state and integrate with the chat flow. The architecture remains client-side with mock data; future API integration will replace mocks with real calls.

Key components:

- New route: `/customize/[productId]` for the customization page.
- State management: Extend ProductContext with customization options and selected values.
- Mock service: A new service for simulating image regeneration.

# Data Models

Extend existing types in `lib/types/product.ts`:

```typescript
interface CustomizationOptions {
  materials: { id: string; name: string; karat?: number }[]; // e.g., { id: 'gold-14k', name: 'Vàng 14K', karat: 14 }
  stones: { id: string; name: string; type: string }[]; // e.g., { id: 'diamond-6ly3', name: 'Kim cương 6 ly 3', type: 'diamond' }
  colors: { id: string; name: string }[]; // e.g., { id: 'white-gold', name: 'Vàng trắng' }
}

interface CustomizationSelection {
  material: string; // id
  stone: string; // id
  color: string; // id
}

interface AIGeneratedProduct {
  // existing fields
  customizationOptions?: CustomizationOptions;
  selectedCustomization?: CustomizationSelection;
  regeneratedImage?: string; // URL after customization
}
```

# API Endpoints

Mock endpoint (to be replaced with real AI API):

- `POST /api/customize-product`: Accepts productId, customization selection, returns new image URL.
- Response: `{ success: true, imageUrl: 'mock-url' }`

Future real API: Integrate with external AI service for image generation based on parameters.

# Components

New components:

- `CustomizationPage`: Main page component with image display and selectors.
- `MaterialSelector`: Dropdown or buttons for material selection.
- `StoneSelector`: Selector for main stone.
- `ColorSelector`: Selector for material color.
- `RegenerateButton`: Submits customization and shows loading state.

Modify existing:

- `AIGeneratedProductCard`: Add "Customize" button linking to customization page.

# Design Decisions

- **UI Approach**: Full page instead of modal for better space to display image and options.
- **State Management**: Use ProductContext to store customization state, allowing persistence across navigation.
- **Mock Data**: Use static images or variations for regeneration simulation.
- **Validation**: Client-side validation for required selections.
- **Accessibility**: Ensure selectors are keyboard navigable and screen-reader friendly.

# Security Considerations

- Client-side only; no sensitive data handling.
- Image URLs should be validated to prevent XSS (though mocked).
- Future API calls should include authentication if needed.

# Performance Considerations

- Mock regeneration: Simulate delay (1-2s) to mimic real API.
- Image loading: Use Next.js Image for optimization.
- Minimal impact on existing pages; lazy load customization components.
