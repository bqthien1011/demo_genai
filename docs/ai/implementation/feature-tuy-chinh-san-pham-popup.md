---
title: "Feature Implementation Template"
feature: "tuy-chinh-san-pham-popup"
status: "draft"
---

# Implementation Notes

## Components Created

- `CustomizationView.tsx` - New component for inline product customization
  - Uses ProductContext for state management
  - Integrates MaterialSelector, StoneSelector, ColorSelector
  - Handles API calls to customizeProduct service
  - Responsive design with Tailwind CSS

## Components Modified

- `ProductList.tsx` - Added conditional rendering logic and pre-order button
  - Added `customizationMode` and `selectedProduct` state
  - Modified "Tùy chỉnh" button to trigger inline customization
  - Added "Đặt trước sản phẩm" button with navigation to `/preorder/[productId]`
  - Added conditional rendering: carousel vs customization view
  - Integrated with ProductContext for customization state

## Key Implementation Details

### State Management

- Used existing ProductContext (`selectedCustomization`, `setSelectedCustomization`)
- Local component state for UI-specific concerns (`customizationMode`, `selectedProduct`)
- Proper initialization of customization selections when entering customization mode

### User Experience

- Seamless transition from product list to customization view
- Chat context preserved throughout the interaction
- Back navigation returns to product list without losing selections
- Real-time preview updates (via API calls)

### Technical Decisions

- Inline replacement instead of modal for better UX continuity
- Context-based state management for consistency across components
- Reused existing selector components and API services
- Responsive design using Tailwind CSS grid system

# Code Structure

```
src/components/
├── CustomizationView.tsx (new)
│   ├── Props: product, onBack, onCustomize
│   ├── State: currentImage, isRegenerating, error
│   ├── Selectors: Material, Stone, Color
│   └── Actions: Regenerate, Back
└── ProductList.tsx (modified)
    ├── State: customizationMode, selectedProduct
    ├── Conditional rendering: carousel | customization view
    └── Event handlers: handleCustomize, handleBackFromCustomization
```

# Error Handling

- API call failures display user-friendly error messages
- Loading states during image regeneration
- Graceful fallbacks for missing product data
- TypeScript strict mode for compile-time error prevention

# Edge Cases

- Handles products without `imageUrl` by falling back to `image`
- Initializes customization selections if not previously set
- Maintains selections when navigating back and forth
- Works with both AI-generated and static products
