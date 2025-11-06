---
title: "MVP - Find and suggest product Implementation"
feature: "mvp-find-and-suggest-product"
status: "draft"
---

# Code Changes

## New Files

- `src/lib/types/product.ts` - Product and UserPreferences interfaces
- `src/lib/data/products.ts` - Mock product data
- `src/lib/services/productService.ts` - Product filtering logic
- `src/components/ProductSuggestionCarousel.tsx` - Carousel component
- `src/components/ProductCard.tsx` - Individual product display

## Modified Files

- `src/components/ChatBox.tsx` - Add product suggestion logic
- `src/components/chat/MessageBubble.tsx` - Support carousel in messages
- `src/lib/utils.ts` - Add product-related utilities

## Key Implementation Details

- Use React state to track user preferences during conversation
- Extend AI response logic to include product suggestions
- Integrate carousel as a special message type
- Maintain chat theme consistency

# API Endpoints

## Mock API (Current)

- `GET /api/products` - Get all products (mock data)
- `POST /api/products/search` - Search products by preferences (mock filtering)

## Future Real API Contract

```typescript
// Product Search API
interface ProductSearchRequest {
  query?: string;
  preferences: UserPreferences;
  limit?: number;
}

interface ProductSearchResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}
```

## API Service Layer

- `src/lib/services/productService.ts` - Abstract service with mock/real implementations
- Easy switching between mock and real API via environment config

# Configuration Changes

None required.

# Testing Strategy

## Unit Tests

- Product filtering logic
- Component rendering (ProductCard, ProductSuggestionCarousel)
- AI intent detection

## Integration Tests

- Full chat flow: user input → AI questions → product suggestions
- Carousel interaction and display

## Manual Testing

- Mobile responsiveness
- Various user input scenarios
- Edge cases (no matching products, incomplete preferences)

# Deployment Plan

Standard Next.js deployment process:

1. Build application
2. Run tests
3. Deploy to staging
4. User acceptance testing
5. Production deploy

No database migrations required for MVP.
