---
title: "Feature Implementation Template"
feature: "hien-thi-anh-do-gen-ai-tao-ra"
status: "draft"
---

# Implementation Notes

## Code Structure

- **Types**: Extended `Product` interface with `isAIGenerated`, `aiDescription`, and `imageUrl` fields. Created `AIGeneratedProduct` interface extending `Product`.
- **Data**: Created `lib/data/aiProducts.ts` with sample AI-generated product data using static image paths.
- **Context**: Enhanced `ProductContext` with `isAIMode`, `aiProducts`, and `setAIMode`/`setAIProducts` functions.
- **Components**:
  - Updated `RobotChatbot` to trigger AI mode on user agreement.
  - Created `AIGeneratedProductCard` with AI-specific styling and badge.
  - Modified `ProductSuggestionCarousel` to conditionally render AI products with revert functionality.

## Error Handling

- Added fallback UI for missing images in both regular and AI product cards.
- Type safety ensured with proper interfaces and casting where needed.

## Edge Cases

- Handles empty product arrays for both regular and AI modes.
- Revert button only appears in AI mode.
- Chatbot trigger logic preserved for regular products.
